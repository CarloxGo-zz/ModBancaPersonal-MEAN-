var tablaMovController = function (){
	this.filteredMov = [];
	this.sentido = true;
	this.campo = 'id';
	
	this.checkCampoSentido = function (isCampo){
			this.sentido = (this.campo === isCampo) ? !this.sentido : this.sentido;
			this.campo = isCampo;
	};

	this.getTotal = function(){
		if( !!this.filteredMov ){
			var total = 0, product, importe;
			for(var i = 0, len = this.filteredMov.length; i < len; i++){
				product = this.filteredMov[i];
				importe = product.importe;
				importe = (!product.esGasto) ? importe : importe*=-1 ;
				total += importe;
			}
			return total;
		}
	};
};

var tablaMov = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/tableMov/tableMovimientos.html',
		controller: tablaMovController,
		controllerAs: 'tablaMovCtr'
	};
};

appDirectives.directive('tablaMovimientos', tablaMov);

appDirectives.directive('redirectSelectMov', function () {
    return {
        restrict: 'A',
        priority: 1,
        link: function($scope, elm, attr) {
			elm.bind('click', function(){
				// calling the $location.path outside of the angularjs digest.
				var hrefMovRedirect = 'http://localhost:3000/appAccount/#/movimiento/'+$scope.movimiento.id;
				$scope.$apply(function() {
					window.location.href = hrefMovRedirect;
				});
			});
		}
    };
});

// FIJAR BOTTOM FOOTER
appDirectives.directive('footerFixed', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// invoke thfloat() twice; once for "head" and once for "foot"; both attach to window
			window.setTimeout(function(){
				window.scrollTo(3,3);
				$('#'+attrs.tableFixed)
					.thfloat('init')
					.thfloat('init', {
						side : "foot"
					});
			}, 100);
		}
	};
});