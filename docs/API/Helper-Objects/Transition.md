# Transition

The transition object is an object you receive when writing transitions. It has a few properties and methods designed to make creating transitions easier.

---

## t.animateStyle()

Animates CSS properties to a certain value.

**Syntax**

- `t.animateStyle(prop, value, options[, complete])`
- `t.animateStyle(props, options[, complete])`

**Arguments**

- `props (Object)`: A map of animation properties and values.
- `prop (string)`: The style to animate.
- `value (any)`: The value to animate it to.
- `options (Object)`: Animation options.
  - `duration (number)`: The duration of the animation.
  - `easing (string)`: The easing function of the animation.
  - `delay (number)`: The number of milliseconds before the animation starts.
- `[complete] (Function)`: A function that is executed when the animation completes, or immediately if no changes were made.

**Returns**

- `(Promise)`: A promise that resolves when the animation completes.

**Examples**

```js
// TODO
```

---

## t.complete()

Signals Ractive that the transition is complete.

**Syntax**

- `t.complete[noReset])`

**Arguments**

- `[noReset] (boolean)`: If `true`, [`t.resetStyle()`](#t.resetStyle()) is not called. Defaults to `false`.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

---

## t.getStyle()

Retrieve a CSS property value from `t.node`.

**Syntax**

- `t.getStyle(prop)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `prop (Array)`: An array of CSS properties.

**Returns**

- `(string)`: The value of the specified style property.
- `(Object)`: A key-value pair of properties and their respective values.

**Examples**

```js
// TODO
```

---

## t.isIntro

_(boolean)_

Should be self-explanatory...

---

## t.name

_(string)_

The name of the transition.

---

## t.node

_(Node)_


The node that's entering or leaving the DOM

---

## t.processParams()

Builds a map of parameters whose values are taken from the provided arguments. When used with a single number or string argument, serves as a shorthand for creating a map with a `duration` property.

**Syntax**

- `t.processParams(params[, defaults])`

**Arguments**

- `params (number)`: Numeric shorthand for the `duration` parameter. Expressed in milliseconds.
- `params (string)`: String shorthand for the `duration` parameter. Valid values are:
    - "fast" - 200ms
    - "slow" - 600ms
    - Any other string - 400ms
- `params (Object)`: A map of parameters and their values.
- `[defaults] (Object)`: A map of parameters and their default values.

**Returns**

- `(Object)`: A map of parameters and their values.

**Examples**

```js
// TODO
```

---

## t.setStyle()

Sets a CSS property on `t.node` to a value.

**Syntax**

- `t.setStyle(prop, value)`
- `t.setStyle(props)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `props (Object)`: A key-value pair of CSS properties and their respective values.
- `value (string)`: A valid value for the specified CSS property.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```
