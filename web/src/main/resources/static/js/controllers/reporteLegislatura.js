app.controller('reporteLegislaturaCtrl', function($rootScope, $timeout, $filter, $scope, $window,voteSessionService) {

	
	
	$scope.iniciarFecha=()=>{
		console.log('Se inicia la fecha');
		let now = new Date();
		$scope.fechaBusqueda = now;	
		$scope.fechaBusquedaFin = now;
	};

	$scope.dateFrom = new Date();
	$scope.dateTo = new Date();
	
	
	
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

	const initController = () =>{
		$scope.iniciarFecha();
		
	};

	angular.element(document).ready(function () {
		initController();
	});

})