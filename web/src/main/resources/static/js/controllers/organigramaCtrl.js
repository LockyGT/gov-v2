/**
 * Demo para hacer pruebas con las versiones de los archivos
 */
app.controller('organigramaCtrl', function($scope,_PARTNER,partnerService,$window){

    $scope._PARTNER = _PARTNER;
	$scope.chart;
	$scope.legislador;
    $scope.data;
    $scope.dataToDisplay = [];
 	$scope.legislators = [];
 	
 	$scope.chartSize = 'medium'
	$scope.getPartners = () =>{
		partnerService.getByStatus(_PARTNER._STATUS._ACTIVE).then(function mySuccess(data) {			
			$scope.legislators = data;	
		}, function myError(response) {
			console.log(response);
		});
	};
     

	$scope.deleteFromChart = function (){ 
		if($scope.chart.getSelection().length !== 0){
			$scope.selectedId = $scope.dataToDisplay[$scope.chart.getSelection()[0].row][0].v;
			$scope.hasDeletedOne =true;
			while ($scope.hasDeletedOne) {
				$scope.hasDeletedOne = false;
				angular.forEach($scope.dataToDisplay, function(value, key) {
					if( value[0].v === $scope.selectedId || value[1] === $scope.selectedId){
						$scope.dataToDisplay.splice(key,1);
						$scope.hasDeletedOne = true;
					}
		    	});
			}
			$scope.popullateChart();
		}else{
			alert('seleccione que usuario eliminar');
		}
	}
	
    $scope.addToChart = function (){  	  
	     if($scope.dataToDisplay.length === 0){
	    	 $scope.nodeToAdd =[
	    		 [{v: $scope.legislador.id, f:$scope.legislador.name +' '+$scope.legislador.apPaterno+ ' ' + $scope.legislador.apMaterno}, '' , '']
	    		]; 
	    	 $scope.dataToDisplay = $scope.nodeToAdd;
	    	 $scope.popullateChart();
	     }else if($scope.dataToDisplay.length !== 0 && $scope.chart.getSelection().length !== 0){
	    	 if(!$scope.validateIfExists($scope.legislador.id)){
		    	 $scope.parent = $scope.dataToDisplay[$scope.chart.getSelection()[0].row][0].v;
		    	 $scope.dataToDisplay.push([{v: $scope.legislador.id, f:$scope.legislador.name +' '+$scope.legislador.apPaterno+ ' ' + $scope.legislador.apMaterno}, $scope.parent , '']);
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
     
	const initController = () => {
   	 	angular.element('.toShow').hide();
		$scope.getPartners();
		
	};
	
	
	
	angular.element(document).ready(function (){
		initController();
	});
	
});