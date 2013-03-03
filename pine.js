/**
 * Subset of AMD API implementation to use for specific cases after optimized builds. YMMV.
 *
 * API spec:
 * https://github.com/amdjs/amdjs-api/wiki/AMD
 *
 * Exposes
 * - define(id, dependencies, factory)
 * - require(id)
 *
 * Loading/execution of modules is deferred until required via the
 * top level require kickstarting the dependency chain.
 *
 * ## does not
 * - support loader plugins
 * - support relative paths
 * - support special dependencies (i.e.  "require", "exports", or "module")
 *
 * ## demands
 * - a single concatenated file with itself before the first define
 * - a top level require to the inital id after the last define
 * - all arguments are given to define (r.js fixes this nicely)
**/

var define, require;

(function(undefined) {
    'use strict';

    var waiting = {},
        defined = {};

    define = function(id, dependencies, factory) {
        waiting[id] = {
            dependencies: dependencies,
            factory: factory
        };
    };

    // the defined guard should be after the var for clarity? it's like that anyhow?
    // or is it simply the scope? and nothing else?
    require = function(id) {
        if (defined[id]) {
            return defined[id];
        }

        var spec = waiting[id],
            factory = spec.factory,
            depsIds = spec.dependencies,
            deps = [],
            module, _i, _len;

        for (_i = 0, _len = depsIds.length; _i < _len; _i++) {
            deps.push(require(depsIds[_i]));
        }

        module = (typeof factory === 'function') ? factory.apply(undefined, deps) : factory;

        return defined[id] = module;
    };

    define.amd = {};
})();
