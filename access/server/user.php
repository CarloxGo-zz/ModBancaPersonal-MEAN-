<?php
// INTERACCION DEL REGISTRO DE USUARIO
include_once "db.php";
include("db.acl.php"); 
include("class.acl.php");
class User{
	private $db;

	public static function validarNombre($nombre){
	    return strlen($nombre) > 4;
	}

	public static function validarEmail($email){
	    return preg_match("/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i", $email);
	}

	public static function validarPasswordPatter($pass){
		return preg_match("/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{1,}$/", $pass);	
	}

	public static function validarPasswords($pass1, $pass2) {
	    return $pass1 == $pass2 && strlen($pass1) > 5;
	}


	public static function checkUser($useName, $userMail, $userPass1, $userPass2){
		if( self::validarNombre($useName) && self::validarEmail($userMail)
	        && self::validarPasswords($userPass1, $userPass2) ) return true;
		else  return false;
		// throw new Exception("Error algunos datos estan vacios", 1);
	}

	public static function checkUserLogin($userMail, $userPass){
		if( self::validarEmail($userMail) && self::validarPasswordPatter($userPass) ) return true;
		else  return false;
		// throw new Exception("Error algunos datos estan vacios", 1);
	}



	//crear conexion a BD
	public function connectUserDB($serverHost, $schemaDB, $userDB, $passDB){
		$this->db = new DB($serverHost, $schemaDB, $userDB, $passDB);
	}

	//comprobar usuario
	public function checkUserDB($useMail, $userName){
		$this->db->checkRegister( "users", "userMail", $useMail , "correo electronico");
		$this->db->checkRegister( "users", "username", $userName, "nombre de usuario");
	}

	public function checkLogin($useMail, $userPass){
		$this->db->checkLogin( $useMail, $userPass );
	}

	// añadir usuarios en la bbdd con control de errrores
	public function addUserDB($userName, $userPass, $useMail){
		$this->db->insert( "users", array($userName, $userPass, $useMail) );
	}

	//añadir permisos al usuario
	public function addPermissionACL($useMail, $userName){
		//crear un permiso para el usuario
		//ACL SYSTEM: Admin Home -> Manage Permissions -> New Permission (Name+key) -> Submit
		$permName = $userName.' user Account';
		$strSQL1 = sprintf("REPLACE INTO `permissions` SET `permName` = '%s', `permKey` = '%s'",
								$permName, $useMail);
		mysql_query($strSQL1);

		//asignas el permiso al usuario
		//ACL SYSTEM: Admin Home -> Manage Users -> $userName -> manage permissions -> $permName (Allow) -> submit
		$sqlIDUser = mysql_fetch_assoc( mysql_query("SELECT * FROM users WHERE userMail = '$useMail' LIMIT 1") );
		$sqlIDPerm = mysql_fetch_assoc( mysql_query("SELECT * FROM permissions WHERE permKey = '$useMail' LIMIT 1") );
		$valuePerm = 1;
		$strSQL2 = sprintf("REPLACE INTO `user_perms` SET `userID` = %u, `permID` = %u, `value` = %u, `addDate` = '%s'",
								$sqlIDUser['ID'], $sqlIDPerm['ID'], $valuePerm, date("Y-m-d H:i:s"));
		mysql_query($strSQL2);

		//asignas el permiso para los 'roles de usuario' - All Users
		//ACL SYSTEM: Manage Role: (All Users) -> (Allow) -> Submit
		$sqlIDRole = mysql_fetch_assoc( mysql_query("SELECT * FROM roles WHERE roleName = 'All Users' LIMIT 1") );
		$strSQL3 = sprintf(	"REPLACE INTO `role_perms` SET `roleID` = %u, `permID` = %u, `value` = %u, `addDate` = '%s'",
									$sqlIDRole['ID'], $sqlIDPerm['ID'], $valuePerm, date ("Y-m-d H:i:s"));
		mysql_query($strSQL3);
	}

	public function getUserPermissionACL( $useMail ){
		$strSQL = "SELECT * FROM users WHERE userMail = '$useMail' LIMIT 1";
		$userID = mysql_fetch_assoc( mysql_query($strSQL) )['ID'];
		$userACL = new ACL($userID);
		$aPerms = $userACL->getAllPerms('full');

		$arrUserPerm = array();
		foreach ($aPerms as $k => $v){
			if ($userACL->hasPermission($v['Key']) === true) {
				$arrUserPerm[] = $v; //devolvemos solo los permisos del usuario 
			}
		}
		return $arrUserPerm;
	}

	public function getUserName ( $useMail ){
		$strSQL = "SELECT * FROM users WHERE userMail = '$useMail' LIMIT 1";
		$userName = mysql_fetch_assoc( mysql_query($strSQL) )['firstName'];
		$userSurname = mysql_fetch_assoc( mysql_query($strSQL) )['lastName'];

		//al usuario se le reconocera por su nombre y apelido cuando a traves de la plataforma rellene  sus credenciales
		if( $userSurname == "" ){
			$strSQL = "SELECT * FROM users WHERE userMail = '$useMail' LIMIT 1";
			return  mysql_fetch_assoc( mysql_query($strSQL) )['username'];
		}

		return $userName. " " .$userSurname;
	}
}

 ?>