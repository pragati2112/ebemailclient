//console.log("App.js loaded");
var myapp = angular.module('myModule',['ui.router']);
myapp.controller('myController',function($scope,$http){
    console.log("myController loaded");
    function loadSchools(){
        $http({
            method:'GET',
            url:'http://localhost:4202/api/schools'
        }).then(function(response)
        {
            console.log(response);
            $scope.schools = response.data.docs;
        });
    };
    loadSchools();
    function loaddetails(){  
        $http({
            method:'DELETE',
            url:'http://localhost:4202/api/schools/'+district,
          
        }).then(function(response)
        {
            console.log(response);
            $scope.details = response.data.docs;
        });
    };
    //loaddetails();
});
myapp.controller('districtController',function($scope,$http, $stateParams){
    var district = $stateParams.district;
    console.log(district);
    console.log("districtController loaded");
    function loaddetails(){  
        $http({
            method:'GET',
            url:'http://localhost:4202/api/schools/' + district,
          
        }).then(function(response)
        {
            console.log(response);
            $scope.details = response.data.docs;
        });
    };
    loaddetails();
});

myapp.config(function($stateProvider){   
    $stateProvider
        .state('schools',{
            url:'/schools',
            templateUrl:"schools.html",
            controller:'myController',
        })
        .state('district',{
            url:'/schools/:district',
            templateUrl:"district.html",
            controller:'districtController',
        })
});









    