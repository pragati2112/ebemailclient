
console.log("App.js loaded");
var myapp = angular.module('myModule',['ui.router', 'ui-notification', 'ngMaterial',]);
//console.log("myModule loaded");
myapp.controller('myController',function($scope,$http,Notification, $stateParams){

    console.log($stateParams);
    console.log("myController loaded");
    $scope.thisEmail = {
        from: { 
                email:""
    },
        to: [
            {
                name: "",
                email: ""
            },
        ],
        cc: [
            {
                name: "",
                email: ""
            },
        ],
        bcc: [
            {
                name: "",
                email: ""
            },
        ],
        subject: "",
        body: "",
    };

    if($stateParams.thisEmail){
        $scope.thisEmail = $stateParams.thisEmail;
    
    }
    $scope.send = function(thisEmail){
        console.log(thisEmail);
        $http({
            method:'POST',
            url:'http://localhost:8888/api/send',
            body: thisEmail,
        }).then(function(response)
        {
            console.log(response);
         
        });
        
    };
    // send();
      
        $scope.saveemail = function (thisEmail) {
            $http({
                method:'POST',
                url:'http://localhost:8888/api/save',
                body: thisEmail,
            })
            .then(function(response)
            {
                console.log(response);
            });
            Notification('Saved succesfully');
        };
});
myapp.controller('draftsController',function($scope,$http,$state){
    console.log("draftsController loaded");
    function draftemails(){  
        $http({ 
            method:'GET',
            url:'http://localhost:8888/api/draft',
          
        }).then(function(response)
        {
            console.log(response);
            $scope.emails = response.data.draftEmails;
        });
    };
    draftemails();

$scope.open=function(email)
{    
    var thisEmail = {
        from:{ 
          email:""
    },
        to: [
            {
                name: "",
                email: ""
            },
        ],
        cc: [
            {
                name: "",
                email: ""
            },
        ],
        bcc: [
            {
                name: "",
                email: ""
            },
        ],
        subject: "",
        body: "",
    };
    $state.go('send', {thisEmail: thisEmail });
}

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
            $scope.emails = response.data.sentEmails;
        });
    };
    sentemails();
});
myapp.config(function($stateProvider,$urlRouterProvider){ 
    $urlRouterProvider.otherwise('/send');
    $stateProvider
        .state('send',{
            url:'/send',
            params: {
                thisEmail: null,
            },
            templateUrl:"view/compose.html",
            controller:'myController',
        })
        .state('draft',{
            url:'/draft',
            templateUrl:"view/drafts.html",
            controller:'draftsController',
        })
         .state('sent',{
            url:'/sent',
            templateUrl:"view/sent.html",
            controller:'sentController',
        })
});









    