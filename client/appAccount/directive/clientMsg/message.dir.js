//encabezado de vistas, adicion de mensaje personalizado
var mensajeCliente = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/clientMsg/clientMessage.html',
		replace: true,
		transclude: true
	};
};

appDirectives.directive('mensajeClient', mensajeCliente);