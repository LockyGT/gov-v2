app.controller('archiveCtrl', function($scope, archiveService,$timeout, storageService){
	$scope.records = [];
	$scope.archive = null;
	
	$scope.getRecords = () => {
		swal({
			title: "Consultandos archivos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		archiveService.get().then(function success(data){
			$scope.records = data;
			
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
			},500);
		}, function error(response){
			$scope.myWelcome = response();
			swal.stopLoading();
			swal('Error', $scope.myWelcome, "error");
		});
	};
	
	$scope.postArchive = () => {
		swal({
			title: "Guardando archivo",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		archiveService.post($scope.archive).then(success=>{
			if(data){
				swal('Exito','Archivo agregado exitosamente', 'success');
				swal.stopLoading();
				$scope.getRecords();
				$scope.archive = null;
			}else {
				swal('Error','Archivo no agreado','error');
			}
		}, error=>{
			$scope.myWelcome = error.statusText;
			swal('Error','Archivo no agregado '+$scope.myWelcome, 'error');
			swal.stopLoading();
		});
	};
	
	$scope.putArchive = () => {
		swal({
			title: "Actualizando  archivo",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		archiveService.put($scope.archive).then(data=>{
			if(data){
				swal.stopLoading();
				swal('Exito','Archivo actualizado exitosamente','success');
				$scope.getRecords();
				$scope.archive = null;
			}else {
				swal('Error', 'Archivo no registrado');
			}
		}, error=>{
			$scope.myWelcome = error.statusText;
			swal.stopLoading();
			swal('Error',$scope.myWelcome,'error');
		});
	};
	
	$scope.addUpdate = () =>{
		if($scope.archive != null){
			if($scope.archive != null){
				$scope.putArchive();
			} else {
				$scope.postArchive();
			}
		} else {
			console.log("Falta información para completar el registro");
		}
	};
	
	$scope.comfirmDelete = (archive) => {
		swal({
			title: 'Esta seguro de eliminara a',
			text: archive.titulo,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteArchive(archive);
			}
		});
	};
	
	$scope.deleteArchive = archive => {
		archiveService.delArchive(archive).then(data=>{
			swal('Exito','Archivo eliminado exitosamente', 'success');
			$scope.getRecords();
		}, error=>{
			swal('Error','Archivo eliminado exitosamente', 'error');
		});
	};
	
	$scope.submitForm = isValid => {
		console.log('Ingresando al submit');
		if(isValid){
			$scope.addUpdate();
		}
	};
	
	$scope.addArchive = () => {
		$scope.archive = {
				fecha: '',
				nombre: '',
				descripcion: '',
				urlArchivo: ''
		};
	};
	
	$scope.updateArchive = archive => {
		$scope.archive = archive;
	};
	
	$scope.cancelAddUpdate = () => {
		$scope.getRecords();
		$scope.archive = null;t
	};
	
	const initController = () => {
		$scope.getRecords();
	};
	
	angular.element(document).ready(function (){
		initController();
	});
});
