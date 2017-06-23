# Libraries

We heard that you love your framework so much, we put Ractive in your framework!

## jQuery Mobile

[Sergio Castillo](http://twitter.com/scyrizales) has made a jQuery mobile plugin, which you can [see in action on this JSFiddle](http://jsfiddle.net/scyrizales/RHL9z/).


# Loaders

By itself, neither Ractive nor your tools know what to do with a component file. You will need a _loader_ to transform a component file into a representation that the target tool or environment can understand.

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

# Plugins

## Adaptors

Interface with different backends.

- [Backbone](https://github.com/ractivejs/ractive-adaptors-backbone)
- [Bacon.js](http://ractivejs.github.io/ractive-adaptors-bacon/)
- [Modella](https://github.com/staygrimm/ractive-adaptors-modella) by [@staygrimm](https://github.com/staygrimm)
- [Promises](http://lluchs.github.io/Ractive-adaptors-Promise/) by [@lluchs](https://github.com/lluchs)
- [Promise-alt](https://github.com/rstacruz/ractive-promise-alt) by [@rstacruz](https://github.com/rstacruz)
- [RxJS](http://ractivejs.github.io/ractive-adaptors-rxjs/)
- [Ractive](https://github.com/rstacruz/ractive-ractive) by [@rstacruz](https://github.com/rstacruz) - Synchronise several Ractive instances.
- [ss-ractive](https://github.com/arxpoetica/ss-ractive) by Robert Hall [@arxpoetica](https://github.com/arxpoetica) - Ractive Template Engine wrapper for [SocketStream](https://github.com/socketstream/socketstream).

## Components

Encapsulate functionality behind the guise of a custom element.

- [Ractive-Require](https://github.com/XavierBoubert/ractive-require)
- [CodeMirror](http://dagnelies.github.io/ractive-codemirror/)
- [Bootstrap](http://dagnelies.github.io/ractive-bootstrap/)
- [Datatable](https://github.com/JonDum/ractive-datatable)
- [Select](https://github.com/JonDum/ractive-select) - A `<select>` replacement component.
- [Stepper](https://github.com/JonDum/ractive-stepper) - A numeric stepper component.
- [Split](https://dagnelies.github.io/ractive-split)

## Decorators

Augment the DOM with more functionality.

- [Chosen](http://kalcifer.github.io/ractive-decorators-chosen/) by [@rahulcs](https://github.com/rahulcs) ([@kalcifer](https://github.com/kalcifer))
- [minmaxwidth](https://github.com/cfenzo/Ractive-decorators-minmaxwidth) by [@cfenzo](https://github.com/cfenzo)
- [Select2](http://prezent.github.io/ractive-decorators-select2/) by [@sandermarechal](https://github.com/sandermarechal) ([@Prezent](https://github.com/Prezent))
- [Sortable](http://ractivejs.github.io/Ractive-decorators-sortable/)
- [Tooltip](http://github.com/JonDum/ractive-tooltip)

## Easings

Custom animation progressions.

## Events

Augment the DOM with custom events beyond those supported by the browser.

- [Drag and Drop (HTML5)](https://github.com/Nijikokun/ractive.drag.drop.js) by [@Nijikokun](https://github.com/Nijikokun)
- [Drag and Drop (non-HTML5)](https://github.com/smallhadroncollider/ractive.events.drag) by [@smallhadroncollider](https://github.com/smallhadroncollider)
- [Drag and Drop Sortable List](https://github.com/Nijikokun/ractive.sortable.js) by [@Nijikokun](https://github.com/Nijikokun)
- [Resize](https://github.com/smallhadroncollider/ractive.events.resize) by [@smallhadroncollider](https://github.com/smallhadroncollider)
- [Hover](http://ractivejs.github.io/ractive-events-hover)
- [Keys](http://ractivejs.github.io/ractive-events-keys)
- [Mousewheel](http://ractivejs.github.io/ractive-events-mousewheel)
- [Tap](http://ractivejs.github.io/ractive-events-tap)
- [Touch](https://github.com/rstacruz/ractive-touch) by [@rstacruz](https://github.com/rstacruz/)
- [Typing](https://github.com/svapreddy/ractive-events-typing) by [@svapreddy](https://github.com/svapreddy)
- [Viewport](https://github.com/svapreddy/ractive-event-viewport) by [@svapreddy](https://github.com/svapreddy)

## Partials

Reusable pieces of markup.

## Transitions

Apply custom animation.

- [Fade](http://ractivejs.github.io/ractive-transitions-fade)
- [Fly](http://ractivejs.github.io/ractive-transitions-fly)
- [Scale](https://github.com/1N50MN14/Ractive-transitions-scale) by [@1N50MN14](https://github.com/1N50MN14)
- [Slide](http://ractivejs.github.io/ractive-transitions-slide)
- [Typewriter](http://ractivejs.github.io/ractive-transitions-typewriter)

# Tools

## Ractive CLI

TODO

## Browserify

[Browserify](http://browserify.org/) is a way of using [node-style](http://nodejs.org/) requires in the browser, bundling your scripts into a single file for efficient deployment.

There are three Browserify transforms available that you can use for Ractive.js:

- [Ractivate](https://www.npmjs.org/package/ractivate), a transform that will pre-parse templates. Contributed by [jrajav](https://github.com/jrajav). [(Github repository)](https://github.com/jrajav/ractivate)
- [Ractify](https://npmjs.org/package/ractify), a transform that will pre-compile components. Contributed by [marcello3d](https://github.com/marcello3d). [(Github repository)](https://github.com/marcello3d/node-ractify)
- [Ractiveify](https://npmjs.org/package/ractiveify), a transform that will pre-compile components with support for compiling embedded scripts and style tags (with Livescript, CoffeeScript, Sass, etc). Inspired by ractify. Contributed by [norcalli](https://github.com/norcalli). [(Github repository)](https://github.com/norcalli/ractiveify)

A [starter project](https://github.com/alienscience/gulp-ractive-starter) is available for using Ractivate with [gulp.js](http://gulpjs.com/) build system.

### Using plugins with Ractive and Browserify

Plugins typically include a Universal Module Definition (UMD) block that, in a node.js or Browserify environment, calls `require('ractive')`. If you want to be explicit about *which* version of Ractive gets loaded, you can do it when you configure browserify like so:

```js
browserify.require('./my-copy-of-ractive.js', { expose: 'ractive' });
```

## RequireJS

*Psst! Looking for the [Ractive + RequireJS sample application](https://github.com/RactiveJS/requirejs-ractive/tree/master/sample)?*

If Ractive detects that you're using an [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) module loader (in other words, if `typeof define !== 'undefined' && define.amd`) such as [RequireJS](http://requirejs.org/), it will register itself as an AMD module rather than as a browser global.

You'd then use Ractive the same as you'd use any other module, such as in this (contrived, oversimple) example:

```js
// define our main application, with an 'init' method to call when
// the DOM is ready etc
define([ 'jquery', 'Ractive' ], function ( $, Ractive ) {

  'use strict';

  var app = {
    init: function () {

      // load our template with jQuery AJAX
      $.ajax( 'templates/main.html' ).then( function ( mainTemplate ) {

        // render our main view
        this.mainView = new Ractive({
          el: 'container',
          template: mainTemplate
        });
      });
    }
  };

  return app;

});
```

### Loading templates without AJAX

We can do one better than that. Rather than stuffing our code full of asynchronous logic, we can use AMD to do the donkey work for us.

Include the [RequireJS text loader plugin](https://github.com/requirejs/text) in the root of your project (or whatever you've specified as the RequireJS `baseUrl`) - you can now do this (note we no longer require jQuery):

```js
// define our main application, with an 'init' method to call when
// the DOM is ready etc
define([ 'Ractive', 'text!templates/main.html' ], function ( Ractive, mainTemplate ) {

  'use strict';

  var app = {
    init: function () {

      // render our main view
      this.mainView = new Ractive({
        el: 'container',
        template: mainTemplate
      });
    }
  };

  return app;

});
```

But we can do even better. If you use the [Ractive RequireJS loader plugin](https://github.com/RactiveJS/require-ractive-plugin), it will pre-parse the template for us. We'll see in a moment why that's useful.

Put the plugin in the same folder as the text loader plugin (which the Ractive plugin depends on). Note that we can omit the `'.html'` file extension:

```js
// define our main application, with an 'init' method to call when
// the DOM is ready etc
define([ 'Ractive', 'rv!templates/main' ], function ( Ractive, mainTemplate ) {

  'use strict';

  var app = {
    init: function () {

      // render our main view
      this.mainView = new Ractive({
        el: 'container',
        template: mainTemplate
      });
    }
  };

  return app;

});
```

### Using the RequireJS optimiser

You might wonder why the third example is better than the second - after all, we've basically just added another middleman, right?

The answer is that you can now use the [RequireJS optimiser](http://requirejs.org/docs/optimization.html) to parse your template as part of your build process. The optimiser converts your project into a single minified file, which in most cases makes your app much quicker to load for the end user (because the browser only needs to make one HTTP request, and the total file size is reduced).

By pre-parsing templates, we save browsers having to do it, which shaves a few milliseconds off at render time.

So you get the best of both worlds - your templates stay neatly organised in their own files, where you can easily edit them, and the user gets the best possible experience.

If you're *really* anal about performance, you can tweak things further still. We don't need the loader plugins any more (because everything has been inlined), but they're still there in our optimised file. We can instruct the optimiser to 'stub them out', saving ourselves a few precious bytes. In your optimiser config, add the following option:

```js
({
    stubModules: [ 'rv', 'text' ]
})
```

(This assumes you're using a `build.js` file, or a build system like Grunt. If you're using the optimiser on the command line it will be different - consult the [documentation](http://requirejs.org/docs/optimization.html) for more info.)

Getting to grips with AMD and RequireJS can be tricky at first, but it's worth the effort. Good luck!

## Yeoman

[Yeoman](http://yeoman.io/) is a tool for scaffolding webapps. [Jorge Colindres](http://colindres.me/) has created [generator-ractive](https://github.com/colindresj/generator-ractive), a Yeoman generator to quickly set up a Ractive application.

## Rollup

TODO

## Babel

TODO
