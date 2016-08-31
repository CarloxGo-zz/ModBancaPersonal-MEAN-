<?php
include_once "user.php"; 
// POST: userName: '', userMail: '', userPass: '', access: '';
if( isset($_REQUEST['access']) ){
	$user = new User();
	$user->connectUserDB("localhost", "house_account", "fernando", "4316");
	
	if ( $_REQUEST['access'] == "register" ) {
		///////////////////////////////////////////////////////////////////////////
		//REGISTRO NUEVO USUARIO                                               //
		// 1- comprobar que no hay un email o usuario en el sistema 			  //
		// 2- dar de alta a un nuevo usuario                                   //
		// 3- añadir un permiso especifico de usuario y a rol ('All Users')    //
		// 4- devolver permisos a la vista ($routeProvider)						  //
		///////////////////////////////////////////////////////////////////////////
		try{
			$user->checkUserDB($_REQUEST['userMail'], $_REQUEST['userName']); // 1
			$user->addUserDB($_REQUEST['userName'], $_REQUEST['userPass'], $_REQUEST['userMail']); // 2
			$user->addPermissionACL($_REQUEST['userMail'], $_REQUEST['userName']); // 3
		} catch (Exception $e) {
			print json_encode( ["error" => $e->getMessage()] );
			exit();
		}

	} else if ( $_REQUEST['access'] == "login" ) {
		////////////////////////////////////////////////////////
		// LOGIN USARIO SISTEMA                             //
		// 1- comprobar usuario y contraseña                //
		// 2- devolver permisos a la vista ($routeProvider) //
		////////////////////////////////////////////////////////
		try{
			$user->checkLogin( $_REQUEST['userMail'], $_REQUEST['userPass']); //1
		} catch (Exception $e) {
			print json_encode( ["error" => $e->getMessage()] );
			exit();
		}
	}

		// recuperar los permisos de usuario segun la ACL
		$userPerms = $user->getUserPermissionACL( $_REQUEST['userMail'] );
		
		//obtener el nombre de usuario para mostrarlo en el login o en el el nuevo registro
		$userCompleteName = $user->getUserName( $_REQUEST['userMail'] );
		
		//4º || 2º : devolver permisos 
		print json_encode( array(	"userPerms"=>$userPerms,
											"userCompleteName"=>$userCompleteName,
											"userMail"=>$_REQUEST['userMail'])
								);
}else{ ?>
	<p>Te has colado, Esta pagina es <strong>solo de acceso o registro a la plataforma</strong></p>
	<p><a href="http://localhost/houseAccount/access">Accede a nuestros servicios</a></p>	
<?php } ?>
