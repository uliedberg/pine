pine
====

Minimal synchronous (!) subset of AMD API implementation for very controlled
situations with concatenated builds.

Just for fun. Not used nor intended for production. Have been tested & worked
with production code instead of almond though. (RequireJS 2.1.2)

Of course I looked more than one time at almond:
https://github.com/jrburke/almond
during the implementation.


## API spec
https://github.com/amdjs/amdjs-api/wiki/AMD


## Exposes
- define(id, dependencies, factory)
- require(id)

Loading/execution of modules is deferred until required via the
top level require that kickstarts the synchronous dependency "network".


## does not
- support loader plugins
- support relative paths
- support special dependencies (i.e.  "require", "exports", or "module")
- support circular dependencies


## demands
- a single concatenated file with itself before the first define
- a top level require to the inital id after the last define
- all arguments are given to define (r.js fixes this nicely)
