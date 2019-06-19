
app.controller('categoriaDeDocumentosCtrl', function($scope,partnerService,$window,categoriaDeDocumentosService){

	$scope.tiposDePartner = [
		{	"name":"Legislador",
			"tipo":1
		},	
		{	"name":"Operador",
			"tipo":2
		}
	];
	$scope.tiposDeArchivos = [
		{	"name":"PDF",
			"tipo":"1"
		},	
		{	"name":"Imagen",
			"tipo":"2"
		}
	];
	$scope.tipoDePartner ={};
	$scope.documentoAux ={};
	$scope.documentoCopy ={};

	$scope.documentoIndex =-1;
	$scope.categoriaDeDocumentos ={documentos:[]};
	
	
	$scope.getCategoriaDeDocumentosByTipoPartner = (tipoDePartner) =>{
		$scope.categoriaDeDocumentos ={documentos:[],tipoPartner:tipoDePartner};
		categoriaDeDocumentosService.get(tipoDePartner).then(function mySuccess(data) {			
			$scope.tipoDePartner ={};
			$scope.documentoAux ={};
			$scope.documentoCopy ={};
			$scope.documentoIndex =-1;
			$scope.categoriaDeDocumentos = data;
			
		}, function myError(response) {
			console.log(response);
		});
		
	};
	
	$scope.save = () =>{
		//$scope.categoriaDeDocumentos.tipoPartner =	$scope.tipoDePartner.tipo;
		categoriaDeDocumentosService.post($scope.categoriaDeDocumentos).then(function mySuccess(data) {			
			$scope.categoriaDeDocumentos = data;	
		}, function myError(response) {
			console.log(response);
		});
		
	};	
	
	$scope.addDocumento = () =>{
		$scope.categoriaDeDocumentos.documentos.push($scope.documentoAux);
		$scope.documentoAux ={};
	};
	$scope.eliminarDocumento = (index) =>{
		console.log(index );
		$scope.categoriaDeDocumentos.documentos.splice(index,1);	
	};
	$scope.editar = (documento,index) =>{
		angular.copy(documento,  $scope.documentoCopy);
		$scope.documentoAux  = documento;
		console.log($scope.documentoAux );
		$scope.documentoIndex = index;
	};
	$scope.cancelar = () =>{
	    $scope.categoriaDeDocumentos.documentos[$scope.documentoIndex] = $scope.documentoCopy;
	    $scope.documentoCopy = {};
		$scope.documentoAux  = {};
		$scope.documentoIndex = -1;
	};
	$scope.doEditar = () =>{
	   $scope.addEditDocu = {};
	   angular.copy($scope.documentoAux,  $scope.addEditDocu);
	   $scope.categoriaDeDocumentos.documentos[$scope.documentoIndex] = $scope.addEditDocu;
	   $scope.documentoCopy = {};
	   $scope.documentoAux  = {};
	   $scope.documentoIndex = -1;
	};
	const initController = () => {
   	 	
		
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});