# Adaptors

In some cases you want to write your UI in Ractive but have a custom back-end manage the data. Adaptors allow you to teach Ractive how to talk to those custom data sources without having to change the way you write Ractive or having to write a lot of connector code up front.

## Writing

```js
const myAdaptor = {
  filter: function ( object, keypath, ractive ) {
    // return `true` if a particular object is of the type we want to adapt.
  },
  wrap: function ( ractive, object, keypath, prefixer ) {
    // Setup
    return {
      teardown: function(){
        // Code executed on teardown.
      },
      get: function(){
        // Returns POJO version of your data backend.
      },
      set: function(property, value){
        // Data setter for POJO property keypaths.
      },
      reset: function(value){
        // Data setter for POJO keypath.
      }
    }
  }
};
```

Adaptors are simply the translation and sync layers between your custom data source and Ractive instances. The basic principle of an adaptor is as follows:

1. Provides an POJO version of your data source to Ractive.
2. Captures data changes on your data source and mirror them to the data in Ractive.
3. Captures data changes on the data in Ractive and mirror them to the data source.

Whether it's a third-party data modelling library, a RESTful service, a socket server, browser storage, or whatever, as long as all of the three can be done, it can be adapted.

`filter` is a function that gets called to check if `object` needs to use an adaptor.

`object` is the data source to adapt.

`keypath` is the keypath to `object`.

`ractive` is the ractive instance that is currently using the adaptor.

`wrap` is a function that gets called to set up the adaptor on `object`.

`prefixer` is a helper function that accepts an object and automatically prefixes `keypath` to the object's keys.

`get` is a function that gets called when Ractive needs the adapted representation of the `object`.

`set` is a function that is called when `ractive.set()` updates a keypath to a property of the adapted data. This function allows you to update the same property on `object`.

`property` is the keypath to the property being updated, relative to `keypath`.

`value` is the value being passed into `ractive.set()`.

`reset` is a function that is called when `ractive.set()` updates a keypath to the adapted data. This function allows you to either update `object` or tear down the adaptor.

`teardown` is a function called when the adaptor is being removed. This function allows you to do cleanup work on anything that was done during the adaptor setup.

### Adaptors only adapt one level

An adaptor only adapts an object's immediate properties. Updating nested data via Ractive or via the data source will not update the other.

### No built-in infinite loop detection

There is no built-in mechanism for avoiding infinite loops. If your adaptor calls `ractive.set()` on adapted data, which in turn will call the adaptor's `set()` method, which may directly or indirectly trigger another `ractive.set()` on the same adapted data, a stack overflow error might occur.

This isn't a problem with primitive values since Ractive doesn't bother calling `set()` if a value hasn't changed. But with objects and arrays, there's no easy and performant way to tell if the contents have changed. So `set()` gets called *in case something changed* rather than *because something changed*.

### Different for every back-end

The adaptor structure only provides you with the means to talk to and listen from a custom back-end. It does not impose any rules on how to write an adaptor for a certain back-end. For instance, an adaptor for a constructor-based object may be written differently from an adaptor meant to interact with a socket server.

## Registering

Like other plugins, there's 3 ways you can register adaptors:

### Globally, via the `Ractive.adaptors` static property.

```js
Ractive.adaptors.myAdaptor = myAdaptor;
```

### Per component, via the component's `adaptors` initialization property.

```js
const MyComponent = Ractive.extend({
  adaptors: { myAdaptor }
});
```

### Per instance, via the instance's `adaptors` initialization property.

```js
const ractive = new Ractive({
  adaptors: { myAdaptor }
});
```

## Using

In order to use an adaptor, you must tell the component or an instance to use it using the `adapt` initialization option.

```js
const ractive = new Ractive({
  adapt: [ 'myAdaptor' ]
})
```

## Examples

In the following example, we have a `Box` constructor that uses accessors to get and set its `width` and `height` properties. Since an instance of `Box` will have no publicly visible properties, Ractive cannot bind to them directly.

```js
function Box(width, height){
  var _width = width;
  var _height = height;

  this.getWidth = function(){ return _width; };
  this.setWidth = function(width){ _width = width; };
  this.getHeight = function(){ return _height; };
  this.setHeight = function(height){ _height = height };
}
```

In order for Ractive to properly use a `Box` instance, we build an adaptor for `Box`.

```js
Ractive.adaptors.boxAdaptor = {
  filter: function ( object ) {
    // Checks if the piece of data is an instance of Box.
    return object instanceof Box;
  },
  wrap: function ( ractive, box, keypath, prefixer ) {

    // We keep a reference to the original functions before monkey-patching.
    const setWidth = box.setWidth;
    const setHeight = box.setHeight;

    // Use ractive.set on the the adapted data whenever the setters are used.
    box.setWidth = function(width){
      ractive.set(prefixer({
        width: width
      }));
    };

    box.setHeight = function(height){
      ractive.set(prefixer({
        height: height
      }));
    };

    return {
      // Return a POJO representation of an instance of Box.
      get: function(){
        return {
          width: box.getWidth(),
          height: box.getHeight();
        };
      },
      // Update the adapted object's properties
      set: function(property, value){
        if(property === 'width') setWidth.call(box, value);
        if(property === 'height') setHeight.call(box, value);
      },
      // Update the adapted object.
      reset: function(data){
        // We don't adapt non-objects. And if the new data is an instance of Box
        // there's a high chance that its a new instance. In either case, we
        // need to tear down this adapter and have Ractive set it up again if
        // necessary.
        if(typeof data !== 'object' || data instanceof Box) return false;

        // Otherwise, we just parse through the data and update the existing box
        // instance.
        if(data.width !== undefined) setWidth.call(box, data.width);
        if(data.height !== undefined) setHeight.call(box, data.height);
      },
      // Delete the monkey-patched methods.
      teardown: function(){
        delete box.setWidth;
        delete box.setHeight;
      }
    };
  }
};
```

Then we use `boxAdaptor` on an instance. The data can now be treated like regular Ractive data. Updates done directly on `box` will reflect on Ractive. Any changes via Ractive will reflect on `box`.

```js
const ractive = new Ractive({
  el: 'body',
  // Tell the instance we'll be using boxAdaptor
  adapt: [ 'boxAdaptor' ],
  // We write Ractive like normal.
  template: `
    <div>Box is {{ box.width }}x{{ box.height }}</div>,
    <div><input type="text" value="{{ box.width }}"></div>
    <div><input type="text" value="{{ box.height }}"></div>
  `
});

const box = new Box(3, 4);

// Set the Box instance as if it were a POJO.
ractive.set('box', box);

// Both box instance and box object will have 7 width and 11 height and will
// be rendered in the UI accordingly.
box.setWidth(7);
ractive.set('box.height', 11);
```

# Components

In many situations, you want to encapsulate behaviour and markup into a single reusable *component*, which can be dropped into Ractive applications. Components are simply custom-configured "subclasses" of Ractive (analogous, but technically incorrect).

## Writing

There are several ways to write Ractive components. Standard initialization options apply for configuration unless where changes are explicitly mentioned.

The most common way to define a component is by using `Ractive.extend()`.

```js
// A subclass of Ractive
const MyComponent = Ractive.extend({
  template: `
    <div class="my-component">
      <span class="my-component__message">{{ message }}</span>
    </div>
  `,
  css: `
    .my-component__message { color: red }
  `,
  data: { message: 'Hello World' }
});
```

Another way to define a component is by using component files and loaders.

```html
<div class="my-component">
  <span class="my-component__message">{{ message }}</span>
</div>

<style>
  .my-component__message { color: red }
</style>

<script>
component.exports = {
  data: { message: 'Hello World' }
};
</script>
```

## Registering

Like other plugins, there's 3 ways you can register components:

### Globally, via the `Ractive.components` static property:

```js
// Available to all instances of Ractive.
Ractive.components.MyComponent = Ractive.extend({ ... });
```

### Per component, via the component's `components` initialization property.

```js
// Only available for instances of AnotherComponent.
const AnotherComponent = Ractive.extend({
  components: { MyComponent }
});
```

### Per instance, via the instance's `components` initialization property.

```js
// Only available to this specific instance.
const ractive = new Ractive({
  components: { MyComponent }
});
```

## Using

Components are simply subclasses of Ractive, which means the are instatiable via the `new` keyword.

```js
const ractive = new MyComponent({ ... });
```

But where components really shine is when they're used on templates. They are written like _custom elements_. Each custom element notation represents one instance of the component.

```js
const AnotherComponent = Ractive.extend({
  template: `
    <div>
      <MyComponent /> <!-- One instance of MyComponent -->
      <MyComponent /> <!-- Another instance of MyComponent -->
      <MyComponent /> <!-- Yet another instance of MyComponent -->
    </div>
  `
});
```

The component's tag name depends on the name used upon registration. The same component can be registered more than once using different names.

```js
const MyComponent = Ractive.extend({...});
Ractive.components.MyComponent = MyComponent;
Ractive.components.MyComponentOtherName = MyComponent;

const AnotherComponent = Ractive.extend({
  template: `
    <div>
      <MyComponent />          <!-- Using MyComponent -->
      <MyComponentOtherName /> <!-- Using MyComponent's other name -->
    </div>
  `
});
```

## Examples

```
```

# Decorators

A decorator is a simple way to add behaviour to a node when it is rendered, or to augment it in some way. Decorators are a good way to integrate DOM manipulation libraries with Ractive, such as [jQuery UI](http://jqueryui.com/) or [Bootstrap](https://getbootstrap.com/).

## Writing

```js
const myDecorator = function(node[, ...args]) {
  // Setup code
  return {
    teardown: function(){
      // Cleanup code
    },
    update: function([...args]){
      // Update code
    }
  };
};
```

Decorators are simply functions that are called upon to setup the decorator once Ractive detects its use. It takes a `node` argument and returns an object with a `teardown` and `update` property.

`node` is the element to which the decorator is applied to.

`args` are optional arguments provided by the decorator directive.

`teardown` is a function that gets called when the decorator is torn down.

`update` is an optional function that gets called when the arguments update.

Any updates to the arguments will call the decorator's `teardown` and run the decorator function again, essentially setting up the decorator again. If an `update` function is provided on the return object, that will be called instead of the `teardown` and setup function.

## Registering

Like other plugins, there's 3 ways you can register decorators:

### Globally, via the `Ractive.decorators` static property.

```js
Ractive.decorators.myDecorator = myDecorator;
```

### Per component, via the component's `decorators` initialization property.

```js
const MyComponent = Ractive.extend({
  decorators: { myDecorator }
});
```

### Per instance, via the instance's `decorators` initialization property.

```js
const ractive = new Ractive({
  decorators: { myDecorator }
});
```

## Using

You can invoke one or more decorators on your elements by using a decorator directive. Arguments are optional. Argument-less decorators can simply use the directive without value. Decorators with arguments take a comma-separated set of expressions that resolve to the element's context.

```html
<!-- without arguments -->
<div as-myDecorator>...</div>

<!-- with arguments -->
<div as-myDecorator="arg1, .some.other.arg2, 10 * @index" as-somethingElseToo>...</div>
```

## Examples

The following example builds a decorator that updates the time.

```js
Ractive.decorators.timer = function(node, time) {
  node.innerHTML = 'Hello World!';

  return {
    teardown: function() {
      node.innerHTML = '';
    },
    update: function(time) {
      node.innerHTML = time;
    }
  }
};

const ractive = new Ractive({
  el: 'body',
  template: `
    <span as-timer="time"></span>
  `,
  data: {
    time: 0
  }
});

setInterval(function() {
  ractive.set('time', Date.now())
}, 1000);
```

# Easings

Easing functions are used by `ractive.animate` and some transitions. They describe the animation's progression from start to finish.

## Writing

```js
const myEasing = function ( x ) {
  // Calculation
  return y;
};
```

Easing functions are simply functions that accept one argument, a numeric value `x` between 0 and 1 representing progress along a timeline. The function must return a numeric `y` value to represent its progression.

## Registering

Like other plugins, there's 3 ways you can register an easing function:

### Globally via the `Ractive.easing` static property.

```js
Ractive.easing.myEasing = myEasing;
```

### Per component via the component's `easing` initialization property.

```js
const MyComponent = Ractive.extend({
  easing: { myEasing }
});
```

### Per instance, via the instance's `easing` initialization property.

```js
const ractive = new Ractive({
  easing: { myEasing }
});
```

## Using

Easing functions don't work alone. They are utilized by ractive.animate() and Transitions to dictate animations.

```js
ractive.animate('foo.bar', 1, {
  easing: 'myEasing'
});
```

## Examples

Here's an `elastic` easing function taken from [danro](https://github.com/danro)'s excellent [easing.js](https://github.com/danro/easing-js/blob/master/easing.js) library.

```js
Ractive.easing.elastic = function ( x ) {
  return -1 * Math.pow(4,-8*x) * Math.sin((x*6-1)*(2*Math.PI)/2) + 1;
};
```

# Events

Events allow custom-named events on DOM elements. Common use cases for custom DOM events include normalizing cross-browser events, normalizing cross-device events, implementing custom events, and so much more.

## Writing

```js
const myEvent = function(node, fire){
  // Setup code
  return {
    teardown: function(){
      // Cleanup code
    }
  };
}
```

Events are simply functions that are called to set up the event on a DOM element. The event function accepts two arguments: `node` and `fire`, and returns an object containing a `teardown` property.

`node` is the element to which the event is being applied.

`fire` is the function that must be called when the event has taken place. `fire` takes a single argument, the event object received by handlers. The minimum requirement for the event object is a `node` property that references DOM node the event is attached to, and an `original` property which references the native DOM `event` object supplied by the native handler, if available.

The event object will be augmented with `context`, `keypath` and `index` properties, whose values depend on the data context the node is in. `context` references the data context that surrounds the node, `keypath` is a string that leads to the current data context and `index` is a number that references the index number of the data, should the data context be in an array.

`teardown` is a function that gets called once the element is torn down. This allows the event to clean up after itself.

## Registering

Like other plugins, there's 3 ways you can register events:

### Globally, via the `Ractive.events` static property.

```js
Ractive.events.myEvent = myEvent;
```

### Per component, via the component's `events` initialization property.

```js
const MyComponent = Ractive.extend({
  events: { myEvent }
});
```

### Per instance, via the instance's `events` initialization property.

```js
const ractive = new Ractive({
  events: { myEvent }
});
```

## Using

Events use the same `on-*` attribute syntax as component and DOM events. When Ractive encounters an `on-*` attribute on a DOM element, it looks for a registered event and applies it on the element. If no matching event name was found, Ractive will think the event name is a native DOM event and will attach one accordingly.

```html
// This will apply the "myEvent" custom event if one is registered.
// Otherwise, Ractive will think it's a DOM event. You have been warned!
<span on-myEvent="foo()">Click me!</span>
```

## Examples

Here's an example of a "long press" event which fires when the mouse is clicked and held for 1 second.

```js
// Definition
Ractive.events.longpress = function(node, fire){
  let timer = null;

  function clearTimer(){
    if(timer) clearTimeout(timer);
    timer = null;
  }

  function mouseDownHandler(event){
    clearTimer();

    timer = setTimeout(function(){
      fire({
        node: node,
        original: event
      });
    }, 1000);
  }

  function mouseUpHandler(){
    clearTimer();
  }

  node.addEventListener('mousedown', mouseDownHandler);
  node.addEventListener('mouseup', mouseUpHandler);

  return {
    teardown: function(){
      node.removeEventListener('mousedown', mouseDownHandler);
      node.removeEventListener('mouseup', mouseUpHandler);
    }
  };
};

// Usage:
new Ractive({
  el: 'body',
  template: `
    <button type="button" on-longpress="@this.greetz()">Click Me!</button>
  `,
  greetz: function(){
    console.log('Hello World!');
  }
});
```

# Interpolators

TODO

## Writing

TODO

## Registering

TODO

## Using

TODO

## Examples

TODO

# Partials

A partial is a template snippet which can be reused in templates or in other partials. They help to keep templates uncluttered, non-repetetive and easy to read.

## Writing

```js
const myPartial = '<!-- template -->';
```

Partials are simply Ractive templates.

## Registering

Unlike other plugins, partials have more than 3 registration options.

### Globally via the `Ractive.partials` static property.

```js
Ractive.partials.myPartial = MyPartial;
```

### Globally, via a non-executing script tag on the current page.

```html
<script type="ractive/template" id="myPartial">
  ...
</script>
```

### Per component, via the component's `partials` initialization property.

```js
const MyComponent = Ractive.extend({
  partials: { myPartial }
});
```

### Per instance, via the instance's `partials` initialization property.

```js
const ractive = new Ractive({
  partials: { myPartial }
});
```

### In-template, using the `{{#partial}}` mustache.

```
{{#partial myPartial}}
  ...
{{/}}
```

## Using

Partials can be used using `{{>partialName}}`. Partials work where any template would work and takes on its surrounding context.

```html
{{#partial myPartial}}
  <div class="message">{{message}}</div>
{{/partial}}

<div class="app">
  {{>myPartial}}
</div>
```

### Valid names

Partials may be named with the same rules as any other identifier in Ractive or JavaScript, but since there isn't much danger of trying to do math in a partial name, they enjoy relaxed naming requirements that allow otherwise reserved globals and keywords to be used for partial names.

Partial names may also contain `-` and `/` characters as long as they are surrounded by other valid characters e.g. `templates/some-partial-template`.

### Context

Partials be given an explicit context. Simply supply a reference to the context following the partial name on usage.

```js
Ractive({
  data: {
    foo:{
      bar: 'Hello, World!'
    }
  },
  template: `
    {{#partial myPartial}}{{bar}}{{/partial}}

    {{>myPartial foo}}
  `
})
```

### Aliases

References can also be aliased in partials. Simply define aliases as comma-separated `reference as alias` pairs following the partial name on usage.

```js
Ractive({
  data: {
    status: 'Me, Hungry!',
    foo:{
      bar: 'Hello, World!'
    }
  },
  template: `
    {{#partial myPartial}}{{msg}} {{state}}{{/partial}}

    {{>myPartial foo.bar as msg, status as state}}
  `
})
```

### Recursive partials

Partials can be used recursively. A common use case for this is when reusing partials on a tree-like structure, like a directory listing.

```html
<div class='fileSystem'>
  {{#root}}
    {{>folder}}
  {{/root}}
</div>

{{#partial folder}}
<ul class='folder'>
  {{#files}}
    {{>file}}
  {{/files}}
</ul>
{{/partial}}

{{#partial file}}
<li class='file'>
  <img class='icon-{{type}}'>
  <span>{{filename}}</span>

  <!-- if this is actually a folder, embed the folder partial -->
  {{# type === 'folder' }}
    {{>folder}}
  {{/ type === 'folder' }}
</li>
{{/partial}}
```

```js
rv = new Ractive({
  el: 'container',
  template: '#myTemplate',
  data: {
    root: {
      files: [
        { type: 'jpg', filename: 'hello.jpg' },
        { type: 'mp3', filename: 'NeverGonna.mp3' },
        { type: 'folder', filename: 'subfolder', files: [
          { type: 'txt', filename: 'README.txt' },
          { type: 'folder', filename: 'rabbithole', files: [
            { type: 'txt', filename: 'Inception.txt' }
          ]}
        ]}
      ]
    }
  }
});
```

In the example above, subfolders use the `{{>folder}}` partial, which uses the `{{>file}}` partial for each file, and if any of those files are folders, the `{{>folder}}` partial will be invoked again, and so on until there are no more files.

Beware of cyclical data structures! Ractive makes no attempt to detect cyclicality, and will happily continue rendering partials until the [Big Crunch](http://en.wikipedia.org/wiki/Big_Crunch) (or your browser exceeds its maximum call stack size. Whichever is sooner).

### Injecting partials

One good use of partials is to vary the shape of a template according to some condition, the same way you might use [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) elsewhere in your code.

For example, you might offer a different view to mobile users:

```html
<div class='main'>
  <div class='content'>
    {{>content}}
  </div>

  <div class='sidebar'>
    {{>sidebar}}
  </div>
</div>
```

```js
isMobile = /mobile/i.test( navigator.userAgent ); // please don't do this in real life!

ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  partials: {
    content: isMobile ? mobileContentPartial : desktopContentPartial,
    sidebar: isMobile ? mobileSidebarPartial : desktopSidebarPartial
  }
});
```

Or you might make it possible to extend a subclass without overriding its template:

```html
<div class='modal-background'>
  <div class='modal'>
    {{>modalContent}}
  </div>
</div>
```

```js
// Create a Modal subclass
Modal = Ractive.extend({
  template: modalTemplate,
  init: function () {
    var self = this, resizeHandler;

    resizeHandler = function () {
      self.center();
    };

    // when the window resizes, keep the modal horizontally and vertically centred
    window.addEventListener( 'resize', resizeHandler );

    // clean up after ourselves later
    this.on( 'teardown', function () {
      window.removeEventListener( 'resize', resizeHandler );
    });

    // manually call this.center() the first time
    this.center();
  },
  center: function () {
    // centering logic goes here
  }
});

helloModal = new Modal({
  el: document.body,
  partials: {
    modalContent: '<p>Hello!</p><a class="modal-button" proxy-tap="close">Close</a>'
  }
});

helloModal.on( 'close', function () {
  this.teardown();
});
```

### Partial expressions

Expressions can also be used to reference a partial instead of fixed partial names. Ractive will evaluate the expression and use its return value to select a partial. This is useful when you want the data to indicate what type of partial it should render with.

In the following example, `organisms` contains a list of organisms whose `type` can either be `person` or `animal`. Partials for each type is defined and the list uses the `type` of each item to determine which partial to use.

```html
{{#partial person}}Hi! I am {{.name}} and I have {{.fingerCount}} fingers!{{/}}

{{#partial animal}}Hi! I am a {{.name}} and I have {{.legCount}} legs!{{/}}

<ul>
  {{# organisms }}
    <li>{{> type }}</li>
  {{/}}
</ul>
```

In the case where there's a collision between the expression and a partial of the same name, Ractive will not evaluate the expression and instead, will immediately resolve to that partial.

In the following example, a partial named `type` is defined. Instead of evaluating `type`'s value, it will resolve to the partial named `type`.

```html
{{#partial person}}Hi! I am {{.name}} and I have {{.fingerCount}} fingers!{{/}}

{{#partial animal}}Hi! I am a {{.name}} and I have {{.legCount}} legs!{{/}}

{{#partial type}}Hi! I am {{.name}}{{/}}

<ul>
  {{# organisms }}
    <li>{{> type }}</li>
  {{/}}
</ul>
```

Partials can also be registered on-the-fly as well as have functions determine the partial to use.

In the following example, `makePartial` registers a partial on the fly using `template` and `id`, and returns the partial name for use in the template.

```js
new Ractive({
  el: 'main',
  template: `
    <span>Add a partial:</span>
    <textarea value="{{tpl}}" /></div>
    <button on-click="@this.add()">Add</button><br/>

    {{#list}}
      {{> @this.makePartial(.id, .template) }}
    {{/}}
  `,
  data: {
    list: [],
    tpl: '',

  },
  add: function() {
    this.push('list', {
      id: Math.random(),
      template: this.get('tpl')
    });
    this.set('tpl', '');
  },
  makePartial: function(id, template) {
    const name = 'partial-' + id;
    this.partials[name] = this.partials[name] || template;
    return name;
  }
});
```

### Updating Partials

Partials may be reset after they are rendered using `ractive.resetPartial()`. A reset partial will update everywhere it is referenced, so if it is used multiple times or inherited by a component, those instances will be updated as well. If a component has a partial with the same name as a parent partial, partial resets will not affect it since it is a different partial.

It should be noted that partials evaluate lazily, so it is possible to cause a single partial to update by wrapping it in a conditional section and causing the section to be hidden and re-shown.

```html
{{^toggle}}{{>rickroll}}{{/}}
```

```js
ractive.partials.rickroll = 'I wouldn\'t do that to you, chum.';
ractive.set('toggle', true);
ractive.set('toggle', false);
```

## Examples

Here's an example of a gallery using a partial for its thumbnail information:

```html
<!-- The partial called "thumbnail" -->
<figure class='thumbnail'>
  <img src='assets/thumbnails/{{id}}.jpg'>
  <figcaption>{{description}}</figcaption>
</figure>

<!-- The template that uses the partial -->
<div class='gallery'>
  {{#items}}
    {{>thumbnail}}
  {{/items}}
</div>
```

# Transitions

Transitions allow you to control how enter the DOM and how they leave the DOM. This allows you to define intro and outro behavior, particularly animations, when elements go in and out of the page.

## Writing

```js
const myTransition = function ( t, params ) {
  // Manipulate the DOM.
  // Call t.complete() when completed.
};
```

Transitions are simply functions that get called to animate a specified element.

`t` is a transition helper object that aids in the implementation of the transition.

`params` is the parameters passed in via the transition directive.

Transitions are expected to be asynchronous. In order to signal Ractive that the transition has completed, the transition must call the `t.complete()`.

Note that transitions control the element's arrival and departure to the page. That means upon completion, any styling done to the element will be removed automatically.

## Registering

Like other plugins, there's 3 ways you can register transitions:

### Globally, via the `Ractive.transitions` static property.

```js
Ractive.transitions.myTransition = myTransition;
```

### Per component, via the component's `transitions` initialization property.

```js
const MyComponent = Ractive.extend({
  transitions: { myTransition }
});
```

### Per instance, via the instance's `transitions` initialization property.

```js
const ractive = new Ractive({
  transitions: { myTransition }
});
```

## Using

Transitions are added to an element via a transition directive. The directive starts with the transition name followed by one or more suffixes. The transition may be intro-only (upon rendering) using the suffix `-in`, outro-only (upon removal) using the suffix `-out`, or both using the suffix `-in-out`.

```html
<div myTransition-in>Intro-only</div>
<div myTransition-out>Outro-only</div>
<div myTransition-in-out>Intro and outro</div>
```

To pass arguments to the transition, simply provide an expression as the directive's value. This will be passed as the second argument of the transition function.

```html
<div myTransition-in="{ /*params */ }">Intro-only</div>
<div myTransition-out="{ /*params */ }">Outro-only</div>
<div myTransition-in-out="{ /*params */ }">Intro and outro</div>
```

## Examples

The following example demonstrates a "flash" transition which colors the element green upon attachment, and red prior to removal.

```js
Ractive.transitions.flash = function(t, params) {
  // Process params and declaring defaults.
  const options = t.processParams(params, {
    color: t.isIntro ? '#0f0' : '#f00',
    duration: 400
  });

  // The "transition"
  t.setStyle('color', options.color);

  // Signal Ractive that the transition is complete.
  setTimeout(t.complete, options.duration);
};

new Ractive({
  el: 'body',
  template: `
    <button on-click='@this.insert()'>Insert item</button>
    <button on-click='@this.remove()'>Remove item</button>
    <ul>
      {{#items}}
      <li flash-in-out>{{this}}</li>
      {{/items}}
    </ul>
  `,
  data: {
    items: []
  },
  insert() {
    this.push('items', Date.now());
  },
  remove() {
    this.splice('items', 0, 1);
  }
});
```
