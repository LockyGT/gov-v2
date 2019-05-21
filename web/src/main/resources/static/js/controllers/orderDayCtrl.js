app.controller('orderDayCtrl', function($log, $timeout,$rootScope,orderdayService, $scope,$http, $window,$log,factory, $state, elementOdService,$location) {

	$scope.titleTabView = '';
	$scope.orderday = null;

	
	
	$scope.orderdayVerssion=null;
	
	//$scope.orderdaysV=null;
	$scope.numeroIndice = 0;
	$scope.filtrosFechas = {};
	$scope.filtrosFechas.fecha= new Date();
	$scope.filtrosFechas.fechaFin = new Date();
	$scope.fecha=new Date();
	


	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};

	$scope.change = function(){
		console.log('Texto');
		console.log('Resultado',$scope.orderday);
	};

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
		elementOdService.get().then(function success(data) {
			$scope.elementsOd = data;
		},function error(error){
			console.log('Error al obtener los elementOdService', error);
		});
	};

	$scope.getVerssionOD= function(){
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
		orderdayService.getSustituidaWithReference().then(function success(data){
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
		//$scope.orderday.status = 1;
	
		console.log('Obtener OD con status activa', $scope.orderday);
		orderdayService.getActiveWithAndWithoutReference().then(function success(data){
			$scope.orderdays = data;
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


	$scope.postOrderDay = function(){
		console.log("Archivo enviada",$scope.orderday);
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
				//$scope.getVerssionOD();
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


	$scope.putOrderDay = () => {
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

		orderdayService.put($scope.orderday).then(function success(data){
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del dia actualizado correctamente", "success");
				//$scope.getOrderDays();
				$scope.getVerssionOD();
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

	$scope.addUpdate = () => {
		if($scope.orderday){
			if($scope.orderday.id){
				$scope.putOrderDay();
			} else {
				$scope.postOrderDay();
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};

	$scope.addNewOd = function (orderday){
		orderday.fecha= new Date(orderday.fecha+'T00:00:00.000-0500');
		$scope.orderday =orderday;
	};

	$scope.addMudulesOd = function (){
		$location.path('modulood');
	};

	$scope.updateOrderday = (orderday) =>{
		$scope.orderday= orderday;
	};

	$scope.addOrderday = () => {
		console.log('Agregar nueva OD', $scope.orderday);
		$scope.orderday = {
				fecha:new Date(),
				nombre:'',
				elementsOd:[]
		}
		
	};


	$scope.submitForm = (isValid) => {
		console.log('validForm');
		console.log(isValid);
		if(isValid) {
			$scope.addUpdate();
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
		console.log($scope.orderday)
		$scope.orderday.elementsOd.push($scope.currentElement);

	};

	$scope.addParagraph = function(e) {
		console.log('Se agrego nuevo parrafo',$scope.currentElement.paragraphs);
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
		$('#myModal').modal();
		$('#myModal').modal({ 
			keyboard: false 
		}); 
		$('#myModal').modal('show'); 
	};

	$scope.verVersiones = (orderday)=>{ 
		$scope.orderdayVerssion= orderday; 
		$('#modalVerssion').modal({ 
			keyboard: false 
		}); 
		$('#modalVerssion').modal('show'); 
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
		$scope.changeTitleTabView('ORDEN DEL DÍA');
		$rootScope.title = "ORDENES DEL DÍA";
		$scope.getOrderDays();
		$scope.getElementsOd();
		$scope.getVerssionOD();
	};


	angular.element(document).ready(function () {
		initController();
	});
})