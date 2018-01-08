Array.prototype.addressOf = function (needle) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == needle) {
            return i;
        }
    }
    return -1;
}
var generate = function (noAtoms, noClauses) {
    var atoms = [];
    var clauses = [];

    //create atoms with random value and negation and random name
    for (var i = 0; i < noAtoms; i++) {
        var name = makeid();

        //cant have same names
        for (var j = 0; j < atoms.length; j++) {
            if (name == atom.name) {
                name = makeid();
                j = 0;
            }
        }

        atoms[i] = new atom((Math.random() > 0.5), makeid());
    }

    //build clauses out of randomly chosen atoms
    for (var i = 0; i < noClauses; i++) {
        var first = Math.floor(Math.random() * atoms.length);
        var firstNeg = Math.random() > 0.5;
        var second = Math.floor(Math.random() * atoms.length);
        var secondNeg = Math.random() > 0.5;
        var third = Math.floor(Math.random() * atoms.length);
        var thirdNeg = Math.random() > 0.5;
        clauses[i] = new clause(atoms[first], firstNeg, atoms[second], secondNeg, atoms[third], thirdNeg);
    }

    return clauses;
};


function clause(x, xn, y, yn, z, zn) {
    this.first = x;
    this.firstNeg = xn;
    this.second = y;
    this.secondNeg = yn;
    this.third = z;
    this.thirdNeg = zn;
    this.evaluate = evaluateClause;
}

function atom(val, name) {
    this.value = val;
    this.name = name;
}

function evaluateClause() {
    return xor(this.firstNeg, this.first.value) ||
        xor(this.secondNeg, this.second.value) ||
        xor(this.thirdNeg, this.third.value);
}

function xor(x, y) {
    return x ? !y : y;
}

//generate random name
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function walksat(clauses, p, max_flips) {
    var test;
    for (var i = 1; i < max_flips; i++) {
        test = 1;
        falseClauses = [];
        for (let j = 0; j < clauses.length; j++) {
            if (!clauses[j].evaluate()) {
                test = 0;
                falseClauses.push(clauses[j]);
            }
        }

        if (test) {
            return clauses;
        }

        if (Math.random() > p) {
            var satisfied = 0;
            var maxSatisfied
            var toFlip;
            var tempClauses = [];
            var atomFlip;
            for (let j = 0; j < falseClauses.length; j++) {
                tempClauses = falseClauses;
                flipFirst(tempClauses, j);
                if ((satisfied = countSatisfied(tempClauses)) > maxSatisfied) {
                    toFlip = j;
                    maxSatisfied = satisfied;
                    atomFlip = 0;
                }

                tempClauses = falseClauses;
                flipSecond(tempClauses, j);
                if ((satisfied = countSatisfied(tempClauses)) > maxSatisfied) {
                    toFlip = j;
                    maxSatsified = satisfied;
                    atomFlip = 1;
                }

                tempClauses = falseClauses;
                flipThird(tempClauses, j);
                if ((satisfied = countSatisfied(tempClauses)) > maxSatisfied) {
                    toFlip = j;
                    maxSatisfied = satisfied;
                    atomFlip = 2;
                }
            }
            flip(clauses, clauses.addressOf(falseClauses[toFlip]), atomFlip);
        } else {
            flip(clauses, clauses.addressOf(falseClauses[Math.floor(Math.random() * falseClauses.length)]), Math.floor(Math.random() * 3));
        }
    }
    return false;
}

function countSatisfied(clauses) {
    var count = 0;
    for (var i = 0; i < clauses.length; i++) {
        if (clauses[i].evaluate()) {
            count++;
        }
    }
    return count;
}

function flipFirst(clauses, i) {
    clauses[i].first.value = !clauses[i].first.value;
}

function flipSecond(clauses, i) {
    clauses[i].second.value = !clauses[i].second.value;
}

function flipThird(clauses, i) {
    clauses[i].third.value = !clauses[i].third.value;
}

function flip(clauses, toFlip, atom) {
    switch (atom) {
        case 0:
            flipFirst(clauses, toFlip);
            break;
        case 1:
            flipSecond(clauses, toFlip);
            break;
        case 2:
            flipThird(clauses, toFlip);
            break
    }
    return atom;
}

cvalues = []
for (let i = 1; i < 11; i++) {
    cvalues[i - 1] = (i * 20);
}

//console.log(cvalues);

counts = [0,0,0,0,0,0,0,0,0,0];
times = [[],[],[],[],[],[],[],[],[],[]]
for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 50; i++) {
        
        var begin = Date.now();
        var result = (walksat(generate(20,cvalues[j]), 0.1, 100000));
        var end = Date.now();

        times[j]    .push(end-begin);

        if (result){
            counts[j] = counts[j] + 1;
            console.log("true\n");
        }
    }
}

for(let i = 0; i < times.length; i++){
    times[i].sort();
    times[i] = (times[i][times[i].length/2])^2;
}
console.log(times +',' +  counts);
//console.log(walksat(generate(20, 200), 0.2, 1000));
