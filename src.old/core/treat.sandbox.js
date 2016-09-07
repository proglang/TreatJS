/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2015, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */
(function(TreatJS) {

  var error = TreatJS.error;
  var violation = TreatJS.violation;

  var decompile = TreatJS.decompile;

  var logoutput = TreatJS.output;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.sandbox) {
      logoutput.log(logoutput.SANDBOX, msg, target);
    }
  }

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Verbose.statistic) TreatJS.Statistic.inc(key);
  }

  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  var cache =  new WeakMap();

  /** wrap(target)
   *
   * Wraps a target object.
   *
   * @param target Object
   * @param global, Sandbox Global 
   * @whitelist, list of values allowed objects
   * @return Membrane Reference/ Proxy 
   */
  function wrap(target, global, whitelist) { 
    log("wrap");
    count(TreatJS.Statistic.MEMBRANE);

    // if target is primitive value, return target
    if (target !== Object(target)) {
      return target;
    }

    // if target is listed, return target
    if (whitelist.has(target)) {
      log("whitelist hit", target);
      return target;
    } else {
      log("whitelist miss", target);
    }

    // pass-through of Contracts   
    if(TreatJS.Config.contractPassThrough) {
      if(target instanceof TreatJS.Core.Contract) {
        return target;
      }
    }

    if(cache.has(target)) {
      return cache.get(target);
    } else {
      var membraneHandler = new Membrabe(global, whitelist);

      // mirrors contarcts from target
      // to support lax/picky/indy semantics
      var newtarget = TreatJS.mirrorObject(target);
      var proxy = new Proxy(newtarget, membraneHandler);

      cache.set(target, proxy);

      return proxy;
    }
  }

  /** Membrabe(global)
   * Implements a membrane to evaluate functions in a sandbox
   *
   * @param, the sandboxs global object
   */
  function Membrabe(global, whitelist) {
    this.getOwnPropertyDescriptor = function(target, name) {
      log("getOwnPropertyDescriptor", name);
      var desc = Object.getOwnPropertyDescriptor(target, name);
      for(var property in desc) {
        desc[property] =  wrap(desc[property], global, whitelist);
      }
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      log("getOwnPropertyNames", "");
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      log("getPrototypeOf", "");
      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      log("defineProperty", name);
      return Object.defineProperty(target, name, desc);
    };
    this.deleteProperty = function(target, name) {
      log("deleteProperty", name);
      return delete target[name];
    };
    this.freeze = function(target) {
      log("freeze", "");
      return Object.freeze(target);
    };
    this.seal = function(target) {
      log("seal", "");
      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      log("preventExtensions", "");
      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      log("isFrozen", name);
      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      log("isSealed", "");
      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      log("isExtensible", "");
      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      log("has", name);
      if(!(name in target) && target===global) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return (name in target);
    };
    this.hasOwn = function(target, name) {
      log("hasOwn", name);
      if(!(name in target) && target===global) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      log("get", name);
      if(!(name in target) && target===global) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

      // pass-through of native functions
      if(TreatJS.Config.nativePassThrough) {
        if(isNativeFunction(target[name])) {
          return target[name];
        }
        else {
          return wrap(target[name], global, whitelist);
        }
      } else {
        return wrap(target[name], global, whitelist);
      }
    };
    this.set = function(target, name, value, receiver) {
      log("set", name);
      // NOTE: no write access allowed
      violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //otherwise use this code:
      //if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //else return target[name] = value;
    };
    this.enumerate = function(target) {
      log("enumerate", name);
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.keys = function(target) {
      log("keys");
      return Object.keys(target);
    };
    this.apply = function(target, thisArg, argumentsArg) {
      log("apply");
      return evalFunction(target, global, thisArg, argumentsArg);
    };
    this.construct = function(target, argumentsArg) {
      log("construct");
      return evalNew(target, global, this, argumentsArg);
    };
  };

  // ___               _ _             
  /// __| __ _ _ _  __| | |__  _____ __
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ /
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\

  /** applyInSandbox(fun[, globalArg, thisArg, argumentsArg])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return The result of fun.apply(thisArg, argumentsArg);
   */
  function applyInSandbox(fun, globalArg, thisArg, argumentsArg) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var secureFun = decompile(fun, globalArg); // XXX 
    return secureFun.apply(thisArg, argumentsArg);
    //return secureFun.eval(globalArg, thisArg, argumentsArg);
  }

  /** constructInSandbox(fun[, globalArg, thisArg, argumentsArg])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return The result of fun.apply(thisArg, argumentsArg);
   */
  function constructInSandbox(fun, globalArg, thisArg, argumentsArg) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var secureFun = decompile(fun, globalArg);
    var newObj = Object.create(secureFun.prototype);
    //var val = secureFun.eval(globalArg, newObj, argumentsArg); // XXX
    var val = secureFun.apply(newObj, argumentsArg);

    return (val instanceof Object) ? val : newObj;
  }

  /** evalFunction(fun[, globalArg, thisArg, argumentsArg])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return The result of fun.apply(thisArg, argumentsArg);
   */
  function evalNew(fun, globalArg, thisArg, argumentsArg, whitelist) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argumentsArg = (argumentsArg!=undefined) ? argumentsArg : new Array();
    whitelist = (whitelist!=undefined) ? whitelist : new WeakSet();

    if(!TreatJS.Config.decompile) {
      with(globalArg) { return fun.apply(thisArg, argumentsArg); }
    } else if(!TreatJS.Config.membrane) {
      return constructInSandbox(fun, globalArg, thisArg, argumentsArg);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg, whitelist);
      var sandboxThisArg = wrap(thisArg, {}, whitelist);
      var sandboxArgumentsArg = wrap(argumentsArg, {}, whitelist);

      return constructInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgumentsArg, whitelist);
    }
  }

  /** bindInSandbox(fun[, globalArg, thisArg, argumentsArg])
   *
   * Binds the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return The result of fun.apply(thisArg, argumentsArg);
   */
  function bindInSandbox(fun, globalArg, thisArg, argumentsArg, whitelist) {
    if(!(fun instanceof Function)) error("No Function Object", (new Error()).fileName, (new Error()).lineNumber);

    var string = "(" + fun.toString() + ")"; 
    var sandbox = globalArg;
    var secureFun = eval("(function() { with(sandbox) { return " + string + " }})();");

    return secureFun.bind(thisArg);
  }

  /** wrap(target)
   *
   * Wraps a target object.
   *
   * @param fun The function object
   * @param globalArg The secure global object
   * @param whitelist List of secure objects
   * @return Membrane Reference/ Proxy 
   */
  function wrapObject(obj, globalArg, whitelist) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    whitelist = (whitelist!=undefined) ? whitelist : new WeakSet();
  
    return wrap(obj, globalArg, whitelist);
  }

  /** evalFunction(fun[, globalArg, thisArg, argumentsArg])
   *
   * Evaluates the given function in a sandbox. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return The result of fun.apply(thisArg, argumentsArg);
   */
  function evalFunction(fun, globalArg, thisArg, argumentsArg, whitelist) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argumentsArg = (argumentsArg!=undefined) ? argumentsArg : new Array();
    whitelist = (whitelist!=undefined) ? whitelist : new WeakSet();

    if(!TreatJS.Config.decompile) {
      with(globalArg) { return fun.apply(thisArg, argumentsArg); }
    } else if(!TreatJS.Config.membrane) {
      return applyInSandbox(fun, globalArg, thisArg, argumentsArg, whitelist);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg, whitelist);
      var sandboxThisArg = wrap(thisArg, {}, whitelist);
      var sandboxArgumentsArg = wrap(argumentsArg, {}, whitelist);

      return applyInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgumentsArg, whitelist);
    }
  }

  /** bindFunction(fun[, globalArg, thisArg, argumentsArg])
   *
   * Binds the given function. 
   *
   * @param fun The function object.
   * @param globalArg The secure global object.
   * @param thisArg The function this-reference.
   * @param argumentsArg The function arguments
   * @param whitelist List of secure objects
   * @return Function
   */
  function bindFunction(fun, globalArg, thisArg, argumentsArg, whitelist) {
    globalArg = (globalArg!=undefined) ? globalArg : new Object();
    thisArg = (thisArg!=undefined) ? thisArg : globalArg;
    argumentsArg = (argumentsArg!=undefined) ? argumentsArg : new Array();
    whitelist = (whitelist!=undefined) ? whitelist : new WeakSet();

    if(!TreatJS.Config.decompile) {
      return fun; 
    } else if(!TreatJS.Config.membrane) {
      return bindInSandbox(fun, globalArg, thisArg, argumentsArg);
    } else {
      var sandboxGlobalArg = wrap(globalArg, globalArg, whitelist);
      var sandboxThisArg = wrap(thisArg, {}, whitelist);
      var sandboxArgumentsArg = wrap(argumentsArg, {}, whitelist);

      return bindInSandbox(fun, sandboxGlobalArg, sandboxThisArg, sandboxArgumentsArg, whitelist);
    }
  }

  // _    _  _      _   _         ___             _   _          
  //(_)__| \| |__ _| |_(_)_ _____| __|  _ _ _  __| |_(_)___ _ _  
  //| (_-< .` / _` |  _| \ V / -_) _| || | ' \/ _|  _| / _ \ ' \ 
  //|_/__/_|\_\__,_|\__|_|\_/\___|_| \_,_|_||_\__|\__|_\___/_||_|

  /** isNativeFunction(func)
   * checks if the function is a native function
   *
   * @param func Function Object
   * @return true, if func is a native function, false otherwise
   */
  function isNativeFunction(func) {
    if(!(func instanceof Function)) return false;

    var toString = getToStringFunction();

    /**
     * Note: Matthias Keil
     * This is a quick fix of
     * treat.sandbox.js:362:14 TypeError: Function.prototype.toString called on incompatible object
     *
     * The newer Spidermonky version throws this error message if toString is called on a function proxy.
     */
    try {
      return (toString.apply(func).indexOf('[native code]') > -1);
    } catch(err) {
      // works in LAX mode because it unwraps the contracted function
      return false;
      //throw err;
    }
  }

  /** getToStringFunction()
   * returns the native toString of Function.prototype
   * @return Function
   */
  function getToStringFunction() {
    if(TreatJS.Base.toString!=undefined) {
      return TreatJS.Base.toString;
    } else if(TreatJS.Config.newGlobal) {
      var g = newGlobal();
      return (g.Function.prototype.toString);
    } else {
      return undefined;
    }
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("eval", evalFunction);
  TreatJS.extend("bind", bindFunction);
  TreatJS.extend("wrap", wrapObject);

  TreatJS.define(TreatJS.Base, "isNativeFunction", isNativeFunction);

})(TreatJS);