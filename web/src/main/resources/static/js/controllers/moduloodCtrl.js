app.controller('moduloodCtrl', function($scope, moduloodService, $timeout,$interval){

	$scope.modulosod = [];
	$scope.modulood = null;

	$scope.getModulosod = () =>{
		swal({
			title: "Consultandos modulos orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});

		moduloodService.get().then(function success(data){
			$scope.modulosod = data;
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
			},500);
		}, function error(response){
			$scope.myWelcome = response;
			swal.stopLoading();
			swal('Error', $scope.myWelcome, "error");
		});
	};

	$scope.postModulood = () => {
		swal({
			title: "Guardando modulo de orden del día",
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
				swal("Exito", "Modulo de orden del día agregado correctamente", "success");
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
				swal("Exito", "Modulo de orden del día actualizado correctamente", "success");
				$scope.getModulosod();
				$scope.modulood = null;
			} else {
				swal("Error", "Modulo de orden del día no actualizado", "error");
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
				$scope.postModulood();
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};

	$scope.confirmDelete = (modulood) =>{
		swal({
			title: 'Esta seguro de eliminara a',
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
				swal("Exito","Modulo eliminado exitosamente", "success");
				$scope.getModulosod();
			}
		}, function error(error){
			swal("Error","Modulo no eliminado","error");
		});
	};

	$scope.submitForm = (isValid) => {
		console.log('validForm');
		console.log(isValid);

		if(isValid) {
			$scope.addUpdate();
		}
	};


	$scope.addModulood = () => {
		$scope.modulood = {
				nombre: '',
				status: 1
		}
	};

	$scope.topReturn = () => {
		window.history.back();
	};
	
	$scope.addIcon = () =>{
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
		$scope.getModulosod();
	};

	angular.element(document).ready(function () {
		initController();
	});
});