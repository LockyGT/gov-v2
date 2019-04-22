app.controller('fingerEnrollmentCtrl', function($rootScope, $timeout, $scope,$http, $window, $state, factory, $filter, partnerHasFingerPrintService, utilsService, _STATUS) {

	$scope.legislators = [];
	$scope.legislator = $state.params.partner;
	var state = document.getElementById('content-capture');
	$scope.limiteDeHuellas = 3;
	$scope.grabar = false;
	$scope.contadorDeHuellas = 1;

	var FingerprintSdkTest = (function (){
		function FingerprintSdkTest(){
			this.sdk = new Fingerprint.WebApi;	
			this.sdk.onDeviceConnected = function (e) {
				$scope.showMessage("Scan your finger");
			};
			this.sdk.onDeviceDisconnected = function (e) {
				$scope.showMessage("Device disconnected");
				swal("Error","Imposible enrrolar un usuario sin un disposito lector de huellas, conecte el dispositivo y vuelva a intentarlo presionando el botón 'Actualizar lista de dispositivos'", "error");
			};
			this.sdk.onCommunicationFailed = function (e) {
				$scope.showMessage("Communinication Failed")
			};
			this.sdk.onSamplesAcquired = function (s) {
				swal({
					title: "Validando huella",
					text: "Por favor espere ...",
					icon: 'info',						
					button: {
						text: "Ok",
						closeModal: false,
					},
					closeOnClickOutside: false,
					closeOnEsc: false
				});
				$scope.sampleAcquired(s);
			};
			this.sdk.onQualityReported = function (e) {
				$scope.calidadDeTemplate = Fingerprint.QualityCode[(e.quality)];				
			};
			FingerprintSdkTest.prototype.getDeviceList = function (){
				return this.sdk.enumerateDevices();
			};
			FingerprintSdkTest.prototype.getDeviceInfoWithID = function (uuid){
				var _instance = this;
				return this.sdk.getDeviceInfo(uuid);
			};
			FingerprintSdkTest.prototype.startCapture = function (){
				this.sdk.startAcquisition(Fingerprint.SampleFormat.PngImage).then(function (){
					$timeout(function(){
						huellaCapturada = true;
					}, 500);
					if($scope.contadorDeHuellas === 1){
						$scope.mensajeCaptura = "Pon tu huella en el lector por favor";
					}					
					$scope.grabando = true;
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

	$scope.saveFingerPrint = function(fp){
		if($scope.limiteDeHuellas >= $scope.contadorDeHuellas){
			fp.fingerIndex = $scope.fingerGrabar.index;
			fp.status = _STATUS._ACTIVE;
			$scope.testFingerSdk.stopCapture();
			partnerHasFingerPrintService.saveFingerPrint($scope.legislator, fp).then(function mySuccess(data) {
				swal.stopLoading();
				swal.close();
				$scope.mostrarHuellaCapturada();
				if($scope.contadorDeHuellas == $scope.limiteDeHuellas){

					$scope.myVal = null;
					$scope.fingerGrabar = null;
					$scope.grabar = false;
					$scope.contadorDeHuellas = 1;
					$scope.calidadDeTemplate = "";
					$scope.getMapFingers();
					$scope.mensajeCaptura = "";
					if($rootScope.initializeSystem){
						$timeout(function(){
							swal("Que bien!", "Ahora inicia sesion con tu huella digital", "success")
							.then((value) => {						
								location.reload();
							});						
						}, 500);
					}else{
						$timeout(function(){
							swal("Exito", "proceso finalizado!", "success");
						}, 500);
					}
				}else{
					$scope.contadorDeHuellas++;
					$scope.testFingerSdk.startCapture();
					if($scope.contadorDeHuellas == ($scope.limiteDeHuellas - 1)){
						$scope.mensajeCaptura = "Una vez más";
					}else{
						$scope.mensajeCaptura = "Una última vez";
					}
					swal("Huella validada "+$scope.contadorDeHuellas+" de " + $scope.limiteDeHuellas, {
						buttons: false,
						icon: "success",
						text: "huella agregada, Coloca tu huella " + $scope.mensajeCaptura , 
						timer: 2000,
					});
				}
			}, function myError(response) {
				swal.stopLoading();
				swal.close();
				$scope.myWelcome = response.statusText;
				swal("Error",$scope.myWelcome, "error");			
			});
		}else{
			swal.stopLoading();
			swal.close();
			swal("Error","No puede agregar mas huellas a este dedo!", "error");
		}
	};	

	$scope.sampleAcquired = function(s){   
		if($scope.currentFormat == Fingerprint.SampleFormat.PngImage){      
			localStorage.setItem("imageSrc", "");                
			var samples = JSON.parse(s.samples);            
			localStorage.setItem("imageSrc", "data:image/png;base64," + Fingerprint.b64UrlTo64(samples[0]));
			if($scope.grabando){ 
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
				$scope.saveFingerPrint(fingerPrint);
				huellaCapturada = false;
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
			$scope.lectoresHuella = successObj;
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

	$scope.getMapFingers = function(){
		swal({
			title: "Consultando huellas",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
				closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		utilsService.getHandsMap().then(function mySuccess(data) {
			$scope.manoDerecha = $filter('filter')(data.manos, {mano: {lado:'derecha'}});
			if($scope.manoDerecha && $scope.manoDerecha.length){
				$scope.manoDerecha = $scope.manoDerecha[0];			}
			$scope.manoIzquierda = $filter('filter')(data.manos, {mano: {lado:'izquierda'}});
			if($scope.manoIzquierda && $scope.manoIzquierda.length){
				$scope.manoIzquierda = $scope.manoIzquierda[0];
			}
			partnerHasFingerPrintService.getByPartnerIdAndStatus($scope.legislator.id, _STATUS._ACTIVE).then(function mySuccess(data) {									
				if(data && data.length){
					$scope.huellasLegislador = data;
					angular.forEach($scope.manoDerecha.mano.dedos, function mapeaHuellas(val, key){						
						let huellaCoincidente = $filter('filter')($scope.huellasLegislador, {fingerPrint: {fingerIndex:val.dedo.index}});
						if(huellaCoincidente && huellaCoincidente.length){
							val.dedo.db = huellaCoincidente[0].fingerPrint;
							val.dedo.color = 'has-finger-print'; 
						}
					});
					angular.forEach($scope.manoIzquierda.mano.dedos, function mapeaHuellas(val, key){
						let huellaCoincidente = $filter('filter')($scope.huellasLegislador, {fingerPrint: {fingerIndex:val.dedo.index}});
						if(huellaCoincidente && huellaCoincidente.length){
							val.dedo.db = huellaCoincidente[0].fingerPrint;
							val.dedo.color = 'has-finger-print';
						}						
					});
				}else{
					console.warn("sin huellas encontradas")
				}
				swal.stopLoading();
				swal.close();
			}, function myError(response) {
				swal.stopLoading();
				swal.close();
				$scope.myWelcome = response;
				swal("Error",$scope.myWelcome, "error");			
			});
		}, function myError(response) {
			swal.stopLoading();
			swal.close();
			$scope.myWelcome = response;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	function base64toBlob(base64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 1024;
		var byteCharacters = atob(base64Data);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);
		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		return new Blob(byteArrays, { type: contentType });
	}

	$scope.grabarHuella = (finger)=>{
		if(finger.db){
			swal({
				title: "Deseas borrar la huella?",
				text: "Una vez borrada no se podrá recuperar!",
				icon: "warning",
				buttons: true,
				dangerMode: true,
			})
			.then((willDelete) => {
				if (willDelete) {
					partnerHasFingerPrintService.deletePartnerFingerPrint($scope.legislator, finger.db).then(function mySuccess(data) {
						if(data.mensaje == "huellaBorrada"){
							swal("Correcto! Huella eliminada!", {
								icon: "success",
							});
							$scope.getMapFingers();
						}						

					}, function error(response){
						swal("Error","Ninguna huella borrada!", "error");
					});
				} else {
					swal("Entendido, huella intacta!");
				}
			});
		}else{
			$scope.initializeFingerDevice();

			if($rootScope.initializeSystem){
				$scope.grabar = true;
				$scope.fingerGrabar = finger;
				$timeout(function(){
					swal("Bien", "Para dar de alta una huella debes de contar con un lector de huellas conectado", "info")
					.then((value) => {						
						swal("Selecciona un lector de la lista para comenzar con el grabado de las huellas");
					});						
				}, 500);
			}else{
				swal("Ahora selecciona un lector para registrar la huella");
				$scope.grabar = true;
				$scope.fingerGrabar = finger;
			}
		}
	};

	$scope.grabarHuellaMapa = (fingerIndex)=>{
		$scope.grabar = true;
		let huellaCoincidente = $filter('filter')($scope.manoDerecha.mano.dedos, {dedo: {index:fingerIndex}});
		if(huellaCoincidente && huellaCoincidente.length){
			$scope.fingerGrabar = huellaCoincidente[0]; 
		}else{
			let huellaCoincidente2 = $filter('filter')($scope.manoIzquierda.mano.dedos, {dedo: {index:fingerIndex}});
			if(huellaCoincidente2 && huellaCoincidente2.length){
				$scope.fingerGrabar = huellaCoincidente2[0];
			}else{
				swal("Error","Ninguna huella coicide con la seleccionada!", "error");
			}
		}
	};

	$scope.readersDropDownPopulate = (checkForRedirecting) =>{ // Check for redirecting is a boolean value which monitors to redirect to content tab or not
		$scope.myVal = "";
		var allReaders = $scope.testFingerSdk.getDeviceList();
		allReaders.then(function (successObj){
			$scope.lectoresHuella = successObj;
			for(i=0; i < successObj.length; i++){
				$scope.printDeviceInfo(successObj[i]);
			}
		}, function (error){
			console.error(error.message);
		});
	};

	$scope.populatePopUpModal = () =>{	
		var modelWindowElement = document.getElementById("ReaderInformationFromDropDown");
		modelWindowElement.innerHTML = "";		
		if($scope.myVal != null && $scope.myVal != ""){			
			$scope.onDeviceInfo($scope.myVal,"ReaderInformationFromDropDown");
		}else{
			modelWindowElement.innerHTML = "Please select a reader";
		}
	};

	$scope.onDeviceInfo = function(uuid, element){
		var myDeviceVal = $scope.testFingerSdk.getDeviceInfoWithID(uuid);		
		myDeviceVal.then(function (sucessObj) {
			var deviceId = sucessObj.DeviceID;
			var uidTyp = $scope.deviceUidType[sucessObj.eUidType];
			var modality = $scope.deviceModality[sucessObj.eDeviceModality];
			var deviceTech = $scope.deviceTechn[sucessObj.eDeviceTech];		
			var returnVal = //"Device Info -"
				"Id : " +  deviceId
				+"<br> Uid Type : "+ uidTyp
				+"<br> Device Tech : " +  deviceTech
				+"<br> Device Modality : " +  modality;
			document.getElementById(element).innerHTML = returnVal;
		}, function (error){
			$scope.showMessage(error.message);
		});
	};

	$scope.selectChangeEvent = function(selectedItem){
		if(selectedItem){
			$scope.myVal = selectedItem;
			$scope.testFingerSdk.startCapture();
			swal("Correcto", "Ahora debes de colocar la huella "+$scope.limiteDeHuellas+" veces en el lector, esperando a que se guarde cada una", "info");	
			document.getElementById('imageGallery').innerHTML = "";
			if($scope.myVal == ""){
				$('#capabilities').prop('disabled', true);
			}else{
				$('#capabilities').prop('disabled', false);
			}
		}else{
			$scope.selectedItem = null;
		}

	};

	$scope.cancelReaderSelection = () =>{
		$scope.grabar = false;
	};

	$scope.cancelEnroll = () =>{
		$scope.myVal = "";
	};

	$scope.mostrarHuellaCapturada = () =>{
		if(localStorage.getItem("imageSrc") == "" || localStorage.getItem("imageSrc") == null || document.getElementById('imagediv').innerHTML == ""){
			alert("Error -> Fingerprint not available");
		}else{
			var vDiv = document.getElementById('imageGallery');
			if(vDiv.children.length < 5){
				var col = document.createElement("div");
				col.className = "col-3";
				var image = document.createElement("img");
				image.id = "galleryImage";
				image.style.width = "20vh"; 
				image.classList.add('rounded-circle');
				image.className = "img-thumbnail";
				image.src = localStorage.getItem("imageSrc");
				col.appendChild(image);
				vDiv.appendChild(col);
				localStorage.setItem("imageSrc"+vDiv.children.length,localStorage.getItem("imageSrc"));
			}else{
				document.getElementById('imageGallery').innerHTML = "";
				$("#save").click();
			}
		}
	};

	const initController = () =>{		
		$scope.getMapFingers();
		if($rootScope.initializeSystem){
			$timeout(function(){						
				swal("Correcto", "Vamos a dar de alta las huellas del usuario recien creado", "info")
				.then((value) => {
					swal("Selecciona una opción para dar de alta la huella");
				});						
			}, 500);
		}else{
			swal("Selecciona una opción para dar de alta la huella");
		}
		$('#image-map area').hover(function () {				
			var coords = $(this).attr('coords').split(',');
			var width = $('.image-map-container').width();
			var height = $('.image-map-container').height();
			$('.image-map-container .map-selector').addClass('hover').css({
				'left': coords[0]+'px',
				'top': coords[1] + 'px',
				'right': width - coords[2],
				'bottom': height - coords[3]
			})
		},
		function () { 
			$('.image-map-container .map-selector').removeClass('hover').attr('style','');
		});
	};

	angular.element(document).ready(function () {
		initController();
	});

});

