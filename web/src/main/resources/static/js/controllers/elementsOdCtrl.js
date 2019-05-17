app.controller('elementsOdCtrl', function($log, $timeout, $scope,$http, $window,factory, $state,$location) {

	$scope.titleTabView = '';
	$scope.changeTitleTabView=(title)=>{
		$scope.titleTabView = title;
	};

	const initController = () =>{
		$scope.changeTitleTabView('ORDEN DEL DÍA');
		$rootScope.title = "ORDENES DEL DÍA";
		
	};

	angular.element(document).ready(function () {
		initController();
	});
}