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