app.controller('elementOdCtrl', function($log, $timeout, $scope,$http, $window,elementOdService,factory, $state,$location) {

	$scope.elementOd=null;
	
	
	$scope.getElements = () =>{
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
			$scope.elements = data;
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
		console.log("Archivo enviada",$scope.elementOd);
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
				swal.stopLoading();
				//$scope.getVerssionOD();
				$scope.getElements();
				$scope.elementOd = null;
			} else {
				swal("Error", "Orden del día no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Orden del día no agregado "+$scope.myWelcome, "error");
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
			if(data){
				swal.stopLoading();
				swal("Exito", "Elemento actualizado correctamente", "success");
				$scope.getElements();
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
	$scope.confirmDelete = (elementOd) =>{
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
	

	$scope.deleteElement = elementOd=> {
		elementOdService.deleteElement(elementOd).then(function success(data){
			if(data){
				swal("Exito","Elemento eliminado exitosamente", "success");
				$scope.getElements();
			}
		}, function error(){
			swal("Errpr","Elemento no eliminado","error");
		});
	};


	$scope.addUpdate = () => {
		if($scope.elementOd){
			if($scope.elementOd.id){
				$scope.putElement();
			} else {
				$scope.postElement();
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};

	$scope.submitForm = (isValid) => {
		//console.log('validForm');
		console.log(isValid);
		if(isValid) {
			$scope.addUpdate();
		}
	};

	$scope.addElement = () => {
		console.log('Agregar nuevo elemento', $scope.elementOD);
		$scope.elementOd = {
				nombre:''
		}
		
	};
	
	$scope.editElement = function (elementOd){
		console.log('Actualizar elementos', $scope.elementOd);
		$scope.elementOd = elementOd;
	};
	$scope.cancelElement = () =>{
		$scope.getElements();
		$scope.elementOd = null;
	};
	
	$scope.previous= function(){
		window.history.back();
	};
	

	
	const initController = () =>{
		$scope.getElements();

	};

	angular.element(document).ready(function () {
		initController();
	});
})