app.controller('archiveCtrl', function($scope, $filter,archiveService,$timeout, storageService, moduloodService, $stateParams){
	
	$scope.records   = [];
	$scope.archive   = null;
	$scope.moduleod  = null;
	$scope.showFiles = null;
	$scope.searchDateStart = new Date();
	$scope.searchDateEnd = new Date();

	// Reerstablece un tiempo para activar los tooltips
	$timeout(()=>{
		$(function () {
			  $('[data-toggle="tooltip"]').tooltip({animation:true, container: 'body'});
			})
	},1000);

	// Obtiene los documentos que se encuentran registrados
	$scope.getRecords = () => {
		swal({
			title: "Consultandos documentos",
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
	
	// Obtiene los documentos mediante un rango de fechas
	$scope.getRecordsBetweenDates = (searchDateStart, searchDateEnd) => {

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
		
		let dataFilter = {
				"status": 1,
				"moduloodid": $scope.moduleod.id,
				"moduloodstatus": 1,
				"datestart": $filter('date')(searchDateStart, "yyyy/MM/dd"),
				"dateend":$filter('date')(searchDateEnd, "yyyy/MM/dd")
				};
		archiveService.getRecordsBetweenDates(dataFilter).then(function success(data){
			$scope.records = data;
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
				$scope.isSearch=true;
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
	
	// Envia los datos para ser registrados
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
		console.log('Documento enviado: ',$scope.archive);
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
	
	// Envia los datos para ser actualizados
	$scope.putArchive = (files) => {
		
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
		
        // En caso que se haya cambiado el archivo se agrega el nombre
		if($scope.archive.filesUploads){
			for(let i=0; i<$scope.archive.files.length;i++){
				$scope.archive.files[i].status = 0;
			}
			$scope.archive.files = $scope.archive.files.concat(files);
		}

		archiveService.put($scope.archive).then(data=>{
			if(data){
				swal.stopLoading();
				swal('Exito','Archivo actualizado exitosamente','success');
				$scope.getRecords();
				$scope.archive = null;
			}else {
				swal('Error', 'Archivo no regsuccessistrado');
			}
		}, error=>{
			$scope.myWelcome = error.statusText;
			swal.stopLoading();
			swal('Error',$scope.myWelcome,'error');
		});
	};
	// Envia o actualiza la informacion sabiendo si el archivo ya cuenta con id
	$scope.addUpdate = () =>{
		if($scope.archive != null){
			if($scope.archive.id != null){
				$scope.updateFiles();
				$scope.isAdd = false;
			} else {
				if($scope.archive.filesUploads){
					$scope.saveFiles();
				}else {
					$scope.validForm();
				}
			}
		} else {
			console.log("Falta información para completar el registro");
		}
	};
	
	$scope.comfirmDelete = (archive) => {
		swal({
			title: 'Esta seguro de eliminar a',
			text: archive.nombre,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				
				swal({
					title: '¿También desea eliminar sus archivos?',
					text: 'Solo podrán ser recuperados manualmente',
					icon: "warning",
					dangerMode: true,
// buttons: true,
					buttons:{
						  cancel: {
							    text: "No",
							    value: null,
							    visible: true,
							    className: "btn-danger",
							    closeModal: true,
							  },
							  confirm: {
							    text: "Si",
							    value: true,
							    visible: true,
							    className: "btn-success",
							    closeModal: true
							  }
						}
				}).then((willDelete)=>{
					if(willDelete){
						$scope.deleteFolder(archive);
						
					}else {
						$scope.deleteArchive(archive);
					}
				});
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
	
	
	$scope.deleteFolder = (archive) => {
		let dataFolder = {
				folder: 'gazzete/'+$scope.moduleod.id,
				filesInfo: archive.files
		}
		
		storageService.delFolder(dataFolder).then(data=>{
			archive.files = data;
			$scope.deleteArchive(archive); 
		}, errorSuccess=>{
			
		});
	};
	
	
	$scope.comfirmDeleteFile = (doc,file) => {
		swal({
			title: 'Esta seguro de eliminara a',
			text: file.originalName,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteFile(doc, file);
			}
		});
	};

	$scope.deleteFile = (doc,file) => {
		
		file.status = 0;
		
		let dataFile = {
				urlServerFile: 'gazzete/'+$scope.moduleod.id+'/'+file.folder,
				serverName: file.serverName,
				originalName: file.originalName
				
		};
			
		storageService.delFile(dataFile).then(success=>{
				
			archiveService.put(doc).then(data=>{
				swal('Exito','Archivo eliminado exitosamente', 'success');
				$scope.getRecords();
				if(doc.files.length){
						$scope.isAdd = true;
				}
			}, error => {
					swal('Error','Archivo no eliminado', 'error');
				});
			}, errSuccess=>{
				swal('Error','Archivo no eliminado', 'error');
			});
			if($scope.showFiles){
		}else {
			$scope.archive.files[index].status = 0;
			console.log('Archivo a eliminar: ',$scope.archive);
		}
	};
	
	$scope.submitForm = isValid => {
		$scope.validClass = {};
		if(isValid){
			$scope.addUpdate();
		} else {
			$scope.validForm();
		}
	};
	
	$scope.validForm = () => {
		
		$scope.validClass.date        = 'valid';
		$scope.validClass.name        = 'valid';
		$scope.validClass.file        = 'valid';
		$scope.validClass.description = 'valid';
		
		if($scope.archive.nombre.replace(/ /g, "").length === 0) {
			$scope.validClass.name = 'invalid';
		}

		if($scope.archive.filesUploads === undefined){
			$scope.validClass.file = 'invalid';
		}
	};
	
	$scope.downloadFile = (file) => {
		let data = {
				path: 'gazzete/'+$scope.moduleod.id+'/'+file.folder,
				filename: file.serverName
		}; 
		storageService.download(data).then(arraybuffer=>{
			let f = new Blob([arraybuffer],{type: file.mimeType});
			let fileURL = URL.createObjectURL(f);
			let link = document.createElement('a');
			link.href = fileURL;
			link.download=file.originalName;
			link.click();
			$timeout(()=>{
				delete f;
				delete fileURL;
				delete link;
				
			},500);
		}, error=>{
			console.error('Error al descargar el archivo:', error);
		});
	};
	
	$scope.showDownloadFile = (file) => {
		let data = {
				path: 'gazzete/'+$scope.moduleod.id+'/'+file.folder,
				filename: file.serverName
		}; 
		storageService.download(data).then(arraybuffer=>{
			let f = new Blob([arraybuffer],{type: file.mimeType});
			let fileURL = URL.createObjectURL(f);
			let link = document.createElement('a');
			
			document.getElementById('object-data').type=file.mimeType;
			document.getElementById('object-data').data=fileURL;
			
			$scope.fileName = file;
		}, error=>{
			console.error('Error al descargar el archivo:', error);
		});
	};
	
	
	$scope.saveFiles = ()=>{
		let file = {
				files: $scope.archive.filesUploads,
				folder: 'gazzete/'+$scope.moduleod.id,
				userId: 'israel'
		};
		console.log('Archivo enviados: ', file);
		storageService.saveFiles(file).then(success=>{
			if(success.length){
				$scope.postArchive(success);
			}
			
		}, error=>{
			console.error('Error al enviar el archivo:', error);
		});
	};
	
	$scope.updateFiles = () => {
		let fFiles = $filter('filter')($scope.archive.files, {"status": 1}) ;
		console.log('Archivos', fFiles);
		let file = {
				files: $scope.archive.filesUploads,
				oldServerNames: fFiles.map(f => f.originalName),
				oldOriginalNames:  fFiles.map(f => f.serverName),
				folder: 'gazzete/'+$scope.moduleod.id+'/'+$scope.archive.files[0].folder,
				userId: 'israel',
				status: 1
		};
		console.log('informacion enviada: ',file);
		storageService.updateFiles(file).then(success=>{
			$scope.putArchive(success);
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
		
	};
	
	$scope.showDocument = (archive) => {;
		$scope.showFiles = archive;
	};
	
	$scope.updateArchive = archive => {
		archive.fecha = new Date(archive.fecha);
		$scope.archive = archive;
	};
	
	$scope.topReturn = () => {
		window.history.back();
	};
	
	$scope.cancelSearch = () => {
		$scope.getRecords();
		$scope.searchArchive = null;
		$scope.isSearch=false;
		$scope.searchDateStart = new Date();
		$scope.searchDateEnd = new Date();
		
	};

	$scope.filterExtention = (extencion) => {
		let ignores = ["doc","pptx","xls", "docx"];
		let filter = $filter('filter')(ignores,extencion);
		
		if(filter.length){
			return false;
		}else {
			return true;
		}
	};
	
	$scope.cancelAddUpdate = () => {
		$scope.getRecords();
		$scope.isAdd = false;
		$scope.archive = null;
		
	};
	
	$('#modal-show-file').on('hidden.bs.modal', function (e) {
		document.getElementById('object-data').type=null;
		document.getElementById('object-data').data=null;
		
		$scope.fileName = null;
		});
	$('#modal-show-files').on('hidden.bs.modal', function (e) {
		$scope.showFiles = null
		});
	
	const initController = () => {
		$scope.getModuleOd();
		$scope.searchDateStart = new Date();
		$scope.searchDateEnd = new Date();
		
	};
	
	angular.element(document).ready(function (){
		initController();
	});
});
