/**
 * Demo para hacer pruebas con las versiones de los archivos
 */
app.controller('demoVersionFileCtrl', function($scope, storageService, $filter, orderdayService){
	
	$scope.attached = {};
	$scope.orderDay = {};
	$scope.isAdd = true;
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
	
	$scope.deleteFile = index => {
		$scope.orderDay.attached.files[index].status = 0;
	};
	
	
	$scope.addNewVersion = (isValid) => {
		if(isValid){
			let fFiles = $filter('filter')($scope.attached.files, {"status": 1});
			let dataFiles = {};
			
			if(fFiles){
				dataFiles = {
						"files": $scope.attached.filesUploads,
						"filesServerName":fFiles.map(f => f.serverName),
						"oldFolder": fFiles[0].folder,
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
		dataOD.attached.files = $scope.orderDay.attached.files.concat(newFiles);
		
		console.log('Orden del dia enviadad: ', dataOD);
		orderdayService.put(dataOD).then(success => {
			$scope.attached = {};
			$scope.orderDay = success;
			$scope.message = "Orden del día actualizada";
		}, error => {
			console.log('Error al actualizar el registro: ', error);
		});
	};
	
	const initController = () => {
		$scope.getOrderDay();
		
	};
	
	angular.element(document).ready(function (){
		initController();
	});
	
});