app.service('initiativeHasPartnerService', function($q, factory) {
	var self = this;
	var path = 'iniciativahaspartner';
	
	self.getByInitiativeId = (initiativeId)=>{
		return $q(function(resolve, reject) {
			let data = {
					"id": initiativeId					
			};
			factory.get(path, data).then(function mySuccess(data) {
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
		
	self.get = ()=>{
		return $q(function(resolve, reject) {
			factory.get(path).then(function mySuccess(data) {
				if(data){
	  				console.log(data);	
	  				resolve(data);
	  			}else{
	  				return false;
	  			}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};	
	
	
	self.put = (partner)=>{
		return $q(function(resolve, reject) {
			factory.put(path, partner).then(function mySuccess(data) {
				if(data){
	  				console.log(data);	
	  				resolve(data);
	  			}else{
	  				return false;
	  			}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	
	self.post = (partner)=>{
		return $q(function(resolve, reject) {
			factory.post(path, partner).then(function mySuccess(data) {
				if(data){
	  				console.log(data);	
	  				resolve(data);
	  			}else{
	  				return false;
	  			}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
});