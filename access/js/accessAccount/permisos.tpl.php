<div id="permissionsHouseAccountViews">
	<p>{{mensaje}}</p>
	<p><small>tu cuenta esta registrada con el correo: <i class="idea">{{permisosUsuario['userMail']}}</i></small></p>

	<p><h2>Estos son las cuentas a los que tienes acceso</h2></p>

	<ul>
	    <li ng-repeat-start="permiso in permisosUsuario['userPerms']">
	    	<a href="http://localhost:3000/appAccount?ID={{permiso['ID']}}&KEY={{permiso['Key']}}">
	    		{{permiso['Name']}}</a>
	    </li>
	    <span ng-repeat-end></span>
	</ul>
</div>