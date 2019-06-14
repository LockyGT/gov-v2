app.service('organigramaService', function($q, factory) {
	var self = this;
	var pathOrganigrama = 'organigrama';
	

	self.get = ()=>{
		return $q(function(resolve, reject) {
			factory.get(pathOrganigrama).then(function mySuccess(data) {
				if(data){	  					
	  				resolve(data);
	  			}else{
	  				return false;
	  			}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};	
	
	self.post = (orangriama)=>{
		return $q(function(resolve, reject) {
			factory.post(pathOrganigrama, orangriama).then(function mySuccess(data) {
				if(data){						
					resolve(data);
				}else{
					resolve(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.put = (orangriama)=>{
		return $q(function(resolve, reject) {
			factory.put(pathOrganigrama, orangriama).then(function mySuccess(data) {
				if(data){						
					resolve(data);
				}else{
					resolve(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
});