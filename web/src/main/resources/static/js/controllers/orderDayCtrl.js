app.controller('orderDayCtrl', function($log, $timeout,$rootScope,orderdayService, $scope,$http, $window,$log,factory, $state, moduloodService,$location) {
	 	
	$scope.titleTabView = '';
	//$scope.orderDays = [];
	$scope.orderday = null;
	$scope.modulosod= [];
	$scope.paragraphs=[];
	$scope.voteSessionOn = {};
	$scope.numeroIndice = 0;
	$scope.paragraphOD=null;
	
	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};
	 
	
	//$scope.v.Dt = Date.parse(scope.v.Dt);

	 
	$scope.change = function(){
		console.log('Texto');
		let module= $scope.orderday.moduloOd;

	};
	
	$scope.getModulosOd = function(){
		moduloodService.get().then(function success(data) {
			$scope.modulosod = data;
		},function error(error){
			console.log('Error al obtener los mudulos', error);
		});
	};
	
	$scope.getVerssionOD= function(){
		orderdayService.getSustituidaWithAndWithoutReference().then(function success(data) {
			$scope.orderdaysV = data;
		},function error(error){
			console.log('Error al obtener las versiones', error);
		});
	};
//	$scope.getVersionesFecha = () =>{
//		swal({
//			title: "Consultando ordenes de dia",
//			text: "Por favor espere ...",
//			icon: 'info',						
//			button: {
//				text: "Ok",
//			    closeModal: false,
//			},
//			closeOnClickOutside: false,
//			closeOnEsc: false
//		});
//		let dateNow = new Date();
//		dateNow.setTime( dateNow.getTime() - dateNow.getTimezoneOffset()*60*1000 );
//		let map = new Object(); 
//		map['fecha'] = dateNow;
//		orderdayService.getInDateBetween(map).then(function mySuccess(data) {
//			$scope.orderdays = data;
//			angular.forEach($scope.orderdays, function(val, key){
//				if(val.fechaHora != null && val.fechaHora.length > 0){	
//					val.fechaHora = new Date(val.fechaHora);
//				}
//			});
//			$scope.iniciarFecha();			
//			$timeout(()=>{
//				swal.stopLoading();
//				swal.close();
//			}, 500);
//		}, function myError(response) {
//			$scope.myWelcome = response.statusText;
//			swal("Error",$scope.myWelcome, "error");			
//		});
//	};
//	
//	$scope.iniciarFecha=()=>{
//		console.log('Se inicia la fecha');
//		let now = new Date();
//		//now.setTime( now.getTime() - now.getTimezoneOffset()*60*1000 );
//		if(VoteSessionHasInitiativesService.getDateSearch() != null){		
//			$scope.voteSessionOn.fechaBusqueda= VoteSessionHasInitiativesService.getDateSearch();			
//		}else{					
//			$scope.voteSessionOn.fechaBusqueda = now;		
//		}
//		if(VoteSessionHasInitiativesService.getDateSearchEnd() != null){			
//			$scope.voteSessionOn.fechaBusquedaFin = VoteSessionHasInitiativesService.getDateSearchEnd();
//		}else{			
//			$scope.voteSessionOn.fechaBusquedaFin = now;
//		}
//	};
	
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
		orderdayService.getActiveWithAndWithoutReference().then(function success(data){
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
		$scope.orderday.status = 1;
		console.info($scope.orderday);
		orderdayService.post($scope.orderday).then(function success(data){
			if(data){
				swal("Exito", "Orden del día agregado correctamente", "success");
				swal.stopLoading();
				$scope.getVerssionOD();
				//$scope.getOrderDays();
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
		$scope.orderday = orderday;
	}
	
	
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
				moduloOd:null,
				paragraphs: [
					{'contenidotxt': '',
					'isIniciativa': false,
					'nivel':1,
					subParagraphs:[]
					}
				]
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
			subParagraphs:[]
		}) 
		}else{ 
			console.log('Es mayor, ',$scope.orderday.paragraphs[i].subParagraphs.length ) 
		} 
	}; 
	
	$scope.addSubOfSubParagraphs= function(parent,index){
		console.log('Subparrafos')
		if($scope.orderday.paragraphs[parent].subParagraphs[index].subParagraphs.length < 3 ){ 
			$scope.orderday.paragraphs[parent].subParagraphs[index].subParagraphs.push({ 
				'contenidotxt': '', 
				'isIniciativa': false, 
				'nivel':1, 
				 
			}) 
			}else{ 
				console.log('Es mayor, ',$scope.orderday.paragraphs[parent].subParagraphs[index].subParagraphs.length ) 
			} 
		console.log($scope.orderday.paragraphs[parent].subParagraphs[index]);
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
	$('#modalVerssion').modal(); 
	$('#modalVerssion').modal({ 
		keyboard: false 
		}); 
		$('#modalVerssion').modal('show'); 
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
		$scope.getVerssionOD();
	};


	angular.element(document).ready(function () {
		initController();
	});
})