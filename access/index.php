<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="1" content="registro y loguin de usuarios al sistema de house-account, gestionbanria de cuentas privadas y coorporativas" />
	<meta name="author" content="Fernando Palacios Landi" />
	<!-- <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
	<link rel="icon" href="img/favicon.ico" type="image/x-icon" /> -->
	<title>registro sistema de cuentas bancarias personales</title>
	<link rel="stylesheet" href="css/registerAppAccount.css" />
	<script src="vendor/js/angular-1.2.19.min.js"></script>
	<script src="vendor/js/angular-1.2.19-route.min.js"></script>
</head>
<body>

<div id="infoContent" class="filterBright">
	<header>
		<div class="welcome">
			<h1>Bienvenido a nuestro sistema de <i class="appName" title="cuentas personales" >house account</i></h1>
			<strong class="quotes lead">Gestión de <i>Ingresos y Gastos</i></strong>
		</div>
	</header>

	<section id="comercial">
		<p><span class="question">Necesitas controlar tu <span class="mark">dinero</span></span></p>
		<b>Esta aplicación te permite gestionar tus <br/>Movimientos Bancarios</b>
		<ul class="list_ord">
			<li>Gestionar tu economía casera</li>
			<li data-premium="este sercicio solo es accesible por usuarios de pago">
					Compartir una misma cuenta con varias personas</li>
			<li>Estadísticas de Ingresos y Gastos</li>
			<li>Exportar en Excel, Pdf</li>
			<li>Hacer facturas de Movimientos</li>
			<li>Sincronizar tus cuentas con Google Drive o Dropbox</li>
		</ul>
	</section>
</div>

	<section id="accessApp" ng-app="accessHouseAccountApp">
		<div class="btnAccessApp">
			<button	class="btnLoginApp buttonAccess"
						ng-active="">
				<a href="#/login" class="button-title filterHightBright">
					<span class="perspectiveX">loguéate</span></a>
			</button>

			<button class="btnRegisterApp buttonAccess">
				<a href="#/register" class="button-title filterHightBright">
					<span class="perspectiveX">regístrate</span></a>
			</button>
		</div>

		<!-- VISTAS DE ACCESO AL SISTEMA : SINGLE PAGE APLICATION -->
		<div id="accessHouseAccountViews">
				<?php include_once "server/user.php"; ?>
            <div ng-view></div> 
      </div>

	</section>
	
<script src="js/validarForm.js"></script>
<script src="js/registerAppAccount.js"></script>
<script src="js/accessAccount/accessAccount.ctrl.js"></script>
<script src="js/accessAccount/permisosAccount.ctrl.js"></script>
</body>
</html>
