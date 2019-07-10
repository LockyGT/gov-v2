
app.controller('documentoPartnerCtrl', function($scope,partnerService,$window,documentoPartnerService,$state,storageService){
	$scope.partnerDocuments = [];
	$scope.filesInfo = [];
	
	$scope.loadDocuments = () => {
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
        console.log($scope.partnerDocument);
        //if($scope.partnerDocument.archivos == null){
			$scope.postArchive($scope.file,$scope.partnerDocument);
//        }else{
//        	swal({
//    			title:"Reemplazar archivo",
//    			text: "Estas seguro de remplazar archivo?",
//    			icon: "warning",
//    			buttons: true,
//    			dangerMode: true,
//    		}).then((willDelete) => {
//    			if (willDelete) {
//    				$scope.deleteFile($scope.file,$scope.partnerDocument);
//    			}
//    		});
//        }

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
    
    $scope.deleteFile = (files,partnerDocument) => {
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
		$scope.getOldFileNames = partnerDocument.acrhivo.split(",");
		let file = {
			urlServerFile:'partner/' + $scope.getOldFileNames[1],
			serverName:$scope.getOldFileNames[0],
			originalName:$scope.getOldFileNames[2]
			
		}
		storageService.delFile(file).then(success=>{
			if(success){
				 $scope.postArchive(files,partnerDocument);
			}else {
				swal('Error','Archivo no agreado','error');
			}
		}, error=>{
			swal('Error','Archivo no agregado no fue agregado', 'error');
			swal.stopLoading();
		});
	};
    
	$scope.isVisible = extencion => {
		let accept = ["pdf"];
		let filter = accept.find(el => el === extencion);
		
		return filter?true:false;

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
					newFiles.push(file.serverName +","+success.originFolder+","+file.originalName+","+file.extention);
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
	
	$scope.addNewCategory = () => {
		$state.go('documentoPartner', {tipoPartner: 1, partnerId: $state.params.partnerId});
	};
	
	const initController = () => {
		$scope.loadDocuments();
	};
	
	angular.element(document).ready(function (){
		initController();
	});
	
});