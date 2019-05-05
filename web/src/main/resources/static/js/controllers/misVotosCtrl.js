app.controller('misVotosCtrl', function($rootScope,$scope,$http, $window,$log,factory, initiativeService, _INICIATIVA) {

	$scope.votes = [];
	$scope.partner = {};
	
	$scope.getVotesByPartnerId =(partner) =>{	
		let map = new Object(); 
		map['partnerId'] = partner.id;
		factory.get('vote/partner', map).then(function mySuccess(data) {			
			if(data ){
				$scope.votes = data;
			}	
		}, function myError(response) {
			$scope.myWelcome = response.statusText;
			swal("Error",$scope.myWelcome, "error");			
		});
	};
	
	const initController = () =>{
		$scope.partner = $rootScope.userSession;
		$rootScope.title = "MIS VOTOS";
		$scope.getVotesByPartnerId($scope.partner);
	};
	
	angular.element(document).ready(function () {
		initController();
	});

});

