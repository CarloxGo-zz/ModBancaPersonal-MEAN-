<?php
// scheme required, here can be multiple origins concatenated by space if using credentials
// Apache Web Server virtual host configuration the following settings
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, sessionId');

// without credentials we can use * for origin
header('Access-Control-Allow-Credentials: *');
header('HTTP/1.1 200 OK', true);

$captionTable = $_POST['tableCaption']; //string
$printHeaderTable = json_decode($_POST['tableHead'])[0]; //Array
$printTable = json_decode($_POST['tableData']); //JSON

//Fix for crappy IE bug in download. 
header("Pragma: no-cache");
header("Expires: 0");

header("Content-type: application/vnd.ms-excel, text/html");
header("Content-Disposition: attachment; filename=$captionTable.xls");
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="content-type" content="application/xhtml+xml; charset=UTF-8" />
	<title><?php echo $captionTable; ?></title>
</head>
<body>
	<table>
		<caption><?php echo $captionTable; ?></caption>
		<thead>
			<tr>
				<?php 
					for ($i=0, $len=count($printHeaderTable); $i < $len; $i++) { 
						echo '<th>'.$printHeaderTable[$i].'</th>';
					}
				 ?>
			</tr>
		</thead>
		<tbody>
			<?php 
				for ($i=0, $lenRows=count($printTable); $i < $lenRows; $i++) {
					echo '<tr>';
					$row = $printTable[$i]; //object
					foreach ($row as $key => $value) {
						echo '<td>'.$value.'</td>';
					}
					echo '</tr>';
				}
			 ?>
		</tbody>
	</table>
</body>
</html>