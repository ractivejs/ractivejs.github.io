# Learning material

## Tutorials

- [Hello, world!](tutorials/hello-world.md)
- [Nested Properties](tutorials/nested-properties.md)
- [Expressions](tutorials/expressions.md)
- [Events](tutorials/events.md)
- [Conditional Sections](tutorials/conditional-sections.md)
- [Iterative Sections](tutorials/iterative-sections.md)
- [Two-way Binding](tutorials/two-way-binding.md)
- [Partials](tutorials/partials.md)
- [Triples (Embedded HTML)](tutorials/triples-embedded-html.md)
- [Components](tutorials/components.md)
- [Animations](tutorials/animation.md)
- [SVG](tutorials/svg.md)
- [Transitions](tutorials/transitions.md)
- [Decorators](tutorials/decorators.md)

## Demos

- [Popular movies](https://dagnelies.github.io/ractive-examples/movies_1.html)
- [Movies with filters and infinite scrolling](https://dagnelies.github.io/ractive-examples/movies_2.html)
- [Movies details open in modal dialog](https://dagnelies.github.io/ractive-examples/movies_3.html)
- [Movies Single page app!](https://dagnelies.github.io/ractive-examples/movies_4.html)
- [Some random users...](https://dagnelies.github.io/ractive-examples/user-list.html)

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

- [ACE Editor](https://dagnelies.github.io/ractive-ace/)
- [Ractive-Require](https://github.com/XavierBoubert/ractive-require)
- [CodeMirror](http://dagnelies.github.io/ractive-codemirror/)
- [Bootstrap](http://dagnelies.github.io/ractive-bootstrap/)
- [Datatable](https://github.com/JonDum/ractive-datatable)
- [Select](https://github.com/JonDum/ractive-select) - A `<select>` replacement component.
- [Stepper](https://github.com/JonDum/ractive-stepper) - A numeric stepper component.
- [Split](https://dagnelies.github.io/ractive-split)
- [ractive-modal](https://github.com/kouts/ractive-modal) - A modal popup component.
- [ractive-materialish](https://github.com/evs-chris/ractive-materialish) - A collection of components and plugins for making desktop- and mobile-friendly frontend applications.

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


# Libraries

## jQuery

[Sergio Castillo](http://twitter.com/scyrizales) has made a jQuery mobile plugin, which you can [see in action on this JSFiddle](http://jsfiddle.net/scyrizales/RHL9z/).

# Loaders

By itself, neither Ractive nor tools know what to do with a component files. Loaders take in component files and parse them into a representation that other tools understand.

## Vanilla

- [ractive-load](https://github.com/ractivejs/ractive-load) - Uses [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) to load your component files and creates component constructors at runtime.

## Rollup

- [rollup-plugin-ractive-bin](https://github.com/ractivejs/rollup-plugin-ractive-bin) - Compile Ractive.js components using rollup.js and the Ractive bin

## SystemJS
- [ractem](https://github.com/guilhermeaiolfi/ractem) - A plugin for SystemJS for loading Ractive components

## RequireJS

- [rvc](https://github.com/ractivejs/rvc) - Converts component files into [AMD modules](http://requirejs.org/docs/api.html).
- [rv](https://github.com/ractivejs/rv) - Loads and pre-compiles Ractive templates from external files. A sample [Ractive + RequireJS sample application](https://github.com/RactiveJS/requirejs-ractive/tree/master/sample) is also available using rv.

## Browserify

- [ractify](https://github.com/marcello3d/node-ractify) - Converts component files into [CJS modules](https://nodejs.org/api/modules.html).
- [ractiveify](https://github.com/norcalli/ractiveify) - Similar to ractify, but supports JS/CSS compilation.
- [ractive-componentify](https://github.com/blackgate/ractive-componentify) - Similar to ractiveify, but supports [source maps](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) and partial imports.
- [Ractivate](https://www.npmjs.org/package/ractivate), a transform that will pre-parse templates. Contributed by [jrajav](https://github.com/jrajav). [(GitHub repository)](https://github.com/jrajav/ractivate). A [starter project](https://github.com/alienscience/gulp-ractive-starter) is available with a [gulp.js](http://gulpjs.com/) build system.

## Broccoli

- [broccoli-ractive](https://github.com/ractivejs/broccoli-ractive) - Converts your component files into either AMD, CJS, or ES modules.

## Webpack

- [ractive-component-loader](https://github.com/thomsbg/ractive-component-loader) - Allows you to load component files as constructors via Webpack.
- [ractive-bin-loader](https://github.com/ractivejs/ractive-bin-loader) - Write Ractive.js components and have them available pre-compiled for the rest of your webpack build.

## Grunt

- [grunt-ractive](https://github.com/ekhaled/grunt-ractive) - Compiles Ractive component files into AMD, CJS or ES modules.

## Babel

TODO

# Tools

## Ractive CLI

As of version 0.9, Ractive now comes with a CLI tool that comes with a few handy commands. See `ractive help` for more details on available commands.

## Ractive utilities

Ractive provides a couple of modules to aid you in loader development:

- [rcu](https://github.com/ractivejs/rcu) - An importable/embeddable library that provides utility APIs to help your loader parse the different portions of the component file.
- [rcu-builders](https://github.com/ractivejs/rcu-builders) - A module that provides utility APIs to help your loader convert parsed component files into other module formats like ES, AMD and CJS.


## Yeoman

[Jorge Colindres](http://colindres.me/) has created [generator-ractive](https://github.com/colindresj/generator-ractive), a Yeoman generator to quickly set up a Ractive application.
