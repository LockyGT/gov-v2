app.controller('initiativePeriodReportCtrl', function($scope, reportService,voteSessionService,voteSessionTypeService, $timeout, $filter){
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	
	$scope.maxSearchDate    = new Date();
	$scope.initiativeReport = [];
	$scope.initiatives      = [];
	$scope.sessions         = [];
	$scope.reporteBar       = null;
	$scope.reportePie       = null;
	$scope.filterInfo       = {};
	
	$scope.getResultsReport = () => {
		
		console.log('Informacion obtenida: ', $scope.selected);
		let dataReport = {
			sessionsId: $scope.selected.sessions.map(f => f.id),
			initiativesId: $scope.selected.initiatives.map(f => f.id)
		};
		
		if($scope.selected.sessions.length && $scope.selected.initiatives.length){
			reportService.getInitiative(dataReport).then(success => {
				$scope.initiativeReport = JSON.parse(success.data);
				$scope.uniqueSession = $filter('unique')($scope.initiativeReport.data,'session')
			}, error => {
				console.log('Error al obtener la información: ', error);
			});
		} else {
			swal("Error","No ha llenado todos los campos", "error");
		}
	};
	
	$scope.getTypeSessions = () => {
		voteSessionTypeService.get().then(data=>{
			$scope.typeSessions = data;
			console.log('Tipos de sesión obtenidas: ', data);
		}, error=>{
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
			voteSessionService.getInDateBetweenEndBetweenAndStatus(sendData).then(data=>{
				$scope.sessions = data;
				$scope.initiatives = [];
				console.log('Error en los datos: ', data);
				
			}, error=>{
				console.log('Error al obtener las sesiones: ', error);
			});
		} else {
			console.log('Fechas no validadas');
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
	
	$scope.getResultsInitiatives = () => {
		$scope.results = [{name:'Aprobado', color:'success'}, {name:'No aprobado', color:'danger'}];
	};
	
	$scope.checkAllOptions = (array, e) => {
		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		
		$scope.updateSelectedTypeSessions();
		$scope.updateSelectedSessions();
		$scope.updateSelectedInitiatives();
		$scope.updateSelectedResults();
	};
	
	$scope.updateSelectedTypeSessions = () => {
		
		$timeout( () => {
			$scope.selected.typeSessions = $filter('filter')($scope.typeSessions, {checked: true});
			$scope.filterInfo.typeSessions = $scope.selected.typeSessions.map(f => f.name); 
			$scope.fSessions = $filter('filter')($scope.sessions, $scope.filterTypeSession);
		},500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout( () => {
			$scope.selected.sessions = $filter('filter')($scope.fSessions, {checked: true});
			$scope.filterInfo.sessions = $scope.selected.sessions.map(f => f.nombre);
			$scope.getInitiatives();
		});
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			if($scope.selected.initiatives){
				$scope.selected.initiatives = $filter('filter')($scope.fInitiatives, {checked: true});
				$scope.filterInfo.initiatives = $scope.selected.initiatives.map(f => f.name);
			}
		},500);
	};
	
	$scope.updateSelectedResults = () => {
		$timeout( () => {
			$scope.selected.results = $filter('filter')($scope.results, {checked: true});
			$scope.filterInfo.results = $scope.selected.results.map(f => f.name);
			$scope.fInitiatives = $filter('filter')($scope.initiatives, $scope.filterResult);
		},500);
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
	
	$scope.filterInfoLength = (filterSession) => {
		
		let fil = $scope.initiativeReport.data.filter(function(element){
			return (element.session == filterSession);
		});
		return fil? fil.length : 0;
	};
	
	$scope.printTable = () => {
		$scope.initiativeReport.title = 'Resultados - Periodos';
		$scope.initiativeReport.headRows = [{date:"Fecha", typeSession:"Tipo de sesión", session:"sesión", 
			initiative:"Iniciativa", timeVote:"Tiempo para votar", aFavor:"A favor", against: "En contra",
			abstention:"Abstención", notVote: "No votó", present:"Presentes", missing:"Ausentes", 
			result: "Resultado"}];
		
		$scope.initiativeReport.footRows = [{date:"", typeSession:"", session:"", initiative:"", timeVote:"",
			aFavor:"", against: "", abstention:"", notVote: "", present:"", missing:"", result: ""}];
		
		$scope.initiativeReport.bodyRows = bodyRows($scope.initiativeReport.data);
		
		reportService.printPdf($scope.initiativeReport).then(doc=>{
			doc.setProperties({
				title:"Reporte: Resultados - Periodos",
				subject:'Reporte pdf de los Resultados - Periodos'
			});
			doc.save('Reporte_resultados-periodos.pdf');
		}, errorDoc=>{
			console.log('Error al obtener el reporte');
		});
	};
	
	$scope.addTotalVoteOptions = () => {
		angular.forEach($scope.uniqueSession, function(valvo, keyvo){
			valvo.voteOption = 0;
		});
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
		$scope.addTotalVoteOptions();
		let max         = 0;
		let voteTypeWin = {};
		
		$scope.optionPercent = [];
		
		angular.forEach($scope.uniqueSession, function(val, key){
			$scope.reporteBar.labels.push(val.session);
			$scope.reportePie.labels.push(val.session);
			
			$scope.reporteBar.series.push('Resultado votación');
			$scope.reportePie.series.push('Resultado votación');
			
			let percentTmp = val;
			let find = $scope.initiativeReport.data.filter(rr => rr.session === val.session);
			
			$scope.reporteBar.data.push(find.length);
			
			if(find.length > 0) {
				let percentage = (find.length / $scope.initiativeReport.data.length) * 100;
				$scope.reportePie.data.push(percentage);
				percentTmp.percentage = percentage;
				$scope.optionPercent.push(percentTmp);
			} else {
				$scope.reportePie.data.push(0);
				percentTmp.percentage = 0;
				$scope.optionPercent.push(percentTmp);
			}
			
//			$scope.reportePie.colors.push(
//					hexToRgbA((val.color == 'success') ? '#00b300':
//						(val.color == 'danger')? '#cc0000':'#000000')
//				);
//				
//				$scope.reporteBar.colors.push(
//					hexToRgbA((val.color == 'success') ? '#00b300':
//						(val.color == 'danger')? '#cc0000': '#000000')
//				);
				
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
	
	function bodyRows (arrayJson) {
		let body = [], date;
		
		arrayJson.forEach( function (json) {
			date = new Date(json.date);
			body.push({date:date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear(), 
				typeSession:json.typeSession, session:json.session, initiative:json.initiative,
				timeVote:json.timeVote,aFavor:json.aFavor, against: json.against, abstention:json.abstention,
				notVote: json.notVote, present:json.present, missing:json.missing, result: json.result})
		});
		return body;
	}
	
	const initController = () => {
		$scope.getTypeSessions();
		$scope.getResultsInitiatives();
	};
	
	angular.element(document).ready(function(){
		initController();
	});
}); 