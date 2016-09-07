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

  // out
  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var TreatJSError = TreatJS.Error.TreatJSError;
  var TreatJSViolation = TreatJS.Error.TreatJSViolation;
  var TreatJSBlame = TreatJS.Error.TreatJSBlame;

  // prototypes
  var Contract = TreatJS.Core.Contract;
  var Constructor = TreatJS.Core.Constructor;

  // core contracts
  var DelayedContract = TreatJS.Contract.Delayed;
  var ImmediateContract = TreatJS.Contract.Immediate;
  var CombinatorContract = TreatJS.Contract.Combinator;
  var WrapperContract = TreatJS.Contract.Wrapper;

  var BaseContract = TreatJS.Contract.Base;

  var FunctionContract = TreatJS.Contract.Function;
  var MethodContract = TreatJS.Contract.Method;
  var DependentContract = TreatJS.Contract.Dependent;
  var ObjectContract = TreatJS.Contract.Object;

  var WithContract = TreatJS.Contract.With;

  var AndContract = TreatJS.Contract.And;
  var OrContract = TreatJS.Contract.Or;
  var NotContract = TreatJS.Contract.Not;

  var UnionContract = TreatJS.Contract.Union;
  var IntersectionContract = TreatJS.Contract.Intersection;
  var NegationContract = TreatJS.Contract.Negation;

  var ReflectionContract = TreatJS.Contract.Reflection;

  var InContract = TreatJS.Contract.In;
  var OutContract = TreatJS.Contract.Out;

  // Variable
  var Variable = TreatJS.Polymorphism.Variable;

  // core constuctors
  var ContractConstructor = TreatJS.Constructor.Constructor;

  // maps
  var Map = TreatJS.Map.Map;
  var StringMap = TreatJS.Map.StringMap;

  // core callbacks
  var Callback = TreatJS.Callback.Callback;
  var Handle =  TreatJS.Callback.Handle;

  var RootCallback = TreatJS.Callback.Root;
  var SwitchCallback = TreatJS.Callback.Switch;

  var BaseCallback = TreatJS.Callback.Base;
  var FunctionCallback = TreatJS.Callback.Function;
  var ObjectCallback = TreatJS.Callback.Object;
  var PropertyCallback = TreatJS.Callback.Property;

  var AndCallback = TreatJS.Callback.And;
  var OrCallback = TreatJS.Callback.Or;
  var NotCallback = TreatJS.Callback.Not;

  var IntersectionCallback = TreatJS.Callback.Intersection;
  var UnionCallback = TreatJS.Callback.Union;
  var NegationCallback = TreatJS.Callback.Negation;

  var WhereCallback = TreatJS.Callback.Where;

  // XXX
  var InContract = TreatJS.Contract.In;
  var OutContract = TreatJS.Contract.Out;
  var ForallContract = TreatJS.Contract.Forall;

  var RecursiveContract = TreatJS.Contract.Recursive;

  var NameContract = TreatJS.Contract.Name;
  var WhereContract = TreatJS.Contract.Where;
  var TemporalContract = TreatJS.Contract.Temporal;
  var YieldContract = TreatJS.Contract.Yield;

  // logic
  var translate = TreatJS.Logic.translate;

  // predicates
  var canonical = TreatJS.canonical;
  var delayed = TreatJS.delayed;
  var immediate = TreatJS.immediate;

  // canonicalize
  var canonicalize = TreatJS.canonicalize;

  var True = TreatJS.Logic.True;
  var False = TreatJS.Logic.False;
  var Conflict = TreatJS.Logic.Conflict;

  // blame
  var TreatJSBlame = TreatJS.Error.TreatJSBlame;

  // TreatJS Output
  var logoutput = TreatJS.output;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg, target) {
    if(TreatJS.Verbose.assert) {
      logoutput.log(logoutput.ASSERT, msg, target);
    }
  }

  /** count(msg)
   * @param key String
   */
  function count(key) {
    if(TreatJS.Verbose.statistic) TreatJS.Statistic.inc(key);
  }

  // ___               _ _              ___         _               _   
  /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

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

  //  ___ _     _          _ 
  // / __| |___| |__  __ _| |
  //| (_ | / _ \ '_ \/ _` | |
  // \___|_\___/_.__/\__,_|_|

  function Global(bindings) {
    if(!(this instanceof Global)) return new Global(bindings);

    if(!(bindings instanceof Object))
      error("Invalid Bingings", (new Error()).fileName, (new Error()).lineNumber);

    // copy bindings
    var raw = {};
    for(var name in bindings) {
      raw[name] = bindings[name];
    }

    Object.defineProperties(this, {
      "raw": {
        value: raw
      }
    });
  }
  Global.prototype = {};

  Global.prototype.dump = function() {
    var dump = {};
    for(var name in this.raw) {
      dump[name] = this.raw[name];
    }
    return dump; 
  }

  Global.prototype.clone = function() {
    var newglobal = {};
    for(var name in this.raw) {
      newglobal[name] = this.raw[name];
    }
    return new Global(newglobal);
  }

  Global.prototype.merge = function(bindings) {
    var newglobal = this.dump();
    for(var name in bindings) {
      newglobal[name] = bindings[name];
    }
    return new Global(newglobal);
  }

  Global.prototype.toString = function() {
    var string = "";
    for(var name in this.raw) {
      string += " " + name + ":" + this.raw[name];
    }
    return "{" + string + "}";
  }

  //            _               _                _        
  // __ ___ _ _| |_ _ _ __ _ __| |_   __ __ _ __| |_  ___ 
  /// _/ _ \ ' \  _| '_/ _` / _|  _| / _/ _` / _| ' \/ -_)
  //\__\___/_||_\__|_| \__,_\__|\__| \__\__,_\__|_||_\___|

  var ccache = new WeakMap();

  // TODO
  //var envX = new WeakMap();

  //            _               _    ___   __ 
  // __ ___ _ _| |_ _ _ __ _ __| |_ / _ \ / _|
  /// _/ _ \ ' \  _| '_/ _` / _|  _| (_) |  _|
  //\__\___/_||_\__|_| \__,_\__|\__|\___/|_|  

  function contractOf (target) {
    return contracted(target) ? ccache.get(target).contract : undefined;
  }

  function contracted (target) {
    return ccache.has(target);
  }

  //            _           _        _           _   
  // __ ___ _ _| |_ _____ _| |_   __| |_ __ _ __| |__
  /// _/ _ \ ' \  _/ -_) \ /  _| (_-<  _/ _` / _| / /
  //\__\___/_||_\__\___/_\_\\__| /__/\__\__,_\__|_\_\                                                   

  var ctxtStack = new Array();

  function Context(name, target) {
    if(!(this instanceof Context)) return new Context(name, target);

    if((typeof name) != "string") error("Wrong Context", (new Error()).fileName, (new Error()).lineNumber);
    if((typeof target) != "object") error("Wrong Context" + (typeof target), (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "name": {
        value: name
      },
      "target": {
        value: target
      }
    });
  }
  Context.prototype = {};
  Context.prototype.toString = function() {
    return this.name;
  }

  function pushContext(contract) {
    if(!(contract instanceof Contract)) error("Wrong Context/Contract", (new Error()).fileName, (new Error()).lineNumber);

    var ctxt = new Context(((contract.name) ? contract.toString() : "Unnamed Context"), contract)
      log("push context", ctxt.name);

    ctxtStack.push(ctxt);
  }

  function popContext() {
    var ctxt = ctxtStack.pop();
    log("pop context", ctxt.name);
  }

  function lastContext() {
    return ctxtStack[ctxtStack.length-1];
  }

  // _                         _        _       
  //| |__  __ _ _ __  ___   __| |_ __ _| |_ ___ 
  //| '_ \/ _` | '  \/ -_) (_-<  _/ _` |  _/ -_)
  //|_.__/\__,_|_|_|_\___| /__/\__\__,_|\__\___|

  function checkBlameState(handle, contract, subject, context) {
    log("check blame state", handle);

    if(handle.context.supseteqFalse()) {
      // compose blame mesasge
      var msg = "Context (" + context.name + ")" + " @ " + contract.toString();
      msg += "\n" + "@Context:   " + handle.context;
      msg += "\n" + "@Subject:   " + handle.subject;
      msg += "\n" + "Blame is on:";
      msg += "\n" + context;
      // raise blame error
      blame(contract, TreatJSBlame.CONTEXT, msg, (new Error()).fileName, (new Error()).lineNumber);
    } else if(handle.subject.supseteqFalse()) {
      // compose blame mesasge
      var msg = "Subject (Callee)" + " @ " + contract.toString();
      msg += "\n" + "@Context:   " + handle.context;
      msg += "\n" + "@Subject:   " + handle.subject;
      msg += "\n" + "Blame is on:";
      msg += "\n" + subject;
      // raise blame error
      blame(contract, TreatJSBlame.SUBJECT, msg, (new Error()).fileName, (new Error()).lineNumber);
    } 
  }

  //                         _   
  //                        | |  
  //  __ _ ___ ___  ___ _ __| |_ 
  // / _` / __/ __|/ _ \ '__| __|
  //| (_| \__ \__ \  __/ |  | |_ 
  // \__,_|___/___/\___|_|   \__|

  // add global context
  ctxtStack.push(new Context("Global Context", null));

  function assert(arg, contract) {
    log("assert", contract);
    count(TreatJS.Statistic.ASSERT);

    // disbale assertion
    if(!TreatJS.Config.assertion) return arg;

    if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);

    if(TreatJS.Config.canonicalize) {
      if(!canonical(contract)) return assert(arg, canonicalize(contract));
    } else {
      if(!canonical(contract)) error("Non-canonical contract", (new Error()).fileName, (new Error()).lineNumber);
    }

    function callback(handle) {
      checkBlameState(handle, contract, arg, lastContext());
    }

    var callback = RootCallback(callback, contract);

    // TODO, message stack
    //var stack = [];

    return assertWith(arg, contract, new Global({}), callback.rootHandler);
  }

  //                     _ __      ___ _   _    
  // __ _ ______ ___ _ _| |\ \    / (_) |_| |_  
  /// _` (_-<_-</ -_) '_|  _\ \/\/ /| |  _| ' \ 
  //\__,_/__/__/\___|_|  \__|\_/\_/ |_|\__|_||_|

  function assertWith(arg, contract, global, callbackHandler) {
    log("assert with", contract);
    count(TreatJS.Statistic.ASSERTWITH);

    var contracted = assertContract(arg, contract, global, callbackHandler);

    // cache contracted value
    if((contracted!==arg) && (contracted===Object(contracted))) {
      var assertion = {
        target: arg,
        contract: contract,
        global: global,
        callbackHandler: callbackHandler
      };
      ccache.set(contracted, assertion);
    }

    return contracted;
  }

  //                     _    ___         _               _   
  // __ _ ______ ___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  /// _` (_-<_-</ -_) '_|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //\__,_/__/__/\___|_|  \__|\___\___/_||_\__|_| \__,_\__|\__|

  function assertContract(arg, contract, global, callbackHandler) {
    if(!(contract instanceof Contract)) 
      error("Wrong Contract.", (new Error()).fileName, (new Error()).lineNumber);
    if(!(callbackHandler instanceof Function)) 
      error("Wrong Callback Handler.", (new Error()).fileName, (new Error()).lineNumber);

    // ___          _   _   _          ___         _               _   
    //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Function) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False)); // TODO, deprecated

      var handler = new FunctionHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // __  __     _   _            _  ___         _               _   
    //|  \/  |___| |_| |_  ___  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |\/| / -_)  _| ' \/ _ \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|  |_\___|\__|_||_\___/\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    if(contract instanceof TreatJS.Contract.Method) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new MethodHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //  ___  _     _        _    ___         _               _   
    // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
    //          |__/                                             

    else if (contract instanceof TreatJS.Contract.Object) {
      if(!(arg instanceof Object)) callbackHandler(Handle(True, False));

      /* STRICT MODE */
      if(contract.strict) {
        contract.map.foreach(function(key, contract) {
          arg[key] = assertWith(arg[key], contract, global, callbackHandler);
        });
      }

      var handler = new ObjectHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //  ___             _               _            ___         _               _   
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  \___\___/_||_\__|_| \__,_\__|\__|

    // TODO
    else if(contract instanceof TreatJS.Contract.Constructor) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new ConstructorHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // ___                        _         _    ___         _               _   
    //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
    //         |_|                                                               

    else if(contract instanceof TreatJS.Contract.Dependent) {
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new DependentHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    //__      ___ _   _    ___         _               _   
    //\ \    / (_) |_| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // \ \/\/ /| |  _| ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //  \_/\_/ |_|\__|_||_\___\___/_||_\__|_| \__,_\__|\__|                                                   

    else if (contract instanceof TreatJS.Contract.With) {
      var newglobal = global.merge(contract.binding);
      return assertWith(arg, contract.sub, newglobal, callbackHandler);
    }

    //   _           _  ___         _               _   
    //  /_\  _ _  __| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
    // / _ \| ' \/ _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
    ///_/ \_\_||_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.And) {
      var callback = AndCallback(callbackHandler, contract);

      var first = assertWith(arg, contract.first, global, callback.leftHandler);
      var second = assertWith(first, contract.second, global,  callback.rightHandler);

      return second;
    }

    //  ___       ___         _               _   
    // / _ \ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| (_) | '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_|  \___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Or) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = OrCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return proxy;
      } 

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else {
        var callback = OrCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        return second;
      }    
    }

    // _  _     _    ___         _               _   
    //| \| |___| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / _ \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___/\__|\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Not) {

      // TODO, definition of Not

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = NotCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NotCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }

    // ___     _                      _   _          ___         _               _   
    //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Intersection) {

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {

        //delayed contract assertion
        function assert() {
          var callback = IntersectionCallback(callbackHandler, contract);

          var first = assertWith(arg, contract.first, global, callback.leftHandler);
          var second = assertWith(first, contract.second, global,  callback.rightHandler);

          return second;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return proxy;
      } 
      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else {
        var callback = IntersectionCallback(callbackHandler, contract);

        var first = assertWith(arg, contract.first, global, callback.leftHandler);
        var second = assertWith(first, contract.second, global,  callback.rightHandler);

        return second;
      } 
    }

    // _   _      _          ___         _               _   
    //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

    else if (contract instanceof TreatJS.Contract.Union) {
      var callback = UnionCallback(callbackHandler, contract);

      var first = assertWith(arg, contract.first, global, callback.leftHandler);
      var second = assertWith(first, contract.second, global,  callback.rightHandler);

      return second;
    }

    // _  _               _   _          ___         _               _   
    //| \| |___ __ _ __ _| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| .` / -_) _` / _` |  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|_|\_\___\__, \__,_|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|
    //         |___/       

    else if (contract instanceof TreatJS.Contract.Negation) {

      // TODO, definition of negation

      //    _     _                  _ 
      // __| |___| |__ _ _  _ ___ __| |
      /// _` / -_) / _` | || / -_) _` |
      //\__,_\___|_\__,_|\_, \___\__,_|
      //                 |__/          

      if(delayed(contract)) {
        //delayed contract assertion
        function assert() {
          var callback = NegationCallback(callbackHandler, contract);
          var sub = assertWith(arg, contract.sub, global, callback.subHandler);
          return sub;
        }

        var handler = new DelayedHandler(assert);
        var proxy = new Proxy(arg, handler);

        return  proxy;
      }

      // _                    _ _      _       
      //(_)_ __  _ __  ___ __| (_)__ _| |_ ___ 
      //| | '  \| '  \/ -_) _` | / _` |  _/ -_)
      //|_|_|_|_|_|_|_\___\__,_|_\__,_|\__\___|

      else { 
        var callback = NegationCallback(callbackHandler, contract);
        var sub = assertWith(arg, contract.sub, global, callback.subHandler);
        return sub;
      }
    }

    // ___      __ _        _   _          
    //| _ \___ / _| |___ __| |_(_)___ _ _  
    //|   / -_)  _| / -_) _|  _| / _ \ ' \ 
    //|_|_\___|_| |_\___\__|\__|_\___/_||_|

    if(contract instanceof TreatJS.Contract.Reflection) {
      if(!(arg instanceof Object)) callbackHandler(Handle(True, False));

      var reflect = new ReflectionHandler(contract, global, callbackHandler);
      var noop = new NoOpHandler();
      var proxy = new Proxy(arg, new Proxy(noop, reflect));
      return proxy;
    }

    // ___             _ _ 
    //| __|__ _ _ __ _| | |
    //| _/ _ \ '_/ _` | | |
    //|_|\___/_| \__,_|_|_|

    else if(contract instanceof TreatJS.Contract.Forall) {
      // TODO
      if(!(arg instanceof Function)) callbackHandler(Handle(True, False));

      var handler = new ForallHandler(contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    }

    // ___      
    //|_ _|_ _  
    // | || ' \ 
    //|___|_||_|

    else if(contract instanceof TreatJS.Contract.In) {

      function Primitive(value) {
        this.valueX = value;
      }

      var dummy = TreatJS.clone(arg); // TODO, bug, dummy can be an non null object

      if(dummy !== Object(dummy)) dummy = new Primitive(dummy);


      var proxy = new Proxy(dummy, new Proxy({}, new PolymorphicHandler(callbackHandler)));
      TreatJS.Polymorphism.conceal(contract.id, proxy, arg);
      return proxy; 
    }

    //  ___       _   
    // / _ \ _  _| |_ 
    //| (_) | || |  _|
    // \___/ \_,_|\__|

    else if(contract instanceof TreatJS.Contract.Out) {
      //print("@@@C? " + contracted(arg));
      //print("@@@C  " + contractOf(arg));
      //print("@@@A  " + arg);

      // TODO
      //var arg = unwrap(arg);


      //print(arg(1,2));
      //print("@@@" + contracted(arg));

      var result = translate(TreatJS.Polymorphism.verify(contract.id, arg)); // TODO
      var handle = new Handle(True, result);
      callbackHandler(handle);

      return TreatJS.Polymorphism.reveal(contract.id); // todo
    }

    // ___                    _          
    //| _ \___ __ _  _ _ _ __(_)___ _ _  
    //|   / -_) _| || | '_(_-< / _ \ ' \ 
    //|_|_\___\__|\_,_|_| /__/_\___/_||_|

    else if(contract instanceof TreatJS.Contract.Recursive) {
      var alpha = TreatJS.construct(contract.constructor, contract);
      return assertWith(arg, alpha, global, callbackHandler);
    }



    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX
    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX
    // XXX XXX XXX XXX XXX XXX XXX XXX XXX XXX

    // _  _                
    //| \| |__ _ _ __  ___ 
    //| .` / _` | '  \/ -_)
    //|_|\_\__,_|_|_|_\___|

    else if(contract instanceof TreatJS.Contract.Name) {   
      var contracted = assertWith(arg, contract.contract, global, callbackHandler);    

      var handler = new EffectHandler(contract.symbol);
      var observed = new Proxy(contracted, handler);

      // links name to subject
      TreatJS.Temporal.link(contract.symbol, contracted, observed, handler);

      return observed;
    }

    //__      ___                
    //\ \    / / |_  ___ _ _ ___ 
    // \ \/\/ /| ' \/ -_) '_/ -_)
    //  \_/\_/ |_||_\___|_| \___|

    else if(contract instanceof TreatJS.Contract.Where) {
      var callback = WhereCallback(callbackHandler, contract);
      var contracted = assertWith(arg, contract.behaviour, global, callback.behaviourHandler);
      return assertWith(contracted, contract.temporal, global, callback.temporalHandler);
    }

    //__   ___     _    _ 
    //\ \ / (_)___| |__| |
    // \ V /| / -_) / _` |
    //  |_| |_\___|_\__,_|

    else if(contract instanceof TreatJS.Contract.Yield) {
      var argumentsArg = new Proxy({length:TreatJS.Config.maxArgs}, new TreatJS.Symbol.Handler());
      var whitelist = new WeakSet();

      // whitelist arguments
      for(var i=0; i<argumentsArg.length; i++) {
        whitelist.add(argumentsArg[i]);
      }

      var newcontract = constructContract(contract.constructor, argumentsArg, global, whitelist);
      return assertWith(arg, newcontract, global, callbackHandler);
    }

    // _____                             _ 
    //|_   _|__ _ __  _ __  ___ _ _ __ _| |
    //  | |/ -_) '  \| '_ \/ _ \ '_/ _` | |
    //  |_|\___|_|_|_| .__/\___/_| \__,_|_|
    //               |_|                   

    else if(contract instanceof TreatJS.Contract.Temporal) {
      //var global = new Global({}); TODO
      var whitelist = new WeakSet();

      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argumentsArg = [];

      for(var i=0; i<contract.symbols.length; i++) {
        argumentsArg.push(contract.symbols[i]);
        //argsArray.push(new Proxy(contract.symbols[i], new TreatJS.Temporal.Handler())); // TODO
      }

      function make(target, name, value) {
        Object.defineProperty(target, name, {
          value: value, enumerable: true
        });
      }

      // collection of all temporal expresion
      var expressions = {};

      // literals
      make(expressions, "Get", TreatJS.Temporal.Get);
      make(expressions, "Set", TreatJS.Temporal.Set);
      make(expressions, "Call", TreatJS.Temporal.Call);
      make(expressions, "Return", TreatJS.Temporal.Return);
      make(expressions, "Construct", TreatJS.Temporal.Construct);
      make(expressions, "Exception", TreatJS.Temporal.Exception);
      make(expressions, "Any", TreatJS.Temporal.Any);

      // expressions
      make(expressions, "Null", TreatJS.Temporal.Null);
      make(expressions, "Empty", TreatJS.Temporal.Empty);
      make(expressions, "Cmp", TreatJS.Temporal.Cmp);
      make(expressions, "Star", TreatJS.Temporal.Star);
      make(expressions, "Or", TreatJS.Temporal.Or);
      make(expressions, "And", TreatJS.Temporal.And);
      make(expressions, "Neg", TreatJS.Temporal.Neg);
      make(expressions, "Dot", TreatJS.Temporal.Dot);

      // makes expressions avaliable inside of the sandboc
      for(var name in expressions) {
        globalArg[name] = expressions[name];
        whitelist.add(expressions[name]);
      }

      // whitelist arguments
      for(var i=0; i<argumentsArg.length; i++) {
        whitelist.add(argumentsArg[i]);
      }

      // push new context
      pushContext(contract);

      try {
        var temporal = (TreatJS.eval(contract.constructor, globalArg, thisArg, argumentsArg, whitelist))
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var temporal = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var temporal = e;
        } else {
          var temporal = undefined;
        }
      } finally {

        // pop context
        popContext(); 

        if(temporal instanceof Error) {
          throw temporal;
        } else {
          // convert arrays to sequences
          temporal = (temporal instanceof Array) ? TreatJS.Temporal.Dot.apply(undefined, temporal) : temporal;

          // tests for temporal expressions
          if(!(temporal instanceof TreatJS.Temporal.Expression)) 
            error("Invalid Temporal Expression", (new Error()).fileName, (new Error()).lineNumber);
        }

        // initializes closure
        function initialize(expression) {
          log("initialize temporal contract", expression);

          return function(effect) {
            log("check remporal contract", effect + " ? " + expression);

            if(!TreatJS.Temporal.valid(expression, effect)) callbackHandler(Handle(False, True));
            else expression = TreatJS.Temporal.derive(expression, effect); 

            log("new temporal expression", expression);
          }
        }

        // evaluator function
        var evaluate = initialize(temporal);

        // register evaluator function to handler
        for(var i=0; i<contract.symbols.length; i++) {
          TreatJS.Temporal.lookup(contract.symbols[i]).handler.register(evaluate);
        }
      }

      return arg;
    }

    // ___                  _          _   
    //|_ _|_ ___ ____ _ _ _(_)__ _ _ _| |_ 
    // | || ' \ V / _` | '_| / _` | ' \  _|
    //|___|_||_\_/\__,_|_| |_\__,_|_||_\__|

    else if(contract instanceof TreatJS.Contract.Invariant) {
      assertWith(arg, contract.contract, global, callbackHandler);

      var handler = new InvariantHandler(contract.contract, global, callbackHandler);
      var proxy = new Proxy(arg, handler);
      return proxy;
    } 

    // ___               _ _              ___         _               _   
    /// __| __ _ _ _  __| | |__  _____ __/ __|___ _ _| |_ _ _ __ _ __| |_ 
    //\__ \/ _` | ' \/ _` | '_ \/ _ \ \ / (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_|_||_\__,_|_.__/\___/_\_\\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof SandboxContract) {
      count(TreatJS.Statistic.BASE);

      var globalArg = global.dump(); 
      var thisArg = undefined;
      var argsArray = [TreatJS.wrap(arg)];

      var callback = BaseCallback(callbackHandler, contract);

      /* Clone Operation
       * This steps copies values defined in the global object.
       *
       * The contract.global is the global object of the sandbox.
       * There is no fresh decompilation. For this reason, the only way to extend 
       * variables is to extend the sandbox global. But this step has to be rolled 
       * back after predicate evaluation.
       */
      function clone(obj) {
        var tmp = {};
        for(var property in obj) tmp[property] = obj[property];
        return tmp;
      }
      // clear object
      function clear(obj) {
        for(var property in obj) delete obj[property];
      }
      // copy objA[property] => objB[property]
      function copy(objA, objB) {
        for(var property in objA) objB[property]=objA[property];
      }

      var backupGlobal = clone(contract.global);
      copy(globalArg, contract.global);

      // push new context
      pushContext(contract);

      try {
        if(TreatJS.Config.predicate) {
          var result = translate(contract.predicate.apply(thisArg, argsArray));
        } else {
          var result = translate(true);
        }
      } catch (e) {
        if(e instanceof TreatJSError) {
          var result = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var result = e;
        }  else {
          var result = Conflict;
        }
      } finally {

        // push new context
        popContext();

        if(result instanceof Error) {
          throw result;
        } else {
          var handle = Handle(True, result);
          callback.predicateHandler(handle);
          clear(contract.global);
          copy(backupGlobal, contract.global);
          return arg;
        }
      }
    }

    // ___                ___         _               _   
    //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
    //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
    //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

    else if(contract instanceof TreatJS.Contract.Base) {
      count(TreatJS.Statistic.BASE);

      var globalArg = global.dump();
      var thisArg = undefined;
      var argsArg = [arg];

      var callback = BaseCallback(callbackHandler, contract);

      // push new context
      pushContext(contract);

      try {
        if(TreatJS.Config.predicate) {
          var result = translate(TreatJS.eval(contract.predicate, globalArg, thisArg, argsArg));
        } else {
          var result = translate(true);
        }
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var result = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var result = e;
        } else {
          var result = Conflict;
        }
      } finally {

        // pop context
        popContext(); 

        if(result instanceof Error) {
          throw result;
        } else {
          var handle = new Handle(True, result);
          callback.predicateHandler(handle);
          return arg;
        }
      }
    }

    //  ___             _               _           
    // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    else if(contract instanceof TreatJS.Constructor.Constructor) {
      var handler = new AbstractionHandler(arg, contract, global, callbackHandler);
      var proxy = new Proxy(contract.constructor, handler);
      return proxy;
    }

    //    _      __           _ _   
    // __| |___ / _|__ _ _  _| | |_ 
    /// _` / -_)  _/ _` | || | |  _|
    //\__,_\___|_| \__,_|\_,_|_|\__|

    else error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
  }

  //                     _                   _   
  //                    | |                 | |  
  //  ___ ___  _ __  ___| |_ _ __ _   _  ___| |_ 
  // / __/ _ \| '_ \/ __| __| '__| | | |/ __| __|
  //| (_| (_) | | | \__ \ |_| |  | |_| | (__| |_ 
  // \___\___/|_| |_|___/\__|_|   \__,_|\___|\__|

  function construct(constructor) {
    log("construct", constructor);

    if(!(constructor instanceof TreatJS.Constructor.Constructor))
      error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    // construct ( constructor[, arg0[, arg1[, ...]]] )
    var args = Array.prototype.slice.call(arguments, 0);
    args.shift();

    return constructContract(constructor, args, new Global({}), new WeakSet());
  }

  function constructContract(constructor, args, global, whitelist) {
    log("construct with", constructor);

    if(!(constructor instanceof Constructor)) error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);

    //  ___         _               _    ___             _               _           
    // / __|___ _ _| |_ _ _ __ _ __| |_ / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ 
    //| (__/ _ \ ' \  _| '_/ _` / _|  _| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_|
    // \___\___/_||_\__|_| \__,_\__|\__|\___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  

    if(constructor instanceof TreatJS.Constructor.Constructor) {
      var newglobal = (constructor.binding!==undefined) ? global.merge(constructor.binding) : global; 
      var whitelist = whitelist ? whitelist : new WeakSet();

      var globalArg = newglobal.dump(); 
      var thisArg = undefined;
      var argumentsArg = args;

      function make(target, name, value) {
        Object.defineProperty(target, name, {
          value: value, enumerable: true
        });
      }

      // contract export
      var build = TreatJS.build();

      // mew sandbox base contract w.r.t. the current global object
      var BaseContract = function (predicate, name) {
        return SandboxContract(predicate, globalArg, name);
      };

      var contract = {};
      for(var property in build) {
        make(contract, property, (property==="Base") ? BaseContract : build[property]);
      }

      // make Contract/TreatJS avaliable inside sandbox
      globalArg["Contract"] = contract;
      globalArg["TreatJS"] = TreatJS;

      // sandbox whitelisting
      whitelist.add(contract); // whitelist the TreatJS contract system
      whitelist.add(TreatJS); // whitelist the TreatJS contract system

      // push new context
      pushContext(constructor);

      try {
        var contract = (TreatJS.eval(constructor.constructor, globalArg, thisArg, argumentsArg, whitelist))
      } catch (e) { 
        if(e instanceof TreatJSError) {
          var contract = e;
        } else if(TreatJS.Config.exceptionPassThrough) {
          var contract = e;
        } else {
          var contract = undefined;
        }
      } finally {

        // pop context
        popContext(); 

        if(contract instanceof Error) {
          throw contract;
        } else {
          if(!(contract instanceof Contract)) error("Wrong Contract", (new Error()).fileName, (new Error()).lineNumber);
          return contract;
        }
      }
    }

    //    _      __           _ _   
    // __| |___ / _|__ _ _  _| | |_ 
    /// _` / -_)  _/ _` | || | |  _|
    //\__,_\___|_| \__,_|\_,_|_|\__|

    else error("Wrong Constructor", (new Error()).fileName, (new Error()).lineNumber);
  }



  // _    _                 _ _           
  //| |  | |               | | |          
  //| |__| | __ _ _ __   __| | | ___ _ __ 
  //|  __  |/ _` | '_ \ / _` | |/ _ \ '__|
  //| |  | | (_| | | | | (_| | |  __/ |   
  //|_|  |_|\__,_|_| |_|\__,_|_|\___|_|   

  function Handler() {
    if(!(this instanceof Handler)) return new Handler();
  }
  Handler.prototype = {};
  Handler.toString = function () { "[Hander]"; };

  // ___      _                  _ _  _              _ _         
  //|   \ ___| |__ _ _  _ ___ __| | || |__ _ _ _  __| | |___ _ _ 
  //| |) / -_) / _` | || / -_) _` | __ / _` | ' \/ _` | / -_) '_|
  //|___/\___|_\__,_|\_, \___\__,_|_||_\__,_|_||_\__,_|_\___|_|  
  //                 |__/                                        

  function DelayedHandler(assert) {
    if(!(this instanceof DelayedHandler)) return new DelayedHandler(assert);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      return assert().apply(thisArg, args);
    };
  }
  DelayedHandler.prototype = Object.create(Handler.prototype);

  // ___             _   _          _  _              _ _         
  //| __|  _ _ _  __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  //| _| || | ' \/ _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  //|_| \_,_|_||_\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function FunctionHandler(contract, global, handler) {
    if(!(this instanceof FunctionHandler)) return new FunctionHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var callback = FunctionCallback(handler, contract);
      var args = assertWith(args, contract.domain, global, callback.domainHandler);
      var val = target.apply(thisArg, args);  
      return assertWith(val, contract.range, global, callback.rangeHandler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }
  FunctionHandler.prototype = Object.create(Handler.prototype);

  // __  __     _   _            _ _  _              _ _         
  //|  \/  |___| |_| |_  ___  __| | || |__ _ _ _  __| | |___ _ _ 
  //| |\/| / -_)  _| ' \/ _ \/ _` | __ / _` | ' \/ _` | / -_) '_|
  //|_|  |_\___|\__|_||_\___/\__,_|_||_\__,_|_||_\__,_|_\___|_|  

  function MethodHandler(contract, global, handler) {
    if(!(this instanceof MethodHandler)) return new MethodHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {

      // domain := arguments + this
      // range  := return

      var callback = FunctionCallback(handler, contract);
      var domainCallback = AndCallback(callback.domainHandler, contract);

      var thisArg = assertWith(thisArg, contract.context, global, domainCallback.leftHandler);
      var args = assertWith(args, contract.domain, global, domainCallback.rightHandler);
      var val = target.apply(thisArg, args);  
      return assertWith(val, contract.range, global, callback.rangeHandler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }
  MethodHandler.prototype = Object.create(Handler.prototype);

  //  ___             _               _           _  _              _ _         
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _| || |__ _ _ _  __| | |___ _ _ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| __ / _` | ' \/ _` | / -_) '_|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_| |_||_\__,_|_||_\__,_|_\___|_|  

  // TODO
  function ConstructorHandler(contract, global, handler) {
    if(!(this instanceof ConstructorHandler)) return new ConstructorHandler(contract, global, handler);
    else Handler.call(this);

    this.construct = function(target, argumentsArray) {
      var base = Object.create(target.prototype);
      var value = target.apply(base, argumentsArray);

      var constructed = (value instanceof Object) ? value : base; 
      return assertWith(constructed, contract.contract, global, handler);
    };
  }
  ConstructorHandler.prototype = Object.create(Handler.prototype);

  // ___                        _         _   _  _              _ _         
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_| || |__ _ _ _  __| | |___ _ _ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| __ / _` | ' \/ _` | / -_) '_|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|_||_\__,_|_||_\__,_|_\___|_|  
  //         |_|                                                            

  function DependentHandler(contract, global, handler) {
    if(!(this instanceof DependentHandler)) return new DependentHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var range = constructContract(contract.constructor, args, global);
      var val = target.apply(thisArg, args); 
      return assertWith(val, range, global, handler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }
  DependentHandler.prototype = Object.create(Handler.prototype);

  //  ___  _     _        _   _  _              _ _         
  // / _ \| |__ (_)___ __| |_| || |__ _ _ _  __| | |___ _ _ 
  //| (_) | '_ \| / -_) _|  _| __ / _` | ' \/ _` | / -_) '_|
  // \___/|_.__// \___\__|\__|_||_\__,_|_||_\__,_|_\___|_|  
  //          |__/                                          

  function ObjectHandler(contract, global, handler) {
    if(!(this instanceof ObjectHandler)) return new ObjectHandler(contract, global, handler);
    else Handler.call(this);

    var callback = ObjectCallback(handler, contract);

    var callbacks = {};
    var cache = new WeakMap();

    function getCallback(name) {
      callbacks[name] = callbacks[name] || PropertyCallback(callback.objectHandler, contract);
      return callbacks[name];
    }

    this.get = function(target, name, receiver) {

      function assert(target, name, global, callback) {
        if(contract.map instanceof StringMap) {
          return (contract.map.has(name)) ? assertWith(target[name], contract.map.get(name), global, callback.getHandler) : target[name];
        } else {
          var target = target[name];
          contract.map.slice(name).foreach(function(i, contract) {
            target = assertWith(target, contract, global, callback.getHandler);
          });
          return target;
        } 
      }

      var callback = getCallback(name);

      if(target[name] instanceof Object) {
        if(cache.has(target[name])) {
          return cache.get(target[name]);
        } else {
          var contracted = assert(target, name, global, callback);
          cache.set(target[name], contracted);
          return contracted;
        }
      } else {
        return assert(target, name, global, callback);
      }
    };

    this.set = function(target, name, value, reveiver) {
      var callback = getCallback(name);

      if(contract.map instanceof StringMap) {
        value = (contract.map.has(name)) ? assertWith(value, contract.map.get(name), global, callback.setHandler) : value;
      } else {
        contract.map.slice(name).foreach(function(i, contract) {
          value = assertWith(value, contract, global, callback.setHandler);
        });
      } 

      return target[name] = value;
    }
  }
  ObjectHandler.prototype = Object.create(Handler.prototype);

  // ___      __ _        _   _          _  _              _ _         
  //| _ \___ / _| |___ __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  //|   / -_)  _| / -_) _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  //|_|_\___|_| |_\___\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function ReflectionHandler(contract, global, handler) {
    if(!(this instanceof ReflectionHandler)) return new ReflectionHandler(contract, global, handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {

      if(name === contract.trap) {
        return assertWith(target[name], contract.sub, global, handler);
      } else {
        return target[name];
      }
    };
  }
  ReflectionHandler.prototype = Object.create(Handler.prototype);

  function NoOpHandler() {
    if(!(this instanceof NoOpHandler)) return new NoOpHandler();

    // default get trap
    this.get = function(target, name, receiver) {
      return target[name];
    };

    // default set trap
    this.set = function(target, name, value, receiver) {
      return target[name]=value;
    };
  }
  NoOpHandler.prototype = Object.create(Handler.prototype);


// TODO
  function InvariantHandler(contract, global, handler) {
    if(!(this instanceof InvariantHandler)) return new InvariantHandler(contract, global, handler);
    else Handler.call(this);

    this.set = function(target, name, value, receiver) {
      var result = (target[name] = value);
      assertWith(target, contract, global, handler);
      return result;
    };
  }
  InvariantHandler.prototype = Object.create(Handler.prototype);





  //   _   _       _               _   _          _  _              _ _         
  //  /_\ | |__ __| |_ _ _ __ _ __| |_(_)___ _ _ | || |__ _ _ _  __| | |___ _ _ 
  // / _ \| '_ (_-<  _| '_/ _` / _|  _| / _ \ ' \| __ / _` | ' \/ _` | / -_) '_|
  ///_/ \_\_.__/__/\__|_| \__,_\__|\__|_\___/_||_|_||_\__,_|_||_\__,_|_\___|_|  

  function AbstractionHandler(arg, constructor, global, handler) {
    if(!(this instanceof AbstractionHandler)) return new AbstractionHandler(constructor, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, argsArray) {
      var contract = constructContract(constructor, argsArray, global);
      return assertWith(arg, contract, global, handler);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, obj, args);
      return obj;
    };
  }
  AbstractionHandler.prototype = Object.create(Handler.prototype);

  // ___     _                         _    _          _  _              _ _         
  //| _ \___| |_  _ _ __  ___ _ _ _ __| |_ (_)____ __ | || |__ _ _ _  __| | |___ _ _ 
  //|  _/ _ \ | || | '  \/ _ \ '_| '_ \ ' \| (_-< '  \| __ / _` | ' \/ _` | / -_) '_|
  //|_| \___/_|\_, |_|_|_\___/_| | .__/_||_|_/__/_|_|_|_||_\__,_|_||_\__,_|_\___|_|  
  //           |__/              |_|                                                 

  // TODO, required?
  function ForallHandler(forall, global, handler) {
    if(!(this instanceof ForallHandler)) return new ForallHandler(contract, global, handler);
    else Handler.call(this);

    this.apply = function(target, thisArg, args) {
      var variables = new Proxy({length:TreatJS.Config.maxArgs}, new VariableHandler(handler));
      var contract = constructContract(forall.constructor, variables, global);
      var contracted = assertWith(target, contract, global, handler);

      return contracted.apply(thisArg, args);
    };
    this.construct = function(target, args) {
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };
  }
  ForallHandler.prototype = Object.create(Handler.prototype);

  function VariableHandler(handler) {
    if(!(this instanceof VariableHandler)) return new VariableHandler(handler);
    else Handler.call(this);

    this.has = function(target, name) {
      return true;
    }

    this.get = function(target, name, receiver) {
      return (name==="length") ? target.length : new Variable();
    };
  }
  VariableHandler.prototype = Object.create(Handler.prototype);

  function PolymorphicHandler(handler) {
    if(!(this instanceof PolymorphicHandler)) return new PolymorphicHandler(handler);
    else Handler.call(this);

    this.get = function(target, name, receiver) {
      handler(TreatJS.Callback.Handle(False, True));
    };
  }
  PolymorphicHandler.prototype = Object.create(Handler.prototype);






  function EffectHandler(id) {
    if(!(this instanceof EffectHandler)) return new EffectHandler(id);
    else Handler.call(this);

    var listener = [];

    this.get = function(target, name, receiver) {
      notify(TreatJS.Effect.Get(target, id, name));
      return target[name];
    }

    this.set = function(target, name, value, receiver) {
      notify(TreatJS.Effect.Set(target, id, name));
      return target[name]=value;
    }

    this.apply = function(target, thisArg, argumentsArg) {
      notify(TreatJS.Effect.Call(target, id));
      var result = target.apply(thisArg, argumentsArg);
      notify(TreatJS.Effect.Return(target, id));
      return result;
    };
    this.construct = function(target, thisArg, argumentsArg) {
      notify(TreatJS.Effect.Construct(target, id));
      var obj = Object.create(target.prototype);
      this.apply(target, this, args);
      return obj;
    };

    Object.defineProperties(this, {
      "register": {
        value: function(callback) {
          listener.push(callback);
        }
      }
    });

    function notify(effect) {
      for(var i=0; i<listener.length; i++) {
        listener[i](effect);
      }
    }
  }
  EffectHandler.prototype = Object.create(Handler.prototype);




  // _  _ _ ___ __ ___ _ __ _ _ __ 
  //| || | ' \ V  V / '_/ _` | '_ \
  // \_,_|_||_\_/\_/|_| \__,_| .__/
  //                         |_|   

  function unwrap(origin) {
    // TODO
    //print("### call upwrap");
    if(!ccache.has(origin)) return origin;
    //print("### unwrap " + contractOf(origin));

    var assertion = ccache.get(origin);
    return unwrap(assertion.target);
  }

  //       _                              _               _      
  // _ __ (_)_ _ _ _ ___ _ _   __ ___ _ _| |_ __ _ _ _ __| |_ ___
  //| '  \| | '_| '_/ _ \ '_| / _/ _ \ ' \  _/ _` | '_/ _|  _(_-<
  //|_|_|_|_|_| |_| \___/_|   \__\___/_||_\__\__,_|_| \__|\__/__/

  function mirrorPickyFunction(origin, target) {
    log("mirror function", "(picky semanticts)");
    if(!ccache.has(origin)) return target;

    var assertion = ccache.get(origin);
    var contracted = mirrorPickyFunction(assertion.target, target);

    return assertContract(contracted, assertion.contract, assertion.global, assertion.callbackHandler);
  }

  function mirrorIndyFunction(origin, target) {
    log("mirror function", "(indy semanticts)");
    if(!ccache.has(origin)) return target;

    var assertion = ccache.get(origin);
    var contracted = mirrorIndyFunction(assertion.target, target);

    function callback(handle) {
      checkBlameState(handle, assertion.contract, contracted, lastContext());
    }
    var root = RootCallback(callback);
    var callback = new SwitchCallback(assertion.callbackHandler, root.rootHandler);

    return assertContract(contracted, assertion.contract, assertion.global, callback.subHandler);
  }

  function mirrorLaxObject(origin) {
    log("mirror object", "(lax semanticts)");
    if(!ccache.has(origin)) return origin;

    var assertion = ccache.get(origin);

    return mirrorLaxObject(assertion.target);
  }

  function mirrorFunction(origin, target) {
    if(TreatJS.Config.semantics===TreatJS.LAX) {
      return target;
    } else if(TreatJS.Config.semantics===TreatJS.PICKY) {
      return mirrorPickyFunction(origin, target);
    } else if (TreatJS.Config.semantics===TreatJS.INDY) {
      return mirrorIndyFunction(origin, target);
    } else {
      return error("Undefined mirror semantics", (new Error()).fileName, (new Error()).lineNumber);
    }
  }

  function mirrorObject(origin) {
    if(TreatJS.Config.semantics===TreatJS.LAX) {
      return mirrorLaxObject(origin); 
    } else if(TreatJS.Config.semantics===TreatJS.PICKY) {
      return origin; 
    } else if (TreatJS.Config.semantics===TreatJS.INDY) {
      // Note: Indy setting not required because 
      // sandboxed guarantees non-interference and thus
      // no write access (context) is allowed.
      return origin; 
    } else {
      return error("Undefined mirror semantics", (new Error()).fileName, (new Error()).lineNumber);
    }
  }

  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("assert", assert);
  TreatJS.extend("assertWith", assertWith);

  TreatJS.extend("construct", construct);

  TreatJS.extend("Global", Global);

  TreatJS.extend("checkBlameState", checkBlameState);

  TreatJS.extend("mirrorFunction", mirrorFunction);
  TreatJS.extend("mirrorObject", mirrorObject);

  TreatJS.extend("contractOf", contractOf);
  TreatJS.extend("contracted", contracted);

})(TreatJS);