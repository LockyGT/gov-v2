app.service('folderAdministratorService', function($q, factory){
	const self = this;
	
	const path = 'folder-administrator';
	
	self.get = (status) => {
		let sendData = { "status": status };
		return $q((resolve, reject) => {
			factory.get(path, sendData).then(success => {
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	};
	
	self.getById = (data) => {
		return $q((resolve, reject) => {
			factory.get(path+'/id', data).then(success => {
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	};
	
	self.post = (folderAdministrator) => {
		return $q((resolve, reject) => {
			factory.post(path,folderAdministrator).then(success => {
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	};
	
	self.put = (folderAdministrator) => {
		return $q((resolve, reject) => {
			factory.put(path, folderAdministrator).then(success => {
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	};
	
	self.del = (folderAdministrator) => {
		return $q((resolve, reject) => {
			factory.delet(path,folderAdministrator).then(success => {
				resolve(success);
			}, error => {
				reject(error);
			});
		});
	};
	
});