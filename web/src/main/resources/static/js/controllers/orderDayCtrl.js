app.controller('orderDayCtrl', function($timeout,$rootScope,orderdayService, $scope,$http,$log,factory, $state, elementOdService,$location, storageService, $filter,reportOdService,paragraphOdService) {

	$scope.orderday = null
	$scope.orderdayVerssion=null;
	$scope.elementOd = 	null;
	$scope.numeroIndice = 0;
	$scope.filtrosFechas = {};
	$scope.attached = {};
	$scope.filtrosFechas.fecha= new Date();
	$scope.filtrosFechas.fechaFin = new Date();
	$scope.fecha=new Date();
	$scope.selection =[];

	$scope.changeToAdd =()=>{
		$scope.isAdd = true;
	};

	$scope.toggleSelection = function toggleSelection(paragraphs) {
		var idx = $scope.selection.indexOf(paragraphs);
		if (idx > -1) {
			$scope.selection.splice(idx, 1);
		}
		else {
			$scope.selection.push(paragraphs);
		}
	};

	$scope.buscar = function doSearch()
	{
		var tableReg = document.getElementById('datosA');
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

	$scope.cancelSearch = () => {
		$scope.getOrderDays();
		$scope.searchOrderDay = '';
		$scope.isSearch=false;
		$scope.filtrosFechas.fecha= new Date();
		$scope.filtrosFechas.fechaFin = new Date();
	};

	/******************************Metodos de elementos*****************************/
	$scope.elementsOd = [];

	$scope.addNewElement = (elementOd)=>{ 
		$scope.elementsOd= elementOd;
		console.log('Agregar nuevo elemento',elementOd);
	};	


	$scope.getElementsOd = () =>{
		swal({
			title: "Consultando elementos",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
				closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		elementOdService.getNameOrder($scope.elementOd).then(function mySuccess(data) {			
			$scope.elementsOd = data;
			$timeout(()=>{
				swal.stopLoading();
				swal.close();
			}, 500);			
		}, function myError(response) {
			$scope.myWelcome = response;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");
		});
	};

	$scope.postElement = function(){
		console.log("Elemento enviado",$scope.elementOd);
		swal({
			title: "Guardando elemento de la ORDEN DEL DIA",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.elementOd.status = 1;
		console.log('Elemento enviado ',$scope.elementOd);
		elementOdService.post($scope.elementOd).then(function success(data){
			if(data){
				swal("Exito", "Elemento agregado correctamente", "success");
				$scope.elementOd = null;
				swal.stopLoading();
				$scope.getElementsOd();
			} else {
				swal("Error", "Elemento no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","El elemento no se ha agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};

	$scope.putElement = ()=>{
		swal({
			title: "Actualizando Elemento",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
				closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});

		console.log('Actualizar elemenmto de la OD', $scope.elementOd)
		elementOdService.put($scope.elementOd).then(function mySuccess(data) {	
			console.log("elemento actualizadp",data)
			if(data){

				swal("Exito", "Elemento actualizado correctamente", "success");


				$scope.getElementsOd();
				swal.stopLoading();
				$scope.elementOd = null;

			}else{
				swal("Error", "Elemento no actualizado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");				
		});		

	};
	$scope.confirmDeleteElement = (elementOd) =>{
		swal({
			title: 'Esta seguro de eliminara a',
			text: elementOd.nombre,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteElement(elementOd);
			};
		});	
	};


	$scope.deleteElement = elementOd => {
		elementOdService.deleteElement(elementOd).then(function success(data){
			if(data){
				swal("Exito","Elemento eliminado exitosamente", "success");
				$scope.elementOd = null;
				swal.stopLoading();
				$scope.getElementsOd();
			}
		}, function error(){
			swal("Errpr","Elemento no eliminado","error");
		});
	};

	$scope.addUpdateElementOd = () => {
		if($scope.elementOd != null){
			if($scope.elementOd.id != null){
				$scope.putElement();
			} else {
				let isRegister = $scope.elementsOd.find(function(element){
					return element.nombre.toLowerCase() == $scope.elementOd.nombre.toLowerCase();
				});
				if(!isRegister){
					$scope.postElement();
				}else {
					swal({
						title: "Elemento Existente",
						text: "El nombre del elemento ya existe. Por favor intente con otro",
						icon: "warning",
						button: true
					})
				}

			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};
	$scope.submitFormElement = (isValid) => {
		//console.log('validForm');
		console.log(isValid);
		if(isValid) {
			$scope.addUpdateElementOd();
		}
	};

	$scope.addElement = () => {
		console.log('Agregar nuevo elemento', $scope.elementOd);
		$scope.elementOd = {
				nombre:''
		}

	};
	$scope.editElement = function (elementOd){
		console.log('Actualizar elementos', $scope.elementOd);
		$scope.elementOd = elementOd;

	};
	$scope.cancelElement = () =>{
		$scope.getElementsOd();
		$scope.elementOd = null;
	};


	/******************************End**********************************************/

	$scope.verVersiones = (orderday)=>{ 
		let odOriginal = "";
		if(orderday.odOriginal){
			odOriginal = orderday.odOriginal;
		}else{
			odOriginal = orderday.id;
		}

		$scope.getVerssionOD(odOriginal);

	};

	$scope.getVerssionOD = function(odOriginal){
		swal({
			title: "Consultando versiones de la Orden del día",
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
			console.log( 'Informacion obtenida', $scope.orderdaysV)
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
		map['status']= 1;
		map['fecha'] = dateInit;
		map['fechaFin'] = dateEnd;
		orderdayService.getByDateBetween(map).then(function mySuccess(data) {
			$scope.orderdays = data;
			angular.forEach($scope.orderdays, function(val, key){
				if(val.fecha != null && val.fecha.length > 0){
					val.fecha = new Date(val.fecha);
				}
			});
			$scope.isSearch=true;

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
			$scope.orderdays =data;
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
		console.log("Orden del dia guardado",$scope.orderday);
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
		console.log('*--------------*', newFiles)
		//$scope.orderday.paragraph.iniciativa = true;
		$scope.orderday.paragraphs = $scope.selection;
		$scope.orderday.status = 1;
		console.log('Orden del dia enviada ',$scope.orderday);
		orderdayService.post($scope.orderday).then(function success(data){
			if(data){
				swal("Exito", "Orden del día guardado correctamente", "success");
				$scope.orderday = null;
				swal.stopLoading();
				$scope.getOrderDays();
			} else {
				swal("Error", "No se ha guardado la Orden del día", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Orden del día no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};

	$scope.NewVerssionOrderDay = (newFiles) => {
		swal({
			title: "Versionando  Orden del día",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		console.log('----------', newFiles)
		let dataOD = $scope.orderday;
		dataOD.attached.status = 1;
		dataOD.attached.originFolder = newFiles.originFolder;
		dataOD.attached.files = $scope.orderday.attached.files.concat(newFiles.files);
		console.log('Orden del dia enviadad: ', dataOD);
		orderdayService.postNewVerssion(dataOD).then(function success(data){
			console.log('+------+-------+', data)
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del día actualizado correctamente", "success");
				$scope.attached = {};
				data.fecha = new Date(data.fecha);
				$scope.orderday = null;
				$scope.attached.filesUploads=null;
				$scope.getOrderDays();

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
				swal("Exito","Orden del día eliminado exitosamente", "success");
				$scope.getOrderDays();
			}
		}, function error(){
			swal("Error","Orden del día no eliminado","error");
		});
	};

	$scope.confirmDelete = (orderday) =>{
		swal({
			title: 'Esta seguro de eliminar a',
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
		console.log('Informacion de la orden del día a actualizar: ', orderday);
		$scope.orderday = orderday;
		orderday.fecha =  new Date();
	};



	$scope.toPostOrderday  = (orderday) => {
		console.log('orden del dia publicada',orderday)
		orderday.published= true;

		orderdayService.putPublishedByOdOriginal(orderday).then(function mySuccess(data) {
			console.log('+-----------+ od',data)
			if(data){
				swal("Exito","Orden del día publicado exitosamente", "success");
				$scope.orderday = null;
				//$scope.getPostOrderDays();
			}
		}, function error(){
			swal("Errpr","Orden del día no publicado","error");
		});
	};


	$scope.approvedOd = (orderday) =>{
		orderday.approved =true;
		orderdayService.put(orderday).then(function success(data) {
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del día aprobada correctamente", "success");

				$scope.orderday = null;
				$scope.getOrderDays();
			}else{
				swal("Error", "Orden del día no Aprobada", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");				
		});		
	};

	$scope.saveAnnexes = (files) =>{
		let dataOD = $scope.orderdayAnnexes;
		console.log('+++++', $scope.orderdayAnnexes)
		dataOD.attached.status = 1;
		dataOD.attached.originFolder = files.originFolder;
		dataOD.attached.files = $scope.orderdayAnnexes.attached.files.concat(files.files);
		console.log('Orden del dia enviadad:--- ', dataOD);
		orderdayService.put(dataOD).then(function success(data) {
			console.log('anexos', data)
			if(data){
				swal("Exito", "Anexo guardado correctamente", "success");
				$scope.getOrderDays();
				swal.stopLoading();
				$scope.attached.filesUploads = null;
				//$scope.orderdayAnnexes = null;
			}else{
				swal("Error", "Los anexos no se guardado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");				
		});		
	};

	$scope.addAttachedOd = () =>{
		//console.log("Anexos guardado",$scope.orderdayAnnexes);
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
		console.log('Mostrar anexo de la orden del dia ----+',$scope.orderdayAnnexes)
		let fecha = new Date();
		let folderOrigin = $scope.orderdayAnnexes.attached.originFolder ? 
				$scope.orderdayAnnexes.attached.originFolder : 'attached/' + fecha.getFullYear() + '/' + (fecha.getMonth()+1) + '/' +  $scope.orderdayAnnexes.id 
				let file = {
						files: $scope.attached.filesUploads,
						folder: folderOrigin,
						userId: 'guadalupe'
				}; 

		console.log('guardando el anexo',file)
		storageService.saveAttached(file).then(function success(data){
			console.log('informacion',data)
			if(data){
				swal("Exito", "Anexo guardado correctamente", "success");
				swal.stopLoading();
				//
				$scope.saveAnnexes(data);

			} else {
				swal("Error", "Anexo no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Anexo no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};

	$scope.removeParagraphs = e => {
		e.status = -1;
	}
	$scope.removeElements = e => {
		e.status = 0;
	}

	$scope.comfirmDeleteFile = (file) => {
		swal({
			title: 'Esta seguro de eliminara a',
			text: file.originalName,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteFile(file);
			}
		});
	};

	$scope.deleteFile = fl => {
		fl.status = 0;
		$scope.addAttachedOd();
	};


	$scope.previous= function(){
		window.history.back();
	};

	$scope.addOrderday = () => {
		console.log('Agregar nueva OD', $scope.orderday);
		$scope.isAdd = true;
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
	$scope.invalidClassName = '';
	$scope.submitForm = (isValid) => {
		$scope.validClass = {};
		console.log('validForm');
		console.log('----------?', isValid);
		if(isValid){
			$scope.invalidClassName = '';
		}else{
			if($scope.orderday.nombre == null || $scope.orderday.nombre.length == 0 ){
				$scope.invalidClassName = 'is-invalid';
			}else{
				$scope.invalidClassName = '';
			}
			swal("Error","Por favor complete todos los campos", "error");
		}

		if(isValid){
			$scope.validClass.file = 'valid';
		}else{
			if($scope.attached.filesUploads === undefined){
				$scope.validClass.file = 'invalid';
			}else{
				swal("Error", "Por favor agregue un archivo","error")
			}
		}

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
			console.log('Informacion del anexo antes de enviarse: ', dataFiles, $scope.orderday);
			//$scope.addUpdate(dataFiles);
			if($scope.orderday.id){
				storageService.newVersion(dataFiles).then(success=>{
					console.log('Informacion obtenida: ', success);

					$scope.addUpdate(success);
					$scope.message = "Archivos subidos";
				}, error=>{
					console.error('Ha ocurrido un error al subir el archivo: ',error);
				}); 
			}else {

				$scope.addUpdate(null);
			}
		}
	};


	$scope.downloadZip=()=>{
		console.log('Intentando descargar archivos: prueba -1');

		let fFiles = $filter('filter')($scope.orderdayAnnexes.attached.files, {"status":1});
		let folder= {
				serverNames: fFiles.map(f=> f.serverName),
				originalNames:fFiles.map(f=> f.originalName),
				folder: $scope.orderdayAnnexes.attached.originFolder
		};
		storageService.downloadZip(folder).then(arraybuffer=>{
			let f = new Blob([arraybuffer], {type:"application/zip"});
			let fileURL = URL.createObjectURL(f);
			let link = document.createElement('a');
			link.href = fileURL;
			link.download = $scope.orderdayAnnexes.nombre +".zip";
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
				path: $scope.orderdayAnnexes.attached.originFolder,
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
				path: $scope.orderdayAnnexes.attached.originFolder,
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
		let isExistsElement= $filter('filter')($scope.orderday.elementsOd,{id: $scope.currentElement.id,status:1});

		console.log(isExistsElement)
		if(!isExistsElement.length){
			$scope.orderday.elementsOd.push($scope.currentElement);
		}
	};

	$scope.addParagraph = function(e) {
		console.log('Parrafo creado', $scope.orderday)
		e.paragraphs.push({
			'contenidotxt': '',
			'status': 2,
			'iniciativa': false,
			'nivel':1,
			subParagraphs:[]
		});

	};
	$scope.addSubParagraphs = function(p){ 
		console.log('Sub Parrafo',$scope.subParagraphs)  
		p.subParagraphs.push({ 
			'contenidotxt': '', 
			'status': 2,
			'iniciativa': false, 
			'nivel':1 

		});
	};


	$scope.filterExtention = (extencion) => {
		let ignores = ["doc","pptx","xls","xlsx","docx"];
		let filter = $filter('filter')(ignores,extencion);

		if(filter.length){
			return false;
		}else {
			return true;
		}
	};

	$('#show-file').on('hidden.bs.modal', function (e) {
		document.getElementById('object-data').type=null;
		document.getElementById('object-data').data=null;

		$scope.fileName = null;
	});

	$scope.addOrderOfTheDay = (orderday)=>{ 
		console.log('modal ver orden dia', orderday)
		$scope.orderdayshow= orderday;
	};

//	$scope.elementOd=null;
//	$scope.elements=[];
//	$scope.addElementsOd = (orderday) => {
//	$scope.elements= orderday; 
//	}

	$scope.addAnnexes = (orderday)=>{ 
		orderday.fecha = new Date(orderday.fecha);
		console.log('imrpimir ',orderday)
		$scope.orderdayAnnexes= orderday;
	};
	$scope.viewVerssion =(orderday)=>{
		$scope.orderdayView= orderday;
		$('#modalView').modal({ 
			keyboard: false 
		}); 
		$('#modalView').modal('show'); 
	};


	$scope.cancelAddUpOrderday = () =>{
		$log.log("cancelAddUpOrderday event");
		$scope.invalidClassName = '';
		$scope.isAdd = false;
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