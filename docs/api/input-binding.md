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

Array data can be bound to checkboxes via the `name` attribute.

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

Data can be bound to radio buttons via the `name` attribute.

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
