app.service('partnerHasVoteService', function($q, factory) {
	var self = this;
	var path = 'partnerhasvote';
	
	self.get = ()=> {
		return $q(function(resolve, reject) {
			factory.get(path).then(function mySuccess(data) {
				if(data){				
					resolve(data);
				}else{
					resolve(null);
				}
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
			factory.get(path+"/voteSession", data).then(function mySuccess(data) {
				if(data){					
					resolve(data);
				}else{
					resolve(null);
				}
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});