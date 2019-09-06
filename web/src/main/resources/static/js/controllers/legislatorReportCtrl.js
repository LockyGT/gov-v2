app.controller('legislatorReportCtrl', function($scope, voteSessionService,$http, voteService, partnerService, factory, $filter, $timeout, reportService){
	
	$scope.selected = {
			startDate : new Date(),
			endDate: new Date(),
			parties: [],
			legislators: [],
			sessions: [],
			initiatives:[]
	};
	$scope.maxSearchDate     = new Date();
	$scope.legislatorsReport = [];
	$scope.initiatives       = [];
	$scope.sessions          = [];
	$scope.filter            = {};
	$scope.reporteBar        = null;
	$scope.reportePie        = null;
	$scope.voteOptions       = [];
	$scope.tabView           = 'cardbodyBar';
	$scope.filterInfo        = {};
	
	$scope.getReportLegislator = () => {
		if($scope.selected.legislators.length && $scope.selected.initiatives.length
				&& $scope.selected.voteOptions.length){
			console.log('Informacion seleccionada: ', $scope.selected.legislators);
			let dataReport = {
					partnersId: $scope.selected.legislators.map(f=> f.id),
					initiativesId: $scope.selected.initiatives.map(f=> f.id),
					votesId: $scope.selected.voteOptions.map(f => f.id)
			};
			
			console.log('Informacion enviada: ', dataReport)
			reportService.getLegislatorReport(dataReport).then( success => {
				$scope.legislatorsReport = JSON.parse(success.data);
				console.log('Informacion del reporte: ', $scope.legislatorsReport);
			}, error => {
				console.log('Error al obtener el reporte del legislador: ', error);
			});
		} else {
			swal("Error","No ha llenado todos los campos", "error");
		}
	};
	
	$scope.getSessionsBetweenDates = (selected) => {
// 			let sendData = {
//				"dateStart":selected.startDate,
//				"dateEnd":selected.endDate,
//				"status": 0
//			};

		let startDate = new Date($scope.selected.startDate);
		let dateEnd = new Date($scope.selected.endDate);
		
		let sendData = new Object(); 
		sendData['status']= 0;
		sendData['dateStart'] = startDate;
		sendData['dateEnd'] = dateEnd;
		
		console.log(sendData);
		if(($scope.selected.startDate <= $scope.selected.endDate) && ($scope.selected.endDate <= $scope.maxSearchDate)){
			voteSessionService.getInDateBetweenEndBetweenAndStatus(sendData).then( data => {

				$scope.sessions = data;
				console.log("obtener sesiones",$scope.sessions);
				$scope.initiatives = [];
			}, error => {
				console.log('Error al obtener las sesiones: ', error);
			});
		} else {
			console.log('Fechas erroneas')
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
	
	$scope.getPoliticalParties = () =>{	
		factory.get('politicalparty').then(function mySuccess(data) {			
			$scope.politicalParties = data;
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	$scope.getLegislator = () => {
		let sendData = {
				"status": 1,
				"tipo": 1
		};
		partnerService.getByStatusAndTipoAndPartie(sendData).then( data => {
			$scope.legislators = data;
			console.log('Legisladores obtenidos: ', data);
		}, error => {
			$console.log("error al obtener los legisladores: ",error);
		});
	};
	
	$scope.getVotes = () => {

		$scope.sessions.forEach(function(session){
			session.iniciativas.forEach(function(initiative){
				voteService.getByInitiativeId(initiative.id).then(votes => {
					initiative.votes = votes;
				}, error=>{
					console.log('Error al encontrar la iniciativa: ', error);
				});
			});
		});
	};
	
	$scope.getVoteOptions = () => {
		$http({
			method: "GET",
			url:"/voteoption"
		}).then(response => {
			$scope.voteOptions = response.data;
			
		}, error => {
			console.error('Error al obtener opciones de votaciones: ', error.statusText);
		});
	};
	
	$scope.checkAllOptions = (array, e) => {
		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		
		$scope.updateSelectedParties();
		$scope.updateSelectedLegislators();
		$scope.updateSelectedSessions();
		$scope.updateSelectedInitiatives();
		$scope.updateSelectedVoteOptions();
	};
	
	$scope.updateSelectedParties = () => {
		$timeout( () => {
			$scope.selected.parties   = $filter('filter')($scope.politicalParties,{checked: true});
			$scope.filterInfo.parties = $scope.selected.parties.map(f => f.acronym);
			$scope.fLegislators = $filter('filter')($scope.legislators, $scope.filterLegislator);
		
//			$scope.selected.legislators = [];
//			$scope.filterInfo.legislators = null;
			$scope.updateSelectedLegislators();
			console.log('Informacion seleccionada: ', $scope.fLegislators);
		},500);
		
	};
	
	$scope.updateSelectedLegislators = () => {
		$timeout( () => {
			if($scope.fLegislators){
				$scope.selected.legislators = $filter('filter')($scope.fLegislators,{checked: true});
				$scope.filterInfo.legislators = $scope.selected.legislators.map(f => f.name+" "+f.apPaterno+" "+f.apMaterno);
			}
		},500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout( () => {
			$scope.selected.sessions = $filter('filter')($scope.sessions,{checked: true});
			$scope.filterInfo.sessions = $scope.selected.sessions.map(f => f.nombre);
			$scope.getInitiatives();
		},500);
	};
	
	$scope.updateSelectedVoteOptions = () => {
		$timeout( () => {
			$scope.selected.voteOptions = $filter('filter')($scope.voteOptions,{checked: true});
			$scope.filterInfo.voteOptions = $scope.selected.voteOptions.map(f => f.name);
		},500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			if($scope.selected.initiatives){
				$scope.selected.initiatives = $filter('filter')($scope.initiatives,{checked: true});
				$scope.filterInfo.initiatives = $scope.selected.initiatives.map(f => f.name);
			}
			
		},500);
	};
	
	$scope.setFilterByPartner = idPartner => {
		
		$scope.legislatorsReportGraph = $filter('filter')($scope.legislatorsReport.data, {"idPartner": idPartner});
		$scope.createGraph();
		$scope.filterByLegislator = true;
	};
	
	$scope.toReturnGraph = () => {
		$scope.legislatorsReportGraph = null;
		$scope.createGraph();
		$scope.filterByLegislator = false;
	};

//	Inicia la impresion del reporte
	$scope.printTable = () => {
		$scope.legislatorsReport.title ="Legisladores";
		$scope.legislatorsReport.headRows = [{politicalparty: "Partido", legislator: "Legislador",
			district:"Distrito", commision: "Comisión", date: "Fecha", 
			vote:"Voto", initiatives: "Iniciativas",time:"Tiempo", result: "Resultado"}];
		
		$scope.legislatorsReport.footRows = [{politicalparty: "", legislator: "", district:"", 
			commision: "", date: "", vote:"", initiatives: "",time:"",
			result: ""}]
		
		$scope.legislatorsReport.bodyRows = bodyRows($scope.legislatorsReport.data);
		
		reportService.printPdf($scope.legislatorsReport).then(doc=>{

			doc.setProperties({
				title: 'Reporte: Legislador',
				subject: 'Reporte pdf de los legisladores'
			});
			doc.save('Reporte_legisladores.pdf');
		},errorDoc=>{
			console.log("Error al obtener el reporte: ", errorDoc);
		});

	};

	
	// Reestructura las columnas en la base de datos
	function bodyRows (arrayJson) {
		let body = [], date, sTime, eTime;
		
		arrayJson.forEach(function(json) {
			date = new Date(json.date);
			sTime = new Date(json.startTime);
			eTime = new Date(json.endTime);
			 
			body.push({politicalparty: json.politicalPartie, legislator: json.namePartner, 
				district:json.district, commision: json.commission, date:date.getDate() + '/' +(date.getMonth()+1)+'/'+ date.getFullYear(),
				vote: json.vote,initiatives: json.initiative, 
				time: sTime.getHours()+":"+sTime.getMinutes() +'-'+eTime.getHours()+":"+eTime.getMinutes(),
				result: json.result});
		});
		return body;
	}
	
	$scope.filterLegislator = e => {
		let r = $scope.selected.parties.find(function(element){
			return element.id == e.partido.id;
		});
		if(r){
			return true;
		}
		return false;

	};
	
	$scope.filterVoteOptions = e => {
		let r = $scope.selected.voteOptions.find(function(element){
			return element.name.toLowerCase()== e.result.resultName.toLowerCase();
		});
		if(r){
			return true;
		}
		return false;

	};
	
	$scope.addTotalVoteOptions = () => {
		angular.forEach($scope.voteOptions, function(valvo, keyvo){
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
				options       : {
					scales : {
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
				options       : {
					scales : {
						yAxes : [{
							ticks : {
								min      : 0,
								max      : 100,
								callback : function(value){return value+'%'}
							},
							scaleLabel : {
								display     : true,
								labelString : "Porcentaje %"
							}
						}]
					}
				}
		};
	};
	
	$scope.createGraph = () => {
		
		if(!$scope.legislatorsReportGraph){
			$scope.legislatorsReportGraph = $scope.legislatorsReport.data;
		}
		
		$scope.startReportBar();
		$scope.startReportPie();
		
		$scope.addTotalVoteOptions();
		let max = 0 ;
		let voteTypeWin = {}; 
		$scope.optionPercent = [];
		angular.forEach($scope.voteOptions, function(val, key){
			$scope.reporteBar.labels.push(val.name);
			$scope.reportePie.labels.push(val.name);
			$scope.reporteBar.series.push('Resultado Votación');
			$scope.reportePie.series.push('Resultado Votación');
			let percentTmp = val;
			let find = $scope.legislatorsReportGraph.filter(le => le.vote === val.name);
			
			$scope.reporteBar.data.push(find.length);
			
			if(find.length>0){
				
				let percentage = (find.length / $scope.legislatorsReportGraph.length)  * 100;
				$scope.reportePie.data.push(percentage);
				percentTmp.percentage = percentage;
				$scope.optionPercent.push(percentTmp);
			} else {
				$scope.reportePie.data.push(0);
				percentTmp.percentage = 0;
				$scope.optionPercent.push(percentTmp);
			}
			
			$scope.reportePie.colors.push(
				hexToRgbA((val.voteColor == 'success') ? '#00b300':
					(val.voteColor == 'danger')? '#cc0000': 
						(val.voteColor=='warning')?'#ffbf00':'#000000')
			);
			
			$scope.reporteBar.colors.push(
				hexToRgbA((val.voteColor == 'success') ? '#00b300':
					(val.voteColor == 'danger')? '#cc0000': 
						(val.voteColor=='warning')?'#ffbf00':'#000000')
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
	
	$scope.toReturnBar = () => {
		$scope.reporteBar = null;
		$scope.reportePie = null;
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
			windowContent += '<h1 class="my-4">Reporte legisladores</h1>';
			windowContent += '<img src="'
					+ canvas.toDataURL() + '"/>';
			windowContent += '</body>';
			windowContent += '</html>';
			
			win1.document.write(windowContent);
			let is_chrome = Boolean(window.chrome);
			
			if(is_chrome) {
				win1.onload = function () {
					console.log('print');
					win1.print();
					$timeout( () => {
						win1.close();
					},1000)
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
	
	$scope.toReturn = () => {
		window.history.back();
	};
	
	
	const initController = () => {
		$scope.getPoliticalParties();
		$scope.getLegislator();
		$scope.getVoteOptions();
		$scope.getSessionsBetweenDates();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});