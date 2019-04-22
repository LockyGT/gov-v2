app.service('partnerHasFingerPrintService', function($q, factory, _STATUS) {
	var self = this;
	var path = "partner/fingerprint";
	self.saveFingerPrint = (partner, fp)=>{
		return $q(function(resolve, reject) {
			let data = {
					"partner": partner,
					"fingerPrint":  fp,
					"status": _STATUS._ACTIVE
			};
			factory.post(path, data).then(function mySuccess(data) {
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

	self.getByPartnerId = (partnerId)=>{
		return $q(function(resolve, reject) {			
			factory.get(path+"/partner/"+partnerId).then(function mySuccess(data) {
				if(data){				
					resolve(data);
				}else{
					reject(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});
		});		
	};	
	
	self.getByPartnerIdAndStatus = (partnerId, status)=>{
		return $q(function(resolve, reject) {			
			factory.get(path+"/partner/"+partnerId+"/status/"+ status).then(function mySuccess(data) {
				if(data){				
					resolve(data);
				}else{
					reject(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});
		});		
	};

	self.validateFingerPrint = (partner, fp)=>{
		return $q(function(resolve, reject) {
			let data = {
					"partner": partner,
					"fingerPrint":  fp
			};
			factory.post(path+'/verify', data).then(function mySuccess(data) {
				console.log(data);					
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.validateFingerPrintSku = (partner, fp)=>{
		return $q(function(resolve, reject) {
			let data = {
					"partner": partner,
					"fingerPrint":  fp
			};
			factory.post(path+'/sku/verify', data).then(function mySuccess(data) {								
				resolve(data);				
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.validateFingerPrintUsername = (partner, fp)=>{
		return $q(function(resolve, reject) {
			let data = {
					"partner": partner,
					"fingerPrint":  fp
			};
			factory.post(path+'/username/verify', data).then(function mySuccess(data) {									
				resolve(data);				
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.deletePartnerFingerPrint = (partner, fp)=>{
		return $q(function(resolve, reject) {			
			factory.del(path+"/partner/"+partner.id+"/index/"+fp.fingerIndex).then(function mySuccess(data) {									
				resolve(data);				
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

});