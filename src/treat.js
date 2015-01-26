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

// _____             _      _ ___ 
//|_   _| _ ___ __ _| |_ _ | / __|
//  | || '_/ -_) _` |  _| || \__ \
//  |_||_| \___\__,_|\__|\__/|___/
//                                
//  ___ _     _          _    ___  _     _        _   
// / __| |___| |__  __ _| |  / _ \| |__ (_)___ __| |_ 
//| (_ | / _ \ '_ \/ _` | | | (_) | '_ \| / -_) _|  _|
// \___|_\___/_.__/\__,_|_|  \___/|_.__// \___\__|\__|
//                                    |__/            
function TreatJS(configuration) {
  if(!(this instanceof TreatJS)) return new TreatJS(configuration);

  var version = "TreatJS 1.2.15";

  Object.defineProperties(this, {
    "version": {
      get: function () { return version; } }
  });
}

TreatJS.prototype = {};
TreatJS.prototype.toString = (function() { return '[[TreatJS]]'; });

TreatJS.prototype.configure = function(configuration) {
  for(setting in configuration) {
    this.Config[setting] = configuration[setting];
  } 
};

TreatJS.prototype.verbose = function(configuration) {
  for(setting in configuration) {
    this.Config.Verbose[setting] = configuration[setting];
  } 
}

// TreatJS
var TreatJS = new TreatJS();
