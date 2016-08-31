var categMovimentos = function($element, $scope, maestrosFactory){
	var scope = this;
	maestrosFactory.getMaestros().success(function (data){
		scope.maestros = data;
		var actualDir =	( !$scope.$parent.filtroMovCtr) ?
								'accountsCtrl.nuevoMovimiento.tipo': 'filtroMovCtr.valorBuscado';
		$($element).closest('#groupBtnCteg').find(".changeCateg").on('click', function (ev_click){
			$scope.$apply(function(){
				scope.modelCateg = '';
			});
		});
		$scope.$parent.$watch(actualDir, function (newValue, oldValue){
			if(scope.modelCateg && oldValue){
				scope.modelCateg = '';
			}
		});
		$scope.$watch('this.categMov.modelCateg', function (newValue, oldValue){
				if(newValue){
					$scope.modelCateg = newValue;
				}
		});
	});
};

appDirectives.directive('categoriaMovimientosIngresos', function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/categMov/ingresos/categoriaMovIngresos.html',
		// replace: true,
		scope: {modelCateg: "="},
		controller: categMovimentos,
		controllerAs: 'categMov'
	};
});

appDirectives.directive('categoriaMovimientosGastos', function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/categMov/gastos/categoriaMovGastos.html',
		// replace: true,
		scope: {modelCateg: "="},
		controller: categMovimentos,
		controllerAs: 'categMov'
	};
});