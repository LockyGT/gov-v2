app.service('elementOdService', function ($q, factory){
	let self = this;
	let path= 'elementOd';
	self.get = ()  => {		
		return $q((resolve, reject)=>{
			factory.get(path).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.getElementParagraph = ()  => {		
		return $q((resolve, reject)=>{
			factory.get('/elementParagraph').then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	

	self.getNameOrder = ()=>{
		return $q(function(resolve, reject) {			
			factory.get(path+"/name/element").then(function mySuccess(data) {
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

	self.post = (elementOd)  => {
		return $q((resolve, reject)=>{
			factory.post(path,elementOd).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.put = (elementOd) => {
		return $q((resolve, reject)=>{
			factory.put(path,elementOd).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	
	
	self.deleteElement = (elementOd)=>{
		return $q((resolve, reject)=>{
			factory.put(path+'/delete',elementOd).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});