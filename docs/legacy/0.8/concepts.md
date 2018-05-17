# Architecture

# Data Management

## Dependants

Ractive maintains a *dependency graph* in order to do the minimum amount of work necessary to keep the DOM up-to-date.

If you inspect a Ractive instance in your console, you'll see a property called `_deps`. This is where all dependants are listed, indexed by their dependency.

There is also a concept of 'priority', which exists to save us some work. If, for example, a section needs to be removed (perhaps it's a conditional section, and the condition just went from truthy to falsy), there is no point in updating all its children, so we make sure that we teardown the section first. As part of that teardown process, the children - which all have lower priority - unregister themselves as dependants before they get a chance to update.

### Indirect dependencies

If you have a mustache which depends on `foo.bar`, and `foo` changes, it's quite possible that the mustache needs to re-render. We say that the mustache has an *indirect dependency* on `foo`, or that it has a *direct dependency on a downstream keypath* of `foo`.

This relationship is expressed through the `_depsMap` property of a Ractive instance - whenever `foo` changes, as well as dealing with direct `foo` dependants we check the map for those indirect dependants.

In the case of {{{createLink 'expressions'}}} and {{{createLink 'observers'}}}, we also need to consider dependants of *upstream keypaths*. For example, suppose we have a section based on a sorted array - if we modify one of the members of the array, we need to see if the sort order has changed or not as a result:

```html
\{{#( sort( list, 'name' ) )}}
  <p>\{{name}}</p>
\{{/()}}
```

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    list: [{ name: 'Bob' }, { name: 'Charles' }, { name: 'Alice' }],
    sort: function ( list, property ) {
      return list.slice().sort( function ( a, b ) {
        return a[ property ] < b[ property ] ? -1 : 1;
      });
    }
  }
});

// renders Alice, Bob, Charles

ractive.set( 'list[0].name', 'Zebediah' );

// updates to Alice, Charles, Zebediah
```

In the example, setting `list[0].name` causes dependants of `list` to be updated.

As well as {{{createLink  'expressions'}}}, {{{createLink 'Observers'}}} respond to both upstream and downstream changes.


### Expressions with multiple dependencies

The expression `\{{ a + b }}` has two dependencies - `a` and `b` (or more accurately, whatever those {{{createLink 'references'}}} resolve to). The `_deps` graph actually includes objects representing those individual references, rather than the expression itself - the reference objects then notify the expression (if their value has changed) that it will need to re-evaluate itself.

Because the expression has multiple dependencies, it won't trigger an update straight away - it will wait until all the new data has come in first. So doing `ractive.set({ a: 1, b: 2 })` will only trigger one update, not two.

## Array modification


Ractive can intercept the *mutator methods* (`pop`, `push`, `shift`, `unshift`, `splice`, `sort` and `reverse`) of arrays that it [depends on](dependants) for more convenient data binding.

Consider the following:

```html
<ul>
  \{{#list}}
    <li>\{{this}}</li>
  \{{/list}}
</ul>
```

```js
list = [ 'a', 'b', 'c' ];

ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: { list: list }
});

list.push( 'd' ); // adds a new list item - <li>d</li>
```

You can enable this behaviour by passing in `modifyArrays: true` as an {{{createLink 'options' 'initialisation options'}}}


### How it works

Don't worry, we're not modifying `Array.prototype`. (What do you think this is, [Ember](http://emberjs.com/guides/configuring-ember/disabling-prototype-extensions/)? :-)

Instead, we're using a technique called [prototype chain injection](http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection), which allows us to remain performant and memory-efficient without mucking about extending native objects.

This uses the non-standard (but very unlikely to disappear!) `__proto__` property. That might seem kludgy, but if [Mike Bostock thinks it's okay](http://bost.ocks.org/mike/selection/#subclass) then that's good enough for us.

Older browsers (I'm looking at you, IE8) don't support `__proto__` - in these cases, we simply add the wrapped methods as properties of the array itself.

As well as intercepting or wrapping the mutator methods, Ractive adds a (non-enumerable, in modern browsers) `_ractive` property to arrays, which contains information about which Ractive instances depend on the array, and which keypaths it is assigned to.


### Hygiene

When an array is no longer depended on by any Ractive instances, we can revert it to its normal state - resetting its prototype (if we used prototype chain injection) or deleting the wrapped methods (if we're in a crap browser), and removing the `_ractive` property.


### Performance and UI benefits

As well as convenience, using arrays like this helps Ractive make smart decisions about how to update the DOM. Continuing the example above, compare these two alternative methods of inserting a new item at the *start* of our list:

```js
// at the moment, list = [ 'a', 'b', 'c', 'd' ]

// 1. Reset the list:
ractive.set( 'list', [ 'z', 'a', 'b', 'c', 'd' ] )

// 2. Use `unshift`:
list.unshift( 'z' );
```

In the first example, Ractive will see that the content of the first list item has changed from `'a'` to `'z'`, and that the second has changed from `'b'` to `'a'`, and so on, and update the DOM accordingly. It will also see that there is now a fifth item, so will append `<li>d</li>` to the list.

In the second example, Ractive will understand that all it needs to do is insert `<li>z</li>` at the start of the list, leaving everything else untouched.

This is particularly important if you're using {{{createLink 'transitions'}}}, as it will be obvious to the user which elements are being added and removed.

Note that if `list.unshift('z')` isn't an option, you could use {{{createLink 'ractive.merge()'}}} to achieve the same effect.


## Computed Properties


The idea is fairly simple: you can define computed properties that update reactively based on their dependencies. In previous versions you may have done something as follows.
```js
ractive = new Ractive({
  el: 'body',
  template: '\{{width}} * \{{height}} = \{{ area() }}', // note the function invocation
  data: {
    width: 100,
    height: 100,
    area: function () { return this.get( 'width' ) * this.get( 'height' ); }
  }
});
```

That's nice and all - the `\{{ area() }}` mustache updates reactively as `width` and `height` change - but it's limited. To get the area value programmatically you'd have to do something like...

```js
area = ractive.get('area').call(ractive);
```

...which effectively prevents you from composing computed values together in any meaningful way. And you can't 'observe' the area outside of the template, without doing something like this:

```js
ractive.observe( 'width height', function () {
	var area = this.get( 'width' ) * this.get( 'height' );
	doSomething( area );
});
```


### Computed properties to the rescue

Now, you can do

```js
ractive = new Ractive({
  el: 'body',
  template: '\{{width}} * \{{height}} = \{{area}}', // `area` looks like a regular property
  data: {
    width: 100,
    height: 100
  },
  computed: {
    area: function () { return this.get( 'width' ) * this.get( 'height' ); }
  }
});
```

With this, the `area` property can be treated like any other. It will update reactively (because the calls to `ractive.get()` tell Ractive that it should be recomputed when `width` or `height` change), so you can do...

```js
ractive.observe( 'area', doSomething );
```

...instead of manually recalculating it. And computed values can depend on other computed values, and so on (before anyone asks, we're not doing a topological sort or anything fancy like that - in real world scenarios I'd expect the overhead of doing the sort to be greater than the cost of occasionally recomputing a node in the dependency graph more times than is required).


### Compact syntax

The syntax used above, where each computed property is defined as a function, gives you a lot of flexibility. But there's a more compact string syntax you can use:

```js
ractive = new Ractive({
  ...,
  computed: {
    area: '${width} * ${height}'
  }
});
```

This string is turned into a function with the `Function` constructor (which unfortunately means it isn't [CSP compliant](https://developer.mozilla.org/en-US/docs/Security/CSP)) - any `${...}` blocks are basically turned into `ractive.get('...')`, so it works exactly the same way. Needless to say you can use any JavaScript here - `${foo}.toUpperCase()`, `Math.round(${num})`, and so on.


### Setting computed values

By default, computed values are read-only, and if you try to `ractive.set('someComputedProperty')` an error will be thrown. But you can use a third syntax option which allows you to declare a `set()` method:

```js
ractive = new Ractive({
  data: { firstname: 'Douglas', lastname: 'Crockford' },
  computed: {
    fullname: {
      get: '${firstname} + " " + ${lastname}', // or use the function syntax
      set: function ( fullname ) {
        var names = fullname.split( ' ' );

        this.set({
          firstname: names[0] || '',
          lastname: names[1] || ''
        });
      }
    }
  }
});

ractive.set( 'fullname', 'Rich Harris' );

ractive.get( 'firstname' ); // Rich
ractive.get( 'lastname' ); // Harris
```

### Components

You can, of course, declare computed values on components:

```js
Box = Ractive.extend({
  template: boxTemplate,
  computed: { area: '${width} * ${height}' }
});

box = new Box({
  ...,
  data: { width: 20, height: 40 }
});

box.get( 'area' ); // 800
```

Additional computed properties can be declared on the instance:

```js
box2 = new Box({
  ...,
  data: { width: 20, height: 40, depth: 60 },
  computed: { volume: '${area} * ${depth}' }
});

box2.get( 'area' ); // 800
box2.get( 'volume' ); // 48000
```

### Data context for computed properties

Computed properties can only be calculated for the instance context as a whole. You can't, for example, directly
compute a value for each member of an array:

```js
new Ractive({
  template: '\{{#boxes}}\{{area}}\{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ]
  },
  // there's no way to specify this for "each" box :(
  computed: { area: '${width} * ${height}' }
});
```

The solution is to either use a function that calculates the value for each member:

```js
  template: '\{{#boxes:b}}\{{ getArea(b) }}\{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ],
    getArea: function ( i ) {
      var box = this.get( 'boxes.' + i );
      return box.width * box.area;
    }
  }
```

Or leverage a component to "scope" the data to each item:

```js
Box = Ractive.extend({
  template: boxTemplate,
  computed: { area: '${width} * ${height}' }
});

new Ractive({
  template: '\{{#boxes}}<box/>\{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ]
  },
  components: { box: Box }
});
```


# Event Management


## Overview

Like many libraries, Ractive implements the [publish/subscribe](http://addyosmani.com/blog/understanding-the-publishsubscribe-pattern-for-greater-javascript-scalability/) mechanism to allow you to respond to, or trigger, particular events.

```js
ractive = new Ractive({
  el: 'body',
  template: '<button on-click="activate">click me!</button>'
});

ractive.on( 'activate', function ( event ) {
  alert( 'Activating!' );
});
```

There are actually two-levels of event handling in Ractive:

> The lower-level interaction with DOM events or {{{createLink 'Writing event plugins' 'custom events'}}}. These are specified using {{{createLink 'Event directives' 'template directives'}}} that also specify how the event is to be handled using either {{{createLink 'proxy events'}}} or {{{createLink 'method calls'}}}.

> The {{{createLink 'publish-subscribe'}}} api and event system within Ractive and between components. Proxy events bridge the DOM event into a Ractive event, whereas method calls directly invoke the ractive instance and do not use the pub/sub infrastructure.

<br>
The {{{createLink 'publish-subscribe'}}} event handling in Ractive allows you to consistently handle three different categories of generated events:

* {{{createLink 'Proxy events'}}}, mentioned above, proxy DOM and custom events defined in your template
* {{{createLink 'Method calls'}}} are a more powerful alternative to proxy events that allow you to execute one or more expressions when an event fires.
* {{{createLink 'Lifecycle events'}}} generated by each ractive instance - such as `init`, `render` and `teardown`
* {{{createLink 'Publish-subscribe' 'Custom events' 'publish'}}} fired in code using {{{createLink 'ractive.fire()'}}}, which can be anything you like

### Hygiene

One of the advantages of using Ractive events is that, in addition to being able to manually unsubscribe events, both DOM events and
Ractive Events will be automatically unsubscribed when the ractive instance or component is torndown.

In practice, this means adding a template directive like `on-click='select'` is all that is needed to manage the DOM event.


## Event Bubbling

Events that fire in components will bubble up the view hierarchy - [see this demonstration](http://jsfiddle.net/rich_harris/cdvehp1t/). Bubbling events are namespaced by the element name used for that component in the template:

```js
ractive = new Ractive({
    el: document.body,
    template: '<widget/>',
    components: {
        widget: Ractive.extend({
            template: '<button on-click="select">Select Me</button>'
        })
    },
    oninit: function () {
	    this.on( 'widget.select', function () {
	    	alert('selected!');
		});
	}
});
```
The event will continue to bubble up under the name of the originating component, not the name of each parent component.

### Cancelling

Returning `false` from an event handler will prevent that event from bubbling further:

```js
this.on( 'widget.select', function () {
    return false;
});

```

Sibling event handlers will still be called. Cancelling only applies to bubbling up to the next level of the view hierarchy.

Note that returning `false` has a dual purpose of both cancelling the view hierarchy event bubbling __and__ cancelling the DOM Event if the event was DOM-based.

Template directives for handling component events _implicitly_ cancel bubbling of the subscribed event:

```html
<widget on-foo='bar'/>
```
In this example, `widget.foo` will not bubble. Instead a new event `bar` will be fired and bubbled, assuming the above template is also contained in a component, under the name of the new component.

### The `event.component` Property

Events that bubble add a `component` property to the event object that is the component ractive instance raising the event:

```js
this.on( 'widget.select', function ( event ) {
    event.component.observe( 'foo', function ( n, o, k ) {
        console.log( 'foo changed from', o, 'to', n );
    });
});

```





## Event directives


DOM events are handled with template directives that take the form of element attributes, similar to global native DOM handlers, but are prefixed with `on-` plus the name of the event:

```html
<button on-click="activate">click me!</button>
```

You can assign multiple events by separating them with a hyphen:

```html
<div on-mouseover-mousemove='@this.set( "hover", true )'>...</div>
```
The structure of the attribute content will vary depending on whether you are using {{{createLink 'proxy events'}}} (the first example) or {{{createLink 'method calls'}}} (the second example). See each respective section for more details.

DOM events can be any supported event on the element node. Touch events - `touchstart`, `touchmove`, `touchend`, `touchcancel`, and `touchleave` (not w3c, but supported in some browsers) - can be used as well, and will be safely ignored if not supported by the current browser.

DOM Events will be automatically unsubscribed when the ractive instance is torndown.

### Cancelling DOM Events

See {{{createLink 'Publish-subscribe' 'publish-subscribe' 'cancelling-dom-events'}}} for information on automatically stopping DOM event propagation and default action.

### Custom events

In addition to all the usual DOM events, you can use *custom events* via {{{createLink 'Writing event plugins' 'event plugins'}}}. These allow you to define what conditions on the node should generate a directive-level event.

For example, you could add gesture support to your app with [ractive-touch](https://github.com/rstacruz/ractive-touch), which integrates [Hammer.js](http://hammerjs.github.io/) with Ractive.

Once defined, the custom event can then be used like any other event directive:

```html
<div on-swipeleft="nextPage">...</div>
```
Be aware that custom event names take precedence over native DOM event names.

### Component event directives

Template component elements can also have event directives:

```html
<my-widget on-foo="bar"/>
```

However, there are some differences and limitations to component event directives:

* These only respond to component raised events and are not DOM event or custom event subscriptions.
* Arguments to proxy events are ignored
* Method calls are not currently supported
* Pattern matching __is__ supported (see {{{createLink 'publish-subscribe' 'publish-subscribe' 'multiple-events-and-pattern-matching'}}}):
```html
<my-widget on-foo.*="bar"/>
```

# Rendering

# Security

## Content Security Policy

To use ractive with [Content Security Policy](http://www.html5rocks.com/en/tutorials/security/content-security-policy/), you'll currently need `'unsafe-eval'` specified for `scriptSrc` in your CSP header.

This may change in future - see https://github.com/ractivejs/ractive/issues/1897 .

# Templates

## Elements

Just about any useful template will contain at least one HTML element, and Ractive has a few directives and other constructs built into its element representation to make life easier. Some of these constructs have their own sections in the docs, such as {{{ createLink 'Events overview' 'Events' }}}, {{{ createLink 'Transitions' }}}, {{{ createLink 'Two-way binding' 'Bindings' }}}, {{{ createLink 'Decorators' }}}, and {{{ createLink 'Components' }}}.

### Conditional attributes

You can wrap one or more attributes inside an element tag in a conditional section, and Ractive will add and remove those attributes as the conditional section is rendered and unrendered. For instance:

```html
<ul>
\{{#each list as item}}
	<li \{{#if ~/selectedItems.indexOf(item) !== -1}}class="selected"\{{/if}}>
		\{{item.name}}
	</li>
\{{/each}}
</ul>
```

In this example, if the current `item` in the `list` iteration is also in the `selectedItems` array, then a class attribute will be added to the rendered li and set to `"selected"`.

Any number of attributes can be used in a section, and other {{{ createLink 'Mustaches' 'Mustache' }}} constructs can be used to supply attributes.

### Class and style attributes

Ractive has special handlers for style and class attributes that only add and remove values for classes or style properties that are in the template. This allows external code to modify the element without Ractive overriding the change on its next update.

There are also two special classes of attributes for handling a single class or style property at a time.

#### `style-*` attributes

To facilitate quick updates to a single style property of an element, Ractive supports using `style-property-name="value"` or `style-propertyName="value"` attributes. The value may be any text including any mustaches, and when the value is updated, the appropriate style property on the element will be updated with the new value. Any hyphens after the first will be removed and the subsequent letter capitalized so both `style-text-align` and `style-textAlign` will target the `textAlign` property of the element's style.

`style-` attributes are processed as text rather than expressions, so you can use mustaches to set values e.g. `<div style-left="\{{x}}px" style-top="\{{y}}em">...</div>`. Any mustaches can be used in the value, including interpolators, sections, and partials.

#### `class-*` attributes

To facilitate easily adding and removing a single class on an element, Ractive supports using `class-class-name` and `class-className` attributes. Unlike style attributes, no changes are made to the hyphenation of the attribute name, so `class-class-name` and `class-className` will target `class-name` and `className`, respectively. The truthiness of the value assigned to a `class-` attribute determines whether or not Ractive will add the class to the element. If the value is truthy, the class will be added. If the value becomes falsey, then the class will be removed. No other classes on the element will be affected by changes to a `class-` attribute.

`class-` attributes, like `style-` attributes, not processed as expressions, so in order to supply the conditional to determine whether or not the class is set, you must use an interpolator e.g. `<div class-foo="\{{someBoolean}}" class-bar="\{{num + 33 > 42}}">...</div>`.
