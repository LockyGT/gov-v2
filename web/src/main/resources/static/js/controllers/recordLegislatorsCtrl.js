app.controller('recordLegislatorsCtrl', function($scope, factory, partnerService,$timeout,storageService, $state, factory){
	
// $scope.parties = [];
	$scope.recordLegislator  = null;
	$scope.recordLegislators = [];
	$scope.maxDate           = new Date();
	$scope.partner           = null;
	
	$scope.newRecordLegislator = () => {
		$scope.validClass = {};
		$scope.partner = {
				status: 1,
				tipoPartner: 1
		};
	};

	$scope.show = recordLegislator => {
		$scope.recordLegislator = recordLegislator;
		console.log('Informacion del legislador: ', recordLegislator);
		
		if(recordLegislator.foto && recordLegislator.foto.filePath){
			$scope.fetchFile(recordLegislator.foto.filePath);
		}
		
		if(recordLegislator.partido && recordLegislator.partido.logo){
			let sendData = {
					"filePath": recordLegislator.partido.logo
			};
			storageService.getB64(sendData).then(response => {
				$scope.recordLegislator.partido.logo = response.file;
			}, errorResponse => {
				console.log('Error: ', errorResponse);
			});
		}
	};
	
	$scope.update = recordLegislator => {
		if(recordLegislator.fechaCumplianos){
			recordLegislator.fechaCumplianos = new Date(recordLegislator.fechaCumplianos);
		}

		if(recordLegislator.section){
			
			if(recordLegislator.section.contractData) {
				
				if(recordLegislator.section.contractData.startDate){
					recordLegislator.section.contractData.startDate =
						new Date(recordLegislator.section.contractData.startDate);
				}
				
				if (recordLegislator.section.contractData.endDate) {
					recordLegislator.section.contractData.endDate =
						new Date(recordAdministrator.section.contractData.endDate);
				}
				
			}
			
		}
		$scope.partner  = recordLegislator;
		if($scope.partner.foto != null && $scope.partner.foto.filePath != null) {
			$scope.fetchFile($scope.partner.foto.filePath);
		}
	};
	
	$scope.changePolicalParty = (partido) => {
		console.log('Informacion del legislador: ',$scope.partner.partido, 'partido_: ', partido)
		if($scope.partner.partido.logo){
			let sendData = {
					"filePath": $scope.partner.partido.logo
			};
			storageService.getB64(sendData).then(response => {
				$scope.fotoPartido = response.file;
			}, errorResponse => {
				console.log('Error: ', errorResponse);
			});
		}
	};
	
	$scope.fetchFile = filePath => {
		let sendData = {
				"filePath": filePath
		};
		storageService.getB64(sendData).then(response => {
			
			if($scope.partner){
				$scope.partner.foto.filePath = response.file;
			} else if($scope.recordLegislator){
				$scope.recordLegislator.foto.filePath = response.file;
			}
			
		}, errorResponse => {
			console.log('Error: ', errorResponse);
		});
		
	};
	
	$scope.delete = recordLegislator => {
		recordLegislator.status = 0;
		partnerService.put(recordLegislator).then(function success(data){
			if(data){
				swal("Exito","Expediente electrónico eliminado exitosamente", "success");
				$scope.getPartners();
			} else {
				
			}
		}, function error(error){
			swal("Error",error,"error");
		});
	};
	
	$scope.createPDF = recordLegislator => {
		$scope.recordLegisladorTmp = recordLegislator;
	
	};
	
	$scope.addDocuments = (leg) =>{
	
		$state.go('documentoPartner', {
			partnerId: leg.id, 
			namePartner: leg.name+" "+leg.apPaterno+" "+leg.apMaterno,
			tipoPartner: leg.tipoPartner});
		
	};
	
	$scope.cancelAddUpModule = () => {
		$scope.partner  = null;
	};
	
	$scope.confirmDelete = recordLegislator => {
		
		swal({
			title: 'Esta seguro de eliminar a',
			text: recordLegislator.name,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.delete(recordLegislator);
			};
		});
	};
	
	$scope.showPartners = () => {
		swal({
			title: "Consultandos expedientes electrónicos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.getPartners();
		$timeout(()=>{
			swal.stopLoading();
			swal.close();
		},600);
	};
	
	$scope.addUpdate = () => {
		console.log('Partner a enviar: ', $scope.partner);
		if($scope.partner.id){
			$scope.put();
		}else {
			$scope.post();
		}
	};
	
	$scope.getPoliticalParties = () =>{	
		factory.get('politicalparty').then(data => {			
			$scope.parties = data;
		}, response => {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	$scope.getDistricts = () => {
		
		factory.get('components/data/districts.json').then( districts => {
			$scope.districs = districts;
			console.log('DIstritos obtenidos_: ',$scope.districs);
		}, errorData => {
			swal("Error",$scope.myWelcome, "error");
		});
	};
	
	$scope.getBanks = () => {
		factory.get('components/data/banks.json').then( dataBanks => {
			$scope.banks = dataBanks;
		}, errorData => {
			swal("Error", errorData.statusText,"error");
		});
	};
	
	$scope.getStates = () => {
		factory.get('components/data/states.json').then( dataStates => {
			$scope.states = dataStates;
		}, errorData => {
			swal("Error", errorData.statusText,"error");
		});
	};
	
	$scope.getPartners = () => {
		let sendData = {
				"status": 1,
				"tipo": 1
		};
		
		partnerService.getByStatusAndTipoAndPartie(sendData).then(data => {
			$scope.recordLegislators = data;
		}, error => {
			swal.stopLoading();
			swal('Error', error, "error");
		});
	};
	
	$scope.post = () => {
		swal({
			title: "Guardando expediente electrónico",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		partnerService.post($scope.partner).then(data => {
			if(data){
				swal("Exito", "Expediente electrónico agregado correctamente", "success");
				swal.stopLoading();
				$scope.getPartners();
				$scope.partner = null;
			} else {
				swal("Error", "Expediente electrónico no agregado", "error");
			}
		}, error => {
			swal("Error","Expediente electrónico no agregado "+error.statusText, "error");
			swal.stopLoading();
		});
	};
	
	$scope.put = () => {
		swal({
			title: "Actualizando  expediente elctrónico",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		partnerService.put($scope.partner).then(data => {
			if(data) {
				swal("Exito", "Expediente electrónico actualizado correctamente", "success");
				$scope.getPartners();
				$scope.partner = null;
			} else {
				swal("Error", "Expediente electrónico no actualizado", "error");
			}
		}, error => {
			swal.stopLoading();
			swal("Error", error.statusText, "error");
		});
	};
	
	$scope.topReturn = () => {
		window.history.back();
	};
	
	$scope.submitForm = isValid => {
		$scope.validClass = {};
		if(isValid) {
			$scope.addUpdate();
		} else {
			$scope.validClass.valid           = 'valid';
			$scope.validClass.name            = 'valid';
			$scope.validClass.surnameP        = 'valid';
			$scope.validClass.surnameM        = 'valid';
			$scope.validClass.fechaCumplianos = 'valid';
			$scope.validClass.edad            = 'valid';
			$scope.validClass.sexo            = 'valid';
			$scope.validClass.partido         = 'valid';
			$scope.validClass.legislatura     = 'valid';
			$scope.validClass.lastGrade       = 'valid';
			$scope.validClass.career          = 'valid';
			$scope.validClass.nss             = 'valid';
			$scope.validClass.celular         = 'valid';
			$scope.validClass.job             = 'valid';
			$scope.validClass.organ           = 'valid';
			
			if(!$scope.partner.name){
				$scope.validClass.name = 'invalid';
			} else if($scope.partner.name.trim().length === 0){
				$scope.validClass.name = 'invalid';
			}
			
			if(!$scope.partner.apPaterno){
				$scope.validClass.surnameP = 'invalid';
			} else if ($scope.partner.apPaterno.trim().length === 0){
				$scope.validClass.surnameP = 'invalid';
			}
			
			if(!$scope.partner.apMaterno){
				$scope.validClass.surnameM = 'invalid';
			} else if($scope.partner.apMaterno.trim().length === 0){
				$scope.validClass.surnameM = 'invalid';
			}
			
			if(!$scope.partner.fechaCumplianos){
				$scope.validClass.fechaCumplianos = 'invalid';
			}
			
			if(!$scope.partner.edad){
				$scope.validClass.edad = 'invalid';
			} 
			
			if(!$scope.partner.sexo){
				$scope.validClass.sexo = 'invalid';
			}else if($scope.partner.sexo.trim().length === 0){
				$scope.validClass.sexo = 'invalid';
			}
			
			if(!$scope.partner.partido){
				$scope.validClass.partido = 'invalid';
			}
			
			if(!$scope.partner.legislatura){
				$scope.validClass.legislatura = 'invalid';
			} else if($scope.partner.legislatura.trim().length === 0){
				$scope.validClass.legislatura = 'invalid';
			}
			
			if($scope.partner.section.studies){
				if(!$scope.partner.section.studies.lastGrade){
					$scope.validClass.lastGrade = 'invalid';
				}else if($scope.partner.section.studies.lastGrade.trim().length === 0){
					$scope.validClass.lastGrade = 'invalid';
				}
				
				if(!$scope.partner.section.studies.career){
					$scope.validClass.career = 'invalid';
				}else if($scope.partner.section.studies.career.trim().length === 0){
					$scope.validClass.career = 'invalid';
				}
			} else {
				$scope.validClass.lastGrade = 'invalid';
				$scope.validClass.career = 'invalid';
			}
			
			if(!$scope.partner.nss){
				$scope.validClass.nss = 'invalid';
			}else if($scope.partner.nss.trim().length === 0){
				$scope.validClass.nss = 'invalid';
			}
			
			if(!$scope.partner.celular){
				$scope.validClass.celular = 'invalid';
			} else if($scope.partner.celular.trim().length === 0){
				$scope.validClass.celular = 'invalid';
			}
			
			if(!$scope.partner.section.contractData.job){
				$scope.validClass.job = 'invalid';
			}else if($scope.partner.section.contractData.job.trim().length === 0){
				$scope.validClass.job = 'invalid';
			}
			
			if(!$scope.partner.section.contractData.organ){
				$scope.validClass.organ = 'invalid';
			}else if($scope.partner.section.contractData.organ.trim().length === 0){
				$scope.validClass.organ = 'invalid';
			}
			
//			if(!$scope.partner.section.contractData.area){
//				$scope.validClass.area = 'invalid';
//			}else if($scope.partner.section.contractData.area.trim().length === 0){
//				$scope.validClass.area = 'invalid';
//			}
		}
	};
	
	$scope.calculateEdad = () => {
		const today = new Date();
		let resta = today - $scope.partner.fechaCumplianos;
		let dias = Math.round(resta/ (1000*60*60*24));
		$scope.partner.edad = Math.floor(dias/365);
	};
	
	$scope.changeUpperCaseCurp = (letters) => {
		$scope.partner.curp = letters.toUpperCase();

	};
	
	$scope.changeUpperCaseRfc = (letters) => {
		$scope.partner.rfc = letters.toUpperCase();
	};
	
	const initController = () => {
		$scope.getPoliticalParties();
		$scope.showPartners();
		$scope.getDistricts();
		$scope.getBanks();
		$scope.getStates();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});