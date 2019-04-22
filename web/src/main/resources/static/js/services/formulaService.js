app.service('formulaService', function($q, factory) {
	var self = this;	
	self.get = ()=>{		
		return $q(function(resolve, reject) {		
			factory.get('formula').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});