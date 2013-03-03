/**
 * Subset of AMD API implementation to use for specific cases after optimized builds. YMMV.
 *
 * Borrowing freely from almond: https://github.com/jrburke/almond .
 *
 * API spec:
 * https://github.com/amdjs/amdjs-api/wiki/AMD
 *
 * Exposes
 * - define(id, dependencies, factory)
 * - require(id)
 *
 * Loading/execution of modules is deferred until required via the
 * top level require that kickstarts the dependency chain.
 *
 * ## does not
 * - support loader plugins
 * - support relative paths
 * - support special dependencies (i.e.  "require", "exports", or "module")
 * - support circular dependencies
 *
 * ## demands
 * - a single concatenated file with itself before the first define
 * - a top level require to the inital id after the last define
 * - all arguments are given to define (r.js fixes this nicely)
 *
 * Using hasOwnProperty to make sure we don't give back strange stuff
 * put in the Object prototype.
 *
 * NB: waiting props are not deleted after being defined; this should
 * not be a concern (?)
 *
 * NB: when running r.js the only call to be "able" to produce an error should
 * be the intial (r.js does not know of it if put there in wrap)
 *
**/

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
