(function(w, ng, appAng){
	var accessCtrl = function ($scope, $http, $rootScope, $location){
		$scope.urlBase = "http://localhost:80/houseAccount/access/server/loginRegisterAccess.php";
		$scope.usuario = {userName: '', userMail: '', userPass: '', access: ''};
		$scope.errorServer = "";
		
		$rootScope.permisos = [];
		$rootScope.mensaje = "";

		this.checkAcces = function(accessType){
			$scope.usuario.access = accessType;

			if( accessType === "login" ){
				$rootScope.mensaje = 'bienvenido de nuevo ';
			} else if( accessType === "register" ){
				$rootScope.mensaje = 'ahora eres usuario de la plataforma con una cuenta personal nombre de ';
			}

			$http({
				url: $scope.urlBase,
				params :  $scope.usuario,
				method : 'POST',
				headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(data){	
					if( !data.error ){
						$scope.errorServer = "";
						$rootScope.permisos = data;
						$rootScope.mensaje += data.userCompleteName;
						$location.path('/permisos');
					}else{
						$scope.errorServer = data.error;
					}
				});
		};

	};

appAng.controller( 'accessController', ['$scope', '$http', '$rootScope', '$location', accessCtrl] );

appAng.directive('postAccess', function(){
	// Runs during compile
	return {
		priority: 1,
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function(scope, iElm, iAttrs, controller) {
			var CONTROLS = {
				name: iElm[0].userName,
				email: iElm[0].userMail,
				arrPass: document.getElementsByClassName("userPass")
			};
			
			iElm[0].addEventListener('submit', function(event){
				// anulamos el submit, la validacion nativa
				event.preventDefault();
				
				scope.errorServer = "";
				scope.$apply(); //avisamos al digest que hay un cambio de de scopes

				// vaciamos el contenido de alertas de errores de validacion
				var forEach = Array.prototype.forEach;
				forEach.call(document.getElementsByClassName("error"), function(nodoError){
					nodoError.classList.add("oculto");
				});

				if(	iAttrs.access === 'register' &&
						!validar(CONTROLS.name, CONTROLS.email, CONTROLS.arrPass[0], CONTROLS.arrPass[1]) ){
					return false;
				} else if(	iAttrs.access === 'login' &&
								!validarLogin(CONTROLS.email, CONTROLS.arrPass[0]) ) {
					return false;
				}
					scope.accessCtrl.checkAcces(iAttrs.access);

			}, false);
		}
	};
});

}(window, window.angular, app));
