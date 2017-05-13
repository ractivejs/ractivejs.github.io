# Initialization Options

The following is an exhaustive list of initialisation options that you can pass to [`new Ractive()`]() and [`Ractive.extend()`](./#ractiveextend). Extra properties passed as options that are not initialization options are added as properties or methods of the instance.

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

An array of [adaptors](extend/adaptors.md) to use. Values can either be names of registered adaptors or an adaptor definition.

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

A map of [adaptors](extend/adaptors.md) where the key is the adaptor name and the value is an adaptor definition.

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

A map of [components](extend/components.md) where the key is the component name the value is either a component definition or a function that returns either a name of a registered component or a component definition. The function form receives processed [`data`](#data) as first argument.

```js
components: {
  StaticComponent: ComponentDefinition,
  DynamicComponent: function(data){
    return data.foo ? 'MyGlobalComponent' : ComponentDefinition;
  }
}
```

During a [`ractive.reset()`](api.md#ractivereset), components registered using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## computed

`(Object<string, function|Object>)`

A map of [computed properties](concepts/data-binding/computed-properties.md) where the key is the name of the computed property and the value is either a computed property expression, a function that returns a value, or an object that has `get` and `set` functions.

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

---

## decorators

`(Object<string, Function>)`

A map of [decorators](extend/decorators.md) where the key is the decorator name and the value is a decorator definition.

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

A map of [easing functions](extend/easings.md) where the key is the easing function name and the value is the easing function.

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

A map of [events](extend/events.md) where the key is the event name and value is an event definition.

```js
events: {
  MyEvent: EventDefinition
}
```

---

## interpolators

`(Object<string, Function>)`

A map of [interpolators](extend/interpolators.md) where the key is the interpolator name and the value is an interpolator definition.

```js
interpolators: {
  MyInterpolator: InterpolatorDefinition
}
```

---

## isolated

`(boolean)`

Controls whether the component will try to [resolve data and plugins on its ancestors](concepts/templates/references.md). Defaults to `true`.

Relevant only to [Components](extend/components.md).

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

A map of [partials](extend/partials.md) where the key is the partial name and the value is either a template string, a parsed template object or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and  [Parse Object](#parse) as arguments.

```js
partials: {
  stringPartial: '<p>{{greeting}} world!</p>',
  parsedPartial: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},
  functionPartial: function(data, p){
    return data.condition ? '<p>hello world</p>' : '<div>yes, we have no foo</div>';
  }
}
```

During a [`ractive.reset()`](api.md#ractivereset), function partials are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

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

`true` strips out blacklisted elements and event attributes. See [`Ractive.parse()`](#ractiveparse) for the default list of blacklisted elements.

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

The template to use. Must either be a CSS selector string pointing to an element on the page containing the template, an HTML string, an object resulting from [`Ractive.parse()`](api.md#ractiveparse) or a function that returns any of the previous options. The function form accepts processed [`data`](#data) and a [Parse Object](#parse).

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

During a [`ractive.reset()`](api.md#ractivereset), templates provided using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## transitions

`(Object<string, Function>)`

A map of [transitions](extend/transitions.md) where the key is the name of the transition and the value is a transition definition.

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

Whether or not [two-way binding](concepts/data-binding/two-way-binding.md) is enabled. Defaults to `true`.

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

# Static Properties

## Ractive.adaptors

`(Object<string, Object>)`

The registry of globally available [adaptors](extend/adaptors.md).

---

## Ractive.components

`(Object<string, Function>)`

The registry of globally available [component definitions](extend/components.md).

---

## Ractive.DEBUG

`(boolean)`

Tells Ractive if it's in debug mode or not. When set to `true`, non-fatal errors are logged. When set to `false`, non-fatal errors are suppressed. By default, this is set to `true`.

---

## Ractive.DEBUG_PROMISES

`(boolean)`

Tells Ractive to log errors thrown inside promises. When set to `true`, errors thrown in promises are logged. When set to `false`, errors inside promises are suppressed. By default, this is set to `true`.

---

## Ractive.decorators

`(Object<string, Function>)`

The registry of globally available [decorators](extend/decorators.md).

---

## Ractive.defaults

`(Object<string, any>)`

Global defaults for [initialisation options](api.md) with the exception of [plugin registries](integrations/plugins.md).

```js
// Change the default mustache delimiters to [[ ]] globally
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Future instances now use [[ ]]
ractive1 = new Ractive({
    template: 'hello [[world]]'
});
```

Defaults can be specified for a subclass of Ractive, overriding global defaults.

```js
var MyRactive = Ractive.extend();

MyRactive.defaults.el = document.body;
```

Configuration on the instance overrides subclass and global defaults.

```js
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Uses the delimiters specified above
new Ractive({
	template: 'hello [[world]]'
});

// Uses the delimiters specified in the init options
new Ractive({
	template: 'hello //world\\',
	delimiters: [ '//', '\\' ]
});
```

---

## Ractive.easing

`(Object<string, Function>)`

The global registry of [easing functions](extend/easings.md).

The easing functions are used by the [`ractive.animate`](api.md#ractive.animate) method and by [transitions](extend/transitions.md). Four are included by default: `linear`, `easeIn`, `easeOut` and `easeInOut`.

---

## Ractive.events

`(Object<string, Function>)`

The global registry of [events](extend/events.md).

---

## Ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by [`ractive.animate()`](api.md#ractive.animate()).

---

## Ractive.partials

`(Object<string, string|Object|Function>)`

The global registry of [partial templates](extend/partials.md).

Like templates, partials are [parsed](concepts/templates/parsing.md) at the point of use. The parsed output is cached and utilized for future use.

---

## Ractive.svg

`(boolean)`

Indicates whether or not the browser supports SVG.

---

## Ractive.transitions

`(Object<string, Function>)`

The global registry of [transition functions](extend/transitions.md).

---

## Ractive.VERSION

`(string)`

The version of the currently loaded Ractive.

# Static Methods

## Ractive.escapeKey()

Escapes the given key so that it can be concatenated with a [keypath](concepts/templates/keypaths.md) string.

**Syntax**

- `Ractive.escapeKey(key)`

**Arguments**

- `key (string)`: The key to escape.

**Returns**

- `(string)`: The escaped key.

**Examples**

```js
Ractive.escapeKey('foo.bar'); // foo\.bar
```

---

## Ractive.extend()

Creates a "subclass" of the Ractive constructor or a subclass constructor. See [`Components`](extend/components.md) for an in-depth discussion on the use of `Ractive.extend`.

**Syntax**

- `Ractive.extend([options[, ...optionsN]])`

**Arguments**

- `[options] (Object)`: One or more objects that represent the defaults for instances of the subclass, with the latter objects' properties taking precedence over the former. See [Initialization Options](api.md) for a list of possible options.

**Returns**

- `(Function)`: The subclass constructor function.

**Examples**

```js
const SubClass = Ractive.extend({
    template: '<div>{{message}}</div>',
    data: {
        message: 'Hello World!'
    }
});

// <div>Hello World!</div>
const instance1 = new SubClass({
    el: '.div1'
});

// <div>Lorem Ipsum</div>
const instance2 = new SubClass({
    el: '.div2',
    data: {
        message: 'Lorem Ipsum'
    }
});
```

---

## Ractive.getCSS()

Returns the scoped CSS from Ractive subclasses defined at the time of the call.

If used without arguments, it will return the scoped CSS of all subclasses. If provided an array of scoping IDs, it will return the scoped CSS of all subclasses whose scoping ID is included in the array.

**Syntax**

- `Ractive.getCSS([key])`

**Arguments**

- `[key] (Array<string>)`: Subclass CSS scoping ID.

**Returns**

- `(string)`: The scoped CSS.

**Examples**

```js
// Assuming the generated ID for this subclass is 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
const Subclass1 = Ractive.extend({
    ...
    css: 'div{ color: red }'
    ...
});

// Assuming the generated ID for this subclass is 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'.
const Subclass2 = Ractive.extend({
    ...
    css: 'div{ color: green }'
    ...
});

// CSS contains the scoped versions of div{ color: red } and div{ color: green }.
const css = Ractive.getCSS();

// css contains the scoped version of div{ color: red } only.
const css = Ractive.getCSS([ 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' ]);

```

---

## Ractive.getNodeInfo()

Accepts a node and returns an [Node Info](#node-info) object containing details of the Ractive instance the node is associated to.

**Syntax**

- `Ractive.getNodeInfo(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of the DOM node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(NodeInfo)`: An [NodeInfo](#node-info) object.

**Examples**

```js
const info = Ractive.getNodeInfo(document.getElementById('some-node'));

const info = Ractive.getNodeInfo('#some-node');
```

---

## Ractive.joinKeys()

Joins the given keys into a properly escaped [keypath](concepts/templates/keypaths.md) e.g. `

**Syntax**

- `Ractive.joinKeys(key1 [, ...keyN])`

**Arguments**

- `key (string)`: One or more strings to join.

**Returns**

- `(string)`: A properly joined and escaped keypath.

**Examples**

```js
Ractive.joinKeys( 'foo', 'bar.baz' ); // foo.bar\.baz
```

---

## Ractive.parse()

Parses the template into an abstract syntax tree that Ractive can work on.

**Syntax**

- `Ractive.parse(template[, options])`

**Arguments**

- `template (string)`: A Ractive-compliant HTML template.
- `[options] (Object)`: Parser options.
    - `[preserveWhitespace] (boolean)`: When `true`, preserves whitespace in templates. Whitespace inside the `<pre>` element is preserved regardless of the value of this option. Defaults to `false`.
    - `[sanitize] (boolean|Object)`: When `true`, strips inline event attributes and certain elements from the markup. Defaults to `false`.
        - `[elements] (Array<string>)`: An array of element names to blacklist.
        - `[eventAttributes] (boolean)`: When `true`, strips off inline event attributes.

When `sanitize` is `true`, the following elements are stripped:

- `<applet>`
- `<base>`
- `<basefont>`
- `<body>`
- `<frame>`
- `<frameset>`
- `<head>`
- `<html>`
- `<isindex>`
- `<link>`
- `<meta>`
- `<noframes>`
- `<noscript>`
- `<object>`
- `<param>`
- `<script>`
- `<style>`
- `<title>`

**Returns**

- `(Object)` - The object representation of the provided markup.

**Examples**

Assume the following markup.

```html
<div class='gallery'>
  {{#items}}
    <!-- comments get stripped out of the template -->
    <figure proxy-tap='select' intro='staggered'>
      <img class='thumbnail' src='assets/images/{{id}}.jpg'>
      <figcaption>{{( i+1 )}}: {{description}}</figcaption>
    </figure>
  {{/items}}
</div>
```

`Ractive.parse( template );` will yield the following output:

```json
[{"t":7,"e":"div","a":{"class":"gallery"},"f":[{"t":4,"r":"items","i":"i","f":[" ",{"t":7,"e":"figure","a":{"intro":"staggered"},"f":[{"t":7,"e":"img","a":{"class":"thumbnail","src":["assets/images/",{"t":2,"r":"id","p":4},".jpg"]}}," ",{"t":7,"e":"figcaption","f":[{"t":2,"x":{"r":["i"],"s":"❖0+1"},"p":4},": ",{"t":2,"r":"description","p":4}]}],"v":{"tap":"select"}}," "],"p":1}]}]
```

TODO: `Ractive.parse` has more options. Document them.

---

## Ractive.splitKeypath()

Splits the given [keypath](concepts/templates/keypaths.md) into an array of unescaped keys.

**Syntax**

- `Ractive.splitKeypath(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) to split into keys.

**Returns**

- `(Array)`: Returns an array of unescaped keys.

**Examples**

```js
Ractive.splitKeypath( 'foo.bar\.baz' ); // [ 'foo', 'bar.baz' ]
```

---

## Ractive.unescapeKey()

Unescapes the given key e.g. `foo\.bar` => `foo.bar`.

**Syntax**

- `Ractive.unescapeKey(key)`

**Arguments**

- `key (string)`: The key to unescape.

**Returns**

- `(string)`: The unescaped key.

**Examples**

```js
Ractive.unescapeKey('foo\.bar'); // foo.bar
```

# Instance Properties

## ractive.adaptors

`(Object<string, Object>)`

The instance-only registry of [adaptors](extend/adaptors.md).

---

## ractive.components

`(Object<string, Function>)`

The instance-only registry of [components](extend/components.md).

---

## ractive.container

`(Ractive)`

Each component instance that is in a yielded fragment has a container instance that is accessible using `this.container`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

If `bar` `{{yield}}`s, then `baz`'s container will be the `foo` instance.

---

## ractive.decorators

`(Object<string, Function>)`

The instance-only registry of [decorators](extend/decorators.md).

---

## ractive.easing

`(Object<string, Function>)`

The instance-only registry of [easing functions](extend/easings.md).

---

## ractive.events

`(Object<string, Function>)`

The instance-only registry of [events](extend/events.md).

---

## ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by [`ractive.animate()`](api.md#ractiveanimate).

---

## ractive.nodes

`(Object<string, HTMLElement>)`

An object containing all of the elements inside the instance that have an `id` attribute.

```js
const ractive = new Ractive({
  el: body,
  template: '<div id="myDiv">An unimaginatively named div.</div>'
});

ractive.nodes.myDiv === document.getElementById( 'myDiv' ); // true
```

This will also reference dynamically created elements.

```js
const ractive = new Ractive({
  el: myContainer,
  template: `
    <ul>
        {{#items:i}}
            <li id='item_{{i}}'>{{content}}</li>
        {{/items}}
    </ul>
  `,
  data: { items: myListOfItems }
});

// Get a reference to an arbitrary li element.
ractive.nodes[ 'item_' + num ];
```

---

## ractive.parent

`(Ractive)`

Each component instance can access its parent using `this.parent`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`baz`'s parent is the `bar` instance, and `bar`'s parent is the `foo` instance.

---

## ractive.partials

`(Object<string, string|Object|Function>)`

The instance-only registry of [partials](extend/partials.md).

---

## ractive.root

`(Ractive)`

Each component instance can access its root Ractive instance using `this.root`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`foo`, `bar`, and `baz` will all have the Ractive instance with this template as their `root`.

---

## ractive.transitions

`(Object<string, Function>)`

The instance-only registry of [transitions](extend/transitions.md).

# Instance Methods

## ractive._super()

Calls the parent method from a child method of the same name.

`ractive._super()` is not always available. Only when Ractive detects its use does it make this reference to the parent method.

**Syntax**

- `ractive._super([arg[, ...argN]])`

**Arguments**

- `[arg] (any)`: One or more arguments to pass to the function.

**Returns**

- `(any)`: Depends on the method called.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGbVOAWwAOPNNxTMAvMwBKSeigCWUtADo0AD3TcAJgApgAHW5OUPI9yMpIzAGYArtyGRjz2AJTMzq4obly8-OYInADm9gDkGAHKaHKe3unhLm44LjjhANzF3DJyAMoBAEYKKmoa2vJKqtzqKBbW6g7Rbh5ePv5BIWGRw7EobEYYZgD6WTkwEVUxcTx8AmbJaZlNzPkohVslZUWu3D0A7swNzV1tKJu4QA"></div>

```js
var Component = Ractive.extend({
	oninit: function() {
		console.log('super init')
	}
});

var SubComponent = Component.extend({
	oninit: function() {
		this._super();
		console.log('sub init');
	}
})

new SubComponent();
```

---

## ractive.add()

Increments the selected keypath.

**Syntax**

- `ractive.add(keypath[, number])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the number we're incrementing.
- `[number] (number)`: The number to increment by. Defaults to `1`.

**Returns**

- `(Promise)`: A promise that resolves when the operation completes.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiQmJkzC-r1CmarNeY0ENDOEDQBzTPOvxZud0GD0eEzw9AAjMNoaCVAtlqt1lpNjtlHsDkcTj1zpdrrdtAMYBVIcNYeoDhhXu9Pj8-gD8aZgZNQfh6AAmaGk6a4IA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	r.add('counter');
	console.log(r.get('counter'));
}, 1000);

setTimeout(function() {
	r.add('counter', 10);
	console.log(r.get('counter'));
}, 2000);
```

---

## ractive.animate()

Similar to [`ractive.set()`](#ractiveset), this will update the data and re-render any affected mustaches and notify [observers](concepts/events/publish-subscribe.md).

All animations are handled by a global timer that is shared between Ractive instances (and which only runs if there are one or more animations still in progress), so you can trigger as many separate animations as you like without worrying about timer congestion. Where possible, `requestAnimationFrame` is used rather than `setTimeout`.

Numeric values and strings that can be parsed as numeric values can be interpolated. Objects and arrays containing numeric values (or other objects and arrays which themselves contain numeric values, and so on recursively) are also interpolated.

Note that there is currently no mechanism for detecting cyclical structures! Animating to a value that indirectly references itself will cause an infinite loop.

Future versions of Ractive may include string interpolators - e.g. for SVG paths, colours, transformations and so on, a la D3 - and the ability to pass in your own interpolator.

If an animation is started on a [keypath](concepts/templates/keypaths.md) which is *already* being animated, the first animation is cancelled. (Currently, there is no mechanism in place to prevent collisions between e.g. `ractive.animate('foo', { bar: 1 })` and `ractive.animate('foo.bar', 0)`.)

**Syntax**

- `ractive.animate(keypath, value[, options])`
- `ractive.animate(map[, options])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) to animate.
- `value (number|string|Object|Array)`: The value to animate to.
- `map (Object)`: A key-value hash of [keypath](concepts/templates/keypaths.md) and value.
- `[options] (Object)`:
    - `[duration] (number)`: How many milliseconds the animation should run for. Defaults to `400`.
    - `[easing] (string|Function)`: The name of an easing function or the easing function itself. Defaults to `linear`.
    - `[step] (Function)`: A function to be called on each step of the animation. Receives `t` and `value` as arguments, where `t` is the animation progress (between `0` and `1`, as determined by the easing function) and `value` is the intermediate value at `t`.
    - `[complete] (Function)`: A function to be called when the animation completes, with the same argument signature as `step` (i.e. `t` is `1`, and `value` is the destination value)

**Returns**

- `(Promise)`: Returns a Promise with an additional `stop` method, which cancels the animation.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiRlVfrMwv69CvoAJmG8Q3omLRhUfeUDF+Gw3oU1mEzeAEZAcMZrggA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	r.animate('counter', 20, { duration: 2000 });
}, 1000);
```

---

## ractive.attachChild()

Creates a parent-child relationship between two Ractive instances. The child may be an instance of a component defined by [`ractive.extend()`](api.md#ractiveextend), but that is not a requirement, as children may be a plain Ractive instance created with `new Ractive()`.

**Syntax**
```js
ractive.attachChild( child );
ractive.attachChild( child, options );
```

**Arguments**

- `child (Ractive instance)`: The child instance to attach.
- `[options] (Object)`:
    - `[target] (string)`: An anchor name at which to render the instance. See [`Components`](extend/components.md). If the instance is already rendered, it will be unrendered and re-rendered at an appropriate anchor.
    - `[append] (boolean)`: Default `true` - add the instance to the end of the list for the targeted anchor.
    - `[prepend] (boolean)`: Add the instance to the beginning of the list for the targeted anchor.
    - `[insertAt] (number)`: Index at which to add the instance in the list for the targeted anchor.

When a child is attached to a parent, the child's `parent` property is updated in an observable way, so any references to `@this.parent` in the child will be notified of the change.

A child may be targeted to a [`Components`](extend/components.md) when it is attached. If a child has no specified target, then it is responsible for managing its own render cycle. If a child does have a specified target, then the parent will manage rendering and unrendering the child as appropriate in the same way that a regular component has a managed render cycle.

When a child is attached targeting an anchor, only anchors that belong directly to the parent are considered as hosts. However, any element or component queries on the parent instance, including live queries, will consider the child when trying to match both elements and components. There is also an option on the query methods that allows querying remote, unmanaged instances, so that non-anchored children can also be queried for elements and components.

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

Children can be detached using [`ractive.detachChild()`](#ractivedetachchild).

**Examples**

```js
// TODO
```

---

## ractive.detach()

Detaches the instance from the DOM, returning a document fragment. You can reinsert it, possibly in a different place, with [`ractive.insert()`](#ractiveinsert) (note that if you are reinserting it immediately you don't need to detach it first - it will happen automatically).

**Syntax**

- `ractive.detach()`

**Arguments**

- None

**Returns**

- `(DocumentFragment)`: A document fragment.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJgAjAvIB7AK7L0MSPWDA9h4zhwkp2lWqTKm9DLplpeYlCrsVqOiVVZRImKgA3RlYOGSQqVUU7cIiFEAIMeAikGHpclnplNAB3egAlJHIUSLQACmBHdARTAHIAYjiElrxG9BkuVDRWtpQubsamVCRTBtVfFEsjNBN6AAZGnBUcAEoAbkdlDDQUABUqTwMUWoAzQyqqXWVa7bNG7NyU+gKmXXJ9TyMADpKGhBgBRBBoAFXFopFp7CaRQFIGiCFwAYTAVAQTFqMEBTGOlTAzwRcz0h10kMBCF0AHNailAQkijAABInACyABkyfh6JpVkK9rggA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	var div = document.createElement('div');
	div.appendChild(r.detach());
	console.log(div.innerHTML);
}, 1000);
```

---

## ractive.detachChild()

Detaches a child from an instance when it was previously attached with [`ractive.attachChild()`](#ractiveattachchild).

When a child instance that was attached targeting an anchor is detached, its instance is spliced out of the `@this.children.byName.anchorName` array so that subsequent children move forward to fill the void.

**Syntax**

- `ractive.detachChild( child )`

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

**Examples**

```js
// TODO
```

---

## ractive.find()

Returns the first element inside a given Ractive instance matching a CSS selector. This is similar to doing `this.el.querySelector(selector)` (though it doesn't actually use `querySelector()`).

**Syntax**

- `ractive.find(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the element to find.
- `[options] (Object)`:

**Returns**

- `(Node)`: A Node.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnsaPtdn4se0mLdXjQ-HFEslXrCguRCU0EGg-NUErdmej0DBTEiALLpTnKfD0ACMAAYVbDcEA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl'
});

setTimeout(function() {
	var p = r.find('p.target');
	console.log(p.outerHTML);
}, 1000);
```

---

## ractive.findAll()

This method is similar to [`ractive.find()`]ractivefind), with two important differences. Firstly, it returns a list of elements matching the selector, rather than a single node. Secondly, it can return a *live* list, which will stay in sync with the DOM as it continues to update.

**Syntax**

- `ractive.findAll(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the elements to find.
- `[options] (Object)`
    - `[live] (boolean)`: Whether to return a live list or a static one. Defaults to `false`.

**Returns**

- `(Array<Node>)`: An array of nodes.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnt8vtdn4se0mABBBAIW6vGivWFBfK0rIAUUuYGxuPxhNuNBJZNc5EJTQQaD81QSYr86PQMFMSIAsulOXpoZCSgBGAAMpthuCAA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl'
});

setTimeout(function() {
	var ps = r.findAll('p');
	ps.forEach(function(p) {
		console.log(p.outerHTML);
	})
}, 1000);
```

---

## ractive.findAllComponents()

Returns all components inside a given Ractive instance with the given `name` (or all components of any kind if no name is given).

**Syntax**

- `ractive.findAllComponents([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`
    - `[live] (boolean)`: Whether to return a live list or a static one. Defaults to `false`.

**Returns**

- `(Array<ractive>)`: An array of ractive instances.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cgYeiDGBxel1JgAQQQCGxCNmmzhGJQ60uMIwQu8MAAorowAymSyqGzyBzkY4ULDlBhvAgJghvABzWbkOIobwACTJAFkADLspV4s6nUxGAAMIcuuCAAa"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = new Ractive({
	el: '#main',
	template: '#tpl',
	components: {
		Component: Component
	}
});

setTimeout(function() {
	var cs = r.findAllComponents('Component');
	cs.forEach(function(c) {
		console.log(c.toHTML());
	})
}, 1000);
```

---

## ractive.findComponent()

Returns the first component inside a given Ractive instance with the given `name` (or the first component of any kind if no name is given).

**Syntax**

- `ractive.findComponent([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`:

**Returns**

- `(Ractive)`: A ractive instance.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cj0QYwOL0upMbH9WabOEYlDrS4wgIYbwICYIbwAc1m5DiKG8AAkyQBZAAy7NlBNMRgADFbLrggA"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = new Ractive({
	el: '#main',
	template: '#tpl',
	components: {
		Component: Component
	}
});

setTimeout(function() {
	var c = r.findComponent('Component');
	console.log(c.toHTML());
}, 1000);
```

---

## ractive.findContainer()

Returns the first container of this component instance with the given `name`.

**Syntax**

- `ractive.findContainer(name)`

**Arguments**

- `name (string)`: The name of the container to find.

**Returns**

- `(Ractive)`: Returns the first container of this component with the given `name`.

**Examples**

```js
// TODO
```

---

## ractive.findParent()

Returns the first parent of this component instance with the given `name`.

**Syntax**

- `ractive.findParent(name)`

**Arguments**

- `name (string)`: The name of the parent to find.

**Returns**

- `(Ractive)`: Returns the first parent of this component with the given `name`.

**Examples**

```js
// TODO
```

---

## ractive.fire()

Fires an event, which will be received by handlers that were bound using [`ractive.on`](#ractiveon). In practical terms, you would mostly likely use this with [`Ractive.extend()`](api.md#ractiveextend), to allow applications to hook into your subclass.

**Syntax**

- `ractive.fire(eventName[, arg1[, ...argN])`

**Arguments**

- `name (string)`: The name of the event.
- `[arg] (any)`: The arguments that event handlers will be called with.

**Returns**

- `(boolean)`

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAAoAlAG4AOt0swAdD0MByAGadODvMycBXbjt33jZmBLcxQuXn40GwROAHNHF05PXRg0ABMHM0scLKtuWycUo2dXTNNcIA"></div>

```js
var r = new Ractive();

r.on('foo', function() {
  console.log('foo fired');
});

r.fire('foo');
```

---

## ractive.get()

Returns the value at `keypath`. If the [keypath](concepts/templates/keypaths.md) is omitted, returns a shallow copy of all the data in the instance. This data includes mappings introduced by enclosing components, but excludes computed properties.

**Syntax**

- `ractive.get([keypath])`

**Arguments**

- `[keypath] (string)`: The [keypath](concepts/templates/keypaths.md) of the data to retrieve.

**Returns**

- `(any)`: Returns whatever data was on the keypath, or all if no [keypath](concepts/templates/keypaths.md) was provided.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAApgAHW4mUAE1RJIzU+ZQWAZp052HFrygBGsuwDazADkfgBewcwAumbeOLEo8dw4AJQA3LHcXLz8aAB0CJwA5oYweUVoKIbBrpx5fmUADMEp6bhAA"></div>

```js
var r = new Ractive({
	data: {
		foo: {
			bar: [ 'baz' ]
		}
	}
});

console.log(r.get('foo.bar.0'));
```

---

## ractive.getNodeInfo()

This is an instance specific version of [`Ractive.getNodeInfo()`](api.md#ractivegetnodeinfo) that will only search the local instance DOM for a matching node when a selector is given. If the given value is not a string, then it is passed directly through to the static version of this method.

**Syntax**

- `ractive.getNodeInfo(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of a target node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(NodeInfo)`: Returns an [NodeInfo](#node-info) object with helper methods to interact with the Ractive instance and context associated with the given node.

**Examples**

```js
// TODO
```

---

## ractive.insert()

Inserts the instance to a different location. If the instance is currently in the DOM, it will be detached first. See also [`ractive.detach()`](#ractivedetach).

**Syntax**

- `ractive.insert(target[, anchor])`

**Arguments**

- `target (string|Node|array-like)`: The new parent element.
- `[anchor] (string|Node|array-like)`: The sibling element to insert the instance before. If omitted, the instance will be inserted as the last child of the parent.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

---

## ractive.link()

Creates a link between two [keypaths](concepts/templates/keypaths.md) that keeps them in sync. Since Ractive can't always watch the contents of objects, copying an object to two different [keypaths](concepts/templates/keypaths.md) in your data usually leads to one or both of them getting out of sync. `link` creates a sort of symlink between the two paths so that Ractive knows they are actually the same object. This is particularly useful for master/detail scenarios where you have a complex list of data and you want to be able to select an item to edit in a detail form.

**Syntax**

- `ractive.link(source, destination)`

**Arguments**

- `source (string)`: The [keypath](concepts/templates/keypaths.md) of the source item.
- `destination (string)`: The [keypath](concepts/templates/keypaths.md) to use as the destination - or where you'd like the data 'copied'.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
ractive.link( 'some.nested.0.list.25.item', 'current' );
ractive.set( 'current.name', 'Rich' ); // some.nested.0.list.25.item.name is also updated to be 'Rich'
```

This can be used to great effect with method events and the [`@keypath`](concepts/templates/references.md) special ref:

```html
{{#each some.nested}}
  {{#each list}}
    {{#with item}}
      {{.name}}
      <button on-click="event.link('.', 'current')">Select</button>
    {{/with}}
  {{/each}}
{{/each}}

Name: <input value="{{~/current.name}}" />
```

Links can be removed using [`ractive.unlink()`](#ractiveunlink).

---

## ractive.merge()

Sets the indicated [keypath](concepts/templates/keypaths.md) to the new array value, but "merges" the existing rendered nodes representing the data into the newly rendered array, inserting and removing nodes from the DOM as necessary. Where necessary, items are moved from their current location in the array (and, therefore, in the DOM) to their new location.

This is an efficient way to (for example) handle data from a server. It also helps to control `intro` and `outro` [transitions](extend/transitions.md) which might not otherwise happen with a basic [`ractive.set()`](#ractiveset) operation.

To determine whether the first item of `['foo', 'bar', 'baz']` is the same as the last item of `['bar', 'baz', 'foo']`, by default we do a strict equality (`===`) check.

In some situations that won't work, because the arrays contain objects, which may *look* the same but not be identical. To deal with these, we use the `compare` option detailed below.

Merge can also be used to created a context block that uses transitions when the context changes.

**Syntax**

- `ractive.merge(keypath, value[, options])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array we're updating.
- `value (Array)`: The new data to merge in.
- `[options] (Object)`
    - `[compare] (boolean)`: If `true`, values will be stringified (with `JSON.stringify`) before comparison.
    - `[compare] (string)`: A property name that will be used to compare the array elements.
    - `[compare] (Function)`: A function that returns a value with which to compare array members.

**Returns**

- `(Promise)` - Returns a promise.

**Examples**


```html
{{#user}}
<div intro='fade'>{{first}} {{last}}</div>
{{/}}
```

```js
var r = new Ractive({
    el: document.body,
    template: '#template',
    data: {
        user: [{
            first: 'sam',
            last: 'smith'
        }]
    },
    complete: function(){
        this.merge('user', [{
            first: 'jane',
            last: 'johnson'
        }])
    }
})
```

---

## ractive.observe()

Observes the data at a particular [keypath](concepts/templates/keypaths.md). Unless specified otherwise, the callback will be fired immediately, with `undefined` as `oldValue`. Thereafter it will be called whenever the *observed keypath* changes.

**Syntax**

- `ractive.observe(keypath, callback[, options])`
- `ractive.observe(map[, options])`

**Arguments**

- `keypath (String)`: The [keypath](concepts/templates/keypaths.md) to observe, or a group of space-separated keypaths. Any of the keys can be a `*` character, which is treated as a wildcard. A `**` means recursive.

    The difference between `*` and `**` is that `*` provides your callback function `value` and `keypath` arguments containing the path of the what actually changed, at any level of the keypath. So instead of getting the same parent value on every change, you get the changed value from whatever arbitrarily deep keypath changed.

- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see [Observers](concepts/events/publish-subscribe.md) for more nuance regarding these arguments), whenever the observed [keypath](concepts/templates/keypaths.md) changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the [keypath](concepts/templates/keypaths.md) will have their matches passed to the callback at the end of the arguments list as well.
- `map (Object)`: A map of keypath-observer pairs.
- `[options] (Object)`:
    - `[init] (boolean)`: Defaults to `true`. Whether or not to initialise the observer, i.e. call the function with the current value of `keypath` as the first argument and `undefined` as the second.
    - `[defer] (boolean)`: Defaults to `false`, in which case [observers](concepts/events/publish-subscribe.md) will fire before any DOM changes take place. If `true`, the [observer](concepts/events/publish-subscribe.md) will fire once the DOM has been updated.
    - `[links] (boolean)`: Defaults to `false`.  Whether or not the observer should "follow through" any links created with [`ractive.link()`](#ractivelink).
    - `[strict] (boolean)`: Defaults to `false`. `strict` uses object identity to determine if there was a change, meaning that unless the primary object changed, it won't trigger the observer. For example with `{ data: { foo: { bar: 'baz' } } }`, `ractive.observe('foo', ..., { strict: true })` will not fire on `ractive.set('foo.bar', 'bat')` but will on `ractive.set('foo', { bar: 'bip' })`.
    - `[context] (any)`: Defaults to `ractive`. The context the [observer](concepts/events/publish-subscribe.md) is called in (i.e. the value of `this`)

**Returns**

- `(Object)`: An object with a `cancel` method, for cancelling all observers

**Examples**

```js
// TODO
```

Note that you can observe [keypath](concepts/templates/keypaths.md) *patterns*...

```js
ractive.observe( 'items.*.status', function ( newValue, oldValue, keypath) {
	var index = /items.(\d+).status/.exec( keypath )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated [keypaths](concepts/templates/keypaths.md) simultaneously:

```js
ractive.observe( 'foo bar baz', function ( newValue, oldValue, keypath ) {
	alert( keypath ) + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See [Observers](concepts/events/publish-subscribe.md) for more detail.

---

## ractive.observeOnce()

Observes the data at a particular [keypath](concepts/templates/keypaths.md) until the first change. After the handler has been called, it will be unsubscribed from any future changes.

**Syntax**

- `ractive.observeOnce(keypath, callback[, options])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) to observe, or a group of space-separated keypaths. Any of the keys can be a `` character, which is treated as a wildcard.
- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see [Observers](concepts/events/publish-subscribe.md) for more nuance regarding these arguments), whenever the observed [keypath](concepts/templates/keypaths.md) changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the [keypath](concepts/templates/keypaths.md) will have their matches passed to the callback at the end of the arguments list as well.
- `[options] (Object)`:
    - `[defer] (boolean)`: Defaults to `false`, in which case [observers](concepts/events/publish-subscribe.md) will fire before any DOM changes take place. If `true`, the [observer](concepts/events/publish-subscribe.md) will fire once the DOM has been updated.
    - `[context] (any)`: Defaults to `ractive`. The context the [observer](concepts/events/publish-subscribe.md) is called in (i.e. the value of `this`)

**Returns**

- `(Object)`: An object with a `cancel` method, for cancelling the observer.

**Examples**

```js
// TODO
```

Note that you can observe [keypath](concepts/templates/keypaths.md) *patterns*...

```js
ractive.observeOnce( 'items.*.status', function ( newValue, oldValue, keypath ) {
	var index = /items.(\d+).status/.exec( keypath )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated [keypaths](concepts/templates/keypaths.md) simultaneously:

```js
ractive.observeOnce( 'foo bar baz', function ( newValue, oldValue, keypath ) {
	alert( keypath + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See [Observers](concepts/events/publish-subscribe.md) for more detail.

---

## ractive.off()

Removes an event handler, several event handlers, or all event handlers.

To remove a single handler, you must specify both the event name and the handler. If you only specify the event name, all handlers bound to that event name will be removed. If you specify neither event name nor handler, **all** event handlers will be removed.

An alternative way to remove event handlers is to use the `cancel` method of the return value of a call to `ractive.on()`.

**Syntax**

- `ractive.off([eventName[, handler]])`

**Arguments**

- `eventName (string)`: The event name to which this handler is currently bound.
- `handler (Function)`: The handler to remove.

**Returns**

- `(Ractive)`: Returns the `ractive` instance to allow this call to be chainable.

**Examples**

```js
// TODO
```

---

## ractive.on()

Subscribe to [events](extend/events.md).

**Syntax**

- `ractive.on(eventName, handler)`
- `ractive.on(obj)`

**Arguments**

- `eventName (String)`: The name of the event to subscribe to
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel [event bubbling](extend/events.md).
- `obj (Object)`: An object with keys named for each event to subscribe to. The value at each key is the handler function for that event.

**Returns**

- `(Object)` - An `Object` with a `cancel` method, which removes the handler.
- `(Object)` - An `Object` with a `cancel` method, which removes all handlers in the passed-in `obj`.

**Examples**

```js
// single handler to function
ractive.on( 'activate', function () {...});

// wildcard pattern matching
ractive.on( 'foo.*', function () {...} );

// multiple handlers to one function
ractive.on( 'activate select', function () {...} );

// map of handler/function pairs
ractive.on({
	activate: function () {...},
	select: function () {...}
});

// knock yourself out:
ractive.on({
	activate: function () {...},
	'bip bop boop': function () {...},
	'select foo.* bar': function () {...}
});
```

---

## ractive.once()

Subscribe to an event for a single firing. This is a convenience function on top of [`ractive.on()`](#ractiveon).

**Syntax**

- `ractive.once(eventName, handler)`

**Arguments**

- `eventName (string)`: The name of the event to subscribe to.
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel [event bubbling](extend/events.md).

**Returns**

- `(Object)`: Returns an `Object` with a `cancel` method, which removes the handler.

**Examples**

```js
// TODO
```

---

## ractive.pop()

The Ractive equivalent to ```Array.pop``` that removes an element from the end of the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.pop(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.push()

The Ractive equivalent to ```Array.push``` that appends one or more elements to the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.push(keypath, value[, ...valueN])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to append to the end of the array. One or more values may be supplied.

**Returns**

- `(Promise)` - Returns a Promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.render()

Renders the component into a DOM element.

**Syntax**

- `ractive.render(target)`

**Arguments**

- `target (Node|String|array-like)`: The DOM element to render to.

**Returns**

- `(Promise)`: A promise that resolves when rendering completes or when the instance is already rendered.

**Examples**

```js
// TODO
```

---

## ractive.reset()

Resets the entire `ractive.data` object and updates the DOM.

**Syntax**

- `ractive.reset(data)`

**Arguments**

- `data (Object)`: The data to reset with. Defaults to `{}`.

**Returns**

- `(Promise)`: A promise.

**Examples**

This differs from `ractive.set()` in the following way:

```js
ractive = new Ractive({
  // ...,
  data: { foo: 1 }
});

ractive.set({ bar: 2 });
console.log( ractive.get() ); // { foo: 1, bar: 2 }

ractive.reset({ bar: 2 });
console.log( ractive.get() ); // { bar: 2 }
```

---

## ractive.resetPartial()

Resets a partial and re-renders all of its use-sites, including in any components that have inherited it. If a component has a partial with a same name that is its own, that partial will not be affected.

Inline partials that don't belong directly to a Ractive instance aren't affected by `resetPartial`.

**Syntax**

- `ractive.resetPartial(name, partial)`

**Arguments**

- `name (string)`: The partial to reset.
- `partial (string|Object|Function)`: A template string, pre-parsed template or a function that returns either.

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
ractive = new Ractive({
  // ...,
  partials: { foo: 'foo' }
});

// {{>foo}} will be replaced with 'foo'

ractive.resetPartial('foo', 'bar');

// {{>foo}} will be replaced with 'bar'
```

---

## ractive.reverse()

The Ractive equivalent to ```Array.reverse``` reverses the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.reverse(keypath)`

**Arguments**

- `keypath (String)`: The [keypath](concepts/templates/keypaths.md) of the array to reverse, e.g. `list` or `order.items`

**Returns**

- `(Promise)` - A promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.set()

Updates data and triggers a re-render of any mustaches that are affected (directly or indirectly) by the change. Any [observers](concepts/events/publish-subscribe.md) of affected [keypaths](concepts/templates/keypaths.md) will be notified.

When setting an array value, ractive will reuse the existing DOM nodes for the new array, adding or removing nodes as necessary. This can impact nodes with [transitions](extend/transitions.md). See [`ractive.merge()`](#ractivemerge) for setting a new array value while retaining existing nodes corresponding to individual array item values.

**Syntax**

- `ractive.set(keypath, value)`
- `ractive.set(map)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the data we're changing, e.g. `user` or `user.name` or `user.friends[1]` or `users.*.status`.
- `value (any)`: The value we're changing it to. Can be a primitive or an object (or array), in which case dependants of *downstream keypaths* will also be re-rendered (if they have changed).
- `map (Object)`: A map of `keypath: value` pairs, as above.

**Returns**

- `(Promise)`: Returns a promise that will be called after the set operation and any transitions are complete.

**Examples**

```js
// TODO
```

The `keypath` can also contain wildcards [pattern-observers](concepts/events/publish-subscribe.md). All matching [keypaths](concepts/templates/keypaths.md) will be set with the supplied values:

```js
ractive.on('selectAll', function(){
	ractive.set('items.*.selected', true);
})
```

---

## ractive.shift()

The Ractive equivalent to `Array.shift` that removes an element from the beginning of the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.shift(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: A promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.sort()

The Ractive equivalent to ```Array.sort``` sorts the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.sort(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to sort, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.splice()

The Ractive equivalent to ```Array.splice``` that can add new elements to the array while removing existing elements.

If the given [keypath](concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.splice(keypath, index, [removeCount[, add]])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `index (number)`: The index at which to start the operation.
- `[removeCount] (number)`: The number of elements to remove starting with the element at *`index`. This may be 0 if you don't want to remove any elements.
- `[add] (any)`: Any elements to insert into the array starting at *`index`. There can be 0 or more elements passed to add to the array.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed elements after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.subtract()

Decrements the selected [keypath](concepts/templates/keypaths.md).

**Syntax**

- `ractive.subtract(keypath[, number])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the number we're decrementing.
- `[number] (number)`: Defaults to `1`. The number to decrement by.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
// TODO
```

---

## ractive.teardown()

Unrenders this Ractive instance, removing any event handlers that were bound automatically by Ractive.

Calling `ractive.teardown()` causes a `teardown` [event](extend/events.md) to be fired - this is most useful with [`Ractive.extend()`](api.md#ractiveextend) as it allows you to clean up anything else (event listeners and other bindings) that are part of the subclass.

**Syntax**

- `ractive.teardown()`

**Arguments**

- None

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---

## ractive.toCSS()

Returns the scoped CSS of the current instance and its descendants.

At the moment, this will not work on a direct instance of Ractive and will log a warning. You can only use this method on an instance of a subclass.

**Syntax**

- `ractive.toCSS()`

**Arguments**

- None

**Returns**

- `(string)`: The scoped CSS of the instance.

**Examples**

```js
const Subclass = Ractive.extend({
    ...
    css: 'div{ color: red }'
    ...
});

const subclassInstance = new Subclass({...});

// Contains the scoped version of div{ color: red }
subclassInstance.toCSS();
```

---

## ractive.toHTML()

Returns a chunk of HTML representing the current state of the instance. This is most useful when you're using Ractive in node.js, as it allows you to serve fully-rendered pages (good for SEO and initial pageload performance) to the client.

**Syntax**

- `ractive.toHTML()`

**Arguments**

- None

**Returns**

- `(string)`: The instance HTML.

**Examples**

```js
// TODO
```

---

## ractive.toggle()

Toggles the selected [keypath](concepts/templates/keypaths.md). In other words, if `foo` is [truthy](http://james.padolsey.com/javascript/truthy-falsey/), then `ractive.toggle('foo')` will make it `false`, and vice-versa.

**Syntax**

- `ractive.toggle(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) to toggle the value of. If **keypath** is a pattern, then all matching [keypaths](concepts/templates/keypaths.md) will be toggled.

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---

## ractive.transition()

Triggers a transition on a node managed by this Ractive instance.

**Syntax**

- `ractive.transition(transition, node, options)`

**Arguments**

- `transition (string|Function)`: A transition function or a name of a transition function.
- `node (HTMLElement)`: The node on which to start the transition - optional if called from within a Ractive event handler, as it will be retrieved from the event if not supplied.
- `options (Object)`: Options supplied to the transition.

**Returns**

- `(Promise)`: A promise that resolves when the transition completes.

**Examples**

```js
// TODO
```

---

## ractive.unlink()

Removes a link set up by [`ractive.link()`](#ractivelink).

**Syntax**

- `ractive.unlink(destination)`

**Arguments**

- `destination (string)`: The destination supplied to [`ractive.link()`].

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---
## ractive.unrender()
---

Unrenders this Ractive instance, throwing away any DOM nodes associated with this instance. This is the counterpart to [`ractive.render()`](#ractiverender). The rest of the ractive instance is left intact, unlike [`ractive.teardown()`](#ractiveteardown).

**Syntax**

- `ractive.unrender()`

**Arguments**

- None

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---
## ractive.unshift()

The Ractive equivalent to ```Array.unshift``` that prepends one or more elements to the array at the given [keypath](concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.unshift(keypath, value)`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to prepend to the beginning of the array. One or more values may be supplied.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.update()

"Dirty checks" everything that depends directly or indirectly on the specified [keypath](concepts/templates/keypaths.md). If no `keypath` is specified, all keypaths will be checked. Keypaths that involve special references (i.e. `@global`) require the keypath to be supplied.

This is useful when manipulating the instance's data without using the built in setter methods (i.e. [`ractive.set()`](#ractiveset), [`ractive.animate()`](#ractiveanimate)).

**Syntax**

- `ractive.update([keypath])`

**Arguments**

- `[keypath] (string)`: The keypath to treat as 'dirty'.

**Returns**

- `(Promise)`: A promise that resolves when the operation completes.

**Examples**

```js
ractive.observe( 'foo', function ( foo ) {
  alert( foo );
});

model.foo = 'changed';   // Does not cause the instance to update.
ractive.update( 'foo' ); // Informs the instance that foo was changed externally.
```

---

## ractive.updateModel()

If you programmatically manipulate inputs and other elements that have [two‐way binding](concepts/data-binding/two-way-binding.md) set up, your model can get out of sync. In these cases, we need to force a resync with `ractive.updateModel()`:

**Syntax**

- `ractive.updateModel([keypath[, cascade]])`

**Arguments**

- `keypath (string)`: The [keypath](concepts/templates/keypaths.md) to treat as 'dirty'. Any two-way bindings linked to this [keypath](concepts/templates/keypaths.md) will be checked to see if the model is out of date
- `cascade (boolean)`: If true, bindings that are *downstream* of `keypath` will also be checked - e.g. `ractive.updateModel( 'items', true )` would check `items.0.foo` and `items.1.foo` and so on. Defaults to `false`.

**Returns**

- `(Promise)`: A promise. If a `keypath` is not specified, all two-way bindings will be checked.

**Examples**

```js
ractive = new Ractive({
  el: 'container',
  template: '<input value="{{name}}">'
  data: { name: 'Bob' }
});

ractive.find( 'input' ).value = 'Jim';
alert( ractive.get( 'name' ) ); // alerts 'Bob', not 'Jim'

ractive.updateModel();
alert( ractive.get( 'name' ) ); // alerts 'Jim'
```

# Node Info

The nodeinfo object is the type of object you receive when calling [Node Info](#node-info). This object contains various properties and methods that allow you to obtain information about the Ractive instance, the node associated with it and the context surrounding it.

Helper methods that take a [keypath](concepts/templates/keypaths.md) will resolve relative to that node's context. Special references, template aliases, and key and index aliases are supported.

---

## nodeinfo.add()

See [ractive.add()](#ractiveadd).

---

## nodeinfo.animate()

See [ractive.animate()](#ractiveanimate).

---

## nodeinfo.context

_`(any)`_

The data context of the node.

---

## nodeinfo.get()

See [ractive.get()](#ractiveget).

---

## nodeinfo.getBinding()

Returns the value of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.getBinding()`

**Arguments**

- None

**Returns**

- `(any)`: The value of the binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getNodeInfo('#findMe').getBinding(); // returns value of foo.bar.baz
```

## nodeinfo.getBindingPath()

Returns the [keypath](concepts/templates/keypaths.md) of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.getBindingPath([ractive])`

**Arguments**

- `[ractive] (Ractive)`: The instance to resolve the [keypath](concepts/templates/keypaths.md) against.

**Returns**

- `(string)`: The [keypath](concepts/templates/keypaths.md) of the node binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getNodeInfo('#findMe').getBindingPath(); // Returns "foo.bar.baz"
```

---

## nodeinfo.index

_`(number|undefined)`_

The index of `context` if it's in an array. If not in an array, the value is `undefined`.

---

## nodeinfo.isBound()

Returns `true` if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.isBound()`

**Arguments**

- None

**Returns**

- `(boolean)`: `true` if the node represented has a two-way binding.

**Examples**

```html
{{#with foo.bar}}
  <input id="foo" value="{{.baz}}" />
  <input id="bar" value="" />
{{/with}}
```

```js
Ractive.getNodeInfo('#foo').isBound(); // Returns true
Ractive.getNodeInfo('#bar').isBound(); // Returns false
```

---

## nodeinfo.keypath

_`(string)`_

The [keypath](concepts/templates/keypaths.md) to `context`.

---

## nodeinfo.link()

See [ractive.link()](#ractivelink).

---

## nodeinfo.merge()

See [ractive.merge()](#ractivemerge).

---

## nodeinfo.node

_`(Node|undefined)`_

The node the event originated from. Normally present when the event is a Ractive DOM. May be `undefined` on custom events or events from event plugins.

---

## nodeinfo.original

_`(Event|undefined)`_

The original DOM event object. Normally present when the event is a Ractive DOM event. May be `undefined` on custom events or events from event plugins.

---

## nodeinfo.pop()

See [ractive.pop()](#ractivepop).

---

## nodeinfo.push()

See [ractive.push()](#ractivepush).

---

## nodeinfo.ractive

_(Ractive)_

This property holds a reference to the Ractive instance that controls the node represented by this info object.

---

## nodeinfo.resolve()

Resolves the given [keypath](concepts/templates/keypaths.md) to a full keypath. If a Ractive instance is supplied, the resolved path will also account for any mappings defined for the instance.

**Syntax**

- `nodeinfo.resolve([keypath[, ractive]])`

**Arguments**

- `[keypath] (string)`: The [keypath](concepts/templates/keypaths.md) to resolve.
- `[ractive] (Ractive)`: The instance to resolve the [keypath](concepts/templates/keypaths.md) against.

**Returns**

- `(string)`: The resolved keypath.

**Examples**

```js
// TODO
```

---

## nodeinfo.reverse()

See [ractive.reverse()](#ractivereverse).

---

## nodeinfo.set()

See [ractive.set()](#ractiveset).

---

## nodeinfo.setBinding()

Sets the binding of the node represented by this info object to the specified value.

**Syntax**

- `nodeinfo.setBinding(value)`

**Arguments**

- `value (any)`. The value to set.

**Returns**

- `(Promise)`

**Examples**

```js
// TODO
```

---

## nodeinfo.shift()

See [ractive.shift()](#ractiveshift).

---

## nodeinfo.splice()

See [ractive.splice()](#ractivesplice).

---

## nodeinfo.sort()

See [ractive.sort()](#ractivesort).

---

## nodeinfo.subtract()

See [ractive.subtract()](#ractivesubtract).

---

## nodeinfo.toggle()

See [ractive.toggle()](#ractivetoggle).

---

## nodeinfo.unlink()

See [ractive.unlink()](#ractiveunlink).

---

## nodeinfo.unshift()

See [ractive.unshift()](#ractiveunshift).

---

## nodeinfo.update()

See [ractive.update()](#ractiveupdate).

---

## nodeinfo.updateModel()

See [ractive.updateModel()](#ractiveupdatemodel).

# Parse

The parse object is an object you receive as the second argument in [function templates](#template). This helper object provides you with essential functions to dissect markup before turning over the template for use.

---

## p.fromId()

Retrieves the template from the DOM `<script>` tag specified by `id`. Make sure to set `type='text/ractive'` on the `<script>` tag to prevent the browser from running the template as a script.

**Syntax**

- `p.fromId(id)`

**Arguments**

- `id (string)`: The id of the `<script>` tag containing the template. The leading `#` is optional.

**Returns**

- `(string)`: The template inside the specified element.

**Examples**

```js
// TODO
```

---

## p.isParsed()

Test whether the supplied template is already parsed and is in its object form.

**Syntax**

- `p.isParsed(template)`

**Arguments**

- `template (string|Object)`: The template, either in its string form or object form.

**Returns**

- `(boolean)`: Returns `true` if the template is already parsed, `false` if otherwise.

**Examples**

```js
// TODO
```

---

## p.parse()

Parses the template using [Ractive.parse()](#ractiveparse). Full Ractive runtime must be loaded.

**Syntax**

- `p.parse(template[, parseOptions])`

**Arguments**

- `template (string|Object)`: The template in its string form or object form.
- `[parseOptions] (Object)`: Template parser options. See [Ractive.parse()](#ractiveparse) for all available options. If `parseOptions` is not specified, it defaults to those of the current instance.

**Returns**

- `(Object)`: The parsed template.

**Examples**

```js
// TODO
```

# Transition

The transition object is an object you receive when writing transitions. It has a few properties and methods designed to make creating transitions easier.

---

## t.animateStyle()

Animates CSS properties to a certain value.

**Syntax**

- `t.animateStyle(prop, value, options[, complete])`
- `t.animateStyle(props, options[, complete])`

**Arguments**

- `props (Object)`: A map of animation properties and values.
- `prop (string)`: The style to animate.
- `value (any)`: The value to animate it to.
- `options (Object)`: Animation options.
  - `duration (number)`: The duration of the animation.
  - `easing (string)`: The easing function of the animation.
  - `delay (number)`: The number of milliseconds before the animation starts.
- `[complete] (Function)`: A function that is executed when the animation completes, or immediately if no changes were made.

**Returns**

- `(Promise)`: A promise that resolves when the animation completes.

**Examples**

```js
// TODO
```

---

## t.complete()

Signals Ractive that the transition is complete.

**Syntax**

- `t.complete[noReset])`

**Arguments**

- `[noReset] (boolean)`: If `true`, [`t.resetStyle()`](#tresetstyle) is not called. Defaults to `false`.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

---

## t.getStyle()

Retrieve a CSS property value from `t.node`.

**Syntax**

- `t.getStyle(prop)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `prop (Array)`: An array of CSS properties.

**Returns**

- `(string)`: The value of the specified style property.
- `(Object)`: A key-value pair of properties and their respective values.

**Examples**

```js
// TODO
```

---

## t.isIntro

_(boolean)_

Should be self-explanatory...

---

## t.name

_(string)_

The name of the transition.

---

## t.node

_(Node)_


The node that's entering or leaving the DOM

---

## t.processParams()

Builds a map of parameters whose values are taken from the provided arguments. When used with a single number or string argument, serves as a shorthand for creating a map with a `duration` property.

**Syntax**

- `t.processParams(params[, defaults])`

**Arguments**

- `params (number)`: Numeric shorthand for the `duration` parameter. Expressed in milliseconds.
- `params (string)`: String shorthand for the `duration` parameter. Valid values are:
    - "fast" - 200ms
    - "slow" - 600ms
    - Any other string - 400ms
- `params (Object)`: A map of parameters and their values.
- `[defaults] (Object)`: A map of parameters and their default values.

**Returns**

- `(Object)`: A map of parameters and their values.

**Examples**

```js
// TODO
```

---

## t.setStyle()

Sets a CSS property on `t.node` to a value.

**Syntax**

- `t.setStyle(prop, value)`
- `t.setStyle(props)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `props (Object)`: A key-value pair of CSS properties and their respective values.
- `value (string)`: A valid value for the specified CSS property.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

# Attributes

## `as-*`

`as-*` attributes augment the element with [decorators](extend/decorators.md). It accepts an optional, comma-separated list of expressions which are handed over as arguments to the decorator function.

```html
<div as-modal>Div appearing as modal</div>
<div as-modal="true, true, true, false">Div appearing as modal</div>
```

## `class-*`

`class-*` attributes toggle individual class names based on the truthiness of its value. The part of the attribute name following `class-` will be used as the class name. `class-*` attribute values are processed as expressions.

```html
<div class-foo="isFoo">Adds "foo" if isFoo is truthy</div>
<div class-foo-bar="isFooBar">Adds "foo-bar" if isFooBar is truthy</div>
<div class-fooBar="isFooBar">Adds "fooBar" if isFooBar is truthy</div>
```

## `on-*`

`on-*` attributes attach event handlers for both native and [custom events](extend/events.md). They are designed to look similar to regular `on*` attributes for familiarity, the only difference being the hyphen. `on-*` can be used in two ways: proxy event syntax and expression syntax.

Using the proxy event syntax, `on-*` accepts an event name as value. Events are handled by registering a function with [`ractive.on`](./#ractiveon) using the assigned event name.

```js
Ractive({
  template: `
    <button type="button" on-click="clicked">Push me!</button>
  `,
  oninit(){
    this.on('clicked', event => {
      console.log('clicked!');
    });
  }
});
```

Using the expression syntax, `on-*` accepts expressions as value. This allows it to appear like regular inline scripts, similar to how it's done in inline event handlers.

```js
Ractive({
  template: `
    <button type="button" on-click="@this.someMethod()">Push me!</button>
  `,
  someMethod(){
    console.log('clicked!');
  }
});
```

Multiple events can also be tied to the same handler by separating them with a hyphen:

```js
Ractive({
  template: `
    <button type="button" on-hover-click="@this.someMethod()">Push me!</button>
  `,
  someMethod(){
    console.log('Fires on hover and on click!');
  }
});
```

## `*-in`, `*-out`, `*-in-out`

`*-in`, `*-out`, and `*-in-out` attributes apply [transitions](extend/transitions.md) to the element. `*-in` specifies intro-only, `*-out` specifies outro-only, and `*-in-out` for both intro and outro. All three accept an optional value, an expression in the form of an object which is handed over as arguments to the transition function.

```html
<div fade-in>Fades on render</div>
<div fade-out>Fades before removal</div>
<div fade-in-out>Fades on render and before removal</div>
<div fade-in-out="{ duration: 500 }">Fades with 500ms duration</div>
```

## `style-*`

`style-*` attributes update individual `style` properties of the element. The part of the attribute following `style-` will be used as the style property name. There are two forms of the syntax: `style-property-name` (CSS style) and `style-propertyName` (JS style). Style property names will be normalized.

```html
<div style-vertical-align="middle">Applies style.verticalAlign</div>
<div style-textAlign="center">Applies style.textAlign</div>
```

`style-*` attribute values are processed as strings. Mustaches can also be used to supply the values. When the values are updated, the appropriate style property on the element will update to the new value.

```html
<div style-vertical-align="{{ vAlign }}" style-textAlign="{{ tAlign }}">...</div>
```

# Keypath prefixes

Normally, keypaths are resolved following a [defined routine](concepts/templates/references.md). But there are times where you want to skip the normal resolution routine and resolve a keypath relative to a specific data context. Keypath prefixes allow you to specify which data context a keypath resolves to, regardless if it resolves to something or not.

## Current context (`.`)

Resolves the keypath relative to the current data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNsABz594nLgGUACgHldAOVHiFAWykxyAD1knWDaQHNq8Uhs2nypMFzsKA9P7MACpg1DDUzOTYzPB8iipqfmgmmCak1KZKyFLUnAAGfgA8AlQAfLqIpNjkApHekeakllYYzEJ8iMxghDTMwMAJqixoaEX+pZRlfgMAxMxNLcyjfqwl5QCS8DV1zA0LFtZtHV3e5PAA1u2d3b2RA0Nqy2gAdOOT0-IKzOtTW8wRQjILxCNoNCJRGJxfqDF7+ZTDZ7vcozYD+FbyQrwNAASgA3CAsKQ8EVsMRLEpSIoYMQALwMcCkUhKbCQQKIeBKC6OF7EPimfwwEgUGgMsrjMkU0hlEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    spoon: 'SPOON',
    matrix: {
    	agent: 'Smith'
      // There is no spoon
    }
  },
  template: `
    <div>Outside the matrix, you have {{ spoon }}</div>
    {{# matrix }}
      <div>Inside the matrix, you think you have {{ spoon }}.</div>
      <div>In reality, there is no {{ ./spoon }}</div>
    {{/}}
  `
});

// Outside the matrix, you have SPOON
// Inside the matrix, you think you have SPOON.
// In reality, there is no
```

## Parent context (`../`)

Resolves the keypath relative to the parent data context. This prefix can be used more than once to reference ancestors.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNyAzlxjVCycqRFj5EtYQC2s8QoYVl3AQcMBGUadbnr648zkLm580pUujAEwOel6kzjYmId5hFn42AMzBntFojqGpIRmsmKak1IYADshS1JwABmkAPAJUAHwAmnyIzIRqiizAwIoCzGholQD0NZS1aZ0AxMz+hr1ZoebVdY3NrdTt7l1Ks4PDo-DmnhNTNrNp0Ysjyy1t5B2bPX07dWmHwJPTp1ExC7tXq+udbrbIbPL7RM7fUgXWoAUWwxEIBVuAHMAHTop4jCHnX5Na5rW4bZjogZbR4grFgmLQv43O7E1EDElk-oUvbJSE0vH-QmAkn8xkszHsswxToDPoQ8WS+TmaVzCrwNAASgA3CAsKQ8JV4TByAVSMxsDBiABeBjgUikArYSADAaIeAFADWaOIfEMAxgJAoNAttUGuv1pFqIDQQA"></div>

```js
Ractive({
  el: 'body',
  data: {
    id: 'reality',
    dream: {
    	id: 'dream1',
    	dream: {
    		id: 'dream2',
    		dream: {
    			id: 'dream3',
    		}
    	}
    }
  },
  template: `
    <div>You are in {{ id }}</div>
    {{# dream }}
      <div>You are in {{ id }}</div>
      {{# dream }}
        <div>You are in {{ id }}</div>
        {{# dream }}
          <div>You are in {{ id }}</div>

          <div>Escaping...</div>
          <div>You are in {{ id }}</div>
          <div>You are in {{ id }}</div>
          <div>You are in {{ id }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// You are in reality
// You are in dream1
// You are in dream2
// You are in dream3
// Escaping...
// You are in dream2
// You are in dream1
// You are in reality
```

## Instance root context (`~/`)

Resolves the keypath relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bMYfPgFtOXAIyjxCgA58Y0jszkLmDUktXqATNvmsL+w4WOmFFi1bXcAzPbNPUmcjWR1HUiDvdQAWAI9I0jRw8ySU5PlMHVJqFV1kKWpOAAMU4GAAYmYQ12Y0DIszcqqa5DqMsybK6oMjdpSgzwdUoIAeASoAPgBReByYcngAcwA6NdGAegnKSYHEi3GpgE0+RGZCGGpmRcVlFRNgZgA-De92ze3d4cHSQ52Ts4XK43N7lZ4bVorN71D5TPZjT4A86Xa4sUGPF6QyHQtCwnbwxJ-SZIoGo26qB7grG9VwrbF3d5bOHfRLlDb1PZsjnyCxcjrMUrwNAASgA3CAsKQ8KNsMQFrpSMxsDBiABeBjgUjBbCQDYbRDwXQAa1WxFUrxIFBoGsmm1l8tIkxAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    room: '1',
    portal: {
    	room: '2',
    	portal: {
    		room: '3',
    		portal: {
    			room: '4',
    		}
    	}
    }
  },
  template: `
    {{# portal }}
	    {{# portal }}
        {{# portal }}
    			<div>Entering...</div>
    			<div>You are in room {{ ~/room }}</div>
    			<div>You are in room {{ ~/portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.portal.room }}</div>
    		{{/}}
    	{{/}}
  	{{/}}
  `
});

// Entering...
// You are in room 1
// You are in room 2
// You are in room 3
// You are in room 4
```

# Special references

Special references are template keywords that act like data references but do not actually exist in your data. These references provide metadata regarding the current instance, context, environment, operation and more.

## `this`

The current data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1s7ajJ4ADNxUP8Iu0kVQkJZIRUnZwAJB2RxagB1cRhkDwBCXwTEqNj48MSklLSMrIAVMBVqAEdEMmIBalcYcQB3W1iADyqGxtq46jDGxuTU9MyXACtESQ5qcVUYamxO6mRZAC8vag9xIRnlmpiFpcfE1ZaN5w6gwmpZVDUWLIASEZzVR5oCGJKGzOywmEJTAJbAqXbnVFOAAGEPwHmU6hG4mwoWA1AAUgBlADyADkRIRsOR4EIyNEvBYTmRCABKahoNBafFKdQQ4DAADEkWe-IRjTxBPm1AAjKSKTT6Yzmaz2ZywNy+QKhQToYtJdLYrLTXYFSKlQAmNVUukMplRHUcrm82XGkXWs1SpUC-024XqJUAZidGtd2rZnv13qNXDDIYDFoKwbhj1t4ZlABZoy6te743qDT6Uybs4lxVws286w3Gk25XZWwksX54GgeQBuEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    info: {
      message: 'Hello World!',
      info: {
        message: 'The quick brown fox',
        info: {
          message: 'jumps over the lazy dog',
          info: {
            message: 'Thats all folks'
          }
        }
      }
    }
  },
  template: `
    <div>root: {{ JSON.stringify(this) }}</div>
    {{# info }}
      <div>info 1: {{ JSON.stringify(this) }}</div>
      {{# info }}
        <div>info 2: {{ JSON.stringify(this) }}</div>
        {{# info }}
          <div>info 3: {{ JSON.stringify(this) }}</div>
          {{# info }}
            <div>info 4: {{ JSON.stringify(this) }}</div>
          {{/}}
        {{/}}
      {{/}}
    {{/}}
  `,
});

// info 1: {"info":{"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}}
// info 2: {"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}
// info 3: {"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}
// info 4: {"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}
// info 5: {"message":"Thats all folks"}
```

## `@this`

The current Ractive instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tqJmwJPmwnAEZ-akxE7BVJCmQglScAA0TI-A9ldQBhcRjQ4Gpo+Bo0NC0ipXV87HxXRDZxW2wvChVmEA6u+BZqboBaYmQyYgFBgAFsMDJCEVkPDwtnGuxnAEoNAEl4UjSVWq1h7G6W8Lt2zpuevoGWa+6xyenZ+ZYllZrSReACyKmWngshxA6gAMuIhNVypcuB94Hc7Dk-OFgWCIVt9mE7JEJPBCOJkCoRMgERYcsREDAYBcaLtqKtqAASYDLVYiITg7a7A5oHL7ADciTQNjQEpAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    count: 1
  },
  template: `
    <div>Count: {{ count }}</div>
    <button type="button" on-click="@this.add('count')">Increment</button>
    <button type="button" on-click="@this.myMethod()">Log count</button>
  `,
  myMethod(){
    console.log(`current count is ${this.get('count')}`);
  }
});
```

## `@index`

The current iteration index of the containing repeated section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAAC5PAC1AAeVmjM2IRCaswAEuQAhMwAklyG6fZ+vePlAPRVlNVadsArOcRgRVqp8GgAlADcIFikeOXYxDDkcaT9MMQAvAzgpKRxaisrRDwOIAawA5gA6Yh8QwrGAkCg0L7VVb3R7PaogNBAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

For objects, `@index` is still the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzIUFzAAC5PAC1AAeCWjM2IRCaszdpGDk2KP1APRNlM0aWgXLJcRgVRp58GgAlADcIFikePXYxDDkaaTjMMQAvAzgpKRpasvLiHgaQA1gBzAB0xD4lmWMBIFBon2aKzuDyezRAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: {{ this }}</div>
    {{/each}}
  `
});

// User #0 says: Hi! I am bob!
// User #1 says: Hi! I am alice!
// User #2 says: Hi! I am eve!
```

## `@key`

The current key name of the containing object iteration section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzAXMAAIA1tRCCWjM2IRCap3AzKRg5NhD9QD0TZTNGloFiyXEYFUaefBoAJQA3CBYpHj12MQw5GmkIzDEALwM4KSkaWqLi4jwaV6AHMAHTEPiWRYwEgUGjvZpLG53B7NEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User {{ @key }} says: {{ this }}</div>
    {{/each}}
  `
});

// User bob says: Hi! I am bob!
// User alice says: Hi! I am alice!
// User eve says: Hi! I am eve!
```

For arrays, `@key`'s value will be the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAACANbUQlZozNiEQmrMABLkAITMAJJchun2ft2j5QD0VZTVWnbASznEYEVaqfBoAJQA3CBYpHjl2MQw5HGkvTDEALwM4KSkcWpLS4jwOJtADmADpiHxDEsYCQKDQPtVlrd7o9qiA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @key }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

## `@keypath`

The keypath to the current data context relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEBJZXsMGo0NC1ZpXVO4GAAYmpo2qPOuxm5xeXV9a2dt-3D465T849OyXG5JGC-R4JZ5nV57NbUS6fXarX4nOaQ4HXajZCFAhJPAGw94IjbbZE-I5os4Y7CXLgPPF0hkZJl9bBTeBoACUAG4QGggA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @keypath }}</div>
    {{# foo }}
      <div>Keypath: {{ @keypath }}</div>
      {{# bar }}
        <div>Keypath: {{ @keypath }}</div>
        {{# baz }}
          <div>Keypath: {{ @keypath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, the keypath will remain relative to the instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTHjY+LR0jGq2FUkKZCSVVIADBvjgYABiakKS6jQ0bvzsfHDldQBlCJUYcuBqeFlJL1GtaaV1cfipmZc3D3bqXuoNk88RtG2Z-cmd9QBpFQBPCiSwZeoAAQEHy+2DAt3uu3GvS4owaXXgtQA3NV4H5zCpog0VMhUgByABG4nC7xx9TyiWS5XGklkZGx50ehQJwUpeSqEyu7k8nGoAG1cmyBdg1htcQS8STHmyOadcQAJMjUWTIMjEFQAQhxkuwmH5E0FwrO+PE4tJgqlrk5hvl1BUqg1WrQAF1HmNWdqGpU8mFmq0wp1If1LjTkCJGeJgiJpVzbo98MdLYNiuJmCALiCyIQYyBqFw9nq3VCYXk4bUQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @keypath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: info
// Sender: bob
// Message: Hi eve!
// Keypath: info
```

## `@rootpath`

The keypath to the current data context relative to the originating instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEYGPZV6jQ0LVmldU7gYABiamjaw867GbnF5dX1rZ3xPewwA6OuE5nHp2C7XJIwP4PBJPU4vFY-d7bXbw36HY5zKEgq7UbKQ4EJR6AuFvagXD7I-ZogEY-FYrj3fEXel9BJMhl2KbwNAASgA3CA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @rootpath }}</div>
    {{# foo }}
      <div>Keypath: {{ @rootpath }}</div>
      {{# bar }}
        <div>Keypath: {{ @rootpath }}</div>
        {{# baz }}
          <div>Keypath: {{ @rootpath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, it will be adjusted relative to the originating instance's root data context. This is what primarily sets `@rootpath` apart from `@keypath`.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTFj4tHSMKrYVSQpkJJVUgAN6+OBgAGJqQpLqNDQu-Ox8cOV1AGUIlRhy4Gp4WUkvEa0ppXUx+MnplzcPNuoe6nXjz2G0Lem9ie31AGkVAE8KJLAl6gABGHE4nYXxudx2Yx6XBG9U68BqAG4qvA-OYVNF6ipkKkAOQAI3E4Te2LqeUSyXKY0ksjIWLOD0K+OCFLy8VZ2Eu7k8nGoAG1cmyBdhVuscfjccSHmyOSccQAJMjUWTIMjEFQAQmxkuwmH540FwtOePE4pJgqlrk5hvl1BUqg1WrQAF0HqMWdr6pU8mEmi0wh0IX0LtTkCIGeJgiJpVybg98EdLQNiuJmCBztgwGRCDGQNQuLs3ZDoXlYQiQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @rootpath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: mail.inbox.messages.0
// Sender: bob
// Message: Hi eve!
// Keypath: mail.inbox.messages.1
```

## `@global`

The global object of the current environment. For browsers, it references the `window` object. For Node.js, it references the `global` object.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwB3MvAAm44yMkrChWUJXUG1AOQAJFanHUA6uIwyOYAhG5M8BEASvKKqgAUwBFM2N6Q7gBG4uYAnm4YyWwqkhTIsqnpAAaFKcDA1AACQsjiGbLINnYOTtRoaIXV8GgAlADcIGhAA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
    {{ @global.message }}
  `
});

// Hello World!
```

Ractive can automatically update properties on `@global` via two-way binding. However, for changes caused externally, [`ractive.update()`](./instance-methods#ractiveupdate) must be called to re-render the UI.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogO4CW8AJgPb4B0AtgKbbYCGA5rQAQC8bA5ABK2oybAOpkYyEgEJuAHXhyASowDGAF0IA3WgApgctmwGQeAIzIkAntwz62q2tQAOyRveMADWzNXBgbAALMyGQmjMg09EysbGhotgYAPMSOiKp2Fo60HDIg9gAeqjlsGmGIWTm+AUEhYREMLOyxOQB88WwJJqmqZPDpmdkgnard8iBsPQC0ysiEygDWA-6qYITYlMHMCrQAZrQwtPDKOgCULQAyZMxs+7v7h+wlyGUJAPRDI629Bu3vPX3lgy6PSKk2mswWOSWKzWGwA4sFQshtKcQM0LldqojiqVaK9fvBPt8fkDeqoMgD8SD4FMZvNFstVpRsLRVAAxMhkABCjBg3IAXsiWgBhMCMeDRbpsHLbDlsUIwOWMPlFEiEfZqZAWPEkwnfDok-4DSljUG0iEgKGMxCOEiuHTcQII2p0eqsbgo5pCs12ITW232bXDHqfNoJMjIXVEhIzT3enLo647PYHI7Yp60IpikhsYJkOZsVx2MDsZQ9bDh3EvGNtRIxr3gqUgBOYsJpsqZ0g5jn5wvLEtliuvatfKN10Xi9h9tjJVJt9hZxOZQvYeyObBsACMBc7ACYh4RI3q63GQCKxRKhNwZUJ5Yq+dw2Kr1apNTl94fawetku0ivaGvN23bMdyAth4DIdRU2WZdV0A-BGHXcC0kYeD9nGbYi3YJ9aDUNhlHHVh3xrdpjwbHJ63mH02D9O03yrA9iOjL9-1oGD-3XLcFxAhckNmSdRTSMxljYP8AJ5dhwPwAtUMrYcoxecNdXcGwvg2LZbhTE49BHPCB2QWh1kubQGTWVhVG0B0W3CF0olod1Ti+TBbDhJ0kWObSiVLeBy30wzmG0IhSAoOpbOOABuWwnK+Zk2Q5bleSVZEPO+QLyCoGyGk4Rtr0VBVQmVEBIrkNBwpALBVDwBJsGUGBCEcX8YGUAYwGGNdIBeF5EHgRw5mYShS2oF4YBUdQtBaV5qtq+rmhANAgA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
  	{{ @global.message }}
    <input type="text" value="{{ @global.message }}">
    <button type="button" on-click="@this.logReference()">Log reference value</button>
    <button type="button" on-click="@this.logGlobal()">Log global value</button>
    <button type="button" on-click="@this.setFooBarBaz()">Change to "foo bar baz" directly</button>
    <button type="button" on-click="@this.update('@global.message')">Click to update</button>

    <ol>
      <li>Click "Log reference value" and look at the console</li>
      <li>Click "Log global value" and look at the console</li>
      <li>Change the input value and repeat steps 1 and 2</li>
      <li>Click "Change to 'foo bar baz' directly"</li>
      <li>Repeat steps 1 and 2 and notice that step 1 was not aware of the direct change</li>
      <li>Click "Click to update"</li>
      <li>Repeat steps 1 and 2 and notice that both steps are now aware</li>
    </ol>
  `,
  logReference(){
    console.log(this.get('@global.message'))
  },
  logGlobal(){
    console.log(window.message);
  },
  setFooBarBaz(){
    window.message = "foo bar baz"
  }
});
```
