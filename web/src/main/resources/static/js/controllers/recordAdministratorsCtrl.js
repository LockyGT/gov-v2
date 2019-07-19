app.controller('recordAdministratorsCtrl', function($scope, factory, partnerService,$timeout,storageService, $state,$stateParams,folderAdministratorService, userService, $filter){
	
	$scope.recordAdministrator  = null;
	$scope.recordAdministrators = [];
	
	$scope.maxDate = new Date();
	$scope.partner = null;
	
	$scope.newRecordLegislator = () => {
		
		$scope.partner = {
				status: 1,
				tipoPartner: 2,
				user: {
					userRol:$scope.roleUser
				},
				section: {
					contractData: {
						area: $scope.area
					}
				}
		};
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
	
	$scope.show = recordAdministrator => {
		$scope.recordAdministrator = recordAdministrator;
		if(recordAdministrator.foto && recordAdministrator.foto.filePath){
			$scope.fetchFile(recordAdministrator.foto.filePath);
		}
	};
	
	$scope.listeningChangePass = () => {
	
		$scope.isChangePass = true;
	};
	
	$scope.update = recordAdministrator => {
		console.log('Informacion a actualiza: ',recordAdministrator);
		if(recordAdministrator.fechaCumplianos){
			recordAdministrator.fechaCumplianos = new Date(recordAdministrator.fechaCumplianos);
		}
		if(recordAdministrator.user){
			if(!recordAdministrator.user.userRol){
				recordAdministrator.user.userRol = $scope.roleUser;
			}
		} else {
			recordAdministrator.user = {
				userRol: $scope.roleUser
			};
		} 
		if(recordAdministrator.section){
			if(recordAdministrator.section.contractData) {
				
				if(recordAdministrator.section.contractData.startDate){
					recordAdministrator.section.contractData.startDate =
						new Date(recordAdministrator.section.contractData.startDate);
				}
				
				if (recordAdministrator.section.contractData.endDate) {
					recordAdministrator.section.contractData.endDate =
						new Date(recordAdministrator.section.contractData.endDate);
				}
				
			}
			
		}
		
		$scope.partner = recordAdministrator;
		if($scope.partner.foto != null && $scope.partner.foto.filePath != null) {
			$scope.fetchFile($scope.partner.foto.filePath);
		}
	};
	
	$scope.createPDF = recordAdministrator => {
		
	};
	
	$scope.submitForm = isValid => {
		$scope.validClass = {};
		$scope.message    = {
				password:'Se ve bien',
				passwordRepeat: 'Se ve bien',
				username: 'Se ve bien'
		};
		console.log('Informacion del parner: ', $scope.partner);
		if(isValid) {
			if($scope.isChangePass){
				if($scope.partner.user && $scope.partner.user.password){
					if($scope.partner.user.password === $scope.partner.user.passwordRepeat){
						$scope.addUpdate();
					} else {
						$scope.validClass.password       = 'invalid';
						$scope.validClass.passwordRepeat = 'invalid';
						$scope.message.password = 'Las contraseñas no coinciden';
						$scope.message.passwordRepeat = 'Las contraseñas no coinciden';
						console.log('Informacio de las contraseñas correctas', $scope.message);
					}
				}else {
					$scope.addUpdate();
				}
			} else {
				$scope.addUpdate();
			}

			
		} else {
			$scope.validClass.password        = 'valid';
			$scope.validClass.username        = 'valid';
			$scope.validClass.passwordRepeat  = 'valid';
			$scope.validClass.valid           = 'valid';
			$scope.validClass.name            = 'valid';
			$scope.validClass.surnameP        = 'valid';
			$scope.validClass.surnameM        = 'valid';
			$scope.validClass.fechaCumplianos = 'valid';
			$scope.validClass.edad            = 'valid';
			$scope.validClass.sexo            = 'valid';
			
			$scope.validClass.streetL         = 'valid';
			$scope.validClass.numberExtL      = 'valid';
			$scope.validClass.cpL             = 'valid';
			$scope.validClass.colonyL         = 'valid';
			$scope.validClass.stateL          = 'valid';
			$scope.validClass.municipalityL   = 'valid';
			
			$scope.validClass.streetLL        = 'valid';
			$scope.validClass.numberExtLL     = 'valid';
			$scope.validClass.cpLL            = 'valid';
			$scope.validClass.colonyLL        = 'valid';
			$scope.validClass.stateLL         = 'valid';
			$scope.validClass.municipalityLL  = 'valid';
			
			$scope.validClass.lastGrade       = 'valid';
			$scope.validClass.career          = 'valid';
			$scope.validClass.nss             = 'valid';
			$scope.validClass.celular         = 'valid';
			$scope.validClass.job             = 'valid';
			$scope.validClass.area            = 'valid';
			
			if(!$scope.partner.name){
				$scope.validClass.name = 'invalid';
			} else if($scope.partner.name.trim().length === 0){
				$scope.validClass.name = 'invalid';
			}
			
			if(!$scope.partner.apPaterno){
				$scope.validClass.surnameP = 'invalid';
			} else if ($scope.partner.apPaterno.trim().length === 0){
				$scope.validClass.surnamep = 'invalid';
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
			} else if(/\D/.test($scope.partner.edad)){
				$scope.validClass.edad = 'invalid';
			}
			
			if(!$scope.partner.sexo){
				$scope.validClass.sexo = 'invalid';
			}else if($scope.partner.sexo.trim().length === 0){
				$scope.validClass.sexo = 'invalid';
			}
			
			/*** ------------------------------------------- */
			if($scope.partner.section.homeAddress){
				if(!$scope.partner.section.homeAddress.street){
					$scope.validClass.streetL = 'invalid';
				}else if($scope.partner.section.homeAddress.street.trim().length === 0){
					$scope.validClass.streetL = 'invalid';
				}
				if(!$scope.partner.section.homeAddress.numberExt){
					$scope.validClass.numberExtL = 'invalid';
				}else if($scope.partner.section.homeAddress.numberExt.trim().length === 0){
					$scope.validClass.numberExtL = 'invalid';
				}
				if(!$scope.partner.section.homeAddress.cp){
					$scope.validClass.cpL = 'invalid';
				}else if($scope.partner.section.homeAddress.cp.trim().length === 0){
					$scope.validClass.cpL = 'invalid';
				}
				if(!$scope.partner.section.homeAddress.colony){
					$scope.validClass.colonyL = 'invalid';
				}else if($scope.partner.section.homeAddress.colony.trim().length === 0){
					$scope.validClass.colonyL = 'invalid';
				}
				if(!$scope.partner.section.homeAddress.state){
					$scope.validClass.stateL = 'invalid';
				}else if($scope.partner.section.homeAddress.state.trim().length === 0){
					$scope.validClass.stateL = 'invalid';
				}
				if(!$scope.partner.section.homeAddress.municipality){
					$scope.validClass.municipalityL = 'invalid';
				}else if($scope.partner.section.homeAddress.municipality.trim().length === 0){
					$scope.validClass.municipalityL = 'invalid';
				}
			}else {
				$scope.validClass.streetL       = 'invalid';
				$scope.validClass.numberExtL    = 'invalid';
				$scope.validClass.cpL           = 'invalid';
				$scope.validClass.colonyL       = 'invalid';
				$scope.validClass.stateL        = 'invalid';
				$scope.validClass.municipalityL = 'invalid';
			}
			
			if($scope.partner.section.laborAddress){
				
				if(!$scope.partner.section.laborAddress.street){
					$scope.validClass.streetLL = 'invalid';
				}else if($scope.partner.section.laborAddress.street.trim().length === 0){
					$scope.validClass.streetLL = 'invalid';
				}
				if(!$scope.partner.section.laborAddress.numberExt){
					$scope.validClass.numberExtLL = 'invalid';
				}else if($scope.partner.section.laborAddress.numberExt.trim().length === 0){
					$scope.validClass.numberExtLL = 'invalid';
				}
				if(!$scope.partner.section.laborAddress.cp){
					$scope.validClass.cpLL = 'invalid';
				}else if($scope.partner.section.laborAddress.cp.trim().length === 0){
					$scope.validClass.cpLL = 'invalid';
				}
				if(!$scope.partner.section.laborAddress.colony){
					$scope.validClass.colonyLL = 'invalid';
				}else if($scope.partner.section.laborAddress.colony.trim().length === 0){
					$scope.validClass.colonyLL = 'invalid';
				}
				if(!$scope.partner.section.laborAddress.state){
					$scope.validClass.stateLL = 'invalid';
				}else if($scope.partner.section.laborAddress.state.trim().length === 0){
					$scope.validClass.stateLL = 'invalid';
				}
				if(!$scope.partner.section.laborAddress.municipality){
					$scope.validClass.municipalityLL = 'invalid';
				}else if($scope.partner.section.laborAddress.municipality.trim().length === 0){
					$scope.validClass.municipalityLL = 'invalid';
				}
				
			}else {
				$scope.validClass.streetLL       = 'invalid';
				$scope.validClass.numberExtLL    = 'invalid';
				$scope.validClass.cpLL           = 'invalid';
				$scope.validClass.colonyLL       = 'invalid';
				$scope.validClass.stateLL        = 'invalid';
				$scope.validClass.municipalityLL = 'invalid';
			}
			/*** ------------------------------------------- */
			if($scope.partner.section.studies){
				if(!$scope.partner.section.studies.lastGrade){
					console.log('Viene indexistente ' )
					$scope.validClass.lastGrade = 'invalid';
				}else if($scope.partner.section.studies.lastGrade.trim().length === 0){
					console.log('Viene vacio ' )
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
			if(!$scope.partner.section.contractData.area){
				$scope.validClass.area = 'invalid';
			}else if($scope.partner.section.contractData.area.trim().length === 0){
				$scope.validClass.area = 'invalid';
			}
		}
	};
	
	$scope.addUpdate = () => {
		if($scope.partner.id){
			$scope.put();
		}else {
			$scope.post();
		}
	};
	
	$scope.confirmDelete = recordAdministrator => {
		swal({
			title: 'Esta seguro de eliminar a',
			text: recordAdministrator.name,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.delete(recordLegislator);
			};
		});
	};
	
	$scope.addDocuments = (leg) =>{
		$state.go('documentoPartner', {
			partnerId:leg.id,
			namePartner: leg.name+" "+leg.apPaterno+" "+leg.apMaterno,
			tipoPartner: leg.tipoPartner});
		
	};
	
	$scope.getPartners = () => {
		let sendData = {
				"status": 1,
				"tipo": 2,
				"areaId": $stateParams.id
		};
		
		partnerService.getByStatusAndTipoAndAreaId(sendData).then(data => {
			$scope.recordAdministrators = data;
		}, error => {
			swal.stopLoading();
			swal('Error', error, "error");
		});
	};
	
	$scope.getUserRols = () => {
		userService.getRol().then( data => {
			$scope.roleUser = data.find(element => element.roleName.toLowerCase()=='operador');
			console.log('role-user: ', $scope.roleUser);
		}, error => {
			swal('Error', 'Error al obtener los roles: '+error.statusText, "error");
		});
	};
	
	$scope.getArea = () => {
		let sendData = {
				"status": 1,
				"id": $stateParams.id
		};
		
		folderAdministratorService.getById(sendData).then(data => {
			$scope.area = data;
			console.log('Area encontrada: ',data);
		}, error => {
			swal.stopLoading();
			swal('Error', error, "error");
		});
	};
	
	
	
	$scope.fetchFile = filePath => {
		let sendData = {
				"filePath": filePath
		};
		storageService.getB64(sendData).then(response => {
			
			if($scope.partner){
				$scope.partner.foto.filePath = response.file;
			} else if($scope.recordAdministrator){
				$scope.recordAdministrator.foto.filePath = response.file;
			}
			
		}, errorResponse => {
			console.log('Error: ', errorResponse);
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
	
	$scope.delete = recordAdministrator => {
		recordAdministrator.status = 0;
		
		partnerService.put(recordAdministrator).then(data => {
			if(data){
				swal("Exito", "Expediente electrónico eliminado exitosamente", "success");
				$scope.getPartners();
			}
		}, error => {
			swal("Error", error, "error");
		});
	};
	
	$scope.cancelAddUp = () => {
		$scope.partner = null;
		$scope.validClass = null;
	};
	
	$scope.toReturn = () => {
		window.history.back();
	};
	
	const initController = () => {
		$scope.showPartners();
		$scope.getArea();
		$scope.getUserRols();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});