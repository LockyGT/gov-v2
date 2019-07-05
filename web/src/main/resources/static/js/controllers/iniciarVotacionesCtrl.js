app.controller('iniciarVotacionesCtrl', function($timeout, $rootScope,$filter, $scope, $log, $state, VoteSessionHasInitiativesService, initiativeService, initiativeHasPartnerService, voteSessionService, voteOptionService, notificationService, orderdayService, formulaService, _INICIATIVA, _SESION) {
	let self = this;
	$scope.voteOptions = [];
	$scope.initiatives = [];
	$scope.initiatives = [];
	$scope.selection = [];
	$scope.initiative = null;
	$scope.voteSession = [];

	$scope.voteSessions = [];
	$scope.orderday = null;
	$scope.voteSession = null;

	$scope._INICIATIVA = _INICIATIVA;
	$scope._SESION = _SESION;

	$scope.invalidClassName = '';
	$scope.invalidClassHours= '';
	$scope.invalidClassMinutes= '';
	$scope.invalidClassSeconds= '';
	$scope.errMsjNoTime  = '';
	$scope.errMsjHours  = '';
	$scope.errMsjNoMinutes  = '';
	$scope.errMsjNoSeconds  = '';

	
	$scope.selected = {
			voteSessions: []
	};
	
	$scope.roundMethods = [
		{id: 1, name: "Inferior inmediato", value: "floor"},
		{id: 2, name: "Superior inmediato", value: "ceil"},
		{id: 3, name: "Ninguno", value: "none"}
		];

	self.deleteUser = function(){
		$scope.user = {};
	};

	self.deleteTurn = function(){
		self.turn = {};
	};

	$scope.getStatusString = (status)=>{
		let statusString = "--";
		switch (status) {
		case _INICIATIVA._CREATED:
			statusString = "CREADA";
			break;
		case _INICIATIVA._INITIATED:
			statusString = "ABIERTA";
			break;
		case _INICIATIVA._FINALIZED:
			statusString = "FINALIZADA";
			break;
		default:
			statusString = " "+status;
		break;
		}
		return statusString;
	};

	$scope.regresarVoteSession =() => {
		$scope.voteSession = null;
		VoteSessionHasInitiativesService.setVoteSession($scope.voteSession);
		$state.transitionTo('sesiones');
	};

	$scope.updateVoteSession =() => {		
		$scope.voteSession.fechaHora.setTime( $scope.voteSession.fechaHora.getTime() - $scope.voteSession.fechaHora.getTimezoneOffset()*60*1000 );
		console.info($scope.voteSession.fechaHora);
		voteSessionService.put($scope.voteSession).then(function mySuccess(data) {			
			if(data){
				console.log("session actualizada!");
			}else{
				console.warn("session no actualizada!");
			}
		}, 
		function myError(response) {			
			console.error("error: session no actualizada! " + response);			
		});
	};

	/************************* Get VoteSessions ***********************************/
	$scope.getVoteSessions = () =>{
		voteSessionService.getById().then(function mySuccess(data) {			
			$scope.voteSessions = data;
		},
		function myError(response) {			
			console.error("error: opciones de votos no obtenidos! " + response);			
		});		
	};


	$scope.getVoteOptions = () =>{
		voteOptionService.get().then(function mySuccess(data) {			
			$scope.voteOptions = data;
		}, 
		function myError(response) {			
			console.error("error: opciones de votos no obtenidos! " + response);			
		});		
	};

	$scope.getInitiatives = () =>{

		if($scope.voteSession === null){
			initiativeService.get().then(function mySuccess(data) {			
				$scope.initiatives = data;

			}, 
			function myError(response) {			
				console.error("error:iniciativas no obtenidas! " + response);	

			});
		}else{

			$scope.initiatives = $scope.voteSession.iniciativas;			
		}
	};

/*************************** add OD ***************************************/

	
	$scope.checkAllOptions = (array, e) => {

		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		$scope.updateSelected();
		
	};


	$scope.updateSelected = (paragraph) => {
		$scope.initiative= {
				status: 1,
				hours : 0,
				minutes : 0,
				seconds : 30,
				result: {},
				status : _INICIATIVA._CREATED
		};
		$scope.initiative.contenidoOd = paragraph;
	};

	$scope.addSessionsOd = (voteSession)=>{ 
		console.log('modal ver orden dia',voteSession)
		$scope.sessionView= voteSession;
	};
/************************************************/
	$scope.addInitiative= ()=>{
		document.getElementById("initName").focus(); 
		$scope.initiative = {
				hours : 0,
				minutes : 0,
				seconds : 30,
				result: {},
				status : _INICIATIVA._CREATED

		};
	};


	$scope.submitForm =(isValid)=> {
		if($scope.initiative){
			if($scope.initiative.minutes == null ){
				$scope.initiative.minutes = 0 ;
			}
			if($scope.initiative.hours == null ){
				$scope.initiative.hours = 0 ;
			}
			if($scope.initiative.seconds == null ){
				$scope.initiative.seconds = 0 ;
			}
			if($scope.initiative.hours == 0 && $scope.initiative.minutes == 0 && $scope.initiative.seconds == 0){
				isValid = false;
			}
			if (isValid) {
				$scope.invalidClassName = '';
				$scope.ivalidClassContent ='',
				$scope.invalidClassHours= '';
				$scope.invalidClassMinutes= '';
				$scope.invalidClassSeconds= '';
				$scope.errMsjNoTime  = '';
				$scope.errMsjHours  = '';
				$scope.errMsjMinutes  = '';
				$scope.errMsjSeconds  = '';
				$scope.invalidClassFormula = '';
				$scope.addUpdate();
			}else{
				if($scope.initiative.name == null || $scope.initiative.name.length == 0 ){
					$scope.invalidClassName = 'is-invalid';
				}else{
					$scope.invalidClassName = '';
				}
				if($scope.initiative.hours == 0 && $scope.initiative.minutes == 0 && $scope.initiative.seconds == 0){
					$scope.invalidClassHours= 'is-invalid';
					$scope.invalidClassMinutes= 'is-invalid';
					$scope.invalidClassSeconds= 'is-invalid';
					$scope.errMsjNoTime  = 'Debe de especificar un tiempo para la votación de la iniciativa';
				}else{
					var tiemeTiempo = false;
					if($scope.initiative.hours > 36 ){
						$scope.invalidClassHours= 'is-invalid';
						$scope.errMsjHours  = 'Valor numerico de 0 a 36 Hrs';
						$scope.errMsjNoTime  = '';
					} else{
						if($scope.initiative.hours > 0 ){
							tieneTiempo = true;
						}
						$scope.invalidClassHours= '';
						$scope.errMsjHours  = '';
						$scope.errMsjNoTime  = '';
					}
					if($scope.initiative.minutes > 10 ){
						$scope.invalidClassMinutes= 'is-invalid';
						$scope.errMsjMinutes = 'Valor numerico de 2 a 10 Min';
						$scope.errMsjNoTime  = '';
					} else{
						if($scope.initiative.minutes > 0 ){
							tieneTiempo = true;
							if($scope.initiative.minutes < 2){
								$scope.invalidClassMinutes= 'is-invalid';
								$scope.errMsjMinutes = 'Valor numerico de 2 a 10 Min';
								$scope.errMsjNoTime  = '';
							}
						}
						$scope.errMsjNoTime  = '';
						$scope.invalidClassMinutes= '';
						$scope.errMsjMinutes = '';
					}
					if($scope.initiative.seconds > 59 ){
						$scope.invalidClassSeconds= 'is-invalid';
						$scope.errMsjSeconds  = 'Valor numerico de 0 a 59 Seg';
						$scope.errMsjNoTime  = '';
					} else{
						if($scope.initiative.seconds > 0 ){
							tieneTiempo = true;							
						}
						$scope.invalidClassSeconds= '';
						$scope.errMsjSeconds  = '';
						$scope.errMsjNoTime  = '';
					}
				}
				if($scope.initiative.result.formula == null || $scope.initiative.result.formula.formulaName.trim().length == 0){
					$scope.invalidClassFormula = 'is-invalid';
				}else{
					$scope.invalidClassFormula = '';
				}
				if($scope.initiative.result.roundMethod == null || $scope.initiative.result.roundMethod.name.trim().length == 0){
					$scope.invalidClassRoundMethod = 'is-invalid';
				}else{
					$scope.invalidClassRoundMethod = '';
				}
				swal("Error", "Por favor rellene todos los campos", "error");
			}
		}else{
			console.log("iniciative es nulla");
		}
	};


	$scope.updateInitiative = (initiative)=>{
		$scope.initiative = initiative;		
		if(!$scope.initiative.result){
			$scope.initiative.result = {};
		}
	};

	$scope.deleteInitiative = (initiative)=>{
		initiative.status = _INICIATIVA._DELETED;
		$scope.initiative = initiative;
		$scope.addUpdate();
	};

	$scope.confirmDelete=(_title,_text,_obj)=>{
		swal({
			title:_title,
			text: _text,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {				
				$scope.deleteInitiative(_obj);
			}
		});
	};

	$scope.deleteInitiative= function(initiative){
		var index = -1 ;
		if($scope.voteSession != null ){
			index = $scope.voteSession.iniciativas.indexOf(initiative);
		}		
		initiative.status = _INICIATIVA._DELETED;	
		initiativeService.put(initiative).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Iniciativa eliminada correctamente", "success");
				$scope.getInitiatives();
				if($scope.voteSession != null ){
					if (index > -1) {
						$scope.voteSession.iniciativas.splice(index, 1);
					}
					$scope.updateVoteSession();
				}
			}else{
				swal("Error", "Iniciativa no eliminada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.addUpdate = ()=>{
		if($scope.initiative != null ){
			if($scope.initiative.id != null){
				$scope.putInitiative();
			}else{
				$scope.postInitiative();	
			}
		}else{
			$scope.postInitiative();
		}
	};

	$scope.cancelAddUpdate = () =>{
		$log.log("cancelAddUpdate event")
		$scope.invalidClassName = '';
		$scope.invalidClassHours= '';
		$scope.invalidClassMinutes= '';
		$scope.invalidClassSeconds= '';
		$scope.errMsjNoTime  = '';
		$scope.errMsjHours  = '';
		$scope.errMsjMinutes  = '';
		$scope.errMsjSeconds  = '';
		$scope.initiative = null;
	};

	$scope.postInitiative = ()=>{
		$scope.initiative.tiposVotos = $scope.voteOptions;
		initiativeService.post($scope.initiative).then(function mySuccess(data) {
			console.log('Iniciativas a guardar', data);
			if(data){				
				if($scope.voteSession != null ){
					$scope.voteSession.iniciativas.push(data);
					console.log('+-----+', data)
					$scope.updateVoteSession();
				}				
				swal("Exito", "Iniciativa agregada correctamente", "success");
				$scope.getInitiatives();
				$scope.initiative = null;
			}else{
				swal("Error", "Iniciativa no agregada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.confirmFinalize=(_title,_text,_status)=>{
		swal({
			title:_title,
			text: _text,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {				
				$scope.handleVoteSessionStatusChange(_status);
			}
		});
	};

	$scope.handleVoteSessionStatusChange = function(status){
		if(status == _SESION._INITIATED){
			status = _SESION._FINALIZED;
			$scope.voteSession.status = status;
			$scope.voteSession.fechaHora.setTime( $scope.voteSession.fechaHora.getTime() - $scope.voteSession.fechaHora.getTimezoneOffset()*60*1000 );
			console.info($scope.voteSession.fechaHora);
			voteSessionService.put($scope.voteSession).then(function mySuccess(data) {				
				if(data){
					swal("Exito", "Sesión actualizada correctamente", "success");
					$scope.voteSession = data;
				}else{
					swal("Error", "Sesión no actualizada", "error");
				}	
			}, 
			function myError(response) {
				$scope.myWelcome = response.statusText;
				swal("Error",$scope.myWelcome, "error");			
			});
		}else{
			//status = 1;
		}
	};

	$scope.putInitiative = ()=>{
		initiativeService.put($scope.initiative).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Iniciativa actualizada correctamente", "success");
				$scope.getInitiatives();
				$scope.initiative = null;
			}else{
				swal("Error", "Iniciativa no actualizada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	$scope.putInitiativeForQualification = (initiative)=>{
		initiativeService.put(initiative).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Iniciativa calificada correctamente", "success");
				$scope.getInitiatives();
				$scope.initiativeQualify = null;
				setTimeout(() => {
					$('#modalQualification').modal('toggle');
				}, 500);
			}else{
				swal("Error", "Iniciativa no actualizada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
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

	$scope.stompSuccessCallback = function (frame) {
		stompStatus = true;
		self.setConnected(stompStatus);			
		stompClient.subscribe('/votation/init', function (initiative) {				
			$scope.$apply(function () {
				self.startInitiative(angular.fromJson(initiative.body));
			});
		});
		stompClient.subscribe('/votation/end', function (initiative) {				
			$scope.$apply(function () {
				self.endInitiative(angular.fromJson(initiative.body));
			});
		});
		stompClient.subscribe('/votation/show', function (initiative) {			
			$scope.$apply(function () {
				self.showInitiative(angular.fromJson(initiative.body));
			});
		});
	};

	self.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);
	};

	self.startInitiative = (initiative) =>{	
		if(initiative){
			if(initiative.id === $scope.iniciativaInicia.id){
				$scope.iniciativaRecibidaInicia = initiative;
				VoteSessionHasInitiativesService.setInitiativeInitiated(initiative);
				swal("Exito", "Iniciativa iniciada correctamente", "success");				
				if($scope.initiativeInitIndex >= 0){				
					let index = $scope.voteSession.iniciativas.findIndex( init => init.id === initiative.id );
					$scope.voteSession.iniciativas[index] = initiative;
				}else{
					if($scope.voteSession != null ){					
						let index = $scope.voteSession.iniciativas.findIndex( init => init.id === initiative.id );
						$scope.voteSession.iniciativas[index] = initiative;
					}
				}
			}	
		}else{
			console.error("iniciativa en null");
		}		
	};

	self.showInitiative = (initiative) =>{		
		if(initiative.id === $scope.iniciativaMuestra.id){			
			swal("Exito", "Iniciativa mostrada correctamente", "success");			
		}
	};

	self.endInitiative = (initiative) =>{	
		$scope.iniciativaRecibidaInicia = null;
		$scope.iniciativaRecibidaFin = initiative;
		VoteSessionHasInitiativesService.setInitiativeInitiated(null);
		var index = -1 ;
		if($scope.initiativeInitIndex >= 0){			
			$scope.voteSession.iniciativas.splice($scope.initiativeInitIndex, 1, initiative);
		}else{
			if($scope.voteSession != null ){				
				let index = $scope.voteSession.iniciativas.findIndex( init => init.id === initiative.id );
				$scope.voteSession.iniciativas[index] = initiative;
			}
		}		
		notificationService.postNotification("Votación finalizada", "La votacion para la iniciativa: " + initiative.name + " ha finalizado!", "/img/tick1.gif").then(function mySuccess(data) {			
			console.info(data);		
		}, 
		function myError(response) {
			console.error(response);		
		});
	};	

	self.setConnected = function(connected){		
		self.connected = connected;
	};

	self.connected = false;
	self.switchConnection = () =>{
		if(self.connected){
			self.disconnect();
		}else{
			self.connect();
		}
	};

	$scope.initVotation = function(initiative, index){
		$scope.initiativeInitIndex = index;		
		switch($scope.voteSession.status){
		case _SESION._FINALIZED: 
			swal("Error", "SESIÓN FINALIZADA", "error");
			break;
		case _SESION._INITIATED: 
			swal({
				title: "Iniciando votación",
				text: "Por favor espere ...",
				icon: 'info',						
				button: {
					text: "Ok",
					closeModal: false,
				},
				closeOnClickOutside: false,
				closeOnEsc: false
			});
			initiativeService.getByIsClosedAndStatus(false, _INICIATIVA._INITIATED).then(function getIniciativa(iniciativaAbierta){
				swal.stopLoading();
				swal.close();
				if(iniciativaAbierta && iniciativaAbierta.length){
					swal("Error","Existe una iniciativa abierta e iniciada: " + iniciativaAbierta[0].name, "error");
				}else{
					$scope.iniciativaInicia = initiative;				
					stompClient.send("/votesapp/initvotation", {}, angular.toJson(initiative));		
					$scope.iniciativaRecibidaInicia = null;
				}				
			}, function erroFunction(error){
				swal.stopLoading();
				swal.close();
				swal("Error","Error al consultar iniciativas abiertas " + error, "error");
			});
			break;
		case _SESION._CREATED:
			swal("Advertencia", "SESIÓN NO INICIADA", "warning");
			break;
		default:
			swal("Error", "SESIÓN CON STATUS DESCONOCIDO!", "error");
		break;
		}
	};

	$scope.showVotation = function(initiative, index){
		$scope.initiativeInitIndex = index;		
		switch($scope.voteSession.status){
		case 2: 
			swal("Error", "SESIÓN FINALIZADA", "error");
			break;
		case 1: 
			swal({
				title: "Mostrando votación",
				text: "Por favor espere ...",
				icon: 'info',						
				button: {
					text: "Ok",
					closeModal: false,
				},
				closeOnClickOutside: false,
				closeOnEsc: false
			});
			initiativeService.getByIsClosedAndStatus(false, _INICIATIVA._INITIATED).then(function getIniciativa(iniciativaAbierta){
				if(iniciativaAbierta && iniciativaAbierta.length){
					swal("Error","Existe una iniciativa abierta e iniciada: " + iniciativaAbierta[0].name, "error");
				}else{
					$scope.iniciativaMuestra = initiative;				
					stompClient.send("/votesapp/showvotation", {}, angular.toJson(initiative));
				}	
				swal.stopLoading();
				swal.close();
			}, function erroFunction(error){
				swal.stopLoading();
				swal.close();
				swal("Error","Error al consultar iniciativas abiertas " + error, "error");				
			});
			break;
		case 0:
			swal("Advertencia", "SESIÓN NO INICIADA", "warning");
			break;
		default:
			swal("Error", "SESIÓN CON STATUS DESCONOCIDO!", "error");
		break;
		}
	};

	$scope.qualification = (initiative) => {
		if(!initiative.result || !initiative.result.resultName){
			$scope.calculating = true;
			console.log("califiando...");
			$('#modalQualification').modal('toggle');
			$scope.initiativeQualify = initiative;

			$scope.totalAFavor = 0;
			$scope.totalEnContra = 0;
			$scope.totalAbstencion = 0;
			$scope.totalNoVoto = 0;
			$scope.totalAusente = 0;
			$scope.presentes = 0;
			$scope.indefinido = 0;
			initiativeHasPartnerService.getByInitiativeId($scope.initiativeQualify.id).then(function mySuccess(data) {			
				if(data){
					$scope.initLegislatorsHasVote = data;
					if(data.partnerHasVote && data.partnerHasVote.length){
						console.log(data.partnerHasVote);
						$scope.totalAusente = data.partnerHasVote.length;

						angular.forEach(data.partnerHasVote, function(v, k){
							if(v.asistencia && v.asistencia.id){
								$scope.totalAusente--;
								$scope.presentes ++;
							}
							if(v.vote && v.vote.id){
								if(v.vote.option){
									let op = v.vote.option;
									switch (op.name) {
									case "A FAVOR":
										$scope.totalAFavor ++;
										break;
									case "EN CONTRA":
										$scope.totalEnContra ++;
										break;
									case "ABSTENCION":
										$scope.totalAbstencion ++;
										break;
									default:
										$scope.indefinido ++;
									break;
									}
								}
							}else{
								$scope.totalNoVoto++;
							}
						});//termina ciclo de conteo
						//inicia decision para validar el resultado
						$scope.initiativeQualify.result.totalAFavor = $scope.totalAFavor;
						$scope.initiativeQualify.result.totalEnContra = $scope.totalEnContra;
						$scope.initiativeQualify.result.totalAbstencion = $scope.totalAbstencion;
						$scope.initiativeQualify.result.totalNoVoto = $scope.totalNoVoto;
						$scope.initiativeQualify.result.totalAusente = $scope.totalAusente;
						$scope.initiativeQualify.result.presentes = $scope.presentes;
						$scope.initiativeQualify.result.indefinido = $scope.indefinido;

						if($scope.totalAFavor > $scope.totalEnContra){
							$scope.initiativeQualify.result.resultName = "Aprobado";
						}else{
							$scope.initiativeQualify.result.resultName = "No aprobado";
						}
						//termina calculo
						$scope.calculating = false;					
					}else{
						console.warn("no data of partners found to work with");
						$scope.calculating = false;
					}			
				}else{
					console.warn("no data to work with");
					$scope.calculating = false;
				}			
			}, function myError(response) {
				$scope.myWelcome = response;
				swal("Error",$scope.myWelcome, "error");
				$scope.calculating = false;
			});
		}else{
			$scope.calculating = false;
			$('#modalQualification').modal('toggle');
			$scope.initiativeQualify = initiative;
		}
	};
	$scope.preQualify = (formula) =>{
		$scope.initiativeQualify.result = {};
		$scope.initiativeQualify.result.formula = formula;
	};

	$scope.qualify = ()=>{
		$scope.putInitiativeForQualification($scope.initiativeQualify);
	}

	self.disconnect = function() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		self.setConnected(false);		
	};

	$scope.getFormulas = ()=>{
		formulaService.get().then((data)=>{
			$scope.formulas = data;
		}, (error)=>{
			console.error(error);
		});
	};

	const initController = () =>{
		$scope.getFormulas();
		self.connect();
		$scope.getVoteOptions();
		$scope.voteSession = VoteSessionHasInitiativesService.getVoteSession();	
		if(!$scope.voteSession){
			swal("Error", "Debe de seleccionar una sesión para consultar/agregar iniciativas", "error");
		}
		console.warn($scope.voteSession.fechaHora);

		$scope.getVoteSessions();
		$scope.getInitiatives();
		$rootScope.title = "INICIATIVAS";
	};

	angular.element(document).ready(function () {
		initController();
	});

});