var CLIENT = '';
var BASE = 'https://kiadi-san.appspot.com/_ah/api';

var app = angular.module('quizApp', []);

//var app = angular.module('appGame', ['angular-google-gapi', 'ngRoute', 'ngCookies']);

//Load GAPI into angular
app.run(['$rootScope', '$cookies', 'GApi', 'GData', 'GAuth',
 function($rootScope, $cookies, GApi, GData, GAuth) {

     GApi.load('kiadi-san','v1',BASE).then(
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

		if ($cookies.get("google_auth_id")) {
			GData.setUserId($cookies.get("google_auth_id"));
		}


     $rootScope.login = function(callback) {
 		GAuth.login().then(function(user) {
 			$rootScope.google_user = user;
 			$cookies.put("google_auth_id", user.id);
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
 		$cookies.remove("google_auth_id");
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

app.controller('app', function($scope) {
	  $scope.name = 'Worldd';
	});

app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template/template.html',
		link: function(scope, elem, attrs) {
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.content;
					scope.answer = q.author;
					scope.falseAuthor1 = q.falseAuthor1;
					scope.falseAuthor2 = q.falseAuthor2;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};
			scope.checkAnswer = function() {
				if(!$("input[name='answer']:checked").length) return;

				var ans = $("input[name='answer']:checked").val();

				if(ans == scope.answer) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
				scope.answerMode = false;
			};

			scope.nextQuestion = function() {
				scope.id++;
				scope.getQuestion();
			}

			scope.reset();
		}
	}
});


app.factory('quizFactory', function() {
    var questions = [
      {
      author : 'Jean-Michel',
      category : "Bidon",
      content :'Make America great again', 
      date : '2017-01-24',
      falseAuthor1 : 'Essai',
      falseAuthor2 : 'Essai2'
    }, {
      author : 'Marion Maréchall Lepeine',
      category : "Bidon2",
      content :'Les oiseaux gazouillent',
      date : '2017-01-24',
      falseAuthor1 : 'Essai3',
      falseAuthor2 : 'Essai4'
    }];
    
    return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
  }
});


