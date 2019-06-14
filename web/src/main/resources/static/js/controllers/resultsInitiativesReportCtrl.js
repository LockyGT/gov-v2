app.controller('resultsInitiativesReportCtrl', function($scope, voteSessionService,reportService, voteSessionTypeService,$timeout, $filter){
	
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	
	$scope.resultsReport = [];
	$scope.initiatives   = [];
	$scope.sessions      = [];
	$scope.filter        = {};
	$scope.reporteBar    = null;
	$scope.reportePie    = null;
	
	$scope.getResultsReport = () => {
		console.log('Obtener selcciones: ', $scope.selected);
		
		dataReport = {
				sessionsId: $scope.selected.sessions.map(f=> f.id),
				initiativesId: $scope.selected.initiatives.map(f=> f.id)
		};

		reportService.getResultInitiative(dataReport).then(success=>{
			$scope.resultsReport = JSON.parse(success.data);
			console.log('Informacion del reporte: ', $scope.resultsReport);
		}, error=>{
			console.log('Error al obtener la informacion: ', error);
		});
	};
	
	$scope.getTypeSession = () => {
		voteSessionTypeService.get().then(data=>{
			$scope.typeSessions = data;
			console.log('Tipos de sesión obtenidas: ', data);
		},error=>{
			console.log('Error al obtener el tipo de sesión: ', error);
		});
	}
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"fecha": selected.startDate,
			"fechaFin": selected.endDate
		};
		voteSessionService.getInDateBetweenEndBetween(sendData).then(data=>{
			$scope.sessions = data;
			$scope.initiatives = [];
		}, error=>{
			console.log('Error al obtener las sesiones: ', error)
		});
	};
	
	$scope.getInitiatives = () => {
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
			});
		}
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
		
		angular.forEach($scope.results, function(val, key){
			$scope.reporteBar.labels.push(val.name);
			$scope.reportePie.labels.push(val.name);
			
			$scope.reporteBar.series.push('Resultado votación');
			$scope.reportePie.series.push('Resultado votación');
			
			let percentTmp = val;
			let find = $scope.resultsReport.data.filter(rr => rr.result === val.name);
			
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
			
			$scope.reportePie.colors.push(
					hexToRgbA((val.color == 'success') ? '#00b300':
						(val.votecolor == 'danger')? '#cc0000':'#000000')
				);
				
				$scope.reporteBar.colors.push(
					hexToRgbA((val.color == 'success') ? '#00b300':
						(val.color == 'danger')? '#cc0000': '#000000')
				);
				
			if(val.totalOption > max) {
				max = val.totalOption;
				voteTypeWin = val;
			}
			
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
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});