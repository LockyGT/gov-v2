app.controller('initiativePeriodReportCtrl', function($scope, reportService,voteSessionService,voteSessionTypeService, $timeout, $filter){
	$scope.selected = {
			startDate: new Date(),
			endDate: new Date(),
			typeSessions: [],
			sessions:[],
			initiatives: [],
			results: []
	};
	
	$scope.initiativeReport = [];
	$scope.initiatives      = [];
	$scope.sessions         = [];
	
	
	$scope.getResultsReport = () => {
		console.log('Obtener selecciones: ',$scope.selected);
	};
	
	$scope.getTypeSessions = () => {
		voteSessionTypeService.get().then(data=>{
			$scope.typeSessions = data;
			console.log('Tipos de sesión obtenidas: ', data);
		}, error=>{
			console.log('Error al obtener el tipo de sesión: ', error);
		});
	};
	
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"fecha": selected.startDate,
			"fechaFin": selected.endDate
		};
		console.log('fechas: ', sendData);
		voteSessionService.getInDateBetweenEndBetween(sendData).then(data=>{
			$scope.sessions = data;
			$scope.initiatives = [];
			console.log('Error en los datos: ', data);
			
		}, error=>{
			console.log('Error al obtener las sesiones: ', error);
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
	
	$scope.updateSelectedTypeSessions = () => {
		
		$timeout( () => {
			$scope.selected.typeSessions = $filter('filter')($scope.typeSessions, {checked: true});
		},500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout( () => {
			$scope.selected.sessions = $filter('filter')($scope.sessions, {checked: true});
			$scope.getInitiatives();
		});
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			$scope.selected.sessions = $filter('filter')($scope.initiatives, {checked: true});
		},500);
	};
	
	$scope.updateSelectedResults = () => {
		console.log('DIO click en el boton');
		$timeout( () => {
			$scope.selected.results = $filter('filter')($scope.results, {checked: true});
		},500);
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
		$scope.initiativeReport.title = 'Resultados - Periodos';
		$scope.initiativeReport.headRows = [{date:"Fecha", typeSession:"Tipo de sesión", session:"sesión", 
			initiative:"Iniciativa", timeVote:"Tiempo para votar", aFavor:"A favor", against: "En contra",
			abstention:"Abstención", notVote: "No votó", present:"Presentes", missing:"Ausentes", 
			result: "Resultado"}];
		
		$scope.initiativeReport.headRows = [{date:"", typeSession:"", session:"", initiative:"", timeVote:"",
			aFavor:"", against: "", abstention:"", notVote: "", present:"", missing:"", result: ""}];
		
		reportService.printPdf($scope.resultsReport).then(doc=>{
			doc.setProperties({
				title:"Reporte: Resultados - Periodos",
				subject:'Reporte pdf de los Resultados - Periodos'
			});
			doc.save('Reporte_resultados-periodos.pdf');
		}, errorDoc=>{
			console.log('Error al obtener el reporte');
		});
	};
	
	const initController = () => {
		$scope.getTypeSessions();
		$scope.getResultsInitiatives();
	};
	
	angular.element(document).ready(function(){
		initController();
	});
}); 