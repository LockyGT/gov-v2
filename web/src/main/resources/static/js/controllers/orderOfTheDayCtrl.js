app.controller('orderOfTheDayCtrl', function($rootScope, $timeout, $filter, $scope, $window, $log, $filter, $state,orderdayService, _ORDERDAY,storageService,elementOdService) {

	$scope.odgazzete=null;
	$scope.orderday={};
	$scope.attached = {};
	$scope.filtrosFechas = {};
	$scope.filtrosFechas.searchDateStart = new Date();
	$scope.filtrosFechas.searchDateEnd = new Date();

	
	$scope._ORDERDAY = _ORDERDAY;


	$scope.buscar = function doSearch() {
		var tableReg = document.getElementById('datos');
		var searchText = document.getElementById('searchTerm').value.toLowerCase();
		var cellsOfRow="";
		var found=false;
		var compareWith="";
		for (var i = 1; i < tableReg.rows.length; i++)
		{
			cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
			found = false;
			for (var j = 0; j < cellsOfRow.length && !found; j++)
			{
				compareWith = cellsOfRow[j].innerHTML.toLowerCase();
				if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
				{
					found = true;
				}
			}
			if(found)
			{
				tableReg.rows[i].style.display = '';
			} else {
				tableReg.rows[i].style.display = 'none';
			}
		}
	};
	
	$scope.cancelSearch = () => {
		$scope.getPostOrderDays();
		$scope.searchElement = null;
		$scope.isSearch=false;
		$scope.filtrosFechas.searchDateStart = new Date();
		$scope.filtrosFechas.searchDateEnd = new Date();

		
	};
	
	$scope.getBetweenDatesPublished = (filtrosFechas) => {
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
				"publicada": true,
				"datestart": $filter('date')(filtrosFechas.searchDateStart, "yyyy/MM/dd"),
				"dateend":$filter('date')(filtrosFechas.searchDateEnd, "yyyy/MM/dd")
		};
		orderdayService.getBetweenDatesPublished(dataFilter).then(function success(data){
			$scope.publishedOds = data;
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
				$scope.isSearch=true;
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
			title: "Concultando Orden del día",
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
				folder: $scope.orderday.attached.originFolder
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
				path: $scope.orderday.attached.originFolder,
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
				path: $scope.orderday.attached.originFolder,
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
