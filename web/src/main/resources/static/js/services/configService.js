app.service('configService', function($q, factory) {
	var self = this;
	self.get = ()=>{		
		return $q(function(resolve, reject) {			
			factory.get('config/auth').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getPE = ()=>{		
		return $q(function(resolve, reject) {			
			factory.get('config/auth-password').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});