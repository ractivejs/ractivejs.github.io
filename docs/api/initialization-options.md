# Initialization Options

The following is an exhaustive list of initialisation options that you can pass to [`new Ractive()`]() and [`Ractive.extend()`](./static-methods.md#ractiveextend). Extra properties passed as options that are not initialization options are added as properties or methods of the instance.

```js
var ractive = new Ractive({
  myMethod: function () {
    alert( 'my method was called' );
  }
});

ractive.myMethod(); // triggers the alert
```



## adapt

`(Array<string|Object>)`

An array of [adaptors](../extend/adaptors.md) to use. Values can either be names of registered adaptors or an adaptor definition.

```js
adapt: [ 'MyAdaptor', AdaptorDefinition ]
```

`adapt` is not required if you registered adaptors via the [`adaptors`](#adaptors) initialization property. The adaptors registered via `adaptors` initialization property are automatically used as if they were set with `adapt`.

```js
const instance = new Ractive({
  adaptors: { MyAdaptor: AdaptorDefinition }
  // No need to use adapt
});

const Component = Ractive.extend({
  adaptors: { MyAdaptor: AdaptorDefinition }
  // No need to use adapt
});

new Component({
  // No need to use adapt
});
```



## adaptors

`(Object<string, Object>)`

A map of [adaptors](../extend/adaptors.md) where the key is the adaptor name and the value is an adaptor definition.

```js
adaptors: {
  MyAdaptor: AdaptorDefinition
}
```

Registering an adaptor via `adaptors` is not required if you directly specified the adaptor definition via `adapt`.

```js
const Adaptor = { ... };

const instance = new Ractive({
  adapt: [ AdaptorDefinition ]
  // No need to use adaptors
});
```



## append

`(boolean|string|HTMLElement|array-like)`

Controls how the instance is attached to [`el`](#el). Defaults to `false`.

`false` replaces the contents of `el`.

```html
<!-- before -->
<div id='container'>
  <p>existing content</p>
</div>
```
```js
el: '#container',
append: false,
template: '<p>new content</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>new content</p>
</div>
```

`true` appends the instance to `el`.

```html
<!-- before -->
<div id='container'>
  <p>existing content</p>
</div>
```
```js
el: '#container',
append: true,
template: '<p>new content</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>existing content</p>
  <p>new content</p>
</div>
```

An `id` of the element, a CSS selector to an element, an HTML element, or an array-like object whose first item is an HTML element, which is a child of `el` will render the instance before that element.

```html
<!-- before -->
<div id='container'>
  <p>red</p>
  <p>orange</p>
  <p>yellow</p>
</div>
```
```js
el: '#container',
append: document.querySelector('p:nth-child(2)'),
template: '<p>grey</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>red</p>
  <p>grey</p>
  <p>orange</p>
  <p>yellow</p>
</div>
```



## attributes

`(Object<string, [string]|Object<string, [string]>>)`

An array of optional attributes or a map of optional and required attributes. Defaults to `undefined`.

You can supply a list of optional attributes using an array. You can also supply an object with an `optional` array of attribute names and a `required` array of attribute names. At runtime, if a component is created missing a required attribute, Ractive will issue a warning about missing required attributes. Any attributes that are passed to the component that are _not_ included in either of the `optional` or `required` lists of attributes will be collected into a partial named `extra-attributes` so that they can be included on a top-level element in the component template or split apart to be used in a component `init` event.

```js
const Component = Ractive.extend({
  template: `<div class-component-wrapper {{yield extra-attributes}}>Fancy component doing something with list and type</div>`,
  attributes: {
    required: [ 'list' ],
    optional: [ 'type' ]
  }
});

// <Component type="foo" /> will issue a warning about missing list
// <Component list="{{things}}" style-color="green" /> will not warn, but will include the style-color="green" on the wrapper div
```

The extra attributes passed to a component are not limited to simple attributes - they can also include directives, but any mustache sections will not have their contents checked. By default, the `extra-attributes` will _not_ be mapped, meaning that the values won't be available with `get` from the component, so the partial should be yielded. If you need the extra attributes to be mapped, include an additional setting in the attributes map `mapAll: true`.



## components

`(Object<string, Function>)`

A map of [components](../extend/components.md) where the key is the component name the value is either a component definition or a function that returns either a name of a registered component or a component definition. The function form receives processed [`data`](#data) as first argument.

```js
components: {
  StaticComponent: ComponentDefinition,
  DynamicComponent: function(data){
    return data.foo ? 'MyGlobalComponent' : ComponentDefinition;
  }
}
```

During a [`ractive.reset()`](/api/instance-methods.md#ractivereset), components registered using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## computed

`(Object<string, function|Object>)`

A map of [computed properties](../concepts/data-binding.md#computed-properties) where the key is the name of the computed property and the value is either a computed property expression, a function that returns a value, or an object that has `get` and `set` functions.

```js
// Imagine a square...
computed: {
  // Computed property expression
  diagonal: '${side} * Math.sqrt(2)',

  // A function
  perimeter: function(){
    return 4 * this.get('side');
  },

  // An object with get and set functions
  area: {
    get: function(){
      return Math.pow(this.get('side'), 2);
    },
    set: function(value){
      this.set('side', Math.sqrt(value));
    }
  },
}
```



## csp

`(boolean)`

Whether or not to add inline functions for expressions after parsing. Defaults to `false`.

This can effectively eliminate `eval` caused by expressions in templates. It also makes the resulting template no longer JSON compatible, so the template will have to be served via `script` tag.



## css

`(string)`

Scoped CSS for a component and its descendants.

```js
css: `
  .bold { font-weight: bold }
`
```

At the moment, only applies to components.

```js
// This works
const Component = Ractive.extend({
  css: '...'
});

// This will not work
new Ractive({
  css: '...'
});
```



## data

`(Object<string, any>|Function)`

The data for an instance, or default data for a component. Can either be an object or a function that returns an object.

```js
// Object form
data: {
  foo: 'bar'
}

// Function form
data: function() {
  return { foo: 'bar' };
}

// Function form using arrow function for less verbosity
data: () => ({
  foo: 'bar'
})
```

When using the object form, the data is attached to the component's prototype. Standard prototype rules apply.

```js
const Component = Ractive.extend({
  data: {
    foo: { bar: 42 }
  }
});

var component1 = new Component();
var component2 = new Component();
component1.set( 'foo.bar', 12 );
component2.get( 'foo.bar' ); // returns 12
```

When using the function form, the function is executed to give each instance a copy of the data. Standard prototype rules apply.

```js
const Component = Ractive.extend({
  data: function () {
    return {
      foo: { bar: 42 }
    };
  }
});

var component1 = new Component();
var component2 = new Component();
component1.set( 'foo.bar', 12 );
component2.get( 'foo.bar' ); // returns 42
```

When extending from a constructor, data from the parent constructor will be shallow-copied over to the child data. Child data takes precedence in the event of collisions.

```js
const Parent = Ractive.extend({
  data: {
    foo: 'Hello',
    bar: 'World'
  }
});

const Child = Parent.extend({
  data: {
    foo: 'Goodbye'
  }
});

Parent().get(); // { foo: 'Hello', bar: 'World' }
Child().get();  // { foo: 'Goodbye', bar: 'World' }
```



## decorators

`(Object<string, Function>)`

A map of [decorators](../extend/decorators.md) where the key is the decorator name and the value is a decorator definition.

```js
decorators: {
  MyDecorator: DecoratorDefinition
}
```



## delegate

`(boolean)`

Whether or not to enable automatic event delegation for iterative sections within an element. Defaults to `true`.

When enabled, DOM events subscribed within iterative sections will not add a DOM event listener to each element. Instead, a single listener will be installed on the element containing the iterative section, and that listener will find appropriate event directives starting from the target element and working back to the containing element with the listener.



## delimiters

`(Array[string])`

Sets the template delimiters. Defaults to `[ '{{', '}}' ]`.

```js
delimiters: [ '<%=', '%>' ],
template: 'hello <%= world %>',
data: { world: 'earth' }

// result:
// hello earth
```



## easing

`(Object<string, Function>)`

A map of [easing functions](../extend/easings.md) where the key is the easing function name and the value is the easing function.

```js
easing: {
  MyEasing: EasingDefinition
}
```



## el

`(string|HTMLElement|array-like)`

The element to render an instance to. Can either be an `id` of the element, a CSS selector to an element, an HTML element, or an array-like object whose first item is an HTML element.

```js
el: 'container'
el: '#container'
el: document.getElementById('container')
el: jQuery('#container')
```



## enhance

`(boolean)`

Whether or not to apply progressive enhancement by inspecting the contents of `el` and try to reuse as much of the existing tree as possible. Defaults to `false`.

There are a few limitations to this feature:

- This option cannot be used with [`append`](#append).

- Unescaped HTML mustaches (triples) don't play nicely with enhance because there's no easy way to match up the string content to the target DOM nodes.

- All matching elements will be reused, except for a few cases regarding text nodes.

    ```
    <div>left text {{#if foo}} middle text {{/if}} right text</div>
    ```

    HTML does not have markup representation for adjacent text nodes. Rendering the snippet above from the server, regardless of `foo`'s value, the browser creates one contiguous text node. However, Ractive will need _three_ adjacent text nodes to represent it: One for `outer text`, another for `right text` and another for `middle text` when `foo` becomes truthy.

    It has been suggested that Ractive could deal with merged text nodes, but that would lead to extra complexity as there are certain scenarios where the text node would have to split and rejoin. When `foo` is falsey, `left text` and `right text` could be merged. But when `foo` becomes truthy, that text node would have to split in order to accomodate `middle text`.



## events

`(Object<string, Function>)`

A map of [events](../extend/events.md) where the key is the event name and value is an event definition.

```js
events: {
  MyEvent: EventDefinition
}
```



## interpolators

`(Object<string, Function>)`

A map of [interpolators](../extend/interpolators.md) where the key is the interpolator name and the value is an interpolator definition.

```js
interpolators: {
  MyInterpolator: InterpolatorDefinition
}
```



## isolated

`(boolean)`

Controls whether the component will try to [resolve data and plugins on its ancestors](../concepts/templates.md#references). Defaults to `true`.

Relevant only to [Components](../extend/components.md).



## lazy

`(boolean)`

Whether or not to update data using late-firing DOM events (i.e. `change`, `blur`) instead of events that fire immediately on interaction (i.e. `keyup`, `keydown`). Defaults to `false`.

Only applicable if [`twoway`](#twoway) is `true`.

```js
var ractive = new Ractive({
  template: '<input value="{{foo}}">',
  data: { foo: 'bar' },
  lazy: true
});

// Only fires when input loses focus.
ractive.on('change', function(){
  console.log('changed!')
})
```



## nestedTransitions

`(boolean)`

Whether or not to allow transitions to fire if they are already downstream from a transitioning element. Defaults to `true`.

```handlebars
{{#if outer}}
  <div fade-in='slow'>
    Outer text.
    {{#if inner}}
      <div fly-in="fast">Inner text.</div>
    {{/if}}
  </div>
{{/if}}
```

In this example, if `inner` is `true` when `outer` becomes `true`, then all of the `div`s will render at the same time. If `nestedTransitions` is disabled, then the `fly` transition on inner `div` will not be run, since the `fade` will already be running on the outer `div`.

This can also be controlled per transition using the `nested` boolean parameter for transitions:

```handlebars
<div fade-in="{ duration: 'slow', nested: false }">...</div>
```



## noCSSTransform

`(boolean)`

Prevents component CSS from being transformed with scoping guids. Defaults to `false`.



## noIntro

`(boolean)`

Whether or not to skip intro transitions on initial render. Defaults to `false`.

```js
var ractive = new Ractive({
  template: '<ul>{{#items}}<li fade-in>{{.}}</li>{{/items}}</ul>',
  data: { items: [ 'red', 'blue' ] },
  transitions: { fade: function ( t, params ) {...} },
  noIntro: true
});
// 'red' and 'blue' list items do not fade in

ractive.push( 'items', 'green' );
// 'green' list item will fade in
```



## noOutro

`(boolean)`

Whether or not to skip outro transitions during an instance unrender. Defaults to `false`.

```js
var ractive = new Ractive({
  template: '<ul>{{#items}}<li fade-out>{{.}}</li>{{/items}}</ul>',
  data: { items: [ 'red', 'blue' ] },
  transitions: { fade: function ( t, params ) {...} },
  noOutro: true
});

ractive.pop( 'items' );
// 'blue' list item will fade out

ractive.unrender();
// 'red' list item will not fade out
```



## observe

`(Object<string, Function|Object>)`

A hash of observers to subscribe during initialization and unsubscribe during teardown. Defaults to `undefined`.

The keys of the hash may be any string that is accepted by [`ractive.observe()`](/api/instance-methods.md#ractiveobserve), and the values may be either callback functions, as would be passed to `ractive.observe()`, or objects with a `handler` property that is a callback function. The object form also takes other options that control the behavior of the observer.

```js
new Ractive({
  // ..
  observe: {
    show ( value ) {
      console.log( `show changed to '${value}'` );
    },
    'users.*.name people.*.name': {
      handler ( value, old, path, idx ) {
        console.log( `${path} changed to '${value}' );
      },
      init: false,
      strict: true
    }
  }
});
```

The options that may be specified in the object form are (see the [`ractive.observe()` docs](/api/instance-methods#ractiveobserve) for more detailed option descriptions):

* `handler (Function)`: The callback function for the observer.
* `once (boolean)`: Use [`ractive.observeOnce()`](/api/instance-methods#ractiveobserveonce) rather than `ractive.observe()` to install the observer, meaning the observer is implicitly `init: false`, will only fire for the first change to the observed path, and will by removed after the first change.
* `strict (boolean)`: Use strict equality when determining whether or not a value has changed.
* `array (boolean)`: Use an array observer rather than a plain observer.
* `defer (boolean)`: Defer the observer until after the DOM is settled.
* `init (boolean)`: Whether or not to fire an initial change event.
* `links (boolean)`: Whether or not to follow links.
* `context (any)`: Context for the callback function.
* `old (Function)`: Modifier function for the `old` value passed to the callback function.

When a sublcass created with [`Ractive.extend()`](/api/static-methods.md#ractiveextend) is passed an `observe` hash, then any further subclasses or instances created with an `observe` hash will be combined. Any superclass observers are installed first following the inheritance hierarchy, and finally, any instance observers are installed.



## on

`(Object<string, Function|Object>)`

A hash of event listeners to subscribe during initialization and unsubscribe during teardown. Defaults to `undefined`.

The keys of the hash may be any string that is accepted by [`ractive.on()`](/api/instance-methods.md#on), and the values may be either callback functions, as would be passed to `ractive.on()`, or objects with a `handler` property that is a callback function. The object form also takes other options that control the behavior of the event handler.

```js
new Ractive({
  // ...
  on: {
    init () {
      console.log('I will print during init');
    },
    '*.somethingHappened': {
      handler ( ctx ) {
        console.log('I will fire when this instance or any child component fires an instance event named "somethingHappened"');
      },
      once: true
    }
  },
  // ...
});
```

The options that may be specified in the object form are:

* `handler (Function)`: The callback function for the event.
* `once (boolean)`: Use [`ractive.once()`](/api/instance-methods.md#once) rather than `ractive.on()` to subscribe the listener, meaning that the handler will only be called the first time the event is fired and then it will be unsubscribed.

`on` event listeners may subscribe to any instance event, including lifecycle events _after_ `construct`. When a sublcass created with [`Ractive.extend()`](/api/static-methods.md#ractiveextend) is passed an `on` hash, then any further subclasses or instances created with an `on` hash will be combined. Any superclass event handlers are installed first following the inheritance hierarchy, and finally, any instance event handlers are installed.



## oncomplete

`(Function)`

A lifecycle event that is called when the instance is rendered and all the transitions have completed.



## onconfig

`(Function)`

A lifecycle event that is called when an instance is constructed and all initialization options have been processed.



## onconstruct

`(Function)`

A lifecycle event that is called when an instance is constructed but before any initialization option has been processed.

Accepts the instance's initialization options as argument.



## ondetach

`(Function)`

A lifecycle event that is called whenever `ractive.detach()` is called.

Note that `ractive.insert()` implicitly calls `ractive.detach()` if needed.



## oninit

`(Function)`

A lifecycle event that is called when an instance is constructed and is ready to be rendered.



## oninsert

`(Function)`

A lifecycle event that is called when `ractive.insert()` is called.



## onrender

`(Function)`

A lifecycle event that is called when the instance is rendered but _before_ transitions start.



## onteardown

`(Function)`

A lifecycle event that is called when the instance is being torn down.



## onunrender

`(Function)`

A lifecycle event that is called when the instance is being undrendered.



## onupdate

`(Function)`

A lifecycle event that is called when `ractive.update()` is called.



## partials

`(Object<string, string|Object|Function>)`

A map of [partials](../extend/partials.md) where the key is the partial name and the value is either a template string, a parsed template object or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and  [Parse Object](./parse.md) as arguments.

```js
partials: {
  stringPartial: '<p>{{greeting}} world!</p>',
  parsedPartial: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},
  functionPartial: function(data, p){
    return data.condition ? '<p>hello world</p>' : '<div>yes, we have no foo</div>';
  }
}
```

During a [`ractive.reset()`](/api/instance-methods.md#ractivereset), function partials are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## preserveWhitespace

`(boolean)`

Whether or not to preserve whitespace in templates when parsing. Defaults to `false`.

Whitespace in `<pre>` elements is always preserved. The browser will still deal with whitespace in the normal fashion.

```js
var ractive = new Ractive({
  template: '<p>hello\n\n  \tworld   </p>',
  preserveWhitespace: false //default
});

console.log( ractive.toHTML() );
// "<p>hello world</p>"

var ractive = new Ractive({
  template: '<p>hello\n\n  \tworld   </p>',
  preserveWhitespace: true
});

console.log( ractive.toHTML() );
//"<p>hello
//
//  world   </p>"
```



## resolveInstanceMembers

`(boolean)`

Whether or not to include members of the Ractive instance at the end of the reference resolution process. Defaults to `true`.

```handlebars
<button on-click="toggle('show')">Toggle</button>
```

If there is no data member `toggle` in the context of the template, with `resolveInstanceMembers` enabled, the reference will resolve to the [`ractive.toggle()`](/api/instance-methods.md#ractivetoggle) method of the instance.



## sanitize

`(boolean|Object)`

Whether or not certain elements will be stripped from the template during parsing.  Defaults to `false`.

`true` strips out blacklisted elements and event attributes. See [`Ractive.parse()`](static-methods.md#ractiveparse) for the default list of blacklisted elements.

```js
template: `
  <p>some content</p>
  <frame>Am I a bad element or just misunderstood?</frame>
`,
sanitize: true

// result:
// <p>some content</p>
```

The object form should have `elements` which is an array of blacklisted elements and `eventAttributes` boolean which, when `true`, also strips out event attributes.

```js
template: `
  <p>some content</p>
  <div onclick="doEvil()">the good stuff</div>
`,
sanitize: {
  elements: [ 'p' ],
  eventAttributes: true
}

// result:
// <div>the good stuff</div>
```



## staticDelimiters

`(Array[string])`

Sets the static (one-time binding) delimiters. Defaults to `[ '[[', ']]' ]`.

```js
var ractive = new Ractive({
  template: 'hello [[foo]]',
  staticDelimiters: [ '[[', ']]' ], //default
  data: { foo: 'world' }
});
// result: "hello world"

ractive.set( 'foo', 'mars' );
// still is: "hello world"
```



## staticTripleDelimiters

`(Array<string>)`

Sets the static (one-time binding) triple delimiters. Defaults to `[ '[[[', ']]]' ]`.

```js
var ractive = new Ractive({
  template: 'hello [[[html]]]',
  staticTripleDelimiters: [ '[[[', ']]]' ], //default
  data: { html: '<span>world</span>' }
});
// result: "hello <span>world</span>"

ractive.set( 'html', '<span>mars</span>' );
// still is: "hello world"
```



## stripComments

`(boolean)`

Whether or not to remove comments in templates when parsing. Defaults to `true`.

```js
template: '<!-- html comment -->hello world',
stripComments: false

// result:
// <!-- html comment -->hello world
```



## syncComputedChildren

`(boolean)`

Whether or not to invalidate the dependencies of an expression when child keypaths of the expression are updated. Defaults to `false`. _Note_: setting this to `true` may cause performance issues for complex expressions involving large arrays.

```handlebars
<input value="{{pattern}}" />
{{#each filter(users, pattern)}}
  <input value="{{.name}}" />
{{/each}}
```

In this example, the `input` inside the iteration is bound to a computation e.g. `filter(users, pattern).0.name` that isn't actually an addressable model. With `syncComputedChildren` enabled, when that virtual keypath is updated by a user changing the `input`, the expression will invalidate its dependencies (`filter`, `users`, and `pattern`), which will cause any other references to the `user` that happens to coincide with result of the expression to also update.



## target

`(string|HTMLElement|array-like)`

Alias for [`el`](#el).



## template

`(string|array|object|function)`

The [template](../concepts/templates.md#overview) to use. Must either be a CSS selector string pointing to an element on the page containing the template, an HTML string, an object resulting from [`Ractive.parse()`](/api/static-methods.md#ractiveparse) or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and a [Parse Object](./parse.md).

```js
// Selector
template: '#my-template',

// HTML
template: '<p>{{greeting}} world!</p>',

// Template AST
template: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},

// Function
template: function(data, p){
  return '<p>{{greeting}} world!</p>';
},
```

During a [`ractive.reset()`](/api/instance-methods.md#ractivereset), templates provided using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## transitions

`(Object<string, Function>)`

A map of [transitions](../extend/transitions.md) where the key is the name of the transition and the value is a transition definition.



## transitionsEnabled

`(boolean)`

Whether or not transitions are enabled. Defaults to `true`.



## tripleDelimiters

`(Array[string])`

Sets the triple delimiters. Defaults to `[ '{{{', '}}}' ]`.

```js
template: 'hello @html@',
tripleDelimiters: [ '@', '@' ],
data: { html: '<span>world</span>' }

// result:
// hello <span>world</span>
```



## twoway

`(boolean)`

Whether or not [two-way binding](../concepts/data-binding.md#two-way-binding) is enabled. Defaults to `true`.

```js
var ractive = new Ractive({
  template: '<input value="{{foo}}">',
  data: { foo: 'bar' },
  twoway: false
});

// user types "fizz" into <input>, but data value is not changed:

console.log( ractive.get( 'foo' ) ); //logs "bar"

// updates from the model are still pushed to the view

ractive.set( 'foo', 'fizz' );

// input now displays "fizz"
```



## warnAboutAmbiguity

`(boolean)`

Whether or not to warn about references that don't resolve to their immediate context. Defaults to `false`.

Ambiguous references can be the cause of some strange behavior when your data changes structure slightly. With `warnAboutAmbiguity` enabled, Ractive will warn you any time a reference isn't scoped and resolves in a context above the immediate context of the reference.
