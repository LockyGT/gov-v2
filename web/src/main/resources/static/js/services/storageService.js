app.service('storageService', function($q, factory) {
	var self = this;	
	var path = "files";
	self.getB64 = (file)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/stringb64', file).then(function mySuccess(data) {			
				
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.download = (file)=>{		
		return $q(function(resolve, reject) {			
			factory.get(path+'/download', file).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.save = (file)=>{		
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			fd.append('file',file.file)
			fd.append('name',file.name);
			fd.append('folder',file.folder);
			factory.postFile(path+'/save', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
});