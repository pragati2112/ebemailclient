
console.log("App.js loaded");
function randomString(){
    var verbs, nouns, adjectives, adverbs, preposition;
    nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
    verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
    adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
    adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
    preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

    function randGen() {
      return Math.floor(Math.random() * 5);
    }

    function sentence() {
      var rand1 = Math.floor(Math.random() * 10);
      var rand2 = Math.floor(Math.random() * 10);
      var rand3 = Math.floor(Math.random() * 10);
      var rand4 = Math.floor(Math.random() * 10);
      var rand5 = Math.floor(Math.random() * 10);
      var rand6 = Math.floor(Math.random() * 10);
      var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
      return content;
    };
    var thisString = sentence();
    return thisString;
};

var myapp = angular.module('myModule',['ui.router', 'ui-notification', 'ngMaterial',]);
//console.log("myModule loaded");
myapp.controller('myController',function($scope,$http,Notification, $stateParams){
    console.log($stateParams);
    console.log("myController loaded");
    $scope.thisEmail = {
        from: { 
                email:"",
            
    },
        to: [
            {
                email: "a@b.com",
                name: "AB",
            },
            {
                email: "c@d.com",
                name: "CD",
            },
        ],
        /* cc: [
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
        ], */
        subject: randomString(),
        text: randomString(),
    };
    if($stateParams.thisEmail){
        $scope.thisEmail = $stateParams.thisEmail;    
    }
    $scope.send = function(thisEmail){
        console.log(thisEmail);
        $http({
            method:'POST',
            url:'http://localhost:8888/api/send',
            data: thisEmail,
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
                data: thisEmail,
            })
            .then(function(response)
            {
                console.log(response);
            });
            console.log(thisEmail);
            // Notification('Saved succesfully');
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
            //console.log(response);
            console.log(response.data);
            $scope.emails = response.data;
        });
    };
    draftemails();

$scope.open=function(thisEmail)
{    
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
            $scope.emails = response.data;
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









    