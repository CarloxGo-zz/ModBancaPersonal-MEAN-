(function(w, ng, ngApp){
	var movimientosFactory = function($http){
		var	factoryAPI = {},
				urlBaseMov = "/api/priv/movimientos",
				urlBaseTot = "/api/priv/total",
				urlUpdateMov = "/api/priv/updateMovimiento",
				urlDeleteMov = "/api/priv/deleteMovimiento";

		factoryAPI.getMovimientos = function () {
			return $http.get(urlBaseMov);
		};

		factoryAPI.getMovFilter = function (movId){
			//{id:movId} -> cofig rest, parametro de peticoin GET
			//console.log(movId);
			return $http.get(	'/api/priv/filter_movimiento', { params: { id: movId } });
		};

		factoryAPI.getFacturaMovimiento = function (numFactura){
			$http.get(	'/api/priv/factura_movimiento', { params: { factura: numFactura } })
				.success(function (data){
					// console.log(data);
					return data;
				});
		};

		factoryAPI.getMonthEstats = function (){
			return $http.get(	'/api/priv/month_estatistics' );
		};

		factoryAPI.getSaldoAnual = function (categAnual){
			var paramsCateg = {
				tipo: categAnual.tipo,
				anyo: categAnual.anyo
			}
			return $http.get(	'/api/priv/saldoAnual_movimiento', { params: paramsCateg });
		};

		factoryAPI.getCategAnual = function (categAnual){
			var paramsCateg = {
				tipo: categAnual.tipo,
				anyo: categAnual.anyo
			}
			return $http.get(	'/api/priv/categAnual_movimiento', { params: paramsCateg });
		};



		factoryAPI.setMovimientos = function (movimiento) {
			//los objetos que acumulamos es en el backend
			//una peticion POST es una peticion http, que suele llevar una carga de datos en el body
			return $http.post(urlBaseMov, movimiento);
		};

		factoryAPI.updateMovimientos = function (movimiento) {
			return $http.post(urlUpdateMov, movimiento);
		};

		factoryAPI.deleteMovimientos = function (movimiento) {
			return $http.post(urlDeleteMov, movimiento);
		};

		factoryAPI.getTotal = function () {
			return $http.get(urlBaseTot);
		};

		return factoryAPI;
	};
	ngApp.factory("movimientosFactory", ['$http', movimientosFactory]);
}(window, window.angular, app));