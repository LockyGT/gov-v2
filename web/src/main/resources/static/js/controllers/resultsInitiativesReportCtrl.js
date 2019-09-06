app.controller('resultsInitiativesReportCtrl', function($scope, voteSessionService,reportService, voteSessionTypeService,$timeout, $filter, formulaService){
	
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	$scope.filterInfo = {};
	
	$scope.maxSearchDate = new Date();
	$scope.colorsGraph = ["#6132C2","#0AA4C9","#00B300","#C9AE0A","#C2591F","#0A78C9"];
	
	$scope.resultsReport = [];
	$scope.initiatives   = [];
	$scope.sessions      = [];
	$scope.filter        = {};
	$scope.reporteBar    = null;
	$scope.reportePie    = null;
	$scope.tabView       = 'cardbodyBar';
	
	$scope.getResultsReport = () => {
		console.log('Obtener selcciones: ', $scope.selected);
		
		dataReport = {
				sessionsId: $scope.selected.sessions.map(f=> f.id),
				initiativesId: $scope.selected.initiatives.map(f=> f.id)
		};
		
		if($scope.selected.sessions.length && $scope.selected.initiatives.length){
			reportService.getResultInitiative(dataReport).then(success => {
				$scope.resultsReport = JSON.parse(success.data);
				$scope.uniqueSession = $filter('unique')($scope.resultsReport.data, 'sessionId');
			}, error => {
				$scope.resultsReport = [];
				console.log('Error al obtener la informacion: ', error);
			});
		}else {
			swal("Error","No ha llenado todos los campos", "error");
		}
	};
	
	$scope.filterBySession = sessionId => {
		let fil = $scope.resultsReport.data.filter(function(element){
			return element.sessionId == sessionId;
		});
		
		return $filter('unique')(fil, 'formulaId');
	};
	
	$scope.filterInfoLength = (sessionId, formulaId) => {
		let fil = $scope.resultsReport.data.filter(function(element){
			return (element.sessionId == sessionId && element.formulaId == formulaId);
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
//		let sendData = {
//			"dateStart": selected.startDate,
//			"dateEnd": selected.endDate,
//			"status": 0
//		};
		
		let startDate = new Date($scope.selected.startDate);
		let dateEnd = new Date($scope.selected.endDate);
		
		let sendData = new Object(); 
		sendData['status']= 0;
		sendData['dateStart'] = startDate;
		sendData['dateEnd'] = dateEnd;
		
		if (($scope.selected.startDate <= $scope.selected.endDate) && ($scope.selected.endDate <= $scope.maxSearchDate)) {
			voteSessionService.getInDateBetweenEndBetweenAndStatus(sendData).then(data => {
				$scope.sessions = data;
				console.log("Sesiones obtenidas", $scope.sessions);
				$scope.initiatives = [];
				$scope.filter = {};
				console.log('Sesiones optenidos: ', $scope.sessions);
			}, error=>{
				console.log('Error al obtener las sesiones: ', error);
			});
			
		} else {
			console.log('fechas no coincidentes');
		}
	};
	
	$scope.getInitiatives = () => {
		$scope.initiatives = [];
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
			});
		}
	};
	
	$scope.getFormula = () => {
		formulaService.get().then(data => {
			$scope.formulas = data;
			console.log('Informacion: ', $scope.formulas);
			$scope.assingColor();
		}, error => {
			console.log('Ha ocurrio un error al cargar los archivos: ', data);
		});
	};
	
	$scope.getResultsInitiatives = () => {
		console.log('Informacion de resultados: ')
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
		console.log('Informacion de la sesion: ')
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
		$scope.resultsReport.title = 'Resultados - Reportes Estadísticos';
		$scope.resultsReport.headRows = [{date:'Fecha', typeSessions:'Tipo de sesión',session:'Sesión',
			initiative:'Iniciativa', present:'Presentes', formula:'Formula de cálculo', method: 'Método de redondeo',
			result:'Resultado'}];
		$scope.resultsReport.footRows = [{date:'', typeSessions:'',session:'', initiative:'', present:'',
			formula:'', method: '',result:''}];
		$scope.resultsReport.bodyRows = bodyRows($scope.resultsReport.data);
		
		reportService.printPdf($scope.resultsReport).then(doc=>{
			doc.setProperties({
				title: 'Reporte: Legislador',
				subject: 'Reporte pdf de los legisladores'
			});
			doc.save('Reporte_resultados-periodos.pdf');
		}, errorDoc=>{
			console.log('Error al obtener el reporte: ', errorDoc);
		});
	};
	
	function bodyRows (arrayJson){
		let body = [], date;
		
		arrayJson.forEach(function (json){
			date = new Date(json.date)
			body.push({date:date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear(), 
				typeSessions:json.typeSession,session:json.session, initiative:json.initiative, present:json.present,
				formula:json.formula, method: json.method,result:json.result});
		});
		return body;
	}
	
	$scope.changeTabView = tabIndex => {
		$scope.tabView = tabIndex;
	};
	
	$scope.toReturnBar = () => {
		$scope.reporteBar =  null;
		$scope.reportePie = null;
	};
	
	$scope.setSessionReportGraph = sessionId => {
		$scope.sessionReportGraph = $filter('filter')($scope.resultsReport.data,{"sessionId": sessionId});
		$scope.createGraph();
	};
	
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
			$scope.sessionReportGraph = $scope.resultsReport.data;
		}
		
		$scope.startReportBar();
		$scope.startReportPie();
		
		let max         = 0;
		let voteTypeWin = {};
		
		$scope.optionPercent = [];
		let ic = 0;
		$scope.uniqueFormulas = $filter('unique')($scope.sessionReportGraph, 'formulaId');
		angular.forEach($scope.uniqueFormulas, function(val, key){
			$scope.reporteBar.labels.push('fórmula - '+(ic+1));
			$scope.reportePie.labels.push('fórmula - '+(ic+1));
			
			console.log('Informacion de la formula: id', val.formulaId+", nombre",val.formula);
			
			$scope.reporteBar.series.push('Resultado votación');
			$scope.reportePie.series.push('Resultado votación');
			
			let percentTmp = val;
			let find = $scope.sessionReportGraph.filter(rr => rr.formulaId === val.formulaId);
			
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
			
			$scope.reportePie.colors.push(hexToRgbA($scope.findColor(val.formulaId)));
			$scope.reporteBar.colors.push($scope.findColor(val.formulaId));
				
			if(val.totalOption > max) {
				max = val.totalOption;
				voteTypeWin = val;
			}
			ic++;
		});
	};
	
	$scope.changeTabView = tabIndex => {
		$scope.tabView = tabIndex;
	};
	
	$scope.toReturn = () => {
		$scope.reporteBar =  null;
		$scope.reportePie = null;
	};
	
	$scope.printImg = () => {
		let divCardOrg = document.getElementById($scope.tabView);
		
		html2canvas(divCardOrg).then(function(canvas){
			let win1 = window.open("","Print", "width=800, height=800");
			
			let windowContent = '<!DOCTYPE html>';
			windowContent += '<html>';
			windowContent += '<head>';
			windowContent += '</head>';
			windowContent += '<body>';
			windowContent += '<h1 class="my-4">Reportes estadísticos - Resultados</h1>';
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
	
	$scope.assingColor = () => {
		angular.forEach($scope.formulas, function(val, key){
			$scope.formulas[key].color = $scope.colorsGraph[key];
		});
	};
	
	$scope.findColor = formulaId => {
		let fil = $scope.formulas.find(function(element){
			return element.id == formulaId;
		});
		return fil.color;
	};
	
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
	
	$scope.toReturn = () => {
		window.history.back();
	};
	
	const initController = () => {
		$scope.getTypeSession();
		$scope.getResultsInitiatives();
		$scope.getFormula();
		$scope.getSessionsBetweenDates();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});