# Input binding

## Text inputs

Data can be bound to text inputs via the `value` attribute. This includes text-like inputs such as password, email, color, tel, date, etc.

```js
Ractive({
  template: `
    <input type="text" value="{{ msg }}">
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

## Number inputs

Numeric data can be bound to number inputs via the `value` attribute. This includes number-like inputs such as range. The value from the input will automatically be converted into a number. When the input is blank, the value returned is `undefined`.

```js
Ractive({
  template: `
    <input type="number" value="{{ daysWithoutSleep }}">
  `,
  data: {
    daysWithoutSleep: 2
  }
});
```

## File inputs

File data can be bound to file inputs via the non-standard `value` attribute. The value from the input is a FileList object.

```js
Ractive({
  template: `
    <input type="file" value="{{ file }}">
  `,
  data: {
    file: /* FileList instance */
  }
});
```

## Checkboxes

Boolean data can be bound to checkboxes via the `checked` attribute. Note the non-standard usage of `checked`, which is a normally a boolean attribute.

```js
Ractive({
  template: `
    <input type="checkbox" checked="{{ isChecked }}">
  `,
  data: {
    isChecked: true
  }
});
```

Array data can also be bound to checkboxes via the `name` attribute.

```js
Ractive({
  template: `
    <input type="checkbox" name="{{ selectedItems }}" value="1">
    <input type="checkbox" name="{{ selectedItems }}" value="2">
    <input type="checkbox" name="{{ selectedItems }}" value="3">
  `,
  data: {
    selectedItems: ['1', '2']
  }
});
```

When both `checked` and `name` bindings are present, the binding to `checked` will be honored and the binding to `name` will be treated as a regular interpolation.

## Radio buttons

Boolean data can be bound to radio buttons via the `checked` attribute. Note the non-standard usage of `checked`, which is a normally a boolean attribute.

```js
Ractive({
  template: `
    <input type="radio" name="options" checked="{{ option1 }}">
    <input type="radio" name="options" checked="{{ option2 }}">
    <input type="radio" name="options" checked="{{ option3 }}">
  `,
  data: {
    option1: false,
    option2: true,
    option3: false
  }
});
```

Data can also be bound to radio buttons via the `name` attribute.

```js
Ractive({
  template: `
    <input type="radio" name="{{ selectedOption }}" value="1">
    <input type="radio" name="{{ selectedOption }}" value="2">
    <input type="radio" name="{{ selectedOption }}" value="3">
  `,
  data: {
    selectedOption: '1'
  }
});
```

## Text areas

Data can be bound to text inputs via the non-standard `value` attribute.

```js
Ractive({
  template: `
    <textarea value="{{ msg }}"></textarea>
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

Data can also be bound to text via its contents.

```js
Ractive({
  template: `
    <textarea>{{ msg }}</textarea>
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

## Select lists

Data can be bound to select lists via the non-standard `value` attribute.

```js
Ractive({
  template: `
    <select value="{{ selectedOption }}">
      <option value="1">Red</option>
      <option value="2">Green</option>
      <option value="3">Blue</option>
    </select>
  `,
  data: {
    selectedOption: '2'
  }
});
```

Array data can also be bound to select lists with the `multiple` attribute via the non-standard `value` attribute.

```js
Ractive({
  template: `
    <select multiple value="{{ selectedItems }}">
      <option value="1">Red</option>
      <option value="2">Green</option>
      <option value="3">Blue</option>
    </select>
  `,
  data: {
    selectedItems: [ '2', '3' ]
  }
});
```

## contenteditable

Data can be bound to elements that have the `contenteditable` attribute via the non-standard `value` attribute.

```js
Ractive({
  template: `
    <div contenteditable="true" value="{{ msg }}"></div>
  `,
  data: {
    msg: 'Hello, World!'
  }
});

// Rendered as:
// <div contenteditable="true">Hello, World!</div>
```

There are a few caveats when binding to an element with `contenteditable`:

- The returned string may or may not always be HTML.
- The returned string may be different from browser to browser.
- Any value set on the bound data will always be rendered as HTML.

# Input behavior

## twoway

The element-specific attribute form of [`twoway`](./initialization-options.md#twoway) that toggles two-way binding on a specific element.

```html
<!-- By default, two-way is enabled. Editing the input updates foo. -->
Two-way: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- With twoway="false", editing the input will not update bar. -->
One-way: <input type="text" value="{{ bar }}" twoway="false"> {{ bar }}

<!-- Updating bar via the data will update the UI -->
<button type="button" on-click="@this.set('bar', 'baz')">Set value to bar</button>
```

## lazy

The element-specific attribute form of [`lazy`](./initialization-options.md#lazy) that toggles lazy updating on a specific element.

```html
<!-- Editing the input updates foo on keypress. -->
Two-way: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- Editing the input updates bar only when focus moves away from the input. -->
One-way: <input type="text" value="{{ bar }}" lazy="true"> {{ bar }}
```

# Special attributes

## as-*

`as-*` attributes augment the element with [decorators](../extend/decorators.md). It accepts an optional, comma-separated list of expressions which are handed over as arguments to the decorator function.

```html
<div as-modal>Div appearing as modal</div>
<div as-modal="true, true, true, false">Div appearing as modal</div>
```

## class-*

`class-*` attributes toggle individual class names based on the truthiness of its value. The part of the attribute name following `class-` will be used as the class name. `class-*` attribute values are processed as expressions. If there is no expression, the implicit value is `true`, which is useful for applying multiple classes to an element using component `extra-attributes`.

```html
<div class-foo="isFoo">Adds "foo" if isFoo is truthy</div>
<div class-foo-bar="isFooBar">Adds "foo-bar" if isFooBar is truthy</div>
<div class-fooBar="isFooBar">Adds "fooBar" if isFooBar is truthy</div>
<div class-baz>Always has "baz"</div>
```

## on-*

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

## *-in, *-out, *-in-out

`*-in`, `*-out`, and `*-in-out` attributes apply [transitions](../extend/transitions.md) to the element. `*-in` specifies intro-only, `*-out` specifies outro-only, and `*-in-out` for both intro and outro. All three accept an optional value, an expression in the form of an object which is handed over as arguments to the transition function.

```html
<div fade-in>Fades on render</div>
<div fade-out>Fades before removal</div>
<div fade-in-out>Fades on render and before removal</div>
<div fade-in-out="{ duration: 500 }">Fades with 500ms duration</div>
```

## style-*

`style-*` attributes update individual `style` properties of the element. The part of the attribute following `style-` will be used as the style property name. There are two forms of the syntax: `style-property-name` (CSS style) and `style-propertyName` (JS style). Style property names will be normalized.

```html
<div style-vertical-align="middle">Applies style.verticalAlign</div>
<div style-textAlign="center">Applies style.textAlign</div>
```

`style-*` attribute values are processed as strings. Mustaches can also be used to supply the values. When the values are updated, the appropriate style property on the element will update to the new value.

```html
<div style-vertical-align="{{ vAlign }}" style-textAlign="{{ tAlign }}">...</div>
```
