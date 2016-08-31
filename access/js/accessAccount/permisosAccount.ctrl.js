(function(w, ng, appAng){

	var permisosCtrl = function ($scope, $location, $rootScope){
		$scope.miVariable = "variable del controlador";
		//cada vez que cargo la vista de permisos, cargo $rootScope.permisos con sus controladores
		$scope.permisosUsuario = $rootScope.permisos;

		//si alguien se equivoca de direccion url, redireccionamos al loguin
		if( window.isEmpty($scope.permisosUsuario) )
			$location.path('/login');
	};
	appAng.controller( 'permisosController', ['$scope', '$location', '$rootScope', permisosCtrl] );

}(window, window.angular, app));