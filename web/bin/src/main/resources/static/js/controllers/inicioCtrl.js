app.controller('inicioCtrl', function($timeout, $rootScope, $scope, $http, $log, $window, $stateParams, $state, LoginService, partnerService, partnerHasFingerPrintService,quorumService, factory, $filter, configService, storageService, _PARTNER,_ATTENDANCE) {
	let self = this;
	self.legislators = [];
	self.legislator = null;
	$scope.enterEnable = !1;
	$scope.bgClassBody = 'bg-body';
	angular.element('#txtUserName').focus();
	$scope.formSubmit = function() {
		$log.log("submit form");
		partnerService.getPartnerByUsernameInit($scope.username).then(function(response) {
			if (response && response.mensaje === "valid") {
				$scope.getAccessToken();
				swal({
					title: "Validando credenciales",
					text: "Por favor espere ...",
					icon: 'info',						
					button: {
						text: "Ok",
						closeModal: false,
					},
					closeOnClickOutside: false,
					closeOnEsc: false
				});
				$timeout(function() {
					partnerService.getPartnerByUsername($scope.username).then(function(response) {
						if (response) {
							if (response.id) {
								$log.log("result: " + LoginService.login($scope.username, $scope.password));
								$rootScope.userSession = response;
								if ($rootScope.userSession.foto != null && $rootScope.userSession.foto.filePath != null) {
									$rootScope.userSession.foto.filePath = $scope.fetchFilePath($rootScope.userSession.foto.filePath)
								}
								if ($rootScope.userSession.partido != null && $rootScope.userSession.partido.logo != null) {
									$rootScope.userSession.partido.logo = $scope.fetchFileLogo($rootScope.userSession.partido.logo)
								}

								$scope.enviarAsistencia();

								LoginService.setUserData($scope.username, $scope.password);
								$scope.error = '';
								$scope.username = '';
								$scope.password = '';
								$scope.userData = LoginService.getUserData();
								$state.transitionTo('home');
								swal.stopLoading();

								swal("Bienvenido " + response.name,{									
									icon: "success",
									button: false,
									timer: 1000,
								});

							} else {
								swal.stopLoading();
								swal.close();
								$scope.error = "Usuario/Password incorrecto!";
								return !1
							}
						} else {
							swal.stopLoading();
							swal.close();
							$scope.error = "Usuario/Password incorrecto!";
							return !1
						}
					}, function error(response) {
						swal.stopLoading();
						swal.close();
						swal("Error", "Usuario con error " + response, "error")
					})
				}, 1000)
			} else {
				swal.stopLoading();				
				$scope.error = "Usuario/Password incorrecto!";
				return !1
			}
		}, function error(response) {
			swal.stopLoading();
			swal.close();
			swal("Error", "Usuario con error " + response, "error")
		})
	};
	$scope.fetchFilePath = (filePath) => {
		let data = {
				"filePath": filePath
		};
		storageService.getB64(data).then(function mySuccess(response) {
			$rootScope.userSession.foto.filePath = response.file
		}, function myError(response) {
			$scope.myWelcome = response.statusText
		})
	};
	$scope.fetchFileLogo = (filePath) => {
		let data = {
				"filePath": filePath
		};
		storageService.getB64(data).then(function mySuccess(response) {
			$rootScope.userSession.partido.logo = response.file
		}, function myError(response) {
			$scope.myWelcome = response.statusText
		})
	};
	var state = document.getElementById('content-capture');
	var FingerprintSdkTest = (function() {
		function FingerprintSdkTest() {
			this.sdk = new Fingerprint.WebApi;
			this.sdk.onDeviceConnected = function(e) {
				$scope.showMessage("Scan your finger")
			};
			this.sdk.onDeviceDisconnected = function(e) {
				$scope.showMessage("Device disconnected")
			};
			this.sdk.onCommunicationFailed = function(e) {
				$scope.showMessage("Communinication Failed")
			};
			this.sdk.onSamplesAcquired = function(s) {
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
				$scope.sampleAcquired(s)
			};
			this.sdk.onQualityReported = function(e) {
				$scope.calidadDeTemplate = Fingerprint.QualityCode[(e.quality)]
			};
			FingerprintSdkTest.prototype.getDeviceList = function() {
				return this.sdk.enumerateDevices()
			};
			FingerprintSdkTest.prototype.getDeviceInfoWithID = function(uuid) {
				var _instance = this;
				return this.sdk.getDeviceInfo(uuid)
			};
			FingerprintSdkTest.prototype.startCapture = function() {
				this.sdk.startAcquisition(Fingerprint.SampleFormat.PngImage).then(function() {
					$scope.grabando = !0
				}, function(error) {
					console.error(error)
				})
			};
			FingerprintSdkTest.prototype.stopCapture = function() {
				this.sdk.stopAcquisition().then(function() {}, function(error) {
					console.error(error)
				})
			}
		}
		return FingerprintSdkTest
	})();
	$scope.showMessage = (m) => {
		console.log("mensaje: [" + m + "]")
	};
	$scope.validateFingerPrint = function(fp) {
		if($scope.username && $scope.username.length > 0){
			let partner = {
					"name": $scope.username
			}
			partnerService.getPartnerByUsernameInit($scope.username).then(function(response) {
				if (response && response.mensaje === "valid") {
					$scope.getAccessToken();
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
					$timeout(function() {
						partnerHasFingerPrintService.validateFingerPrintUsername(partner, fp).then(function mySuccess(response) {
							if (response) {
								if (response.id) {
									$log.log("result: " + LoginService.login($scope.username, $scope.password));
									$rootScope.userSession = response;
									if ($rootScope.userSession.foto != null && $rootScope.userSession.foto.filePath != null) {
										$rootScope.userSession.foto.filePath = $scope.fetchFilePath($rootScope.userSession.foto.filePath)
									}
									if ($rootScope.userSession.partido != null && $rootScope.userSession.partido.logo != null) {
										$rootScope.userSession.partido.logo = $scope.fetchFileLogo($rootScope.userSession.partido.logo)
									}
									$scope.enviarAsistencia();
									LoginService.setUserData($scope.username, $scope.password);
									$scope.error = '';
									$scope.username = '';
									$scope.password = '';
									$scope.userData = LoginService.getUserData();
									$state.transitionTo('home');
									swal.stopLoading();
									swal.close();
									swal("Bienvenido " + response.name,{									
										icon: "success",
										button: false,
										timer: 2000,
									});
								} else {
									swal.stopLoading();
									swal.close();
									$scope.error = "Usuario inconcistente!";
									return !1
								}
								$scope.testFingerSdk.stopCapture();
								$scope.testFingerSdk = null
							} else {
								var vDiv = document.getElementById('imagediv');
								vDiv.innerHTML = "";
								$scope.testFingerSdk.stopCapture();
								swal.stopLoading();
								swal.close();
								swal("Sin coincidencia", "Asegurece de poner correctamente su huella", "info")
							}
							$('#modalHuella').modal('hide')
						}, function myError(response) {
							$scope.myWelcome = response;
							$scope.testFingerSdk.stopCapture();
							console.error($scope.myWelcome);
							swal.stopLoading();
							swal.close();
							swal("Error", "PETICION NO REALIZADA", "warning")
						})
					}, 1000)
				} else {
					swal.stopLoading();
					swal.close();
					swal("No encontrado", "Usuario no encontrado", "warning");
					$scope.error = "Usuario incorrecto!";
					return !1
				}
			}, function myError(response) {
				$scope.myWelcome = response;
				$scope.testFingerSdk.stopCapture();
				swal.stopLoading();
				swal.close();
				swal("Error", "PETICION NO REALIZADA" + $scope.myWelcome, "error")
			})
		}else{
			$timeout(function() {
				swal.stopLoading();
				swal.close();
				$scope.error = "Usuario requerido!";
			}, 500);
		}
	};
	$scope.startEnrollValidator = () => {
		$('#modalHuella').modal('show');
		$scope.testFingerSdk.startCapture()
	};
	$scope.sampleAcquired = function(s) {
		if ($scope.currentFormat == Fingerprint.SampleFormat.PngImage) {
			localStorage.setItem("imageSrc", "");
			var samples = JSON.parse(s.samples);
			localStorage.setItem("imageSrc", "data:image/png;base64," + Fingerprint.b64UrlTo64(samples[0]));
			if ($scope.grabando) {
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
				$scope.validateFingerPrint(fingerPrint)
			} else {
				console.warn('no content capture!')
			}
		} else if ($scope.currentFormat == Fingerprint.SampleFormat.Raw) {
			localStorage.setItem("raw", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
			localStorage.setItem("raw", Fingerprint.b64UrlTo64(decodedData.Data));
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">RAW Sample Acquired <br>' + Date() + '</div>'
		} else if ($scope.currentFormat == Fingerprint.SampleFormat.Compressed) {
			localStorage.setItem("wsq", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			var decodedData = JSON.parse(Fingerprint.b64UrlToUtf8(sampleData));
			localStorage.setItem("wsq", "data:application/octet-stream;base64," + Fingerprint.b64UrlTo64(decodedData.Data));
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">WSQ Sample Acquired <br>' + Date() + '</div>'
		} else if ($scope.currentFormat == Fingerprint.SampleFormat.Intermediate) {
			localStorage.setItem("intermediate", "");
			var samples = JSON.parse(s.samples);
			var sampleData = Fingerprint.b64UrlTo64(samples[0].Data);
			localStorage.setItem("intermediate", sampleData);
			var vDiv = document.getElementById('imagediv').innerHTML = '<div id="animateText" style="display:none">Intermediate Sample Acquired <br>' + Date() + '</div>'
		} else {
			alert("Format Error")
		}
	};
	$scope.initializeFingerDevice = function() {
		$scope.currentFormat = Fingerprint.SampleFormat.PngImage;
		$scope.myVal = "";
		$scope.disabled = !0;
		$scope.startEnroll = !1;
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
		allReaders.then(function(successObj) {
			$scope.lectoresHuella = successObj;
			if ($scope.lectoresHuella && $scope.lectoresHuella.length) {
				$scope.myVal = $scope.lectoresHuella[0];
				for (i = 0; i < successObj.length; i++) {
					$scope.printDeviceInfo(successObj[i])
				}
			} else {
				swal("Error", "Necesita un lector de huellas para realizar el login", "error")
			}
		}, function(error) {
			console.error(error.message)
		})
	};

	$scope.printDeviceInfo = function(uuid) {
		let myDeviceVal = $scope.testFingerSdk.getDeviceInfoWithID(uuid);
		myDeviceVal.then(function(successObj) {
			console.log(successObj.DeviceID);
			console.log(Fingerprint.DeviceTechnology[successObj.eDeviceTech]);
			console.log(Fingerprint.DeviceModality[successObj.eDeviceModality]);
			console.log(Fingerprint.DeviceUidType[successObj.eUidType])
		}, function(error) {
			console.error(error.message)
		})
	};
	$scope.onDeviceInfo = function(uuid, element) {
		var myDeviceVal = $scope.testFingerSdk.getDeviceInfoWithID(uuid);
		myDeviceVal.then(function(sucessObj) {
			var deviceId = sucessObj.DeviceID;
			var uidTyp = $scope.deviceUidType[sucessObj.eUidType];
			var modality = $scope.deviceModality[sucessObj.eDeviceModality];
			var deviceTech = $scope.deviceTechn[sucessObj.eDeviceTech];
			var returnVal = "Id : " + deviceId + "<br> Uid Type : " + uidTyp + "<br> Device Tech : " + deviceTech + "<br> Device Modality : " + modality;
			document.getElementById(element).innerHTML = returnVal
		}, function(error) {
			$scope.showMessage(error.message)
		})
	};

	$scope.mostrarHuellaCapturada = () => {
		if (localStorage.getItem("imageSrc") == "" || localStorage.getItem("imageSrc") == null || document.getElementById('imagediv').innerHTML == "") {
			alert("Error -> Fingerprint not available")
		} else {
			var vDiv = document.getElementById('imageGallery');
			if (vDiv.children.length < 5) {
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
				localStorage.setItem("imageSrc" + vDiv.children.length, localStorage.getItem("imageSrc"))
			} else {
				document.getElementById('imageGallery').innerHTML = "";
				$("#save").click()
			}
		}
	};

	$scope.enviarAsistencia = ()=>{		
		let date = new Date();
		date.setTime( date.getTime() - date.getTimezoneOffset()*60*1000 );
		let asistencia = {
				"partner": $rootScope.userSession,
				"dateTime": date,
				"status" : _ATTENDANCE._ACTIVE,
				"registrationMethod": "fingerPrintLogin"

		};
		
		quorumService.postInDay(asistencia).then(function mySuccess(data) {			
			if(data){								
				console.log('AsistenciaRegistrada quorumService');
				//stompClient.send("/votesapp/reset/quorum", {}, $scope.userSession.name);
			}else{
				swal("Error", "Asistencia no agregada 2", "error");
			}						
		}, function myError(response) {
			$scope.myWelcome = response;
			console.log($scope.myWelcome);
		});
	};


	$scope.getAccessToken = function() {
		$scope.login = window.location.protocol+"//" + window.location.hostname + ":" + window.location.port + "/login";
		$scope.userLogin = {
				"username": "admin",
				"password": "password"
		};
		$scope.headerLogin = {
				headers: {
					"Content-Type": "application/json"
				}
		};
		$http.post($scope.login, $scope.userLogin, $scope.headerLogin).then(function(response) {
			$http.defaults.headers.common.Authorization = response.headers(["authorization"]);
			$rootScope.httpHeader = response.headers(["authorization"])
		}, function(response) {
			console.log(response)
		})
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
	    stompClient.subscribe('/quorum/reset', function (message) {
	    	$scope.$apply(function () {
	    		console.log(message.body);
				$scope.startEnrollValidator();
			});
		});	
	 };

	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);
	};

	const initController = () => {
		$rootScope.title = "LOGIN";
		var OSName = "Unknown OS";
		if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
		if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
		if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
		if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
		if (OSName != 'Linux' && OSName != 'MacOS' && OSName != 'UNIX') {
			$scope.initializeFingerDevice()
		} else {
			swal("Advertencia", "Este sistema no está soportado por el sdk del lector de huellas!", "warning")
		}
		configService.get().then(function mySuccess(response) {
			if (response) {
				$rootScope.config = {};
				$rootScope.config = response;
				switch (response.fingerPrintEnabled) {
				case "habilitado":
					partnerService.getByStatusInit(_PARTNER._STATUS._ACTIVE).then(function(response) {
						if (response && response.mensaje === "forbidden") {
							$timeout(function() {
								$scope.testFingerSdk.startCapture()
							}, 1000)
						} else {
							if (response && response.mensaje === "allowed") {
								$scope.getAccessToken();
								swal({
									title: "Configurando sistema para su primer uso",
									text: "Por favor espere ...",
									icon: 'info',						
									button: {
										text: "Ok",
										closeModal: false,
									},
									closeOnClickOutside: false,
									closeOnEsc: false
								});
								$timeout(function() {
									$log.log("result: " + LoginService.login("CONFIGURACIÓN INICIAL", ""));
									$rootScope.userSession = {
											name: "CONFIGURACIÓN INICIAL"
									};
									$rootScope.initializeSystem = !0;
									LoginService.setUserData("CONFIGURACIÓN INICIAL", "");
									$scope.userData = LoginService.getUserData();
									swal.stopLoading();
									swal.close();
									$state.transitionTo('partners');									
								}, 1000)
							}
						}
					}, function error(resp) {
						console.error("error: " + resp)
					});
					break;
				case "deshabilitado":
					partnerService.getByStatusInit(_PARTNER._STATUS._ACTIVE).then(function(response) {
						if (response && response.mensaje === "forbidden") {
							$scope.enterEnable = !0
						} else {
							if (response && response.mensaje === "allowed") {
								$scope.getAccessToken();
								swal({
									title: "Configurando sistema para su primer uso",
									text: "Por favor espere ...",
									icon: 'info',						
									button: {
										text: "Ok",
										closeModal: false,
									},
									closeOnClickOutside: false,
									closeOnEsc: false
								});
								$timeout(function() {
									$log.log("result: " + LoginService.login("CONFIGURACIÓN INICIAL", ""));
									$rootScope.userSession = {
											name: "CONFIGURACIÓN INICIAL"
									};
									$rootScope.initializeSystem = !0;
									LoginService.setUserData("CONFIGURACIÓN INICIAL", "");
									$scope.userData = LoginService.getUserData();
									swal.stopLoading();
									swal.close();
									$state.transitionTo('partners');
								}, 1000)
							}
						}
					}, function error(resp) {
						console.error("error: " + resp)
					});
					break;
				default:
					console.error("configuracion desconocida");
				break
				}
			}
			$('#modalHuella').modal('hide')
		}, function myError(response) {
			$scope.myWelcome = response;
			console.error($scope.myWelcome);
			swal("Error", "PETICION NO REALIZADA", "error")
		});		
	};


	angular.element(document).ready(function() {
		initController();
	})

})