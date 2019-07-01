app.controller('resultsInitiativesReportCtrl', function($scope, voteSessionService,reportService, voteSessionTypeService,$timeout, $filter, formulaService){
	
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	
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
		
		if(($scope.selected.startDate <= $scope.selected.endDate) && ($scope.selected.endDate <= $scope.maxSearchDate)){
			reportService.getResultInitiative(dataReport).then(success=>{
				$scope.resultsReport = JSON.parse(success.data);
				console.log('Informacion del reporte: ', $scope.resultsReport);
			}, error=>{
				console.log('Error al obtener la informacion: ', error);
			});
		}
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
		voteSessionService.getInDateBetweenEndBetweenAndStatus(sendData).then(data=>{
			$scope.sessions = data;
			$scope.initiatives = [];
			$scope.filter = {};
		}, error=>{
			console.log('Error al obtener las sesiones: ', error)
		});
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
			console.log('Datos obtenidos: ', data);
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
		}, 500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout ( () => {
			$scope.selected.sessions = $filter('filter')($scope.sessions, {checked: true});
			$scope.getInitiatives();
		}, 500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			$scope.selected.initiatives = $filter('filter')($scope.initiatives, {checked: true});
		}, 500);
	};
	
	$scope.updateSelectedResults = () => {
		$timeout( () => {
			$scope.selected.results = $filter('filter')($scope.results, {checked: true});			
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
		$scope.resultsReport.title = 'Resultados - Periodos';
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
	
	$scope.toReturn = () => {
		$scope.reporteBar =  null;
		$scope.reportePie = null;
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
		$scope.startReportBar();
		$scope.startReportPie();
		
		let max         = 0;
		let voteTypeWin = {};
		
		$scope.optionPercent = [];
		let ic = 0;
		angular.forEach($scope.formulas, function(val, key){
			$scope.reporteBar.labels.push('fórmula - '+(ic+1));
			$scope.reportePie.labels.push('fórmula - '+(ic+1));
			
			$scope.reporteBar.series.push('Resultado votación');
			$scope.reportePie.series.push('Resultado votación');
			
			let percentTmp = val;
			let find = $scope.resultsReport.data.filter(rr => rr.formulaId === val.id);
			
			$scope.reporteBar.data.push(find.length);
			
			if(find.length > 0) {
				let percentage = ($scope.resultsReport.data.length / find.length) * 100;
				$scope.reportePie.data.push(percentage);
				percentTmp.percentage = percentage;
				$scope.optionPercent.push(percentTmp);
			} else {
				$scope.reportePie.data.push(0);
				percentTmp.percentage = 0;
				$scope.optionPercent.push(percentTmp);
			}
			
			$scope.reportePie.colors.push(hexToRgbA($scope.colorsGraph[ic]));
			$scope.reporteBar.colors.push($scope.colorsGraph[ic]);
				
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
			windowContent += '<h1 class="my-4">Reporte legisladores</h1>';
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
});