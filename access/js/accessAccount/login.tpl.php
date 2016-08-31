<div id="loginHouseAccountViews">
	<p><h2>accede a tus <span class="noBreak">cuentas de usuario</span></h2></p>
	<p class="errorServer">{{errorServer}}</p>	

	<?php
	if(	isset($_POST['userMail']) &&
			User::checkUser( $_REQUEST['userMail'], $_REQUEST['userPass'] ) ){
			//Cargar el mismo php que si estuvieramos desconectados de javascript
			include_once('server/loginRegisterAccess.php');
			//ALERTA: aqui se imprimiran el objeto de permisos
		
	}else{ ?>

	<form action="<?php $_SERVER['REQUEST_URI'] ?>" name="formLoginApp"
				post-access data-access="login"
				method="POST" novalidate>

		<input type="hidden" name="access" value="login" />

		<p>
			<label for="emailUsuario">e-mail</label> :
			<input	type="mail" name="userMail" id="emailUsuario"
						ng-model="usuario.userMail"
						title="Tu correo electronico de hotmail, gmail, yahoo"
						placeholder="usuarioEmail@dominio.com"
						value="<?php if(isset($_POST['userMail'])) echo $_POST['userMail']; ?>" />
			<span class="<?php if(	!isset($_POST['userMail']) ||
											User::validarEmail($_POST['userMail']) ) {
												echo 'oculto ';
											}?>error userMailErr">Email incorrecto.</span>
		</p>

		<p>
			<label for="passUsuario">contraseña</label> :
			<input	type="password" name="userPass"
						ng-model="usuario.userPass"
						class="userPass" id="passUsuario"
						placeholder="*****" title="contraseña del usuario"
						value="<?php if(isset($_POST['userPass'])) echo $_POST['userPass']; ?>" />
			<span class="<?php if(	!isset($_POST['userPass'] ) ||
											User::validarPasswords( $_POST['userPass'], $_POST['userPass2'] )	){
												echo 'oculto '; }?>error userPassErr">el password no es correcto o no coinciden</span>
		</p>
		
		<p>
			<input type="submit" value="acceder" />
		</p>

	</form>
	<?php } ?>
</div>