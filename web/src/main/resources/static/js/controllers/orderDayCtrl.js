app.controller('orderDayCtrl', function($rootScope, $timeout, $filter, $scope, $window, $log, $filter, $state, voteSessionService, VoteSessionHasInitiativesService, voteSessionTypeService, _SESION, _PARTNER, attendanceService) {
	var self = this;
	$scope.titleTabView = '';
	$scope.titleSession = '' ;
	$scope.voteSessionOn = {};
	$scope.tab = 1;



	$scope.setTab = function(newTab){
		$scope.tab = newTab;
	};

	$scope.isSet = function(tabNum){
		return $scope.tab === tabNum;
	}; 

	$scope.models = {
			selected: null,
			lists: {"A": [], "B": []}
	};
	for (var i = 1; i <= 3; ++i) {
		$scope.models.lists.A.push({label: "Item A" + i});
		$scope.models.lists.B.push({label: "Item B" + i});
	}
	$scope.$watch('models', function(model) {
		$scope.modelAsJson = angular.toJson(model, true);
	}, true);





	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};

	$scope.iniciarFecha=()=>{
		console.log('Se inicia la fecha');
		let now = new Date();
		//now.setTime( now.getTime() - now.getTimezoneOffset()*60*1000 );
		if(VoteSessionHasInitiativesService.getDateSearch() != null){		
			$scope.voteSessionOn.fechaBusqueda= VoteSessionHasInitiativesService.getDateSearch();			
		}else{					
			$scope.voteSessionOn.fechaBusqueda = now;		
		}
		if(VoteSessionHasInitiativesService.getDateSearchEnd() != null){			
			$scope.voteSessionOn.fechaBusquedaFin = VoteSessionHasInitiativesService.getDateSearchEnd();
		}else{			
			$scope.voteSessionOn.fechaBusquedaFin = now;
		}
	};



	$scope.getStatusString = (status)=>{
		let statusString = "--";
		switch (status) {
		case _SESION._CREATED:
			statusString = "CREADA";
			break;
		case _SESION._INITIATED:
			statusString = "INICIADA";
			break;
		case _SESION._FINALIZED:
			statusString = "FINALIZADA";
			break;
		case _SESION._DELETED:
			statusString = "ELIMINADA";
			break;
		default:
			statusString = " "+status;
		break;
		}
		return statusString;
	};
	$scope.getVoteSessionsDateOnly = (fecha, fechaFin) =>{			
		let dateInit = new Date(fecha);
		dateInit.setTime( dateInit.getTime() - dateInit.getTimezoneOffset()*60*1000 );
		VoteSessionHasInitiativesService.setDateSearch(dateInit);
		let dateEnd = new Date(fechaFin);		
		dateEnd.setTime( dateEnd.getTime() - dateEnd.getTimezoneOffset()*60*1000 );
		VoteSessionHasInitiativesService.setDateSearchEnd(dateEnd);
		let map = new Object(); 
		map['fecha'] = dateInit;
		map['fechaFin'] = dateEnd;
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

	$scope.addVoteSession= ()=>{
		$scope.getVoteSessionTypes();
		document.getElementById("txtNombre").focus(); 
		$scope.voteSession = {
				fechaHora : new Date(),
				type:{
					name: ''
				}
		};		
		$scope.voteSession.status = _SESION._CREATED;
	};

	$scope.cancelAddUpdateVoteSession = () =>{
		$log.log("cancelAddUpdateVoteSession event");
		$scope.invalidClassName = '';
		$scope.invalidClassDate= '';
		$scope.invalidClassTime= '';
		$scope.invalidClassType = '';
		$scope.voteSession = null;
		$scope.iniciarFecha();
		$scope.getVoteSessionsDateOnly($scope.voteSessionOn.fechaBusqueda, $scope.voteSessionOn.fechaBusquedaFin);
	};

	$scope.getVoteSessionTypes = () =>{
		voteSessionTypeService.get().then(function mySuccess(data) {
			$scope.voteSessionTypes = data;
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};



	const initController = () =>{
		//$scope.iniciarFecha();
		$scope.changeTitleTabView('ORDEN DEL DÍA');
		$rootScope.title = "ORDENES DEL DÍA";

		//$scope.connect();
	};


	angular.element(document).ready(function () {
		initController();
	});
})