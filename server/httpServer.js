//////////////////////////////////////////////////////////////////////////////////
//http://localhost:3000/appAccount?ID=00000000000000000024&KEY=fernando@gmail.com //
//////////////////////////////////////////////////////////////////////////////////

var express = require('express'),         //MVC
    bodyParser = require('body-parser'),  //recuperar datos de formulario por POST
    http = require('http'),               //controlar eventos de express
    ErrApp = {
        e401: 'Credencial Invalida: ',
        e409: 'Usuario con email ya registrado: ',
        e419: 'Sesion caducada @ 20 min: '
    };

var app = express(),            //aplicacion MVC basada en express
    port = process.env.PORT || 3000, //puerto de escucha de Node
    server = app.listen(port);  //puerto de escucha del servidor (localhost)

    //PERSISTENCIA DE MOVIMIENTOS
var maxId = 0,
    movimientos = [
                                    //TEST: INGRESOS
        {categoria: "ingresos varios", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-01-09", id: 0, importe: 200, tipo: "ingreso"},
        {categoria: "ingresos varios", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-02-09", id: 1, importe: 1569, tipo: "ingreso"},
        {categoria: "ingresos varios", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-03-09", id: 2, importe: 356, tipo: "ingreso"},
        {categoria: "ingresos varios", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-04-09", id: 3, importe: 500, tipo: "ingreso"},
        {categoria: "alquileres", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-05-09", id: 4, importe: 900, tipo: "ingreso"},
        //TEST: JUNIO NO TIENE INGRESOS
        {categoria: "propiedades", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-07-09", id: 6, importe: 549, tipo: "ingreso"},
        {categoria: "propiedades", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-08-09", id: 7, importe: 1214, tipo: "ingreso"},
        {categoria: "salario", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-09-09", id: 8, importe: 622, tipo: "ingreso"},
        {categoria: "", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-10-09", id: 9, importe: 842, tipo: "ingreso"},
        {categoria: "salario", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-11-09", id: 10, importe: 1200, tipo: "ingreso"},
        {categoria: "salario", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-12-09", id: 11, importe: 2500, tipo: "ingreso"},

                        //TEST: GASTOS
        {categoria: "", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-01-09", id: 12, importe: 2156, tipo: "gasto"},
        {categoria: "seguro de vida", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-02-09", id: 13, importe: 200, tipo: "gasto"},
        {categoria: "gadgets", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-03-09", id: 14, importe: 156, tipo: "gasto"},
        {categoria: "juguetes", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-04-09", id: 15, importe: 154, tipo: "gasto"},
        {categoria: "ahorro en general", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-05-09", id: 16, importe: 164, tipo: "gasto"},
        {categoria: "jubilación", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-06-09", id: 17, importe: 149, tipo: "gasto"},
        {categoria: "juegos", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-07-09", id: 18, importe: 1542, tipo: "gasto"},
        {categoria: "reparaciones", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-08-09", id: 19, importe: 135, tipo: "gasto"},
            //TEST: SEPTIEMBRE NO TIENE GASTOS
        {categoria: "limpieza", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-10-09", id: 21, importe: 566, tipo: "gasto"},
        {categoria: "internet", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-11-09", id: 54, importe: 444, tipo: "gasto"},
        {categoria: "alquileres", concepto: "", esGasto: 0, esIngreso: 1, factura: "s/n", fecha: "2014-12-09", id: 110, importe: 2100, tipo: "gasto"}
    ],
    total = { ingresos: 10452, gastos: 7766 },
    maestros = {
        categoriasIngresosPersonal  :
            ['ingresos varios', 'propiedades', 'alquileres', 'salario', 'servicios profesionales'],
        categoriasGastosHogar :
            ['varios hogar', 'hipoteca', 'alquileres', 'seguro del hogar', 'impuestos del hogar', 'electricidad', 'gas', 'agua', 'teléfono', 'televisión de pago', 'internet', 'muebles / aparatos', 'mantenimiento / suministros', 'mejoras del hogar'],
        categoriasGastosTransporte :
            ['varios transporte', 'préstamo de vehículos', 'seguro de vehículos', 'impuesto de vehículos', 'combustible', 'transporte publico', 'reparaciones'],
        categoriasGastosSanitario :
            ['varios sanitario', 'seguro de salud', 'dentista', 'medicinas', 'seguro de vida'],
        categoriasGastosDiarios :
            ['gastos personales', 'comestibles', 'ropa', 'limpieza', 'educación', 'comer fuera de casa', 'peluquería', 'mascotas'],
        categoriasGastosEntretenimiento :
            ['varios entretenimiento', 'vídeos / DVDs', 'música', 'juegos', 'cine / teatro', 'conciertos', 'libros / revistas', 'deporte', 'juguetes / gadgets', 'vacaciones'],
        categoriasGastosAhorro :
            ['ahorro en general', 'fondo de emergencia', 'cuantía de ahorro', 'jubilación', 'inversiones', 'ahorro en educación']
    },
    //PERSISTENCIA DE ESTADISDISTICAS
    monthEstatistics = { "Enero": 0, "Febrero": 1, "Marzo": 2, "Abril": 3, "Mayo": 4, "Junio": 5, "Julio": 6, "Agosto": 7, "Septiembre": 8, "Octubre": 9, "Noviembre": 10, "Diciembre": 11 },
    //AUTENTICACION
    usuarios = [],
    sesiones = [];

var newSession = function ( newEmailUser ){
    //dar de alta con el token de sesion a traves del email
    var newSessionId = (Math.random()*88888) + 11111,
        resetTimeStamp = new Date();
    
    sesiones.push({
        email: newEmailUser,
        sessionId: newSessionId,
        timeStamp: resetTimeStamp
    });
    return newSessionId;
};

var shutDown = function (){
    console.log("el servidor se ha desconectado");

    server.close(function(){
        process.exit();
    });

    //a los 5 segundos forzaremos el apagado
    setTimeout(function(){
        process.exit();
    }, 1000*5);
};

//MIDDLEWARE: parsear encabezados http y parametros de peticion GET
app.use( bodyParser() );

//MIDDLEWARE, validacion de sesiones: cualquier ruta de consulta REST, que comienze por /api/priv
app.use( '/api/priv/', function (req, res, next){

    var sessionId = req.get('sessionId');
    var sesionEncontrada = sesiones.filter(function (sesion){
            return sesion.sessionId == sessionId;
        })[0];

    //ACTUALIZAR LA SESION si no han pasado 20 minutos o CADUCARLA
    if(sesionEncontrada){
        if( (new Date() - sesionEncontrada.timeStamp) > (1000*20*60) ){
            console.log(ErrApp.e419 + JSON.stringify(sesionEncontrada));
            res.send(419, ErrApp.e419);
        }else{
            console.log('TimeStamp sesion actualizada de :'+sesionEncontrada.email);
            sesionEncontrada.timeStamp = new Date();
        }
    }else{
        console.log(ErrApp.e401+' Sesion NO encontrada o caducada');
        res.send(401, ErrApp.e401);
    }

    /*NODE: si hemos llegado aqui, continuar la ejecucion,
    El middelware debe permitir acceder a la ruta con la extension api/priv/... */
    next();
});

/*
app.get("/appAccount", function(req, res) {
    var permId = req.query.ID,
        permKey = req.query.KEY;

    console.log(permId, permKey);
    // res.redirect();
});
 */

// MIDDLEWARE, acceso a recursos estaticos desde este servidor
app.use( express.static('../client') );

//API REST: recuperar totales
app.get('/api/priv/total', function (req, res, next) {
    res.json(total);
});

//API REST: recuperar meses
app.get('/api/priv/month_estatistics', function (req, res, next) {
    var months = [];
    for (var key in monthEstatistics) {
        months.push(key);
    }
    res.json(months);
});

// {tipo: "ingreso", anyo: 2014}
//API REST: recuperar datos de movimientos
app.get('/api/priv/saldoAnual_movimiento', function (req, res, next) {
    var matchCateg = req.query.tipo, //'ingreso' || 'gasto'
        matchYear = req.query.anyo, //2014
        sumMonthCateg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// leng = 12

    //calcular el total mensual (de año especificado) de ingresos o gastos
    for(var i = 0, len = movimientos.length; i < len; i++) {
        var movimientoTipo = movimientos[i].tipo,
            movimientoFecha = new Date( movimientos[i].fecha ).getFullYear();

    /*  capturar de cada tipo (ingresos/gastos),
        que pertenecen al año seleccionado,
        seleccionar su mes, y añadir su cantidad al stack de meses
    */
        if( movimientoTipo == matchCateg && movimientoFecha == matchYear){
            var matchMonth = new Date( movimientos[i].fecha ).getMonth(); //mes del año [0-11]
            sumMonthCateg[matchMonth] += movimientos[i].importe;
        }
    };

    res.json(sumMonthCateg);
});

//API REST: recuperar datos de movimientos
app.get('/api/priv/categAnual_movimiento', function (req, res, next) {
    var matchCateg = req.query.tipo, //'ingreso' || 'gasto'
        matchYear = req.query.anyo, //2014
        sumCateg = [];

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //NECESITO UNA ENDIDAD RELACION QUE ME FAVOREZCA EL REUTILIZAR LOS NOMBRES DE CLAVES PRIMERIAS //
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // dataCategGastos
    // [{categ: 'string', value: 0}, {}, {}...]

    res.json(sumCateg); //[{categ: 'string', value: 0}, {}, {}...]
});

//API REST: recuperar movimientos por parametros
app.get("/api/priv/filter_movimiento", function (req, res, next){
    //recuperamos los prametros de peticion, NO los del encabezado
    var movId = req.query.id;
    var matchMov = movimientos.filter(function (movimiento){
        return movimiento.id == movId;
    })[0];
    res.json(matchMov);
});

//API REST: comprobar Factura repetida
app.get("/api/priv/factura_movimiento", function (req, res, next){
    //iterar sobre todos los movimientos y encontrar la factura
    var matchFactura = req.query.factura,
        resFactura = {
            isFactura: false,
            matchMov: {}
        },
        matchMov = movimientos.filter(function (movimiento){
            if( movimiento.factura == matchFactura ){
                resFactura = {
                    isFactura: true,
                    matchMov: movimiento
                };
                res.json(resFactura);
            }
        })[0];
        res.json(resFactura);
});

//API REST: recuperar y configurar movimientos
app.route('/api/priv/movimientos')
	.get(function (req, res, next) {
        res.json(movimientos);
    })
	.post(function (req, res, next) {
        
        var reqBody = req.body, //header HTTP: metadatos nuevoMovimiento
            movimiento = {
                id: maxId++,
                esIngreso: reqBody.esIngreso,
                esGasto: reqBody.esGasto,
                importe: reqBody.importe,
                fecha: reqBody.fecha,
                tipo: reqBody.tipo,
                categoria: reqBody.categoria,
                factura: reqBody.factura,
                concepto: reqBody.concepto
            };
        
        ( !movimiento.esIngreso )   ? total.gastos   += movimiento.importe
                                    : total.ingresos += movimiento.importe;

        movimientos.push(movimiento);
        res.status(200);
        res.json(movimiento);   //callback promises cliente
    });

// ACTUALIZAR PROPIEDADES DE UN MOVIMIENTO
app.route('/api/priv/updateMovimiento')
    .post(function (req, res, next) {
        var reqBody = req.body,
            matchMov = movimientos.filter(function (movimiento){
                if( movimiento.id == reqBody.id ){
                    //actualizar totales antiguos
                    ( !movimiento.esIngreso )   ? total.gastos   -= movimiento.importe
                                                : total.ingresos -= movimiento.importe;

                    movimiento.esIngreso = reqBody.esIngreso;
                    movimiento.esGasto = reqBody.esGasto;
                    movimiento.importe = reqBody.importe;
                    movimiento.fecha = reqBody.fecha;
                    movimiento.tipo = reqBody.tipo;
                    movimiento.categoria = reqBody.categoria;
                    movimiento.factura = reqBody.factura;
                    movimiento.concepto = reqBody.concepto;
                    console.log('Movimiento Actualizado: #'+movimiento.id);

                    //actualizar totales nuevos
                    ( !movimiento.esIngreso )   ? total.gastos   += movimiento.importe
                                                : total.ingresos += movimiento.importe;

                    //callback promises cliente
                    res.status(200);
                    res.json(movimiento);
                }
            })[0];
    });

//ELIMIANAR UN MOVIMIENTO
app.route('/api/priv/deleteMovimiento')
    .post(function (req, res, next) {
        var reqBody = req.body,
            matchMov = movimientos.filter(function (movimiento, posInMov){
                if( movimiento.id == reqBody.id ){
                    movimientos.splice(posInMov, 1);
                    console.log('Movimiento Eliminado: #'+movimiento.id);

                    //actualizar totales
                    ( !movimiento.esIngreso )   ? total.gastos   -= movimiento.importe
                                                : total.ingresos -= movimiento.importe;
                    
                    //callback promises cliente
                    res.status(200);
                    res.json(movimiento);   
                }
            })[0];
    });

//API REST: recuperar maestros
app.get("/api/pub/maestros", function(req, res, next){
    res.json(maestros);
});

//API REST: gestion de Usuarios: lista y redistros
app.route('/api/usuarios/')
    .get(function (req, res, next){
        res.json(usuarios);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };

        //comprobar registro o dar de alta nuevo usuario
        if (!usuarios.some(function (usuario) {
            return usuario.email == checkUsuario.email;
        })) {
            //si no esta registrado, crear token de sesion y devolverlo al cliente
            usuarios.push(checkUsuario);
            console.log('Nuevo usuario, sesion creada en '+checkUsuario.email);
            var sessionID = newSession(checkUsuario.email);
            res.json(sessionID);
        } else {
            console.log(ErrApp.e409+checkUsuario.email);
            res.send(409, ErrApp.e409);
        }
    });

// API REST: gestion de sesiones
/*si el usuario esta registrado, comprobar si la sesionque envia el cliente esta dada de alta para ese cliente en el servidor (email)*/
app.route('/api/sesiones')
    .get(function (req, res, next){
        res.json(sesiones);
    })
    .post(function (req, res, next){
        var reqBody = req.body;//header HTTP: metadatos nuevoUsuario
        var checkUsuario = {
            email: reqBody.email,
            password: reqBody.password
        };
        
        var usuarioValidado = usuarios.filter(function (usuario) {
            return  usuario.email == checkUsuario.email &&
                    usuario.password == checkUsuario.password;
        })[0];

        //confirmar usuario o negar conexion
        if (usuarioValidado) {
            console.log('Id sesion actualizada de '+checkUsuario.email);
            var sessionID = newSession(checkUsuario.email);
            res.json(sessionID);
        } else {
            console.log(ErrApp.e401+checkUsuario.email);
            res.send(401, ErrApp.e401);
        }
    });

//API REST: prueba de servidor
app.get("/test", function(req, res, next){
    res.send("<h1>Flujo de Cajas</h1><p>NodeJs y Expres funcionan!!!</p>");
});
console.log('Servidor NodeJS corriendo en http://localhost:'+port);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);