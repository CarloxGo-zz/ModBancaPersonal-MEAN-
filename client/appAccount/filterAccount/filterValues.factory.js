(function(w, ng, ngApp){
	var movimientosFiltrados = function($http){
		
		var	fechaActual = new Date().toJSON().split('T')[0],
				factoryAPI = {
					valorBuscado : '',
					valorCorte : true,
					checkData : false,
					start_date : '',
					end_date : fechaActual,
					checkToday : false,
					checkActualMonth : false,
					checkActualYear : false,
					checkActualWeek : false
				};

		factoryAPI.resetValues = function (){
			this.valorBuscado = ''; // filtro personalizado
			this.valorCorte = true;	// filtro por valor (search)
		};

		factoryAPI.resetSearch = function (){
			this.valorBuscado = '';
		};

		factoryAPI.resetDate = function (){
			this.checkData = false; // Switch de todos los filtro-fechas
			// rango de fechas filtradas
			this.start_date = '';
			this.end_date = fechaActual;
			// Switch de filtro-fechas especificos
			this.checkToday = false;
			this.checkActualMonth = false;
			this.checkActualYear = false;
			this.checkActualWeek = false;
		};

		factoryAPI.isFiltered = function (){
			return Object.prototype.toString.call(this.valorCorte) === '[object Number]' ||
					!plugin.isEmpty(this.valorBuscado) ||
					!!this.checkData;
		};

		return factoryAPI;
	};
	ngApp.factory("movimientosFiltrados", ['$http', movimientosFiltrados]);
}(window, window.angular, app));