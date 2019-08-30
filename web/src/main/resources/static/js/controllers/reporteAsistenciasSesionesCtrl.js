app.controller('reporteAsistenciasSesionesCtrl', function($rootScope, $timeout, $filter, $scope, $window, attendanceService, voteSessionService) {

	$scope.attendances = [];

	$scope.iniciarFecha=()=>{
		console.log('Se inicia la fecha');
		let now = new Date();
		$scope.fechaBusqueda = now;	
		$scope.fechaBusquedaFin = now;
	};

	$scope.dateFrom = new Date();
	$scope.dateTo = new Date();

	$scope.getAttendances = (fecha, fechaFin) =>{
		let dateNow = null;
		let date2 = null;

		if(fecha == null ){
			dateNow = new Date();
		}else{
			dateNow = fecha;
		}
		if(fechaFin == null ){
			date2 = new Date();
		}else{
			date2 = fechaFin;
		}
		dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
		date2.setTime( date2.getTime() - date2.getTimezoneOffset()*60*1000 );
		console.log('Se envian a consultar las asistencias');
		//attendanceService.getBySesionDatesBetween(dateNow, date2).then(function mySuccess(data) {	
		attendanceService.getAttendancesSessionsByDateTime(dateNow, date2).then(function mySuccess(data) {
			console.log(data);
//			let atts = data.sort((a,b) => a.partner.apPaterno.localeCompare(b.partner.name));
//			$scope.attendances = atts;
			$scope.attendances = data;
			$scope.attendancesAux = [];
			angular.copy($scope.attendances, $scope.attendancesAux);
			angular.forEach($scope.attendances, function(val, key){
				if(val.dateTime != null && val.dateTime.length > 0){	
					val.dateTime = new Date(val.dateTime);					
				}
			});
			$scope.getVoteSessionsDateOnly(dateNow, date2);
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error", "error", "error");			
		});
	};
	
	$scope.filterBySession =(voteSessionFilter) =>{
		if(voteSessionFilter){
			$scope.attendances = $filter('filter')($scope.attendancesAux, {voteSession:{id: voteSessionFilter.id}});
		}else{
			$scope.attendances = $scope.attendancesAux;
		}		
	};

	$scope.getVoteSessionsDateOnly = (fecha, fechaFin) =>{		
		let map = new Object(); 
		map['fecha'] = fecha;
		map['fechaFin'] = fechaFin;
		voteSessionService.getInDateBetweenEndBetween(map).then(function mySuccess(data) {
			$scope.voteSessions = data;
			angular.forEach($scope.voteSessions, function(val, key){
				if(val.fechaHora != null && val.fechaHora.length > 0){
					val.fechaHora = new Date(val.fechaHora);
				}
			});
		}, function myError(response) {

			swal("Error", "Error en la consulta", "error");			
		});
	};

	$scope.toReturn = () => {
		window.history.back();
	};
	
	const initController = () =>{
		$scope.iniciarFecha();
		$scope.getAttendances(null,null);
	};

	angular.element(document).ready(function () {
		initController();
	});

});
