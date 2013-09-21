
/* jshint maxlen: 120, curly: false, boss: true */

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
        if (hasProp(defined, id))
            return defined[id];

        if (hasProp(waiting, id)) {
            delete waiting[id];
            return defined[id] = main.apply(undefined, waiting[id]);
        }

        throw new Error('No ' + id);
    };

    function main (id, dependencies, factory) {
        var deps = [],
            module, i, length;

        for (i = 0, length = dependencies.length; i < length; i++)
            deps.push(require(dependencies[i]));

        // FIXME: context should be defined[id]? seems like it in almond.js
        return (typeof factory === 'function') ? factory.apply(undefined, deps) : factory;
    }

    function hasProp (obj, prop) {
        return hasOwn.call(obj, prop);
    }

    define.amd = {};
})();
