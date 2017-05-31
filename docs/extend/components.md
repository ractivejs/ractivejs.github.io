# Components

In many situations, you want to encapsulate behaviour and markup into a single reusable *component*, which can be dropped into Ractive applications. Components are simply custom-configured "subclasses" of Ractive (analogous, but technically incorrect).

## Writing

There are several ways to write Ractive components. Standard [initialization options](../api/initialization-options.md) apply for configuration unless where changes are explicitly mentioned.

The most common way to define a component is by using [`Ractive.extend()`](../api/static-methods.md#ractiveextend).

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

Another way to define a component is by using [component files](../api/component-files.md) and [loaders](../integrations/loaders.md).

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



### Events

Components can fire events like regular elements using [ractive.fire()](../api/instance-methods.md#ractivefire). Enclosing instances can listen for events using the same `on-*` event notation. There are two ways to handle component events.

The first is using the method call syntax which is similar to how you would write inline JavaScript.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('boringeventname');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent on-boringeventname="@this.greetz()" />
  `,
  greetz: function(){
    console.log('Hello World');
  }
});
```

The other is using the proxy event syntax. It's called "proxy" in the sense that the component event is assigned another name which is actually listened to by the enclosing instance.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('boringeventname');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent on-boringeventname="greetz" />
  `,
  oninit: function(){
    this.on('greetz', function(){
      console.log('Hello World')
    });
  }
});
```

### Bubbling

Events fired from within components will also "bubble" up the component hierarchy with their component name attached as a namespace. This can be used to avoid having to re-fire events at each level in a deeply nested component hierarchy.

In the following example, the event from the `ChildComponent` instance can be listened to from the outer Ractive instance.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('childevent');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent />
  `
});

const ractive = new Ractive({
  el: 'body',
  template: `
    <ParentComponent />
  `
});

ractive.on('ChildComponent.childevent', function(){
  console.log('Hello World!');
});
```

To listen to the same event name regardless of the component that's firing the event, an `*` can be used as the namespace.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('sameevent');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent />
  `,
  oncomplete: function(){
    this.fire('sameevent');
  }
});

const ractive = new Ractive({
  el: 'body',
  template: `
    <ParentComponent />
  `
});

ractive.on('*.sameevent', function(){
  console.log('This will fire two times, one for each component.');
});
```

The namespace is not bound to the component definition but rather to the name of the component.

In the following example, `ChildComponent` is registered onto the `ParentComponent` as `ChildComponent1` and `ChildComponent2`. Even with the same definition, there will be two namespaces, one for `ChildComponent1` and `ChildComponent2`.

```js
const ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('sameevent');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent1 />
    <ChildComponent2 />
  `,
  components: {
    ChildComponent1: ChildComponent,
    ChildComponent2: ChildComponent
  }
});

const ractive = new Ractive({
  el: 'body',
  template: `
    <ParentComponent />
  `
});

ractive.on('ChildComponent1.sameevent', function(){
  console.log('Same component definition, instance with name 1.');
});

ractive.on('ChildComponent2.sameevent', function(){
  console.log('Same component definition, instance with name 2.');
});
```

### Stopping propagation

In order to stop bubbling, simply return `false` from an event handler. Should the event come from a DOM event, it will call `stopPropagation()` and `preventDefault()` automatically.

In the following example, `ParentComponent` listens to `childevent` and returns false to in its handler. This prevents the outer instance from receiving the event.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function(){
    this.fire('childevent');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent />
  `,
  oninit: function(){
    this.on('ChildComponent.childevent', function(){
      return false;
    });
  }
});

const ractive = new Ractive({
  el: 'body',
  template: `
    <ParentComponent />
  `
});

ractive.on('ChildComponent.childevent', function(){
  console.log('This will not fire');
});
```

Events that have been assigned a handler using `on-*` will also prevent the bubbling of the original event. A proxy event is assigned, will bubble in its place.

In the following example, `childevent1` is prevented by not assigning a handle. `childevent2` is prevented by having a proxy event `childevent2proxy` assigned to it, which will also bubble in its place. `childevent3` is prevented by a method call.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div></div>
  `,
  oncomplete: function() {
    this.fire('childevent1');
    this.fire('childevent2');
    this.fire('childevent3');
  }
});

Ractive.components.ParentComponent = Ractive.extend({
  template: `
    <ChildComponent on-childevent1="" on-childevent2="childevent2proxy" on-childevent3="@this.parentMethod()" />
  `,
  oninit: function() {
    this.on('childevent2proxy', function() {
      console.log('childevent2 handled and will no longer bubble.');
      console.log('childevent2proxy will take its place.');
    });
  },
  parentMethod: function(){
    console.log('childevent3 handled by a method')
  }
});

const ractive = new Ractive({
  el: 'body',
  template: `
    <ParentComponent />
  `
});

ractive.on('ChildComponent.childevent1', function() {
  console.log('childevent1 stopped');
});

ractive.on('ChildComponent.childevent2', function() {
  console.log('childevent2 stopped');
});

ractive.on('ParentComponent.childevent2proxy', function() {
  console.log('childevent2proxy fired');
});

ractive.on('ChildComponent.childevent3', function() {
  console.log('childevent3 fired');
});
```

### {{>content}}

`{{>content}}` renders the inner HTML in the context of the component. Partials, components, and any other valid template items can be used as inner HTML. `{{>content}}` can be thought of as a special partial.

In the following example, the result will print "Lorem Ipsum" because the inner HTML's context is the component, whose `message` is set to "Lorem Ipsum".

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Partials defined in the inner HTML can be used to override partials defined on the component. This can be used to allow easy customization of each instance using partials.

In the following example, `ChildComponent`'s default template for the `messageWrapper` partial is a `<strong>`. Upon use of `ChildComponent` in the instance, it overrides the partial to use an `<em>` instead.

```js
Ractive.components.ChildComponent = Ractive.extend({
  partials: {
    messageWrapper: '<strong>{{message}}</strong>'
  },
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">

        {{#partial messageWrapper}}<em>{{message}}</em>{{/}}

        <div class="inner-content">
          {{> messageWrapper }}
        </div>

      </ChildComponent>
    </div>
  `
});
```

### {{yield}}

`{{yield}}` renders the inner HTML in the context of the parent component. Partials, components, and any other valid template items can be used as inner HTML. A common use case of `{{yield}}` is to provide wrapper markup transparently.

In the following example, the result will print "Hello World!" because the inner HTML's context is the parent component's, whose `message` is "Hello World!".

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{ yield }}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Yields can also be customized using named yields. Instead of rendering with the component's inner HTML, a named yield will look for a partial in the inner HTML with the same name and use that to render the yielded content.

In the following example, `ChildComponent` renders the yield content 3 times. However, the last two yields will look for `italicYield` and `boldYield` partials in the inner HTML and use that to render. What's rendered is three "Hello World!"s in regular, italic and bold.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">
      {{ yield }}
      {{ yield italicYield }}
      {{ yield boldYield }}
    </div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        {{#partial italicYield }}<em>{{message}}</em>{{/}}
        {{#partial boldYield }}<strong>{{message}}</strong>{{/}}
        {{message}}
      </ChildComponent>
    </div>
  `
});
```

## Examples

```
```
