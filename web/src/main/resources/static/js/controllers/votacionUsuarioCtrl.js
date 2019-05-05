app.controller('votacionUsuarioCtrl', function($timeout, $interval, $log, $rootScope, $scope, $http, $window, partnerHasFingerPrintService, initiativeService, _INICIATIVA, _ATTENDANCE, voteService, attendanceService) {

	$scope.legislators = [];
	$scope.legislator = null;
	$scope.asistencia = null;
	$scope.config = $rootScope.config;
	var state = document.getElementById('content-capture');	
	const HttpCodes = {
			success : 200,
			notFound : 404,
			_CREATED: 201
	}
	$scope.timer="00:00:00";
	$scope.timerIniciado = 0 ; 

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
	};

	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);
	};

	$scope.showInitiative = (initiative) =>{		
		$scope.iniciativa = initiative;
		$scope.setTimer(initiative.hours,initiative.minutes,initiative.seconds);
		if($scope.votacionFinalizada){
			$scope.votacionFinalizada = false;
		}
		if($scope.votoEmitido){
			$scope.votoEmitido = null;
		}
		if($scope.iniciativaFinal){
			$scope.iniciativaFinal = null;
		}
		$scope.onlyShowing = false;
		$scope.asistencia = null;
	};

	$scope.onlyShowInitiative = (initiative) =>{
		$scope.iniciativa = initiative;
		$scope.onlyShowing = true;
		if($scope.votacionFinalizada){
			$scope.votacionFinalizada = false;
		}
		if($scope.votoEmitido){
			$scope.votoEmitido = null;
		}
		if($scope.iniciativaFinal){
			$scope.iniciativaFinal = null;
		}

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
		angular.element('#spnTimer').text($scope.timer);
	};

	$scope.votacionFinalizada = false;
	$scope.endInitiative = (initiative) =>{		
		if($scope.iniciativa.id == initiative.id){
			$scope.iniciativa = null;
			$scope.iniciativaFinal = initiative; 
			$scope.votacionFinalizada = true;
			$scope.testFingerSdk.stopCapture();
			$('#modalHuella').modal('hide');
		}
		if($scope.asistencia){
			$scope.asistencia = null;
		}
	};	

	$scope.appendVote = function(vote){
		if($scope.votoEmitido && $scope.votoEmitido.id){
			if($scope.votoEmitido.id === vote.id){
				swal("Exito", "Se ha emitido su voto", "success");
			}
		}else{
			if($scope.legisladorVotar.id === vote.partner.id){
				swal("Adevertencia", "Se ha emitido su voto en otra terminal", "warning");
				$scope.votoEmitido = vote;
				$('#modalHuella').modal('hide');				
				var vDiv = document.getElementById('imagediv');
				vDiv.innerHTML = "";
				$scope.voteToSend = null;
			}
		}
	};

	$scope.addAttendance = function(attendance){
		if($scope.asistencia && $scope.asistencia.id){
			if($scope.asistencia.id === attendance.id){
				$('#modalHuella').modal('hide');
				swal("Exito", "Se ha registrado su asistencia", "success");
				var vDiv = document.getElementById('imagediv');
				vDiv.innerHTML = "";
				$scope.attendanceToSend = null;
			}
		}else{
			if($scope.iniciativa && $scope.iniciativa.id){
				if($scope.iniciativa.id === attendance.initiative.id){
					if($scope.legisladorVotar.id === attendance.partner.id){
						swal("Adevertencia", "Se ha registrado su asistencia en otra terminal", "warning");
						$scope.asistencia = attendance;
						$('#modalHuella').modal('hide');						
						var vDiv = document.getElementById('imagediv');
						vDiv.innerHTML = "";
						$scope.attendanceToSend = null;
					}
				}				
			}			
		}
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

	$scope.addVote = function(vo){
		if(!$scope.votacionFinalizada){
			$scope.countdownHuella = 10;
			let date = new Date();
			date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
			let vote = {
					"option": vo,
					"fechaHora": date,
					"partner": $scope.legisladorVotar,
					"initiative": $scope.iniciativa
			};
			$scope.validateMethod = 'vote';
			$scope.voteToSend = vote;
			if($scope.config && $scope.config.fingerPrintEnabled != 'habilitado'){
				$('#modalHuella').modal('show');
				$scope.promiseHuellaCounter =  $interval(()=>{
					$scope.countdownHuella --;
				}, 1000, 9);
				$scope.promiseHuellaModal = $timeout(() => {
					$scope.testFingerSdk.stopCapture();
					$('#modalHuella').modal('hide');
				}, 10000);
				$timeout(()=>{
					$scope.enviarVoto();
				}, 4000);							
			}else{
				if($scope.testFingerSdk){
					$scope.testFingerSdk.startCapture();
					$('#modalHuella').modal('show');
					$scope.promiseHuellaCounter =  $interval(()=>{
						$scope.countdownHuella --;
					}, 1000, 9);
					$scope.promiseHuellaModal = $timeout(() => {
						$scope.testFingerSdk.stopCapture();
						$('#modalHuella').modal('hide');
					}, 10000);
				}else{
					swal("Error", "Imposible verficar su huella sin haber inicializado el lector", "error");
				}			
			}						
		}else{
			swal("Error", "La votación ya ha finalizado", "error");
		}
	};

	$scope.startFingerValidator = function(){		
		if(!$scope.asistencia){
			$scope.countdownHuella = 10;
			let date = new Date();
			date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
			let asistencia = {
					"partner": $scope.legisladorVotar,
					"dateTime": date,
					"registrationMethod": "fingerPrint",
					"initiative": $scope.iniciativa,
					"status": _ATTENDANCE._ACTIVE
			};		
			$scope.attendanceToSend = asistencia;
			$scope.validateMethod = 'attendance';
			if($scope.config && $scope.config.fingerPrintEnabled != 'habilitado'){
				$('#modalHuella').modal('show');
				$scope.promiseHuellaCounter =  $interval(()=>{
					$scope.countdownHuella --;
				}, 1000, 9);
				$scope.promiseHuellaModal = $timeout(() => {
					$scope.testFingerSdk.stopCapture();
					$('#modalHuella').modal('hide');
				}, 10000);
				$timeout(()=>{
					$scope.enviarAsistencia();
				}, 4000);

			}else{
				if($scope.testFingerSdk){
					$scope.testFingerSdk.startCapture();
					$('#modalHuella').modal('show');
					$scope.promiseHuellaCounter =  $interval(()=>{
						$scope.countdownHuella --;
					}, 1000, 9);
					$scope.promiseHuellaModal = $timeout(() => {
						$scope.testFingerSdk.stopCapture();
						$('#modalHuella').modal('hide');
					}, 10000);
				}else{
					swal("Error", "Imposible verficar su huella sin haber inicializado el lector", "error");
				}
			}								
		}else{
			swal("Error", "La asistencia ya ha sido registrada", "error");
		}
	};

	$scope.enviarVoto = ()=>{
		if($scope.iniciativa){
			if($scope.voteToSend){
				voteService.fetchByInitiativeAndLegislator($scope.iniciativa.id, $scope.legisladorVotar.id).then(function getIniciativa(votoEmitido){					
					if(votoEmitido && votoEmitido.length > 0){					
						swal("No permitido","YA HA EMITIDO SU VOTO PARA ESTA INICIATIVA " , "info");
						$scope.votoEmitido = votoEmitido[0];
						$('#modalHuella').modal('hide');				
						var vDiv = document.getElementById('imagediv');
						vDiv.innerHTML = "";
						$scope.voteToSend = null;
					}else{
						voteService.post($scope.voteToSend).then(function mySuccess(data) {			
							if(data){
								stompClient.send("/votesapp/add/vote", {}, angular.toJson(data));
								$scope.votoEmitido = data;
								$('#modalHuella').modal('hide');				
								var vDiv = document.getElementById('imagediv');
								vDiv.innerHTML = "";
								$scope.voteToSend = null;
							}else{
								swal("Error", "Voto no agregado 2", "error");
							}						
						}, function myError(response) {
							$scope.myWelcome = response.statusText;
							swal("Error","Voto no agregado" + $scope.myWelcome, "error");			
						});
					}				
				}, function erroFunction(error){
					swal("Error","Error al consultar iniciativas abiertas " + error, "error");
				});

			}else{
				swal("Advertencia","Sin voto por emitir", "warning");
			}
		}else{
			swal("Advertencia","Sin iniciativa para emitir voto", "warning");
		}		
	};

	$scope.enviarAsistencia = ()=>{
		if($scope.iniciativa){
			attendanceService.getByInitiativeIdAndPartnerId($scope.iniciativa.id, $scope.legisladorVotar.id).then(function mySuccess(data) {			
				if(data && data.length){
					$scope.asistencia = data[0];
					$('#modalHuella').modal('hide');
					swal("Advertencia", "Presencia ya registrada", "warning");
					var vDiv = document.getElementById('imagediv');
					vDiv.innerHTML = "";
					$scope.attendanceToSend = null;
				}else{
					attendanceService.post($scope.attendanceToSend).then(function mySuccess(data) {			
						if(data){								
							stompClient.send("/votesapp/add/attendance", {}, angular.toJson(data));
							$scope.asistencia = data;							
						}else{
							swal("Error", "Asistencia no agregada 2", "error");
						}						
					}, function myError(response) {
						$scope.myWelcome = response;
						console.log(response);
						swal("Error","Asistencia no agregada ", "error");			
					});
				}						
			}, function myError(response) {
				$scope.myWelcome = response;
				swal("Error","Asistencia no encontrada por error" + $scope.myWelcome, "error");			
			});
		}else{
			swal("Error","Sin iniciativa para registrar asistencia!", "error");	
		}
	};

	$scope.disconnect = function() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		$scope.setConnected(false);		
	};

	var FingerprintSdkTest = (function (){
		function FingerprintSdkTest(){
			this.sdk = new Fingerprint.WebApi;		
			this.sdk.onDeviceConnected = function (e) {				
				$scope.showMessage("Scan your finger");
			};
			this.sdk.onDeviceDisconnected = function (e) {				
				$scope.showMessage("Device disconnected");
			};
			this.sdk.onCommunicationFailed = function (e) {				
				$scope.showMessage("Communinication Failed")
			};
			this.sdk.onSamplesAcquired = function (s) {				
				$scope.sampleAcquired(s);
			};
			this.sdk.onQualityReported = function (e) {				
				$scope.calidadDeTemplate = Fingerprint.QualityCode[(e.quality)];
				console.info('calidad del template: ['+$scope.calidadDeTemplate+']');
			}			
			FingerprintSdkTest.prototype.getDeviceList = function (){
				return this.sdk.enumerateDevices();
			};
			FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uuid){
				var _instance = this;
				return this.sdk.getDeviceInfo(uuid);
			};
			FingerprintSdkTest.prototype.startCapture = function (){
				this.sdk.startAcquisition(Fingerprint.SampleFormat.PngImage).then(function (){

				}, function(error){
					console.error(error);
				});			
			};
			FingerprintSdkTest.prototype.stopCapture = function (){
				this.sdk.stopAcquisition().then(function (){

				}, function(error){
					console.error(error);
				});			
			};
		}		

		return FingerprintSdkTest;
	})();

	$scope.showMessage = (m)=>{
		console.log("mensaje: ["+m+"]");
	};	

	$scope.validateFingerPrint = function(fp){		
		partnerHasFingerPrintService.validateFingerPrint($scope.legisladorVotar, fp).then(function mySuccess(response) {			

			if(response.mensaje === 'valida'){

				switch ($scope.validateMethod) {
				case "vote":					
					$scope.enviarVoto();
					break;
				case "attendance":				
					$scope.enviarAsistencia();
					break;
				default:
					break;
				}
				$scope.validateMethod = null;
			}else{
				swal("Error", "Huella inválida", "error");
			}						
		}, function myError(response) {
			$scope.myWelcome = response;
			swal("Error","Erro al validar asistencia " + $scope.myWelcome, "error");			
		});
	};

	$scope.sampleAcquired = function(s){   
		if($scope.currentFormat == Fingerprint.SampleFormat.PngImage){  			     
			localStorage.setItem("imageSrc", "");                
			var samples = JSON.parse(s.samples);            
			localStorage.setItem("imageSrc", "data:image/png;base64," + Fingerprint.b64UrlTo64(samples[0]));
			if(state == document.getElementById("content-capture")){ 
				var vDiv = document.getElementById('imagediv');
				vDiv.innerHTML = "";
				var image = document.createElement("img");
				image.id = "image";
				image.style.width = "25vh"; 
				image.classList.add('rounded-circle');
				image.src = localStorage.getItem("imageSrc");
				vDiv.appendChild(image);
				let fingerPrint = {
						templateSt: Fingerprint.b64UrlTo64(samples[0])
				};
				$interval.cancel($scope.promiseHuellaCounter);
				$timeout.cancel($scope.promiseHuellaModal);
				$scope.validateFingerPrint(fingerPrint);
			}else{
				console.warn('no content capture!');
			}
		}

		else if($scope.currentFormat == Fingerprint.SampleFormat.Raw){ 			
			localStorage.setItem("raw", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
			localStorage.setItem("raw", Fingerprint.b64UrlTo64(decodedData.Data));
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">RAW Sample Acquired <br>'+Date()+'</div>';			
		}

		else if($scope.currentFormat == Fingerprint.SampleFormat.Compressed){ 			
			localStorage.setItem("wsq", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
			localStorage.setItem("wsq","data:application/octet-stream;base64," + Fingerprint.b64UrlTo64(decodedData.Data));
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">WSQ Sample Acquired <br>'+Date()+'</div>';			
		}

		else if($scope.currentFormat == Fingerprint.SampleFormat.Intermediate){			
			localStorage.setItem("intermediate", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			localStorage.setItem("intermediate", sampleData);
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">Intermediate Sample Acquired <br>'+Date()+'</div>';		
		}
		else{
			alert("Format Error");			
		}    
	};

	$scope.initializeFingerDevice = function() {
		$scope.currentFormat = Fingerprint.SampleFormat.PngImage;
		$scope.myVal = "";
		$scope.disabled = true;
		$scope.startEnroll = false;
		$scope.deviceTechn = {
				0: "Unknown",
				1: "Optical",
				2: "Capacitive",
				3: "Thermal",
				4: "Pressure"
		}
		$scope.deviceModality = {
				0: "Unknown",
				1: "Swipe",
				2: "Area",
				3: "AreaMultifinger"
		}
		$scope.deviceUidType = {
				0: "Persistent",
				1: "Volatile"
		}
		$scope.testFingerSdk = new FingerprintSdkTest();
		var allReaders = $scope.testFingerSdk.getDeviceList();
		allReaders.then(function (successObj){
			for(i=0; i < successObj.length; i++){
				$scope.printDeviceInfo(successObj[i]);
			}
		}, function (error){
			console.error(error.message);
		});
	};

	$scope.printDeviceInfo = function(uuid){
		let myDeviceVal = $scope.testFingerSdk.getDeviceInfoWithID(uuid);
		myDeviceVal.then(function (successObj){
			console.log(successObj.DeviceID);
			console.log(Fingerprint.DeviceTechnology[successObj.eDeviceTech]);
			console.log(Fingerprint.DeviceModality[successObj.eDeviceModality]);
			console.log(Fingerprint.DeviceUidType[successObj.eUidType]);
		}, function(error){
			console.error(error.message);
		});
	};	

	$scope.fetchInitiative = () => {
		initiativeService.getByIsClosedAndStatus(false, _INICIATIVA._INITIATED).then(function getIniciativa(iniciativaAbierta){
			if(iniciativaAbierta && iniciativaAbierta.length > 0){				
				voteService.fetchByInitiativeAndLegislator(iniciativaAbierta[0].id, $scope.legisladorVotar.id).then(function getIniciativa(votoEmitido){					
					if(votoEmitido && votoEmitido.length > 0){			
						$scope.iniciativa = iniciativaAbierta[0];
						$scope.setTimer($scope.iniciativa.hours, $scope.iniciativa.minutes, $scope.iniciativa.seconds);
						//swal("No permitido","YA HA EMITIDO SU VOTO PARA ESTA INICIATIVA " , "info");
						$scope.votoEmitido = votoEmitido[0];
						if($scope.votacionFinalizada){
							$scope.votacionFinalizada = true;
						}
					}else{
						$scope.iniciativa = iniciativaAbierta[0];
						$scope.setTimer($scope.iniciativa.hours, $scope.iniciativa.minutes, $scope.iniciativa.seconds);
						if($scope.votacionFinalizada){
							$scope.votacionFinalizada = false;
						}
						if($scope.votoEmitido){
							$scope.votoEmitido = null;
						}
					}				
				}, function erroFunction(error){
					swal("Error","Error al consultar iniciativas abiertas " + error, "error");
				});
				attendanceService.getByInitiativeIdAndPartnerId(iniciativaAbierta[0].id, $scope.legisladorVotar.id).then(function mySuccess(data) {			
					if(data && data.length){
						$scope.asistencia = data[0];
					}else{
						$scope.asistencia = null;
					}						
				}, function myError(response) {
					$scope.myWelcome = response;
					swal("Error","Asistencia no encontrada por error" + $scope.myWelcome, "error");			
				});
			}else{
				console.info("sin iniciativas en votacion");
			}

		}, function erroFunction(error){
			swal("Error","Error al consultar iniciativas abiertas " + error, "error");
		});
	};

	$scope.setFlagTimerIniciado =(estado) => {
		$scope.timerIniciado = estado;
	};

	$scope.setTimer = (horas,minutos,segundos)=> {
		if($scope.timerIniciado == 0){
			$scope.setFlagTimerIniciado(1);

			var countDownDate = new Date ($scope.iniciativa.fechaHoraInicio);
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
					$scope.votacionFinalizada = true;
					angular.element('#spnTimer').text($scope.timer);
				}				
			}, 1000);
		}
	};

	const initController = () =>{		
		var OSName="Unknown OS";
		if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
		if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
		if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
		if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";        
		if(OSName != 'Linux' && OSName != 'MacOS' && OSName != 'UNIX'){
			$scope.initializeFingerDevice();
		}		
		$scope.fetchInitiative();
		if($rootScope.userSession){
			$scope.legisladorVotar = angular.copy($rootScope.userSession);
			if($scope.legisladorVotar.partido){
				$scope.legisladorVotar.partido.logo = "";
			}			
			if($scope.legisladorVotar.foto){
				$scope.legisladorVotar.foto.filePath = "";
			}

		}else{
			swal("Error","Necesita una sesion para emitir un voto", "error");
			$state.transitionTo('home');
		}
		$rootScope.title = "VOTACIÓN";
		$timeout(function(){
			$scope.connect();
		}, 500)
	};

	$('#modalHuella').on('hidden.bs.modal', function (e) {
		$interval.cancel($scope.promiseHuellaCounter);
		$timeout.cancel($scope.promiseHuellaModal);
	});

	angular.element(document).ready(function () {
		initController();
	});

});