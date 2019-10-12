//console.log("App.js loaded");
var myapp = angular.module('myModule',['ui.router']);
myapp.controller('myController',function($scope,$http){
    console.log("myController loaded");
    function compose(){
        $http({
            method:'POST',
            url:'http://localhost:8888/api/send'
        }).then(function(response)
        {
            console.log(response);
            $scope.emails = response.data.docs;
        });
    };
    compose();
 
   
});
myapp.controller('draftsController',function($scope,$http, $stateParams){
    // var district = $stateParams.district;
    // console.log(district);
    console.log("draftsController loaded");
    function draftemails(){  
        $http({
            method:'GET',
            url:'http://localhost:8888/api/drafts',
          
        }).then(function(response)
        {
            console.log(response);
            $scope.emails = response.data.docs;
        });
    };
    draftemails();
});

myapp.controller('sentController',function($scope,$http, $stateParams){
    console.log("sentController loaded");
    function sentemails(){  
        $http({
            method:'GET',
            url:'http://localhost:8888/api/sent',
          
        }).then(function(response)
        {
            console.log(response);
            $scope.emails = response.data.docs;
        });
    };
    sentemails();
});
myapp.config(function($stateProvider,$uiRouterProvider){ 
    $uiRouterProvider.otherwise('/send',{
        templateUrl:'compose.html',
        controller:'myController',
    })  
    $stateProvider
        .state('send',{
            url:'/send',
            templateUrl:"compose.html",
            controller:'myController',
        })
        .state('drafts',{
            url:'/drafts',
            templateUrl:"drafts.html",
            controller:'draftsController',
        })
         .state('sent',{
            url:'/sent',
            templateUrl:"sent.html",
            controller:'sentController',
        })






});









    