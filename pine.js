
/*jshint maxlen:120, curly:false*/

var define, require;

(function (undefined) {
    'use strict'; // go sloppy to save bytes? :)

    var waiting = {},
        defined = {},
        hasOwn = Object.prototype.hasOwnProperty;

    define = function (id, dependencies, factory) {
        waiting[id] = [id, dependencies, factory];
    };

    require = function (id) {
        return callDep(id);
    };

    function callDep (id) {
        if (hasProp(defined, id))
            return defined[id];

        if (hasProp(waiting, id))
            return main.apply(undefined, waiting[id]);

        throw new Error('No ' + id);
    }

    function main (id, dependencies, factory) {
        var deps = [],
            module, i, length;

        for (i = 0, length = dependencies.length; i < length; i++)
            deps.push(callDep(dependencies[i]));

        // context should be defined[id]? (so we have a context?) seems like it in almond.js
        module = (typeof factory === 'function') ? factory.apply(undefined, deps) : factory;

        return defined[id] = module;
    }

    function hasProp (obj, prop) {
        return hasOwn.call(obj, prop);
    }

    define.amd = {};
})();
