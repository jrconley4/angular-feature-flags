var app = angular.module("feature-flags", []);

app.controller("MainCtrl", function ($scope, plunkerConfig) {
  debugger;
  $scope.name = plunkerConfig.whatToGreet;
});

angular.element(document).ready(function () {
  debugger;
  console.log("boot");
  var initInjector = angular.injector(["ng", "feature-flags"]);
  var $http = initInjector.get("$http");
  var ff = initInjector.get("featureFlags");

  $http
    .get("https://localhost:5001/api/FeatureFlags/")
    .then(function (response) {
      app.constant("plunkerConfig", response.data);
      console.log("boot then");
      console.log(response.data);
      angular.bootstrap(document, ["feature-flags"]); //was plunker

      ff.setEnvironment("prod");
      ff.set(response.data);
      let flags = featureFlags.get();
      console.log("ff");
      console.log(flags.featureFlags);
    });
});
