<div id="registerHouseAccountViews">
	<p><h2>regístrate de manera gratuita en <span class="noBreak">nuestro servicio</span></h2></p>
	<p class="errorServer">{{errorServer}}</p>
	
	<?php
	if(	isset($_POST['userMail']) &&
			User::checkUser($_REQUEST['userName'], $_REQUEST['userMail'], $_REQUEST['userPass'], $_REQUEST['userPass2']) ){

			//Cargar el mismo php que si estuvieramos desconectados de javascript
			include_once('server/loginRegisterAccess.php');
			//ALERTA: aqui se imprimiran el objeto de permisos
		
	}else{ ?>

	<form action="<?php $_SERVER['REQUEST_URI'] ?>" name="formRegisterApp"
				post-access data-access="register"
				method="POST" novalidate>

		<input type="hidden" name="access" value="register" />

		<p>
			<label for="nombreUsuario">usuario</label> :
			<input	type="text" name="userName" id="nombreUsuario"
						ng-model="usuario.userName"
						title="el nombre con el que te identificarás"
						placeholder="nombre de usuario"
						value="<?php if( isset($_POST['userName'])) echo $_POST['userName']; ?>">

			<span class="<?php	if (	!isset($_POST['userName']) ||
												User::validarNombre($_POST['userName'])) {
											echo 'oculto ';
										} ?>error userNameErr">el nombre de usuario debe completarse</span>
		</p>

		<p>
			<label for="emailUsuario">e-mail</label> :
			<input	type="mail" name="userMail" id="emailUsuario"
						ng-model="usuario.userMail"
						title="Tu correo electronico de hotmail, gmail, yahoo"
						placeholder="usuarioEmail@dominio.com"
						value="<?php if(isset($_POST['userMail'])) echo $_POST['userMail']; ?>">

			<span class="<?php	if (	!isset($_POST['userMail']) ||
												User::validarEmail($_POST['userMail'] ) ) {
													echo 'oculto ';
												} ?>error userMailErr">el email no es correcto</span>
		</p>

		<p>
			<label for="passUsuario">contraseña</label> :
			<input	type="password" name="userPass"
						ng-model="usuario.userPass"
						class="userPass" id="passUsuario"
						placeholder="*****" title="contraseña del usuario"
						value="<?php if(isset($_POST['userPass'])) { echo $_POST['userPass']; } ?>">
						<small>{{usuario.userPass}}</small>
		</p>

		<p>
			<label for="repetirPass">Repetir contraseña</label> :
			<input	type="password" name="userPass2"
						class="userPass" id="repetirPass"
						placeholder="*****" title="contraseña del usuario">
			<span class="<?php if(	!isset($_POST['userPass']) ||
											User::validarPasswords($_POST['userPass'], $_POST['userPass2'])) {
												echo 'oculto ';
											} ?>error userPassErr">el password no es correcto o no coinciden</span>
		</p>

		<p>
			<input	type="submit" value="acceder" />
		</p>
	</form>
	<?php } ?>
</div>