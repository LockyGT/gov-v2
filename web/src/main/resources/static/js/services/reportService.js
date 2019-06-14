app.service('reportService', function($q, factory, $filter){
	
	const self = this;
	const path = "report";
	
	self.getLegislatorReport = (data) => {
		return $q(function (resolve, reject){
			factory.get(path+'/legislator', data).then(data=>{
				resolve(data);
			}, error=>{
				reject(error);
			});
		});
	};
	
	self.getResultInitiative = (data) => {
		return $q(function (resolve, reject){
			factory.get(path+'/results-initiatives', data).then(data=>{
				resolve(data);
			}, error=>{
				reject(error);
			});
		});
	};
	
	self.getInitiative = (data) => {
		return $q(function (resolve, reject){
			factory.get(path+'/initiatives', data).then(data=>{
				resolve(data);
			}, error=>{
				reject(error);
			});
		});
	};
	
	self.printPdf = (dataTable) => {
		const doc = new jsPDF();
		
		const totalPagesExp = "{total_pages_count_string}";
		
		doc.autoTable({
			head: dataTable.headRows,
			body: dataTable.bodyRows,
			foot: dataTable.footRows,
			startY: 25,
			tableLineColor: [231,76,60],
			tableLineWidth:0,
			styles: {
				fontSize: 8
			},
			headStyles:{},
			footStyles: {},
			bodyStyles: {},
			alternateRowsStyles: {},
			columnStyles:{},
			allSectionHooks: true,
			didDrawPage: function(data){
				doc.setFontSize(20);
				doc.setTextColor(40),
				doc.setFontStyle('normal');
				doc.text(dataTable.title, data.settings.margin.left, 22);
				
				let str ="Pag. "+ doc.internal.getNumberOfPages();
				
				if(typeof doc.putTotalPages === 'function'){
					str = str + " de " + totalPagesExp;
				}
				doc.setFontSize(10);
				
				let pageSize = doc.internal.pageSize;
				let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
				doc.text(str, data.settings.margin.left, pageHeight - 10);
			},
			margin:{top:30}
		});
		if (typeof doc.putTotalPages(totalPagesExp) === 'function'){
			doc.putTotalPages(totalPagesExp);
		}
		
		return $q(function (resolve, reject){
			if(doc){
				resolve(doc);
			}else {
				reject(doc);
			}
		});
	};
});


