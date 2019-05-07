app.service('archiveService', function ($q, factory){
	
	let self = this;
	
	self.get = (moduloodid)  => {
		let data = {"moduloodid": moduloodid};
		return $q((resolve, reject)=>{
			factory.get('archivo', data).then(function success(data){
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
			factory.put('archivo/delete', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
});