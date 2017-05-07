/**
 * Created by JARITA on 5/05/2017.
 */
'use strict';
var app = angular.module('myWeather', ['ngRoute',"iso-3166-country-codes"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "main.html"
        })
        .when("/ClimaA/:city", {
            templateUrl : "ClimaA.html",
            controller:"customersCtrl",
            //controller : "ClimaCtrl"
        })
        .when("/PronosA/:city", {
            templateUrl : "PronsA.html",
            controller : "PronosACtrl"
        });
});
//utilizo una directiva para mostrar el pronostico del tiempo
//utilizo factory y service para invocar el clima actual
app.factory('userService', function(){
    var factory = {};
        return {
            getWeatherViaHttp: function(city,$http) {

                if(!factory[city]) {
                     factory[city]=$http.get('http://api.openweathermap.org/data/2.5/weather?q=' +city+'&appid=7be914f05a62d859aa13ac9f6c28c853').then(function(response) {
                         console.log(response);
                         return response.data;
                    });
                }

               return factory[city];
            },

            date:function (fecha) {
                var sec = fecha;
                var date = new Date(sec * 1000);
                return factory=date;
            },

            temperature:function (temp) {
                var cel = temp - 273.15;
                return factory=cel;
            },
            getWeatherForest: function(city,$http) {

                if(!factory[city]) {
                    factory[city]=$http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' +city+'&appid=7be914f05a62d859aa13ac9f6c28c853&cnt=7').then(function(response) {
                        console.log(response);
                        return response.data.list;
                    });
                }

                return factory[city];
            }

        }


});
app.directive('weatherPanel',['$http','$routeParams', function ($http,$routeParams) {
    //noinspection JSDuplicatedDeclaration
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            control:'='
        },

            templateUrl: 'Plantilla_Directiva.html',

        link: function(scope, element, attrs) {
                var city=$routeParams.city;
                alert(city);

            $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' +city+'&appid=7be914f05a62d859aa13ac9f6c28c853&cnt=7').then(function(response) {
               scope.useDayForecast=response;

                scope.getFechaDay =function (fecha) {
                    return formatedFunctions.date(fecha);
                }


                // Get icon image url
                scope.getIconImageUrl = function(iconName) {
                    return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
                };

                scope.parseDate = function (time) {
                    return new Date(time * 1000);
                };

                scope.getTemperatura = function (temp) {
                   return Math.round(formatedFunctions.temperature(temp));
                };


            });
        }
    }
}]);

app.service('formatedFunctions', function(userService) {
    this.weather = function(a,$http) {
        return userService.getWeatherViaHttp(a,$http);


    }

    this.date =function (fecha) {
        return userService.date(fecha);
    }

    this.temperature =function (temp) {
        return userService.temperature(temp);
    }

    this.weatherDay=function (a,$http) {
        return userService.getWeatherForest(a,$http);
    }



});
app.controller('MainCtrl', function($scope,$location,$http,formatedFunctions ) {
    $scope.loadWeather = function(city) {
        $location.url('/PronosA/' + city);
    };
});
app.controller('PronosACtrl', function($scope,$routeParams, $rootScope, $location) {
    alert( $routeParams['city']);
    $scope.PronosA={};


});
app.controller('customersCtrl', function($scope,$http,$routeParams,ISO3166 ,formatedFunctions ) {
    var ejec;
    ejec=formatedFunctions.weather($routeParams.city,$http);

    ejec.then(function (factory) {
        $scope.nombre =factory.name;
        $scope.icon="http://openweathermap.org/img/w/"+factory.weather[0].icon+".png";
        $scope.arreglos=factory;
        $scope.ciudadCode = factory.sys.country;
        $scope.temperatura = Math.round(formatedFunctions.temperature(factory.main.temp))+"°C";
        $scope.higth = Math.round(formatedFunctions.temperature(factory.main.temp_max))+"°C";
        $scope.low = Math.round(formatedFunctions.temperature(factory.main.temp_min))+"°C";
        var fecha =formatedFunctions.date(factory.sys.sunset);
        $scope.fecha=fecha;

    });

});

