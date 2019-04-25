app.service('utilsService', function($q, factory) {
	var self = this;
	self.getHandsMap = ()=>{		
		return $q(function(resolve, reject) {			
			factory.get('components/data/mapeo_huellas.json').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});