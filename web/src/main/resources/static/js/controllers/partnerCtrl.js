app.controller('partnerCtrl', function($rootScope, $timeout, $scope,$http, $window,$log,factory, $state,partnerService,userService, _PARTNER, _STATUS, storageService) {

	let self = this;
	$scope.legislators = [];
	$scope.legislator = null;
	$scope.politicalParties = [];	
	$scope.userRols = [];
	const HttpCodes = {
			success : 200,
			notFound : 404,
			_CREATED: 201
	};
	
	$scope.minAge = 0;
	$scope.emailFormat = null ; 
	$scope.ph_numbr = null;
	$scope.uploadme;
	$scope._PARTNER = _PARTNER;
	
	$scope.deleteUser = function(){
		$scope.user = {};
	};

	$scope.deleteTurn = function(){
		$scope.turn = {};
	};

	$scope.getPartners = () =>{
		swal({
			title: "Consultando usuarios",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
			    closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		partnerService.getByStatus(_PARTNER._STATUS._ACTIVE).then(function mySuccess(data) {			
			$scope.legislators = data;
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

	$scope.addLegislator = ()=>{
		$rootScope.fileName = "";
		document.getElementById("txtNombre").focus(); 
		$scope.getPoliticalParties();
		$scope.getUserRols();
		$scope.legislator = {
				name : '',
				apPaterno : '',
				apMaterno : '',
				fechaCumplianos : '',
				email : '',
				telefono : '',
				user: {
					username: '',
					userRol : {
						roleName : ''
					}
				}
		};		
	};

	$scope.updateLegislator = (legislator)=>{
		$rootScope.fileName = "";
		$scope.getPoliticalParties();
		$scope.getUserRols();
		legislator.fechaCumplianos = new Date(legislator.fechaCumplianos);
		$scope.legislator = legislator;	
		if($scope.legislator.foto != null && $scope.legislator.foto.filePath != null ){
			$scope.fetchFile($scope.legislator.foto.filePath);
		}
	};

	$scope.fetchFile = (filePath)=>{
		let data= {
				"filePath": filePath
		};
		storageService.getB64(data).then(function mySuccess(response) {
			$scope.legislator.foto.filePath = response.file;		
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
		});
	};

	$scope.cancelAddUpdateLegislator = () =>{
		$log.log("cancelAddUpdateLegislator event");
		$scope.invalidClassName = '';
    	$scope.invalidClassApPaterno = '';
    	$scope.invalidClassApMaterno = '';
    	$scope.invalidClassUsername = '';
    	$scope.invalidClassRol = '';
    	$scope.invalidClassTelefono = '';
    	$scope.invalidClassEmail = '';
		$scope.legislator = null;
	};

	$scope.confirmDelete=(_title,_text,_obj)=>{
		swal({
			title:_title,
			text: _text,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
			
				$scope.deleteLegislator(_obj);
			}
		});
	};

	$scope.deleteLegislator= function(legislator){
		legislator.status = _PARTNER._STATUS._INACTIVE;	
		$scope.legislator.user.status = _STATUS._INACTIVE;
		partnerService.put(legislator).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Legislador eliminado correctamente", "success");
				$scope.getPartners();
			}else{
				swal("Error", "Legislador no eliminado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});

	};	

	$scope.addUpdate = ()=>{
		if($scope.legislator != null ){
			$scope.legislator.user.status = _STATUS._ACTIVE;
			userService.getUserByUsernameAndStatus($scope.legislator.user.username, _STATUS._ACTIVE).then(function mySuccess(userData) {
				if(userData != null){					
					if($scope.legislator.id == null || ($scope.legislator.id  != null && userData.id != $scope.legislator.user.id)){									
						swal("Error", "El nombre de usuario ya existe", "error");
					}else{
						if($scope.legislator.id != null){
							$scope.putLegislator();
						}else{
							$scope.postLegislator();	
						}
					}
				}else{					
					if($scope.legislator.id != null){
						$scope.putLegislator();
					}else{
						$scope.postLegislator();	
					}
				}
			}, function myError(errResponse) {
				$scope.myWelcome = errResponse.statusText;
				swal("Error","Error con peticion " + self.myWelcome, "error");		
			});	

		}
	};

	$scope.postLegislator = ()=>{
		swal({
			title: "Guardando usuario",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
			    closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.legislator.status = _PARTNER._STATUS._ACTIVE ;
		$scope.legislator.tipoPartner = $scope.legislator.user.userRol.sku;
		partnerService.post($scope.legislator).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Legislador agregado correctamente", "success");
				if($rootScope.initializeSystem){
					$scope.disableSelect = false;
					$timeout(function(){						
						swal("Listo", "Ahora necesitas agregar tus huellas para que puedas inicar sesión con el usuario creado", "info")
						.then((value) => {
							$scope.addFingerPrints(data);
						});						
					}, 2000);
				}
				swal.stopLoading();
				$scope.getPartners();
				$scope.legislator = null;
			}else{
				swal("Error", "Legislador no agregado 1", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error","legislator no agregado " + self.myWelcome, "error");	
			swal.stopLoading();
		});
	};	

	$scope.putLegislator = ()=>{
		swal({
			title: "Actualizando usuario",
			text: "Por favor espere ...",
			icon: 'info',						
			button: {
				text: "Ok",
			    closeModal: false,
			},
			closeOnClickOutside: false,
			closeOnEsc: false
		});
		$scope.legislator.tipoPartner = $scope.legislator.user.userRol.sku;
		partnerService.put($scope.legislator).then(function mySuccess(data) {			
			if(data){
				swal.stopLoading();
				swal("Exito", "Legislador actualizado correctamente", "success");
				$scope.getPartners();
				$scope.legislator = null;
			}else{
				swal("Error", "Legislador no actualizado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal.stopLoading();
			swal("Error",$scope.myWelcome, "error");				
		});		

	};

	$scope.getPoliticalParties = () =>{		
		factory.get('politicalparty').then(function mySuccess(data) {		
			$scope.politicalParties = data;
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.getUserRols = () =>{		
		userService.getRol().then(function mySuccess(data) {			
			$scope.userRols = data;
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.addFingerPrints = (leg) =>{
		$scope.legislatorHuella = leg;
		$state.go('partners.enrollment', {partner: leg});
		$('#myModal').modal('show');
	};
	$scope.addDocuments = (leg) =>{
		$state.go('documentoPartner', {partnerId: leg.id});
		
	};
	
	$scope.validText=()=>{
		 var today = new Date();
		 var minAge = 18;
		 $scope.minAge = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
		 
		 $scope.emailFormat = "([a-z0-9][-a-z0-9_\+\.]*[a-z0-9])@([a-z0-9][-a-z0-9\.]*[a-z0-9]\.(arpa|root|aero|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)|([0-9]{1,3}\.{3}[0-9]{1,3}))"
		 //$scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
		 $scope.ph_numbr = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
	};
	
	$scope.invalidClassName = '';
	$scope.invalidClassApPaterno = '';
	$scope.invalidClassApMaterno = '';
	$scope.invalidClassUsername = '';
	$scope.invalidClassRol = '';
	$scope.invalidClassTelefono = '';
	$scope.invalidClassEmail = '';
	
	$scope.submitForm =(isValid)=> {
		console.log('validForm');
		console.log(isValid);
	    // check to make sure the form is completely valid
		if($scope.legislator.user.userRol.roleName == null || $scope.legislator.user.userRol.roleName.trim().length == 0) {
    		isValid = false;
    	}
	    if (isValid) {
	    	$scope.invalidClassName = '';
	    	$scope.invalidClassApPaterno = '';
	    	$scope.invalidClassApMaterno = '';
	    	$scope.invalidClassUsername = '';
	    	$scope.invalidClassRol = '';
	    	$scope.invalidClassTelefono = '';
	    	$scope.invalidClassEmail = '';
	    	$scope.addUpdate();
	    }else{
	    	if($scope.legislator.name == null || $scope.legislator.name.length == 0 ){
	    		$scope.invalidClassName = 'is-invalid';
	    	}else{
	    		$scope.invalidClassName = '';
	    	}
	    	if($scope.legislator.apPaterno == null || $scope.legislator.apPaterno.length == 0 ){
	    		$scope.invalidClassApPaterno = 'is-invalid';
	    	}else{
	    		$scope.invalidClassApPaterno = '';
	    	}
	    	if($scope.legislator.apMaterno == null || $scope.legislator.apMaterno.length == 0 ){
	    		$scope.invalidClassApMaterno = 'is-invalid';
	    	}else{
	    		$scope.invalidClassApMaterno = '';
	    	}
	    	
	    	if( $scope.legislator.user.username == null || $scope.legislator.user.username.length == 0 ){
	    		$scope.invalidClassUsername = 'is-invalid';
	    	}else{
	    		$scope.invalidClassUsername = '';
	    	}
	    	if($scope.legislator.user.userRol.roleName == null || $scope.legislator.user.userRol.roleName.trim().length == 0) {
	    		$scope.invalidClassRol = 'is-invalid';
	    	}else{
	    		$scope.invalidClassRol = '';
	    	}
	    	swal("Error", "Por favor rellene todos los campos", "error");
	    }
	  };

	const initController = () =>{	
		$scope.validText();
		$scope.getPartners();
		if($rootScope.initializeSystem){
			swal("Hola", "Para comenzar a usar el sistema, necesita agregar un usuario con rol de OPERADOR", "info");
			$scope.addLegislator();
		}
		$rootScope.title = "USUARIOS";
	};

	angular.element(document).ready(function () {
		initController();
	});

});
