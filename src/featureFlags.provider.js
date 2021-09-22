function logIt(source, key, value, note) {
  var msg = source + "-> key: " + key + "; value: " + value;
  if (note) msg = msg + "; note: " + note;
  console.log(msg);
}

function FeatureFlags($q, featureFlagOverrides, initialFlags, envParam) {
  var serverFlagCache = {},
    test = 1,
    flags = [],
    environment = "prod"; //todo: forcing prod envParam,
  (tenantName = "IN"),
    (localStoragePrefix = tenantName + ".hrc.ff." + "."),
    (instance = 0),
    (resolve = function (val) {
      var deferred = $q.defer();
      deferred.resolve(val);
      logIt("resolve", "val", val);
      return deferred.promise;
    }),
    (getCachedFlag = function (name) {
      var cacheValue =
        serverFlagCache[environment] && serverFlagCache[environment][name];
      logIt(
        "getCachedFlag",
        "cacheValue",
        cacheValue,
        ". Env = " + environment
      );
      return cacheValue;
    }),
    (isOverridden = function (name) {
      var isOver = featureFlagOverrides.isPresent(name);
      logIt("isOverriden", "has override", isOver);
      return isOver;
    }),
    (isOn = function (name) {
      var isOnTmp = isOverridden(name)
        ? featureFlagOverrides.get(name) === "true"
        : getCachedFlag(name);
      logIt("isOn", "isOnTmp", isOnTmp);
      return isOnTmp;
    }),
    (isOnByDefault = function (name) {
      isDef = getCachedFlag(name);
      logIt("isOnByDefault", "isOnByDefault", isOnByDefault);
      return isDef;
    }),
    (isEnabledForInstance = function (instances) {
      if (!instances) {
        logIt(
          "isEnabledForInstance",
          "instances",
          "true",
          " (instances is falsey)"
        );
        return true;
      }
      var isFound = instances.indexOf(instance) !== -1;
      logIt(
        "isEnabledForInstance",
        "instance found",
        isFound,
        " (instances is truthy)"
      );
      return isFound;
    }),
    (isExpired = function (expiryDate) {
      logIt("isExpired", "isExpired", "not using expiry dates");
      return false; // we are not using expiry dates
      var now = new Date().toISOString();
      if (!expiryDate) {
        logIt("isExpired", "isExpired", "no expiry date");
        return false;
      }
      var isExp = now > expiryDate;
      logIt("isExpired", "isExp", isExp, expiryDate);
      return isExp;
    }),
    (isDefaultEnabled = function (environmentEnabled, flag) {
      var isEnabled =
        environmentEnabled &&
        isEnabledForInstance(flag.instances) &&
        !isExpired(flag.expires);
      logIt("isDefaultEnabled", "isDefaultEnabled", isEnabled);
      return isEnabled;
    }),
    (updateFlagsAndGetAll = function (newFlags) {
      angular.copy(newFlags, flags);
      flags.forEach(function (flag) {
        flag.environments = { prod: true }; //forcing prod environment

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
      logIt("updateFlagsAndGetAll", "flags", newFlags);
      return flags;
    }),
    (updateFlagsWithPromise = function (promise) {
      logIt("updateFlagsWithPromise", "promise", promise);
      return promise.then(function (value) {
        return updateFlagsAndGetAll(value.data || value);
      });
    }),
    (get = function () {
      logIt("get", "flags", flags);
      return flags;
    }),
    (set = function (newFlags) {
      var isArray = angular.isArray(newFlags);
      logIt("set", "isArray", isArray, " values: " + newFlags);

      return angular.isArray(newFlags)
        ? resolve(updateFlagsAndGetAll(newFlags))
        : updateFlagsWithPromise(newFlags);
    }),
    (setEnvironment = function (value) {
      logIt("setEnvironment", "value", value);
      environment = value;
      featureFlagOverrides.setEnvironment(value);
    }),
    (setAppName = function (value) {
      logIt("setAppName", "value", value);
      featureFlagOverrides.setAppName(value);
    }),
    (setInstance = function (value) {
      logIt("setInstance", "value", value);
      instance = value;
    }),
    (enable = function (flag) {
      logIt("enable", "flag", flag);
      featureFlagOverrides.set(flag, true);
    }),
    (disable = function (flag) {
      logIt("disable", "flag", flag);
      featureFlagOverrides.set(flag, false);
    }),
    (reset = function (flag) {
      logIt("reset", "flag", flag);
      featureFlagOverrides.remove(flag);
    }),
    (localStorageAvailable = function () {
      try {
        localStorage.setItem("featureFlags.availableTest", "test");
        localStorage.removeItem("featureFlags.availableTest");
        return true;
      } catch (e) {
        return false;
      }
    }),
    (prefixedLocalStorageKeyFor = function (flagName) {
      var fullName = localStoragePrefix + flagName;
      logIt("prefixedLocalStorageKeyFor", "flagName", fullName);
      return fullName;
    }),
    (setLocal = function (value, flagName) {
      var isLocalAvailable = localStorageAvailable;
      logIt(
        "setLocal",
        "flagName",
        value,
        "Local available = " + isLocalAvailable
      );
      if (isLocalAvailable) {
        localStorage.setItem(prefixedLocalStorageKeyFor(flagName), value);
      }
    }),
    (getLocal = function (flagName) {
      var value = null;

      if (localStorageAvailable) {
        value = localStorage.getItem(prefixedLocalStorageKeyFor(flagName));
      }
      logIt(
        "getLocal",
        "flagName",
        value,
        "Local available = " + isLocalAvailable
      );
      return value;
    }),
    (removeLocal = function (flagName) {
      logIt(
        "removeLocal",
        "flagName",
        "",
        "Local available = " + isLocalAvailable
      );
      if (localStorageAvailable) {
        localStorage.removeItem(prefixedKeyFor(flagName));
      }
    }),
    //rrc - changed to allow inital load from constant
    (init = function () {
      logIt("init", "initialFlags", initialFlags);
      if (initialFlags) {
        set(initialFlags);
      }
    });

  init();

  //todo: tidy this up
  return {
    set: set,
    get: get,
    //enable: enable,
    //disable: disable,
    //reset: reset,
    isOn: isOn,
    //isOnByDefault: isOnByDefault,
    //isOverridden: isOverridden,
    setEnvironment: setEnvironment,
    //setAppName: setAppName,
    //setInstance: setInstance,
    localStorageAvailable: localStorageAvailable, //todo implement local?
    setLocal: setLocal,
    getLocal: getLocal,
    removeLocal: removeLocal,
  };
}

angular
  .module("feature-flags") //todo: the code below is called first after the bootstrap
  //the module gets loaded, then the debugger does a lot of hidden steps then this.$get is called.
  .provider("featureFlags", function () {
    if (false) debugger;
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
