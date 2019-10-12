//console.log("App.js loaded");
var myapp = angular.module('myModule',['ui.router'],['ui-notification']);
myapp.controller('myController',function($scope,$http,Notification){
    console.log("myController loaded");
    $scope.send = function(thisEmail){
        $http({
            method:'POST',
            url:'http://localhost:8888/api/send'
        }).then(function(response)
        {
            console.log(response);
            // $scope.emails = response.data.docs;
        });
    };
    //send();
    $scope.save=  function save(){
    $scope.saveemail = function () {
    $http.post('/save', { thisEmail:$scope.thisEmail })
            .success(onSuccess)
            .error(onError);
    Notification.success('Saved succesfully');
    };
   }
   save();
   
});
myapp.controller('draftsController',function($scope,$http, $stateParams){
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

myapp.controller('sentController',function($scope,$http){
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
myapp.config(function($stateProvider,$urlRouterProvider){ 
    $urlRouterProvider.otherwise('/send');
      
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









    