# Static Properties

## Ractive.adaptors

`(Object<string, Object>)`

The registry of globally available [adaptors](../extend/adaptors.md).

---

## Ractive.components

`(Object<string, Function>)`

The registry of globally available [component definitions](../extend/components.md).

---

## Ractive.DEBUG

`(boolean)`

Tells Ractive if it's in debug mode or not. When set to `true`, non-fatal errors are logged. When set to `false`, non-fatal errors are suppressed. By default, this is set to `true`.

---

## Ractive.DEBUG_PROMISES

`(boolean)`

Tells Ractive to log errors thrown inside promises. When set to `true`, errors thrown in promises are logged. When set to `false`, errors inside promises are suppressed. By default, this is set to `true`.

---

## Ractive.decorators

`(Object<string, Function>)`

The registry of globally available [decorators](../extend/decorators.md).

---

## Ractive.defaults

`(Object<string, any>)`

Global defaults for [initialisation options](../api/initialization-options.md) with the exception of [plugin registries](../integrations/plugins.md).

```js
// Change the default mustache delimiters to [[ ]] globally
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Future instances now use [[ ]]
ractive1 = new Ractive({
    template: 'hello [[world]]'
});
```

Defaults can be specified for a subclass of Ractive, overriding global defaults.

```js
var MyRactive = Ractive.extend();

MyRactive.defaults.el = document.body;
```

Configuration on the instance overrides subclass and global defaults.

```js
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Uses the delimiters specified above
new Ractive({
	template: 'hello [[world]]'
});

// Uses the delimiters specified in the init options
new Ractive({
	template: 'hello //world\\',
	delimiters: [ '//', '\\' ]
});
```

---

## Ractive.easing

`(Object<string, Function>)`

The global registry of [easing functions](../extend/easings.md).

The easing functions are used by the [`ractive.animate`](../api/instance-methods.md#ractive.animate) method and by [transitions](../extend/transitions.md). Four are included by default: `linear`, `easeIn`, `easeOut` and `easeInOut`.

---

## Ractive.events

`(Object<string, Function>)`

The global registry of custom [event](../extend/events.md) plugins.

---

## Ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by [`ractive.animate()`](../api/instance-methods.md#ractiveanimate) or non-CSS transitions.

---

## Ractive.partials

`(Object<string, string|Object|Function>)`

The global registry of [partial templates](../extend/partials.md).

Like [templates](../concepts/templates.md#overview), partials are [parsed](../concepts/templates.md#parser) at the point of use. The parsed output is cached and utilized for future use.

---

## Ractive.svg

`(boolean)`

Indicates whether or not the browser supports SVG.

---

## Ractive.transitions

`(Object<string, Function>)`

The global registry of [transition functions](../extend/transitions.md).

---

## Ractive.VERSION

`(string)`

The version of the currently loaded Ractive.
