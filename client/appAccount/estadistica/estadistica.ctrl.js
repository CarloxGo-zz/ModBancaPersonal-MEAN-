
	var estadisticaCtrl = function($scope, movimientosFactory, maestrosFactory){
		window.scrollTo(0,0); //reset plugin fixed table footer
		this.titulo = 'Graficas de Movimientos.';

		this.inputYearStats = new Date().getFullYear();
		this.inputMonthStats = this.inputYearStats + "-" +("0" + (new Date().getMonth() + 1)).slice(-2);

	
		// var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

		var defaultDataSetGastos = {
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)"
		};

		var defaultDataSetIngr = {
			fillColor : "rgba(151,187,205,0.2)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(151,187,205,1)"
		};

		var defaultDataSetSaldo = angular.copy(defaultDataSetIngr);

		//eliminamos todos los canvas para liberar memoria
		this.resizeBuffer = function (){
			var allCanvas = document.querySelectorAll("canvas");
			if ( !plugin.isEmpty(allCanvas) ) {
				for (var i = 0, len = allCanvas.length; i < len; i++) {
					delete allCanvas[i]
				};
			}
		};

		//Gastos VS Ingresos
		this.loadCanvasLine = function(dateValue, dateType){
			var	divCanvasGasVSIngr = document.querySelector('#canvasGasIng'),
					divCanvasSaldo = document.querySelector('#canvasSaldo');
			divCanvasGasVSIngr.innerHTML = "";
			divCanvasSaldo.innerHTML = "";

			if( dateType === "number" ){ //estadisticas por año

				//recuperar los meses de la estadistica
				movimientosFactory.getMonthEstats().success(function (dataMeses){ 
					var mesesChart = dataMeses;

					//recuperar los ingresos de la estadistica
					movimientosFactory.getSaldoAnual({tipo: 'ingreso' , anyo: dateValue})
						.success(function (dataSumIngr){
							defaultDataSetIngr.label = "Total Ingresos anuales";
							defaultDataSetIngr.data = dataSumIngr;

							//recuperar los gastos de la estadistica
							movimientosFactory.getSaldoAnual({tipo: 'gasto' , anyo: dateValue})
								.success(function (dataSumGast){
									defaultDataSetGastos.label = "Total Gastos anuales";
									defaultDataSetGastos.data = dataSumGast;
									
									//recuperar saldo (ingresos - gastos) de la estadistica
									defaultDataSetSaldo.label = "Total Saldo anual";
									defaultDataSetSaldo.data = defaultDataSetIngr.data.map(function(dataIng, index){
										return dataIng-defaultDataSetGastos.data[index];
									});

									// datos de los canvas lineales
									var	chartDataGasVSIngr = {
												labels : mesesChart,
												datasets : [ defaultDataSetIngr , defaultDataSetGastos ] 
											},
											chartDataSaldo = {
												labels : mesesChart,
												datasets : [ defaultDataSetSaldo ] 
											};

									//layer de los canvas lineales
									var	htmlCanvasGasVSIngr = document.createElement('canvas'),
											ctxGasVSIngr = htmlCanvasGasVSIngr.getContext("2d"),
											htmlCanvasSaldo = document.createElement('canvas'),
											ctxSaldo = htmlCanvasSaldo.getContext("2d");

									divCanvasGasVSIngr.appendChild(htmlCanvasGasVSIngr);
									divCanvasSaldo.appendChild(htmlCanvasSaldo);

									//dibujamos las estadistuca //window.myLine
									new Chart(ctxGasVSIngr).Line(chartDataGasVSIngr, {
										scaleFontColor: "#fa0",
										scaleLabel: "<%=value%> €",
    									multiTooltipTemplate: "<%= value %> €",
										responsive: true

									});
									new Chart(ctxSaldo).Line(chartDataSaldo, {
										scaleFontColor: "#fa0",
										scaleLabel: "<%=value%> €",
										tooltipTemplate: "<%if (label){%><%=label%> : <%}%><%= value %> €",
										responsive: true
									});

									//CharyJS fija unas dimensiones de canvas, lo dimensionamos a su contenedor
									// htmlCanvasGasVSIngr.style.height = '100%';
									// htmlCanvasSaldo.style.height = '100%';
								});
						});
					 
				});

			}else if ( dateType === "month" ){ //estadisticas por mes
				//(rangos de semanas) REST para extraer las semanas de un mes especifico 
				// var	semanasChart = movimientosFactory.getWeekEstats(),
				// 		defaultDataSetIngr.label: "Total ingresos mensuales",
				// 		defaultDataSetIngr.data = movimientosFactory.getCategMensual({tipo: 'ingreso' , anyo: dateValue});				
				window.alert("falta implementar estadisticas por mes: modificar datos de REST");
			}else{
				window.alert("hay que introducir una fecha adecuada");
			}

		};

		var defaultDataExGastos = [	{	value: 0,
													color:"#F7464A",
													highlight: "#FF5A5E",
													label: "Gastos del Hogar",
													categ: "categoriasGastosHogar" },
												{	value: 0, 
													color: "#484d79",
													highlight: "8B91C5",
													label: "Gastos de Transporte",
													categ: "categoriasGastosTransporte" },
												{	value: 0,
													color: "#FDB45C",
													highlight: "#FFC870",
													label: "Gastos Sanitarios",
													categ: "categoriasGastosSanitario" },
												{	value: 0,
													color: "#949FB1",
													highlight: "#A8B3C5",
													label: "Gastos Diarios",
													categ: "categoriasGastosDiarios" },
												{	value: 0,
													color: "#4D5360",
													highlight: "#616774",
													label: "Gastos de Entretenimiento",
													categ: "categoriasGastosEntretenimiento" },
												{	value: 0, 
													color: "#46BFBD",
													highlight: "#5AD3D1",
													label: "Ahorros",
													categ: "categoriasGastosAhorro" 	} ];

		this.loadCanvasCircle = function(dateValue, dateType){
			var	divCanvasEvGas = document.querySelector('#canvasEvGastos'),
					divCanvasEvIngr = document.querySelector('#canvasEvIngresos');
			divCanvasEvGas.innerHTML = "";
			divCanvasEvIngr.innerHTML = "";

			if( dateType === "number" ){ //estadisticas por año
				var	htmlCanvasEvGastos = document.createElement('canvas'),
						ctxEvGastos = htmlCanvasEvGastos.getContext("2d");

				movimientosFactory.getCategAnual({tipo: 'gasto' , anyo: dateValue})
					.success(function (dataCategGastos){ //[{categ: 'string', value: 0}, {}, {}...]

						///////////////////////////////////////////////////////////
						//FALTA NODE - > '/api/priv/categAnual_movimiento' //
						///////////////////////////////////////////////////////////
						//asignamos el valor a cada categoria
						for (var j = 0, len = defaultDataExGastos.length; j < len; j++) {
							for (var i = 0, long = dataCategGastos.length; i < long; i++) {
								if( dataCategGastos[i].categ === defaultDataExGastos[j].categ){
									defaultDataExGastos[j].value += dataCategGastos[i].value;
									break; //solo hay una coincidencia de arr <-> arr
								}
							}
						}

						divCanvasEvGas.appendChild(htmlCanvasEvGastos);

						new Chart(ctxEvGastos).Doughnut(defaultDataExGastos, {
							 tooltipTemplate: "<%if (label){%><%=label%> : <%}%><%= value %> €",
							responsive : true
						});
					});
				
				
			} else if ( dateType === "month" ) {
				window.alert("falta implementar estadisticas por mes: modificar datos de REST");
			} else {
				window.alert("hay que introducir una fecha adecuada");
			}
		};

		//por defecto cargamos las estadisticas de este año
		this.loadCanvasLine( this.inputYearStats, 'number');
		// this.loadCanvasCircle( this.inputYearStats, 'number');
	};

app.controller(	'estadisticaController',
						['$scope', 'movimientosFactory', 'maestrosFactory', estadisticaCtrl]);


appDirectives.directive('loadCanvasEstats', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('change', function(event){
				scope.estadisticaCtrl.resizeBuffer();
				scope.estadisticaCtrl.loadCanvasLine(this.value, this.type);
				///////////////////////////////////////////////////////////
				//FALTA NODE - > '/api/priv/categAnual_movimiento' //
				///////////////////////////////////////////////////////////
				// scope.estadisticaCtrl.loadCanvasCircle(this.value, this.type);
			});
		}
	};
});