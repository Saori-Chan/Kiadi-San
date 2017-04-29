var CLIENT = '333884789234-44phppnv1k7m4oh0cctr9st19m79g9b4.apps.googleusercontent.com';
var BASE = 'http://1-dot-kiadi-san.appspot.com/_ah/api';


var app = angular.module('appGame', ['angular-google-gapi', 'ngRoute', 'ngCookies']);
var listHighScore;

// Load GAPI into angular
app.run(['$rootScope', '$cookies', 'GApi', 'GData', 'GAuth',
    function($rootScope, $cookies, GApi, GData, GAuth) {

        GApi.load('tweetentityendpoint','v1',BASE).then(
            function(resp) {
    			console.log('Api: ' + resp.api + ', version: ' + resp.version + ' loaded');
    		},
    		function(resp) {
    			console.log('An error occured while loading api: ' + resp.api + ', resp.version: ' + resp.version);
    		}
        );

		GAuth.setClient(CLIENT);
		GAuth.setScope('https://www.googleapis.com/auth/userinfo.profile');

		GAuth.load();

		GAuth.checkAuth().then(function (user) {
			$rootScope.currentUser = user;
			console.log(user.name + ' is already logged in');
			userName = user.name;
		}, function() {
			console.log('checkAuth() : fail ');
		})


        $rootScope.login = function(callback) {
    		GAuth.login().then(function(user) {
    			console.log(user.name + ' is logged in');
    			userName = user.name;
    			$rootScope.currentUser = user; 
    			if (callback) {
    				callback();
    			}
    		}, function() {
    			console.log('fail');
    		});
    	};

        $rootScope.logout = function() {
            GAuth.logout();
    		$rootScope.google_user = null;
        };

        GAuth.checkAuth().then(
    		function(user) {
    			$rootScope.google_user = user;
                if ($rootScope.auth_callback_success)
                    $rootScope.auth_callback_success();
    		},
    		function() {
                $rootScope.not_logged = true;
    			//console.log('error');
                console.log('not logged');
                if ($rootScope.auth_callback_error)
                    $rootScope.auth_callback_error();
    		}
    	);

        $rootScope.currentGame = null;
	}
]);

/* Home Controller */
app.controller('HomeController', ['$scope', '$location',
    function($scope, $location) {

        $scope.play = function() {

    		if (!$scope.google_user) {
    			$scope.login(function() {
                    $location.path('/categories');
                });
    		} else {
    			$location.path('/categories');
    		}
        };

    }
]);

/* GameController */
app.controller('GameController', ['$rootScope', '$scope', '$routeParams', '$location',
    function($rootScope, $scope, $routeParams, $location) {

        // Redirect if refreshed
        if (!$routeParams.index_round ||
            !$routeParams.question_type ||
            !$rootScope.currentGame) {
            $location.path('/categories');
            return;
        }

        /* Partie Bastien, à reprendre avec http://plnkr.co/hFwV8JHu9J2iDlrKZvps */
    }
]);


/* HighscoresController */
app.controller('HighscoresController', ['$scope', 'GApi' ,function tweetController($scope, GApi) {
	  GApi.executeAuth('tweetentityendpoint', 'listTweetEntity').then(function(resp) {
highscoreentityendpointTweelistHighScoreEntity| [];
		  console.log(resp);
    }, function() {
        console.log('error : listTweet');
    });
	  
	  GApi.executeAuth('highscoreentityendpoint', 'listHighScoreEntity').then(function(resp) {
		  listHighScore = resp.items || [];
        console.log(resp);
    }, function() {
        console.log('error : listHighScore');
    });
	  
}]);

(function($) {
	$.randomize = function(arr){
		for (var j, x, i = arr.length; i; j = parseInt(Math.random()*i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	};
})(jQuery);