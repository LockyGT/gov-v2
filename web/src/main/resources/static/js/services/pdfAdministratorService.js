app.service('pdfAdministratorService', function($q, factory) {
	const self = this;
	const path = "report";
	self.getPdf = (idPersona) => {
		return $q(function(resolve, reject) {
			factory.getFile(path+"/report/legislator", idPersona).then(data => {
				resolve(data);
			}, error => {
				reject(error);
			});
		});
	}
});