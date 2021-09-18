function FeatureFlags($q, featureFlagOverrides, initialFlags) {
  var serverFlagCache = {},
    flags = [],
    environment = "",
    instance = 0,
    getCachedFlag = function (name) {
      return serverFlagCache[environment] && serverFlagCache[environment][name];
    },
    resolve = function (val) {
      var deferred = $q.defer();
      deferred.resolve(val);
      console.log("resolving deferred");
      return deferred.promise;
    },
    isOverridden = function (name) {
      return featureFlagOverrides.isPresent(name);
    },
    isOn = function (name) {
      debugger;
      var isOn = isOverridden(name)
        ? featureFlagOverrides.get(name) === "true"
        : getCachedFlag(name);
      console.log(name + " is on: " + isOn);
      return isOn;
    },
    isOnByDefault = function (name) {
      return getCachedFlag(name);
    },
    isEnabledForInstance = function (instances) {
      if (!instances) {
        return true;
      }
      return instances.indexOf(instance) !== -1;
    },
    isExpired = function (expiryDate) {
      var now = new Date().toISOString();
      if (!expiryDate) {
        return false;
      }
      return now > expiryDate;
    },
    isDefaultEnabled = function (environmentEnabled, flag) {
      return (
        environmentEnabled &&
        isEnabledForInstance(flag.instances) &&
        !isExpired(flag.expires)
      );
    },
    updateFlagsAndGetAll = function (newFlags) {
      console.log("updateFlagsAndGetAll");
      debugger;
      angular.copy(newFlags, flags);
      flags.forEach(function (flag) {
        angular.forEach(flag.environments, function (environmentEnabled, env) {
          if (!serverFlagCache[env]) {
            serverFlagCache[env] = {};
          }
          serverFlagCache[env][flag.name] = isDefaultEnabled(
            environmentEnabled,
            flag
          );
          flag.environments[env] = isOn(flag.name);
        });
      });
      return flags;
    },
    updateFlagsWithPromise = function (promise) {
      console.log("updateFlagsWithPromise");
      return promise.then(function (value) {
        return updateFlagsAndGetAll(value.data || value);
      });
    },
    get = function () {
      console.log("get: " + flags);
      return flags;
    },
    set = function (newFlags) {
      debugger;

      var isArray = angular.isArray(newFlags);
      console.log("SET flags. isArray: " + isArray + "   values: " + newFlags);

      return angular.isArray(newFlags)
        ? resolve(updateFlagsAndGetAll(newFlags))
        : updateFlagsWithPromise(newFlags);
    },
    setEnvironment = function (value) {
      console.log("setEnvironment: " + value);
      environment = value;
      featureFlagOverrides.setEnvironment(value);
    },
    setAppName = function (value) {
      console.log("setAppName: " + value);
      featureFlagOverrides.setAppName(value);
    },
    setInstance = function (value) {
      instance = value;
    },
    enable = function (flag) {
      featureFlagOverrides.set(flag, true);
    },
    disable = function (flag) {
      featureFlagOverrides.set(flag, false);
    },
    reset = function (flag) {
      featureFlagOverrides.remove(flag);
    },
    init = function () {
      if (initialFlags) {
        set(initialFlags);
      }
    };

  init();

  return {
    set: set,
    get: get,
    enable: enable,
    disable: disable,
    reset: reset,
    isOn: isOn,
    isOnByDefault: isOnByDefault,
    isOverridden: isOverridden,
    setEnvironment: setEnvironment,
    setAppName: setAppName,
    setInstance: setInstance,
  };
}

angular.module("feature-flags").provider("featureFlags", function () {
  var initialFlags = [];
  var environment = "prod";
  var appName = "";

  this.setInitialFlags = function (flags) {
    initialFlags = flags;
  };

  this.setEnvironment = function (env) {
    environment = env;
  };

  this.setAppName = function ($appName) {
    appName = $appName;
  };

  this.$get = function ($q, featureFlagOverrides) {
    var service = new FeatureFlags($q, featureFlagOverrides, initialFlags);
    if (environment) {
      service.setEnvironment(environment);
    }
    if (appName) {
      service.setAppName(appName);
    }
    return service;
  };
});
