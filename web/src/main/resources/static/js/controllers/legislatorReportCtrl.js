app.controller('legislatorReportCtrl', function($scope, voteSessionService, voteService, partnerService, factory, $filter, $timeout, reportService){
	
	$scope.selected = {
			startDate : new Date(),
			endDate: new Date(),
			parties: [],
			legislators: [],
			sessions: [],
			initiatives:[]
	};
	
	$scope.legislatorsReport = [];
	$scope.initiatives       = [];
	$scope.sessions          = [];
	$scope.filter            = {};
	
	$scope.getReportLegislator = () => {
		dataReport = {
				partnersId: $scope.selected.legislators.map(f=> f.id),
				initiativesId: $scope.selected.initiatives.map(f=> f.id)
		};

		reportService.getLegislatorReport(dataReport).then(success=>{
			$scope.legislatorsReport = JSON.parse(success.data);
			console.log('Informacion del reporte: ', $scope.legislatorsReport);
		}, error=>{
			console.log('Error al obtener el nombre del legislador: ', error);
		});
	};
	
	$scope.getSessionsBetweenDates = (selected) => {
		let sendData = {
			"fecha":selected.startDate,
			"fechaFin":selected.endDate
		};
		voteSessionService.getInDateBetweenEndBetween(sendData).then(data=>{
			$scope.sessions = data;
			$scope.initiatives = [];
		}, error => {
			swal("Error", response, "error");
		});
	};
	
	$scope.getInitiatives = () => {
		if($scope.selected.sessions.length){
			$scope.selected.sessions.forEach(function(session){
				$scope.initiatives = $scope.initiatives.concat(session.iniciativas);
			});
		}
	};
	
	$scope.getPoliticalParties = () =>{	
		factory.get('politicalparty').then(function mySuccess(data) {			
			$scope.politicalParties = data;
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
		}, error=>{
			$console.log("error al obtener los legisladores: ",error);
		});
	};
	
	$scope.getVotes = () => {

		$scope.sessions.forEach(function(session){
			session.iniciativas.forEach(function(initiative){
				voteService.getByInitiativeId(initiative.id).then(votes => {
					initiative.votes = votes;
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
		$timeout( () => {
			$scope.selected.parties = $filter('filter')($scope.politicalParties,{checked: true});
			
		},500);
		
	};
	
	$scope.updateSelectedLegislators = () => {
		$timeout( () => {
			$scope.selected.legislators = $filter('filter')($scope.legislators,{checked: true});
		},500);
	};
	
	$scope.updateSelectedSessions = () => {
		$timeout( () => {
			$scope.selected.sessions = $filter('filter')($scope.sessions,{checked: true});
			$scope.getInitiatives();
		},500);
	};
	
	$scope.updateSelectedInitiatives = () => {
		$timeout( () => {
			$scope.selected.initiatives = $filter('filter')($scope.initiatives,{checked: true})
		},500);
	};
	

//	Inicia la impresion del reporte
	$scope.printTable = () => {
		$scope.legislatorsReport.title ="Legisladores";
		
		$scope.legislatorsReport.headRows = [{politicalparty: "Partido", legislator: "Legislador",
			district:"Distrito", commision: "Comisión", date: "Fecha", 
			vote:"Voto", initiatives: "Iniciativas",time:"Tiempo", result: "Resultado"}];
		
		$scope.legislatorsReport.footRows = [{politicalparty: "", legislator: "", district:"", 
			commision: "", date: "", vote:"", initiatives: "",time:"",
			result: ""}]
		
		$scope.legislatorsReport.bodyRows = bodyRows($scope.legislatorsReport.data);
		
		reportService.printPdf($scope.legislatorsReport).then(doc=>{

			doc.setProperties({
				title: 'Reporte: Legislador',
				subject: 'Reporte pdf de los legisladores'
			});
			doc.save('Reporte_legisladores.pdf');
		},errorDoc=>{
			console.log("Error al obtener el reporte: ", errorDoc);
		});

	};

	
	// Reestructura las columnas en la base de datos
	function bodyRows (arrayJson) {
		let body = [], date, sTime, eTime;
		
		arrayJson.forEach(function(json) {
			date = new Date(json.date);
			sTime = new Date(json.startTime);
			eTime = new Date(json.endTime);
			 
			body.push({politicalparty: json.politicalPartie, legislator: json.namePartner, 
				district:json.district, commision: json.commission, date:date.getDate() + '/' +(date.getMonth()+1)+'/'+ date.getFullYear(),
				vote: json.vote,initiatives: json.initiative, 
				time: sTime.getHours()+":"+sTime.getMinutes() +'-'+eTime.getHours()+":"+eTime.getMinutes(),
				result: json.result});
		});
		return body;
	}
	
	$scope.filterLegislator = e => {
		let r = $scope.selected.parties.find(function(element){
			return element.id == e.partido.id;
		});
		if(r){
			return true;
		}
		return false;

	};
	
	const initController = () => {
		$scope.getPoliticalParties();
		$scope.getLegislator();
	};
	
	angular.element(document).ready(function () {
		initController();
	});
});