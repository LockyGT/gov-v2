app.service('reportOdService', function($q, factory, $filter){
	const self = this;
	const path = 'orderday';
	self.get = () => {
		return $q((resolve, reject)=>{
			factory.get(path).then(function success(data){
				resolve(data);
			}, function error(errorData){
				resolve(errorData);
			});
		});
	};

	self.printPdf = () => {
		console.log('Generar pdfs')
		const doc = new jsPDF('p', 'pt', 'letter');
		doc.text(20,20,'Orden del día')
		const orderday = [];
		doc.setFontSize(12);
		//const paragraphs= [];
		
		orderday.forEach(function(item){
			doc.setFontSize(20);
			doc.text(20,20,item.nombre);
			
		});
		
		console.log('+--------------+',orderday)
		const iframe = document.createElement('iframe');
		iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;');
		document.body.appendChild(iframe);
		iframe.src = doc.output('datauristring');

		return $q(function (resolve, reject){
			if(doc){
				resolve(doc);
			}else {
				reject(doc);
			}
		});
	};
});