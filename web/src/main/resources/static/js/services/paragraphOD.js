app.service('paragraphodService', function($q, factory) {
	let self = this;

	self.get = () => {
		return $q((resolve, reject)=>{
			factory.get('paragraphod').then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.post = (paragraphod) => {
		return $q((resolve, reject)=>{
			factory.post('paragraphod', paragraphod).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.put = (paragraphod) => {
		return $q((resolve, reject)=>{
			factory.put('paragraphod',paragraphod).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.deleteParagraphod = (paragraphod)=>{
		return $q((resolve, reject)=>{
			factory.put('paragraphod/delete',paragraphod).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};
});