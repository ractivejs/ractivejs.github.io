# Initialization Options

The following is an exhaustive list of initialisation options that you can pass to `new Ractive(options)` and `Ractive.extend(options)`, with full descriptions grouped below by category.

Note that any additional options set that's not part of the[initialization options](../API/Initialization Options.md)will be added as properties of the instance.

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

_`(Array<string|Object>)`_

Custom wrappers to be used with all or part of the supplied data, see [Adaptors](../Extend/Adaptors.md). Unlike components or other registries where there is a template-level directive that informs Ractive that plugin is to be used, [adaptors](../Extend/Adaptors.md) are a data-level construct and so you use the `adapt` option to tell Ractive which [adaptors](../Extend/Adaptors.md) are to be used with that instance. If you define the [adaptors](../Extend/Adaptors.md) directly on the instance or component, you do not need to specify them in the `adapt` option.

Can either be the [adaptor](../Extend/Adaptors.md) itself, or the name of an [adaptor](../Extend/Adaptors.md) registred via `Ractive.adaptors`:

```js
Ractive.adaptors.myAdaptor = MyAdaptor1;

new Ractive({
  adapt: [ 'myAdaptor', MyAdaptor2 ]
})
```

---

## adaptors

_`(Object<string, Object>)`_

A key-value hash of [adaptors](../Extend/Adaptors.md) that are specific to this instance. Usually the `adapt` property can directly specify which adaptors
to use on this instance and the `adaptors` property is used to register an [adaptor](../Extend/Adaptors.md) on components or `Ractive.adaptors`.

```js
adaptors: {
  myAdaptor: MyAdaptor
}
```

---

## append

_`(boolean|string|HTMLElement|array-like)`_

Controls how the instance is attached to `el`. Defaults to `false`.

`false` replaces the contents of `el`.

```html
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
<div id='container'>
  <p>new content</p>
</div>
```

`true` appends the instance to `el`.

```html
<div id='container'>
  <p>existing content</p>
</div>
```
```jss
el: '#container',
append: true,
template: '<p>new content</p>'
```
```html
<div id='container'>
  <p>existing content</p>
  <p>new content</p>
</div>
```

An element id, CSS selector referencing an element, HTML element reference or an array-like object containing an HTML element reference as first item that is a child of `el` will render the instance before that element.

```html
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
<div id='container'>
  <p>red</p>
  <p>grey</p>
  <p>orange</p>
  <p>yellow</p>
</div>
```

---

## components

_`(Object<string, Function>)`_

A map of [components](../Extend/Components.md) where the `key` is the name of the component the `value` is either a component definition or a function that returns either a globally registered component name or a component definition.

```js
components: {
  'my-component': Ractive.extend({
    template: '#componentTemplate',
    init: function () {...}
  }),
  dynamicComponent: function(data){
    return data.foo ? 'globallyRegisteredComponent' : componentDefinition;
  }
}
```

If you need to do additional post-processing on the components, the function option receives post-processed data.

During a [`ractive.reset()`](../API/Instance Methods.md#ractive.reset()), function component options will be re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## computed

_`(Object<string, function|Object>)`_

An object that maps to a set of computed values.

```js
computed: {
  area: '${width} - ${height}'
}
```

See [Computed Properties](../Concepts/Data Binding/Computed Properties.md) for more information and examples .

---

## csp

_`(boolean)`_

Defaults to `false`. Whether or not to add inline functions for expressions after parsing. This can effectively eliminate `eval` caused by expressions in templates. It also makes the resulting template no longer JSON compatible, so the template will have to be served via `script` tag.

---

## css

_`(string)`_

Used on components to specify `css` styles to be inserted into the document.

---

## data

_`(Object<string, any>|Function)`_

The data with which to initialise.

```js
data: { foo: 'bar' }

data: function() {
  return { foo: 'bar' };
}
```

When using a data object on components, the data is attached to the component's prototype. Standard prototype rules apply, which means modifying non-primitive data will modify the value on the prototype.

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

When using a data function, the function is run to generate the data and the data is attached to each instance rather than to the prototype.

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
component2.get( 'foo.bar' ); // returns 12
```

`this._super` can be used when using a data function option to merge the parent component data into the extending component. Ractive handles the differences between usage of a data object and data function.

```js
var Component1 = Ractive.extend({
  data: {
    formatTitle: function (title) {
      return '"' + title.toUpperCase() + '"';
    }
  }
});

var Component2 = Component1.extend({
  data: function( data ) {
    this._super( data );
    data.scale = 5;
  }
});

var ractive = new Component2({
    data: { foo: 'bar' }
});

// r.data: { foo: "bar", formatTitle: function, scale: 5 }
```

Data may also be set asynchronously when using data function options.

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

Models can also be used to supply data as long as they return plain objects whose properties are public.

```js
data: function ( data ) {
	return new Model( data );
}
```

If you use a constructor guard clause, you can simply provide the reference to the model directly instead using a data function.

```js
function Model ( data ) {
	if ( !( this instanceof Model) ) { return new Model( data ); }
	// model setup
}

var MyComponent = Ractive.extend({
    data: Model
});

var r = new MyComponent({
    data: { foo: 'bar' }
})
```

For more advanced data modelling and backends, use [Adaptors](../Extend/Adaptors.md).

---

## decorators

_`(Object<string, Function>)`_

A key-value hash of decorators that are specific to this instance, where `key` is the name of the decorator (as referenced within templates as `<div decorator="myDecorator"></div>`), and `value` is a is a decorator functions.  See [Decorators](../Extend/Decorators.md) for more info.

```js
decorators: {
  'myDecorator': function( node, fire) {...}
}
```

---

## delimiters

_`(Array[string])`_

Defaults to `[ '{{', '}}' ]`. Used to set what delimiters to use when parsing templates.

```js
template: 'hello <%= world %>',
delimiters: [ '<%=', '%>' ],
data: { world: 'earth' }

// result:
hello earth
```

---

## easing

_`(Object<string, Function>)`_

A key-value hash of easing function. See [`Ractive.easing()`]\(../API/Static Methods.md#Ractive.easing())

---

## el

_`(string|HTMLElement|array-like)`_

Directives for the element to render to. Use `append` option (see below) to control whether existing content is replaced.

Can either be an element id, CSS selector referencing an element, a reference to an HTML element, or an array-like object containing an HTML element reference as first item.

```js
el: 'container'
el: '#container'
el: document.getElementById('container')
el: $('#container')
```

---

## enhance

_`(boolean)`_

Defaults to `false`. Whether or not to try to reuse the existing DOM in the target element when rendering a.k.a. progressive enhancement. This allows you to serve the fully rendered page and then render the Ractive template at load over the pre-rendered page without completely wiping out the existing content. There are a few limitations surrounding text nodes, but all matching elements will be reused.

This option cannot be used with `append`.

To expand on the limitations with text nodes, since HTML does not have a markup representation for individual adjacent text nodes where the DOM does, the loaded DOM will have all text nodes merged when the document loads from the server. Ractive needs individual adjacent text nodes in certain situations like `outer text {{#if foo}}inner text{{/if}}`. The `'outer text '` text node is always present, and if `foo` becomes truthy, an additional text node will be inserted next to the `'outer text '` node containing `'inner text'`. It has been suggested that Ractive could also deal with merged text nodes, but that would become quite complex because there are certain scenarios where a text node would have to split and be rejoined as the model changed e.g. `outer text {{#if foo}}<span>hello</span>{{/if}} the other side`. In that case, if `foo` is initially falsey, the `'outer text '` and `' the other side'` nodes could be merged into a single node. However, if `foo` became truthy, that node would have to be split into two to place on either side of the `<span>`.

Additionally, unescaped HTML mustaches (triples) don't play nicely with enhance because there's no easy way to match up the string content to the target DOM nodes. This may be remedied at some point in the future.

TODO: Simplify/restructure

---

## events

_`(Object<string, Function>)`_

A key-value hash of [event plugins](../Extend/Events.md) that are specific to this instance, where `key` is the name of the event (as referenced within templates as `<button on-mycustomevent="fire"></button>`), and `value` is the custom event plugin functions.  See [Writing Events](../Extend/Events.md) for more info.

```js
events: {
  'mycustomevent': function( node, fire ) {...}
}
```

---

## interpolators

_`(Object<string, Function>)`_

A key-value hash of interpolators use by [`ractive.animate()`](../API/Instance Methods.md#ractive.animate()).

---

## isolated

_`(boolean)`_

Defaults to `false`. This option is typically only relevant as an extension option for [Components](../Extend/Components.md). Controls whether the component will look outside itself for data and registry items.

---

## lazy

_`(boolean)`_

Defaults to `false`. If two-way data binding is enabled, whether to only update data based on text inputs on `change` and `blur` events, rather than any event (such as key events) that may result in new data.

```js
var ractive = new Ractive({
  template: '<input value="{{foo}}">',
  data: { foo: 'bar' },
  lazy: true
});

// will not fire as user is typing
ractive.on('change', function(){
  // only happens on exiting <inputor return if submit
  console.log('changed!')
})
```

---

## magic

_`(boolean)`_

Defaults to `false`. Whether or not to wrap data in ES5 accessors for automatic binding (see [Magic Mode](../Concepts/Data Binding/Magic Mode.md)).

```js
var data = { foo: 'bar' };
new Ractive({ data: data } );
// will update automagically:
data.foo = 'fizz'
```

---

## modifyArrays

_`(boolean)`_

Defaults to `false`. Whether or not to modify array mutator methods to enable frictionless data binding with lists (see [Array Modification](../Concepts/Data Binding/Array Modification.md)).

```js
var items = [ 'red', 'blue' ];
new Ractive({
  data: data,
  modifyArrays: true //default
});

// will update automagically:
items.push( 'green' );
```

---

## noCSSTransform

_`(boolean)`_

Defaults to `false`. Prevents component css from being transformed with scoping guids.

---

## noIntro

_`(boolean)`_

Defaults to `false`. Whether or not to skip intro transitions on render.

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

## onchange

_`(Function)`_

A lifecycle event that is called when data owned by the instance changes.

Accepts an map whose keys are the [keypaths](../Concepts/Templates/Keypaths.md) that changed and whose values are the new values for that keypath.

---

## oncomplete

_`(Function)`_

A lifecycle event that is called when the instance is rendered _and_ all the transitions have completed.

---

## onconfig

_`(Function)`_

A lifecycle event that is called when an instance is constructed and all configuration options have been processed.

---

## onconstruct

_`(Function)`_

A lifecycle event that is called when an instance is constructed but before any configuration has been processed.

Accepts the[initialization options](../API/Initialization Options.md)as arguments.

---

## ondetach

_`(Function)`_

A lifecycle event that is called whenever `ractive.detach()` is called.

Note that `ractive.insert()` implicitly calls `ractive.detach()` if needed.

---

## oninit

_`(Function)`_

A lifecycle event that is called when an instance is constructed and is ready to be rendered.

---

## oninsert

_`(Function)`_

A lifecycle event that is called when `ractive.insert()` is called.

---

## onrender

_`(Function)`_

A lifecycle event that is called when the instance is rendered and _before_ transitions are started.

---

## onteardown

_`(Function)`_

A lifecycle event that is called when the instance is being torn down.

---

## onunrender

_`(Function)`_

A lifecycle event that is called when the instance is being undrendered.

---

## onupdate

_`(Function)`_

A lifecycle event that is called when `ractive.update()` is called.

---

## partials

_`(Object<string, string|Object|Function>)`_

A map of [partials](../Extend/Partials.md) where the key is the name of the partial, and the value is either a template string, an parsed template object or a function that returns any of the previous options.

```js
partials: {
  stringPartial: '<p>{{greeting}} world!</p>',
  parsedPartial: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},
  functionPartial: function(data, p){
    return data.condition ? '<p>hello world</p>' : '<div>yes, we have no foo</div>';
  }
}
```

If you need to do additional post-processing on the partials, the function option receives post-processed data and a [Parse Object](Helper Objects/Parse.md) that provides helper methods for template manipulation.

During a [`ractive.reset()`](../API/Instance Methods.md#ractive.reset()), function partials will be re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## preserveWhitespace

_`(boolean)`_

Defaults to `false`. Whether or not to preserve whitespace in templates when parsing. (Whitespace in `<pre>` elements is always preserved.)

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

Please note that the browser will still deal with whitespace in the normal fashion.

---

## sanitize

_`(boolean|Object)`_

Defaults to `false`. If `true`, certain elements will be stripped from templates at parse time - `<applet>`, `<base>`, `<basefont>`, `<body>`, `<frame>`, `<frameset>`, `<head>`, `<html>`, `<isindex>`, `<link>`, `<meta>`, `<noframes>`, `<noscript>`, `<Object>`, `<param>`, `<script>`, `<style>` and `<title>` - as will event attributes (e.g. `onclick`).

```js
template: '<p>some content</p><frame>Am I a bad element or just misunderstood?</frame>',
sanitize: true

// result:
<p>some content</p>
```

Alternatively, pass in an object with an `elements` property containing an array of blacklisted elements, and an optional `eventAttributes` boolean (`true` means 'disallow event attributes').

```js
template: '<p>some content</p><div onclick="doEvil()">the good stuff</div>',
sanitize: {
  elements: [ 'p' ],
  eventAttributes: true
}

// result:
<div>the good stuff</div>
```

---

## staticDelimiters

_`(Array[string])`_

Defaults to `[ '[[', ']]' ]`. Used to set what static (one-time binding) delimiters to use when parsing templates.

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

_`(Array<string>)`_

Defaults to `[ '[[[', ']]]' ]`. Used to set what static (one-time binding) triple delimiters to use when parsing templates.

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

_`(boolean)`_

Defaults to `true`. Whether or not to remove comments in templates when parsing.

```js
template: '<!-- html comment -->hello world',
stripComments: false

// result:
<!-- html comment -->hello world
```

---

## template

_`(string|array|object|function)`_

The [template](../Concepts/Templates/Overview.md) to use. Must either be a CSS selector string pointing to an element on the page containing the template, an HTML string, an object resulting from [`Ractive.parse()`]\(../API/Static Methods.md#Ractive.parse()) or a function that returns any of the previous options.

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

If you need to do additional post-processing on templates, the function option receives the post-processed data and a [Parse Object](Helper Objects/Parse.md) that provides helper methods for template manipulation.

During a [`ractive.reset()`](../API/Instance Methods.md#ractive.reset()), function templates will be re-evaluated. If the return value changes, the Ractive instance will be re-rendered.

---

## transitions

_`(Object<string, Function>)`_

A key-value hash of transitions that are specific to this instance. The `key` is referenced within templates using `intro` and `outro` attributes on elements, and `value` is a transition functions, see [Transitions](../Extend/Transitions.md) for more info.

```js
template: '<p intro="slide" outro="slide">hello world</p>',
transitions: {
  slide: function ( t, params ) {...}
}
```

---

## transitionsEnabled

_`(boolean)`_

Defaults to `true`. Whether or not transitions are enabled for this instance.

---

## tripleDelimiters

_`(Array[string])`_

Defaults to `[ '{{{', '}}}' ]`. Used to set what triple delimiters to use when parsing templates.

```js
template: 'hello @html@',
tripleDelimiters: [ '@', '@' ],
data: { html: '<span>world</span>' }

// result:
hello <span>world</span>
```

---

## twoway

_`(boolean)`_

Defaults to `true`. Whether or not two-way data binding is enabled (see [Two-Way Binding](../Concepts/Data Binding/Two-Way Binding.md)).

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

Also see [static delimiters](#staticDelimiters) for one-time binding
