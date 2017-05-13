# Loaders

By itself, neither Ractive nor your tools know what to do with a [component file](../api/component-files.md). You will need a _loader_ to transform a component file into a representation that the target tool or environment can understand.

## Available loaders

### Vanilla

  - [ractive-load](https://github.com/ractivejs/ractive-load) - Uses [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) to load your component files and creates component constructors at runtime.

### [RequireJS](http://requirejs.org/)

  - [rvc](https://github.com/ractivejs/rvc) - Converts component files into [AMD modules](http://requirejs.org/docs/api.html). Works with plain and [optimized](http://requirejs.org/docs/optimization.html) AMD modules.

### [Browserify](http://browserify.org/)

  - [ractify](https://github.com/marcello3d/node-ractify) - Converts component files into [CJS modules](https://nodejs.org/api/modules.html).
  - [ractiveify](https://github.com/norcalli/ractiveify) - Similar to ractify, but supports JS/CSS compilation.
  - [ractive-componentify](https://github.com/blackgate/ractive-componentify) - Similar to ractiveify, but supports [source maps](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) and partial imports.

### [Broccoli](http://broccolijs.com/)

  - [broccoli-ractive](https://github.com/ractivejs/broccoli-ractive) - Converts your component files into either AMD, CJS, or ES modules.

### [Webpack](https://webpack.github.io/)

  - [ractive-component-loader](https://github.com/thomsbg/ractive-component-loader) - Allows you to load component files as constructors via Webpack.

## Looking to write your own loader?

Head over to the [component file specifications](https://github.com/ractivejs/component-spec) repo for a full rundown about the parts of a component file as well as loader behaviors and responsibilities.

Ractive also has a couple of handy modules to aid you in loader development:

-  [rcu](https://github.com/ractivejs/rcu) - An importable/embeddable library that provides utility APIs to help your loader parse the different portions of the component file.
- [rcu-builders](https://github.com/ractivejs/rcu-builders) - A module that provides utility APIs to help your loader convert parsed component files into other module formats like ES, AMD and CJS.
