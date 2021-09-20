function FeatureFlags($q, featureFlagOverrides, initialFlags, envParam) {
  var serverFlagCache = {},
    flags = [],
    environment = "prod"; //todo: forcing prod envParam,
  (instance = 0),
    (getCachedFlag = function (name) {
      debugger;
      var isCached =
        serverFlagCache[environment] && serverFlagCache[environment][name];
      console.log(
        "getCachedFlag(" +
          name +
          ") = " +
          isCached +
          "   Environment = " +
          environment
      );
      return isCached;
    }),
    (resolve = function (val) {
      console.log("in resolve");
      var deferred = $q.defer();
      deferred.resolve(val);
      console.log("resolving deferred");
      return deferred.promise;
    }),
    (isOverridden = function (name) {
      var isOver = featureFlagOverrides.isPresent(name);
      console.log("isOverriden(" + name + ") = " + isOver);
      return isOver;
    }),
    (isOn = function (name) {
      debugger;
      var isOnTmp = isOverridden(name)
        ? featureFlagOverrides.get(name) === "true"
        : getCachedFlag(name);
      console.log("isOn(" + name + ") = " + isOnTmp);
      return isOnTmp;
    }),
    (isOnByDefault = function (name) {
      isDef = getCachedFlag(name);
      console.log("isOnByDefault(" + name + ") = " + isDef);
      return isDef;
    }),
    (isEnabledForInstance = function (instances) {
      if (!instances) {
        console.log(
          "isEnabledForInstance(" +
            instances +
            ") = " +
            true +
            " (instances is falsey)"
        );
        return true;
      }
      var isFound = instances.indexOf(instance) !== -1;
      console.log(
        "isEnabledForInstance(" +
          instances +
          ") = " +
          isFound +
          " (instances is truthy)"
      );
      return isFound;
    }),
    (isExpired = function (expiryDate) {
      var now = new Date().toISOString();
      if (!expiryDate) {
        console.log(
          "isExpired(" + expiryDate + ") = false (expiryDate is falsey)"
        );
        return false;
      }
      var isExp = now > expiryDate;
      console.isOnlog("isExpired(" + expiryDate + ") = " + isExp);
      return isExp;
    }),
    (isDefaultEnabled = function (environmentEnabled, flag) {
      var isEnabled =
        environmentEnabled &&
        isEnabledForInstance(flag.instances) &&
        !isExpired(flag.expires);

      console.log(
        "isEnabled(" + environmentEnabled + "," + flag + ") = " + isEnabled
      );
      return isEnabled;
    }),
    (updateFlagsAndGetAll = function (newFlags) {
      console.log("updateFlagsAndGetAll");
      debugger;
      angular.copy(newFlags, flags);
      flags.forEach(function (flag) {
        flag.environments = { prod: true };

        debugger;
        angular.forEach(flag.environments, function (environmentEnabled, env) {
          debugger;
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
    }),
    (updateFlagsWithPromise = function (promise) {
      console.log("updateFlagsWithPromise");
      return promise.then(function (value) {
        return updateFlagsAndGetAll(value.data || value);
      });
    }),
    (get = function () {
      console.log("get: " + flags);
      return flags;
    }),
    (set = function (newFlags) {
      debugger;

      var isArray = angular.isArray(newFlags);
      console.log("SET flags. isArray: " + isArray + "   values: " + newFlags);

      return angular.isArray(newFlags)
        ? resolve(updateFlagsAndGetAll(newFlags))
        : updateFlagsWithPromise(newFlags);
    }),
    (setEnvironment = function (value) {
      console.log("setEnvironment(" + value + ")");
      environment = value;
      featureFlagOverrides.setEnvironment(value);
    }),
    (setAppName = function (value) {
      console.log("setAppName(" + value + ")");
      featureFlagOverrides.setAppName(value);
    }),
    (setInstance = function (value) {
      console.log("setInstance(" + value + ")");
      instance = value;
    }),
    (enable = function (flag) {
      console.log("enable(" + flag + ")");
      featureFlagOverrides.set(flag, true);
    }),
    (disable = function (flag) {
      console.log("disable(" + flag + ")");
      featureFlagOverrides.set(flag, false);
    }),
    (reset = function (flag) {
      console.log("reset(" + flag + ")");
      featureFlagOverrides.remove(flag);
    }),
    //rrc - changed to allow inital load from constant
    (init = function () {
      console.log("init()");
      debugger;
      if (initialFlags) {
        set(initialFlags);
      }
    });

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

angular
  .module("feature-flags") //todo: the code below is called first after the bootstrap
  //the module gets loaded, then the debugger does a lot of hidden steps then this.$get is called.
  .provider("featureFlags", function () {
    debugger;
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

    //note: flagServerValues are being injected here
    this.$get = function ($q, featureFlagOverrides, flagServerValues) {
      //todo: are values being injected here?
      debugger;
      var initValues = flagServerValues || featureFlagOverrides;
      var service = new FeatureFlags(
        $q,
        featureFlagOverrides,
        initValues,
        environment
      );
      if (environment) {
        service.setEnvironment(environment);
      }
      if (appName) {
        service.setAppName(appName);
      }
      return service;
    };
  });
