# Attributes

## `as-*`

`as-*` attributes augment the element with [decorators](../extend/decorators.md). It accepts an optional, comma-separated list of expressions which are handed over as arguments to the decorator function.

```html
<div as-modal>Div appearing as modal</div>
<div as-modal="true, true, true, false">Div appearing as modal</div>
```

## `class-*`

`class-*` attributes toggle individual class names based on the truthiness of its value. The part of the attribute following `class-` will be used as the class name.

```html
<div class-foo="{{ isFoo }}">Adds "foo" if isFoo</div>
<div class-foo-bar="{{ isFooBar }}">Adds "foo-bar" if isFooBar</div>
<div class-fooBar="{{ isFooBar }}">Adds "fooBar" if isFooBar</div>
```

`class-*` attributes are only processed as text, and any text provided is considered a truthy value.

```html
<div class-highlighted="true">I'm highlighted</div>
<div class-highlighted="false">I'm also highlighted</div>
```

To supply the expression that determines the presence of the class name, an interpolator must be used. When the values are updated, the appropriate class name will be added to or removed from the element.

```html
<div class-highlighted="{{ isHighlighted }}">Highlighted if true</div>
<div class-highlighted="{{ age === 42 }}">Highlighted if forty-two</div>
```

## `on-*`

`on-*` attributes attach event handlers for both native and [custom events](../extend/events.md). They are designed to look similar to regular `on*` attributes for familiarity, the only difference being the hyphen. `on-*` can be used in two ways: proxy event syntax and expression syntax.

Using the proxy event syntax, `on-*` accepts an event name as value. Events are handled by registering a function with [`ractive.on`](./instance-methods.md#ractiveon) using the assigned event name.

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

`*-in`, `*-out`, and `*-in-out` attributes apply [transitions](../extend/transitions.md) to the element. `*-in` specifies intro-only, `*-out` specifies outro-only, and `*-in-out` for both intro and outro. All three accept an optional value, an expression in the form of an object which is handed over as arguments to the transition function.

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

Mustaches can also be used to supply the values. When the values are updated, the appropriate style property on the element will update to the new value. `style-*` attributes are only processed as text.

```html
<div style-vertical-align="{{ vAlign }}" style-textAlign="{{ tAlign }}">...</div>
```
