app.service('documentoPartnerService', function($q, factory) {
	var self = this;
	var path = 'documentoPartner';
	

	self.get = (idPartner)=>{
		return $q(function(resolve, reject) {
			let dataToSend = {
					"idPartner": idPartner
			};
			
			factory.get(path, dataToSend).then(function success(data){
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
	
	self.post = (categoriaDeDocumentos)=>{
		return $q(function(resolve, reject) {
			factory.post(path, categoriaDeDocumentos).then(function mySuccess(data) {
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
	self.put = (categoriaDeDocumentos)=>{
		return $q(function(resolve, reject) {
			factory.put(path, categoriaDeDocumentos).then(function mySuccess(data) {
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