var app = angular.module('votesApp', ['ui.router', 'chart.js', 'angular-loading-bar', 'ngAnimate']);



app.constant('_INICIATIVA', {
	_CREATED: 0,
	_INITIATED: 1,
	_STOPED: 2,	
	_PAUSED: 3,
	_DELETED: 4,
	_ERROR: 5,
	_FINALIZED: 6
});

app.constant('_SESION', {
	_CREATED: 0,
	_INITIATED: 1,
	_STOPED: 2,	
	_PAUSED: 3,
	_DELETED: 4,
	_ERROR: 5,
	_FINALIZED: 6
});

app.constant('_PARTNER', {
	_TYPE: {
		_UNDEFINED: 0,
		_LEGISLATOR: 1,
		_OPERATOR: 2
	}, 
	_STATUS: {
		_INACTIVE: 0,
		_ACTIVE: 1
	}
});
app.constant('_STATUS', {
	_INACTIVE: 0,
	_ACTIVE: 1
});

app.constant('_ATTENDANCE', {
	_INACTIVE: 0,
	_ACTIVE: 1,
	_SAVED: 2
});

app.constant('_ORDERDAY',{
	_ELIMINADA:-1,
	_INACTIVA: 0,
	_ACTIVA:1,
	_SUSTITUIDA:2,
	_APROBADA: 3,
	_NOAPROVADA:4,
	_PUBLICADA:5
});


app.run(function($rootScope, $location, $state, LoginService) {

	$rootScope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams){ 
		console.log('Changed state to: ' );
		console.log(toState);
	});
	$rootScope.$on('$locationChangeSuccess', function() {

	});
});

app.config(['$stateProvider', '$urlRouterProvider' , function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');

	$stateProvider
	.state('index', {
		url : '/',
		templateUrl : 'index.html',
		controller : 'mainCtrl'		
	})
	.state('attendance', {
		url : '/attendance',
		params: {
			session: null
		},
		templateUrl : './views/admin/attendance.html',
		controller : 'attendanceCtrl' ,
		resolve: { authenticate: authenticate }
	})
	.state('login', {
		url : '/login',
		templateUrl : 'login.html',
		controller : 'inicioCtrl'		
	})
	.state('home', {
		url : '/home',
		templateUrl : './views/admin/indexMenu.html',
		controller : 'HomeController',
		resolve: { authenticate: authenticate }
	}).state('submenu', {
		url : '/submenu',
		templateUrl : './views/admin/indexSubMenu.html',
		controller : 'HomeController',
		resolve: { authenticate: authenticate }
	})
	.state('panel', {
		url : '/panel',
		templateUrl : './views/admin/panel.html',
		controller : 'panelCtrl',
		resolve: { authenticate: authenticate }
	})
	.state('partners', {
		url : '/partners',
		templateUrl : './views/admin/partner.html',
		controller : 'partnerCtrl',
		resolve: { authenticate: authenticate }
	})
	.state('partners.enrollment', {
		url : '/enrollment',
		params: {
			partner: null
		},
		templateUrl : './views/admin/fingerEnrollment.html',
		controller : 'fingerEnrollmentCtrl' ,
		resolve: { authenticate: authenticate }
	})
	.state('iniciativas', {
		url : '/iniciativas',
		templateUrl : './views/admin/iniciarVotaciones.html',
		controller : 'iniciarVotacionesCtrl',
		resolve: { authenticate: authenticate }
	})
	.state('sesiones', {
		url : '/sesiones',
		templateUrl : './views/admin/voteSession.html',
		controller : 'voteSessionCtrl',
		resolve: { authenticate: authenticate }
	})
	.state('votacion', {
		url : '/votacion',
		templateUrl : './views/admin/votacionUsuario.html',
		controller : 'votacionUsuarioCtrl',
		resolve: { authenticate: authenticate }
	})      
	.state('partido', {
		url : '/partido',
		templateUrl : './views/admin/politicalParty.html',
		controller : 'politicalPartyCtrl',
		resolve: { authenticate: authenticate }
	}).state('reporte', {
		url : '/reporte',
		templateUrl : './views/admin/reportes.html',
		controller : 'reportesCtrl',
		resolve: { authenticate: authenticate }
	}).state('misvotos', {
		url : '/misvotos',
		templateUrl : './views/admin/misVotos.html',
		controller : 'misVotosCtrl',
		resolve: { authenticate: authenticate }
	}).state('quorum', {
		url : '/quorum',
		templateUrl : './views/admin/quorum.html',
		controller : 'quorumCtrl',
		resolve: { authenticate: authenticate }
	}).state('reportePresentes', {
		url : '/reportePresentes',
		templateUrl : './views/admin/reportePresentes.html',
		controller : 'reportePresentesCtrl',
		resolve: { authenticate: authenticate }
	}).state('initiativePeriodReport', {
		url : '/initiativePeriodReport',
		templateUrl : './views/admin/initiativePeriodReport.html',
		controller : 'initiativePeriodReportCtrl',
		resolve: { authenticate: authenticate }
	}).state('reporteQuorum', {
		url : '/reporteQuorum',
		templateUrl : './views/admin/reporteQuorum.html',
		controller : 'reporteQuorumCtrl',
		resolve: { authenticate: authenticate }
	}).state('reporteAsistenciasSesiones', {
		url : '/reporteAsistenciasSesiones',
		templateUrl : './views/admin/reporteAsistenciasSesiones.html',
		controller : 'reporteAsistenciasSesionesCtrl',
		resolve: { authenticate: authenticate }
	}).state('legislatorReport', {
		url : '/legislatorReport',
		templateUrl : './views/admin/legislatorReport.html',
		controller : 'legislatorReportCtrl',
		resolve: { authenticate: authenticate }
	}).state('reporteLegislatura', {
		url : '/reporteLegislatura',
		templateUrl : './views/admin/reporteLegislatura.html',
		controller : 'reporteLegislaturaCtrl',
		resolve: { authenticate: authenticate }
	}).state('resultsInitiativesReport', {
		url : '/resultsInitiativesReport',
		templateUrl : './views/admin/resultsInitiativesReport.html',
		controller : 'resultsInitiativesReportCtrl',
		resolve: { authenticate: authenticate }
	}).state('listaAsistenciaSesionSinIniciativa', {
		url : '/listaAsistenciaSesionSinIniciativa',
		templateUrl : './views/admin/listaAsistenciaSesionSinIniciativa.html',
		controller : 'quorumCtrl',
		resolve: { authenticate: authenticate }
	}).state('gazette', {
		url : '/gazette',
		templateUrl : './views/admin/gazette.html',
		controller : 'gazetteCtrl',
		resolve: { authenticate: authenticate }
	}).state('orderoftheday', {
		url : '/orderoftheday',
		templateUrl : './views/admin/orderOfTheDay.html',
		controller : 'orderOfTheDayCtrl',
		resolve: { authenticate: authenticate }
	}).state('modulood', {
		url : '/modulood',
		templateUrl : './views/admin/modulood.html',
		controller : 'moduloodCtrl',
		resolve: { authenticate: authenticate }
	}).state('orderday', {
		url : '/orderday',
		templateUrl : './views/admin/orderDay.html',
		controller : 'orderDayCtrl',
		resolve: { authenticate: authenticate }
	}).state('elementOd', {
		url : '/elementOd',
		templateUrl : './views/admin/elementOd.html',
		controller : 'elementOdCtrl',
		resolve: { authenticate: authenticate }
	}).state('archive', {
		url : '/archive/:id',
		templateUrl : './views/admin/archive.html',
		controller : 'archiveCtrl',  
		resolve: { authenticate: authenticate }
	}).state('demo', {
		url : '/demo',
		templateUrl : './views/admin/demoVersionFile.html',
		controller : 'demoVersionFileCtrl',
		resolve: { authenticate: authenticate }
	}).state('rrhh', {
		url : '/rrhh',
		templateUrl : './views/admin/rrhh.html',
		controller : 'rrhhCtrl',
		resolve: { authenticate: authenticate }
	}).state('organigrama', {
		url : '/organigrama',
		templateUrl : './views/admin/organigrama.html',
		controller : 'organigramaCtrl',
		resolve: { authenticate: authenticate }
	}).state('categoriaDeDocumentos', {
		url : '/categoriaDeDocumentos',
		templateUrl : './views/admin/categoriaDeDocumentos.html',
		controller : 'categoriaDeDocumentosCtrl',
		resolve: { authenticate: authenticate }
	}).state('documentoPartner', {
		url : '/documentoPartner',
		params: {
			partnerId: null,
			namePartner: null,
			tipoPartner: null
		},
		templateUrl : './views/admin/documentoPartner.html',
		controller : 'documentoPartnerCtrl' ,
	}).state('electronic-file', {
		url : '/electronic-file',
		templateUrl : './views/admin/electronic-file.html',
		controller : 'electronicFileCtrl',
		resolve: { authenticate: authenticate }
	}).state('record-legislators', {
		url : '/record-legislators',
		templateUrl : './views/admin/record-legislators.html',
		controller : 'recordLegislatorsCtrl',
	}).state('folders-administrators', {
		url : '/folders-administrators',
		templateUrl : './views/admin/folder-administrators.html',
		controller : 'folderAdministratorCtrl',
	}).state('record-admin', {
		url : '/record-admin/:id',
		templateUrl : './views/admin/record-administrators.html',
		controller : 'recordAdministratorsCtrl',
	});
	
	function authenticate($q, $state, $timeout, LoginService) {
		if (LoginService.isAuthenticated()) {
			// Resolve the promise successfully
			return $q.when()
		} else {
			// The next bit of code is asynchronously tricky.

			$timeout(function() {
				// This code runs after the authentication promise has been rejected.
				// Go to the log-in page
				$state.go('login')
			})

			// Reject the authentication promise to prevent the state from loading
			return $q.reject()
		}
	}

}]);

app.directive('customOnChange', function() {
	  return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	      var onChangeHandler = scope.$eval(attrs.customOnChange);
	      element.on('change', onChangeHandler);
	      element.on('$destroy', function() {
	        element.off();
	      });

	    }
	  };
});

//your directive
app.directive("fileread", ['$rootScope', function($rootScope) {
	return {
		scope: {
			fileread: "="
		},
		link: function(scope, element, attributes) {
			element.bind("change", function(changeEvent) {
				var reader = new FileReader();
				reader.onload = function(loadEvent) {
					scope.$apply(function() {
						scope.fileread = loadEvent.target.result;
					});
				}
				$rootScope.fileName = "";
				reader.readAsDataURL(changeEvent.target.files[0]);				
				$rootScope.fileName = changeEvent.target.files[0].name;
			});
		}
	}
}]);