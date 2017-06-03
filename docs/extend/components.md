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
