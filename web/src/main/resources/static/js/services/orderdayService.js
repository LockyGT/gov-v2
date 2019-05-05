app.service('orderdayService', function($q, factory) {
	let self = this;
	
	self.get = () => {
		return $q((resolve, reject)=>{
			factory.get('orderday').then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.post = (orderday) => {
		return $q((resolve, reject)=>{
			factory.post('orderday', orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.put = (orderday) => {
		return $q((resolve, reject)=>{
			factory.put('orderday',orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
	
	self.deleteOrderDay = (orderday)=>{
		return $q((resolve, reject)=>{
			factory.put('orderday/delete',orderday).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});