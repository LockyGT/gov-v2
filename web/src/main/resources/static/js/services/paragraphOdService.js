app.service('paragraphOdService', function ($q, factory){
	let self = this;
	let path= 'paragraph';
	self.get = ()  => {		
		return $q((resolve, reject)=>{
			factory.get(path).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.getByStatusIniciative = (status)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/iniciative', status).then(function mySuccess(data) {						
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
	self.post = (paragraphod) => {
		return $q((resolve, reject)=>{
			factory.post(path+'/paragraph', paragraphod).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.put = (paragraphod) => {
		return $q((resolve, reject)=>{
			factory.put(path+'/paragraph',paragraphod).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.deleteParagraph = (paragraph)=>{
		return $q((resolve, reject)=>{
			factory.put(path+'/delete/',paragraph).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});