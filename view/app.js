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

//create a module(ebemailModule)
var ebemailclient = angular.module('ebemailModule',['ui.router', 'ui-notification', 'ngMaterial',]);
// console.log(ebemailclient);

//composecontroller for compose.html file(api calls for send and save an email)
ebemailclient.controller('composeController',function($scope,$http,Notification, $stateParams){
 $scope.thisEmail = {
        from: { 
                email:"",
            
    },
        to: [
            {
                email: "",
                name: "",
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
        text: "",
    };
    
    $scope.addText=function(){
      $scope.thisEmail.to.push({"email":"","name":""});
    }
    $scope.addcc=function(){
        $scope.thisEmail.cc.push({"email":"","name":""});
      }
    $scope.addbcc=function(){
        $scope.thisEmail.bcc.push({"email":"","name":""});
    }

   $scope.sanitizeEmail= function (thisEmail){
        var thisto =thisEmail.to;
        var newto=[];

        var thiscc=thisEmail.cc;
        var newcc=[];

        var thisbcc=thisEmail.bcc;
        var newbcc=[];

        thisto.forEach(function(element){
            if(element.email && element.name !="")
            {
                newto.push(element);
            }
           
        });
        thiscc.forEach(function(element){
            if(element.email && element.name !="")
            {
                newcc.push(element);
            }
        });
        thisbcc.forEach(function(element){
            if(element.email && element.name !="")
            {
                newbcc.push(element);
            }
        });

     if(newto.length>0||newcc.length>0||newbcc.length>0)
     {
        thisEmail.to=newto;
        thisEmail.cc=newcc;
        thisEmail.bcc=newbcc;
        return thisEmail;
     }
     else{
         Notification("filled it properly!");
     }
    };
    
    $scope.cleanEmail= function (thisEmail){
        var thisto =thisEmail.to;
        var newto=[];
        var thiscc=thisEmail.cc;
        var newcc=[];

        var thisbcc=thisEmail.bcc;
        var newbcc=[];

        thisto.forEach(function(element){
            if(element.email=="" && element.name =="")
            {
                
            }else if(element.email != ""){
                newto.push(element);
            }
        });
        thiscc.forEach(function(element){
            if(element.email=="" && element.name =="")
            {
                
            }else if(element.email != ""){
                newcc.push(element);
            }
        });
        thisbcc.forEach(function(element){
            if(element.email=="" && element.name =="")
            {
                
            }else if(element.email != ""){
                newbcc.push(element);
            }
        });

     if(newto.length>0||newcc.length>0||newbcc.length>0)
     {
        thisEmail.to=newto;
        thisEmail.cc=newcc;
        thisEmail.bcc=newbcc;
        return thisEmail;
     }
     else{
         Notification("filled it properly!");
     }

    };

    if($stateParams.thisEmail){
        $scope.thisEmail = $stateParams.thisEmail;    
    }

   //on send button
   //input- thisEmail, expected output-sent succesfully.
    $scope.send = function(thisEmail){
        $http({
            method:'POST',
            url:'http://localhost:8888/api/send',
            data: thisEmail,
        })
        .then(function(response) {
            console.log(response);
         
            if(response!=null)
            {
            Notification("sent!");
            }else{
            Notification("not sent");
            }
        })
        .catch(function(error){
            Notification("Mail not sent!Try another time.");
            console.log(error);       
        })

    };

      //on save button
      //input-thisEmail , expected output- saved successfully.
        $scope.saveemail = function (thisEmail) {
            thisEmail = $scope.cleanEmail(thisEmail);
            console.log(thisEmail);
            $http({
                method:'POST',
                url:'http://localhost:8888/api/save',
                data: thisEmail,
            })
            .then(function(response) {
                console.log(response);
                if(response!=null)
                {
                 Notification('Saved succesfully');
                }else{
                 Notification("not saved");
                }
            })
            .catch(function(error){
                console.log(error);
                Notification("mail not saved!");
            });  
        };
});


//draftscontroller for draft.html file(api call for get all the saved emails)
ebemailclient.controller('draftsController',function($scope,$http,$state,Notification){
    function draftemails(){  
        $http({ 
            method:'GET',
            url:'http://localhost:8888/api/draft',
          
        })
        .then(function(response){
            // console.log(response.data);
            if(response!=null)
            {
             $scope.emails = response.data;
            }else{
            Notification ("Try another time!");
            }
        })
        .catch(function(error){
            console.log(error);
            Notification("Try another time!");
        });
    };
    draftemails();

//function for open button to open the draft-
//input-thisEmail , expected output-thisEmail and send thisEmail to the 'send' state for updation.
$scope.open=function(thisEmail)
{    
    $state.go('send', {thisEmail: thisEmail });
}

});

//sentcontroller for sent.html file(api for get all the sent emails)
//expected output-get all the sent emails data.
ebemailclient.controller('sentController',function($scope,$http,$state,Notification){
    function sentemails(){  
        $http({
            method:'GET',
            url:'http://localhost:8888/api/sent',
          
        })
        .then(function(response)
        {
            console.log(response);
            if(response!=null){
            $scope.emails = response.data;
            }else{
             Notification("try another time!");  
            }
        })
        .catch(function(error){
            console.log(error);
            Notification("try another time!");
        });
    };
    sentemails();
   
 //function for view button(to open the email.)
  $scope.view=function(email)
  {     
      $state.go('viewemail',{thisEmail:email});
  }


//function for delete button(delete an email)
  $scope.delete=function(id)
  { 
      $http({
          method:"DELETE",
          url:'http://localhost:8888/api/delete/'+id,
          
      })
      .then(function(response){
          console.log(response);
          if(response!=null){
           Notification("Deleted");   
          }else{
         Notification("Mail is not deleted!");   
          }
      })
      .catch(function(error){
          console.log(error);
          Notification("Mail is not deleted!"); 
      });
    sentemails();
 };

});

//viewemailcontroller for viewemail.html file
ebemailclient.controller('viewemailController',function($scope,$state,$stateParams){
   $scope.thisEmail = {
        from: { 
                email:"",
            
    },
        to: [
            {
                email: "",
                name: "",
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
        text: "",
    };
    console.log($stateParams.thisEmail);
    $scope.thisEmail = $stateParams.thisEmail; 

 //fuction for back button
  $scope.back=function()
  {
      $state.go('sent');
  }
});


 //Routing
ebemailclient.config(function($stateProvider,$urlRouterProvider){ 
    $urlRouterProvider.otherwise('/send');   //if url is not matched with given urls then redirect to the 'send' state. 
    $stateProvider                         
        .state('send',{
            url:'/send',
            params: {
                thisEmail: null,
            },
            templateUrl:"view/compose.html",
            controller:'composeController',
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
        .state('viewemail',{
            url:'/viewemail',
            params:{
              thisEmail:'email',
            },
            templateUrl:"view/viewemail.html",
            controller:'viewemailController'
        })
});








    