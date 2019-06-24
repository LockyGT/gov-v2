
app.controller('documentoPartnerCtrl', function($scope,partnerService,$window,documentoPartnerService,$state,storageService){
	$scope.partnerDocuments = [];
	
	$scope.loadDocuments = () => {
		documentoPartnerService.get($state.params.partnerId).then(function mySuccess(data) {			
			$scope.partnerDocuments = data;
			console.log(data);
		}, function myError(response) {
			console.log(response);
		});
	}
	
    $scope.uploadFile = function(event){
        $scope.file = event.target.files[0];
        $scope.index = event.currentTarget.attributes[3].value;
        $scope.partnerDocument = $scope.partnerDocuments[ $scope.index];
        console.log($scope.partnerDocument);
        if($scope.partnerDocument.acrhivo == null){
			console.log("agregar");
			$scope.postArchive($scope.file,$scope.partnerDocument);
        }else{
        	swal({
    			title:"Reemplazar archivo",
    			text: "Estas seguro de remplazar archivo?",
    			icon: "warning",
    			buttons: true,
    			dangerMode: true,
    		}).then((willDelete) => {
    			if (willDelete) {
    				$scope.deleteFile($scope.file,$scope.partnerDocument);
    			}
    		});
        }

    };
    $scope.downloadFile = function(partnerDocument){
    	$scope.getOldFileNames = partnerDocument.acrhivo.split(",");
    	let file = {
    			path:'partner/' + $scope.getOldFileNames[1],
    			filename:$scope.getOldFileNames[0]		
    	}
    	
    	storageService.download(file).then(success=>{
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
			file:files,
			folder:'partner'
		}
		storageService.save(file).then(success=>{
			if(success){
				swal('Exito','Archivo agregado exitosamente', 'success');
				console.log(success);
				partnerDocument.acrhivo = success.serverName +","+success.folder+","+success.originalName;
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
	
	
	const initController = () => {
		$scope.loadDocuments();
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});