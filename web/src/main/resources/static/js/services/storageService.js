app.service('storageService', function($q, factory) {
	var self = this;	
	var path = "files";
	self.getB64 = (file)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/stringb64', file).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

});