app.controller('orderDayCtrl', function($log, $timeout,$rootScope,orderdayService, $scope,$http, $window,$log,factory, $state, moduloodService,$location) {
	 	
	$scope.titleTabView = '';
	//$scope.orderDays = [];
	$scope.orderday = null;
	$scope.modulosod= [];
	$scope.paragraphs=[];
	$scope.numeroIndice = 0;
	$scope.paragraphOD=null;
	
	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};
	
	$scope.change = function(){
		console.log('Texto');
		let module= $scope.orderday.moduloOd;
		$scope.orderday = {
				moduloOd:module,
				paragraphs: [
					{'contenidotxt': '',
					'isIniciativa': false,
					'nivel':1,
					subParagraphs:[]
					}
				]
			}
	}
	
	$scope.getModulosOd = function(){
		moduloodService.get().then(function success(data) {
			$scope.modulosod = data;
		},function error(error){
			console.log('Error al obtener los mudulos', error);
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

		orderdayService.get().then(function success(data){
			$scope.orderdays = data;
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
		$scope.orderday.status = 0;
		console.info($scope.orderday);
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
	
	
	$scope.putOrderDay = () => {
		swal({
			title: "Actualizando  Orden del día",
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
	
	$scope.confirmDelete = (orderday) =>{
		swal({
			title: 'Esta seguro de eliminara a',
			text: $scope.orderday.nombre,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.deleteOrderDay(orderday);
			};
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

	$scope.addMudulesOd = function (){
		$location.path('modulood');
	};
	
	$scope.addOrderday = () => {
		$scope.orderday = {
				//nombre: '',
				
		}
	};
	
	$scope.updateOrderday = (orderday) =>{
		$scope.orderday= orderday;
	};
	
	$scope.submitForm = (isValid) => {
		console.log('validForm');
		console.log(isValid);
		if(isValid) {
			$scope.addUpdate();
		}
	};
	
	$scope.addParagraph = function() {
		if($scope.orderday.paragraphs.length < 3 ){
			$scope.orderday.paragraphs.push({
				'contenidotxt': '',
				'isIniciativa': false,
				'nivel':1,
				subParagraphs:[]
			});
		}else{
			console.log('Es mayor, ',$scope.orderday.paragraphs.length )
		}
				
	};
	$scope.addSubParagraphs = function(i){ 
		console.log('Sub Parrafo',$scope.orderday.paragraphs) 
		if($scope.orderday.paragraphs[i].subParagraphs.length < 3 ){ 
		$scope.orderday.paragraphs[i].subParagraphs.push({ 
			'contenidotxt': '', 
			'isIniciativa': false, 
			'nivel':1, 
			 
		}) 
		}else{ 
			console.log('Es mayor, ',$scope.orderday.paragraphs[i].subParagraphs.length ) 
		} 
	}; 
	 
	$scope.addOrderOfTheDay = (orderday)=>{ 
		$scope.orderdayshow= orderday; 
	$('#myModal').modal(); 
	$('#myModal').modal({ 
		keyboard: false 
		}); 
		$('#myModal').modal('show'); 
	}; 
	
	$scope.cancelAddUpOrderday = () =>{
		$scope.getOrderDays();
		$scope.orderday = null;
	};

	const initController = () =>{
		$scope.changeTitleTabView('ORDEN DEL DÍA');
		$rootScope.title = "ORDENES DEL DÍA";
		$scope.getOrderDays();
		$scope.getModulosOd();
	};


	angular.element(document).ready(function () {
		initController();
	});
})