var app = angular.module("feature-flags", []);

app.controller("MainCtrl", function ($scope, flagServerValues) {
  debugger;
  console.log("In MainCtrl");
  $scope.name = flagServerValues[0].name;
});
