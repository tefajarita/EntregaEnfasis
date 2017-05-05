/**
 * Created by JARITA on 5/05/2017.
 */
var app = angular.module("myWeather", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "main.html"
        })
        .when("/ClimaA", {
            templateUrl : "ClimaA.html",
            controller:"customersCtrl"
            //controller : "ClimaCtrl"
        })
        .when("/PronosA", {
            templateUrl : "PronosA.html",
            controller : "PronosACtrl"
        });
});
app.service('formatedFunctions', function() {
        this.loadClimateA =function($scope, $http) {
            $http.get("https://www.w3schools.com/angular/customers.php").then(function (response) {
                $scope.myData = response.data.records;
            })};
});




app.controller('customersCtrl', function($scope,$http,formatedFunctions ) {
    formatedFunctions.loadClimateA($scope,$http);

    $scope.paises =["GERMANY","MEXICO","UK","SWEDEN","FRANCE","SPAIN","CANADA",
        "ARGENTINA","SWITZERLAND",  "BRAZIL"];
});