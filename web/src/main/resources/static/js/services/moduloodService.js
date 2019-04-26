app.service('moduloodService', function($q, factory) {
	let self = this;
	
	self.get = () => {
		return $q((resolve, reject)=>{
			factory.get('modulood').then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.post = (modulood) => {
		return $q((resolve, reject)=>{
			factory.post('modulood', modulood).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.put = (modulood) => {
		return $q((resolve, reject)=>{
			factory.put('modulood',modulood).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.deleteModulood = (modulood)=>{
		return $q((resolve, reject)=>{
			factory.put('modulood/delete',modulood).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});