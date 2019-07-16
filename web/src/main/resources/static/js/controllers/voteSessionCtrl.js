app.controller('voteSessionCtrl', function($rootScope, $timeout, $filter, $scope, $window, $log, $filter, $state, voteSessionService, VoteSessionHasInitiativesService, voteSessionTypeService, _SESION, _PARTNER, attendanceService, orderdayService) {
	var self = this;
	$scope.titleTabView = '';
	$scope.titleSession = '' ;
	$scope.voteSessions = [];
	$scope.voteSession = null;
	$scope.orderday=null;
	$scope.voteSessionTypes = [];
	$scope.voteSessionOn = {};
	$scope._SESION = _SESION;
	$scope.attendances = [];
	$scope.currentDate = new Date();


	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);		
	};

	$scope.stompSuccessCallback = function (frame) {
		stompStatus = true;

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
	};

	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};

	/************************** Order Day ***************************************/
	$scope.getOdIniciatives = () =>{
		swal({
			title: "Consultando ordenes del día",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
				closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		let dateNow = new Date();
		dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
		let data = new Object(); 
		data['status']= 1;
		data['fecha'] = dateNow;
		console.log('Obtener Ordenes del dia por fecha', data);
		orderdayService.getByDateAndStatusAndReferencia(data).then(function mySuccess(data) {
			$scope.orderdays = data;
			console.log("Orden del dia", $scope.orderdays);
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
			}, 500);
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	/******************************End Order Day*******************************************/

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

	$scope.confirmDelete=(_title,_text,_obj)=>{
		swal({
			title:_title,
			text: _text,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$scope.deleteVoteSession(_obj);
			}
		});
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

	$scope.deleteVoteSession= function(voteSession){
		voteSession.status = _SESION._DELETED;
		voteSessionService.put(voteSession).then(function mySuccess(data) {
			if(data){
				swal("Exito", "Sesión eliminada correctamente", "success");
				$scope.getVoteSessions();
			}else{
				swal("Error", "Sesión no eliminada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.getVoteSessions = () =>{
		swal({
			title: "Consultando sesiones",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
				closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		let dateNow = new Date();
		dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
		let map = new Object(); 
		map['fecha'] = dateNow;
		voteSessionService.getInDateBetween(map).then(function mySuccess(data) {
			$scope.voteSessions = data;
			angular.forEach($scope.voteSessions, function(val, key){
				if(val.fechaHora != null && val.fechaHora.length > 0){	
					val.fechaHora = new Date(val.fechaHora);
				}
			});
			$scope.iniciarFecha();			
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
			}, 500);
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
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
		$scope.getAttendances(dateInit, dateEnd);
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

	$scope.updateVoteSession = (voteSession)=>{
		var iniciativaIniciada = 0 ;
		voteSessionService.getById(voteSession.id).then(function mySuccess(data) {
			if(data.iniciativas != null && data.iniciativas.length > 0 ){
				angular.forEach(data.iniciativas, function(val, key){
					if(val.status == _SESION._INITIATED){	
						iniciativaIniciada = 1 ;
					}
				});
				if(iniciativaIniciada == 0){
					$scope.getVoteSessionTypes();
					$scope.voteSession = voteSession;	
				}else{
					swal("La sesion contiene al menos una iniciativa en votación", "Debe esperar a que finalize la iniciativa", "error");
				}
			}else{
				$scope.getVoteSessionTypes();
				$scope.voteSession = voteSession;	
			}
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
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

	$scope.addUpdate = ()=>{
		if($scope.voteSession != null ){
			if($scope.voteSession.id != null){
				$scope.putVoteSession();
			}else{
				$scope.postVoteSession();	
			}
		}
	};

	$scope.postVoteSession = ()=>{
		$scope.voteSession.fechaHora.setTime( $scope.voteSession.fechaHora.getTime() - $scope.voteSession.fechaHora.getTimezoneOffset()*60*1000 );
		voteSessionService.post($scope.voteSession).then(function mySuccess(data) {
			if(data){
				swal("Exito", "Sesión agregada correctamente", "success");
				$scope.getVoteSessions();
				$scope.voteSession = null;
			}else{
				swal("Error", "Sesión no agregada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.statusSession = 0;
	$scope.handleVoteSessionStatusChange = function(status){
		if(status == _SESION._INITIATED){
			status = _SESION._CREATED;
			$scope.statusSession = status;
			$scope.voteSession.status = status;
		}else{
			let data = new Object();
			data['status'] = $scope._SESION._INITIATED;
			voteSessionService.getByStatus(data).then(function mySuccess(data) {
				if(data && data.length){
					swal({
						title:"Existe una sesión activa",
						text: "Desea finalizar primero la sesion: " + data[0].nombre +" " ,
						icon: "warning",
						buttons: true,
						dangerMode: true,
					}).then((willDelete) => {
						console.log(willDelete);
						if (willDelete) {
							$scope.finalizeVoteSession(data[0]);
							status = _SESION._INITIATED;
							$scope.statusSession = status;
							$scope.voteSession.status = status;
						}else{
							status = _SESION._CREATED;
							$scope.statusSession = status;
							$scope.voteSession.status = status;
							$scope.statusSession = false;
						}
					});
				}else{
					status = _SESION._INITIATED;
					$scope.statusSession = status;
					$scope.voteSession.status = status;
				}
			}, function myError(response) {
				$scope.myWelcome = response.statusText;
				swal("Error",$scope.myWelcome, "error");			
			});
		}
	}

	$scope.voteSessionStatusChange = function(voteSession){
		var _status = 0 ;
		if(voteSession.status == _SESION._CREATED){
			_status = _SESION._INITIATED;
		}else if(voteSession.status == _SESION._INITIATED){
			_status = _SESION._FINALIZED;
		}
		if(voteSession.status == _SESION._CREATED){
			let data = new Object();
			data['status'] = _SESION._INITIATED;
			voteSessionService.getByStatus(data).then(function mySuccess(data) {
				if(data && data.length){
					var iniciativaIniciada = 0 ;
					voteSessionService.getById(data[0].id).then(function mySuccess(_data) {						
						if(_data.iniciativas != null && _data.iniciativas.length > 0 ){
							angular.forEach(_data.iniciativas, function(val, key){
								if(val.status == _SESION._INITIATED){	
									iniciativaIniciada = 1 ;
								}
							});
							if(iniciativaIniciada == 0){
								swal({
									title:"Existe una sesión activa",
									text: "Desea FINALIZAR primero la sesion: " + data[0].nombre +" " ,
									icon: "warning",
									buttons: true,
									dangerMode: true,
								}).then((willDelete) => {
									console.log('Se finalizara');
									if (willDelete) {
										$scope.finalizeVoteSession(data[0]);
										voteSession.status = _status;
										$scope.editVoteSession(voteSession);
									}
								});
							}else{
								swal("Existe una sesion que contiene una iniciativa en votación", "Debe esperar a que finalize la iniciativa", "error");
							}
						}else{
							swal({
								title:"Existe una sesión activa",
								text: "Desea FINALIZAR primero la sesion: " + data[0].nombre +" " ,
								icon: "warning",
								buttons: true,
								dangerMode: true,
							}).then((willDelete) => {
								console.log('Se finalizara');
								if (willDelete) {
									$scope.finalizeVoteSession(data[0]);
									voteSession.status = _status;
									$scope.editVoteSession(voteSession);
								}
							});
						}
					}, function myError(response) {
						$scope.myWelcome = response.statusText;
						swal("Error",$scope.myWelcome, "error");			
					});

				}else{
					swal({
						title:"Iniciar sesion",
						text: "Esta seguro de INICIAR la sesion: " + voteSession.nombre +" " ,
						icon: "warning",
						buttons: true,
						dangerMode: true,
					}).then((willDelete) => {
						console.log('Si se iniciara');
						if (willDelete) {
							console.log(willDelete);
							voteSession.status = _status;
							console.log(voteSession);
							$scope.editVoteSession(voteSession);
						}
					});
				}
			}, function myError(response) {
				$scope.myWelcome = response.statusText;
				swal("Error",$scope.myWelcome, "error");			
			});
		}else if(voteSession.status == _SESION._INITIATED){
			var iniciativaIniciada = 0 ;
			voteSessionService.getById(voteSession.id).then(function mySuccess(data) {				
				if(data.iniciativas != null && data.iniciativas.length > 0 ){
					angular.forEach(data.iniciativas, function(val, key){
						if(val.status == _SESION._INITIATED){	
							iniciativaIniciada = 1 ;
						}
					});
					if(iniciativaIniciada == 0){
						swal({
							title:"Finalizar sesion",
							text: "Esta seguro de FINALIZAR la sesion: " + voteSession.nombre +" " ,
							icon: "warning",
							buttons: true,
							dangerMode: true,
						}).then((willDelete) => {
							console.log(willDelete);
							if (willDelete) {
								voteSession.status = _status; 
								$scope.editVoteSession(voteSession);
							}
						});
					}else{
						swal("La sesion contiene una iniciativa INICIADA", "Debe esperar a que finalize la iniciativa", "error");
					}
				}else{
					swal({
						title:"Finalizar sesion",
						text: "Esta seguro de FINALIZAR la sesion: " + voteSession.nombre +" " ,
						icon: "warning",
						buttons: true,
						dangerMode: true,
					}).then((willDelete) => {
						console.log(willDelete);
						if (willDelete) {
							voteSession.status = _status; 
							$scope.editVoteSession(voteSession);
						}
					});
				}
			}, function myError(response) {
				$scope.myWelcome = response.statusText;
				swal("Error",$scope.myWelcome, "error");			
			});
		}
	}

	$scope.finalizeVoteSession = (voteSession)=>{	
		console.log(voteSession);
		if(voteSession.fechaHora != null && voteSession.fechaHora.length > 0){	
			voteSession.fechaHora = new Date(voteSession.fechaHora);
		}
		voteSession.fechaHora.setTime( voteSession.fechaHora.getTime() - voteSession.fechaHora.getTimezoneOffset()*60*1000 );
		console.log(voteSession);
		voteSession.status = $scope._SESION._FINALIZED;
		console.log(voteSession);
		voteSessionService.put(voteSession).then(function mySuccess(data) {
			console.log(data);
			if(data){
				swal("Exito", "Sesión actualizada correctamente", "success");
				$scope.getVoteSessions();
			}else{
				swal("Error", "Sesión no actualizada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.editVoteSession = (voteSession)=>{
		console.log('putVoteSession');
		if(voteSession.fechaHora != null && voteSession.fechaHora.length > 0){	
			voteSession.fechaHora = new Date(voteSession.fechaHora);
		}
		voteSession.fechaHora.setTime( voteSession.fechaHora.getTime() - voteSession.fechaHora.getTimezoneOffset()*60*1000 );
		console.log(voteSession);
		voteSessionService.put(voteSession).then(function mySuccess(data) {
			console.log('update.....');
			if(data){
				console.log(data);
				swal("Exito", "Sesión actualizada correctamente", "success");
				$scope.iniciarFecha();
				$scope.getVoteSessionsDateOnly($scope.voteSessionOn.fechaBusqueda, $scope.voteSessionOn.fechaBusquedaFin);
			}else{
				swal("Error", "Sesión no actualizada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};


	$scope.putVoteSession = ()=>{		
		$scope.voteSession.fechaHora.setTime( $scope.voteSession.fechaHora.getTime() - $scope.voteSession.fechaHora.getTimezoneOffset()*60*1000 );
		voteSessionService.put($scope.voteSession)
		.then(function mySuccess(data) {
			if(data){
				swal("Exito", "Sesión actualizada correctamente", "success");
				$scope.getVoteSessions();
				$scope.voteSession = null;
			}else{
				swal("Error", "Sesión no actualizada", "error");
			}
		}, 
		function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.getVoteSessionTypes = () =>{
		voteSessionTypeService.get().then(function mySuccess(data) {
			$scope.voteSessionTypes = data;
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.openInitiativesFromSession = (voteSession) =>{
		VoteSessionHasInitiativesService.setVoteSession(voteSession);
		$state.transitionTo('iniciativas');
	};

	$scope.validText=()=>{
		$scope.minAge = new Date();
	};
	$scope.invalidClassName = '';
	$scope.invalidClassDate= '';
	$scope.invalidClassType = '';
	$scope.invalidClassTime= '';
	$scope.invalidClassOrderDay = '';


	$scope.submitForm =(isValid)=> {
		// check to make sure the form is completely valid
		if($scope.voteSession.type == null || $scope.voteSession.type.name.trim().length == 0) {
			isValid = false;
		}
		console.log($scope.voteSession.fechaHora < new Date() );
		if($scope.voteSession.fechaHora < new Date() ){
			isValid = false;
		}
		if (isValid) {
			$scope.invalidClassName = '';
			$scope.invalidClassDate= '';
			$scope.invalidClassType = '';
			$scope.invalidClassTime= '';
			$scope.invalidClassOrderDay = '';

			$scope.addUpdate();
		}else{
			if($scope.voteSession.nombre == null || $scope.voteSession.nombre.length == 0 ){
				$scope.invalidClassName = 'is-invalid';
			}else{
				$scope.invalidClassName = '';
			}
			if($scope.voteSession.fechaHora == null || $scope.voteSession.fechaHora.length == 0 ){
				$scope.invalidClassDate= 'is-invalid';
			}else{
				$scope.invalidClassDate= '';
			}

			if( $scope.voteSession.type == null || $scope.voteSession.type.name.length == 0 ){
				$scope.invalidClassType = 'is-invalid';
			}else{
				$scope.invalidClassType = '';
			}
			if( $scope.voteSession.fechaHora < new Date() ){
				$scope.invalidClassTime= 'is-invalid';
			}else{
				$scope.invalidClassTime= '';
			}
			if( $scope.voteSession.orderday == null || $scope.voteSession.orderday.nombre.length == 0){
				$scope.invalidClassOrderDay = 'is-invalid';
			}else{
				$scope.invalidClassOrderDay = '';
			}
			swal("Error", "Por favor rellene todos los campos", "error");
		}
	};

	$('#myTab a').on('click', function (e) {
		e.preventDefault()
		$(this).tab('show')
	})


	$scope.getAttendances = (fecha, fechaFin) =>{
		let dateNow = null;
		let date2 = null;

		if(fecha == null ){
			dateNow = new Date();
			dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
		}else{
			dateNow = fecha;
		}
		if(fechaFin == null ){
			date2 = new Date();
			date2.setTime( date2.getTime() - date2.getTimezoneOffset()*60*1000 );
		}else{
			date2 = fechaFin;
		}

		console.log('Se envian a consultar las asistencias');
		attendanceService.getByDatesBetween(dateNow, date2).then(function mySuccess(data) {			
			let atts = $filter('filter')(data, {partner: {user: {userRol: {sku: _PARTNER._TYPE._LEGISLATOR}}}});
			$scope.attendances = atts;
			angular.forEach($scope.attendances, function(val, key){
				if(val.dateTime != null && val.dateTime.length > 0){	
					val.dateTime = new Date(val.dateTime);					
				}
			});
			//$scope.iniciarFecha();
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.toggleAttendanceOpen = (voteSession) =>{
		voteSession.attendanceOpen = !voteSession.attendanceOpen;
		if(voteSession.attendanceOpen == true){
			voteSession.attendanceNumber = voteSession.attendanceNumber +1;
		}
		if(voteSession.attendanceOpen){
			voteSessionService.getByOnAttendanceStatus(true).then(function getSessionOnAttendance(response){
				if(response && response.length){
					swal({
						title:"Pase de lista iniciado anteriormente",
						text: "Existe una sesion en pase de lista " + response[0].nombre +", desea finalizarlo?" ,
						icon: "info",
						buttons: true,
						dangerMode: true,
					}).then((willDelete) => {
						console.log(willDelete);
						if (willDelete) {
							response[0].attendanceOpen = false;
							$scope.editVoteSession(response[0]);
							$timeout(()=>{
								$scope.editVoteSession(voteSession);
							}, 500);					
						}else{
							voteSession.attendanceOpen = false;
						}
					});
				}else{
					$scope.editVoteSession(voteSession);
				}				
			}, function erroFunction(error){
				swal("Error","Error al consultar sessiones con pase de lista abierto " + error, "error");
			});
		}else{
			$scope.editVoteSession(voteSession);
		}
		stompClient.send("/votesapp/initattendance", {}, angular.toJson(voteSession));
	};

	$scope.setConnected = function(connected){	
		$scope.connected = connected;
	};	

	$scope.connected = false;	
	$scope.switchConnection = () =>{
		if($scope.connected){
			$scope.disconnect();
		}else{
			$scope.connect();
		}
	};


	const initController = () =>{
		$scope.iniciarFecha();
		$scope.getVoteSessions();
		$scope.getOdIniciatives();
		$scope.getAttendances(null,null);
		$scope.currentDate = new Date();
		$scope.validText();
		$scope.changeTitleTabView('SESIONES');
		$rootScope.title = "SESIONES";
		$scope.connect();
	};

	angular.element(document).ready(function () {
		initController();
	});

});
