
app.controller('documentoPartnerCtrl', function($scope,partnerService,$window,documentoPartnerService,$state,storageService,$timeout, $filter, categoriaDeDocumentosService){
	$scope.partnerDocuments = [];
	$scope.filesInfo = [];
	$scope.STATUS_ACTIVE = 1;
	$timeout(()=>{
		$(function () {
		  $('[data-toggle="tooltip"]').tooltip({
			  animation: true,
		    container: document.getElementById('container-form')
		  })
		})
	},500);
	
	
	$scope.loadDocuments = () => {
		$scope.namePartner = $state.params.namePartner;
		console.log('Params: ', $state.params)
		documentoPartnerService.get($state.params.partnerId).then(function mySuccess(data) {			
			$scope.partnerDocuments = data;
			console.log(data);
		}, function myError(response) {
			console.log(response);
		});
	}
	
    $scope.uploadFile = function(event){
        $scope.file = event.target.files;
        $scope.index = event.currentTarget.attributes[3].value;
        $scope.partnerDocument = $scope.partnerDocuments[$scope.index];
        let repeat = '';
        
        angular.forEach($scope.file, function(tmpEl){
        	if($scope.isNotRepeat(tmpEl.name)){
        		repeat += '-'+tmpEl.name+'\n';
        	}
        });
        if(!repeat.length){
        	console.log($scope.partnerDocument);
        	$scope.postArchive($scope.file,$scope.partnerDocument);
        	$scope.response = true;
        } else {
        	$scope.response = false;
        	swal({
    			title: "Archivos repetidos",
    			text: "Los siguientes archivos ya se encuentran registrados: "+repeat,
    			icon: 'warning',
    			button: {
    				text: "Ok"
    			}
    		}); 
        }
    };
    
    $scope.confirmDelete = (partnerDocument,fileInfo) => {
    	swal({
    		title: "Eliminar archivo",
    		text: "¿Esta seguro de eliminar el archivo?",
    		icon: "warning",
    		buttons: true,
    		dangerMode: true
    	}).then(willDelete => {
    		if(willDelete) {
    			$scope.deleteFile(fileInfo, partnerDocument);
    		}
    	});
    };
    
    $scope.downloadFile = function(archivo){
    	$scope.getOldFileNames = archivo.split(",");
    	let file = {
    			path: $scope.getOldFileNames[1],
    			filename:$scope.getOldFileNames[0]		
    	}
    	
    	storageService.download(file).then(success => {
			if(success){
				var byteArray = new Uint8Array(success);
				var a = window.document.createElement('a');

				a.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
				a.download = $scope.getOldFileNames[2];

				// Append anchor to body.
				document.body.appendChild(a)
				a.click();


				// Remove anchor from body
				document.body.removeChild(a)
				 console.log(success);
			}else {
				swal('Error','Error al bajar archivo','error');
			}
		}, error=>{
			console.log('');
		});
    };
    
    $scope.showFile = fileName => {
    	$scope.showFileName = fileName.split(',');
    	let file = {
    			path: $scope.showFileName[1],
    			filename:$scope.showFileName[0]		
    	}
    	
    	storageService.download(file).then(success => {
			if(success){
				var byteArray = new Uint8Array(success);
				let fileURL = window.URL.createObjectURL(new Blob([success], { type: 'application/pdf' }));

				document.getElementById('object-data').type='application/pdf';
				document.getElementById('object-data').data=fileURL;

			}else {
				swal('Error','Error al bajar archivo','error');
			}
		}, error => {
			console.log('Error: ', error)
		});
    };
    
    $scope.deleteFile = (fileInfo,partnerDocument) => {
		swal({
			title: "Eiminando archivo",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		}); 
		$scope.getOldFileNames = fileInfo.split(",");
		let file = {
			urlServerFile: $scope.getOldFileNames[1],
			serverName: $scope.getOldFileNames[0],
			originalName: $scope.getOldFileNames[2]
			
		}
		storageService.delFile(file).then(success => {
			if(success){
				
				let i = partnerDocument.archivos.findIndex(el => el==fileInfo);
				
				partnerDocument.archivos[i] = $scope.getOldFileNames[0] +","+$scope.getOldFileNames[1]+","+$scope.getOldFileNames[2]+","+$scope.getOldFileNames[3]+",0";
				console.log('Informacion para eliminar: ', partnerDocument);
				$scope.putArchive(partnerDocument);
			}else {
				swal('Error','Archivo no agreado','error');
			}
		}, error=>{
			swal('Error','Archivo no agregado no fue agregado', 'error');
			swal.stopLoading();
		});
	};
	
    $scope.postArchive = (files,partnerDocument) => {
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
		let file = {
			files:files,
			folder:'partner/'+$state.params.partnerId,
			userId: ''
		}
		storageService.saveAttached(file).then(success => {
			if(success){
				swal('Exito','Archivo(s) agregado exitosamente', 'success');
				console.log(success);
				
				let newFiles = [];
				angular.forEach(success.files,function(file){
					newFiles.push(file.serverName +","+success.originFolder+","+
							file.originalName.replace(',',"")+","+file.extention+",1");
				});
				if(partnerDocument.archivos){
					partnerDocument.archivos = partnerDocument.archivos.concat(newFiles);
				} else {
					partnerDocument.archivos = newFiles;
				}
				
				console.log('Informacion de archivos enviada; ', partnerDocument);
				//partnerDocument.archives = success.serverName +","+success.folder+","+success.originalName;
				documentoPartnerService.post(partnerDocument).then(function mySuccess(data) {			
					swal.stopLoading();
					$scope.loadDocuments();
				}, function myError(response) {
					console.log(response);
				});
			}else {
				swal('Error','Archivo no agreado','error');
			}
		}, error=>{
			swal('Error','Archivo no agregado no fue agregado', 'error');
			swal.stopLoading();
		});
	};
	
	$scope.putArchive = partnerDocument => {
		documentoPartnerService.put(partnerDocument).then(data => {
			swal('Exito','Información actualizada', 'success');
		}, error => {
			swal('Error','Ha ocurrido un error', 'error');
			console.log('Ha ocurrido un error: ', error);
		});
	};
	
	$scope.getCategoriaDeDocumentosByTipoPartner = () =>{
		if($state.params.tipoPartner == 1){
			$scope.categoriaDeDocumentos ={id:null,documentos:[],tipoPartner:$state.params.tipoPartner,nombreCategoria: 'Legislador'};
		} else if($state.params.tipoPartner == 2) {
			$scope.categoriaDeDocumentos ={id:null,documentos:[],tipoPartner:$state.params.tipoPartner,nombreCategoria: 'Operador'};
		}
		
		categoriaDeDocumentosService.get($state.params.tipoPartner).then(function mySuccess(data) {			
			$scope.categoriaDeDocumentosTemp = data;
		}, function myError(response) {
			console.log(response);
		});
	};

	$scope.addNewCategory = () => {
		$scope.getCategoriaDeDocumentosByTipoPartner();
		$scope.documentoAux = {
				status: $scope.STATUS_ACTIVE
		};
		$('#modal-new-category').modal({backdrop: 'static', keyboard: false})
	};
	
	$scope.editCategory = (category) => {
		$('#modal-new-category').modal({backdrop: 'static', keyboard: false})
		$scope.getCategoriaDeDocumentosByTipoPartner();
		$scope.documentoAux = category;
		$scope.categoryCopy = {};
		angular.copy(category, $scope.categoryCopy);
	};
	
	$scope.cancel = () => {
		$scope.loadDocuments();
		$scope.documentoAux = null;
	};
	
	$scope.confirmDeleteCategory = category => {
		swal({
    		title: "Eliminar Categoría",
    		text: "¿Esta seguro de eliminar la categoría?",
    		icon: "warning",
    		buttons: true,
    		dangerMode: true
    	}).then(willDelete => {
    		if(willDelete) {
    			$scope.getCategoriaDeDocumentosByTipoPartner();
    			$scope.deleteCategory(category);
    		}
    	});
	};
	$scope.deleteCategory = category => {
		category.status = 0;
		$scope.categoryIndex = $scope.categoriaDeDocumentosTemp.documentos.findIndex(r => r.uuid === category.uuid);
		$scope.categoriaDeDocumentosTemp.documentos[$scope.categoryIndex] = category;
		categoriaDeDocumentosService.put($scope.categoriaDeDocumentosTemp).then(success => {
			swal('Exito','Categoría eliminada correctamente','success');
			$scope.loadDocuments();
		}, error => {
			console.log('Error: ', error);
			swal('Error','Ha ocurrido un error','error');
		});
		
	};
	
	$scope.updateCategory = () => {
		if(!$scope.isNotRepeatCategory($scope.documentoAux.titulo)) {
			$scope.categoryIndex = $scope.categoriaDeDocumentosTemp.documentos.findIndex(r => r.uuid === $scope.documentoAux.uuid);
			$scope.categoriaDeDocumentosTemp.documentos[$scope.categoryIndex] = $scope.documentoAux;
			categoriaDeDocumentosService.put($scope.categoriaDeDocumentosTemp).then(success => {
				$('#modal-new-category').modal('hide');
				swal('Exito','Categoría actualizada correctamente','success');
				$scope.loadDocuments();
			}, error => {
				console.log('Error: ', error);
				swal('Error','Ha ocurrido un error','error');
			});
		} else {
			swal('Error','No puede repetir categrías con el mismo nombre','error');
		}
	};
	
	$scope.postCategory = () => {
		
		if(!$scope.isNotRepeatCategory($scope.documentoAux.titulo)){
			$scope.documentoAux.uuid = '';
			$scope.documentoAux.uuid = $scope.createUUID();
			$scope.documentoAux = {};
			$scope.categoriaDeDocumentosTemp.documentos.push($scope.documentoAux);
			categoriaDeDocumentosService.put($scope.categoriaDeDocumentosTemp).then(success => {
				$('#modal-new-category').modal('hide');
				swal('Exito','Categoría registrada correctamente','success');
				$scope.loadDocuments();
			}, error => {
				console.log('Error: ', error);
				swal('Error','Ha ocurrido un error','error');
			});
		} else {
			swal('Error','No puede repetir categorías con el mismo nombre','error')
		}
	};
	
	$scope.isNotRepeat = name => {
		return $scope.partnerDocument.archivos.find(tmpName => {
			return (tmpName.split(',')[2] === name && tmpName.split(',')[4] === "1"); 
			});
	};
	
	$scope.isNotRepeatCategory = name => {
		return $scope.categoriaDeDocumentosTemp.documentos.find(tmpName => {
			return (tmpName.titulo.toLowerCase() === name.toLowerCase() && tmpName.status === 1); 
			});
	};
	
	$scope.isVisible = extencion => {
		let accept = ["pdf"];
		let filter = accept.find(el => el === extencion);
		
		return filter?true:false;

	};
	
	$scope.lengthFiles = archivos => {
		let f = $filter('filter')(archivos, $scope.filterFiles);
		if(f){
			return f.length? true: false;
		}else {
			return false;
		}
		
	};
	
	$scope.filterFiles = e =>{ 
		let info = e.split(",");
		return info[info.length-1] === "1"
	};
	
	$scope.createUUID = () =>{
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};
	
	const initController = () => {
		$scope.loadDocuments();
		
	};
	
	angular.element(document).ready(function (){
		initController();
	});
	
});