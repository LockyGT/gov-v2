app.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			let model = $parse(attrs.fileModel);
			let modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

app.directive("recordsModel", [ '$parse',function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			let model = $parse(attrs.recordsModel);
			let modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files);
				});
			});
		}
	};
}]);

app.directive("formatDate", function() {
	return {
		require : 'ngModel',
		link : function(scope, elem, attr, modelCtrl) {
			modelCtrl.$formatters.push(function(modelValue) {
				return new Date(modelValue+'T00:00:00.000-0500');
			})
		}
	}
});