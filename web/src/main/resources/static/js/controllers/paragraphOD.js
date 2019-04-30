app.controller('paragraphODCtrl', function($timeout,$rootScope,paragraphodService, $scope,$http,factory, $state) {
	$scope.paragraphs=[];
	$scope.paragraph=null
	$scope.selection = [];


	
	
	
	$scope.getParagraphODs = function (){
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

		paragraphodService.get().then(function success(data){
			$scope.paragraphs = data;
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

	$scope.postParagraphOD = function(){
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

		paragraphodService.post($scope.paragraph).then(function success(data){
			if(data){
				swal("Exito", "Orden del día agregado correctamente", "success");
				swal.stopLoading();
				$scope.getParagraphODs();
				$scope.paragraph = null;
			} else {
				swal("Error", "Orden del día no agregado", "error");
			}
		}, function error(error){
			$scope.myWelcome = error.statusText;
			swal("Error","Orden del día no agregado "+$scope.myWelcome, "error");
			swal.stopLoading();
		});
	};


	$scope.putParagraphOD = () => {
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

		paragraphodService.put($scope.paragraph).then(function success(data){
			if(data){
				swal.stopLoading();
				swal("Exito", "Orden del dia actualizado correctamente", "success");
				$scope.getParagraphODs();
				$scope.paragraph = null;
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
		if($scope.paragraph != null){
			if($scope.paragraph.id != null){
				$scope.putParagraphOD();
			} else {
				$scope.posParagraphOD();
			}
		} else {
			console.log("Falta informacion para completar el registro");
		}
	};

	const initController = () =>{
		$scope.getParagraphODs();
		
	};


	angular.element(document).ready(function () {
		initController();
	});



}
