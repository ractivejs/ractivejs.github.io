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

---

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

---

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

---

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

---

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

During a [`ractive.reset()`](../api/instance-methods.md#ractivereset), components registered using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## computed

`(Object<string, function|Object>)`

A map of [computed properties](../concepts/data-binding/computed-properties.md) where the key is the name of the computed property and the value is either a computed property expression, a function that returns a value, or an object that has `get` and `set` functions.

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

---

## csp

`(boolean)`

Whether or not to add inline functions for expressions after parsing. Defaults to `false`.

This can effectively eliminate `eval` caused by expressions in templates. It also makes the resulting template no longer JSON compatible, so the template will have to be served via `script` tag.

---

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

---

## data

`(Object<string, any>|Function)`

The data with which to initialise. Can either be an object or a function that returns an object.

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

When using data on components in object form, the data is attached to the component's prototype. Standard prototype rules apply, which means modifying data on the prototype will affect all instances using that prototype.

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

When using data on components in function, the function is run to give each instance a copy of the data instead of attaching the data to the prototype.

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

Data may also be set asynchronously when using data in function form.

```js
data: function () {
  $.get( 'somedata.url', function( data ) {
    this.set( '', data );
  }.bind(this) );

  return {
    foo: 'default'
  };
}
```

---

## decorators

`(Object<string, Function>)`

A map of [decorators](../extend/decorators.md) where the key is the decorator name and the value is a decorator definition.

```js
decorators: {
  MyDecorator: DecoratorDefinition
}
```

---

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

---

## easing

`(Object<string, Function>)`

A map of [easing functions](../extend/easings.md) where the key is the easing function name and the value is the easing function.

```js
easing: {
  MyEasing: EasingDefinition
}
```

---

## el

`(string|HTMLElement|array-like)`

The element to render an instance to. Can either be an `id` of the element, a CSS selector to an element, an HTML element, or an array-like object whose first item is an HTML element.

```js
el: 'container'
el: '#container'
el: document.getElementById('container')
el: jQuery('#container')
```

---

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

---

## events

`(Object<string, Function>)`

A map of [events](../extend/events.md) where the key is the event name and value is an event definition.

```js
events: {
  MyEvent: EventDefinition
}
```

---

## interpolators

`(Object<string, Function>)`

A map of [interpolators](../extend/interpolators.md) where the key is the interpolator name and the value is an interpolator definition.

```js
interpolators: {
  MyInterpolator: InterpolatorDefinition
}
```

---

## isolated

`(boolean)`

Controls whether the component will try to [resolve data and plugins on its ancestors](../concepts/templates/references.md). Defaults to `false`.

Relevant only to [Components](../extend/components.md).

---

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

---

## noCSSTransform

`(boolean)`

Prevents component CSS from being transformed with scoping guids. Defaults to `false`.

---

## noIntro

`(boolean)`

Whether or not to skip intro transitions on initial render. Defaults to `false`.

```js
var ractive = new Ractive({
  template: '<ul>{{#items}}<li intro="fade">{{.}}</li>{{/items}}</ul>',
  data: { items: [ 'red', 'blue' ] },
  transitions: { fade: function ( t, params ) {...} },
  noIntro: true
});
// 'red' and 'blue' list items do not fade in on intro

ractive.get('items').push( 'green' );
// 'green' list item will fade in
```

---

## oncomplete

`(Function)`

A lifecycle event that is called when the instance is rendered and all the transitions have completed.

---

## onconfig

`(Function)`

A lifecycle event that is called when an instance is constructed and all initialization options have been processed.

---

## onconstruct

`(Function)`

A lifecycle event that is called when an instance is constructed but before any initialization option has been processed.

Accepts the instance's initialization options as argument.

---

## ondetach

`(Function)`

A lifecycle event that is called whenever `ractive.detach()` is called.

Note that `ractive.insert()` implicitly calls `ractive.detach()` if needed.

---

## oninit

`(Function)`

A lifecycle event that is called when an instance is constructed and is ready to be rendered.

---

## oninsert

`(Function)`

A lifecycle event that is called when `ractive.insert()` is called.

---

## onrender

`(Function)`

A lifecycle event that is called when the instance is rendered but _before_ transitions start.

---

## onteardown

`(Function)`

A lifecycle event that is called when the instance is being torn down.

---

## onunrender

`(Function)`

A lifecycle event that is called when the instance is being undrendered.

---

## onupdate

`(Function)`

A lifecycle event that is called when `ractive.update()` is called.

---

## partials

`(Object<string, string|Object|Function>)`

A map of [partials](../extend/partials.md) where the key is the partial name and the value is either a template string, a parsed template object or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and  [Parse Object](helper-objects/parse.md) as arguments.

```js
partials: {
  stringPartial: '<p>{{greeting}} world!</p>',
  parsedPartial: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},
  functionPartial: function(data, p){
    return data.condition ? '<p>hello world</p>' : '<div>yes, we have no foo</div>';
  }
}
```

During a [`ractive.reset()`](../api/instance-methods.md#ractive.reset()), function partials are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## preserveWhitespace

`(boolean)`

Whether or not to preserve whitespace in templates when parsing. Defaults to `false`.

Whitespace in `<pre>` elements are always preserved. The browser will still deal with whitespace in the normal fashion.

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

---

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

---

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

---

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

---

## stripComments

`(boolean)`

Whether or not to remove comments in templates when parsing. Defaults to `true`.

```js
template: '<!-- html comment -->hello world',
stripComments: false

// result:
// <!-- html comment -->hello world
```

---

## target

`(string|HTMLElement|array-like)`

Alias for [`el`](#el).

---

## template

`(string|array|object|function)`

The [template](../concepts/templates/overview.md) to use. Must either be a CSS selector string pointing to an element on the page containing the template, an HTML string, an object resulting from [`Ractive.parse()`]\(../api/static-methods.md#Ractive.parse()) or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and a [Parse Object](helper-objects/parse.md).

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

During a [`ractive.reset()`](../api/instance-methods.md#ractive.reset()), templates provided using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## transitions

`(Object<string, Function>)`

A map of [transitions](../extend/transitions.md) where the key is the name of the transition and the value is a transition definition.

---

## transitionsEnabled

`(boolean)`

Whether or not transitions are enabled. Defaults to `true`.

---

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

---

## twoway

`(boolean)`

Whether or not [two-way binding](../concepts/data-binding/two-way-binding.md) is enabled. Defaults to `true`.

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
