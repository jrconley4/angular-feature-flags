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
  })
  .run(function (featureFlags, $http) {
    featureFlags.setEnvironment("prod");
    featureFlags.set($http.get("../data/flags.json"));
  });
