app.controller('moduloodCtrl', function($scope, moduloodService, $timeout,$interval){

	$scope.modulosod = [];
	$scope.modulood = null;
	$scope.icons = [
		"fab fa-500px", "far fa-bell","far fa-bell-slash", "fas fa-braille", "fas fa-sign-language",
		"fas fa-tty","fas fa-bus", "fas fa-gas-pump","fas fa-campground", "fas fa-industry", "fas fa-landmark",
		"fas fa-book","fas fa-balance-scale","far fa-calendar-alt","fas fa-chart-line","fas fa-award",
		"fas fa-chart-bar","far fa-folder-open","fas fa-thumbtack", "fas fa-wallet", "far fa-compass",
		"fas fa-map-marked-alt", "far fa-handshake","far fa-heart", "fas fa-piggy-bank", "fas fa-donate",
		"far fa-smile","fas fa-graduation-cap", "fas fa-user-tie", "far fa-window-restore", "far fa-paper-plane",
		"fas fa-chalkboard","fas fa-inbox","fas fa-database","fas fa-atlas","fas fa-stamp"];
	
	$scope.showModulosod = () =>{
		swal({
			title: "Consultandos módulos orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});

		$scope.getModulosod();
		$timeout(()=>{
			swal.stopLoading();
			swal.close();
		},600);
	};
	
	$scope.getModulosod = () =>{
		moduloodService.get().then(function success(data){
			$scope.modulosod = data;
		}, function error(response){
			$scope.myWelcome = response;
			swal.stopLoading();
			swal('Error', $scope.myWelcome, "error");
		});
	};
	
	$scope.postModulood = () => {
		swal({
			title: "Guardando módulo de orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});

		moduloodService.post($scope.modulood).then(function success(data){
			if(data){
				swal("Exito", "Módulo de orden del día agregado correctamente", "success");
				swal.stopLoading();
				$scope.getModulosod();
				$scope.modulood = null;
			} else {
				swal("Error", "Modulo de orden del día no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Modulo de orden del día no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};

	$scope.putModulood = () => {
		swal({
			title: "Actualizando  modulo de orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		console.log('Modulo recibido', $scope.modulood);
		moduloodService.put($scope.modulood).then(function success(data){
			if(data){
				swal.stopLoading();
				swal("Exito", "Módulo de orden del día actualizado correctamente", "success");
				$scope.getModulosod();
				$scope.modulood = null;
			} else {
				swal("Error", "Módulo de orden del día no actualizado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal.stopLoading();
			swal("Error", $scope.myWelcome, "error");
		});
	};

	$scope.addUpdate = () => {
		if($scope.modulood != null){
			if($scope.modulood.id != null){
				$scope.putModulood();
			} else {
				let isRegister = $scope.modulosod.find(function(element){
					return element.nombre.toLowerCase() == $scope.modulood.nombre.toLowerCase();
				});
				if(!isRegister){
					$scope.postModulood();
				}else {
					swal({
						  title: "Dato duplicado",
						  text: "El nombre del módulo ya se encuentra registrado. Por favor intente con otro",
						  icon: "warning",
						  button: true
					})
				}
				
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};

	$scope.confirmDelete = (modulood) =>{
		swal({
			title: 'Esta seguro de eliminar a',
			text: modulood.nombre,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteModulood(modulood);
			};
		});
	};

	$scope.deleteModulood = modulood => {
		moduloodService.deleteModulood(modulood).then(function success(data){
			if(data){
				swal("Exito","Módulo eliminado exitosamente", "success");
				$scope.getModulosod();
			}
		}, function error(error){
			swal("Error","Módulo no eliminado","error");
		});
	};

	$scope.submitForm = (isValid) => {

		if(isValid) {
			$scope.addUpdate();
			$scope.validClass= {};
		} else {
			$scope.validClass= {};
			$scope.validClass.name = 'valid';
			$scope.validClass.icon = 'valid';
			$scope.validClass.color = 'valid';
			$scope.validClass.fieldHelp = 'valid';
			
			if($scope.modulood.nombre.replace(/ /g, "").length === 0){
				$scope.validClass.name = 'invalid';
			}
			if($scope.modulood.icon.replace(/ /g, "").length === 0){
				$scope.validClass.icon = 'invalid';
			}
		}
	};


	$scope.addModulood = () => {
		$scope.modulood = {
				nombre: '',
				icon:'',
				color: '#000000',
				fieldHelp: '',
				status: 1
		}
	};

	$scope.topReturn = () => {
		window.history.back();
	};
	
	$scope.selectThisIcon = icon =>{
		
		$scope.modulood.icon = icon;
		$('#modal-select-icon').modal('hide');
	}
	
	$scope.addMoreIcon = () =>{
		$('#modal-select-icon').modal('hide');
		let popup = parent.window.open('https://fontawesome.com/icons?d=gallery&m=free','Iconos','popup','width=600, height=700, t op=350,left=300,scrollbars=NO,menubar=NO,titlebar= NO,status=NO,toolbar=NO"');
		var timer = $interval(() => {
			if(popup.closed){
				$interval.cancel(timer);
				navigator.clipboard.readText()
				.then(text => {
					setTimeout(() => {
						$scope.$apply(()=>{
							let text1 = text.split('"');
							$scope.modulood.icon = text1[1];
							console.log('Pegado: ',text1);
						});
					}, 500);
					
				})
				.catch(err => {
					console.error('Fallamos!: ', err);

				});
			}
		}, 1000);
	};

	$scope.updateModuleod = (modulood) =>{
		
		$scope.modulood = modulood;
	};

	$scope.cancelAddUpModule = () =>{
		$scope.getModulosod();
		$scope.modulood = null;
	};

	const initController = () => {
		$scope.showModulosod();
	};

	angular.element(document).ready(function () {
		initController();
	});
});