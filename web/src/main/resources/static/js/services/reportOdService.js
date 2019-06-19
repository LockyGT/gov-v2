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
		const source = window.document.getElementsByTagName("body")[0];
		
		doc.setFontSize(12);
		doc.setLineWidth(2); 


		const orderday = [];




		orderday.forEach(function(p){
			doc.text(10,10,p.contenidoP)

//			elements.forEach(function(elm){
//			doc.text(10,10,elm.nombre)
//			})

		});



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