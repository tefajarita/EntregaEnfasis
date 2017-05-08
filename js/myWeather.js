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
                        console.log(response.data.list);
                        return response.data;
                    });
                }

                return factory[city];
            }

        }


});
//utilizo una directiva para mostrar el pronostico del tiempo
app.directive('weatherPanel',[function () {
    //noinspection JSDuplicatedDeclaration
    return {
        restrict: 'EA',
        replace:true,
        transclude: true,
        scope:false
        ,
        templateUrl: 'Plantilla_Directiva.html'
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
    $('body').click(function(event) {

        var log = $('#log');

        if($(event.target).is('#1')) {
            document.getElementById('log').setAttribute("name","1");
        } else if ($(event.target).is('#2')) {
            document.getElementById('log').setAttribute("name","2");
        }
    });

    $scope.loadWeather = function(city) {
       var element1 = document.getElementById('log').getAttribute("name");
       var buscar = document.getElementById('busca').value;
       alert(buscar);
        if(element1 === "1" && buscar !=null){
            $location.url('/ClimaA/' + city);
        }else if(element1 === "2" && buscar !=null){
            $location.url('/PronosA/' + city);
        }else if(buscar===null){
            alert("Ingresa una ciudad, para poder buscar el clima ó el pronostico");
        }

    };





});
app.controller('PronosACtrl', function($scope,$routeParams, $rootScope, $location,$http,ISO3166,formatedFunctions) {
    var city=$routeParams['city'];
    var ejec;
    ejec=formatedFunctions.weatherDay(city,$http);

    ejec.then(function (factory) {
        $scope.forecast = factory;
        $scope.useDayForecasts = factory.list;
        $scope.getTemperatura = function (temp) {
            return Math.round(temp - 273.15);
        };
        // Get icon image url
        $scope.getIconImageUrl = function (iconName) {
            return (iconName ? 'http://openweathermap.org/img/w/' + iconName + '.png' : '');
        };

        $scope.parseDate = function (time) {
            return new Date(time * 1000);
        }
    });


});
app.controller('customersCtrl', function($scope,$http,$routeParams,ISO3166 ,formatedFunctions ) {
    var ejec;
    var city=$routeParams['city'];

    ejec=formatedFunctions.weather(city,$http);

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

