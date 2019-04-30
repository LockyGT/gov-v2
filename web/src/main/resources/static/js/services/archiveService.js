app.service('archiveService', function ($q, factory){
	
	let self = this;
	
	self.get = ()  => {
		return $q((resolve, reject)=>{
			factory.get('archivo').then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.post = (archive)  => {
		return $q((resolve, reject)=>{
			factory.post('archivo', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.put = (archive)  => {
		return $q((resolve, reject)=>{
			factory.put('archivo', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.delArchive = (archive)  => {
		return $q((resolve, reject)=>{
			factory.put('archivo', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
});