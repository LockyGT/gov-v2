app.controller('orderOfTheDayCtrl', function($rootScope, $timeout, $filter, $scope, $window, $log, $filter, $state,orderdayService, _ORDERDAY,storageService,elementOdService) {
	var self = this;
	$scope.odgazzete=null;
	$scope.orderday={};
	$scope.attached = {};
	$scope._ORDERDAY = _ORDERDAY;
	$scope.filtrosFechas = {};
	$scope.filtrosFechas.fechaInicio = new Date();
	$scope.filtrosFechas.fechaFin = new Date();
	$scope.fecha= new Date();

	
//	$scope.getStatusString = (status)=>{
//		let statusString = "--";
//		switch (status) {
//		case _ORDERDAY._APROBADA:
//			statusString = "APROBADA";
//			break;
//		case _ORDERDAY._NOAPROBADA:
//			statusString = "INICIADA";
//			break;
//		case _ORDERDAY._PUBLICADA:
//			statusString = "PUBLICADA";
//			break;
//		case _ORDERDAY._ELIMININADA:
//			statusString = "ELIMINADA";
//			break;
//		default:
//			statusString = " "+status;
//		break;
//		}
//		return statusString;
//	};
	
	$scope.getBuscarFecha = () =>{
		console.log("--------------------");
		console.log($scope.filtrosFechas);
		console.log("--------------------");
		let dateInit = new Date($scope.filtrosFechas.fechaInicio);
		let dateEnd = new Date($scope.filtrosFechas.fechaFin);		
		let map = new Object(); 
		map['fecha'] = dateInit;
		map['fechaFin'] = dateEnd;
		orderdayService.getByDateBetween(map).then(function mySuccess(data) {
			$scope.orderdays = data;
			angular.forEach($scope.orderdays, function(val, key){
				if(val.fecha != null && val.fecha.length > 0){
					val.fecha = new Date(val.fecha);
				}
			});

		}, function myError(response) {
			swal("Error al consultar", "error");			
		});
	};
	
	$scope.getPostOrderDays = function (){
		swal({
			title: "Consultando Orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		let data = new Object();
		data['publicada'] = true;
		orderdayService.getByStatusPublicada(data).then(function success(data){
			$scope.orderdays=data;
			console.log('Texto', $scope.orderdays)
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
	
	$scope.downloadZip=()=>{
		console.log('Intentando descargar archivos: prueba -1');

		let fFiles = $filter('filter')($scope.orderday.attached.files, {"status":1});
		let folder= {
				serverNames: fFiles.map(f=> f.serverName),
				originalNames:fFiles.map(f=> f.originalName),
				folder: 'attached/'+$scope.orderday.attached.originFolder
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

	$scope.downloadFile = (file) => {
		let data = {
				path: 'attached/'+$scope.orderday.attached.originFolder,
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
				path: 'attached/'+$scope.orderday.attached.originFolder,
				filename: file.serverName
		}; 
		storageService.download(data).then(arraybuffer=>{
			let f = new Blob([arraybuffer],{type: file.mimeType});
			let fileURL = URL.createObjectURL(f);
			let link = document.createElement('a');
			console.log('elemento',document.getElementById('object-data'))
			document.getElementById('object-data').type=file.mimeType;
			document.getElementById('object-data').data=fileURL;

			$scope.fileName = file;
		}, error=>{
			console.error('Error al descargar el archivo:', error);
		});
	};
	
	$scope.viewAttachmentsV = (orderday)=>{ 
		//orderday.fecha = new Date(orderday.fecha);
		$scope.orderday= orderday;
		$('#attachments-verssion').modal({ 
			keyboard: false 
		}); 
		$('#attachments-verssion').modal('show');
	};
	
	$scope.previous= function(){
		window.history.back();
	};
	const initController = () =>{
		$scope.getPostOrderDays();
	};

	angular.element(document).ready(function () {
		initController();
	});

});
