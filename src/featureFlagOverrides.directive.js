angular.module('feature-flags').directive('featureFlagOverrides', function(featureFlags) {
  return {
    restrict: 'A',
    link: function postLink($scope) {
      $scope.flags = featureFlags.get();

      $scope.isOn = featureFlags.isOn;
      $scope.isOverridden = featureFlags.isOverridden;
      $scope.enable = featureFlags.enable;
      $scope.disable = featureFlags.disable;
      $scope.reset = featureFlags.reset;
      $scope.isOnByDefault = featureFlags.isOnByDefault;
    },
    template: '<div class="feature-flags">' +
      '  <h2 class="feature-flags-heading">Feature Flags</h2>' +
      '  <div id="feature-flag--{{flag.name}}" class="feature-flags-flag" ng-repeat="flag in flags">' +
      '    <div class="feature-flags-name">{{flag.name || flag.name}}</div>' +
      '      <div id="feature-flag--{{flag.name}}--enable" class="feature-flags-switch" ng-click="enable(flag.name)" ng-class="{\'active\': isOverridden(flag.name) && isOn(flag.name)}">ON</div>' +
      '      <div id="feature-flag--{{flag.name}}--disable" class="feature-flags-switch" ng-click="disable(flag.name)" ng-class="{\'active\': isOverridden(flag.name) && !isOn(flag.name)}">OFF</div>' +
      '      <div id="feature-flag--{{flag.name}}--reset" class="feature-flags-switch" ng-click="reset(flag.name)" ng-class="{\'active\': !isOverridden(flag.name)}">DEFAULT ({{isOnByDefault(flag.name) ? \'ON\' : \'OFF\'}})</div>' +
      '    <div class="feature-flags-desc">{{flag.description}}</div>' +
      '  </div>' +
      '</div>',
    replace: true
  };
});
