<?php
session_start();
ob_start();
$hasDB = false;
$server = 'localhost';
$user = 'fernando';
$pass = '4316';
$db = 'house_account';
$link = mysql_connect($server,$user,$pass);
if (!is_resource($link)) {   
	$hasDB = false;
	die("Could not connect to the MySQL server at localhost.");
} else {   
	$hasDB = true;
	mysql_select_db($db);
}
?>