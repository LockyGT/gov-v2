app.service('voteOptionService', function($q, factory) {
	var self = this;
	self.get = () => {		
		return $q(function(resolve, reject) {			
			factory.get('voteoption').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};	
});