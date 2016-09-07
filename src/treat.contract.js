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

TreatJS.package("TreatJS.Contract", function (TreatJS, Contract, configuration) {

  // ___                ___         _               _   
  //| _ ) __ _ ___ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _ \/ _` (_-</ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\__,_/__/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function BaseContract(predicate, name) {
    if(!(this instanceof BaseContract)) return new BaseContract(...arguments);

    if(!(predicate instanceof Function))
      throw new TypeError("Invalid predicate");

    Object.defineProperties(this, {
      "predicate": {
        value: predicate // TODO, decompile
      },
      "name": {
        value: name
      }
    });
  }
  BaseContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  BaseContract.prototype.constructor = BaseContract;
  BaseContract.prototype.toString = function() {
    return this.name ? "#"+this.name : "[[TreatJS/BaseContract]]";
  };

  //  ___  _     _        _    ___         _               _   
  // / _ \| |__ (_)___ __| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | '_ \| / -_) _|  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_.__// \___\__|\__|\___\___/_||_\__|_| \__,_\__|\__|
  //          |__/                                             

  function ObjectContract(mapping, strict=false) { // TODO, mapping // todo, strict mode ?
    if(!(this instanceof ObjectContract)) return new ObjectContract(...arguments);

    if(!(map instanceof Object))
      throw new TypeError("Invalid mapping");

    Object.defineProperties(this, {
      "mapping": {
        value: mapping // doesten matter if array or object, as long 
      // as it is iteratebale with for(var name in {a:1,b:2})
      },
      "strict": {
        value: strict
      },
    });
  }
  ObjectContract.prototype = Object.create(TreatJS.Prototype.Immediate.prototype);
  ObjectContract.prototype.constructor = ObjectContract;
  ObjectContract.prototype.toString = function() {
    return this.mapping.toString();
    // TODO
    //var lbr = (this.map.strict) ? "{" : "|";
    //var rbr = (this.map.strict) ? "}" : "|";
    //return "(" + lbr + this.map.toString() + rbr + ")";
  };




  // ___          _   _   _          ___         _               _   
  //| __|  _ _ _ | |_| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _| || | ' \| / /  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_| \_,_|_||_|_\_\\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function FunctionContract(domain, range) {
    if(!(this instanceof Function)) return new FunctionContract(...arguments);

    if(!(domain instanceof TreastJS.Prototype.Contract))
      throw new TypeError("Invalid contract");
    if(!(range instanceof TreastJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "domain": {
        value: domain
      },
      "range": {
        value: range
      }
    });
  }
  FunctionContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  FunctionContract.prototype.constructor = FunctionContract;
  FunctionContract.prototype.toString = function() {
    return this.domain.toString() + "->" + this.range.toString();
  }; 

  // ___                        _         _    ___         _               _   
  //|   \ ___ _ __  ___ _ _  __| |___ _ _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |) / -_) '_ \/ -_) ' \/ _` / -_) ' \  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___/\___| .__/\___|_||_\__,_\___|_||_\__|\___\___/_||_\__|_| \__,_\__|\__|
  //         |_|                                                               

  function DependentContract(constructor) {
    if(!(this instanceof DependentContract)) return new DependentContract(...arguments);

    if(!(constructor instanceof TreatJS.Prototype.Constructor))
      throw new TypeError("Invalid constructor");

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  DependentContract.prototype = Object.create(TreatJS.Prototype.Delayed.prototype);
  DependentContract.prototype.constructor = DependentContract;

  DependentContract.prototype.toString = function() {
    return "(" + "*" + "-->" + this.constructor.toString() + ")";
  };

  // ___     _                      _   _          ___         _               _   
  //|_ _|_ _| |_ ___ _ _ ___ ___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \  _/ -_) '_(_-</ -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\__\___|_| /__/\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function IntersectionContract(left, right) { 
    if(!(this instanceof IntersectionContract)) return new IntersectionContract(...arguments);

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  IntersectionContract.prototype = Object.create(TreatJS.Prototype.Combinator.prototype);
  IntersectionContract.prototype.constructor = IntersectionContract;
  IntersectionContract.prototype.toString = function() {
    return "(" + this.first.toString() + ") - (" + this.second.toString() + ")";
  };

  // _   _      _          ___         _               _   
  //| | | |_ _ (_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| |_| | ' \| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/|_||_|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function UnionContract(left, right) { 
    if(!(this instanceof UnionContract)) return new UnionContract(...arguments);

    if(!(left instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");
    if(!(right instanceof TreatJS.Prototype.Contract))
      throw new TypeError("Invalid contract");

    Object.defineProperties(this, {
      "left": {
        value: left
      },
      "right": {
        value: right
      }
    });
  }
  UnionContract.prototype = Object.create(TreatJS.Prototype.Combinator.prototype);
  UnionContract.prototype.constructor = UnionContract;
  UnionContract.prototype.toString = function() {
    return "(" + this.first.toString() + ") + (" + this.second.toString() + ")";
  };

  // _____ ___ __  ___ _ _| |_ 
  /// -_) \ / '_ \/ _ \ '_|  _|
  //\___/_\_\ .__/\___/_|  \__|
  //        |_|                
/*
  TreatJS.export({
    Base:         BaseContract,
    Object:       ObjectContract,
    Function:     FunctionContract,
    Dependent:    DependentContract,
    Intersection: IntersectionContract,
    Union:        UnionContract
  }); */

  //         _                 
  // _ _ ___| |_ _  _ _ _ _ _  
  //| '_/ -_)  _| || | '_| ' \ 
  //|_| \___|\__|\_,_|_| |_||_|

  return {
    Base:         BaseContract,
    Object:       ObjectContract,
    Function:     FunctionContract,
    Dependent:    DependentContract,
    Intersection: IntersectionContract,
    Union:        UnionContract
  };

});



// OLD

(function(TreatJS) {





  var error = TreatJS.error;
  var violation = TreatJS.violation;
  var blame = TreatJS.blame;

  var Map = TreatJS.Map.Map;
  var StringMap = TreatJS.Map.StringMap;

  var Variable = TreatJS.Polymorphism.Variable;

  var Contract = TreatJS.Core.Contract;

  var ImmediateContract = TreatJS.Core.Immediate;
  var DelayedContract = TreatJS.Core.Delayed;
  var CombinatorContract = TreatJS.Core.Combinator;
  var WrapperContract = TreatJS.Core.Wrapper;

  var Constructor = TreatJS.Core.Constructor;

  //  _____            _                  _       
  // / ____|          | |                | |      
  //| |     ___  _ __ | |_ _ __ __ _  ___| |_ ___ 
  //| |    / _ \| '_ \| __| '__/ _` |/ __| __/ __|
  //| |___| (_) | | | | |_| | | (_| | (__| |_\__ \
  // \_____\___/|_| |_|\__|_|  \__,_|\___|\__|___/




  function BaseContractContract(predicate, name) {
    if(!(this instanceof BaseContractContract)) return new BaseContractContract(predicate, name);

    if(!(predicate instanceof Function)) 
      error("Invalid Function Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "predicate": {
        value: predicate
      },
      "name": {
        value: name
      }
    });
  }
  BaseContractContract.prototype = Object.create(ImmediateContract.prototype);
  BaseContractContract.prototype.toString = function() {
    return (this.name!=undefined) ? "#"+this.name : "[[TreatJS/BaseContractContract]]";
    // TODO, cleanup
    //"[" + ((this.name!=undefined) ? this.name : this.predicate.toString()) + "]";
  };


  //  ___             _               _            ___         _               _   
  // / __|___ _ _  __| |_ _ _ _  _ __| |_ ___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (__/ _ \ ' \(_-<  _| '_| || / _|  _/ _ \ '_| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___\___/_||_/__/\__|_|  \_,_\__|\__\___/_|  \___\___/_||_\__|_| \__,_\__|\__|

  // TODO
  function ConstructorContract(contract) {
    if(!(this instanceof ConstructorContract)) return new ConstructorContract(contract);

    if(!(contract instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "contract": {
        value: contract
      }
    });
  }
  ConstructorContract.prototype = Object.create(DelayedContract.prototype);
  ConstructorContract.prototype.toString = function() {
    return "(" + "" + "-->" + this.contract.toString() + ")";
  };




  // ___      __ _        _   _          ___         _               _   
  //| _ \___ / _| |___ __| |_(_)___ _ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_)  _| / -_) _|  _| / _ \ ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___|_| |_\___\__|\__|_\___/_||_\___\___/_||_\__|_| \__,_\__|\__|

  function ReflectionContract(trap, sub) {
    if(!(this instanceof ReflectionContract)) return new ReflectionContract(trap, sub);

    if((typeof trap)!=="string")
      error("Invalid Trap Argument", (new Error()).fileName, (new Error()).lineNumber); 
    if(!(sub instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "trap": {
        value: trap
      },
      "sub": {
        value: sub
      }
    });
  }
  ReflectionContract.prototype = Object.create(ImmediateContract.prototype);
  ReflectionContract.prototype.toString = function() {
    return "(" + this.trap + " @ " + this.sub.toString() + ")";
  };

  // ___      ___         _               _   
  //|_ _|_ _ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // | || ' \ (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|___|_||_\___\___/_||_\__|_| \__,_\__|\__|

  function InContract(id) {
    if(!(this instanceof InContract)) return new InContract(id);

    if(!(id instanceof Variable))
      error("Invalid Identifier Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "id": {
        value: id
      }
    });
  }
  InContract.prototype = Object.create(ImmediateContract.prototype);
  InContract.prototype.toString = function() {
    return "(in(" + this.id.toString() + "))";
  };

  //  ___       _    ___         _               _   
  // / _ \ _  _| |_ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| (_) | || |  _| (__/ _ \ ' \  _| '_/ _` / _|  _|
  // \___/ \_,_|\__|\___\___/_||_\__|_| \__,_\__|\__|

  function OutContract(id) {
    if(!(this instanceof OutContract)) return new OutContract(id);

    if(!(id instanceof Variable))
      error("Invalid Identifier Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "id": {
        value: id
      }
    });
  }
  OutContract.prototype = Object.create(ImmediateContract.prototype);
  OutContract.prototype.toString = function() {
    return "(out(" + this.id.toString() + "))";
  };

  // ___             _ _  ___         _               _   
  //| __|__ _ _ __ _| | |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //| _/ _ \ '_/ _` | | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\___/_| \__,_|_|_|\___\___/_||_\__|_| \__,_\__|\__|

  function ForallContract(constructor) {
    if(!(this instanceof ForallContract)) return new ForallContract(constructor);

    if(!(constructor instanceof Constructor))
      error("Invalid Constructor Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  ForallContract.prototype = Object.create(DelayedContract.prototype);
  ForallContract.prototype.toString = function() {
    return "(forall " + this.constructor.toString() + ")";
  }

  // ___                    _          ___         _               _   
  //| _ \___ __ _  _ _ _ __(_)_ _____ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //|   / -_) _| || | '_(_-< \ V / -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|_\___\__|\_,_|_| /__/_|\_/\___|\___\___/_||_\__|_| \__,_\__|\__|

  function RecursiveContract(constructor) {
    if(!(this instanceof RecursiveContract)) return new RecursiveContract(constructor);

    if(!(constructor instanceof Constructor))
      error("Invalid Constructor Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  RecursiveContract.prototype = Object.create(ImmediateContract.prototype);
  RecursiveContract.prototype.toString = function() {
    return "(recursive " + this.constructor.toString() + ")";
  }

  // _  _                 ___         _               _   
  //| \| |__ _ _ __  ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  //| .` / _` | '  \/ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //|_|\_\__,_|_|_|_\___|\___\___/_||_\__|_| \__,_\__|\__|

  function NameContract(symbol, contract) {
    if(!(this instanceof NameContract)) return new NameContract(symbol, contract);

    if(!(symbol instanceof TreatJS.Symbol.Symbol))
      error("Wrong Symbol Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "symbol": {
        value: symbol
      },
      "contract": {
        value: contract
      }
    });
  }
  NameContract.prototype = Object.create(ImmediateContract.prototype);
  NameContract.prototype.toString = function() {
    return "(" + this.symbol.toString() + ":" + this.contract.toString() + ")";
  };

  //__      ___                 ___         _               _   
  //\ \    / / |_  ___ _ _ ___ / __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ \/\/ /| ' \/ -_) '_/ -_) (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  \_/\_/ |_||_\___|_| \___|\___\___/_||_\__|_| \__,_\__|\__|

  function WhereContract(behaviour, temporal) {
    if(!(this instanceof WhereContract)) return new WhereContract(behaviour, temporal);

    if(!(behaviour instanceof Contract))
      error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);
    if(!(temporal instanceof TemporalContract))
      error("Invalid Temporal Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "behaviour": {
        value: behaviour
      },
      "temporal": {
        value: temporal
      }
    });
  }
  WhereContract.prototype = Object.create(ImmediateContract.prototype);
  WhereContract.prototype.toString = function() {
    return "(" + this.behaviour.toString() + " | " + this.temporal.toString() + ")";
  };

  // _____                             _  ___         _               _   
  //|_   _|__ _ __  _ __  ___ _ _ __ _| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  //  | |/ -_) '  \| '_ \/ _ \ '_/ _` | | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  |_|\___|_|_|_| .__/\___/_| \__,_|_|\___\___/_||_\__|_| \__,_\__|\__|
  //               |_|                                                    

  function TemporalContract(symbols, constructor, name) {
    if(!(this instanceof TemporalContract)) return new TemporalContract(symbols, constructor);
    else TreatJS.Core.Contract.apply(this);

    if(!(constructor instanceof Function))
      error("Invalid Function Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "symbols": {
        value: symbols
      },
      "constructor": {
        value: constructor
      },
      "name": {
        value: name
      }
    });
  }
  TemporalContract.prototype = Object.create(TreatJS.Core.Contract.prototype);
  TemporalContract.prototype.toString = function() {
    return (this.name!=undefined) ? "%"+this.name : "[[TreatJS/Temporal]]";
  }

  //__   ___     _    _  ___         _               _   
  //\ \ / (_)___| |__| |/ __|___ _ _| |_ _ _ __ _ __| |_ 
  // \ V /| / -_) / _` | (__/ _ \ ' \  _| '_/ _` / _|  _|
  //  |_| |_\___|_\__,_|\___\___/_||_\__|_| \__,_\__|\__|

  function YieldContract(constructor) {
    if(!(this instanceof YieldContract)) return new YieldContract(constructor);
    else TreatJS.Core.Constructor.apply(this);

    if(!(constructor instanceof TreatJS.Core.Constructor))
      error("Invalid Constructor Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "constructor": {
        value: constructor
      }
    });
  }
  YieldContract.prototype = Object.create(TreatJS.Core.Constructor.prototype);
  YieldContract.prototype.toString = function() {
    return "(yield " + this.constructor.toString() + ")";
  }



  // or function
  function InvariantContract(contract) {
    if(!(this instanceof InvariantContract)) return new InvariantContract(contract);
    else TreatJS.Core.Constructor.apply(this);

    // TODO
    //if(!(constructor instanceof BaseContractContract))
    //  error("Invalid Contract Argument", (new Error()).fileName, (new Error()).lineNumber);

    Object.defineProperties(this, {
      "contract": {
        value: contract
      }
    });
  }
  InvariantContract.prototype = Object.create(TreatJS.Core.Constructor.prototype);
  InvariantContract.prototype.toString = function() {
    return "(invariant " + this.contract.toString() + ")";
  }





  //         _               _ 
  // _____ _| |_ ___ _ _  __| |
  /// -_) \ /  _/ -_) ' \/ _` |
  //\___/_\_\\__\___|_||_\__,_|

  TreatJS.extend("Contract", {});

  TreatJS.define(TreatJS.Contract, "BaseContract", BaseContractContract);

  TreatJS.define(TreatJS.Contract, "Function", FunctionContract);
  TreatJS.define(TreatJS.Contract, "Method", MethodContract);
  TreatJS.define(TreatJS.Contract, "Constructor", ConstructorContract);
  TreatJS.define(TreatJS.Contract, "DependentContract", DependentContractContract);
  TreatJS.define(TreatJS.Contract, "Object", ObjectContract);

  TreatJS.define(TreatJS.Contract, "With", WithContract);

  TreatJS.define(TreatJS.Contract, "And", AndContract);
  TreatJS.define(TreatJS.Contract, "Or", OrContract);
  TreatJS.define(TreatJS.Contract, "Not", NotContract);

  TreatJS.define(TreatJS.Contract, "IntersectionContract", IntersectionContractContract);
  TreatJS.define(TreatJS.Contract, "UnionContract", UnionContractContract);
  TreatJS.define(TreatJS.Contract, "Negation", NegationContract);

  TreatJS.define(TreatJS.Contract, "Reflection", ReflectionContract);

  TreatJS.define(TreatJS.Contract, "In", InContract);
  TreatJS.define(TreatJS.Contract, "Out", OutContract);

  TreatJS.define(TreatJS.Contract, "Forall", ForallContract);
  TreatJS.define(TreatJS.Contract, "Recursive", RecursiveContract);

  TreatJS.define(TreatJS.Contract, "Name", NameContract);
  TreatJS.define(TreatJS.Contract, "Where", WhereContract);
  TreatJS.define(TreatJS.Contract, "Temporal", TemporalContract);
  TreatJS.define(TreatJS.Contract, "Yield", YieldContract);

  TreatJS.define(TreatJS.Contract, "Invariant", InvariantContract);

});