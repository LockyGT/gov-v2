app.service('orderdayService', function($q, factory) {
	let self = this;
	let path= 'orderday';
	self.get = () => {
		return $q((resolve, reject)=>{
			factory.get(path).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	
	self.getPdf = (orderday)=>{		
		return $q(function(resolve, reject) {			
			factory.get('reportOd/getPdf', orderday).then(function mySuccess(data) {	
				
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	
	self.getByDateAndStatusWithoutReference = (data)=>{
		return $q(function(resolve, reject) {			
			factory.get(path +'/date',data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByDateBetween = (date)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/date/between', date).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getBetweenDatesPublished = (data)  => {
		console.log('informacion enviada: ', data);
		return $q((resolve, reject)=>{
			factory.get(path+'/datesbetween', data).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.getById = (date)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/fetch/id', date).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByStatus = (status)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/status', status).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.getByStatusPublicada = (status)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/published', status).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getByStatusAprobada = (status)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/approved', status).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getActiveWithAndWithoutReference = ()=>{
		return $q(function(resolve, reject) {			
			factory.get(path+"/active/reference/with/without").then(function mySuccess(data) {
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
	/******************************************************************/
	self.getSustituidaWithReference = ()=>{
		return $q(function(resolve, reject) {			
			factory.get(path+"/status/reference/with/without").then(function mySuccess(data) {
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
	
	self.getOdOriginal = (odOriginal)=>{
		let params = {"odOriginal": odOriginal};
		return $q(function(resolve, reject) {			
			factory.get(path+"/odOriginal",params).then(function mySuccess(data) {
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
	
	self.post = (orderday) => {
		return $q((resolve, reject)=>{
			factory.post(path, orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.postNewVerssion = (orderday) => {
		return $q((resolve, reject)=>{
			factory.post(path+"/newVerssion", orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	}; 
	
	self.put = (orderday) => {
		return $q((resolve, reject)=>{
			factory.put(path,orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.putPublished = (orderday) => {
		return $q((resolve, reject)=>{
			factory.put(path+'/updatePublished',orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	
	
	self.deleteOrderDay = (orderday)=>{
		return $q((resolve, reject)=>{
			factory.put(path+'/delete',orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});