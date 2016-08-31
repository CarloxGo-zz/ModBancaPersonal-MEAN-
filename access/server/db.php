<?php
// INTERACCION CON LA BD
class DB{
   private $host;
	private $db;
	private $username;
	private $password;
	private $pdo;

	public function __construct($host, $db, $user, $pass){
		$this->host = $host;
	    $this->db = $db;
	    $this->username = $user;
	    $this->password = $pass;
	    $conStr = "host={$this->host};dbname={$this->db}";

		//evitamos la salida de errores por pantalla del cliente que envia apache
		if ( ! $this->pdo = @new PDO( "mysql:".$conStr, $this->username, $this->password) )
			throw new PDOException("Error de connector PDO a BBDD /");

		$this->pdo->query('SET NAMES \'utf8\'');
		$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	public function checkRegister($tupla, $field, $data, $dataType){
		$sql = "SELECT * from $tupla where $field = '$data';";

		$resultFamilia = $this->pdo->query($sql);
		while ($row = $resultFamilia->fetch(PDO::FETCH_OBJ)) {
			throw new PDOException("Un usuario ya esta registrado con ese ".$dataType);
		}

		$resultFamilia = null;//cerramos buffer de peticion
	}

	public function checkLogin( $useMail, $userPass ){
		$sql = "SELECT * FROM users WHERE userMail = '$useMail' AND userpassword = '$userPass';";

		$resultFamilia = $this->pdo->query($sql);
		$resultFamilia = $this->pdo->query('SELECT FOUND_ROWS()'); 
		$rowCount = (int) $resultFamilia->fetchColumn(); 
		
		$resultFamilia = null;//cerramos buffer de peticion
		if ( $rowCount == 0 ) {
			throw new PDOException("email o contraseña no validos");
		}

	}

	public function insert($tupla, $arrData){
		$qData = "";
		foreach ($arrData as $index => $value) {
			//concatenamos valores para la query
			if( !empty($value) ){
				$qData .= ($index == 0) ? "'$value'" : ", '$value'";
			}
		}
		$sql = "INSERT INTO $tupla (username, userpassword, userMail) VALUES ($qData);";

		if( !@$this->pdo->query($sql) )
			throw new PDOException("Error al insertar usuario /");
	}

}
 ?>