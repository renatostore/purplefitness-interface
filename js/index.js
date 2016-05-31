(function(){
    "use strict";

    angular.module('login',[
        //dependencies here
    ])

    .controller('LoginController',function($scope){ 
         $scope.save = function(login){
        	if($scope.loginForm.$valid){
                window.location = 'menu.html';                
            }
        }
    });
})();