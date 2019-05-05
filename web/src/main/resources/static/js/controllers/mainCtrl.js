app.controller('mainCtrl', function($rootScope, $scope) {

	dows = new Array("Domingo", "Lunes", "Martes","Miercoles", "Jueves", "Viernes", "Sabado");
	months = new Array("Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio", "Agosto","Septiembre", "Octubre", "Noviembre","Diciembre");
	now = new Date();
	dow = now.getDay();
	d = now.getDate();
	m = now.getMonth();
	h = now.getTime();
	y = now.getFullYear();
	$scope.fecha= dows[dow] + " " + d + " de " + months[m] + " de " + y;
	$scope.userData={};
	$scope.bgClassBody  = 'bg-body';	
	
	

	$scope.showLogAttendance =(attendance)=>{
		if($rootScope.userSession){
			$state.go('index.attendance', {partner: leg});
			$('#attendanceModal').modal('show');
		}
	}
	
	const initController = () =>{
		$rootScope.title = "iniciando...";
		
	};

	angular.element(document).ready(function () {
		initController();
	});

});