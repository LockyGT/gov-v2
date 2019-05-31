app.controller('legislatorReportCtrl', function($scope, voteSessionService, voteService, partnerService, factory, $filter, $timeout){
	
	$scope.selected ={
			startDate : new Date(),
			endDate: new Date(),
			parties: [],
			legislators: [],
			sessions: [],
			initiatives:[]
	}
	
	$scope.sessions = [];
	$scope.initiatives = [];
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"fecha":selected.startDate,
			"fechaFin":selected.endDate
		};
		voteSessionService.getInDateBetweenEndBetween(sendData).then(data=>{
			
			$scope.sessions = data;
		}, error => {
			swal("Error", response, "error");
		});
	};
	
	$scope.getInitiatives = () => {
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
				console.log('Iniciativas: ', $scope.initiatives);
			});
		}
	};
	
	$scope.getPoliticalParties = () =>{	
		factory.get('politicalparty').then(function mySuccess(data) {			
			$scope.politicalParties = data;
			console.log('Partidos: ', data);
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	$scope.getLegislator = () => {
		let sendData = {
				"status": 1,
				"tipo": 1
		};
		partnerService.getByStatusAndTipoAndPartie(sendData).then(data=>{
			$scope.legislators = data;
			console.log('Legisladores obtenidos: ',data);
		}, error=>{
			$console.log("error al obtener los legisladores: ",error);
		});
	};
	
	$scope.getVotes = () => {

		$scope.sessions.forEach(function(session){
			session.iniciativas.forEach(function(initiative){
				voteService.getByInitiativeId(initiative.id).then(votes => {
					initiative.votes = votes;
					console.log('votos encontrados: ', votes)
				}, error=>{
					console.log('Error al encontrar la iniciativa: ', error);
				});
			});
		});
	};
	
	
	$scope.checkAllOptions = (array, e) => {
		
		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		$scope.updateSelectedParties();
		$scope.updateSelectedLegislators();
		$scope.updateSelectedSessions();
		$scope.updateSelectedInitiatives();
	};
	
	$scope.updateSelectedParties = () => {
		$timeout(()=>{
			$scope.selected.parties = $filter('filter')($scope.politicalParties,{checked: true});
			console.log('Partidos seleccionados: ', $scope.selected.parties);
		},500);
		
	};
	
	$scope.updateSelectedLegislators = () => {
		$timeout(()=>{
			$scope.selected.legislators = $filter('filter')($scope.legislators,{checked: true});
			console.log('Legisladores seleccionados: ', $scope.selected.legislators);
		},500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout(()=>{
			$scope.selected.sessions = $filter('filter')($scope.sessions,{checked: true});
			$scope.getInitiatives();
		},500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout(()=>{
			$scope.selected.initiatives = $filter('filter')($scope.initiatives,{checked: true})
		},500);
	};
	
	$scope.getInfo = () =>{
		console.log('selecciones: ',$scope.selected);
//		console.log('sesiones: ', $scope.sessions);
	};
	
	const initController = () =>{
		$scope.getPoliticalParties();
		$scope.getLegislator();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});