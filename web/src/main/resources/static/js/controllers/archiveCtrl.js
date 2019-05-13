app.controller('archiveCtrl', function($scope, archiveService,$timeout, storageService, moduloodService, $stateParams){
	
	$scope.records   = [];
	$scope.archive   = null;
	$scope.moduleod  = null;
	$scope.showFiles = null;
	
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
		
		archiveService.get($scope.moduleod.id).then(function success(data){
			$scope.records = data;
			
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
	
	$scope.getModuleOd = (files)=>{
		moduloodService.getByModuloId($stateParams.id).then(success=>{
			$scope.moduleod = success;
			$scope.getRecords();
		}, error=>{
			console.log('Error al obtener la informacion del modulo');
		});
	}
	
	$scope.postArchive = (files) => {
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
		$scope.archive.files = files; 
		$scope.archive.modulood = $scope.moduleod;
		console.log('Documento enviado: ',$scope.archive );
		archiveService.post($scope.archive).then(success=>{
			if(success){
				swal('Exito','Archivo agregado exitosamente', 'success');
				$scope.archive = null;
				swal.stopLoading();
				$scope.getRecords();
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
		
//		En caso que se haya cambiado el archivo se agrega el nombre
		if($scope.archive.files[0].name){
			$scope.updateFile();
			$scope.archive.urlArchivo = $scope.archive.urlArchivo.name;
		}
		
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
			if($scope.archive.id != null){
				$scope.putArchive();
			} else {
				$scope.saveFiles();
			}
			$scope.isAdd = false;
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
			swal('Exito','Documento eliminado exitosamente', 'success');
			$scope.getRecords();
		}, error=>{
			swal('Error','Archivo eliminado exitosamente', 'error');
		});
	};
	
	$scope.comfirmDeleteFile = (doc,index) => {
		swal({
			title: 'Esta seguro de eliminara a',
			text: doc.files[index].originalName,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteFile(doc, index);
			}
		});
	};
	
	$scope.deleteFile = (doc,index) => {
		
		doc.files[index].status = 0;
		if($scope.showFiles){
			$scope.showFiles.files[index].status = 0;
			archiveService.put(doc).then(data=>{
				swal('Exito','Archivo eliminado exitosamente', 'success');
				$scope.getRecords();
				if(doc.files.length){
					$scope.isAdd = true;
				}
			}, error => {
				swal('Error','Archivo eliminado exitosamente', 'error');
			});
		}else {
			$scope.archive.files[index].status = 0;
			console.log('Archivo a eliminar: ',$scope.archive);
		}
	};
	
	$scope.submitForm = isValid => {
		console.log('Ingresando al submit');
		if(isValid){
			$scope.addUpdate();
		}
	};
	
	$scope.downloadFile = (doc, file) => {
		let data = {
				path: 'gazzete/'+$scope.moduleod.nombre+'/'+doc,
				filename: file.serverName
		}; 
		
		console.log('Informacion enviada: ',file);
		storageService.download(data).then(success=>{
			console.log('Informacion descargada: ', success);
		}, error=>{
			console.error('Error al descargar el archivo:', error);
		});
	};
	
	$scope.saveFiles = ()=>{
		let file = {
				files: $scope.archive.files,
				folder: 'gazzete/'+$scope.moduleod.nombre+'/'+$scope.archive.nombre,
				userId: 'israel'
		};
		console.log('Archivor enviados: ', file);
		storageService.saveFiles(file).then(success=>{
			if(success.length){
				$scope.postArchive(success);
			}
			
		}, error=>{
			console.error('Error al enviar el archivo:', error);
		});
	};
	
	$scope.updateFile = () => {
		let file = {
				file: $scope.archive.urlArchivo,
				oldFileName: $scope.oldFileName.name,
				folder: 'gazzete/'+$scope.moduleod.nombre+'/'+$scope.archive.folder,
				oldFolder: 'gazzete/'+$scope.moduleod.nombre+'/'+$scope.oldFileName.folder
		};
		
		storageService.update(file).then(success=>{
			console.log('Informacion recibida: ', success);
		}, error=>{
			console.error('Error al enviar el archivo:', error);
		});
	};
	
	$scope.changeToAdd = () => {
		$scope.oldFileName = {
				name: $scope.archive.urlArchivo,
				folder: $scope.archive.nombre
		}
		$scope.isAdd = true;
	};
	
	$scope.addArchive = () => {
		
		$scope.isAdd = true;
		$scope.archive = {
				fecha: new Date(),
				nombre: '',
				descripcion: '',
				files: '',
				status:1
		};
		
		console.log('archivo: ',$scope.archive);
	};
	
	$scope.showDocument = (archive) => {
		console.log('Archivos: ', archive);
		$scope.showFiles = archive;
	};
	
	$scope.updateArchive = archive => {
		console.log('Archivo para actualizar: ', archive);
		archive.fecha = new Date(archive.fecha);
		$scope.archive = archive;
	};
	$scope.topReturn = () => {
		window.history.back();
	};
	
	$scope.cancelAddUpdate = () => {
		$scope.getRecords();
		$scope.isAdd = false;
		$scope.archive = null;

	};
	
	const initController = () => {
		$scope.getModuleOd();
		
	};
	
	angular.element(document).ready(function (){
		initController();
	});
});
