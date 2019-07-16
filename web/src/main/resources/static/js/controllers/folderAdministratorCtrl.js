app.controller('folderAdministratorCtrl', function($scope, folderAdministratorService, $timeout) {
	
	$scope.STATUS_ACTIVE   = 1;
	$scope.STATUS_INACTIVE = 0;
	$scope.folders         = [];
	$scope.folder          = {
			status: $scope.STATUS_ACTIVE
	};
	
	$scope.showFolders = () => {
		swal({
			title: "Consultando área administrativos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		$scope.get();
		$timeout(()=>{
			swal.stopLoading();
			swal.close();
		},600);
	};
	
	
	$scope.update = folder => {
		angular.copy(folder, $scope.folder);
	};
	
	$scope.cancel = () => {
		$scope.folder = {};
	};
	
	$scope.submitForm = isValid => {
		if(isValid) {
			$scope.addUpdate();
		}
	};
	
	$scope.addUpdate = () => {
	
		let isRegister = $scope.folders.find(function (element) {
			return element.name.toLowerCase() == $scope.folder.name.toLowerCase();
		});
		
		if(!isRegister) {
			if($scope.folder.id) {
				$scope.put();
			} else {$scope.post();}
		} else {
			swal({
				title: "Dato duplicado",
				text: "El nombre del área ya se encuentra registrado, por favor intente con otro",
				icon: "warning",
				button: true
			});
		}
	};
	
	$scope.setView = view => {
		$scope.view = view;
	}
	
	$scope.confirmDelete = (folder) => {
		swal({
			title: 'Esta seguro de eliminar a',
			text: folder.name,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteFolder(folder);
			};
		});
	}
	
	$scope.get = () => {
		folderAdministratorService.get($scope.STATUS_ACTIVE).then(data => {
			$scope.folders = data;
		}, error => {
			swal.stopLoading();
			swal("Error", "Al cargar las áreas", "error");
		});
	};
	
	$scope.post = () => {
		swal({
			title: "Guardando ára para administrativios",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		folderAdministratorService.post($scope.folder).then(data => {
			if(data) {
				swal("Exito", "Área agregada correctamente", "success");
				swal.stopLoading();
				$scope.get();
				$scope.folder = {};
			}
		}, error => {
			swal.stopLoading();
			swal("Error", "Área no agregada", "error");
		});
	};
	
	$scope.put = () => {
		swal({
			title: "Actualizando ára para administrativos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		folderAdministratorService.put($scope.folder).then(data => {
			if(data) {
				swal("Exito", "Área actualizada correctamente", "success");
				swal.stopLoading();
				$scope.get();
				$scope.folder = {};
			}
		}, error => {
			swal.stopLoading();
			swal("Error", "Área no actualizada", "error");
		});
	};
	
	$scope.deleteFolder = folder => {
		folder.status = $scope.STATUS_INACTIVE;
		folderAdministratorService.del(folder).then(data => {
			if(data) {
				swal("Exito", "Área eliminada correctamente", "success");
				$scope.get();
			}
		}, error => {
			swal.stopLoading();
			swal("Error", "Área no eliminada", "error");
		});
	};
	
	const initController = () => {
		$scope.showFolders();
	};
	
	angular.element(document).ready(function() {
		initController();
	});
});