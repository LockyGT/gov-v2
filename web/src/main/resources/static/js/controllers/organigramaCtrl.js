/**
 * Demo para hacer pruebas con las versiones de los archivos
 */
app.controller('organigramaCtrl', function($scope,_PARTNER,partnerService,$window,organigramaService){

    $scope._PARTNER = _PARTNER;
	$scope.chart;
	$scope.legislador;
    $scope.data;
    $scope.dataToDisplay = [];
 	$scope.legislators = [];

 	$scope.organigramas = [];
 	 $scope.organigrama = {};
 	$scope.action = 0;//0-view,1=add,2=update
 	
 	$scope.doAction = function(action){
 		$scope.action =action;
 	}
 	
 	$scope.isAction = function(action){
 		return $scope.action === action;
 	}
 	
 	$scope.chartSize = 'medium'
	$scope.getPartners = () =>{
		partnerService.getByStatus(_PARTNER._STATUS._ACTIVE).then(function mySuccess(data) {			
			$scope.legislators = data;	
		}, function myError(response) {
			console.log(response);
		});
		organigramaService.get().then(function mySuccess(data) {			
			$scope.organigramas = data ;	
		}, function myError(response) {
			console.log(response);
		});
	};
     

	$scope.deleteFromChart = function (){ 
		if($scope.chart.getSelection().length !== 0){
			$scope.toDelete = [];
			$scope.indexes = [];
			$scope.index =  $scope.chart.getSelection()[0].row;
			$scope.toDelete.push($scope.index);

			$scope.hasDeletedOne = true;
			while ($scope.hasDeletedOne) {
				if($scope.indexes.length === 0){
					$scope.indexes = $scope.getChilds($scope.index);
					if($scope.indexes.length === 0){
						$scope.hasDeletedOne = false;
					}
					//$scope.toDelete = $scope.indexes;
				}else{
					$scope.hasDeletedOne = false;
					$scope.indexesAux = [];
					angular.copy($scope.indexes ,  $scope.indexesAux);
					$scope.indexes = [];
					angular.forEach($scope.indexesAux , function(value, key) {
						$scope.toDelete.push(value);
						$scope.children = [];
						$scope.children = $scope.getChilds(value);
						if($scope.children.length !== 0){
							$scope.hasDeletedOne = true;
							if($scope.indexes.length === 0){
								$scope.indexes = $scope.children;
							}else{
								$scope.indexes.concat($scope.children);
							}
						}
					});
				}
			}
			$scope.toDeleteIds = [];
			angular.forEach($scope.toDelete, function(value, key) {
				$scope.toDeleteIds.push($scope.dataToDisplay[value][0].v);
			});

			angular.forEach($scope.toDeleteIds, function(value, key) {
				angular.forEach($scope.dataToDisplay, function(value1, key1) {
					if( value1[0].v === value){
						$scope.dataToDisplay.splice(key1,1);
					}
		    	});
			});

//			$scope.hasDeletedOne =true;
//			while ($scope.hasDeletedOne) {
//				$scope.hasDeletedOne = false;
//				angular.forEach($scope.dataToDisplay, function(value, key) {
//					if( value[0].v === $scope.selectedId || value[1] === $scope.selectedId){
//						$scope.dataToDisplay.splice(key,1);
//						$scope.hasDeletedOne = true;
//					}
//		    	});
//			}
		$scope.popullateChart();
		}else{
			alert('seleccione que usuario eliminar');
		}
	}
	
	$scope.getChilds = function(index){
		return $scope.chart.getChildrenIndexes(index);
	}
	
    $scope.addToChart = function (legislador){ 
    	angular.element('.toShow').hide();
    	console.log(legislador);
	     if($scope.dataToDisplay.length === 0){
	    	 $scope.nodeToAdd =[
	    		 [{v: legislador.id, f:legislador.name +' '+legislador.apPaterno+ ' ' + legislador.apMaterno}, '' , '']
	    		]; 
	    	 $scope.dataToDisplay = $scope.nodeToAdd;
	    	 $scope.popullateChart();
	     }else if($scope.dataToDisplay.length !== 0 && $scope.chart.getSelection().length !== 0){
	    	 if(!$scope.validateIfExists(legislador.id)){
		    	 $scope.parent = $scope.dataToDisplay[$scope.chart.getSelection()[0].row][0].v;
		    	 $scope.dataToDisplay.push([{v: legislador.id, f:legislador.name +' '+legislador.apPaterno+ ' ' + legislador.apMaterno}, $scope.parent , '']);
		    	 $scope.popullateChart();
	    	 }else{
	    		 alert('El usuario ya existe en el organigrama');
	    	 }
	     }else{
	    	 alert('Seleccione a quien se le agregará');
	     }
     }
     
   
     $scope.validateIfExists = function (id) {
    	$scope.status =false;
    	angular.forEach($scope.dataToDisplay, function(value, key) {
			if( value[0].v === id){
				$scope.status = true;
			}
    	});
    	return $scope.status;
     }
     
     $scope.popullateChart = function () {
       $scope.data = new google.visualization.DataTable();
       $scope.chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
       $scope.chart2 = new google.visualization.OrgChart(document.getElementById('chart_div2'));
       $scope.data.addColumn('string', 'Name');
       $scope.data.addColumn('string', 'Manager');
       $scope.data.addColumn('string', 'ToolTip');
       $scope.data.addRows( $scope.dataToDisplay);
       $scope.chart.draw($scope.data, {allowHtml:true,allowCollapse:true, size:	$scope.chartSize});
       $scope.chart2.draw($scope.data, {allowHtml:true,allowCollapse:true, size:	$scope.chartSize});
     }
     $scope.changeSize = function (size) {
    		$scope.chartSize = size;
    		$scope.popullateChart();
     }
     $scope.toPdf = function () {
    	 angular.element('.toHide').hide();
    	 angular.element('.toShow').show();
    	 $window.print();
    	 angular.element('.toHide').show();
    	 angular.element('.toShow').hide();
     }
     
     $scope.ver = function(organigrama){
    	 $scope.dataToDisplay = angular.fromJson(organigrama.jsonObjeto);
    	 $scope.organigrama = organigrama;
    	 $scope.doAction(2);
    	 setTimeout(function(){ $scope.popullateChart(); angular.element('.toShow').hide(); }, 1000); 
     }
     
     $scope.addNew = function(){
    	 $scope.organigrama = {};
    	 $scope.dataToDisplay = [];
    	 $scope.doAction(1);
     }
     $scope.save = function(){
    	 $scope.organigrama = {jsonObjeto:angular.toJson($scope.dataToDisplay)}
    	
    	 organigramaService.post($scope.organigrama).then(function mySuccess(data) {	
    			organigramaService.get().then(function mySuccess(data) {			
    				$scope.organigramas = data ;	
    	        	 $scope.doAction(0);
    	        	 $scope.organigrama = {};
    	        	 $scope.dataToDisplay = [];
    			}, function myError(response) {
    				console.log(response);
    			});
    		
 		}, function myError(response) {
 			console.log(response);
 		});
     }
     
     
	const initController = () => {
   	 	angular.element('.toShow').hide();
		$scope.getPartners();
		
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});