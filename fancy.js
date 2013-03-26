
/**
 * Copyright 2013 Alex Rohde
 * todo - improve tutorial (add: also improved the way mapping on objects works, and filtering)
 *  document meld & others
 *
 * Reiterate the 4 ways to declare a function in osteele
 * - just an operator
 * - operator & param
 * - variable notation
 * - arrow notation
 *
 * Clarify that I have altered osteele's library, specifically I have not called install, replaced _ with underscore.js, and
 *   prevented it from altering function.prototype
 *
 * Discuss performance briefly
 * --
 * Time the library for include time (after minifaction). if slow >.05 ms, then try a build solution
 * In a fashion where this library can build itself.
 *
 *
 *
 * //my added functions:
 // Obj: mapObj, filterObj, selectObj, rejectObj, meld
 // Array: sameContents, hasAll, chunk
 * makeArray
 *
 * @param input
 * @return {*}
 * @constructor
 */
"use strict";
var FancyObject, FancyArray, FancyFunction;
var FO, FA, FF;

(function() {
    var stringToFunction = _.memoize(Functional.lambda);
    /*
     var profileAlot = function(cb){
     var x = new Date().getTime();
     for (var y=0; y < 10000; y++)
     cb();
     return (new Date().getTime() - x)/ 1000;
     }
     /**/

    var compatibility_mode = false; //uses native arrays, to enable things like [1,2,3].concat(FA([1,4,5])). Discouraged, because it introduces an inconsistency with IE.
    var compatibility_mode_for_ie = compatibility_mode && false; //Discouraged, because it disallows writing over native prototype functions

    if (typeof _ === "undefined") {
        throw "This Library Requires Underscore.js";
    }
// todo oliver steele's library also defines underscore. I should use a different technique here...
    FancyFunction = FF = function(input){
        if (! (this instanceof FF))
            return new FF( input);

        if (typeof input == "string")
            input = stringToFunction(input);
        this.function = input;
        this.f = this.function;
    };

    //FF.prototype = exportedPrototype;

    FancyObject = FO = function(input) {
        if (! (this instanceof FancyObject))
            return new FancyObject( input);
        return this.setThisTo(input, this);
    };
    FancyObject.prototype = new Object;

    FancyObject.object = function(keys, vals) {
        return FO(_.object(keys,vals));
    }
    /**
     * Shallow
     * @param obj
     */
    FancyObject.prototype.setThisTo = function(obj) {
        var i;
        for (i in this) {
            if (this.hasOwnProperty(i))
                delete this[i];
        }
        for (i in obj) {
            if (obj.hasOwnProperty(i))
                this[i] = obj[i];
        }
        return this;
    };


    var AlexLibrary = {};
    AlexLibrary.filterObj = AlexLibrary.selectObj = function(obj, callback) {
        return obj.pairs().filter(function(a) { return callback(a[1], a[0]); }).object();
    };

    AlexLibrary.rejectObj = function(obj, callback) {
        return obj.pairs().reject(function(a) { return callback(a[1], a[0]); }).object();
    };

    AlexLibrary.mapObj = function(obj, callback) {
        return  obj.pairs().map(function(pair) { return [pair[0], callback(pair[1], pair[0])];}).object();
    };

    AlexLibrary.apply = function(obj, /* array */ vals, scope) {
        return obj.map(function(x) {
            if (typeof(x) == "string")
                x = stringToFunction(x);
            return x.apply(scope, vals); });
    };

    AlexLibrary.toTrueArray = function(arrayEsque) {
        return Array.prototype.constructor.apply(new Array, arrayEsque);
    };

    var getMerged = function() { //private, internal use only
        var result = {}; //build lookup table
        FA(arguments[0]).slice(1).map( function(obj){
                if (! (obj instanceof Array))
                    obj = [obj];
                FA(obj).map(function(val,key) {
                    result[val] = true;
                });
            }
        );
        return result;
    };

    AlexLibrary.difference = function(arrayEsque) {
        var toRemove = getMerged(arguments);
        return _.filter(arrayEsque, function(val, key){ return !toRemove.hasOwnProperty(val); });
    }

    /**
     * A cool code re-use pattern if I do say-so myself
     */
    var ref = function(reverse) {
        return function(obj, toRemove) {
            var objToRemove = getMerged(arguments);
            var copy = obj.rejectObj(function(val, key) { return reverse ^ objToRemove.hasOwnProperty(key); });
            return copy;
        };
    }

    AlexLibrary.omit = ref(false);
    AlexLibrary.pick = ref(true);

    /**
     * Compares two arrays, but doesn't care about order, types, or nested-ness
     * @param arrMe
     * @param arrayEsque
     * @return {Boolean}
     */
    AlexLibrary.sameContents = function(arrMe, arrayEsque) {
        return (arrMe.countBy().meld(FancyArray(arrayEsque).countBy(), "+-").filter().length == 0); //beautiful
    };

    AlexLibrary.concat = function(me) { //since native seems to break w/o compatibility mode
        var tmp = new FA(me);
        for (var x=1; x < arguments.length; x++)
            tmp.push.apply(tmp, arguments[x]);
        return tmp;
    };

    AlexLibrary.union = function (me) { //this only exists to compensate for the broken concat
        return FancyArray.prototype.concat.apply(FancyArray.prototype, arguments).uniq();
    }

    AlexLibrary.hasAll = function(/* array */ needle) {
        var summed = this.countBy().meld(FA(needle).countBy().mapObj("a*-1"), "a+b");
        return summed.values().every(">=0");
    };


    /**
     * combines two objects using a reducer for duplicates
     * @param targetObj
     * @param reducer
     */
    AlexLibrary.meld = function(me, targetObjs, reducer, filteringUnsets) {

        var result = new FancyObject({});
        if (!(targetObjs instanceof Array))
            targetObjs = [targetObjs];

        var allObjects = FancyArray(targetObjs);
        allObjects = allObjects.map(function(obj) { return FO(obj);});
        allObjects.push(me);

        var allKeys =FA.prototype.concat.apply(FA([]), allObjects.invoke("keys")).uniq();

        allKeys.map(function(key) {
            var resultArray = allObjects.pluck(key);
            if (filteringUnsets === true)
                resultArray=resultArray.filter(function(a) { return (typeof a !== "undefined");});
            else if (!filteringUnsets)
                resultArray = resultArray.map(function(a) { if (typeof a === "undefined") return 0; return a;});

            result[key] = resultArray.reduce(reducer);
        });
        return result;
    };

// Breaks an array into sub arrays of length = size
//this is begging to be rewritten as a right apply on divide composed with parseInt passed to _.groupBy
    AlexLibrary.chunk = function(me, size) {
        var tmp = [], x;
        for (x=0; x < me.length; x++) {
            tmp[parseInt(x/size)] = tmp[parseInt(x/size)] || FA();
            tmp[parseInt(x/size)].push(me[x]);
        }
        return tmp;
    };

    AlexLibrary.slice = function(me) {
        var extraArgs = Array.prototype.slice.call(arguments, 1);
        return Array.prototype.slice.apply(me, extraArgs);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    FancyArray = FA = function(/*Array*/ input) {
        if (! input )
            input = [];
        if (! (this instanceof FancyArray)) {
            if (input instanceof FancyArray)
                return input;
            return new FancyArray(input);
        }
        //perhaps put logic here checking constructor, error checking
        this.setThisTo(input);

        if (compatibility_mode) {
            var result = AlexLibrary.toTrueArray(input);
            if (typeof result.__proto__ == "object") {
                if (!compatibility_mode_for_ie)
                    return this;
                result.__proto__ = this.__proto__;
            } else {
                var x;
                for (x in FancyArray.prototype) {
                    if (!result[x])
                        result[x] = FancyArray.prototype[x];
                }
            }

            return result;
        }
        return this;
    };
    FancyArray.prototype = new Array; //should go right here.

    FA.prototype.toJSON = function() { return (this.toTrueArray()); };
    /**
     * Since we can't directly assign to this
     * @param arr
     */
    FancyArray.prototype.setThisTo = function(arr, thiss) {
        if (typeof arr === "string")
            arr = [arr];
        var args = [0, this.length].concat(FancyArray.makeArray(arr));
        Array.prototype.splice.apply(this, args );
        return this;
    };

    FancyArray.range = function () { return FancyArray(_.range.apply(_, arguments)); };
    FancyArray.make = function (i) { return new FancyArray(i); };
    FancyArray.makeArray = function(i) { return Array.prototype.slice.call(i, 0); };

    //var polyfillColl = ["each", "map", "reduce", "reduceRight", "find", "filter", "where", "findWhere", "reject", "every", "some", "contains", "invoke", "pluck", "max", "min", "sortBy", "groupBy", "countBy", "shuffle", "toArray", "size"];
    var polyfillColl = [{"name":"each", iterator: 1},{"name":"map", iterator:1},{"name":"reduce", iterator: 1},{"name":"reduceRight", iterator: 1},{"name":"find", iterator:1},{"name":"filter", iterator: 1, assumeIdentity: true},
        {"name":"where"},{"name":"findWhere"},{"name":"reject", iterator:1},{"name":"every", iterator: 1},{"name":"some", iterator: 1},
        {"name":"contains"},{"name":"invoke"},{"name":"pluck"},{"name":"max", iterator:1},{"name":"min", iterator:1},
        {"name":"sortBy", iterator:1},{"name":"groupBy", iterator: 1},{"name":"countBy", iterator: 1},{"name":"shuffle"},{"name":"toArray"},{"name":"size"}];

    var polyfillArr = [{"name":"first"},{"name":"initial"},{"name":"last"},{"name":"rest"},{"name":"compact"},
        {"name":"flatten"},{"name":"without"},{"name":"union"},{"name":"intersection"},
        {"name":"uniq", iterator: 2},{"name":"zip"},{"name":"object"},{"name":"indexOf"},{"name":"lastIndexOf"},{"name":"sortedIndex", iterator:2},{"name":"range"}];

    var polyfillObj = [{"name":"keys"},{"name":"values"},{"name":"pairs"},{"name":"invert"},{"name":"functions"},
        {"name":"extend"},{"name":"pick"},{"name":"omit"},{"name":"defaults"},{"name":"clone"},{"name":"tap"},{"name":"has"},
        {"name":"isEqual"},{"name":"isEmpty"},{"name":"isElement"},{"name":"isArray"},{"name":"isObject"},{"name":"isArguments"},
        {"name":"isFunction"},{"name":"isString"},{"name":"isNumber"},{"name":"isFinite"},{"name":"isBoolean"},{"name":"isDate"},
        {"name":"isRegExp"},{"name":"isNaN"},{"name":"isNull"},{"name":"isUndefined"}];

    var alexLibObj = [{"name": "pick"}, {"name": "omit"}, {"name": "mapObj", iterator: 1}, {"name": "filterObj", iterator: 1}, {name: "selectObj", iterator: 1}, {name: "rejectObj", iterator: 1}, {name: "meld", iterator: 2}];
    var alexLibArr = [ {name: "toTrueArray"}, {name:'apply', iterator: 1}, {name: "slice"}, {name: "sameContents"}, {name: "hasAll"}, {name: "chunk"}, {name: "difference"}];

    var osFuncs = [{name: "aritize"}, {name: "bind"}, {name: "compose"}, {name: "curry"}, {name: "flip"}, {name: "guard"}, {name: "ncurry"}, {name: "partial"}, {name: "prefilterAt"}, {name: "prefilterObject"}, {name: "prefilterSlice"}, {name: "rcurry"}, {name: "rncurry"}, {name: "saturate"}, {name: "sequence"}, {name: "toFunction"}, {name: "traced"}, {name: "uncurry"}];
    if (!compatibility_mode)
        alexLibArr.push({name: "concat"}, {name: "union"}); //without compatibility mode, the native version doesn't work
    // @todo I suspect this may be necessary for difference

    var x, polyfill = polyfillColl.concat(polyfillArr);

    function fillInWith(target, polyfill, otherLibrary) {
        var x;
       for (x in polyfill) {
            if (polyfill.hasOwnProperty(x)) {
                var func = polyfill[x];
                //if (! target.prototype[func.name])
                //overwrite the native prototype, cuz ours is better!
                target.prototype[func.name] = (function(funcSig) {
                    return function() {
                        var params = [this].concat(FancyArray.makeArray(arguments));
                        var result;
                        var replacer = funcSig.hasOwnProperty('iterator') && (funcSig.iterator-1);
                        if ((replacer !== false) && (typeof Functional != "undefined") && arguments.hasOwnProperty(replacer) && (typeof arguments[replacer] == "string") ){
                            params[replacer+1] = stringToFunction(arguments[replacer]);
                        }
                        if (!arguments.length && funcSig.assumeIdentity)
                            params.push(_.identity);

                        result = otherLibrary[funcSig.name].apply(otherLibrary, params);

                        if (funcSig.name == "toTrueArray") {
                            return result;
                        }
                        if (result.constructor.toString().indexOf(" Array()")>=0 ) //returned an array
                            return new FancyArray(result);
                        if (result.constructor.toString().indexOf(" Object()")>=0 ) //returned an object
                            return new FancyObject(result);
                        return result;
                    };
                })(func);
            }
        }
    }

    function fillIn2(target, list, source ) {
        var x;
        for (x in list)
            if (list.hasOwnProperty(x)) {
                target.prototype[list[x].name] = (function(x) {
                    return function() {
                        return FF(source[list[x].name].apply(this.f,arguments));
                    };
                })(x);
            }
    };

    fillIn2(FancyFunction, osFuncs, exportedPrototype);
    fillInWith(FancyArray, polyfill, _);
    fillInWith(FancyObject, polyfillColl.concat(polyfillObj), _);
    fillInWith(FancyObject, alexLibObj, AlexLibrary);
    fillInWith(FancyArray, alexLibArr, AlexLibrary);
})();