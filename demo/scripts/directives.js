angular
  .module("directives", []) //my-app
  .directive("flagA", function () {
    console.log("Flag A directive.");
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">flagA</div>',
      replace: true,
    };
  })
  .directive("messaging", function () {
    console.log("messaging directive.");
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">Messaging</div>',
      replace: true,
    };
  })
  .directive("flagB", function () {
    console.log("Flag b directive.");
    return {
      restrict: "A",
      scope: {},
      template:
        '<div class="panel" ng-class="{selected: selected}" ng-click="selected = !selected;">flagB</div>',
      replace: true,
    };
  })
  .directive("settings", function () {
    console.log("settings directive.");
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
