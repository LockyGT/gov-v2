app.controller('reporteQuorumCtrl', function($rootScope, $timeout, $filter, $scope, $window, quorumService,_PARTNER) {

	$scope.attendances = [];
	
	$scope.iniciarFecha=()=>{
		console.log('Se inicia la fecha');
		let now = new Date();
		$scope.fechaBusqueda = now;	
		$scope.fechaBusquedaFin = now;
	};

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
		$scope.fechaBusqueda = dateNow;	
		$scope.fechaBusquedaFin = date2;
		console.log('Se envian a consultar las asistencias');
		quorumService.getByDatesBetween(dateNow, date2).then(function mySuccess(data) {	
//			let atts = $filter('filter')(data, {partner: {user: {userRol: {sku: _PARTNER._TYPE._LEGISLATOR}}}});
//			atts = atts.sort((a,b) => a.partner.name.localeCompare(b.partner.name));
//			$scope.attendances = atts;
			$scope.attendances = data;
			angular.forEach($scope.attendances, function(val, key){
				if(val.dateTime != null){	
					val.dateTime = new Date(val.dateTime);					
				}
			});
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	

	const initController = () =>{
		$scope.iniciarFecha();
		$scope.getAttendances(null,null);
	};

	angular.element(document).ready(function () {
		initController();
	});

});
