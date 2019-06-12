app.controller('orderOfTheDayCtrl', function($rootScope, $timeout, $filter, $scope, $window, $log, $filter, $state,orderdayService, _ORDERDAY,storageService,elementOdService) {
	var self = this;
	$scope.odgazzete=null;
	$scope.orderday={};
	$scope.attached = {};
	$scope.searchDateStart = new Date();
	$scope.searchDateEnd = new Date();
	$scope._ORDERDAY = _ORDERDAY;

	
	$scope.getBetweenDatesPublished = (searchDateStart, searchDateEnd) => {
		swal({
			title: "Consultandos Ordenes del día",
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
				"datestart": $filter('date')(searchDateStart, "yyyy/MM/dd"),
				"dateend":$filter('date')(searchDateEnd, "yyyy/MM/dd")
				};
		orderdayService.getBetweenDatesPublished(dataFilter).then(function success(data){
			$scope.publishedOds = data;
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
				//$scope.getPostOrderDays();
			},500);
			
		}, function error(response){
			$scope.myWelcome = response;
			swal.stopLoading();
			swal('Error', $scope.myWelcome, "error");
		});
	};
	
	
	$scope.getPostOrderDays = function (){
		swal({
			title: "Publicando Orden del día",
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
			$scope.publishedOds = data;
			console.log('Texto', $scope.publishedOds)
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
