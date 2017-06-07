# Event Management

Like many other libraries, Ractive implements its own [publish/subscribe](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) mechanism for triggering and responding to particular events. One of the advantages of using Ractive-managed events is that events are automatically unsubscribed and unreferenced once the instance is torn down, avoiding the need to do manual housekeeping.

## Sources

### Event API

Events that are published as a result of using the event APIs directly (i.e. [`ractive.fire`](../api/instance-methods.md#ractivefire)). Most of the other event sources use the event APIs to publish events at some point in their operation.

```js
instance.fire('someevent', 'Hello, World!')
```

### Lifecycle events

Lifecycle events are events that are published by an instance during the different phases of its existence. Ractive instances publish the following lifecycle events:

- [`construct`](../api/initialization-options.md#onconstruct)
- [`config`](../api/initialization-options.md#onconfig)
- [`init`](../api/initialization-options.md#oninit)
- [`render`](../api/initialization-options.md#onrender)
- [`complete`](../api/initialization-options.md#oncomplete)
- [`update`](../api/initialization-options.md#onupdate)
- [`insert`](../api/initialization-options.md#oninsert)
- [`detach`](../api/initialization-options.md#ondetach)
- [`unrender`](../api/initialization-options.md#onunrender)
- [`teardown`](../api/initialization-options.md#onteardown)
- [`destruct`](../api/initialization-options.md#ondestruct)

Lifecycle event names are reserved. They should not be used as names of other events.

### DOM events

DOM events are events that are published by the DOM.

```html
<button on-click="...">
```

### Custom events

Custom events are events that are published by [event plugins](../extend/events.md).

```html
<img on-tap="...">
```

### Component events

Component events are events that are published by [components](../extend/components.md).

```html
<MyModal on-close="..." />
```

## Handling

### Event API

Events published from the direct use of the event APIs are also handled by directly using the event APIs (i.e. [`ractive.on`](../api/instance-methods.md#ractiveon), [`ractive.once`](../api/instance-methods.md#ractiveonce)). Most of the other handling methods use the event APIs to handle events at some point in their operation.

```js
instance.on('someevent', (event, message) => {
  console.log(message)
})
```

### Lifecycle events

Lifecycle events are handled by assigning a function to the appropriate lifecycle event initialization option.

```js
Ractive({
  onrender(){
    console.log('instance has been rendered')
  }
})
```

The event APIs can also subscribe to lifecycle events. However, the handler must subscribe prior to the event publishing. Using the lifecycle event initialization options is the safer option to ensure the correct timing of subscriptions.

### Proxy syntax

Ractive instances do not immediately subscribe to template-based events (DOM events, component events, custom events). The proxy syntax "proxies" template-based events into events that the current instance can subscribe to. From there, the events are handled by event APIs. Arguments are not supported in this syntax.

```js
Ractive({
  template: `
    <button on-click="buttonclicked">Click Me!</button>
  `,
  oninit(){
    this.on('buttonclicked', event => {
      console.log('button clicked')
    })
  }
})
```

### Expression syntax

A more powerful form of template-based event handling is the expression syntax, which allows the use of expressions as their values. This form acts very similar to inline scripts plus some useful additions. The expression syntax also has full, unmustached access to data and [special references](../api/references.md#special-references).

The first form is a special form of the proxy syntax. It accepts an array whose first item is the event name, and the rest are its arguments.

```js
Ractive({
  template: `
    <button on-click="['buttonclicked', 'foo', 'bar']">Click Me!</button>
  `,
  oninit(){
    this.on('buttonclicked', (event, foo, bar) => {
      console.log('button clicked passing', foo, bar)
    })
  }
})
```

The second form uses expressions directly. This allows unrestricted access to almost anything, from calling instance methods, custom methods, or even firing a proxy event manually.

```js
Ractive({
  data: { msg: '' },
  template: `
    <button on-click="@this.set('msg', 'Hello, World!')">Set message</button>
    <button on-click="@this.greetz(msg)">Print message</button>
    <button on-click="@this.fire('manualproxy', msg)">Print message via proxy</button>
    <button on-click="@this.set('foo', 1), @this.set('bar', 2)">Cccombo!!!</button>
  `,
  greetz(message){
    console.log(`${message}`)
  },
  oninit(){
    this.on('manualproxy', (event, message) => {
      console.log(`${message}`)
    })
  }
})
```

## Event context

Event handlers, regardless of event source, receive an `event` object as first argument. The `event` object is a special instance of a [context object](../api/context-object.md) augmented with additional event-related properties where applicable.

- `name` - The name of the published event.
- `node` - A reference to the DOM node publishing the event. Only available on DOM events.
- `event` - A reference to the DOM event. Only available on DOM
- `original` - A reference to the DOM event. Only available on DOM
- `component` - A reference to the component that published the event. Only available on propagated events.

```js
Ractive({
  template: `
    <button on-click="buttonclicked">Click Me!</button>
  `,
  oninit(){
    this.on('buttonclicked', event => {
      console.log(event.node.type) // submit
    })
  }
})
```

## Namespacing

Pattern-matching is supported on any type of event, allowing a form of event namespacing. This is done by using a keypath-like event name and using wildcards (`*`) on segments during subscription.

```js
Ractive({
  el: 'body',
  append: true,
  template: `
    <button on-click="foo.bar">Click Me!</button>
    <button on-click="foo.baz">Click Me!</button>
    <button on-click="foo.bam">Click Me!</button>
    <button on-click="qux.bar">Click Me!</button>
    <button on-click="qux.baz">Click Me!</button>
    <button on-click="qux.bam">Click Me!</button>
  `,
  oninit(){
    this.on('*.bar', event => {
      console.log('A bar event was published')
    })
    this.on('qux.*', event => {
      console.log('A qux event was published')
    })
  }
})
```

Be aware that handlers subscribing to just `*` will fire for _all_ events.

## Propagation

### DOM event propagation

Native DOM event propagation is preserved, allowing things such as delegation.

```js
Ractive({
  template: `
    <div on-click="buttonclicked">
      <button type="button">Click Me!</button>
    </div>
  `,
  oninit(){
    this.on('buttonclicked', event => {
      console.log('button clicked')
    })
  }
})
```

### Component propagation

Propagation across component boundaries is also supported. Propagating events are namespaced using the publishing component's name as prefix. This applies to component, proxy, and even lifecycle events.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete(){
    this.fire('childevent')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: '<ChildComponent />'
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent', function(){
  console.log('Hello World!')
})
```

### Stopping propagation

Propagation can be stopped by simply returning `false` from an event handler. If the event is a DOM event, `event.stopPropagation()` and `event.preventDefault()` are automatically called.

```js
Ractive({
  template: `
    <div on-click="ancestorbuttonclick">
      <button on-click="descendantbuttonclick">Click Me!</button>
    </div>
  `,
  oninit(){
    this.on('ancestorbuttonclick', event => {
      console.log('This will not run')
    })
    this.on('descendantbuttonclick', event => {
      console.log('This will run')
      return false;
    })
  }
})
```

Returning `false` also stops propagation across components.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete: function(){
    this.fire('childevent')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: '<ChildComponent />',
  oninit: function(){
    this.on('ChildComponent.childevent', function(){
      return false;
    })
  }
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent', function(){
  console.log('This will not run')
})
```

Assigning a handler using `on-*` will also stop propagation. However, if `on-*` is assigned a proxy event and not stopped, that proxy event will propagate in place of the stopped event.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete: function() {
    this.fire('childevent1')
    this.fire('childevent2')
    this.fire('childevent3')
    this.fire('childevent4')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: `
    <ChildComponent
      on-childevent1=""
      on-childevent2="childevent2proxy"
      on-childevent3="childevent3proxy"
      on-childevent4="@this.parentMethod()"
    />
  `,
  oninit: function() {
    this.on('childevent2proxy', function() {
      // childevent2proxy replaces childevent2
    })
    this.on('childevent3proxy', function() {
      // childevent3proxy replaces childevent3 but stopped
      return false
    })
  },
  parentMethod: function(){
    // childevent4 handled by a method
  }
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent1', function() {
  console.log('childevent1 stopped by a blank handler')
})

instance.on('ChildComponent.childevent2', function() {
  console.log('childevent2 stopped by a proxy event')
})

instance.on('ChildComponent.childevent3', function() {
  console.log('childevent3 stopped by a proxy event')
})

instance.on('ChildComponent.childevent4', function() {
  console.log('childevent4 stopped by a method call')
})

instance.on('ParentComponent.childevent3proxy', function() {
  console.log('childevent3proxy stopped by returning false')
})

// This one gets through since its proxy event was left to propagate
instance.on('ParentComponent.childevent2proxy', function() {
  console.log('childevent2proxy fired')
})
```








