app.controller('politicalPartyCtrl', function($scope,$http, $window,$log,factory, storageService, $rootScope,_STATUS) {

	$scope.politicalParties = [];
	$scope.politicalParty = null;
	$scope.uploadme;

	$scope.uploadImage = function() {
		var fd = new FormData();
		var imgBlob = dataURItoBlob($scope.politicalParty.logo);
		fd.append('file', imgBlob);
		$http.post(
				'imageURL',
				fd, {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				}
		)
		.success(function(response) {

		})
		.error(function(response) {
			console.log('error', response);
		});
	};

	function dataURItoBlob(dataURI) {
		var binary = atob(dataURI.split(',')[1]);
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {
			type: mimeString
		});
	}	

	$scope.confirmDelete=(_title,_text,_obj)=>{
		swal({
			title:_title,
			text: _text,
			icon: "warning",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				$scope.deletePoliticalParty(_obj);
			}
		});
	};

	$scope.deletePoliticalParty= function(_obj){
		_obj.status = _STATUS._INACTIVE ;	
		factory.put('politicalparty',_obj).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Partido Politico eliminado correctamente", "success");
				$scope.getPoliticalParties();
			}else{
				swal("Error", "Partido Politico no eliminado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
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

	$scope.addPoliticalParty = ()=>{
		document.getElementById("txtNombre").focus(); 
		$scope.politicalParty = {};		
	};

	$scope.updatePoliticalParty = (politicalParty)=>{
		$scope.politicalParty = politicalParty;
		if($scope.politicalParty.logo != null ){
			$scope.fetchFile($scope.politicalParty.logo);
		}
	};

	$scope.fetchFile = (filePath)=>{
		let data= {
				"filePath": filePath
		};
		storageService.getB64(data).then(function mySuccess(response) {
			$scope.politicalParty.logo = response.file;		
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
		});		
	}

	$scope.cancelAddUpdatePoliticalParty = () =>{
		$scope.invalidClassName = '';
		$scope.invalidClassSigla = '';
		$scope.politicalParty = null;
	};

	$scope.invalidClassName = '';
	$scope.invalidClassSigla = '';
	$scope.submitForm =(isValid)=> {
		// check to make sure the form is completely valid
		if (isValid) {
			$scope.invalidClassName = '';
			$scope.invalidClassSigla = '';
			$scope.addUpdate();
		}else{
			if($scope.politicalParty.name == null || $scope.politicalParty.name.length == 0 ){
				$scope.invalidClassName = 'is-invalid';
			}
			if($scope.politicalParty.acronym == null || $scope.politicalParty.acronym.length == 0 ){
				$scope.invalidClassSigla = 'is-invalid';
			}
			swal("Error", "Por favor rellene todos los campos", "error");
		}
	};

	$scope.addUpdate = ()=>{  		
		if($scope.politicalParty != null ){			
			let map = {
					"acronym": $scope.politicalParty.acronym					
			};
			factory.get('politicalparty/acronym',map).then(function mySuccess(data) {
				if(data){
					if($scope.politicalParty != null ){
						if($scope.politicalParty.id != null){
							if(data.id != $scope.politicalParty.id){
								$scope.invalidClassSigla = 'is-invalid';
								swal("Error", "Las siglas del partido ya existen", "error");
							}else{
								$scope.putPoliticalParty();
							}
						}else{
							$scope.invalidClassSigla = 'is-invalid';
							swal("Error", "Las siglas del partido ya existen", "error");							
						}
					}else{
						swal("Error", "error 500", "error");
						console.warn("LA VARIABLE POLITICAL PARTIE ES NULLA AL INTENTAR AGREGAR O ACTUALIZAR!");
					}
				}else{					
					if($scope.politicalParty != null ){
						if($scope.politicalParty.id != null){
							$scope.putPoliticalParty();
						}else{
							$scope.postPoliticalParty();	
						}
					}else{
						swal("Error", "error 500", "error");
						console.warn("LA VARIABLE POLITICAL PARTIE ES NULLA AL INTENTAR AGREGAR O ACTUALIZAR!");
					}
				}
			}, function myError(errResponse) {
				$scope.myWelcome = errResponse.statusText;
				swal("Error","Error con peticion " + self.myWelcome, "error");		
			});
		}
	};

	$scope.postPoliticalParty = ()=>{
		$scope.politicalParty.status = _STATUS._ACTIVE ;	
		factory.post('politicalparty', $scope.politicalParty).then(function mySuccess(data) {

			if(data){
				swal("Exito", "Partido Político agregado correctamente", "success");
				$scope.getPoliticalParties();
				$scope.politicalParty = null;
			}else{
				swal("Error", "Partido Político no agregado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.putPoliticalParty = ()=>{
		factory.put('politicalparty', $scope.politicalParty).then(function mySuccess(data) {			
			if(data){
				swal("Exito", "Partido Político actualizado correctamente", "success");
				$scope.getPoliticalParties();
				$scope.politicalParty = null;
			}else{
				swal("Error", "Partido Político no actualizado", "error");
			}	
		}, 
		function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.toReturn = () => {
		window.history.back();
	};
	
	const initController = () =>{
		$scope.getPoliticalParties();
		jscolor.installByClassName("jscolor");
		$rootScope.title = "PARTIDOS POLITICOS";
	};

	angular.element(document).ready(function () {
		initController();
	});

});
