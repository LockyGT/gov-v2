app.controller('quorumCtrl', function($rootScope, $scope, $rootScope,quorumService,voteSessionService,attendanceService) {

	$scope.quorumToday = [];
	$scope.nuPresentes = 0 ;
	$scope.totalLegisladores = 0;
	$scope.userSession = $rootScope.userSession;
	$scope.fetching = false;
	$scope.voteSession = null;
//	$scope.registeredAttendance = null;

	$scope.getQuorumToday = () =>{
		$scope.fetching = true;
		$scope.nuPresentes = 0;
		attendanceService.getByVoteSessionIdAndAttendanceNumber($scope.voteSession.id,$scope.voteSession.attendanceNumber).then(function getAttendace(response){
			console.log(response);
			if(response && response.length){
				$scope.quorumToday = response;
				$scope.totalLegisladores= response.length;
//				$scope.registeredAttendance = response;
				angular.forEach($scope.quorumToday, function(val, key){
					if(val.id != null && val.id != ''){				
						$scope.nuPresentes ++;
					}
				});
				$scope.fetching = false;
			}else{
				$scope.quorumToday = null;
//				$scope.registeredAttendance = null;
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar sesiones con pase de lista abierto " + error, "error");
		});
		
		
		
		
		
//		quorumService.getQuorumToday().then(function mySuccess(data) {
//			$scope.quorumToday = data;
//			$scope.totalLegisladores= data.length;
//			angular.forEach($scope.quorumToday, function(val, key){
//				if(val.id != null && val.id != ''){				
//					$scope.nuPresentes ++;
//				}
//			});
//			$scope.fetching = false;
//		}, function myError(response) {
//			$scope.myWelcome = response.statusText;
//			$scope.fetching = false;
//			swal("Error",$scope.myWelcome, "error");			
//		});
	};

	$scope.confirmReset=()=>{
		swal({
			title:'¿Esta seguro de reiniciar el Quorum?',
			text: '',
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$scope.reiniciarQuorum();
			}
		});
	};
	
	$scope.reiniciarQuorum=()=>{
		stompClient.send("/votesapp/reset/quorum", {}, $scope.userSession.name);
		$scope.nuPresentes = 0;
		quorumService.reiniciarQuorum($scope.userSession.id).then(function mySuccess(data) {
			console.log(data);
			$scope.quorumToday = data;
			$scope.totalLegisladores= data.length;
			angular.forEach($scope.quorumToday, function(val, key){
				if(val.id != null && val.id != ''){				
					$scope.nuPresentes ++;
				}
			});
			console.log("mandando mensaje");
			
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	$scope.stompFailureCallback = function (error) {
		if($scope.retriesToConnectAux == 100){
			console.log('STOMP: stopped reconect');
		}else {
			$scope.retriesToConnectAux++;
			console.log('STOMP: Reconecting in 1 second');
			$timeout($scope.connect, 1000);
		}
	};
	
	$scope.stompSuccessCallback = function (frame) {
	    stompStatus = true;
	    stompClient.subscribe('/quorum/attendance', function (quorum) {
	    	$scope.$apply(function () {
				$scope.updateQuorum(angular.fromJson(quorum.body));
			});
		});	
	 };

	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);
	};
	
	$scope.updateQuorum = function(quorum) {
		$scope.nuPresentes ++;
		angular.forEach($scope.quorumToday, function(val, key){
			if(val.id != null && val.id != ''){				
				$scope.nuPresentes ++;
				if(val.partner.id == quorum.partner.id){
					val = quorum;
				}
			}
		});
	};
	
	$scope.fetchSessionOnAttendance = () => {
		voteSessionService.getByOnAttendanceStatus(true).then(function getSessionOnAttendance(response){
			console.log(response);
			if(response && response.length){
				$scope.voteSession = response[0];
//				$scope.validateAttendanceOnVoteSession();
				$scope.getQuorumToday();
			}else{
				$scope.voteSession= null;
				swal("","No existen sesiones en pase de lista ", "info");
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar sessiones con pase de lista abierto " + error, "error");
		});
	};
	
	$scope.validateAttendanceOnVoteSession =()=>{		
		attendanceService.getByVoteSessionIdAndAttendanceNumber($scope.voteSession.id,$scope.voteSession.attendanceNumber).then(function getAttendace(response){
			console.log(response);
			if(response && response.length){
				$scope.registeredAttendance = response;
			}else{
				$scope.registeredAttendance = null;
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar sesiones con pase de lista abierto " + error, "error");
		});
	};
	
	const initController = () =>{
		$scope.connect();
		console.log($scope.userSession);
		$scope.fetchSessionOnAttendance();
//		$scope.getQuorumToday();
	};

	angular.element(document).ready(function () {
		initController();
	});

});
