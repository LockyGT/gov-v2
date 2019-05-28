/**
 * Demo para hacer pruebas con las versiones de los archivos
 */
app.controller('demoVersionFileCtrl', function($scope, storageService, $filter, orderdayService){
	
	$scope.attached = {};
	$scope.orderDay = {};
	$scope.changeToAdd =()=>{
		$scope.isAdd = true;
	};
	
	$scope.getOrderDay = () => {
		let data = {
				id: '5ce6e8737739125ae54ed495'
		};
		
		orderdayService.getById(data).then(success => {			
			console.log('Informacion rescibida: ', success);
			$scope.orderDay = success;
//			$scope.orderDay.attached={
//				files:[]
//			};
		}, error=>{
			console.log('Error al obtener la Orden del día: ', error);
		});
	};
	
	$scope.deleteFile = fl => {
		fl.status = 0;
	};
	
	
	$scope.addNewVersion = (isValid) => {
		if(isValid){
			let fFiles = $filter('filter')($scope.orderDay.attached.files, {"status": 1});
			let dataFiles = {};
			
			if(fFiles){
				dataFiles = {
						"files": $scope.attached.filesUploads,
						"filesServerName":fFiles.map(f => f.serverName),
						"oldFolder": $scope.orderDay.attached.originFolder,
						"folder":'attached',
						"userId":'israel'
				};
			}else {
				dataFiles = {
						"files": $scope.attached.filesUploads,
						"filesServerName":[],
						"oldFolder": "",
						"folder":'attached',
						"userId":'israel'
				};
			}
			
			console.log('Informacion enviada: ', dataFiles);
			storageService.newVersion(dataFiles).then(success=>{
				console.log('Informacion obtenida: ', success);
				
				$scope.updateOrderDay(success);
				$scope.message = "Archivos subidos";
			}, error=>{
				console.error('Ha ocurrido un error al subir el archivo: ',error);
			});
		}
	};
	
	$scope.updateOrderDay = newFiles => {
		let dataOD = $scope.orderDay;
		dataOD.attached.status = 1;
		dataOD.attached.originFolder = newFiles.originFolder;
		dataOD.attached.files = $scope.orderDay.attached.files.concat(newFiles.files);
		
		console.log('Orden del dia enviadad: ', dataOD);
		orderdayService.put(dataOD).then(success => {
			$scope.attached = {};
			$scope.orderDay = success;
			$scope.message = "Orden del día actualizada";
		}, error => {
			console.log('Error al actualizar el registro: ', error);
		});
	};
	
	$scope.downloadZip=()=>{
		console.log('Intentando descargar archivos: prueba -1');
		
		let fFiles = $filter('filter')($scope.orderDay.attached.files, {"status":1});
		let folder= {
				serverNames: fFiles.map(f=> f.serverName),
				originalNames:fFiles.map(f=> f.originalName),
				folder: 'attached/'+$scope.orderDay.attached.originFolder
		};
		storageService.downloadZip(folder).then(arraybuffer=>{
			let f = new Blob([arraybuffer], {type:"application/zip"});
			let fileURL = URL.createObjectURL(f);
			let link = document.createElement('a');
			link.href = fileURL;
			link.download = "source.zip";
			link.click();
			$timeout(()=>{
				delete f;
				delete fileURL;
				delete link;
				
			},500);
		}, error=>{
			
		});
	};
	
	const initController = () => {
		$scope.getOrderDay();
		
	};
	
	angular.element(document).ready(function (){
		initController();
	});
	
});