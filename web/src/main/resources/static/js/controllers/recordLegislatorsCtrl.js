app.controller('recordLegislatorsCtrl', function($scope, factory, partnerService,$timeout){
	
	$scope.parties           = [];
	$scope.recordLegislator  = null;
	$scope.recordLegislators = [];
	$scope.maxDate = new Date();
	
	$scope.newRecordLegislator = () => {
		$scope.partner = {
				status: 1,
				tipoPartner: 1
		};
	};

	$scope.show = recordLegislator => {
		console.log('Información para mostrar: ', recordLegislator);
	};
	
	$scope.update = recordLegislator => {
		$scope.partner  = recordLegislator;
	};
	
	$scope.delete = recordLegislator => {
		recordLegislator.status = 0;
		partnerService.put(recordLegislator).then(function success(data){
			if(data){
				swal("Exito","Expediente electrónico eliminado exitosamente", "success");
				$scope.getPartners();
			} else {
				
			}
		}, function error(error){
			swal("Error",error,"error");
		});
	};
	
	$scope.createPDF = recordLegislator => {
		console.log('Información para ver archivo: ', recordLegislator);
	};
	
	$scope.cancelAddUpModule = () => {
		$scope.partner  = null;
	};
	
	$scope.confirmDelete = recordLegislator => {
		swal({
			title: 'Esta seguro de eliminar a',
			text: recordLegislator.name,
			icon: "warning",
			buttons: true,
			dangerMode: true
		}).then((willDelete)=>{
			if(willDelete){
				$scope.delete(recordLegislator);
			};
		});
	};
	
	$scope.showPartners = () => {
		swal({
			title: "Consultandos expedientes electrónicos",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.getPartners();
		$timeout(()=>{
			swal.stopLoading();
			swal.close();
		},600);
	};
	
	$scope.addUpdate = () => {
		console.log('Partner a enviar: ', $scope.partner);
		if($scope.partner.id){
			$scope.put();
		}else {
			$scope.post();
		}
	};
	$scope.submitForm = isValid => {
		if(isValid) {
			$scope.addUpdate();
		} else {
			console.log('Formulario invalido');
			console.log('Informacion del partner: ', $scope.partner);
		}
	};
	
	$scope.getPoliticalParties = () =>{	
		factory.get('politicalparty').then(function mySuccess(data) {			
			$scope.parties = data;
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	$scope.getPartners = () => {
		partnerService.getByStatus(1).then(data => {
			$scope.recordLegislators = data;
		}, error => {
			swal.stopLoading();
			swal('Error', error, "error");
		});
	};
	
	$scope.post = () => {
		swal({
			title: "Guardando expediente electrónico",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		partnerService.post($scope.partner).then(data => {
			if(data){
				swal("Exito", "Expediente electrónico agregado correctamente", "success");
				swal.stopLoading();
				$scope.getPartners();
				$scope.partner = null;
			} else {
				swal("Error", "Modulo de orden del día no agregado", "error");
			}
		}, error => {
			swal("Error","Expediente electrónico no agregado "+error.statusText, "error");
			swal.stopLoading();
		});
	};
	
	$scope.put = () => {
		swal({
			title: "Actualizando  expediente elctrónico",
			text: "Por favor espere...",
			icon: 'info',
			button: {
				text: "Ok",
				closeModal: false
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		
		partnerService.put($scope.partner).then(data => {
			if(data) {
				swal("Exito", "Expediente electrónico actualizado correctamente", "success");
				$scope.getPartners();
				$scope.partner = null;
			} else {
				swal("Error", "Expediente electrónico no actualizado", "error");
			}
		}, error => {
			swal.stopLoading();
			swal("Error", error.statusText, "error");
		});
	};
	
	$scope.topReturn = () => {
		window.history.back();
	};
	 
	const initController = () => {
		$scope.getPoliticalParties();
		$scope.showPartners();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});