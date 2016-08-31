//encabezado de vistas, adicion de mensaje personalizado
var outputImpresion = function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/printOut/printOutput.html',
		controller: function (){
			this.fechaDeImpresion = new Date();
			this.tipoBalance = "";

			this.totalPrintMov = function(lengthMov, totalMov){
				if ( totalMov == 0 )
					return "Balance nulo de Movimientos";

				this.tipoBalance = ( totalMov > 0 ) ? "Positivo" : "Negativo";
				return	lengthMov +" Documentos, Balance "+this.tipoBalance+
							" de movimientos : "+Math.abs(totalMov)+" Euros";
			};

			this.IsValorBuscadoType = function(valorBuscado){
				return (valorBuscado == 'ingreso' || valorBuscado == 'gasto') ? true : false;
			};

			this.categMov = function (valorBuscado, filtroCategoria){
				if( valorBuscado == 'ingreso' || valorBuscado == 'gasto'  ){
					return valorBuscado.charAt(0).toUpperCase() + valorBuscado.substring(1)+'s';
				}else{
					//si el valor buscado esta en el array de filtros categoria
					if( !plugin.isEmpty(filtroCategoria) ){
						if(filtroCategoria["categoriasIngresosPersonal"].indexOf(valorBuscado) != -1){
							return 'Ingresos';
						}else if(filtroCategoria["categoriasGastosSanitario"].indexOf(valorBuscado) != -1 ||
									filtroCategoria["categoriasGastosHogar"].indexOf(valorBuscado) != -1 ||
									filtroCategoria["categoriasGastosTransporte"].indexOf(valorBuscado) != -1 ||
									filtroCategoria["categoriasGastosDiarios"].indexOf(valorBuscado) != -1 ||
									filtroCategoria["categoriasGastosEntretenimiento"].indexOf(valorBuscado) != -1 ||
									filtroCategoria["categoriasGastosAhorro"].indexOf(valorBuscado) != -1 ){
							return 'Gastos';
						}else{
							return "Ingresos y Gastos";
						}
					}
				}

			};

			this.fechasFiltradas = function (startDate, endDate){
				var output = ''; 
				if( !plugin.isEmpty(startDate) && !plugin.isEmpty(endDate) ){
					output = "Desde "+startDate+" ---> Hasta "+endDate;
				} else if( plugin.isEmpty(startDate) ) {
					output = "Movimientos hasta "+endDate;
				} else if( plugin.isEmpty(endDate) ) {
					output = "Movimientos a partir de "+startDate;
				}
				return output;
			};

			this.valoresFiltrados = function (valorCorte){
				var output = '';
				if( Object.prototype.toString.call(valorCorte) === '[object Boolean]' ){
					return output = (!!valorCorte) ? "Cualquier Cuantía." : "Cantidades Nulas.";
				} else if( Object.prototype.toString.call(valorCorte) === '[object Number]' ){
					return output = ( valorCorte > 0 )	?	"Cantidades superiores a "+Math.abs(valorCorte)+" Euros." :
													"Cantidades inferiores a "+Math.abs(valorCorte)+" Euros.";
				}
			};
		},
		
		controllerAs: 'outPrintCtrl'
	};
};

appDirectives.directive('outputImpresion', outputImpresion);