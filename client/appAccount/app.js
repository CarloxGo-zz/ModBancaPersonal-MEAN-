var httpRoutes = function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'bankAccountsController',
			controllerAs: 'accountsCtrl', //alias utilizado en las vistas
			templateUrl: 'controlAccount/totalCuentas.tpl.html'
		})
		.when('/nuevo', {
			controller: 'bankAccountsController',
			controllerAs: 'accountsCtrl',
			templateUrl: 'controlAccount/nuevaCuenta.tpl.html'
		})
		.when('/lista', {
			controller: 'bankAccountsController',
			controllerAs: 'accountsCtrl',
			templateUrl: 'controlAccount/listaCuentas.tpl.html'
		})
		.when('/registro', {
			controller: 'loginRegisterController',
			controllerAs: 'loginRegisterCtrl',
			templateUrl: 'register/registro.html'
		})
		.when('/movimiento/:movId', { //parametro dependencia $routeParams
			controller: 'filtroMovimientoController',
			controllerAs: 'filtroMovCtrl',
			templateUrl: 'singleAccount/unicoMovimiento.html'
		})
		.when('/estadistica', {
			controller: 'estadisticaController',
			controllerAs: 'estadisticaCtrl',
			templateUrl: 'estadistica/estadistica.html'
		})
		.otherwise({
			redirectTo: '/'
		});
};

var httpStatusControl = function($q, $location, $cookieStore, $rootScope){
	return {
		//CADA VEZ QUE HAY UNA PETICION DEL CLIENTE (get || put)
		request: function (request) {
			console.info('REQUEST:' + request.url);
			request.headers["sessionId"] = $cookieStore.get("sessionId");
			return request || $q.when(request);
		},
		//CADA VEZ QUE HAY UNA RESPUESTA DEL SERVIDOR
		response: function(response){
			console.log(response.status, response.statusText, 'SID->'+response.config.headers.sessionId);
			/**si la respuesta es que se ha desconectado el servidor,
			enviar un aviso de web socket para  la cookie de sesion**/
			return response || $q.when(response);
		},
		//CADA VEZ QUE EL SERVIDOR RESPONDE CON UN ERROR
		responseError: function (response) {
			var error = "ERROR STATUS: " + response.status + " FROM: " + response.config.url+ "\n";
			//DEBUGGER
			switch(response.status){
				case 0:
					console.error(error + '\nServidor desconectado.');
					break;
				case 500:
					console.error(error + '\nEl servidor ha fallado.');
					break;
				case 419:
					console.error(error + '\nSesión caducada @ 20 minutos.');
					break;
				case 400:
					console.error(error + '\nNo se ha podido acceder al recurso, revisar el codigo.');
					break;
				case 401:
					console.error(error + '\nEl usuario NO esta registrado en el servidor.');
					break;
			}

			//MENSAJES CLIENTES
			switch(response.status){
				case 0:
				case 500:
				case 419:
					$rootScope.mensaje = (response.status == 0 || response.status == 500) ?
						'Algo ha fallado, intentelo mas tarde' :
						'Sesión caducada, vuelve a loguearte';
					$cookieStore.remove('sessionId');
					$cookieStore.remove('sessionName');
					$location.path('registro');
					break;
				case 400:
					$rootScope.mensaje = "Fallo de servicio, intentelo mas tarde";
					break;
				case 401:
					$rootScope.mensaje = "Credencial Invalida";
					$rootScope.mensaje += ( !$cookieStore.get('sessionId') ) ?
						', Registrate' : ', vuelve a loguearte';
					$cookieStore.remove('sessionId');
					$cookieStore.remove('sessionName');
					$location.path('registro');
					break;
				case 409:
					$rootScope.mensaje = "Usuario Ya registrado, utiliza otro email!!!";
					break;
				case 404:
					$rootScope.mensaje = "Pagina no encontrada!!!";
					break;
			}
			/*antes de que el cliente ejecute las promises de get(), post() y recibir el error de respuesta del servidor,
			se anulara la respuesta*/
			return $q.reject(response);
		}
	};
};

//'ngRoute': proporciona la dependencia $routeProvider
var app = window.angular.module( 'accountsApp', ['ngRoute', 'ngCookies', 'input-filters', 'util-directives'] );

//DEPENDENCIAS DE APLICACION
//$routeProvider: enrutador de vistas, mapeamos la vista con siu enrutador
app.config( ['$routeProvider', httpRoutes] );

//INTERCEPTORES DE PETICIONES HTTP
app.config( ['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push( ['$q', '$location', '$cookieStore', '$rootScope', httpStatusControl] );
}]);

//FILTROS
var appFilters = window.angular.module('input-filters', []);

//DIRECTIVAS
var appDirectives = window.angular.module('util-directives', []);