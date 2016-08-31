// CONTROLADOR DE DIRECTIVA FILTRO-MOVIMIENTOS
var filtroMovController = function ($scope, maestrosFactory, movimientosFiltrados){
	var	fechaActual = new Date().toJSON().split('T')[0],
			scope = this;

	/* RESETEAR VALORES DE FILTROS
	Tanto en la factoria como en la vista del controlador*/
	this.resetValues = function (){
		movimientosFiltrados.resetValues();
		this.resetProperties();
	};

	this.resetSearch = function (){
		movimientosFiltrados.resetSearch();
		this.resetProperties();
	};

	this.resetDate = function (){
		movimientosFiltrados.resetDate();
		this.resetProperties();
	};

	// cargar los valores por defecto desde la factoria
	this.resetProperties = function (){

		this.valorBuscado = movimientosFiltrados.valorBuscado;
		this.valorCorte = movimientosFiltrados.valorCorte;
		this.checkData = movimientosFiltrados.checkData;
		this.start_date = movimientosFiltrados.start_date;
		this.end_date = movimientosFiltrados.end_date;
		this.checkToday = movimientosFiltrados.checkToday;
		this.checkActualMonth = movimientosFiltrados.checkActualMonth;
		this.checkActualYear = movimientosFiltrados.checkActualYear;
		this.checkActualWeek = movimientosFiltrados.checkActualWeek;
		// indicador de filtros seteados
		window.setTimeout(function (){
			if( movimientosFiltrados.isFiltered() ){
				$('[name="resetMovFilterBtn"]').addClass('filterActive');
			}else{
				$('[name="resetMovFilterBtn"]').removeClass('filterActive');
			}
		}, 100);

		// window.scroll();
	}

	this.resetProperties();

	this.resetAllFilters = function (){
		this.resetValues();
		this.resetDate();
		$scope.tablaMovCtr.checkCampoSentido('id');
		window.setTimeout(function (){
			$('[name="resetMovFilterBtn"]').removeClass('filterActive');
		}, 100);
	}

	this.getMaestrosFactory = function (){
		maestrosFactory.getMaestros()
						.success(function (data){
							scope.categoria = data;
						})
						.error(function (dataError){
							scope.categoria = {categoriasGastos: [], categoriasIngresos: []};
						});
	};

	this.categoria = this.getMaestrosFactory();
	
	
	this.setActualMonth = function(){
		if( plugin.isEmpty(this.checkActualMonth) ){
			this.checkActualYear = false;
			this.checkActualWeek = false;
			this.checkToday = false;

			var	now = new Date(),
					thisYear = now.getFullYear(),
					thisMonth = now.getMonth(),
					firstDayMonth = new Date(thisYear, thisMonth, 1),
					lastDayMonth = new Date(thisYear, thisMonth, plugin.getLastDayInMonth(now));

			this.start_date = firstDayMonth.toJSON().split('T')[0];
			this.end_date = lastDayMonth.toJSON().split('T')[0];
		}else{
			this.resetDate();
		}
	};

	this.setActualYear = function (){
		if( plugin.isEmpty(this.checkActualYear) ){
			this.checkActualMonth = false;
			this.checkActualWeek = false;
			this.checkToday = false;
			var	now = new Date(),
					thisYear = now.getFullYear(),
					firstDayYear = new Date(thisYear, 0, 1),
					lastDayYear = new Date(thisYear, 11, 31);

			this.start_date = firstDayYear.toJSON().split('T')[0];
			this.end_date = lastDayYear.toJSON().split('T')[0];

		}else{
			this.resetDate();
		}
	};

	this.setActualWeek = function (){
		if( plugin.isEmpty(this.checkActualWeek) ){
			this.checkActualMonth = false;
			this.checkActualYear = false;
			this.checkToday = false;
			var	now = new Date(),
					firstDayWeek = plugin.getFirstDayWeek(now),
					lastDayWeek = plugin.getLastDayWeek(now);

			this.start_date = firstDayWeek.toJSON().split('T')[0];
			this.end_date = lastDayWeek.toJSON().split('T')[0];

		}else{
			this.resetDate();
		}
	};

	this.setToday = function (){
		if( plugin.isEmpty(this.checkToday) ){
			this.checkActualMonth = false;
			this.checkActualYear = false;
			this.checkActualWeek = false;
			var	now = new Date();
			this.start_date = now.toJSON().split('T')[0];
			this.end_date = now.toJSON().split('T')[0];
		}else{
			this.resetDate();
		}
	};

};

// CONFIGURACION DE DIRECTIVA FILTRO-MOVIMIENTOS
var filtroMov = function(maestrosFactory, movimientosFiltrados){
	return {
		restrict: 'E',
		templateUrl: 'directive/filterMov/filtrosMovimientos.html',
		controller: filtroMovController,
		controllerAs: 'filtroMovCtr',
		link: function(scope, element, attrs) {
			/* Recuperamos el binding de todos las propiedades del controlador para esta directiva,
				y cuando hay un nuevo valor, actualizamos una factoria que la usaremos para recuperar el valor por defecto de esta propiedades al cargar la vista y su controlador */
			scope.$watch(	'this.filtroMovCtr.valorBuscado',
					function(newValue, oldValue) {
						//BUG: resetear valorBuscado cuando no hay search
						if( newValue === ''){
							movimientosFiltrados.valorBuscado = '';
						} else{
							resetProperties("valorBuscado", newValue);
						}
					});
         scope.$watch(	'this.filtroMovCtr.valorCorte',
					function(newValue, oldValue) { resetProperties("valorCorte", newValue); });
			scope.$watch(	'this.filtroMovCtr.checkData',
					function(newValue, oldValue) { resetProperties("checkData", newValue, true); });
			scope.$watch(	'this.filtroMovCtr.start_date',
					function(newValue, oldValue) { resetProperties("start_date", newValue); });
			scope.$watch(	'this.filtroMovCtr.end_date',
					function(newValue, oldValue) { resetProperties("end_date", newValue); });

			//BUG: persistencia de input.radio.rangoFechas
			scope.$watch(	'this.filtroMovCtr.checkToday',
					function(newValue, oldValue) { movimientosFiltrados.checkToday = newValue; });
			scope.$watch(	'this.filtroMovCtr.checkActualMonth',
					function(newValue, oldValue) { movimientosFiltrados.checkActualMonth = newValue; });
			scope.$watch(	'this.filtroMovCtr.checkActualYear',
					function(newValue, oldValue) { movimientosFiltrados.checkActualYear = newValue; });
			scope.$watch(	'this.filtroMovCtr.checkActualWeek',
					function(newValue, oldValue) { movimientosFiltrados.checkActualWeek = newValue; });

         var resetProperties = function (property, value, isFlag){
             if ( !!value ) {	movimientosFiltrados[property] = value; }

             if( !($('[name="resetMovFilterBtn"]').hasClass('filterActive')) && !isFlag) {
             	$('[name="resetMovFilterBtn"]').addClass('filterActive');
             }
         };
     }
	};
};

// DIRECTIVA DE FILTRO-MOVIMIENTOS
appDirectives.directive('filtrosMovimientos', ['maestrosFactory', 'movimientosFiltrados', filtroMov]);

//controlar el rango de fechas filtrados correctp
appDirectives.directive('preventDataChange', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1, // needed for angular 1.2.x
        link: function(scope, elm, attr, ngModelCtrl) {
        	//variable compartida entre bindings de eventos en el mismo elemento 
        	var lastDate, lastMov;
        	elm.bind('click', function(event){
        		lastDate = elm.val(); //lo podra utilizar 'change'
        		lastMov = scope.tablaMovCtr.filteredMov;
        	});
        	elm.bind('change', function(event){
        		var	filtroMovCtr = scope.filtroMovCtr,
        				diffDate =  +new Date(filtroMovCtr.end_date) - +new Date(filtroMovCtr.start_date);

				scope.$apply(function(){
					scope.filtroMovCtr.checkToday = false;
					scope.filtroMovCtr.checkActualMonth = false;
					scope.filtroMovCtr.checkActualYear = false;
					scope.filtroMovCtr.checkActualWeek = false;
				});

				//inhabilitar si la diferencia del rango de fechas es negativa
				if( !!filtroMovCtr.end_date && !!filtroMovCtr.start_date && diffDate < 0 ){
        			window.alert('rango de fechas incorrecto');
        			// recuperar fecha anterior y lista de movimentos anterior
					elm.val(lastDate);
					scope.tablaMovCtr.filteredMov = lastMov;
					elm.triggerHandler('change'); //reset //$watch
				}
        	});
        }
    };
});

//cargar la categoria buscada a la propiedad de filtros.categoria y controlar el error del footer de la tabla
appDirectives.directive('categoriaBuscada', function (){
	return {
		restrict: 'A',
		priority: 1, // needed for angular 1.2.x
		link: function (scope, elm, attr){
			elm.bind('change', function (event){
				//esta directiva de atributo se comparte en varias vistas, asi que comprobamos si el controlador de scope superio existe
				if( !!scope.$parent.filtroMovCtr ){
					scope.$apply(function(){
						scope.$parent.filtroMovCtr.valorBuscado = scope.$parent.filtroMovCtr.categoria;
						scope.$parent.filtroMovCtr.categoria = scope.$parent.filtroMovCtr.getMaestrosFactory();
					});

					//reseteamos la posicion de la tabla para evitar bug de plugin
					window.setTimeout(function (){
						window.scroll(window.scrollX, window.scrollY);
					}, 100);
				}
			});	
		}
	};
});

//controlar el error del footer de la tabla
appDirectives.directive('resetFixedTable', function (){
	return {
		restrict: 'A',
		priority: 1,
		link: function (scope, elm, attr){
			elm.bind('click input change', function (event){
				//reseteamos la posicion de la tabla para evitar bug de plugin
				window.setTimeout(function (){
					window.scroll(window.scrollX, window.scrollY);
				}, 100);
			});
		}
	};
});

// var preventDefaultScroll = function() {
//     return {
//         restrict: 'E',
//         link: function(scope, elem, attrs) {
//             if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
//                 elem.on('click', function(e){
//                     e.preventDefault();
//                     return false;
//                 });
//             }
//         }
//    };
// }
// app.directive('input', preventDefaultScroll);
// app.directive('a', preventDefaultScroll);
// app.directive('button', preventDefaultScroll);

appDirectives.directive('resetCateg', function (){
	return {
		restrict: 'A',
		priority: 1,
		link: function (scope, elm, attr){
			elm.bind('click input change', function (event){
				//compruebo cual es el scope del controller en el que llamo a la directiva
				if( !scope.filtroMovCtr ){
					scope.$apply(function(){
						attr.tablecateg = attr.tablecateg || 'ingreso';
						scope.accountsCtrl.nuevoMovimiento.tipo = 
							scope.accountsCtrl.nuevoMovimiento.tipo || attr.tablecateg;
						scope.accountsCtrl.nuevoMovimiento.categoria = '';
					});
					$('#groupBtnCteg .changeCateg').triggerHandler('click'); //reset //$watch
				}else{
					scope.$apply(function(){
						scope.filtroMovCtr.valorBuscado = attr.tablecateg;
					});	
				}
			});
		}
	};
});

//panel de filtros avanzados drop-down efect
appDirectives.directive('displayPanelFilters', function (){
	return {
		restrict: 'A',
		priority: 1,
		link: function (scope, elm, attr){
			elm.bind('click', function (event){
				$(elm[0].nextElementSibling).slideToggle();
				$(elm[0]).find('[data-toggle="collapse"]').toggleClass('collapseGlyphicons')
			});
		}
	};
});