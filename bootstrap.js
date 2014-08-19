/*
 * TreatJS: Higher-Order Contracts for JavaScript 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// ___ ___ _  _ _ _ __ ___ 
//(_-</ _ \ || | '_/ _/ -_)
///__/\___/\_,_|_| \__\___|

// libraries
load("lib/lib_padding.js");

// base source files
load("src/out.js");
load("src/debugger.js");
load("src/treat.js");
load("src/treat.system.js");
load("src/treat.base.js");
load("src/treat.config.js");

// core api
load("src/core/treat.violation.js");
load("src/core/treat.sandbox.js");
load("src/core/treat.logic.js");
load("src/core/treat.callback.js");
load("src/core/treat.map.js");
load("src/core/treat.contract.js");
load("src/core/treat.assert.js");
load("src/treat.canonicalize.js");

// convenience api
load("src/treat.convenience.js");

//            _               _      
// __ ___ _ _| |_ _ _ __ _ __| |_ ___
/// _/ _ \ ' \  _| '_/ _` / _|  _(_-<
//\__\___/_||_\__|_| \__,_\__|\__/__/

load("test/contracts.js");

//              __ _                    _   _          
// __ ___ _ _  / _(_)__ _ _  _ _ _ __ _| |_(_)___ _ _  
/// _/ _ \ ' \|  _| / _` | || | '_/ _` |  _| / _ \ ' \ 
//\__\___/_||_|_| |_\__, |\_,_|_| \__,_|\__|_\___/_||_|
//                  |___/                              

// set Contract
var Contract = TreatJS.build();
TreatJS.export(this);

// set configuration
TreatJS.configure({
  assertion:true,
  membrabe:true,
  decompile:true,
  canonicalize: true 
});

// set verbose
TreatJS.verbose({
  assert:true,
  sandbox:false
});

// ==================================================
// Aliase - for compatibility with older versions
var IsNumber = typeOfNumber;
var IsString = typeOfString;
var IsBoolean = typeOfBoolean;
var IsObject = typeOfObject;
var IsFunction = typeOfFunction;

var IsNaN = isNaN;
var IsUndef = isUndefined;
var IsNull = isNull;

var InstanceOfFunction = instanceOfFunction;
var InstanceOfObject = instanceOfObject;
var InstanceOfArray = instanceOfArray;
var InstanceOfTarget = instanceOfTarget;

var True = isTrue;
var False = isFalse;

var IsArray = instanceOfArray;

var _ = TreatJS;

var GreaterThanZero = Contract.Base ( function(x) { return (x>0); }, "GreaterThanZero" );

/*
// blame
run("test/blame/base.js");
run("test/blame/immediate.js");
run("test/blame/delayed.js");


run("test/blame/function.js");
run("test/blame/dependent.js");
run("test/blame/object.js");
run("test/blame/object2.js");
run("test/blame/method.js");

run("test/blame/intersection.js");
run("test/blame/union.js");
run("test/blame/negation.js");

run("test/blame/or.js");
run("test/blame/and.js");
run("test/blame/not.js");

print("...");
*/



//quit();

//load("examples/intersection.js");
//load("examples/recursion.js");

//load("examples/tailrecursion.js");

//load("examples/typeof.js");
//load("examples/between.js");
//load("examples/evenodd.js");

load("examples/boolean.js");

quit();














quit();
















// quit();
// ==================================================


// quit();
// ==================================================

// predicates are nor ables to throw violations in function contarcts
// base and object contarcts ?
var f = Contract.assert(function (x) {

 // Contract.assert(1, typeOfNumber);

  return (x+1);
}, Contract.AFunction([typeOfNumber], typeOfNumber));

var o = Contract.assert({x:"1"}, Contract.AObject({x:typeOfNumber}));



var predicate = function (x) {

  //Contract.assert(true, Contract.Base(function() {return false;}) );

  C("1");

  //o.x;
  f("1");
  return true;
}

var flat = Contract.Base(predicate, "true");
var withf = Contract.With({f:f, o:o, Contract:Contract, C:f}, flat);

var x = Contract.assert(1, withf);

// quit();
// ==================================================

// quit();
// ==================================================

quit();
