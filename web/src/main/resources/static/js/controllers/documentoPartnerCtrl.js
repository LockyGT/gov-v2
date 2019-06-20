
app.controller('documentoPartnerCtrl', function($scope,partnerService,$window,documentoPartnerService,$state){
	$scope.partnerDocuments = [];
	
	$scope.loadDocuments = () => {
		documentoPartnerService.get($state.params.partnerId).then(function mySuccess(data) {			
			$scope.partnerDocuments = data;
			console.log(data);
		}, function myError(response) {
			console.log(response);
		});
	}
	
    $scope.uploadFile = function(event){
        $scope.file = event.target.files[0];
        $scope.index = event.currentTarget.attributes[3].value;
        $scope.partnerDocument = $scope.partnerDocuments[ $scope.index];
        console.log($scope.partnerDocument);
    };
	
	
	const initController = () => {
		$scope.loadDocuments();
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});