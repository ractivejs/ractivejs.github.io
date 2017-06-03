# Binding directives

## Text inputs

Data can be bound to text inputs via the `value` directive. This includes text-like inputs such as password, email, color, tel, date, etc.

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

Numeric data can be bound to number inputs via the `value` directive. This includes number-like inputs such as range. The value from the input will automatically be converted into a number. When the input is blank, the value returned is `undefined`.

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

File data can be bound to file inputs via the `value` directive. The value from the input is an instance of `FileList`.

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

Boolean data can be bound to checkboxes via the `checked` directive.

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

Array data can also be bound to checkboxes via the `name` directive.

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

Boolean data can be bound to radio buttons via the `checked` directive.

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

Data can also be bound to radio buttons via the `name` directive.

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

Data can be bound to text areas via the `value` directive.

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

Data can also be bound to text areas via its contents.

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

Data can be bound to select lists via the `value` directive.

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

Array data can also be bound to select lists with the `multiple` attribute via the `value` directive.

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

Data can be bound to elements that have the `contenteditable` attribute via the `value` directive.

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

# Behavior directives

## twoway

The element-specific directive form of [`twoway`](./initialization-options.md#twoway).

```html
<!-- By default, two-way is enabled. Editing the input updates foo. -->
Two-way: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- With twoway="false", editing the input will not update bar. -->
One-way: <input type="text" value="{{ bar }}" twoway="false"> {{ bar }}

<!-- Updating bar via the data will update the UI -->
<button type="button" on-click="@this.set('bar', 'baz')">Set value to bar</button>
```

## lazy

The element-specific directive form of [`lazy`](./initialization-options.md#lazy).

```html
<!-- Editing the input updates foo on keypress. -->
Eager: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- Editing the input updates bar only when focus moves away from the input. -->
Lazy: <input type="text" value="{{ bar }}" lazy="true"> {{ bar }}
```

# Other directives

## as-\*

`as-*` directives augment the element with [decorators](../extend/decorators.md). It accepts an optional, comma-separated list of expressions which are passed to the decorator function as arguments.

```html
<div as-modal>Div appearing as modal</div>
<div as-modal="true, true, true, false">Div appearing as modal</div>
```

## class-\*

`class-*` directives toggle individual class names based on the truthiness of its value. The part of the directive name following `class-` will be used as the class name. `class-*` directive values are processed as expressions. If there is no expression, the implicit value is `true`, which is useful for applying multiple classes to an element using component `extra-attributes`.

```html
<div class-foo="isFoo">Adds "foo" if isFoo is truthy</div>
<div class-foo-bar="isFooBar">Adds "foo-bar" if isFooBar is truthy</div>
<div class-fooBar="isFooBar">Adds "fooBar" if isFooBar is truthy</div>
<div class-baz>Always has "baz"</div>
```

## on-\*

`on-*` directives attach event handlers to DOM elements and components. `on-*` can be used in two ways: [proxy syntax](../concepts/event-management/#proxy-syntax) or the [expression syntax](../concepts/event-management/#expression-syntax).

```js
Ractive({
  template: `
    <button type="button" on-click="clickedproxy">Push me!</button>
    <button type="button" on-click="['clickedArray', 'Hello, World!']">Push me!</button>
    <button type="button" on-click="@this.clickedMethod('Hello, World!')">Push me!</button>
  `,
  oninit(){
    this.on('clickedproxy', event => {
      console.log('Hello, World!');
    });
    this.on('clickedArray', (event, msg) => {
      console.log(msg);
    })
  },
  clickedMethod(msg){
    console.log(msg);
  }
});
```

Multiple events can also be tied to the same handler by appending event names to the directive, separating them by hyphens:

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

## \*-in, \*-out, \*-in-out

`*-in`, `*-out`, and `*-in-out` directives apply [transitions](../extend/transitions.md) to the element. `*-in` specifies intro-only, `*-out` specifies outro-only, and `*-in-out` for both intro and outro. All three directives accept an optional, comma-separated list of expressions which are passed to the transition function as arguments.

```html
<div fade-in>Fades on render</div>
<div fade-out>Fades before removal</div>
<div fade-in-out>Fades on render and before removal</div>
<div fade-in-out="{ duration: 500 }, someOtherArg">Fades with 500ms duration</div>
```

## style-\*

`style-*` directives update individual `style` properties of the element. The part of the directive following `style-` will be used as the style property name. Style names can either be in kebab case or camel case, and will be normalized on application.

```html
<div style-vertical-align="middle">Applies style.verticalAlign</div>
<div style-textAlign="center">Applies style.textAlign</div>
```

`style-*` directive values are processed as strings. Mustaches can also be used to supply the values. When the values are updated, the appropriate style property on the element will update to the new value.

```html
<div style-vertical-align="{{ vAlign }}" style-textAlign="{{ tAlign }}">...</div>
```
