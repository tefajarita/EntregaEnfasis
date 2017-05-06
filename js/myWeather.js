/**
 * Created by JARITA on 5/05/2017.
 */
var app = angular.module("myWeather", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "main.html"
        })
        .when("/ClimaA/:city", {
            templateUrl : "ClimaA.html",
            controller:"customersCtrl"
            //controller : "ClimaCtrl"
        })
        .when("/PronosA/:city", {
            templateUrl : "PronosA.html",
            controller : "PronosACtrl"
        });
});
app.directive('userInfo', [function() {
    return {
        restrict: 'E',
        scope:false,
        template:"<input type='text' class='form-control' ng-model='busca' placeholder='Medellin,CO'> " +
                "<button ng-click='loadWeather()' type='submit' class='btn-primary'>Buscar</button>"
    };
}]);
app.factory('userService', function(){
    var factory = {};
        return {
            getWeatherViaHttp: function(city,$http) {
                if(city!=null) {
                     $http.get('http://api.openweathermap.org/data/2.5/weather?q=' +city+'&appid=7be914f05a62d859aa13ac9f6c28c853').then(function(response) {

                         return response.data;
                    });
                }

            },

            data:{}
        }


});
app.service('formatedFunctions', function(userService) {
    this.weather = function(a,$http) {
        return userService.getWeatherViaHttp(a,$http);
    }




});
app.controller('MainCtrl', function($scope,$location,$http,formatedFunctions ) {
    $scope.loadWeather = function(city) {
        $location.url('/ClimaA/' + city);
    };


});

app.controller('customersCtrl', function($scope,$http,$routeParams,formatedFunctions ) {
    $scope.result="Intentando";

            $scope.datos=formatedFunctions.weather($routeParams.city,$http);
             $scope.result="Al menos me ingreso";


});

app.controller('PronosACtrl', function($scope,$http,formatedFunctions ) {
$scope.result="Al menos me ingreso";

});