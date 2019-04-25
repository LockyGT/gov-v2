app.controller('reportesCtrl', function($rootScope, $scope, $http, $window, $log, factory, initiativeService, _INICIATIVA, attendanceService) {
	$scope.initiatives = [];
	$scope.reporteBar = null; 
	$scope.reportePie = null; 
	$scope.voteOptions = [];
	$scope.tabView = 0; //0 HOME , 1 PRESENTES
	$scope.fechaBusqueda = null;		
	$scope.fechaBusquedaFin = null;

	$scope.iniciarReporteBar = () =>{
		$scope.reporteBar = {
		 initiative : {},
		 totalVotos : 0,
		 labels : [],//DATOS EJE X
		 series : [],//NOMBRES DE LS SERIES
		 data : [],//DATOS DE LA SERIE(ES) EJE Y
	  	 colors : [],// Colores de las barras
		 partnersVotes : [],
		 options : {
			 scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true,
	                    userCallback: function(label, index, labels) {
	                        // when the floored value is the same as the value we have a whole number
	                        if (Math.floor(label) === label) {
	                            return label;
	                        }

	                    }
	                }
	            }]
	        }
		 }
		};
	};
	$scope.iniciarReportePie = () =>{
		$scope.reportePie = {
		 initiative : {},
		 totalVotos : 0,
		 labels : [],//DATOS EJE X
		 series : [],//NOMBRES DE LS SERIES
		 data : [],//DATOS DE LA SERIE(ES) EJE Y
	  	 colors : [],// Colores de las barras
		 partnersVotes : [],
		 options: {
		        scales: {
		            
		            yAxes: [{
		            ticks: {
		            
		                   min: 0,
		                   max: 100,
		                   callback: function(value){return value+ "%"}
		                },  
						scaleLabel: {
		                   display: true,
		                   labelString: "Porcentaje %"
		                }
		            }]
		        }
		    }
		};
	};
	
	$scope.changeTabView=(tabIndex)=>{
		$scope.tabView = tabIndex;
	};
	
	
	$scope.agregarTotalVoteOptions =() =>{
		angular.forEach($scope.voteOptions, function(valvo, keyvo){
			valvo.totalOption = 0;
		});
	};
	
	$scope.regresarIniciativas=()=>{
		$scope.reporteBar = null ;
		$scope.reportePie = null ;
	};
	
	$scope.getVoteOptions = () =>{
		$http({
			method : "GET",
			url : "/voteoption"
		}).then(function mySuccess(response) {
		
			$scope.voteOptions = response.data;
			angular.forEach($scope.voteOptions, function(valvo, keyvo){
				valvo.totalOption = 0;
			});
		}, function myError(response) {
			self.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");
		});
	};

	$scope.getIniciativas=(fechaBusqueda,fechaBusquedaFin)=>{
		let dateNow = null;
		let date2 = null;

		if(fechaBusqueda == null ){
			dateNow = new Date();
		}else{
			dateNow = fechaBusqueda;
		}
		if(fechaBusquedaFin == null ){
			date2 = new Date();
		}else{
			date2 = fechaBusquedaFin;
		}
		
		dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
		date2.setTime( date2.getTime() - date2.getTimezoneOffset()*60*1000 );
		$scope.fechaBusqueda = dateNow;		
		$scope.fechaBusquedaFin = date2;
		
		initiativeService.getByIsClosedAndStatusAndDateBetween(true, _INICIATIVA._FINALIZED ,dateNow, date2).then(function mySuccess(data) {	
			console.log(data);
			$scope.initiatives = data;
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error","Error al consultar iniciativas " + error, "error");		
		});
		
		
//		
//		initiativeService.getByIsClosedAndStatus(true, _INICIATIVA._FINALIZED).then(function getIniciativa(iniciativas){
//			if(iniciativas.length > 0 ){
//				$scope.initiatives = iniciativas;
//			}
//		},function erroFunction(error){
//			swal("Error","Error al consultar iniciativas " + error, "error");
//		});
	};	
	
	$scope.initiativeGraph =(initiative) =>{		
		let map = new Object(); 
		map['initiativeId'] = initiative.id;
		$scope.getAttendances(initiative.id);
		factory.get('vote/initiative', map).then(function mySuccess(data) {		
			if(data.length > 0 ){
				$scope.iniciarReporteBar();
				$scope.iniciarReportePie();
				$scope.reporteBar.initiative = initiative; 
				$scope.reportePie.initiative = initiative; 
				//$scope.totalVotos = data.length;
				$scope.agregarTotalVoteOptions();
				
				angular.forEach(data, function(val, key){
					$scope.reporteBar.partnersVotes.push(val);
					$scope.reportePie.partnersVotes.push(val);
					//DATASETS
					angular.forEach($scope.voteOptions, function(valvo, keyvo){
						if(valvo.id == val.option.id){
							$scope.reporteBar.totalVotos = $scope.reporteBar.totalVotos + 1;
							$scope.reportePie.totalVotos = $scope.reportePie.totalVotos + 1;
							valvo.totalOption = valvo.totalOption + 1 ;
						}
					});
				});			
				var max = 0 ;
				var voteTypeWin = {} ; 
				angular.forEach($scope.voteOptions, function(val, key){
					$scope.reporteBar.labels.push(val.name);
					$scope.reportePie.labels.push(val.name);
					$scope.reporteBar.series.push('Resultado Votacion');
					$scope.reportePie.series.push('Resultado Votacion');
					
					$scope.reporteBar.data.push(val.totalOption);
					$scope.reportePie.data.push( (val.totalOption * 100) / $scope.reportePie.totalVotos);
				
					$scope.reportePie.colors.push(
								hexToRgbA(
										(val.voteColor == 'success' ) ? '#00b300' : 
											(val.voteColor == 'danger' ) ? '#cc0000' : 
												(val.voteColor == 'warning' ) ?  '#ffbf00' 
														: '#000000')
								);
					$scope.reporteBar.colors.push(
							hexToRgbA(
									(val.voteColor == 'success' ) ? '#00b300' : 
										(val.voteColor == 'danger' ) ? '#cc0000' : 
											(val.voteColor == 'warning' ) ?  '#ffbf00' 
													: '#000000')
							);
						if(val.totalOption > max){
							max = val.totalOption;
							voteTypeWin = val;
						}
				});
				$scope.reporteBar.resultado = voteTypeWin;
				$scope.reportePie.resultado = voteTypeWin;
			}else{
				$scope.iniciarReporteBar();
				$scope.iniciarReportePie();
				$scope.reporteBar.initiative = initiative; 
				$scope.reportePie.initiative = initiative; 
				$scope.reporteBar.totalVotos = 0;
				$scope.reportePie.totalVotos = 0 ;
				$scope.agregarTotalVoteOptions();
				
//				angular.forEach(data, function(val, key){
//					$scope.reporte.partnersVotes.push(val);
//					//DATASETS
//					angular.forEach($scope.voteOptions, function(valvo, keyvo){
//						if(valvo.id == val.option.id){
//							valvo.totalOption = valvo.totalOption  +1 ;
//						}
//					});
//				});			
				var max = 0 ;
				var voteTypeWin = {} ; 
				angular.forEach($scope.voteOptions, function(val, key){
					$scope.reporteBar.labels.push(val.name);
					$scope.reportePie.labels.push(val.name);
					$scope.reporteBar.series.push('Resultado Votacion');
					$scope.reportePie.series.push('Resultado Votacion');
					
					$scope.reporteBar.data.push(val.totalOption);
					val.totalOption = 0;
					//if(isNaN(val.totalOption)){
					//	$scope.reportePie.data.push(0);
					//}else{
					$scope.reportePie.data.push( (val.totalOption * 100) / $scope.reportePie.totalVotos);	
					//}
				
					$scope.reporteBar.colors.push(
								hexToRgbA(
										(val.voteColor == 'success' ) ? '#00b300' : 
											(val.voteColor == 'danger' ) ? '#cc0000' : 
												(val.voteColor == 'warning' ) ?  '#ffbf00' 
														: '#000000')
								);
					$scope.reportePie.colors.push(
							hexToRgbA(
									(val.voteColor == 'success' ) ? '#00b300' : 
										(val.voteColor == 'danger' ) ? '#cc0000' : 
											(val.voteColor == 'warning' ) ?  '#ffbf00' 
													: '#000000')
							);
						if(val.totalOption > max){
							max = val.totalOption;
							voteTypeWin = val;
						}
				});
//				$scope.reporte.resultado = voteTypeWin;
			}		
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
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
	
	$scope.getAttendances = (initiativeId) =>{
		attendanceService.getByInitiativeId(initiativeId).then(function mySuccess(data) {	
			console.log(data);
			$scope.attendances = data;
		},function erroFunction(error){
			console.error(error);
			swal("Error","Error al consultar asistencias ", "error");
		});
	};
	
	$scope.iniciarFechas=()=>{
		console.log('Se inicia la fecha');
		let now = new Date();
			$scope.fechaBusqueda = now;		
			$scope.fechaBusquedaFin = now;
	};
	
	const initController = () =>{
		$scope.iniciarFechas();
		$scope.getIniciativas();
		$scope.getVoteOptions();
		$rootScope.title = "REPORTES";
	};
	
	angular.element(document).ready(function () {
		initController();
	});

});

