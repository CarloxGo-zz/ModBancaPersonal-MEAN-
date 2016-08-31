(function(w, ng, ngApp, plugin){
	var filtroMovCtrl = function($scope, $location, $routeParams, movimientosFactory, maestrosFactory){
		window.scrollTo(0,0); //reset plugin fixed table footer
		var scope = this;
		//1 - cargo en la vista la URL con el parametro :movId
		//2 - recuperar parametros de URL a travesde la dependencia $routeParams del controlador
		//3 - recupero los datos de un movimiento especifico y los asigno al modelo de este controlador , paar por¡der usar lo en su vista 
		this.movId = $routeParams.movId;
		this.editMovCtr = false;
		this.filtroMov = {};
		this.copyFiltroMov = {};
		this.msg = "";
		this.categoria = [];
		this.tipoCategoria = '';

		this.isEditMovCtr = function (){
			// mostrar formulario de actualizaciones
			this.editMovCtr = (!!this.editMovCtr) ? false : true;
			
			//parsearla fecha para render
			if( !plugin.isEmpty(this.filtroMov.fecha) )
				this.filtroMov.fecha = this.filtroMov.fecha.split('T')[0];

			// seleccionarlos maestros del movimeiento
			maestrosFactory.getMaestros().success(function (data){
				if( plugin.isEmpty(scope.filtroMov.categoria) ){
					// recrremos todas las categorias del mismo tipo
					scope.categoria	= (scope.filtroMov.tipo === 'ingreso') ?
												data.categoriasIngresosPersonal : 
												data.categoriasGastosHogar.concat(data.categoriasGastosTransporte).concat(data.categoriasGastosSanitario).concat(data.categoriasGastosDiarios).concat(data.categoriasGastosEntretenimiento).concat(data.categoriasGastosAhorro);
				}else{
					//recorremos laas categorias de un tipo buscando si hay coincidencia - salir del bucle a la primera coincidencia
					for (var key in data) {
					   var obj = data[key];
					   for (var prop in obj) {
					      // not from prototype prop inherited
					      if(obj.hasOwnProperty(prop) && obj[prop] === scope.filtroMov.categoria){
					        scope.categoria = obj;
					        scope.tipoCategoria = key.replace('categorias', '');
					        return true;
					      }
					   }
					}
				}
			});

			this.copyFiltroMov = ng.copy(this.filtroMov);
		};

		this.updateMovCtr = function (){
			var confirm = window.confirm(	"¿ Quieres Actualizar cambios ?"+
											"\nMovimiento: "+this.filtroMov.factura+".");
			if( confirm ){
				movimientosFactory.updateMovimientos(this.filtroMov)
									.success(function(data, status, headers, config) {
										//avisar de movimiento actualizado
										console.log('Movimiento Actualizado: #'+data.id);
										$('.msgClientUpdateMov').fadeIn();
										scope.editMovCtr = false;
										window.setTimeout(function (){
											$('.msgClientUpdateMov').fadeOut();
											$scope.$apply(function(){
												$location.path('/lista');
											});
										}, 2000);
									});
			}
		};

		this.deleteMovCtr = function (){
			var confirm = window.confirm(	"¿ Quieres Eliminar el Movimiento: "+this.filtroMov.factura+" ?");
			if( confirm ){
				movimientosFactory.deleteMovimientos(this.filtroMov)
									.success(function(data, status, headers, config) {
										//avisar de movimiento actualizado
										console.log('Movimiento Eliminado: #'+data.id);
										$('.msgClientDeleteMov').fadeIn();
										scope.editMovCtr = false;
										window.setTimeout(function (){
											$('.msgClientDeleteMov').fadeOut();
											$scope.$apply(function(){
												$location.path('/lista');
											});
										}, 2000);
									});
			}
		};

		this.resetMovCtr = function (){
			var copy = ng.copy(this.copyFiltroMov);
			this.filtroMov = copy;
		};

		this.isSetFiltro = function(){
			return this.msg === ""; 
		};

		//servicio de consulta REST
		movimientosFactory.getMovFilter(this.movId)
								.success(function (data){
									scope.filtroMov = data;								
									scope.msg = (!data) ? "no existe este movimiento" : "" ;
								});
	};

	ngApp.controller(	'filtroMovimientoController',
							['$scope', '$location', '$routeParams', 'movimientosFactory', 'maestrosFactory', filtroMovCtrl]);
}(window, window.angular, app, plugin));