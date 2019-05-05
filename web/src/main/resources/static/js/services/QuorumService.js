app.service('quorumService', function($q, factory) {
	var self = this;	
	var path = 'quorum';
	self.getByDatesBetween = (date1, date2)=>{		
		return $q(function(resolve, reject) {			
			let data = { 
					'date1' : date1,
					'date2' :  date2
			};
			factory.get(path+'/betweendates', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.post = (quorum)=>{		
		return $q(function(resolve, reject) {			
			factory.post(path, quorum).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.postInDay = (quorum)=>{		
		return $q(function(resolve, reject) {			
			factory.post(path+'/day', quorum).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getQuorumToday=()=>{
		return $q(function(resolve, reject) {			
			factory.get(path+'/today').then(function mySuccess(data) {			
				console.log(data);
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.reiniciarQuorum=(partnerId)=>{
		return $q(function(resolve, reject) {	
			console.log(partnerId);
			let data ={
					'partnerId' : partnerId
			};
			factory.get(path+'/reiniciar',data).then(function mySuccess(data) {			
				console.log(data);
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});