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


print(TreatJS);
print(TreatJS.version);

print(Contract);
print(Contract.version);

print(TreatJS.Contract);


//print(TreatJS.TreatJS.Core);




(function() {

  

  function dump(path, package) {
    for (var name in package) {
      print(`${path} . ${name}`);
      dump(`${path} . ${name}`, package[name]);
    }    
  }
  
  print("\n\n::: TreatJS");
  dump("TreatJS", TreatJS);

})();


(function() {

  print("\n\n::: Contract");
  for (var name in Contract) {
    print(`Contarct . ${name}`);
  }

})();




function A() {}; A.prototype.constructor = A;
function B() {}; B.prototype.constructor = B;
function C() {}; C.prototype.constructor = C;

var x = new B();
print(x instanceof B);

switch(x.constructor) {

  case A:
    print("A");
    break;

  case B:
    print("B");
    break;

  case C:
    print("C");
    break

}







//print(TreatJS.Callback.Function);
//print(TreatJS.assertWith);


//load("test/sugar/test.js");

//quit();





// ==================================================

//TreatJS.Statistic.print();

// ==================================================

quit();
