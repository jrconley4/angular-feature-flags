var app = angular.module("feature-flags", []);

app.controller("MainCtrl", function ($scope, plunkerConfig) {
  debugger;
  console.log("In MainCtrl");
  $scope.name = plunkerConfig[0].flagId;
});
