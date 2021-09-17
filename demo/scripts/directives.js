angular
  .module("my-app")
  .directive("flagA", function () {
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">flagA</div>',
      replace: true,
    };
  })
  .directive("messaging", function () {
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">Messaging</div>',
      replace: true,
    };
  })
  .directive("flagB", function () {
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">flagB</div>',
      replace: true,
    };
  })
  .directive("settings", function () {
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">Settings</div>',
      replace: true,
    };
  });
/*
  .run(function (featureFlags, $http) {
    featureFlags.setEnvironment("prod");
    featureFlags.set($http.get("../data/flags.json"));
  });
 
  .run(function (featureFlags, $http) {
    debugger;
    featureFlags.setEnvironment("prod");
    featureFlags.set($http.get("https://localhost:5001/api/FeatureFlags/"));
    let flags = featureFlags.get();
    console.log("Result from directs.js .run");
    console.log(flags.featureFlags);
  });
   */
