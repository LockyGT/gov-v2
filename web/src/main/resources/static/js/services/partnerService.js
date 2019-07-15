app.service('partnerService', function($q, factory) {
	var self = this;
	var path = 'partner';
	
	self.get = ()=> {
		return $q(function(resolve, reject) {
			factory.get(path).then(function mySuccess(data) {
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
	
	self.getByStatus = (status)=>{
		return $q(function(resolve, reject) {
			let data = {
					"status": status					
			};
			factory.get(path+"/byStatus", data).then(function mySuccess(data) {
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
	
	self.getByStatusAndTipoAndAreaId = (data)=>{
		return $q(function(resolve, reject) {
			factory.get(path+"/by/status/tipo/area", data).then(function mySuccess(data) {
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
	
	self.getByStatusAndTipoAndPartie = (data)=>{
		return $q(function(resolve, reject) {
			factory.get(path+"/byTipo/partie", data).then(function mySuccess(data) {
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
	
	
	self.getByStatusInit = (status)=>{
		return $q(function(resolve, reject) {
			let data = {
					"status": status					
			};
			factory.get(path+"/byStatus/init", data).then(function mySuccess(data) {
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

	self.getPartnerBySku = (sku)=>{
		return $q(function(resolve, reject) {
			let data = {
					"sku": sku					
			};
			factory.get(path+'/bySku', data).then(function mySuccess(data) {
				if(data){
					console.log('resolveDATA');
					resolve(data);
				}else{
					console.log('RETURN NULL');
					resolve(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.getPartnerByUsername = (username)=>{
		return $q(function(resolve, reject) {
			let data = {
					"username": username					
			};
			factory.get(path+'/byUsername', data).then(function mySuccess(data) {
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
	
	self.getPartnerByUsernameInit = (username)=>{
		return $q(function(resolve, reject) {
			let data = {
					"username": username					
			};
			factory.get(path+'/byUsername/init', data).then(function mySuccess(data) {
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

	self.put = (partner)=>{
		return $q(function(resolve, reject) {
			factory.put(path, partner).then(function mySuccess(data) {
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


	self.post = (partner)=>{
		return $q(function(resolve, reject) {
			factory.post(path, partner).then(function mySuccess(data) {
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