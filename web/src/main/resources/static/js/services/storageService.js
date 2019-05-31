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
			factory.getFile(path+'/download', file).then(function mySuccess(data) {	
				
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	self.downloadZip = (file)=>{		
		return $q(function(resolve, reject) {			
			factory.getFile(path+'/download/zip', file).then(function mySuccess(data) {	
				
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
			fd.append('folder',file.folder);
			factory.postFile(path+'/save', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.saveFiles = (file)=>{		
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			angular.forEach(file.files, function(file){
				fd.append('files',file);
			});
			fd.append('folder',file.folder);
			fd.append('userId', file.userId);
			factory.postFile(path+'/saveFiles', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.update = file => {
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			fd.append('file',file.file);
			fd.append('folder',file.folder);
			fd.append('oldFolder', file.oldFolder);
			fd.append('oldFileName', file.oldFileName);
			factory.postFile(path+'/update', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.newVersion = file => {
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			angular.forEach(file.files, function(file){
				fd.append('files',file);
			});
			fd.append('filesServerName', file.filesServerName);
			fd.append('folder', file.folder);
			fd.append('oldFolder', file.oldFolder);
			fd.append('userId', file.userId);

			factory.postFile(path+'/new-version', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.updateFiles = file => {
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			angular.forEach(file.files, function(file){
				fd.append('files',file);
			});
			fd.append('oldServerNames',file.oldServerNames);
			fd.append('oldOriginalNames', file.oldOriginalNames);
			fd.append('folder', file.folder);
			fd.append('userId', file.userId);
			factory.postFile(path+'/update-files', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.updateFiles = file => {
		return $q(function(resolve, reject) {	
			let fd = new FormData();
			angular.forEach(file.files, function(file){
				fd.append('files',file);
			});
			fd.append('oldServerNames',file.oldServerNames);
			fd.append('oldOriginalNames', file.oldOriginalNames);
			fd.append('folder', file.folder);
			fd.append('userId', file.userId);
			factory.postFile(path+'/update-files', fd).then(function mySuccess(data) {		
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.delFile = (data)=>{
		return $q(function(resolve, reject) {			
			factory.delet(path+'/delete', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
	
	self.delFolder = (data)=>{
		return $q(function(resolve, reject) {			
			factory.delet(path+'/delete-folder', data).then(function mySuccess(data) {						
				resolve(data);
			}, function myError(errResponse) {
				reject(errResponse);
			});			
		});
	};
});