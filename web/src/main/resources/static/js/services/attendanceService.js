app.service('attendanceService', function($q, factory) {
	var self = this;	
	self.getByInitiativeIdAndPartnerId = (initiativeId, partnerId)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"initiativeId": initiativeId,
					"partnerId": partnerId,
			};
			factory.get('attendance/initiative/partner', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByVoteSessionIdAndAttendanceNumber = (voteSessionId, attendanceNumber)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"voteSessionId": voteSessionId,					
					"attendanceNumber": attendanceNumber
			};
			factory.get('attendance/voteSession/attendanceNumber', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByVoteSessionIdAndPartnerIdAndAttendanceNumber = (voteSessionId, partnerId, attendanceNumber)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"voteSessionId": voteSessionId,
					"partnerId": partnerId,
					"attendanceNumber": attendanceNumber
			};
			factory.get('attendance/voteSession/partner', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.getByDatesBetween = (date1, date2)=>{		
		return $q(function(resolve, reject) {			
			let data = { 
					'date1' : date1,
					'date2' :  date2
			};
			factory.get('attendance/betweendates', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByDatesBetweenAndSesion = (date1, date2)=>{		
		return $q(function(resolve, reject) {			
			let data = { 
					'date1' : date1,
					'date2' :  date2
			};
			factory.get('attendance/betweendatesandsesion', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getBySesionDatesBetween = (date1, date2)=>{		
		return $q(function(resolve, reject) {			
			let data = { 
					'date1' : date1,
					'date2' :  date2
			};
			factory.get('attendance/sesionbetweendates', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getAttendancesSessionsByDateTime = (date1, date2)=>{		
		return $q(function(resolve, reject) {			
			let data = { 
					'date1' : date1,
					'date2' :  date2
			};
			factory.get('attendance/sessionsbydatetime', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.getByInitiativeId = (initiativeId)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"initiativeId": initiativeId					
			};
			factory.get('attendance/initiative', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByVoteSessionId = (voteSessionId)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"voteSessionId": voteSessionId					
			};
			factory.get('attendance/voteSession', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.getByVoteSessionIsNotNullAndPartnerId = (partnerId)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"partnerId": partnerId					
			};
			factory.get('attendance/voteSession/isnotnull/partner', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull = (date1, date2, status, partnerId)=>{		
		return $q(function(resolve, reject) {			
			let data = {
					"date1": date1,
					"date2": date2,
					"status": status,
					"partnerId": partnerId					
			};
			factory.get('attendance/dates/status/byPartnerid/sessionNotNull', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.post = (attendance)=>{		
		return $q(function(resolve, reject) {			
			factory.post('attendance', attendance).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

	self.postInDay = (attendance)=>{		
		return $q(function(resolve, reject) {			
			factory.post('attendance/day', attendance).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};



});