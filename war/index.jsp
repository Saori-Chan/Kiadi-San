<!DOCTYPE html>
<html ng-app="appGame">
	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no"/>
		<meta name="author" content="Aurore Sancho, Nicolas Paris et Bastien Restif">

		<title>Kiadi-San</title>

		<!-- CSS  -->
		<link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
      	<link href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet" type="text/css">
		<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet" type="text/css"> 
		<link href="css/grayscale.min.css" rel="stylesheet">
		
		<!--  Scripts-->
		<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="/js/grayscale.js"></script>
		<script src="/js/grayscale.min.js"></script>
		<script src="/js/app.js"></script>
		<script src="/lib/angular-google-gapi-1.0.1/dist/angular-google-gapi.min.js"></script>
	</head>
	
	<body>
		<header>
			<nav class="white" role="navigation">
				<div class="nav-wrapper container">
					<ul class="right">
						<!-- BOUTON CONNEXION ET DECONNEXION  -->
						<a class="btn btn-primary rounded" ng-click="login()" ng-show="!user">Sign In</a> 
						<a class="btn btn-primary rounded" ng-click="logout()" ng-show="user">Sign Out</a>
						
					</ul>
				</div>
			</nav>			
		</header>
		
		<main>
			<div ng-view></div>
		</main>
		    
		    
		<footer>
			<p style="display: inline-block;">� 2017 Aurore, Nicolas et Bastien</p>
		</footer>
	</body>
</html>
