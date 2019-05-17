app.service('elementOdService', function ($q, factory){
	let self = this;
	self.get = ()  => {		
		return $q((resolve, reject)=>{
			factory.get('elementOd').then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};

	self.post = (elementOd)  => {
		return $q((resolve, reject)=>{
			factory.post('elementOd', elementOd).then(function success(data){
				resolve(data);
			}, function error(errorData){
				reject(errorData);
			});
		});
	};
});