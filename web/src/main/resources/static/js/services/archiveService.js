app.service('archiveService', function ($q, factory){
	
	let self = this;
	
	self.get = (moduloodid)  => {
		let data = {
				"status": 1,
				"moduloodid": moduloodid,
				"moduloodstatus": 1
				};
		return $q((resolve, reject)=>{
			factory.get('documentFile', data).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.getRecordsBetweenDates = (data)  => {
		console.log('informacion enviada: ', data);
		return $q((resolve, reject)=>{
			factory.get('documentFile/between-dates', data).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.post = (archive)  => {
		return $q((resolve, reject)=>{
			factory.post('documentFile', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.put = (archive)  => {
		return $q((resolve, reject)=>{
			factory.put('documentFile', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
	self.delArchive = (archive)  => {
		return $q((resolve, reject)=>{
			factory.put('documentFile/delete', archive).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
	
});