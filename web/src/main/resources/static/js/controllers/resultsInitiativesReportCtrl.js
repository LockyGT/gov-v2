app.controller('resultsInitiativesReportCtrl', function($scope, voteSessionService,reportService, voteSessionTypeService,$timeout, $filter){
	
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	
	$scope.resultsReport = [];
	$scope.initiatives   = [];
	$scope.sessions      = [];
	$scope.filter        = {};
	
	$scope.getResultsReport = () => {
		console.log('Obtener selcciones: ', $scope.selected);
		
		dataReport = {
				sessionsId: $scope.selected.sessions.map(f=> f.id),
				initiativesId: $scope.selected.initiatives.map(f=> f.id)
		};

		reportService.getResultInitiative(dataReport).then(success=>{
			$scope.resultsReport = JSON.parse(success.data);
			console.log('Informacion del reporte: ', $scope.resultsReport);
		}, error=>{
			console.log('Error al obtener la informacion: ', error);
		});
	};
	
	$scope.getTypeSession = () => {
		voteSessionTypeService.get().then(data=>{
			$scope.typeSessions = data;
			console.log('Tipos de sesión obtenidas: ', data);
		},error=>{
			console.log('Error al obtener el tipo de sesión: ', error);
		});
	}
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"fecha": selected.startDate,
			"fechaFin": selected.endDate
		};
		voteSessionService.getInDateBetweenEndBetween(sendData).then(data=>{
			$scope.sessions = data;
			$scope.initiatives = [];
		}, error=>{
			console.log('Error al obtener las sesiones: ', error)
		});
	};
	
	$scope.getInitiatives = () => {
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
			});
		}
	};
	
	$scope.getResultsInitiatives = () => {
		console.log('Informacion de resultados: ')
		$scope.results = [{name:'Aprobado'}, {name:'No aprobado'}];

	};
	
	$scope.checkAllOptions = (array, e) => {
		
		angular.forEach(array, function(el){
			el.checked = e.target.checked;
		});
		$scope.updateSelectedTypeSession();
		$scope.updateSelectedSessions();
		$scope.updateSelectedInitiatives();
		$scope.updateSelectedResults();
	};
	// Filters
	$scope.updateSelectedTypeSession = () => {
		console.log('Informacion de la sesion: ')
		$timeout( () => {
			$scope.selected.typeSessions = $filter('filter')($scope.typeSessions, {checked: true});
		}, 500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout ( () => {
			$scope.selected.sessions = $filter('filter')($scope.sessions, {checked: true});
			$scope.getInitiatives();
		}, 500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			$scope.selected.initiatives = $filter('filter')($scope.initiatives, {checked: true});
		}, 500);
	};
	
	$scope.updateSelectedResults = () => {
		$timeout( () => {
			$scope.selected.results = $filter('filter')($scope.results, {checked: true});			
		}, 500);
	};
	
	$scope.filterTypeSession = e => {
		let res = $scope.selected.typeSessions.find(function(element){
			return element.id == e.type.id;
		});
		
		if(res){
			return true;
		}
		return false;
	};
	
	$scope.filterResult = e => {
		let res = $scope.selected.results.find(function (element){
			return element.name == e.result.resultName;
		});
		if(res){
			return true;
		}
		return false;
	};
	
	$scope.printTable = () => {
		$scope.resultsReport.title = 'Resultados - Periodos';
		$scope.resultsReport.headRows = [{date:'Fecha', typeSessions:'Tipo de sesión',session:'Sesión',
			initiative:'Iniciativa', present:'Presentes', formula:'Formula de cálculo', method: 'Método de redondeo',
			result:'Resultado'}];
		$scope.resultsReport.footRows = [{date:'', typeSessions:'',session:'', initiative:'', present:'',
			formula:'', method: '',result:''}];
		$scope.resultsReport.bodyRows = bodyRows($scope.resultsReport.data);
		
		reportService.printPdf($scope.resultsReport).then(doc=>{
			doc.setProperties({
				title: 'Reporte: Legislador',
				subject: 'Reporte pdf de los legisladores'
			});
			doc.save('Reporte_resultados-periodos.pdf');
		}, errorDoc=>{
			console.log('Error al obtener el reporte: ', errorDoc);
		});
	};
	
	function bodyRows (arrayJson){
		let body = [], date;
		
		arrayJson.forEach(function (json){
			date = new Date(json.date)
			body.push({date:date.getDate() + "/" + (date.getMonth() +1) + "/" + date.getFullYear(), 
				typeSessions:json.typeSession,session:json.session, initiative:json.initiative, present:json.present,
				formula:json.formula, method: json.method,result:json.result});
		});
		return body;
	}
	
	const initController = () => {
		$scope.getTypeSession();
		$scope.getResultsInitiatives();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});