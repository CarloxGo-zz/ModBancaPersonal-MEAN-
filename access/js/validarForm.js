var printError = function($nombre, textError){
	var label = document.getElementsByClassName($nombre.name+"Err")[0];
	label.innerText = textError;
	label.classList.remove("oculto");
};

// VALIDACION FORMULARIOS
var validarNombre = function($nombre){
	if( $nombre.value === "" ){
		printError($nombre, "Rellenar Nombre de Usuario.");
	}
	else if( !$nombre.value.match("[a-zA-Z0-9]{4,25}") ){
		printError($nombre, "Te pedimos un nombre entre 4 y 25 letras o numeros");
	}
	else return true;
};

var validarEmail = function($email){
	if( $email.value === ""){
		printError($email, "Rellenar Email.");
	} else if ( !$email.value.match("^[a-zA-Z0-9]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-validarEmail9.-]+[a-zA-Z0-9]+.[a-z]{2,4}$") ){
		printError($email, "Email incorrecto.");
	} else {
		return true;
	}
};

var validarPasswords = function($pass1, $pass2) {
	var errText = "";
	if( $pass1.value === "" ){
		errText += "Rellenar Password.";
	} else if ( !$pass1.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{1,}$/) ){
		errText += "Password incorrecto\nUN Numero, UNA letra Mayuscula y UNA Minuscula.";
	} else {
		if( $pass1.value.length < 4 )
			errText += "Tu password es MUY CORTO\n(Minimo 4 digitos).";
		if( $pass1.value.length > 10 )
			errText += "Tu password es MUY LARGO\n(Máximo 10 digitos).";
		if( $pass1.value !== $pass2.value ) errText += "\nNo coinciden los passwords.";
	}
	printError($pass1, errText);

	return ( errText !== "" ) ?  false : true ;
};

var validar = function($nombre, $email, $pass1, $pass2) {
	// es importante el comparador de cortocircuito, debemos validar TODAS las funcciones para recuperar el valor de los errores
	if( validarNombre($nombre) === true & validarEmail($email) === true & validarPasswords($pass1, $pass2) === true ) return true;
	else return false;
};

var validarLogin = function($email, $pass) {
	// es importante el comparador de cortocircuito, debemos validar TODAS las funcciones para recuperar el valor de los errores
	if( validarEmail($email) === true & validarPasswords($pass, $pass) === true ) return true;
	else return false;
};

var isEmpty = function (str) {
  return (!str || 0 === str.length);
};