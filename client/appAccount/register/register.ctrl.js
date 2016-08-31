(function(w, ng, angApp, plugin){
	var registerCtrl = function($scope, $rootScope, $location, $http, $cookieStore){
		window.scrollTo(0,0); //reset plugin fixed table footer
		$scope.urlBase = "http://localhost:3000/api/";
		$scope.accessUserForm = {};
		$scope.usuario = {email: '', password: ''};
		
		this.validAccessUserForm = false;
		
		this.checkAcces = function(fnAccess){
			var	accessField = $scope.accessUserForm.userField,
					email = accessField.email.$viewValue,
					password = accessField.password.$viewValue;

			//NO campos vacios y formulario valido
			if( !plugin.isEmpty(email) && !plugin.isEmpty(password) && accessField.$valid ){
				$scope.usuario = {email: email, password: password};				
				this.validAccessUserForm = false;
				this.accessApp(fnAccess);
			}else
				this.validAccessUserForm = true;
		};

		// $rootScope permite usar las propieades fijadas a el en cualquier lugar de la aplicacion
		this.accessApp = function(accessType){
			var	urlLogin = $scope.urlBase,
					rootMsg, consoleInfo;

			switch(accessType){
				case 'login':
					urlLogin += "sesiones/";
					rootMsg = 'Acceso Correcto, sesion actualizada';
					consoleInfo = 'Sesion actualizada, resetear el TimeStamp';
					break;
				case 'registro':
					urlLogin += "usuarios/";
					rootMsg = 'Es tu primera conexion al Servidor';
					consoleInfo = 'Nuevo usuario registrado';
					break;
				}

			$http.post(urlLogin, $scope.usuario)
				.success(function(data){
					$rootScope.nombre = $scope.usuario.email;
					$rootScope.mensaje = rootMsg;
					console.info(consoleInfo);
					$cookieStore.put('sessionId', data);
					$cookieStore.put('sessionName', $scope.usuario.email.split('@')[0] );
					$location.path('/');
				});
		};
	};

	angApp.controller("loginRegisterController",
							['$scope', '$rootScope', '$location', '$http', '$cookieStore', registerCtrl]);
}(window, window.angular, app, plugin));