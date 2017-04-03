# Loaders

By itself, Ractive doesn't know what to do with a [component file](../api/component-files.md). You will need a _loader_ to transform a component file into a representation that the target tool or environment can understand.

## Vanilla

  - [ractive-load](https://github.com/ractivejs/ractive-load)

## [RequireJS](http://requirejs.org/)

  - [rvc](https://github.com/ractivejs/rvc) - Works with plain and [optimized](http://requirejs.org/docs/optimization.html) AMD modules.

## [Browserify](http://browserify.org/)

  - [ractify](https://github.com/marcello3d/node-ractify)
  - [ractiveify](https://github.com/norcalli/ractiveify) - Similar to ractify, but supports JS/CSS compilation.
  - [ractive-componentify](https://github.com/blackgate/ractive-componentify) - Similar to ractiveify, but supports sourcemaps and partial imports.

## [Broccoli](http://broccolijs.com/)

  - [broccoli-ractive](https://github.com/ractivejs/broccoli-ractive) - Supports AMD, CJS, and ES6 outputs.

## [Webpack](https://webpack.github.io/)

  - [ractive-component-loader](https://github.com/thomsbg/ractive-component-loader)
