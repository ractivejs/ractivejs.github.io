# Support

## Getting in touch

* [Gitter](https://gitter.im/ractivejs/ractive)
* [GitHub](https://github.com/ractivejs/ractive/issues)
* [Twitter](http://twitter.com/RactiveJS)
* [StackOverflow](http://stackoverflow.com/questions/tagged/ractivejs)
* [Google Groups](http://groups.google.com/forum/#!forum/ractive-js)


## Builds

- Regular (`ractive.js`, `ractive.min.js`, `ractive.mjs`) - Ractive with batteries included. Intended for maximum compatibility.
- Runtime (`runtime.js`, `runtime.min.js`, `runtime.mjs`) - Ractive without the template parser. Intended for workflows that pre-parse templates which do not require the parser at runtime.

Source maps are included for all variants of Ractive.

## Browser support

[ES5 support](https://kangax.github.io/compat-table/es5/) is the minimum requirement. Ractive also comes with the following polyfills:

- `Promise`
- `Array.prototype.find`
- `Object.assign`
- `performance.now`
- `requestAnimationFrame`

## SVGs

Ractive doesn't mind whether you're rendering HTML or SVG - it treats both the same way. Unfortunately, some browsers (notably IE8 and below, and Android 2.3 and below) *do* care.

> This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you're trying to render SVG in an older browser. See https://github.com/RactiveJS/Ractive/wiki/SVG-and-older-browsers for more information

If the browser logs an error like the one above, [the only winning move is not to play](http://xkcd.com/601/). Ractive provides `Ractive.svg` to indicate if the browser handles SVGs properly. This may be used to supply fallback content in place of the SVG.

```js
Ractive({
  el: 'container',
  template: Ractive.svg ? awesomeVectorGraphicsContent : highResolutionImageContent
})
```

# Legacy documentation

## 0.9

- [Get Started](/legacy/0.9/get-started/)
- [API](/legacy/0.9/api/)
- [Plugins](/legacy/0.9/plugins/)
- [Concepts](/legacy/0.9/concepts/)

## 0.8

- [Get Started](/legacy/0.8/get-started/)
- [API](/legacy/0.8/api/)
- [Plugins](/legacy/0.8/plugins/)
- [Concepts](/legacy/0.8/concepts/)

## 0.7

- [Get Started](/legacy/0.7/get-started/)
- [API](/legacy/0.7/api/)
- [Plugins](/legacy/0.7/plugins/)
- [Concepts](/legacy/0.7/concepts/)

## 0.6

- [Get Started](/legacy/0.6/get-started/)
- [API](/legacy/0.6/api/)
- [Plugins](/legacy/0.6/plugins/)
- [Concepts](/legacy/0.6/concepts/)

## 0.5

- [Get Started](/legacy/0.5/get-started/)
- [API](/legacy/0.5/api/)
- [Plugins](/legacy/0.5/plugins/)
- [Concepts](/legacy/0.5/concepts/)

## 0.4

- [Get Started](/legacy/0.4/get-started/)
- [API](/legacy/0.4/api/)
- [Plugins](/legacy/0.4/plugins/)
- [Concepts](/legacy/0.4/concepts/)

## 0.3

- [Get Started](/legacy/0.3/get-started/)
- [API](/legacy/0.3/api/)
- [Plugins](/legacy/0.3/plugins/)
- [Concepts](/legacy/0.3/concepts/)

# Migrating from previous versions

These are notes to help you migrate from an older version of Ractive.js to a newer one, mostly centered on breaking changes between versions. If you'd like to find out more about new features, you can check out the [changelog](https://github.com/ractivejs/ractive/blob/dev/CHANGELOG.md).

## Migrating from 0.9

### Defaults

`resolveInstanceMembers` now defaults to `false` to avoid foot maimings associated with common instance member names and ambiguous references.

### Computations

The stringy syntax for computed properties has changed to plain old expression syntax. This means that `${length} * ${width}` as a computation is now just `length * width`, which is hopefully a little less surprising given `${interpolator}` syntax in template strings.

'.'s in computation keypaths must now be escaped if they're meant to be part of a single key, as you can now add computations below the root level.

### Template format

Template positions in parsed template AST are now stored in the `q` member rather than the `p` member to avoid accidental overlap with local partials.

### Data

Checking that a value exists at some keypath in the data will no longer exclude the root prototypes (`Object`, `Function`, `Array`) because doing so creates issues when dealing with `Object.create(null)`. If you keep your references unambiguous, this shouldn't cause any issues. The simplest example of where this can cause trouble is with `{ items: [{ length: 10 }, {}] }` in `{{#each items}}{{length}}{{/each}}` where the second length will be that of the items array because the object has no length property but its parent context, the array, does.

Aliases now take precedent over properties from contexts above their alias defintions. This means that `{{#with { foo: 10 } }}{{#with 42 as foo}}{{foo}}{{/with}}{{/with}}` results in `42` rather than `10`, which is hopefully the less surprising behavior.

The context pop reference prefix `^^/` now correctly handles `{{#each}}` blocks such that `^^/ === ../../` from immediately within the block body. This is because `^^/` is supposed to jump explicit contexts and not just implicit contexts as provided by each iteration.

### Polyfills

`polyfills.js` is no longer included in the build, as it was just an empty placeholder since the handful of polyfills that were in it were included in the main build.


## Migrating from 0.8

### Removed deprecations

0.9 removes any of the remaining deprecations from 0.8, including:

* `decorator="name:{{arg1}},{{arg2}}` directives, to be replaced with `as-name="arg1, arg2"`
* `intro="name:{{ { arg1: arg1, arg2, arg2 } }}"` and the same forms of `outro` and `intro-outro` to be replaced with `name-in="{ arg1, arg2 }"` and the same forms of `name-out` and `name-in-out`
* The `ractive.data` getter, to be replaced with `ractive.get()`, which returns a computed object tree containing virtual keys like mappings, links, and computations. The optional form `ractive.get({ virtual: false })` will return the raw root object without any virtual keys.
* Lifecycle methods `init` and `beforeInit`, to be replaced with lifecycle events or equivalent instance methods. `beforeInit` corresponds to the `construct` lifecycle event.
* Partial comments in the form of `<!-- {{>myPartial}} -->...<!-- {{/myPartial}} -->`, to be replaced with partial blocks `{{#partial myPartial}}...{{/partial}}`

Part of removing directive deprecations allowed using the plain expression parser for attributes and directives, which means that directives that parse in an expression context are much more resilient to things like quote pileup with strings e.g. `as-target=""id as a string""`.

__Note__: this also means that directive values aren't processed as HTML before being parsed, so HTML entities are no longer automatically encoded within directive values.

### Template format

The template format produced by `Ractive.parse` has changed, making it incompatible with previous versions of Ractive.js and their template formats. You will need to re-parse any pre-parsed templates for use with 0.9.

### Event delegation

Ractive will now automatically set up event delegation for elements that contain iterative sections. This installs a single DOM listener on the host element for each event type within the iterative section, and when an event fires from one of the iterative elements with a listener, the parent delegation target handles triggering listeners on the correct elements. This prevents having to set up large numbers of event listeners in iterative sections, but it can also surface inconsistencies in browser event implementations. If you need to disable event delegation for a special case, you can add a `no-delegation` attribute to the element containing the iterative section, pass `delegate: false` to your component or instance, or set `Ractive.defaults.delegate` to `false`.

### Partial context

Any context provided to a partial `{{>my-partial context}}` is no longer wrapped around the partial but is instead wrapped around the _content_ of the partial. It's a subtle difference that only shows up when the partial name is an expression e.g. `{{>.type ~/external.item}}`. Before this break, the `.type` would resolve to `~/external.item.type`, and now it will resolve to `.type` on the context in which the partial appears.

### Yielding

Yielding is no longer restricted to inline partials, and each partial may be yielded more than once. You will no longer get a warning if you try to yield an instance or dynamic partial or if you yield the same partial multiple times.

### `noIntro` inheritance

The `noIntro` setting of an instance that contains components will now apply to the components too, unless those components have their own `noIntro` setting.

### Polyfills

There is no longer a `legacy` build of Ractive.js available. Instead, a separate `polyfills` library is available that can be included before Ractive.js is loaded, or you can supply your own polyfills, shims, or shams.

### Node registry

Elements with an `id` attribute are no longer collected into a `nodes` map on the Ractive.js instance. If you require similar functionality, it can be achieved in a much more flexible way with a decorator.

### Unresolved references

References that don't resolve are no longer kept in an unresolved state, waiting on an appropriate keypath to pop into existence somewhere in the context hierarchy. Instead, references that don't resolve are immediately resolved in the current context, which tends to be the desired behavior in most circumstances.

### Live queries

Element and component queries no longer support automatically keeping the resulting array up to date as new matching elements or components are rendered. If you require similar functionality, it can be achieved with a decorator for elements or bubbled lifecycle events for components.

### `change` event

The `change` event has been removed and replaced by recursive observers, which are strictly opt-in and can be scoped to a deeper keypath than the root.

### `event` reference

The `event` special reference available to event directives has been deprecated and replaced with three special references:

* `@context`, which is roughly equivalent to `event`, but with both an `event` and `original` key that point to the original event object. This is a context object.
* `@event`, which is resolves to the original event that triggered the directive.
* `@node`, which resolves to the element to which the event directive is attached.

### Instance events

The signature for callbacks to instance events, supplied to `ractive.on()`, now _always_ includes a context regardless of the origin of the event (DOM or API). Additionally, the `fire` method has changed such that the first argument may be a context object. Any events that need to send an object to the callback as the first post-context argument will need to supply a placeholder context object e.g. `ractive.fire( 'event', { first: 'arg' } )` becomes `ractive.fire( 'event', {}, { first: 'arg' } )`.

### `ractive.merge`

`ractive.merge` has been removed and replaced by an option on `ractive.set`, `{ shuffle: true }`, which more accurately reflects what actually happens. `merge` did not merge data, but instead re-arranged any DOM associated with the elements in the given array to match the order of the array - hence `shuffle` rather than `merge`.

### Isolation

Components are now `isolated` by default. If you need non-`isolated` components in order to create implicit mappings as data is accessed, you can pass `isolated: false` to `extend` when creating the component. If you prefer all components to be non-`isolated` by default, you can set `Ractive.defaults.isolated = false`.

Further, non-`isolated` components will now create implicit mappings when necessary for `set` operations, including `add`, `subtract`, etc, in addition to `get` operations. To avoid creating an implicit mapping with a `set` operation from a non-`isolated` component, pass `{ isolated: true }` as an option to the `set` method.

### Magic and array adaptors

The magic and array adaptors are no longer part of Ractive.js core. They may be reappear as independent plugins at some point in the future.

### `class-` directives

`class-` directives are now parsed in an expression context like decorator, transition, and event directives, rather than in a string context like attributes and `style-` directives. This means that mustaches are no longer required for `class-` directive values, so you should use `class-selected=".selected"` rather than `class-selected="{{.selected}}"`.

### `getNodeInfo`

`ractive.getNodeInfo` has been renamed to `ractive.getContext`, as has the static version of the function, to more accurately reflect its function. The `getNodeInfo` alias is deprecated and will be removed in a future version.

### Multiple inheritance

Components can no longer inherit from multiple other components at the same level, meaning that `Ractive.extend(FirstComponent, SecondComponent)` is no longer possible. You can still set up an inheritance hierachy multiple levels deep with `const First = Ractive.extend({ ...options }); const Second = First.extend({ ...others });`.

## Migrating from 0.7

### Template format

The template format produced by `Ractive.parse` has changed, making it incompatible with previous versions of Ractive.js and their template formats. You will need to re-parse any pre-parsed templates for use with 0.8.

### IE8

IE8 is no longer supported. If you still need to support IE8, well, we're very, very sorry...

### Expressions and binding

Two-way bindings are no longer supported in computed contexts that don't have a `set`ter, including template expression contexts. This means that `{{#each filter(list)}}<input value="{{.name}}" />{{/each}}` is no longer possible. The reasoning behind this change is that the original `list.${index}.name` is not updated when the binding within the computed context in the `each` expression is changed. 0.9 adds an instance flag `syncComputedChildren` that can address this.

### Relaxed partial names

Partial names can now include `\` characters, which can be problematic if you happen to use division with no spaces arount the `/` in a partial expression.

### Integer references

Integers are no longer considered references, even in an array context, meaning that in `{{#with [1, 2, 3]}}{{0}}{{/with}}` will no longer result in `1` being rendered. Integers are now stricly considered to integer literals. If you need to reference a specific index in an array context, you can do so with a context specific reference like `{{this.0}}`.

### Array modification

`modifyArrays` now defaults to `false`, so the array adaptor is not applied to arrays automatically as they are added to the instance data. The preferred method of performing array operations is using the `splice`, `push`, `pop`, etc methods on the Ractive.js instance.

## Migrating from 0.6

### What's new

Components can now access their parents and containers using an official API.

Binding directives may be set on elements that support two-way binding. These directives override the settings on the Ractive instance for `twoway` and `lazy`.

Single-fire versions of `ractive.on` and `ractive.observe` are now available as `ractive.once` and `ractive.observeOnce`.

Inline partials can now be defined within a new section `{{#partial partial-name}}...{{/partial}}`. The old comment syntax is now deprecated and will be removed in a future release.

Inline partials are now scoped to their nearest element. If a partial reference sits in the template below an element with a matching inline partial, the inline partial will be used in the reference. This can be used as a sort of partial inheritance. If an inline partial is defined directly within a component tag or the root of the template, it will be added to the Ractive instance.

Components may now yield to multiple inline partials by supplying the partial name with yield e.g. `{{yield some-name}}`. Yielding without a name will still result in non-partial content being yielded. Only inline partials may be yielded. Any partials, including inline and inherited, may still be referenced within a component using a plain partial section e.g. `{{>partial}}`.

Partials can now be reset without resorting to manually un/re-rendering them using a wrapping conditional section. This can be done with the new `resetPartial` method on Ractive instances.

`this.event` is now available to method-call event handlers.

Regular expression literals can now be used in template expressions.

You can now escape mustaches with a '\' if you'd like them to appear in the template.

`ractive.toggle` now works with patterns.

The debug setting is no longer set per-instance. It has been replaced with `Ractive.DEBUG`, which defaults to true. You can set it automatically based on whether or not the your code has been minified with:
```js
Ractive.DEBUG = /unminified/.test(function(){/*unminified*/})
```

### Breaking changes and deprecation

* `twoway` and `lazy` are now reserved attribute names to be used as binding directives.
* Inline partials now belong to their nearest element.
* The comment syntax for inline partials is now deprecated.
* `elseif` is now a reserved identifier.
* `ractive.data` is no longer available. Use `ractive.get()` to get a shallow copy of the data with any component mappings.
* Child data always overrides parent data, whether it is a POJO (Plain Old JS Object) or not.
* `ractive.debug` has been replaced with the global `Ractive.DEBUG` flag.

## Migrating from 0.5

### Lifecycle events

Ractive instances now emit *lifecycle events*. If you use `Ractive.extend(...)` with `init()`, `beforeInit()` or `complete()`, you will need to replace them - they will continue to work, but will be removed in a future version.

`init()` can be replaced with one of the following methods, or you may need to split your code into both methods. Use `onrender()` for code that needs access to the rendered DOM, but is safe being called more than once if you unrender and rerender your ractive instance. Use `oninit()` for code that should run only once or needs to be run regardless of whether the ractive instance is rendered into the DOM.

The `init()` method also no longer recieves an `options` parameter as the ractive instance now inherits _all_ options passed to the constructor. You can still access the options directly using the `onconstruct()` method.

`beforeInit()` and `complete()` can be replaced directly with `onconstruct()` and `oncomplete()` respectively.

See the lifecycle events page for more detail.

### Other Breaking changes

* `new Ractive()` now inherits all options as methods/properties including event hooks. If you have been passing data through custom initialisation options be aware that they will appended to your ractive instance.
* Using other elements besides `<script>` for templates is an now an error. Migrate any templates in non-script elements and include a non-javascript type so the browser does not try to interpret your template:

  ```js
    <script id='template' type='text/ractive'>
      Your template goes here
    </script>
  ```

* New reserved events cannot be used for proxy event names, i.e. `<p on-click='init'></p>`. These include 'change', 'config', 'construct', 'init', 'render', 'reset', 'teardown', 'unrender', and 'update'. You will need to rename your events.
* Setting uninitialised data on a component will no longer cause it to leak out into the parent scope
* 'Smart updates', via `ractive.merge()` and `ractive.shift()` etc, work across component boundaries. In most cases this is the expected behavior.
* The CSS length interpolator has been removed.


## Migrating from 0.4

### Breaking changes

* Errors in observers and evaluators are no longer caught
* Nodes are detached as soon as any outro transitions are complete (if any), rather than when *all* transitions are complete
* (Outdated if you are moving to `0.6.x` or above) The options argument of `init: function(options)` is now strictly what was passed into the constructor, use `this.option` to access configured value.
* `data` with properties on prototype are no longer cloned when accessed. `data` from "baseClass" is no longer deconstructed and copied.
* Options specified on component constructors will not be picked up as defaults. `debug` now on `defaults`, not constructor
* Select bindings follow general browser rules for choosing options. Disabled options have no value.
* Input values are not coerced to numbers, unless input type is `number` or `range`
* `{{this.foo}}` in templates now means same thing as `{{.foo}}`
* Rendering to an element already render by Ractive causes that element to be torn down (unless appending).
* Illegal javascript no longer allowed by parser in expressions and will throw
* Parsed template format changed to specify template spec version.
  * Proxy-event representation
  * Non-dynamic (bound) fragments of html are no longer stored as single string
  * See https://github.com/ractivejs/template-spec for current spec.
* Arrays being observed via `array.*` no longer send `item.length` event on mutation changes
* Reserved event names in templates ('change', 'config', 'construct', 'init', 'render', 'reset', 'teardown', 'unrender', 'update') will cause the parser to throw an error
* `{{else}}` support in both handlebars-style blocks and regular mustache conditional blocks, but is now a restricted keyword that cannot be used as a regular reference
* Child components are created in data order
* Reference expressions resolve left to right and follow same logic as regular mustache references (bind to root, not context, if left-most part is unresolved).
* Improved attribute parsing and handling:
  * character escaping and whitespace handling in attribute directive arguments
  * boolean and empty string attributes
* Computed properties no longer create nested objects with keypath like names, i.e. `page.area: '${width} * ${height}'` creates a property accessible by `{{page.area}}` but not `{{#page}}{{area}}{{/page}}`
* The element into which the ractive instance was rendered is no longer available as `ractive.el`. See `ractive.render()` and `ractive.insert()` for more information on moving ractive instances in the DOM.
