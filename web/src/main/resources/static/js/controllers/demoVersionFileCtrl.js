/**
 *  Demo para hacer pruebas con las versiones de los archivos
 */
app.controller('demoVersionFileCtrl', function($scope, storageService, $filter){
	
	$scope.data = {};
	$scope.data.files = [{
		id: "",
		userId:"",
		originalName:"",
		serverName:"",
		folder:"",
		size:0,
		lastModification:new Date(),
		extention:"",
		mimeType:"",
		date: new Date(),
		status:0
	}];
	$scope.isAdd = true;
	$scope.changeToAdd =()=>{
		$scope.isAdd = true;
	};
	
	$scope.addNewVersion = (isValid) => {
		if(isValid){
		let fFiles = $filter('filter')($scope.data.files, {"status": 1}) ;
		dataFiles = {
			"files": $scope.data.filesUploads,
			"filesServerName":fFiles.map(f => f.serverName),
			"oldFolder": $scope.data.files[0].folder,
			"folder":'attached/p1f1r22t55h996a25sd',
			"userId":'israel'
		};
		
		console.log('Informacion enviada: ', dataFiles);
		storageService.newVersion(dataFiles).then(success=>{
			console.log('Informacion obtenida: ', success);
			$scope.data = {};
			$scope.data.files = success;
			$scope.message = "Informacion registrada exitosamente";
		}, error=>{
			console.error('Ha ocurrido un error al subir el archivo: ',error);
		})
		}
	};
});