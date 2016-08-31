//encabezado de vistas, adicion de mensaje personalizado
var mensaje = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/headerMsg/headerMessage.html',
		replace: true,
		transclude: true
	};
};

appDirectives.directive('mensaje', mensaje);
