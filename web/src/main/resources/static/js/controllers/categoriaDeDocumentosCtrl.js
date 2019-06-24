
app.controller('categoriaDeDocumentosCtrl', function($scope,partnerService,$window,categoriaDeDocumentosService){

	$scope.tiposDePartner = [
		{	"name":"Legislador",
			"tipo":1
		},	
		{	"name":"Operador",
			"tipo":2
		}
	];
	$scope.requeridos = [
		{	"name":"No",
			"tipo":false
		},	
		{	"name":"Si",
			"tipo":true
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
	$scope.categoriaDeDocumentos ={id:null,documentos:[]};
	
	
	$scope.getCategoriaDeDocumentosByTipoPartner = (tipoDePartner) =>{
		$scope.categoriaDeDocumentos ={id:null,documentos:[],tipoPartner:tipoDePartner};
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
		$scope.create_UUID
		categoriaDeDocumentosService.post($scope.categoriaDeDocumentos).then(function mySuccess(data) {			
			$scope.categoriaDeDocumentos = data;
			swal('Exito','Se ha guardad correctamente','success')
		}, function myError(response) {
			console.log(response);
		});
		
	};	
	
	$scope.addDocumento = () =>{
		$scope.documentoAux.uuid = '';
		$scope.documentoAux.uuid = $scope.createUUID();
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
		
		//setTimeout(function(){ angular.element('.requeridoDocumento').val( $scope.documentoAux.requerido? 'true':'false'); }, 100);

		$scope.documentoIndex = index;
	};
	$scope.cancelar = () =>{
	    $scope.categoriaDeDocumentos.documentos[$scope.documentoIndex] = $scope.documentoCopy;
	    $scope.documentoCopy = {};
		$scope.documentoAux  = {};
		$scope.documentoIndex = -1;
	};
	$scope.doCancelar = () =>{
		$scope.documentoCopy = {};
		$scope.documentoAux  = {};
		$scope.documentoIndex = -1;
		$scope.getCategoriaDeDocumentosByTipoPartner("");
	};
	$scope.doEditar = () =>{
	   $scope.addEditDocu = {};
	   angular.copy($scope.documentoAux,  $scope.addEditDocu);
	   $scope.categoriaDeDocumentos.documentos[$scope.documentoIndex] = $scope.addEditDocu;
	   $scope.documentoCopy = {};
	   $scope.documentoAux  = {};
	   $scope.documentoIndex = -1;
	};
	
	
	$scope.createUUID = () =>{
	    var dt = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (dt + Math.random()*16)%16 | 0;
	        dt = Math.floor(dt/16);
	        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}


	const initController = () => {
   	 	
		
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});