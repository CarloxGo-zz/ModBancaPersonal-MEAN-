(function(w, ng, appAng, plugin){
	/*	CONTROLADOR bankAccountsController, inicializar propiedades del modelo de aplicacion */
	var AccountingCtrl = function($scope, $rootScope, $location, $cookieStore, maestrosFactory, movimientosFactory, movimientosFiltrados){
		window.scrollTo(0,0); //reset plugin fixed table footer
		var	scope = this; //referncia al scope del controlador, para los callback de las peticiones REST
			
		this.fechaActual = new Date().toJSON().split('T')[0];
		
		//encabezados de directivas <mensaje>
		this.titulo = {
			totMovTpl: 'Controlar el Balance de tus movimientos.',
			newMovTpl: 'Introduce los datos de un nuevo movimiento.',
			listMovTpl: 'Lista de movimientos actuales.'
		};
		
		//valores por defecto del nuevo movimiento
		this.nuevoMovimiento = {
			esIngreso: 1, esGasto: 0
		};


		this.total = { ingresos: 0, gastos: 0 };

		//comprobar si hay sesion en el cliente, reconocer al cliente	
		if( !plugin.isEmpty($cookieStore.get('sessionId')) ){
			$rootScope.nombre = $cookieStore.get('sessionName');

			//NOTA: aunque haya sesion, al llamar a los movimientos o totales, el servidor se encarga de comprobar si esta dado de alta el usuario en el sistema;
			// maestrosFactory.getMaestros().success(function (data){
			// 	scope.maestros = data;
			// });

			movimientosFactory.getMovimientos().success(function (data){
				// console.log(data);
				scope.movimientos = data;
			});

			movimientosFactory.getTotal().success(function (data){
				scope.total = data;
			});
		}else{
			$rootScope.mensaje = 'primero debes Acceder a sistema';
			$location.path('registro');
		}

		var saveNewMovimiento = function (){

			var confirm = window.confirm(	"¿ Quieres Añadir un nuevo "+scope.nuevoMovimiento.tipo+" ?\n"+
													"Movimiento: "+(scope.nuevoMovimiento.factura || 's/n')+".");
			if( confirm ){
				console.log(scope.nuevoMovimiento);
				//valor por defecto de la factura
				scope.nuevoMovimiento.factura = scope.nuevoMovimiento.factura || 's/n';
				
				//bug, fijar franja horaria
				var dateMov = scope.nuevoMovimiento.fecha;
				scope.nuevoMovimiento.fecha = (dateMov === scope.fechaActual) ? new Date() : dateMov;

				//asignamos hora del nuevo movimiento
				var auxCopyMov = ng.copy(scope.nuevoMovimiento);

				/*almacenar datos en el server y recuperar nuevos movimentos y totales*/
				movimientosFactory.setMovimientos(auxCopyMov)
										.success(function (data, status, headers, config) {
						//asegurar el update de nuevo movimiento
						if(status == 200){
							movimientosFactory.getTotal().success(function (data){
								scope.total = data;
							});
							movimientosFactory.getMovimientos().success(function (data){
								scope.movimientos = data;
							});
						}
				});
										
				// resetear valores de nuevo movimiento
				scope.resetMovimiento();

				//resetear filtros almacenados en factoria
				movimientosFiltrados.resetValues();
				movimientosFiltrados.resetDate();

				//avisar de movimiento actualizado
				console.log('Movimiento Actualizado: #'+auxCopyMov.id);
				$('.msgClientNewMov').fadeIn();
				window.setTimeout(function (){
					$('.msgClientNewMov').fadeOut();
					$scope.$apply(function(){
						$location.path('/lista');
					});
				}, 2000);
			}
		};

		var checkNewMovFactura = function (){
			movimientosFactory.getFacturaMovimiento(scope.nuevoMovimiento.factura)
								.success(function (data, status, headers, config){
									if( !!data.isFactura ){
										//avisar de que existe factura repetida
										w.alert(	'Factura Repetida\nCoincidencia: '+
													'#'+data.matchMov.id+' : '+data.matchMov.factura);
									}else{
										//añadir nuevo movimiento
										saveNewMovimiento();
									}
								});
		};

		// BTNCLICK SaveMov
		this.saveMovimiento = function (){
			//comprobar importe valido, no anulable
			if( !this.checkValidImporte() || this.nuevoMovimiento.esNulo === true ){
				//comprobar numero de factura repetida
				if( !plugin.isEmpty(this.nuevoMovimiento.factura) ) {
					checkNewMovFactura();
				} else {
					saveNewMovimiento();
				}
			} else {
				w.alert('Falta la cantidad del movimiento');
			}
		};

		this.isImporteNull = function (event){
			if(event.target.checked){
				this.nuevoMovimiento.importe = 0;
			}
		};

		this.checkValidImporte = function(event){
			if(	Math.abs(this.nuevoMovimiento.importe) == 0 ||
					this.nuevoMovimiento.importe < 0 ||
					plugin.isEmpty(this.nuevoMovimiento.importe) ){

				if ( plugin.isEmpty(event) || event.type === 'blur' ) {
					this.nuevoMovimiento.importe = 0;
				} else if ( event.type === 'focus' ) {
					this.nuevoMovimiento.importe = '';
				}
				return true;
			}else return false;
		};

		this.resetMovimiento = function (){
			this.checkTipoMovimiento();
			this.nuevoMovimiento.esNulo = false;
			// this.nuevoMovimiento.categoria = '';
			this.nuevoMovimiento.importe = 0;
			this.nuevoMovimiento.concepto = '';
			this.nuevoMovimiento.factura = '';
			this.nuevoMovimiento.fecha = this.fechaActual;
		};

		this.checkTipoMovimiento = function (){
			this.nuevoMovimiento.tipo = (!this.nuevoMovimiento.esIngreso) ? 'gasto' : 'ingreso';
		};

		this.resetTipo = function(typeMov){
			this.nuevoMovimiento.tipo = typeMov;
			this.nuevoMovimiento.esIngreso = (typeMov === 'ingreso') ? 1 : 0;
			this.nuevoMovimiento.esGasto = (typeMov === 'gasto') ? 1 : 0;
			// this.nuevoMovimiento.categoria = '';
		};

		this.balance = function (){
			return this.total.ingresos - this.total.gastos;
		};

		this.voidKeyPress = function (eventPress){
			if (	eventPress.charCode === 13 ||
					eventPress.charCode === 32){
				eventPress.preventDefault();
				return false;
			}
		};

		//reseteo las propiedades del modelo al cargar la vista
		this.resetMovimiento();
	};

	//CONTROLADORES DE APLICACION y dependencia de controlador $location
	appAng.controller(	'bankAccountsController',
	['$scope', '$rootScope', '$location', '$cookieStore', 'maestrosFactory', 'movimientosFactory', 'movimientosFiltrados', AccountingCtrl] );

})(window, window.angular, app, plugin);