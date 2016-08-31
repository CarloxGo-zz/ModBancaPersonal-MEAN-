var httpRoutesAccess = function ($routeProvider){
	$routeProvider
		.when('/login', {
			controller: 'accessController',
			controllerAs: 'accessCtrl',
			templateUrl: '../access/js/accessAccount/login.tpl.php'
		})
		.when('/register', {
			controller: 'accessController',
			controllerAs: 'accessCtrl',
			templateUrl: '../access/js/accessAccount/register.tpl.php'
		})
		.when('/permisos', {
			controller: 'permisosController',
			controllerAs: 'permisosCtrl',
			templateUrl: '../access/js/accessAccount/permisos.tpl.php'
		})
		.otherwise({
			redirectTo: '/login'
		});
};


var app = window.angular.module( 'accessHouseAccountApp', ['ngRoute'] );

// routeProvider: directiva que nos permite mapear vistas con sus controladores
app.config( ['$routeProvider', httpRoutesAccess] );

// var appAccessDirectives = window.angular.module('access-directives', []);