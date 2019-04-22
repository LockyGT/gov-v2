app.controller('panelCtrl', function($rootScope, $scope, $state, $http, $timeout,$window, $interval, $log, factory, initiativeService, initiativeHasPartnerService, _INICIATIVA, partnerHasVoteService, voteSessionService) {
	//if ($state.transition) return;
	self = this;

	$log.log("panel Template loader");
	$rootScope.$state = $state;
	$scope.bgClassBody  = 'bg-body-panel';
	angular.element('body').addClass($scope.bgClassBody);
	$scope.timer="00:00:00";
	$scope.totalSinVoto  = 0;
	$scope.totalVotantes = 0;
	$scope.totalPresentes = 0 ;
	$scope.timerIniciado = 0 ; 
	$scope.attendanceList = [];
	$scope.votacionFinalizada = false;
	$scope.connected = false;
	$scope.noSocket = false;
	$scope.legislatorVotes =[];
	$scope.initLegislatorsHasVote = [];
	$scope.megaArray = [];


	$scope.restaurarVar =()=>{
		$scope.timer="00:00:00";
		$scope.totalSinVoto  = 0;
		$scope.totalVotantes = 0;
		$scope.totalPresentes = 0 ;
		$scope.timerIniciado = 0 ; 
		$scope.attendanceList = [];
		$scope.votacionFinalizada = false;
		$scope.connected = false;
		$scope.legislatorVotes =[];
		$scope.initLegislatorsHasVote = [];
	};

	$scope.setFlagTimerIniciado =(estado) => {
		$scope.timerIniciado = estado;
	};

	$scope.setTimer = (fechaHoraInicio, horas,minutos,segundos)=> {
		if($scope.timerIniciado == 0){
			$scope.setFlagTimerIniciado(1);
			var countDownDate = new Date (fechaHoraInicio);
			var d2 = new Date (countDownDate);
			if(horas > 0 ){
				d2.setHours ( countDownDate.getHours() + horas);
			}
			if(minutos > 0){
				d2.setMinutes ( countDownDate.getMinutes() + minutos );
			}
			if(segundos > 0){
				d2.setSeconds ( countDownDate.getSeconds() + segundos );	
			}
			countDownDate = d2;
			var x = setInterval(function() {
				var now = new Date().getTime();
				var distance = countDownDate - now;
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);
				$scope.timer = ''
					+ (hours < 10 ? '0'+ hours : hours) + ":"
					+ (minutes < 10 ? '0'+ minutes : minutes )+ ":" 
					+ (seconds < 10 ? '0'+ seconds : seconds )+ "" ;
				angular.element('#spnTimer').text($scope.timer);
				if (distance < 0) {
					clearInterval(x);
					$scope.setFlagTimerIniciado(0);
					$scope.timer = "FINALIZADO";
					angular.element('#spnTimer').text($scope.timer);

				}
			}, 1000);
		}
	};

	$scope.finalizarIniciativa =(iniciativa) =>{
		iniciativa.status = _INICIATIVA._FINALIZED;
		iniciativa.closed = true ;
		iniciativa.fechaHoraFin = new Date();
		factory.put('iniciativa', iniciativa).then(function mySuccess(data) {
			if(data){
				console.log("iniciativa actualizada")
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);		
	};

	$scope.stompSuccessCallback = function (frame) {
		stompStatus = true;

		stompClient.subscribe('/votation/vote', function (vote) {			
			$scope.$apply(function () {
				$scope.appendVote(angular.fromJson(vote.body));
			});
		});	
		stompClient.subscribe('/votation/init', function (initiative) {			
			$scope.$apply(function () {
				$scope.showInitiative(angular.fromJson(initiative.body));			
			});
		});
		stompClient.subscribe('/votation/show', function (initiative) {			
			$scope.$apply(function () {
				$scope.onlyShowInitiative(angular.fromJson(initiative.body));
			});
		});		
		stompClient.subscribe('/votation/end', function (initiative) {			
			$scope.$apply(function () {
				$scope.endInitiative(angular.fromJson(initiative.body));
			});
		});		
		stompClient.subscribe('/votation/attendance', function (attendance) {			
			$scope.$apply(function () {
				$scope.addAttendance(angular.fromJson(attendance.body));
			});
		});
		stompClient.subscribe('/votation/initattendance', function (message) {			
			$scope.$apply(function () {
				$scope.startAttendance(angular.fromJson(message.body));
			});
		});
	};	

	$scope.stompFailureCallback = function (error) {
		if($scope.retriesToConnectAux == 100){
			$log.log('STOMP: stopped reconect');
		}else {
			$scope.retriesToConnectAux++;
			$log.log('STOMP: Reconecting in 1 second');
			$timeout($scope.connect, 1000);
		}
	};
	
	$scope.startAttendance = (voteSession)=>{
		console.log(voteSession);		
		$scope.voteSession = voteSession;
		$scope.reloadThisController();		
	};

	$scope.endInitiative = (initiative) =>{
		if($scope.iniciativa.id == initiative.id){	
			$scope.noSocket = true;
			$scope.iniciativaFinal = initiative; 
			$scope.votacionFinalizada = true;			
			$scope.onlyShowInitiative(initiative);			
		}else{
			console.warn("sin iniciativa en sesion!");
		}
	};

	$scope.addAttendance = (attendance) =>{
		if($scope.iniciativa){//varificar mas posibles casos
			if(!attendance.voteSession && attendance.initiative){
				if(attendance.initiative.id == $scope.iniciativa.id){
					angular.forEach($scope.initLegislatorsHasVote.partnerHasVote, function(val, key){
						if(val.partner.id === attendance.partner.id){				
							val.asistencia = attendance;
						}
					});
					$scope.totalPresentes ++;	
					$scope.totalSinVoto  = $scope.totalSinVoto - $scope.totalPresentes;
				}else{
					console.error("la iniciativa de la asistencia no corresponde a la del panel");
				}
			}else{
				console.error("la asistencia no cotiene iniciativa");
			}
		}else{
			if($scope.voteSession){
				if(attendance.voteSession && !attendance.initiative){
					if(attendance.voteSession.id == $scope.voteSession.id){
						angular.forEach($scope.initLegislatorsHasVote.partnerHasVote, function(val, key){
							if(val.partner.id === attendance.partner.id){				
								val.asistencia = attendance;
							}
						});
						$scope.totalPresentes ++;	
						$scope.totalSinVoto  = $scope.totalSinVoto - $scope.totalPresentes;
					}else{
						console.error("la iniciativa de la voteSession no corresponde a la del panel");
					}
				}else{
					console.error("la asistencia no cotiene voteSession");
				}
			}
		}

	};

	$scope.getInitLegislators = (initiative) =>{		
		initiativeHasPartnerService.getByInitiativeId(initiative.id).then(function mySuccess(data) {			
			if(data){
				$scope.initLegislatorsHasVote = data;
				if(data.partnerHasVote && data.partnerHasVote.length){	
					$scope.changeStateLegislatorWithAttendance(data.partnerHasVote);					
					$scope.spliceInChunksArray(data.partnerHasVote);
					if(initiative.result && initiative.result.resultName){

					}else{
						$scope.startInitiativeVotation(initiative);
					}					
				}else{
					console.warn("no data of partners found to work with");
				}			
			}else{
				console.warn("no data to work with");
			}			
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");
		});
	};

	$scope.getInitLegislatorsShowOnly = (initiative) =>{
		initiativeHasPartnerService.getByInitiativeId(initiative.id).then(function mySuccess(data) {		
			if(data){
				$scope.initLegislatorsHasVote = data;
				if(initiative.result){
					$scope.changeStateLegislatorWithAttendance(data.partnerHasVote);					
				}				
				if(data.partnerHasVote && data.partnerHasVote.length){		
					$scope.spliceInChunksArray(data.partnerHasVote);				
				}else{
					console.warn("no data of partners found to show");
				}			
			}else{
				console.warn("no data to show");
			}
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");
		});
	};

	$scope.showInitiative = (initiative) =>{		
		$scope.timer=initiative.hours+":"+initiative.minutes+":" +initiative.seconds;
		angular.element('#spnTimer').text($scope.timer);
		$scope.totalPresentes = 0;		
		$scope.iniciativa = initiative;		
		angular.forEach($scope.iniciativa.tiposVotos, function(val, key){
			val.totalTipoVoto = 0;
		});		
		$scope.getInitLegislators(initiative);
		if($scope.votacionFinalizada){
			$scope.votacionFinalizada = false;
		}
	};

	$scope.onlyShowInitiative = (initiative) =>{		
		let hours = initiative.hours;
		let minutes = initiative.minutes;
		let seconds = initiative.seconds;

		if(initiative.hours < 10){
			hours = "0"+initiative.hours;
		}
		if(initiative.minutes < 10){
			minutes = "0"+initiative.minutes;
		}
		if(initiative.seconds < 10){
			seconds = "0"+initiative.seconds;
		}

		$scope.timer=hours+":"+minutes+":" +seconds;
		if($scope.votacionFinalizada){
			angular.element('#spnTimer').text("FINALIZADA");
		}else{
			angular.element('#spnTimer').text($scope.timer);
		}		

		$scope.iniciativa = initiative;
		$scope.totalPresentes = 0;

		angular.forEach($scope.iniciativa.tiposVotos, function(val, key){
			val.totalTipoVoto = 0;
		});
		$scope.getInitLegislatorsShowOnly(initiative);
		if($scope.votacionFinalizada){
			$scope.votacionFinalizada = false;
		}
	};

	$scope.startInitiativeVotation = (initiative) =>{		
		$scope.setTimer(initiative.fechaHoraInicio,initiative.hours,initiative.minutes,initiative.seconds);
	};

	$scope.changeStateLegislatorWithAttendance =(lhvs)=>{
		if($scope.noSocket){
			angular.forEach(lhvs, function(lhv, lhvkey){
				if($scope.iniciativa && $scope.iniciativa.tiposVotos && $scope.iniciativa.tiposVotos.length){
					angular.forEach($scope.iniciativa.tiposVotos, function(tv, tvkey){
						if(lhv != null && lhv.vote != null && lhv.vote.option != null && lhv.vote.option.id != null){
							if(tv.id == lhv.vote.option.id){
								tv.totalTipoVoto = tv.totalTipoVoto + 1;
							}
						}
					});
				}
				if(lhv.asistencia && lhv.asistencia.id){
					$scope.totalPresentes++;
				}
			});
			$scope.noSocket = false;
		}else{
			console.log("something calling this");
		}
	};

	$scope.appendVote = function(vote){
		if(!$scope.votacionFinalizada){
			angular.forEach($scope.initLegislatorsHasVote.partnerHasVote, function(val, key){
				if(val.partner.id === vote.partner.id){	
					val.vote = vote;
				}
			});
			angular.forEach($scope.iniciativa.tiposVotos, function(val, key){
				if(val.id == vote.option.id){
					val.totalTipoVoto = val.totalTipoVoto + 1;
				}
			});
		}else{
			console.warn("votacion finalizada, voto invalido");
		}

	};

	$scope.setConnected = function(connected){
		$scope.connected = connected;
	};

	$scope.disconnect = function() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		$scope.setConnected(false);
	};

	self.validarIniciativaIniciada=()=>{
		initiativeService.getByIsClosedAndStatus(false, _INICIATIVA._INITIATED).then(function getIniciativa(iniciativaAbierta){
			if(iniciativaAbierta && iniciativaAbierta.length > 0){
				var countDownDate = new Date (iniciativaAbierta[0].fechaHoraInicio);
				var d2 = new Date (countDownDate);
				if(iniciativaAbierta[0].hours > 0 ){
					d2.setHours ( countDownDate.getHours() + iniciativaAbierta[0].hours);
				}
				if(iniciativaAbierta[0].minutes > 0){
					d2.setMinutes ( countDownDate.getMinutes() + iniciativaAbierta[0].minutes );
				}
				if(iniciativaAbierta[0].seconds > 0){
					d2.setSeconds ( countDownDate.getSeconds() + iniciativaAbierta[0].seconds );	
				}
				countDownDate = d2;
				var now = new Date().getTime();
				var distance = countDownDate - now;
				if (distance < 0) {
					if(iniciativaAbierta[0].status === _INICIATIVA._INITIATED){
						$scope.finalizarIniciativa(iniciativaAbierta[0]);
					}
				}else{
					$scope.noSocket = true;
					$scope.showInitiative(iniciativaAbierta[0]);					
				}
			}else{
				$scope.fetchSessionOnAttendance();
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar iniciativas abiertas " + error, "error");
		});
	};

	$scope.fetchSessionOnAttendance = () => {
		voteSessionService.getByOnAttendanceStatus(true).then(function getSessionOnAttendance(response){
			console.log(response);
			if(response && response.length){
				$scope.voteSession = response[0];
				$scope.getPartnerAttendanceByVoteSessionId();
			}else{				
				$scope.voteSession = null;
				$scope.getPartnersForPanel();
			}			
		}, function erroFunction(error){
			swal("Error","Error al consultar sessiones con pase de lista abierto " + error, "error");
		});
	};

	$scope.getPartnerAttendanceByVoteSessionId = () => {
		partnerHasVoteService.getByVoteSessionId($scope.voteSession.id).then(function getAttendanceRecords(response){
			console.log(response);
			if(response && response.length){
				$scope.initLegislatorsHasVote.partnerHasVote = response;
				$scope.noSocket = true;
				$scope.changeStateLegislatorWithAttendance(response);					
				$scope.spliceInChunksArray(response);				
			}else{				
				$scope.voteSession = null;
				$scope.getPartnersForPanel();
			}			
		}, function erroFunction(error){
			swal("Error","Error al consultar los partners de una session para el panel " + error, "error");
		});
		angular.element('#spnTimer').text("");
	};

	$scope.getPartnersForPanel = () => {
		partnerHasVoteService.get().then(function getAttendanceRecords(response){
			console.log(response);
			if(response && response.length){
				$scope.initLegislatorsHasVote.partnerHasVote = response;
				$scope.spliceInChunksArray(response);
			}else{				
				console.warn("no data to show");
			}			
		}, function erroFunction(error){
			swal("Error","Error al consultar los partners para el panel" + error, "error");
		});
	};
	
	$scope.spliceInChunksArray = (partnerHasVote)=>{
		if(partnerHasVote && partnerHasVote.length){			
			var i,j,temparray,chunk = partnerHasVote.length/3;
			$scope.megaArray = [];
			for (i=0,j=partnerHasVote.length; i<j; i+=chunk) {
				temparray = partnerHasVote.slice(i,i+chunk);
				$scope.megaArray.push(temparray);
			}	
		}else{
			//TODO no data to work with
		}		
	};

	$scope.reloadThisController = ()=>{
		$state.go($state.$current, null, { reload: true });
	};

	document.addEventListener("keydown", onKeyDown, false);

	function onKeyDown(e) {
		var x = e.keyCode;
		if(x==118){
			$scope.reloadThisController();
		}
	}


	const initController = () =>{
		$scope.connect();
		self.validarIniciativaIniciada();
		$rootScope.title = "PANEL";
	};

	angular.element(document).ready(function () {
		initController();
	});
});

