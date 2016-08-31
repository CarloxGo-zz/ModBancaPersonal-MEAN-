// recortar la propiedad 'concepto' de cada movimiento
var cutInput = function(){
	return function (inputValue, paramFilter){
		if(!paramFilter)
			paramFilter = 10;
		if(!inputValue)
			return '----';

		if(inputValue.length <= paramFilter)
			return inputValue;
		else
			return inputValue.substring(0, paramFilter)+'...';
	};
};

//texto por defecto (ausencia de contenido)
var byDefault = function(){
	return function (field, strDef){
		strDef = strDef || '----';
		return field || strDef;
	};
};

//capitalizar palabras del input
var capitalyzeAll = function(){
	return function (inputValue, separator){
		if(!!inputValue){
			var	flag = separator || ' ',
					parseValue = inputValue.split(flag).map(function(arr, item){
						return arr.charAt(0).toUpperCase() + arr.substring(1);
					}).join(flag);
			return parseValue;
		}
	};
};

// importe de movimiento: por cantidades pequeñas y grandes
var impInput = function(){
	// [Object]movimientos: todos los moviumientos de la lista
	// [Number || Boolean]parseFilter: numero de movimientos a filtrar
	return function (movimientos, parseFilter) {
		var filtrados = [];
		if( parseFilter && !!movimientos ){ //ANGULAR
			if ( Object.prototype.toString.call(parseFilter) === '[object Number]' ) { // movimientos CON VALOR
				var paramFilter = parseFloat(parseFilter);
				for (var i = 0, leni = movimientos.length; i < leni; i++) {
					var importeMov = parseFloat(movimientos[i].importe);
					if (	(paramFilter >= 0) &&
							(importeMov >= paramFilter) ) {
						filtrados.push(movimientos[i]);
					} else if(	(paramFilter <= 0) &&
									(-paramFilter > importeMov) ){
						filtrados.push(movimientos[i]);
					}
				}
				return filtrados;

			} else if(	Object.prototype.toString.call(parseFilter) === '[object Boolean]' &&
							parseFilter === true) { // TODOS los movimientos
				return movimientos;
			}

		} else {
			if( !!movimientos && parseFilter === false ){ // movimientos NULO
				for (var j = 0, lenj = movimientos.length; j < lenj; j++) {
					var importeMovNulo = parseFloat(movimientos[j].importe);
					if (	importeMovNulo === 0 ) filtrados.push(movimientos[j]);
				}
				return filtrados;
			}
		}
	};
};

// formato del importe: €, decimales con una clse que los empequeñezca
var parseAmount = function(){
	return function (inputValue, paramFilter){
		var	quantity = inputValue.split('.')[0].replace(',', '.'),
				cents = " ,"+inputValue.split('.')[1]+" "+paramFilter;
		return quantity+cents;
	};
};

// rango de fecha del movimiento
var dateRange = function(){
  return function (movimientos, start_date, end_date, checkData) {
  	// console.log(start_date, end_date, checkData);
		// date filters
		var	result = [],
				parse_start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0,
				parse_end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();
		
		// if the conversations are loaded
		if (checkData && !plugin.isEmpty(movimientos) ){
			for (var i = 0, len = movimientos.length; i < len; i++) {
				var	movimiento = movimientos[i],
						movimientoDate = new Date(movimiento.fecha.split('T')[0]);
				if ( +movimientoDate >= parse_start_date && +movimientoDate <= parse_end_date ){
					result.push(movimiento);
				}
			}
			return result;
		}else return movimientos;
	};
};

var checkDate = function (){
	return function(inputDate){
		if( plugin.isEmpty(inputDate) ){
			return '---';
		}else if( !!inputDate ){
			if(inputDate.split('@')[1] !== '00:00'){
				return	inputDate.split('@')[0]+', '+
							inputDate.split('@')[1]+' '+
							inputDate.split('@')[2];
			}else{
				return inputDate.split('@')[0];
			}
		}
	};
}

appFilters.filter('impInput', impInput);
appFilters.filter('cutInput', cutInput);
appFilters.filter('parseAmount', parseAmount);
appFilters.filter('dateRange', dateRange);
appFilters.filter('byDefault', byDefault);
appFilters.filter('capitalyzeAll', capitalyzeAll);
appFilters.filter('checkDate', checkDate);