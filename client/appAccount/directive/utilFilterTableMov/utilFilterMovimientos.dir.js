var utilFilterMovController = function ($rootScope){
	var fechaActual = new Date().toJSON().split('T')[0];

	var getRowData = function (tableHeadRow, tableBodyRow) {
		var	tableBodyData = tableBodyRow.querySelectorAll('td'),
				myObject = {};

	   for (var i = 0, len = tableHeadRow.length; i < len; i++) {
	   	if( i === 0 ){ //primer valor
	   		var arrIdFactMov = tableBodyData[i].innerText.split('#');
	   		myObject[ tableHeadRow[0] ] = arrIdFactMov[0]; 
	   		myObject[ tableHeadRow[1] ] = arrIdFactMov[1];
	   		continue;
	   	}
	   	
	   	myObject[ tableHeadRow[i] ] = tableBodyData[i-1].innerText;
	   	
	   	//RETOQUES DE OUTPUT
	   	if( i === 1 ){ //primer valor
	   		myObject[ tableHeadRow[i] ] = myObject[ tableHeadRow[i] ].split('#')[1] ;
	   	}
	   	if( i === len-1 ){ //ultimo valor
	   		var	value = tableBodyData[i-1].innerText,
	   				entero = parseFloat(value.split(',')[0].trim().replace('.', '')),
	   				decimal = '0.'+parseFloat(value.split(',')[1]),
	   				total = parseFloat(entero) + parseFloat(decimal);
	   		myObject[ tableHeadRow[i] ] = total.toString().replace('.', ',');
	   	}
	   }
	    return myObject;
	};

	this.printMovFilter = function (divName){
		var	printContents = document.getElementById(divName).innerHTML,
				innerContent = '<html><head><link rel="stylesheet" href="css/printFilterMov.css" /></head>'+
									'<body onload="document.title=\'cuentas-'+$rootScope.nombre+'-'+fechaActual+'\';window.print();window.close();">'+printContents+'</body></html>',
				popupWin = window.open('', '_blank', 'width=600,height=500');

		popupWin.document.open();
		popupWin.document.write(innerContent);
		popupWin.document.close();
	};

	//ENCENDIDO APACHE EN EL PUERTO 80
	this.saveExcelMovFilter = function (tableName){
		var	tableBodyRows = document.querySelectorAll("#"+tableName+" tbody tr"),
				tableCaption = 'cuentas-'+$rootScope.nombre+'-'+fechaActual,
				sourcePHPPrint = 'http://localhost:80/last_update/houseAccount/server/saveExcelMovFilter.php',
				tableHeadRow = ["DOCUMENTOS", "FACTURA", "FECHA", "TIPO", "CATEGORIA", "CONCEPTO", "IMPORTE"],
				tableBodyData = [];

		for (var i = 0, len = tableBodyRows.length; i < len; i++) {
			if( Object.prototype.toString.call(tableBodyRows[i]) === "[object HTMLTableRowElement]" ){
				var rowData = getRowData( tableHeadRow, tableBodyRows[i] );
				tableBodyData.push(rowData);
			}
		}

		var	f = document.createElement("FORM"),
				inputTableHead = document.createElement("INPUT"),
				inputTableData = document.createElement("INPUT"),
				inputTableCaption = document.createElement("INPUT");

		f.action = sourcePHPPrint;
		f.method = "POST";

		inputTableHead.type = "hidden";
		inputTableHead.name  = "tableHead";
		inputTableHead.value = JSON.stringify([tableHeadRow]); //JSON

		inputTableData.type = "hidden";
		inputTableData.name  = "tableData";
		inputTableData.value = JSON.stringify(tableBodyData); //JSON

		inputTableCaption.type = "hidden";
		inputTableCaption.name  = "tableCaption";
		inputTableCaption.value = tableCaption; //string

		f.appendChild(inputTableHead);
		f.appendChild(inputTableData);
		f.appendChild(inputTableCaption);
		f.submit();
	};
};

var utilFilterMovimientos = function($rootScope){
	return {
		restrict: 'E',
		templateUrl: 'directive/utilFilterTableMov/utilFilterMovimientos.html',
		controller: utilFilterMovController,
		controllerAs: 'utilFilterMovCtrl'
	};
};

appDirectives.directive('utilFilterMovimientos', ['$rootScope', utilFilterMovimientos]);