/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014-2016, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

TreatJS.package("TreatJS.Sandbox", function (TreatJS, Contract, configuration) {

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  function SandboxContract(predicate, name) {
    if(!(this instanceof SandboxContract)) return new SandboxContract(...arguments);

    if(!(predicate instanceof Function))
      throw new TypeError("Invalid predicate");

    Object.defineProperties(this, {
      "predicate": {
        value: predicate
      },
      "name": {
        value: name
      }
    });
  }
  SandboxContract.prototype = Object.create(TreatJS.Contract.Base.prototype);
  SandboxContract.prototype.constructor = SandboxContract;
  SandboxContract.prototype.toString = function() {
    return this.name ? "#"+this.name : "[[TreatJS/BaseContract]]";
  };

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

  var SandboxContract = Object.create(Contract);

  Object.defineProperty(SandboxContract, "Base", {
    value: SandboxContract
  });

  // ___               _ _              ___ _     _          _ 
  /// __| __ _ _ _  __| | |__  _____ __/ __| |___| |__  __ _| |
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (_ | / _ \ '_ \/ _` | |
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___|_\___/_.__/\__,_|_|

  var SandboxGlobal = {
    TreatJS:  TreatJS,
    Contract: SandboxContract
  };





/*
  function SandboxContract(predicate, global, name) {
    if(!(this instanceof SandboxContract)) return new SandboxContract(predicate, global, name);
    else BaseContract.call(this, predicate, name);

    if(!(global instanceof Object))
      error("Invalid Global Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "global": {
        value: global
      }
    });
  }
  SandboxContract.prototype = Object.create(BaseContract.prototype);
*/




















  // TODO, verbose mode


  /**
   * Function decompile (aka Function.prototype.toString).
   * Decompiles a function and returns a string representing the source code of that function.
   */
  var decompile = Function.prototype.toString;


  // wrap for arguments passed the membrane
  // cache ? 
  // flag sthat omiyt decomilation and logging?

  
  //  ___                 
  // | __|_ _ _ _ ___ _ _ 
  // | _|| '_| '_/ _ \ '_|
  // |___|_| |_| \___/_|  

  function SandboxError (trapname="Undefiend operaton") {
    this.name = 'Sandbox Error';
    this.message = 'Sandbox function cannot cause observable effects or call functions.' + (trapname? '\n'+trapname: '');;
    this.stack = (new Error()).stack;
  }
  SandboxError.prototype = Object.create(Error.prototype);
  SandboxError.prototype.constructor = SandboxError;

  //__ __ ___ _ __ _ _ __ 
  //\ V  V / '_/ _` | '_ \
  // \_/\_/|_| \__,_| .__/
  //                |_|   

  /** 
   * proxies: proxy -> target
   **/
  var proxies = new WeakMap();

  /** 
   * targets: target -> proxy
   **/
  var targets = new WeakMap();

  /** 
   * wrap: target -> proxy
   **/
  function wrap(target) {

    /**
     * If target is a primitive value, return target.
     **/
    if (target !== Object(target)) {
      return target;
    }

    /**
     * Avoid re-wrapping of targets/ proxies
     **/
    if(targets.has(target)) {
      return targets.get(target);
    } else if (proxies.has(target)) {
      return target;
    }

    //var handler = new Membrane();
    //var proxy = new Proxy(target, handler);

    var proxy = new Proxy(target, new Proxy({}, {
      get: function(target, name, receiver) {
        throw new SandboxError("get" + name);
      }
    }));

    // TODO
    var proxy = new Proxy(target, new Membrane());

    /**
     * Stores the current proxy
     **/
    targets.set(target, proxy);
    proxies.set(proxy, target);

    return proxy;
  }

  /** 
   * wrap: target -> proxy
   **/
  function unwrap(proxy) {
    if(proxies.has(proxy)) {
      return proxies.get(proxy);
    } else {
      return proxy;
    }
  }





  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

// TODO, repicated
 
  
  function Membrane() {
    if(!(this instanceof Membrane)) return new Membrane(...arguments);

    /**
     * A trap for Object.getPrototypeOf.
     **/
    this.getPrototypeOf = function(target) {
      throw new SandboxError("getPrototypeOf");
    }

    /**
     * A trap for Object.setPrototypeOf.
     **/
    this.setPrototypeOf = function(target, prototype) {
      throw new SandboxError("setPrototypeOf");
    }

    /**
     * A trap for Object.isExtensible
     **/
    this.isExtensible = function(target) {
      throw new SandboxError("isExtensible");
    };

    /** 
     * A trap for Object.preventExtensions.
     **/
    this.preventExtensions = function(target) {
      throw new SandboxError("preventExtensions");
    };

    /** 
     * A trap for Object.getOwnPropertyDescriptor.
     **/
    this.getOwnPropertyDescriptor = function(target, name) {
      throw new SandboxError("getOwnPropertyDescriptor");
    };

    /** 
     * A trap for Object.defineProperty.
     **/
    this.defineProperty = function(target, name, desc) {
      throw new SandboxError("defineProperty");
    };

    /** 
     * A trap for the in operator.
     **/
    this.has = function(target, name) {
      return Reflect.has(target, name); // TODO
      //throw new SandboxError("has");
    };

    /**
     * A trap for getting property values.
     **/
    this.get = function(target, name, receiver) {
      return Reflect.get(target, name, receiver); // TODO
      //throw new SandboxError("get");
    };

    /** 
     * A trap for setting property values.
     **/
    this.set = function(target, name, value, receiver) {
      throw new SandboxError("set");
    };

    /**
     * A trap for the delete operator.
     **/
    this.deleteProperty = function(target, name) {
      throw new SandboxError("deleteProperty");
    };

    /** 
     * A trap for for...in statements.
     **/
    this.enumerate = function(target) {
      throw new SandboxError("enumerate");
    };

    /**
     * A trap for Object.getOwnPropertyNames.
     **/
    this.ownKeys = function(target) {
      //return Object.getOwnPropertyNames(target);
      throw new SandboxError("ownKeys");
    };

    /** 
     * A trap for a function call.
     **/
    this.apply = function(target, thisArg, argumentsList) {
      throw new SandboxError("apply");
    };

    /** 
     * A trap for the new operator. 
     **/
    this.construct = function(target, argumentsList) {
      throw new SandboxError("construct");
    }
  }

  // _ _ ___ __ ___ _ __  _ __(_) |___ 
  //| '_/ -_) _/ _ \ '  \| '_ \ | / -_)
  //|_| \___\__\___/_|_|_| .__/_|_\___|
  //                     |_|           

  function recompile(realm, closure) {
    try {

      /**
       * Scope Proxy.
       * Stops the traversal of a scope chain lookup.
       **/
      var scope = new Proxy(realm, {
        has: function() {
          return true;
        }
      });

      /**
       * Source Code.
       * Dcompiled function body.
       **/
      var source = decompile.apply(closure);

      /**
       * New Function Body.
       * Creates a nest function body in the new scope chain.
       **/
      var body = "(function() {'use strict'; return " + ("(" +  source + ")") + "})();";

      /**
       * New Pure Function.
       * Creates the new pure function.
       **/
      var pure = eval("(function() { with(scope) { return " + body + " }})();");

      /**
       * Intercept Aplications.
       * Wrap/Uwrap arguments and return of a function call to protect values.
       **/
      var proxy =  new Proxy(pure, {
        apply: function(target, thisArg, argumentsList) {
          return unwrap(target.apply(wrap(thisArg), wrap(argumentsList)));
        }
      });

      /**
       * Return new pure function.
       **/    
      return proxy;

    } catch(error) {
      throw new SyntaxError("Incompatible function object. " + error.message);
    } 
  }


  function mkPredicate (predicate) {
    return recompile({}, predicate);
  }


  function mkConstructor (predicate) {
    return recompile({}, predicate);
  }



  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    recompile: recompile,
    mkPredicate: mkPredicate,
    mkConstructor: mkConstructor
  };

  
  // TODO, problem
  // Math.abs;
  // and so ob shoul be callable
  //
  //



});

