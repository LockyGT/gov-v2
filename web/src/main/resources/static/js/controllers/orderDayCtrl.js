app.controller('orderDayCtrl', function($timeout,$rootScope,orderdayService, $scope,$http,$log,factory, $state, elementOdService,$location, storageService, $filter,) {

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


	$scope.putOrderDay = (newFiles) => {
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
		orderdayService.put(dataOD).then(function success(data){
			console.log('aqui', data)
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del dia actualizado correctamente", "success");
				$scope.attached = {};
				data.fecha = new Date(data.fecha);
				//$scope.orderday = data;
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
				$scope.putOrderDay(newFiles);
			} else {
				$scope.postOrderDay(newFiles);
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};
	
	
	$scope.addNewOd = function (orderday){
		
		orderday.fecha= new Date(orderday.fecha+'T00:00:00.000-0500');
		console.log('informacion order day: ', orderday);
		$scope.orderday = orderday;
//		$scope.orderday.attached={
//			files:[]
//			}
	};

	$scope.addElementsOd = function (){
		$location.path('elementOd');
	};

//	$scope.updateOrderday = (orderday) =>{
//		$scope.orderday= orderday;
//	};

	$scope.addOrderday = () => {
		console.log('Agregar nueva OD', $scope.orderday);
		$scope.orderday = {
				fecha:new Date(),
				nombre:'',
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
				
				$scope.addUpdate(success);
				$scope.message = "Archivos subidos";
			}, error=>{
				console.error('Ha ocurrido un error al subir el archivo: ',error);
			});
		}
	};


	$scope.addContentE = function(){
		console.log('Agregar elementos con parrafos');

		$scope.currentElement.paragraphs = [];
		$scope.currentElement.paragraphs.push({
			'nombre':'',
			'contenidotxt': '',
			'isIniciativa': false,
			'nivel':1,
			'subParagraphs':[]

		});
		console.log('Parrafo creado', $scope.orderday)
		$scope.orderday.elementsOd.push($scope.currentElement);

	};

	$scope.addParagraph = function(e) {
//		console.log('Se agrego nuevo parrafo',$scope.currentElement.paragraphs);
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
	$scope.addOrderOfTheDay = (orderday)=>{ 
		$scope.orderdayshow= orderday;
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