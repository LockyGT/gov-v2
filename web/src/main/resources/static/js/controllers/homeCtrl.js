app.controller('HomeController', function($scope, $rootScope, $stateParams, $state, LoginService, factory, MenuHasSubMenuService) {
	$rootScope.title = "AngularJS Login Sample";    
	$scope.bgClassBody  = 'bg-body-panel';
	angular.element('body').removeClass($scope.bgClassBody);
	$scope.userData = LoginService.getUserData();

	$scope.subMenus = [];
	
	$scope.setIndexMenu=(index)=>{
		console.log(index);
		MenuHasSubMenuService.setIndexMenu(index);
	};
	
	$scope.getSubMenu=(indexMenu)=>{
		factory.get('components/data/menu/index_menu.json').then(function mySuccess(data) {				
			$scope.menus = data;
			angular.forEach($scope.menus, function(val, key){
				if(val.id == indexMenu){	
					$scope.subMenus = val.childs;
				}
			});
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
		
	};
	
	$scope.getMenu = function(){
		factory.get('components/data/menu/index_menu.json').then(function mySuccess(data) {				
			$scope.menus = data;
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};

	$scope.validateRol = (menu) =>{
		let index = menu.roles.indexOf($scope.userRol);
		let res = (index >= 0? true : false);
		return res;
	};
	
	$scope.stompFailureCallback = function (error) {
		if($scope.retriesToConnectAux == 100){
			console.log('STOMP: stopped reconect');
		}else {
			$scope.retriesToConnectAux++;
			console.log('STOMP: Reconecting in 1 second');
			$timeout($scope.connect, 1000);
		}
	};
	
	$scope.stompSuccessCallback = function (frame) {
	    stompStatus = true;
	    stompClient.subscribe('/quorum/reset', function (message) {
	    	$scope.$apply(function () {
	    		console.log(message.body);
	    		location.reload();
			});
		});	
	 };

	$scope.connect = function() {
		var socket = new SockJS('/votes-socket');
		stompClient = Stomp.over(socket);
		stompClient.debug = null;
		stompClient.connect({}, $scope.stompSuccessCallback, $scope.stompFailureCallback);
	};

	const constructor1 =()=>{		
		if(!LoginService.isAuthenticated()) {
			$rootScope.title = "sin sesion";
		}else{
			if($rootScope.userSession){
				$scope.rols = [];
				$scope.userRol = $rootScope.userSession.user.userRol.roleName;
				if(MenuHasSubMenuService.getIndexMenu() > 0){
					console.log('GetSubMenus ');
					console.log(MenuHasSubMenuService.getIndexMenu());
					$scope.getSubMenu(MenuHasSubMenuService.getIndexMenu());
					//MenuHasSubMenuService.setIndexMenu(0);
				}else{
					$scope.getMenu();	
				}
				$rootScope.title = "MENÚ DE OPCIONES";
			}else{
				//TODO
				swal("Error","SIN USUARIO EN SESIÓN", "error");	
			}			
		}
	}

	angular.element(document).ready(function(){
		constructor1();
	});	

});