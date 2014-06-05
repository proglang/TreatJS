var DeltaBlue = new BenchmarkSuite('DeltaBlue', [66118], [new Benchmark('DeltaBlue', true, false, 4400, deltaBlue)]);
Object.defineProperty(Object.prototype, 'inheritsFrom', {
    value: _wrap_(function (shuper) {
        var Inheriter = _wrap_(function () {
            });
        Inheriter.prototype = shuper.prototype;
        this.prototype = new Inheriter();
        this.superConstructor = shuper;
    })
});
var OrderedCollection = _wrap_(function () {
        this.elms = new Array();
    });
OrderedCollection.prototype.add = _wrap_(function (elm) {
    this.elms.push(elm);
});
OrderedCollection.prototype.at = _wrap_(function (index) {
    return this.elms[index];
});
OrderedCollection.prototype.size = _wrap_(function () {
    return this.elms.length;
});
OrderedCollection.prototype.removeFirst = _wrap_(function () {
    return this.elms.pop();
});
OrderedCollection.prototype.remove = _wrap_(function (elm) {
    var index = 0, skipped = 0;
    for (var i = 0; i < this.elms.length; i++) {
        var value = this.elms[i];
        if (value != elm) {
            this.elms[index] = value;
            index++;
        } else {
            skipped++;
        }
    }
    for (var i = 0; i < skipped; i++)
        this.elms.pop();
});
var Strength = _wrap_(function (strengthValue, name) {
        this.strengthValue = strengthValue;
        this.name = name;
    });
Strength.stronger = _wrap_(function (s1, s2) {
    return s1.strengthValue < s2.strengthValue;
});
Strength.weaker = _wrap_(function (s1, s2) {
    return s1.strengthValue > s2.strengthValue;
});
Strength.weakestOf = _wrap_(function (s1, s2) {
    return this.weaker(s1, s2) ? s1 : s2;
});
Strength.strongest = _wrap_(function (s1, s2) {
    return this.stronger(s1, s2) ? s1 : s2;
});
Strength.prototype.nextWeaker = _wrap_(function () {
    switch (this.strengthValue) {
    case 0:
        return Strength.WEAKEST;
    case 1:
        return Strength.WEAK_DEFAULT;
    case 2:
        return Strength.NORMAL;
    case 3:
        return Strength.STRONG_DEFAULT;
    case 4:
        return Strength.PREFERRED;
    case 5:
        return Strength.REQUIRED;
    }
});
Strength.REQUIRED = new Strength(0, 'required');
Strength.STONG_PREFERRED = new Strength(1, 'strongPreferred');
Strength.PREFERRED = new Strength(2, 'preferred');
Strength.STRONG_DEFAULT = new Strength(3, 'strongDefault');
Strength.NORMAL = new Strength(4, 'normal');
Strength.WEAK_DEFAULT = new Strength(5, 'weakDefault');
Strength.WEAKEST = new Strength(6, 'weakest');
var Constraint = _wrap_(function (strength) {
        this.strength = strength;
    });
Constraint.prototype.addConstraint = _wrap_(function () {
    this.addToGraph();
    planner.incrementalAdd(this);
});
Constraint.prototype.satisfy = _wrap_(function (mark) {
    this.chooseMethod(mark);
    if (!this.isSatisfied()) {
        if (this.strength == Strength.REQUIRED)
            alert('Could not satisfy a required constraint!');
        return null;
    }
    this.markInputs(mark);
    var out = this.output();
    var overridden = out.determinedBy;
    if (overridden != null)
        overridden.markUnsatisfied();
    out.determinedBy = this;
    if (!planner.addPropagate(this, mark))
        alert('Cycle encountered');
    out.mark = mark;
    return overridden;
});
Constraint.prototype.destroyConstraint = _wrap_(function () {
    if (this.isSatisfied())
        planner.incrementalRemove(this);
    else
        this.removeFromGraph();
});
Constraint.prototype.isInput = _wrap_(function () {
    return false;
});
var UnaryConstraint = _wrap_(function (v, strength) {
        UnaryConstraint.superConstructor.call(this, strength);
        this.myOutput = v;
        this.satisfied = false;
        this.addConstraint();
    });
UnaryConstraint.inheritsFrom(Constraint);
UnaryConstraint.prototype.addToGraph = _wrap_(function () {
    this.myOutput.addConstraint(this);
    this.satisfied = false;
});
UnaryConstraint.prototype.chooseMethod = _wrap_(function (mark) {
    this.satisfied = this.myOutput.mark != mark && Strength.stronger(this.strength, this.myOutput.walkStrength);
});
UnaryConstraint.prototype.isSatisfied = _wrap_(function () {
    return this.satisfied;
});
UnaryConstraint.prototype.markInputs = _wrap_(function (mark) {
});
UnaryConstraint.prototype.output = _wrap_(function () {
    return this.myOutput;
});
UnaryConstraint.prototype.recalculate = _wrap_(function () {
    this.myOutput.walkStrength = this.strength;
    this.myOutput.stay = !this.isInput();
    if (this.myOutput.stay)
        this.execute();
});
UnaryConstraint.prototype.markUnsatisfied = _wrap_(function () {
    this.satisfied = false;
});
UnaryConstraint.prototype.inputsKnown = _wrap_(function () {
    return true;
});
UnaryConstraint.prototype.removeFromGraph = _wrap_(function () {
    if (this.myOutput != null)
        this.myOutput.removeConstraint(this);
    this.satisfied = false;
});
var StayConstraint = _wrap_(function (v, str) {
        StayConstraint.superConstructor.call(this, v, str);
    });
StayConstraint.inheritsFrom(UnaryConstraint);
StayConstraint.prototype.execute = _wrap_(function () {
});
var EditConstraint = _wrap_(function (v, str) {
        EditConstraint.superConstructor.call(this, v, str);
    });
EditConstraint.inheritsFrom(UnaryConstraint);
EditConstraint.prototype.isInput = _wrap_(function () {
    return true;
});
EditConstraint.prototype.execute = _wrap_(function () {
});
var Direction = new Object();
Direction.NONE = 0;
Direction.FORWARD = 1;
Direction.BACKWARD = -1;
var BinaryConstraint = _wrap_(function (var1, var2, strength) {
        BinaryConstraint.superConstructor.call(this, strength);
        this.v1 = var1;
        this.v2 = var2;
        this.direction = Direction.NONE;
        this.addConstraint();
    });
BinaryConstraint.inheritsFrom(Constraint);
BinaryConstraint.prototype.chooseMethod = _wrap_(function (mark) {
    if (this.v1.mark == mark) {
        this.direction = this.v2.mark != mark && Strength.stronger(this.strength, this.v2.walkStrength) ? Direction.FORWARD : Direction.NONE;
    }
    if (this.v2.mark == mark) {
        this.direction = this.v1.mark != mark && Strength.stronger(this.strength, this.v1.walkStrength) ? Direction.BACKWARD : Direction.NONE;
    }
    if (Strength.weaker(this.v1.walkStrength, this.v2.walkStrength)) {
        this.direction = Strength.stronger(this.strength, this.v1.walkStrength) ? Direction.BACKWARD : Direction.NONE;
    } else {
        this.direction = Strength.stronger(this.strength, this.v2.walkStrength) ? Direction.FORWARD : Direction.BACKWARD;
    }
});
BinaryConstraint.prototype.addToGraph = _wrap_(function () {
    this.v1.addConstraint(this);
    this.v2.addConstraint(this);
    this.direction = Direction.NONE;
});
BinaryConstraint.prototype.isSatisfied = _wrap_(function () {
    return this.direction != Direction.NONE;
});
BinaryConstraint.prototype.markInputs = _wrap_(function (mark) {
    this.input().mark = mark;
});
BinaryConstraint.prototype.input = _wrap_(function () {
    return this.direction == Direction.FORWARD ? this.v1 : this.v2;
});
BinaryConstraint.prototype.output = _wrap_(function () {
    return this.direction == Direction.FORWARD ? this.v2 : this.v1;
});
BinaryConstraint.prototype.recalculate = _wrap_(function () {
    var ihn = this.input(), out = this.output();
    out.walkStrength = Strength.weakestOf(this.strength, ihn.walkStrength);
    out.stay = ihn.stay;
    if (out.stay)
        this.execute();
});
BinaryConstraint.prototype.markUnsatisfied = _wrap_(function () {
    this.direction = Direction.NONE;
});
BinaryConstraint.prototype.inputsKnown = _wrap_(function (mark) {
    var i = this.input();
    return i.mark == mark || i.stay || i.determinedBy == null;
});
BinaryConstraint.prototype.removeFromGraph = _wrap_(function () {
    if (this.v1 != null)
        this.v1.removeConstraint(this);
    if (this.v2 != null)
        this.v2.removeConstraint(this);
    this.direction = Direction.NONE;
});
var ScaleConstraint = _wrap_(function (src, scale, offset, dest, strength) {
        this.direction = Direction.NONE;
        this.scale = scale;
        this.offset = offset;
        ScaleConstraint.superConstructor.call(this, src, dest, strength);
    });
ScaleConstraint.inheritsFrom(BinaryConstraint);
ScaleConstraint.prototype.addToGraph = _wrap_(function () {
    ScaleConstraint.superConstructor.prototype.addToGraph.call(this);
    this.scale.addConstraint(this);
    this.offset.addConstraint(this);
});
ScaleConstraint.prototype.removeFromGraph = _wrap_(function () {
    ScaleConstraint.superConstructor.prototype.removeFromGraph.call(this);
    if (this.scale != null)
        this.scale.removeConstraint(this);
    if (this.offset != null)
        this.offset.removeConstraint(this);
});
ScaleConstraint.prototype.markInputs = _wrap_(function (mark) {
    ScaleConstraint.superConstructor.prototype.markInputs.call(this, mark);
    this.scale.mark = this.offset.mark = mark;
});
ScaleConstraint.prototype.execute = _wrap_(function () {
    if (this.direction == Direction.FORWARD) {
        this.v2.value = this.v1.value * this.scale.value + this.offset.value;
    } else {
        this.v1.value = (this.v2.value - this.offset.value) / this.scale.value;
    }
});
ScaleConstraint.prototype.recalculate = _wrap_(function () {
    var ihn = this.input(), out = this.output();
    out.walkStrength = Strength.weakestOf(this.strength, ihn.walkStrength);
    out.stay = ihn.stay && this.scale.stay && this.offset.stay;
    if (out.stay)
        this.execute();
});
var EqualityConstraint = _wrap_(function (var1, var2, strength) {
        EqualityConstraint.superConstructor.call(this, var1, var2, strength);
    });
EqualityConstraint.inheritsFrom(BinaryConstraint);
EqualityConstraint.prototype.execute = _wrap_(function () {
    this.output().value = this.input().value;
});
var Variable = _wrap_(function (name, initialValue) {
        this.value = initialValue || 0;
        this.constraints = new OrderedCollection();
        this.determinedBy = null;
        this.mark = 0;
        this.walkStrength = Strength.WEAKEST;
        this.stay = true;
        this.name = name;
    });
Variable.prototype.addConstraint = _wrap_(function (c) {
    this.constraints.add(c);
});
Variable.prototype.removeConstraint = _wrap_(function (c) {
    this.constraints.remove(c);
    if (this.determinedBy == c)
        this.determinedBy = null;
});
var Planner = _wrap_(function () {
        this.currentMark = 0;
    });
Planner.prototype.incrementalAdd = _wrap_(function (c) {
    var mark = this.newMark();
    var overridden = c.satisfy(mark);
    while (overridden != null)
        overridden = overridden.satisfy(mark);
});
Planner.prototype.incrementalRemove = _wrap_(function (c) {
    var out = c.output();
    c.markUnsatisfied();
    c.removeFromGraph();
    var unsatisfied = this.removePropagateFrom(out);
    var strength = Strength.REQUIRED;
    do {
        for (var i = 0; i < unsatisfied.size(); i++) {
            var u = unsatisfied.at(i);
            if (u.strength == strength)
                this.incrementalAdd(u);
        }
        strength = strength.nextWeaker();
    } while (strength != Strength.WEAKEST);
});
Planner.prototype.newMark = _wrap_(function () {
    return ++this.currentMark;
});
Planner.prototype.makePlan = _wrap_(function (sources) {
    var mark = this.newMark();
    var plan = new Plan();
    var todo = sources;
    while (todo.size() > 0) {
        var c = todo.removeFirst();
        if (c.output().mark != mark && c.inputsKnown(mark)) {
            plan.addConstraint(c);
            c.output().mark = mark;
            this.addConstraintsConsumingTo(c.output(), todo);
        }
    }
    return plan;
});
Planner.prototype.extractPlanFromConstraints = _wrap_(function (constraints) {
    var sources = new OrderedCollection();
    for (var i = 0; i < constraints.size(); i++) {
        var c = constraints.at(i);
        if (c.isInput() && c.isSatisfied())
            sources.add(c);
    }
    return this.makePlan(sources);
});
Planner.prototype.addPropagate = _wrap_(function (c, mark) {
    var todo = new OrderedCollection();
    todo.add(c);
    while (todo.size() > 0) {
        var d = todo.removeFirst();
        if (d.output().mark == mark) {
            this.incrementalRemove(c);
            return false;
        }
        d.recalculate();
        this.addConstraintsConsumingTo(d.output(), todo);
    }
    return true;
});
Planner.prototype.removePropagateFrom = _wrap_(function (out) {
    out.determinedBy = null;
    out.walkStrength = Strength.WEAKEST;
    out.stay = true;
    var unsatisfied = new OrderedCollection();
    var todo = new OrderedCollection();
    todo.add(out);
    while (todo.size() > 0) {
        var v = todo.removeFirst();
        for (var i = 0; i < v.constraints.size(); i++) {
            var c = v.constraints.at(i);
            if (!c.isSatisfied())
                unsatisfied.add(c);
        }
        var determining = v.determinedBy;
        for (var i = 0; i < v.constraints.size(); i++) {
            var next = v.constraints.at(i);
            if (next != determining && next.isSatisfied()) {
                next.recalculate();
                todo.add(next.output());
            }
        }
    }
    return unsatisfied;
});
Planner.prototype.addConstraintsConsumingTo = _wrap_(function (v, coll) {
    var determining = v.determinedBy;
    var cc = v.constraints;
    for (var i = 0; i < cc.size(); i++) {
        var c = cc.at(i);
        if (c != determining && c.isSatisfied())
            coll.add(c);
    }
});
var Plan = _wrap_(function () {
        this.v = new OrderedCollection();
    });
Plan.prototype.addConstraint = _wrap_(function (c) {
    this.v.add(c);
});
Plan.prototype.size = _wrap_(function () {
    return this.v.size();
});
Plan.prototype.constraintAt = _wrap_(function (index) {
    return this.v.at(index);
});
Plan.prototype.execute = _wrap_(function () {
    for (var i = 0; i < this.size(); i++) {
        var c = this.constraintAt(i);
        c.execute();
    }
});
var chainTest = _wrap_(function (n) {
        planner = new Planner();
        var prev = null, first = null, last = null;
        for (var i = 0; i <= n; i++) {
            var name = 'v' + i;
            var v = new Variable(name);
            if (prev != null)
                new EqualityConstraint(prev, v, Strength.REQUIRED);
            if (i == 0)
                first = v;
            if (i == n)
                last = v;
            prev = v;
        }
        new StayConstraint(last, Strength.STRONG_DEFAULT);
        var edit = new EditConstraint(first, Strength.PREFERRED);
        var edits = new OrderedCollection();
        edits.add(edit);
        var plan = planner.extractPlanFromConstraints(edits);
        for (var i = 0; i < 100; i++) {
            first.value = i;
            plan.execute();
            if (last.value != i)
                alert('Chain test failed.');
        }
    });
var projectionTest = _wrap_(function (n) {
        planner = new Planner();
        var scale = new Variable('scale', 10);
        var offset = new Variable('offset', 1000);
        var src = null, dst = null;
        var dests = new OrderedCollection();
        for (var i = 0; i < n; i++) {
            src = new Variable('src' + i, i);
            dst = new Variable('dst' + i, i);
            dests.add(dst);
            new StayConstraint(src, Strength.NORMAL);
            new ScaleConstraint(src, scale, offset, dst, Strength.REQUIRED);
        }
        change(src, 17);
        if (dst.value != 1170)
            alert('Projection 1 failed');
        change(dst, 1050);
        if (src.value != 5)
            alert('Projection 2 failed');
        change(scale, 5);
        for (var i = 0; i < n - 1; i++) {
            if (dests.at(i).value != i * 5 + 1000)
                alert('Projection 3 failed');
        }
        change(offset, 2000);
        for (var i = 0; i < n - 1; i++) {
            if (dests.at(i).value != i * 5 + 2000)
                alert('Projection 4 failed');
        }
    });
var change = _wrap_(function (v, newValue) {
        var edit = new EditConstraint(v, Strength.PREFERRED);
        var edits = new OrderedCollection();
        edits.add(edit);
        var plan = planner.extractPlanFromConstraints(edits);
        for (var i = 0; i < 10; i++) {
            v.value = newValue;
            plan.execute();
        }
        edit.destroyConstraint();
    });
var planner = null;
var deltaBlue = _wrap_(function () {
        chainTest(100);
        projectionTest(100);
    });