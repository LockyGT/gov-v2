app.controller('reporteLegislaturaCtrl', function($scope, voteSessionService,reportService, voteSessionTypeService,$timeout, $filter, formulaService) {

	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	$scope.maxSearchDate = new Date();
	$scope.filterInfo = {};
	
	$scope.initiatives       = [];
	$scope.sessions          = [];
	$scope.filter            = {};
	$scope.reporteBar        = null;
	$scope.reportePie        = null;
	$scope.legislaturaReport = null;
	$scope.tabView           = 'cardbodyBar';
	
	
	$scope.getLegislaturaReport = () => {
		console.log("Obtener selecciones: ", $scope.selected);
		
		let dataReport = {
				sessionsId: $scope.selected.sessions.map(f => f.id),
				initiativesId: $scope.selected.initiatives.map(f => f.id)
		}
		if($scope.selected.sessions.length && $scope.selected.initiatives.length){
			reportService.getLegislaturas(dataReport).then(success => {
				$scope.legislaturaReport = JSON.parse(success.data);
				$scope.uniqueSession = $filter('unique')($scope.legislaturaReport.data, 'session');
			}, error => {
				console.log('Error al obtener la información del reporte: ', error)
			});
		} else {
			swal("Error","No ha llenado todos los campos", "error");
		}
	};
	
	$scope.filterInfoLength = (filterSession, filterResult) => {
		
		let fil = $scope.legislaturaReport.data.filter(function(element){
			return (element.session == filterSession && element.result == filterResult)
		});
		return fil? fil.length : 0;
	};
	
	$scope.getTypeSession = () => {
		voteSessionTypeService.get().then(data=>{
			$scope.typeSessions = data;
			console.log('Tipos de sesión obtenidas: ', data);
		},error=>{
			console.log('Error al obtener el tipo de sesión: ', error);
		});
	};
	
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"dateStart": selected.startDate,
			"dateEnd": selected.endDate,
			"status": 0
		};
		if(($scope.selected.startDate <= $scope.selected.endDate) && ($scope.selected.endDate <= $scope.maxSearchDate)){
			$scope.getTypeSession();
			$scope.getResultsInitiatives();
			
			voteSessionService.getInDateBetweenEndBetweenAndStatus(sendData).then(data => {
				$scope.sessions = data;
				$scope.initiatives = [];
				$scope.filter = {};
				$scope.filterInfo = {};
			}, error => {
				console.log('Error al obtener las sesiones: ', error)
				swal("Error","Ha ocurrido un error", "error");
			});
		} else {
			swal("Error","No ha llenado todos los campos", "error");
		}

	};
	
	$scope.getInitiatives = () => {
		$scope.initiatives = [];
		$scope.filter.initiatives = null;
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
			});
		}
	};
	
	$scope.getFormula = () => {
		formulaService.get().then(data => {
			$scope.formulas = data;
			console.log('Datos obtenidos: ', data);
		}, error => {
			console.log('Ha ocurrio un error al cargar los archivos: ', data);
		});
	};
	
	$scope.getResultsInitiatives = () => {
		$scope.results = [{name:'Aprobado', color:'success'}, {name:'No aprobado', color:'danger'}];

	};
	
	$scope.checkAllOptions = (array, e) => {
		
		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		$scope.updateSelectedTypeSession();
		$scope.updateSelectedSessions();
		$scope.updateSelectedInitiatives();
		$scope.updateSelectedResults();
	};
	
	// Filters
	$scope.updateSelectedTypeSession = () => {
		$timeout( () => {
			$scope.selected.typeSessions = $filter('filter')($scope.typeSessions, {checked: true});
			$scope.filterInfo.typeSessions = $scope.selected.typeSessions.map(f => f.name); 
			$scope.fSessions = $filter('filter')($scope.sessions, $scope.filterTypeSession);
		}, 500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout ( () => {
			$scope.selected.sessions = $filter('filter')($scope.fSessions, {checked: true});
			$scope.filterInfo.sessions = $scope.selected.sessions.map(f => f.nombre);
			$scope.getInitiatives();
		}, 500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			if($scope.fInitiatives){
				$scope.selected.initiatives = $filter('filter')($scope.fInitiatives, {checked: true});
				$scope.filterInfo.initiatives = $scope.selected.initiatives.map(f => f.name);
			}
			
		}, 500);
	};
	
	$scope.updateSelectedResults = () => {
		$timeout( () => {
			$scope.selected.results = $filter('filter')($scope.results, {checked: true});		
			$scope.filterInfo.results = $scope.selected.results.map(f => f.name);
			$scope.fInitiatives = $filter('filter')($scope.initiatives, $scope.filterResult);
		}, 500);
	};
	
	$scope.filterTypeSession = e => {
		let res = $scope.selected.typeSessions.find(function(element){
			return element.id == e.type.id;
		});
		
		if(res){
			return true;
		}
		return false;
	};
	
	$scope.filterResult = e => {
		let res = $scope.selected.results.find(function (element){
			return element.name == e.result.resultName;
		});
		if(res){
			return true;
		}
		return false;
	};
	
	$scope.printTable = () => {
		$scope.legislaturaReport.title = 'Legislatura - periodo';
		$scope.legislaturaReport.headRows = [{date:"Fecha", typeSession:"Tipo de sesión", session:"Sesión", initiative:"Iniciativa", result:"Resultado"}];
		$scope.legislaturaReport.footRows = [{date:'', typeSession:'', session:'',initiative:'', result:''}];
		$scope.legislaturaReport.bodyRows = bodyRows($scope.legislaturaReport.data);
		
		reportService.printPdf($scope.legislaturaReport).then(doc => {
			doc.setProperties({
				title: "Reporte: Legislatura",
				subject: 'Reporte pdf de las legislaturas'
			});
			doc.save('Reporte_legislaturas.pdf');
		}, errorDoc => {
			console.log('Error al obtener el reporte: ', errorDoc);
		});
	};
	
	$scope.changeTabView = tabIndex => {
		$scope.tabView = tabIndex;
	};
	
	$scope.toReturn = () => {
		$scope.reporteBar =  null;
		$scope.reportePie = null;
		$scope.sessionSelected = null;
	};
	
	$scope.setFilterBySession = session => {
		$scope.sessionSelected = session;
		$scope.sessionReportGraph = $filter('filter')($scope.legislaturaReport.data, {"session": session});
		$scope.createGraph();
	}
	
	$scope.startReportBar = () => {
		$scope.reporteBar = {
				totalVotos    : 0,
				labels        : [],
				series        : [],
				data          : [],
				colors        : [],
				partnersVotes : [],
				opions        : {
					scales: {
						yAxes : [{
							ticks : {
								beginAtZero  : true,
								userCallback : function(label, index, labels){
									if(Math.floor(label) === label){
										return label;
									}
								}
							}
						}]
					}
				}
		};
	};
	
	$scope.startReportPie = () => {
		$scope.reportePie = {
			totalVotos    : 0,
			labels        : [],
			series        : [],
			data          : [],
			colors        : [],
			partnersVotes : [],
			options       :{
				scales : {
					yAxes : [{
						ticks : {
							min      : 0,
							max      : 100,
							callback : function(value){ return value+'%'}
						},
						scaleLabel : {
							display     : true,
							labelString : 'Porcentage %'
						}
					}]
				}
			}
		};
	};
	
	$scope.createGraph = () => {
		
		if(!$scope.sessionReportGraph){
			$scope.sessionReportGraph = $scope.legislaturaReport.data;
		}
		
		$scope.startReportBar();
		$scope.startReportPie();
		
		let max         = 0;
		let voteTypeWin = {};
		
		$scope.optionPercent = [];
		angular.forEach($scope.selected.results, function(val, key){
			
			$scope.reporteBar.labels.push(val.name);
			$scope.reportePie.labels.push(val.name);
			
			$scope.reporteBar.series.push('Resultado votación');
			$scope.reportePie.series.push('Resultado votación');
			
			let percentTmp = val;
			let find = $scope.sessionReportGraph.filter(rr => rr.result === val.name);
			
			$scope.reporteBar.data.push(find.length);
			
			if(find.length > 0) {
				let percentage = (find.length / $scope.sessionReportGraph.length) * 100;
				$scope.reportePie.data.push(percentage);
				percentTmp.percentage = percentage;
				$scope.optionPercent.push(percentTmp);
			} else {
				$scope.reportePie.data.push(0);
				percentTmp.percentage = 0;
				$scope.optionPercent.push(percentTmp);
			}
			if($scope.selected.sessions.length === 1){
				$scope.optionPercent.push(0);
			}
						
			$scope.reportePie.colors.push(hexToRgbA((val.color == "success")? "#00b300": 
								(val.color == "danger")? "#cc0000": '#000000'));
			$scope.reporteBar.colors.push(hexToRgbA((val.color == "success")? "#00b300": 
				(val.color == "danger")? "#cc0000": '#000000'));
				
			if(val.totalOption > max) {
				max = val.totalOption;
				voteTypeWin = val;
			}
		});
	};
	
	$scope.printImg = () => {
		let divCardOrg = document.getElementById($scope.tabView);
		console.log('Elemento seleccionado: ', divCardOrg);
		html2canvas(divCardOrg).then(function(canvas){
			let win1 = window.open("","Print", "width=800, height=800");
			
			let windowContent = '<!DOCTYPE html>';
			windowContent += '<html>';
			windowContent += '<head>';
			windowContent += '</head>';
			windowContent += '<body>';
			windowContent += '<h1 class="my-4">Reporte Legislaturas</h1>';
			windowContent += '<img src="'
					+ canvas.toDataURL() + '"/>';
			windowContent += '</body>';
			windowContent += '</html>';
			
			win1.document.write(windowContent);
			
			let is_chrome = Boolean(Window.chrome)
			if(is_chrome){
				win1.onload = function() {
					console.log('print');
					win1.print();
					$timeout( () => {
						win1.close();
					},1000);
				}
			}
		});
	};
	
	function bodyRows (arrayJson) {
		let body = [], date;
		
		arrayJson.forEach(function (json){
			date = new Date(json.date)
			body.push({date:date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear(), 
				typeSession:json.typeSession, session:json.session,initiative:json.initiative, result:json.result});
		});
		return body;
	}
	
	function hexToRgbA(hex){	
	    var c;
	    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
	        c= hex.substring(1).split('');
	        if(c.length== 3){
	            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
	        }
	        c= '0x'+c.join('');
	        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
	    }
	    throw new Error('Bad Hex');
	}
	
	const initController = () => {
		$scope.getTypeSession();
		$scope.getResultsInitiatives();
		$scope.getFormula();
	};

	angular.element(document).ready(function () {
		initController();
	});

})