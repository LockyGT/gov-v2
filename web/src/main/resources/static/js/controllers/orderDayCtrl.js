app.controller('orderDayCtrl', function($timeout,$rootScope,orderdayService, $scope,$http,$log,factory, $state, elementOdService,$location, storageService, $filter) {

	$scope.orderday = null
	$scope.orderdayVerssion=null;

	$scope.numeroIndice = 0;
	$scope.filtrosFechas = {};
	$scope.attached = {};
	$scope.filtrosFechas.fecha= new Date();
	$scope.filtrosFechas.fechaFin = new Date();
	$scope.fecha=new Date();

	$scope.changeToAdd =()=>{
		$scope.isAdd = true;
	};

//	$scope.change = function(){
//	console.log('Resultado',$scope.orderday);
//	};

	$scope.buscar = function doSearch()
	{
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
	}

	$scope.getElementsOd = function(){
		elementOdService.getNameOrder().then(function success(data) {
			$scope.elementsOd = data;
		},function error(error){
			console.log('Error al obtener los elementOdService', error);
		});
	};

	$scope.verVersiones = (orderday)=>{ 
		let odOriginal = "";
		if(orderday.odOriginal){
			odOriginal = orderday.odOriginal;
		}else{
			odOriginal = orderday.id;
		}
		$scope.getVerssionOD(odOriginal);

		$('#modalVerssion').modal({ 
			keyboard: false 
		}); 
		$('#modalVerssion').modal('show'); 
	};

	$scope.getVerssionOD = function(odOriginal){
		swal({
			title: "Consultando vesiones de la Orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		//$scope.orderday
		orderdayService.getOdOriginal(odOriginal).then(function success(data){
			console.log('Mostrar versiones', data)
			$scope.orderdaysV = data;
			console.log( 'informacion obtenida', $scope.orderdaysV)
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

	$scope.getBuscarFecha = () =>{
		console.log("--------------------");
		console.log($scope.filtrosFechas);
		console.log("--------------------");
		let dateInit = new Date($scope.filtrosFechas.fecha);
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

	$scope.getOrderDays = function (){
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
		//console.log('Obtener OD con status activa', $scope.orderday);
		orderdayService.getActiveWithAndWithoutReference().then(function success(data){
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

	$scope.postOrderDay = function(newFiles){
		console.log("Orden del dia guardando",$scope.orderday);
		swal({
			title: "Guardando Orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.orderday.status = 1;
		console.log('Orden del dia enviada ',$scope.orderday);
		orderdayService.post($scope.orderday).then(function success(data){
			if(data){
				swal("Exito", "Orden del día agregado correctamente", "success");
				swal.stopLoading();
				$scope.getOrderDays();
				$scope.orderday = null;
			} else {
				swal("Error", "Orden del día no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Orden del día no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};

	$scope.NewVerssionOrderDay = (newFiles) => {
		swal({
			title: "versionando  Orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		let dataOD = $scope.orderday;
		dataOD.attached.status = 1;
		dataOD.attached.originFolder = newFiles.originFolder;
		dataOD.attached.files = $scope.orderday.attached.files.concat(newFiles.files);
		console.log('Orden del dia enviadad: ', dataOD);
		orderdayService.postNewVerssion(dataOD).then(function success(data){
			console.log('aqui', data)
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del dia actualizado correctamente", "success");
				$scope.attached = {};
				data.fecha = new Date(data.fecha);
				$scope.getOrderDays();
				$scope.orderday = null;
			} else {
				swal("Error", "Orden del día no actualizado", "error");
			}
		}, function error(error){
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error", $scope.myWelcome, "error");
		});
	};

	$scope.deleteOrderDay = orderday=> {
		orderdayService.deleteOrderDay(orderday).then(function success(data){
			if(data){
				swal("Exito","Orden del dia eliminado exitosamente", "success");
				$scope.getOrderDays();
			}
		}, function error(){
			swal("Errpr","Orden del dia no eliminado","error");
		});
	};

	$scope.confirmDelete = (orderday) =>{
		swal({
			title: 'Esta seguro de eliminara a',
			text: orderday.nombre,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteOrderDay(orderday);
			};
		});
	};

	$scope.addUpdate = (newFiles) => {
		if($scope.orderday){
			if($scope.orderday.id){
				$scope.NewVerssionOrderDay(newFiles);
			} else {
				$scope.postOrderDay(newFiles);
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};
	$scope.addNewOd = function (orderday){
		orderday.fecha= new Date(orderday.fecha+'T00:00:00.000-0500');
		console.log('informacion orden del dia: ', orderday);
		$scope.orderday = orderday;
	};

	$scope.toPostOdGazzete = (orderday)=>{
		orderday.published = true;
		orderdayService.put(orderday).then(function mySuccess(data) {
			if(data){
				swal("Exito","Orden del dia publicado exitosamente", "success");
				$scope.getOrderDays();
			}
		}, function error(){
			swal("Errpr","Orden del dia no publicado","error");
		});
	};

	$scope.approvedOd = (orderday) =>{
		orderday.approved =true;
		orderdayService.put(orderday).then(function success(data) {
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del dia Aprobada correctamente", "success");
				$scope.getOrderDays();
				//$scope.orderday = null;

			}else{
				swal("Error", "Orden del dia no Aprobada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");				
		});		
	};
	
	$scope.saveAttachedOd = ()=>{
		console.log("Anexos guardado",$scope.orderdayAnnexes);
		swal({
			title: "Guardando Anexos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		console.log('Mostrar orden del dia',$scope.orderdayAnnexes)
		let folderOrigin = $scope.orderdayAnnexes.attached ? '/' + $scope.orderdayAnnexes.attached.originFolder : ''
			let file = {
				file: $scope.attached.filesUploads,
				folder: 'attached'+folderOrigin,
				userId: 'guadalupe'
		}; 
		
		console.log('guardando el anexo',file)
		storageService.save(file).then(function success(data){
			if(data){
				swal("Exito", "Anexo guardado correctamente", "success");
				swal.stopLoading();
				$scope.getOrderDays();
				$scope.orederday = null
			} else {
				swal("Error", "Anexo no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Anexo no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};


	$scope.deleteFile = fl => {
		fl.status = 0;
	};

	$scope.addElementsOd = function (){
		$location.path('elementOd');
	};
	$scope.previous= function(){
		window.history.back();
	};

	$scope.addOrderday = () => {
		console.log('Agregar nueva OD', $scope.orderday);
		$scope.orderday = {
				fecha:new Date(),
				nombre:'',
				sku:1,
				elementsOd:[],
				attached:{
					files:[]
				}
		}

	};
	$scope.submitForm = (isValid) => {
		console.log('validForm');
		console.log(isValid);
		if(isValid){
			let fFiles = $filter('filter')($scope.orderday.attached.files, {"status": 1});
			let dataFiles = {};

			if(fFiles){
				dataFiles = {
						"files": $scope.attached.filesUploads,
						"filesServerName":fFiles.map(f => f.serverName),
						"oldFolder": $scope.orderday.attached.originFolder,
						"folder":'attached',
						"userId":'guadalupe'
				};
			}else {
				dataFiles = {
						"files": $scope.attached.filesUploads,
						"filesServerName":[],
						"oldFolder": "",
						"folder":'attached',
						"userId":'guadalupe'
				};
			}

			console.log('Informacion enviada: ', dataFiles);
			storageService.newVersion(dataFiles).then(success=>{
				console.log('Informacion obtenida: ', success);

				$scope.addUpdate(success);
				$scope.message = "Archivos subidos";
			}, error=>{
				console.error('Ha ocurrido un error al subir el archivo: ',error);
			});
		}
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
			link.download = $scope.orderday.nombre +".zip";
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

	$scope.addContentE = function(){
		console.log('Agregar elementos para los parrafos');
		$scope.currentElement.paragraphs = [];
		let isExistsElement= $filter('filter')($scope.orderday.elementsOd,{id: $scope.currentElement.id});
		console.log(isExistsElement)
		if(!isExistsElement.length){
			$scope.orderday.elementsOd.push($scope.currentElement);
		}
	};

	$scope.addParagraph = function(e) {
		console.log('Parrafo creado', $scope.orderday)
		e.paragraphs.push({
			'contenidotxt': '',
			'isIniciativa': false,
			'nivel':1,
			subParagraphs:[]
		});

	};
	$scope.addSubParagraphs = function(p){ 
		console.log('Sub Parrafo',$scope.paragraphs)  
		p.subParagraphs.push({ 
			'contenidotxt': '', 
			'isIniciativa': false, 
			'nivel':1 

		});
	}; 

	$('#show-file').on('hidden.bs.modal', function (e) {
		document.getElementById('object-data').type=null;
		document.getElementById('object-data').data=null;

		$scope.fileName = null;
	});
	$scope.addOrderOfTheDay = (orderday)=>{ 
		$scope.orderdayshow= orderday;
	};

	$scope.addAnnexes = (orderday)=>{ 
		orderday.fecha = new Date(orderday.fecha);
		console.log('imrpimir anexos',orderday)
		$scope.orderdayAnnexes= orderday;
	};

	$scope.viewAttachmentsV = (orderday)=>{ 
		orderday.fecha = new Date(orderday.fecha);
		$scope.orderday= orderday;
		$('#attachments-verssion').modal({ 
			keyboard: false 
		}); 
		$('#attachments-verssion').modal('show');
	};

	$scope.viewVerssion =(orderday)=>{
		$scope.orderdayView= orderday;
		$('#modalView').modal({ 
			keyboard: false 
		}); 
		$('#modalView').modal('show'); 
	};

	$scope.cancelAddUpOrderday = () =>{
		$scope.getOrderDays();
		$scope.orderday = null;
	};

	const initController = () =>{
		$scope.getOrderDays();
		$scope.getElementsOd();
	};

	angular.element(document).ready(function () {
		initController();
	});
})