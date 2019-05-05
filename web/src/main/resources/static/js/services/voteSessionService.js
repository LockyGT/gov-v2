app.service('voteSessionService', function($q, factory) {
	var self = this;
	self.getById = (id)=>{		
		return $q(function(resolve, reject) {			
			factory.get('votesession/'+id).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getInDateBetween = (date)=>{		
		return $q(function(resolve, reject) {			
			factory.get('votesession/date/between', date).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getInDateBetweenEndBetween = (dates)=>{		
		return $q(function(resolve, reject) {			
			factory.get('votesession/date/between/end/between', dates).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByStatus = (status)=>{		
		return $q(function(resolve, reject) {			
			factory.get('votesession/status', status).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getByOnAttendanceStatus = (status)=>{
		let data = {
				"status": status
		}
		return $q(function(resolve, reject) {			
			factory.get('votesession/attendance/status', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.post = (voteSession)=>{		
		return $q(function(resolve, reject) {			
			factory.post('votesession', voteSession).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.put = (voteSession)=>{		
		return $q(function(resolve, reject) {			
			factory.put('votesession', voteSession).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});