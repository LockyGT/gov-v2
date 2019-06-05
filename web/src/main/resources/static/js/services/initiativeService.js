app.service('initiativeService', function($q, factory) {
	var self = this;
	self.getByIsClosedAndStatus = (closed, status)=>{
		let data = {
				"closed": closed,
				"status": status
		};
		return $q(function(resolve, reject) {			
			factory.get('iniciativa/isclosed/status', data).then(function mySuccess(data) {	
				console.log(data);
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getByIsClosedAndStatusAndDateBetween = (closed, status,date1,date2)=>{
		let data = {
				"closed": closed,
				"status": status,
				"date1" : date1,
				"date2" : date2
		};
		console.log('getbystatusclosedAndDate');
		return $q(function(resolve, reject) {			
			factory.get('iniciativa/isclosed/status/datebetween', data).then(function mySuccess(data) {	
				console.log(data);
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.get = () => {		
		return $q(function(resolve, reject) {			
			factory.get('iniciativa').then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};	
	self.post = (iniciativa)=>{		
		return $q(function(resolve, reject) {			
			factory.post('iniciativa', iniciativa).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.put = (iniciativa)=>{		
		return $q(function(resolve, reject) {			
			factory.put('iniciativa', iniciativa).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

});