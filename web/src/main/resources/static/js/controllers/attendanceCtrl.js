app.controller('attendanceCtrl', function($timeout, $state, $filter, $interval, $log, $rootScope, $scope, $http, $window, partnerHasFingerPrintService, initiativeService, _INICIATIVA, _ATTENDANCE, voteService, attendanceService, voteSessionService) {

	$scope.legislators = [];
	$scope.legislator = null;
	$scope.asistencia = null;
	$scope.legisladorVotar = null;
	$scope.registeredAttendance = [];
	$scope.config = $rootScope.config;
	var state = document.getElementById('content-capture');	
	const HttpCodes = {
			success : 200,
			notFound : 404,
			_CREATED: 201
	}
	$scope.timer="00:00:00";
	$scope.timerIniciado = 0 ;
	let fechaActual = new Date();

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
	$scope.startAttendance = (voteSession)=>{
		console.log(voteSession);		
		$scope.voteSession = voteSession;
		$scope.reloadThisController();		
	};
	$scope.reloadThisController = ()=>{
		$state.go($state.$current, null, { reload: true });
	};

	$scope.addAttendance = (attendance)=>{
		if(attendance.partner.id == $scope.legisladorVotar.id){
			$('#modalHuella').modal('hide');
			swal("Exito", "Se ha registrado su asistencia", "success");
			var vDiv = document.getElementById('imagediv');
			vDiv.innerHTML = "";
			$scope.attendanceToSend = null;
		}
	}

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

	$scope.startFingerValidator = function(){		
		if(!$scope.asistencia){
			$scope.countdownHuella = 10;
			let date = new Date();
			date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
			let asistencia = {
					"partner": $scope.legisladorVotar,
					"dateTime": date,
					"registrationMethod": "fingerPrint",
					"voteSession": $scope.voteSession,
					"voteSessionNumberAttendance" : $scope.voteSession.attendanceNumber,
					"status": _ATTENDANCE._ACTIVE
			};		
			$scope.attendanceToSend = asistencia;
			$scope.validateMethod = 'attendance';			
			if($scope.config && $scope.config.fingerPrintEnabled != 'habilitado'){
				$scope.enviarAsistencia();
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

	$scope.enviarAsistencia = ()=>{
		if($scope.attendanceToSend){
			attendanceService.post($scope.attendanceToSend).then(function mySuccess(data) {			
				if(data){								
					stompClient.send("/votesapp/add/attendance", {}, angular.toJson(data));
					$scope.asistencia = data;
					$scope.registeredAttendanceCurrent = data;
					$scope.canCheck = false;
					$scope.fetchAttendancesInVoteSessionByPartnerId();
				}else{
					swal("Error", "Asistencia no agregada 2", "error");
				}						
			}, function myError(response) {
				$scope.myWelcome = response;
				console.log(response);
				swal("Error","Asistencia no agregada ", "error");			
			});
		}else{
			swal("Error","Sin asistencia por enviar", "error");
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
					//$scope.enviarVoto();
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

	$scope.fetchSessionOnAttendance = () => {
		voteSessionService.getByOnAttendanceStatus(true).then(function getSessionOnAttendance(response){
			console.log(response);
			if(response && response.length){
				$scope.voteSession = response[0];
				$scope.validateAttendanceOnVoteSession();
			}else{
				$scope.canCheck = false;
				$scope.voteSession = null;				
			}
			$scope.getAttendanceByPartnerIdAndVoteSessionNotNull();
		}, function erroFunction(error){
			swal("Error","Error al consultar sessiones con pase de lista abierto " + error, "error");
		});
	};
	
	$scope.getAttendanceByPartnerIdAndVoteSessionNotNull =()=>{
		let date1 = new Date();
		date1.setTime( date1.getTime() - date1.getTimezoneOffset()*60*1000 );
		let date2 = date1;		
		attendanceService.findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(date1, date2, _ATTENDANCE._ACTIVE, $scope.legisladorVotar.id).then(function getSessionOnAttendance(response){
			console.log(response);
			if(response && response.length){
				$scope.attendancesWithSession = response;
			}else{		
				
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar sessiones con pase de lista abierto " + error, "error");
		});
	};

	$scope.validateAttendanceOnVoteSession =()=>{		
		attendanceService.getByVoteSessionIdAndPartnerIdAndAttendanceNumber($scope.voteSession.id, $scope.legisladorVotar.id,$scope.voteSession.attendanceNumber).then(function getAttendace(response){
			console.log(response);
			if(response && response.length){
				$scope.registeredAttendanceCurrent = response;
				$scope.canCheck = false;
			}else{
				$scope.registeredAttendanceCurrent = null;
				$scope.canCheck = true;
				$scope.asistencia = null;
			}
		}, function erroFunction(error){
			swal("Error","Error al consultar sesiones con pase de lista abierto " + error, "error");
		});
	};
	
	$scope.fetchAttendancesInVoteSessionByPartnerId = ()=>{
		$scope.getAttendanceByPartnerIdAndVoteSessionNotNull();
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
		if($rootScope.userSession){
			$scope.legisladorVotar = angular.copy($rootScope.userSession);
			if($scope.legisladorVotar.partido){
				$scope.legisladorVotar.partido.logo = "";
			}			
			if($scope.legisladorVotar.foto){
				$scope.legisladorVotar.foto.filePath = "";
			}	
			$scope.canCheck = false;
			$scope.fetchSessionOnAttendance();
			$scope.fetchAttendancesInVoteSessionByPartnerId();
		}else{
			swal("Error","Necesita una sesion para registrar asistencia", "error");
			$state.transitionTo('login');
		}
		$rootScope.title = "REGISTRO ASISTENCIA";
		$timeout(function(){
			$scope.connect();
		}, 500)
	};

	angular.element(document).ready(function () {
		initController();
	});

});