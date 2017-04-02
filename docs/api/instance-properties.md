# Instance Properties

## ractive.adaptors

`(Object<string, Object>)`

The instance-only registry of [adaptors](../extend/adaptors.md).

---

## ractive.components

`(Object<string, Function>)`

The instance-only registry of [components](../extend/components.md).

---

## ractive.container

`(Ractive)`

Each component instance that is in a yielded fragment has a container instance that is accessible using `this.container`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

If `bar` `{{yield}}`s, then `baz`'s container will be the `foo` instance.

---

## ractive.decorators

`(Object<string, Function>)`

The instance-only registry of [decorators](../extend/decorators.md).

---

## ractive.easing

`(Object<string, Function>)`

The instance-only registry of [easing functions](../extend/easings.md).

---

## ractive.events

`(Object<string, Function>)`

The instance-only registry of [events](../extend/events.md).

---

## ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by [`ractive.animate()`](../api/instance-methods.md#ractive.animate()).

---

## ractive.nodes

`(Object<string, HTMLElement>)`

An object containing all of the elements inside the instance that have an `id` attribute.

```js
const ractive = new Ractive({
  el: body,
  template: '<div id="myDiv">An unimaginatively named div.</div>'
});

ractive.nodes.myDiv === document.getElementById( 'myDiv' ); // true
```

This will also reference dynamically created elements.

```js
const ractive = new Ractive({
  el: myContainer,
  template: `
    <ul>
        {{#items:i}}
            <li id='item_{{i}}'>{{content}}</li>
        {{/items}}
    </ul>
  `,
  data: { items: myListOfItems }
});

// Get a reference to an arbitrary li element.
ractive.nodes[ 'item_' + num ];
```

---

## ractive.parent

`(Ractive)`

Each component instance can access its parent using `this.parent`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`baz`'s parent is the `bar` instance, and `bar`'s parent is the `foo` instance.

---

## ractive.partials

`(Object<string, string|Object|Function>)`

The instance-only registry of [partials](../extend/partials.md).

---

## ractive.root

`(Ractive)`

Each component instance can access its root Ractive instance using `this.root`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`foo`, `bar`, and `baz` will all have the Ractive instance with this template as their `root`.

---

## ractive.transitions

`(Object<string, Function>)`

The instance-only registry of [transitions](../extend/transitions.md).

