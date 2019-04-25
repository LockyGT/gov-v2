app.service('userService', function($q, factory) {
	var self = this;
	var pathUser = 'user';
	var pathRol = 'rol';
	
	self.getRol = ()=>{
		return $q(function(resolve, reject) {
			factory.get(pathRol).then(function mySuccess(data) {
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
	
	self.get = ()=>{
		return $q(function(resolve, reject) {
			factory.get(pathUser).then(function mySuccess(data) {
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
	
	self.getUserByUsername = (username)=>{
		let data = {
				"username": username					
		};
		return $q(function(resolve, reject) {
			factory.get(pathUser+'/username',data).then(function mySuccess(data) {
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
	
	self.getUserByUsernameAndStatus = (username, status)=>{
		let data = {
				"username": username,
				"status": status
		};
		return $q(function(resolve, reject) {
			factory.get(pathUser+'/username/status',data).then(function mySuccess(data) {
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