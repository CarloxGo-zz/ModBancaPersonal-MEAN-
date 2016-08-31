(function(){
	var maestrosFactory = function($http){
		var	urlREST = "/api/pub/maestros",
				maestros = {};
				factoryAPI = {};
		
		factoryAPI.getMaestros = function(){
			return $http.get(urlREST);
		};

		return factoryAPI;
	};
	app.factory('maestrosFactory', ['$http', maestrosFactory]);
}());