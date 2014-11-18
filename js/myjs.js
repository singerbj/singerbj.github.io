var myApp = angular.module('myApp',[]);

myApp.controller('controller', ['$scope', function($scope) {
  this.c = "hello world!";
}]);
