app.service('voteService', function($q, factory) {
	var self = this;
	self.fetchByInitiativeAndLegislator = (initiativeId, partnerId)=>{		
		return $q(function(resolve, reject) {			
			factory.get("vote/initiative/"+initiativeId+"/partner/"+partnerId).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};	
	
	self.getByInitiativeId = (initiativeId)=>{
		let data = {
				"initiativeId": initiativeId
		};
		return $q(function(resolve, reject) {			
			factory.get('vote/initiative', data).then(function mySuccess(data) {	
				console.log(data);
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.post = (vote)=>{		
		return $q(function(resolve, reject) {			
			factory.post('vote', vote).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};

});