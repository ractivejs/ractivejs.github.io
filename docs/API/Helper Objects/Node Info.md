# Node Info

The nodeinfo object is the type of object you receive when calling [Node Info](Node Info.md). This object contains various properties and methods that allow you to obtain information about the Ractive instance, the node associated with it and the context surrounding it.

Helper methods that take a [keypath](../../Concepts/Templates/Keypaths.md) will resolve relative to that node's context. Special references, template aliases, and key and index aliases are supported.

---

## nodeinfo.add()

See [ractive.add()](../Instance Methods.md#ractive.add()).

---

## nodeinfo.animate()

See [ractive.animate()](../Instance Methods.md#ractive.animate()).

---

## nodeinfo.context

_`(any)`_

The data context of the node.

---

## nodeinfo.get()

See [ractive.get()](../Instance Methods.md#ractive.get()).

---

## nodeinfo.getBinding()

Returns the value of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.getBinding()`

**Arguments**

- None

**Returns**

- `(any)`: The value of the binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getNodeInfo('#findMe').getBinding(); // returns value of foo.bar.baz
```

## nodeinfo.getBindingPath()

Returns the [keypath](../../Concepts/Templates/Keypaths.md) of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.getBindingPath([ractive])`

**Arguments**

- `[ractive] (Ractive)`: The instance to resolve the [keypath](../../Concepts/Templates/Keypaths.md) against.

**Returns**

- `(string)`: The [keypath](../../Concepts/Templates/Keypaths.md) of the node binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getNodeInfo('#findMe').getBindingPath(); // Returns "foo.bar.baz"
```

---

## nodeinfo.index

_`(number|undefined)`_

The index of `context` if it's in an array. If not in an array, the value is `undefined`.

---

## nodeinfo.isBound()

Returns `true` if the node represented by this info object has a two-way binding.

**Syntax**

- `nodeinfo.isBound()`

**Arguments**

- None

**Returns**

- `(boolean)`: `true` if the node represented has a two-way binding.

**Examples**

```html
{{#with foo.bar}}
  <input id="foo" value="{{.baz}}" />
  <input id="bar" value="" />
{{/with}}
```

```js
Ractive.getNodeInfo('#foo').isBound(); // Returns true
Ractive.getNodeInfo('#bar').isBound(); // Returns false
```

---

## nodeinfo.keypath

_`(string)`_

The [keypath](../../Concepts/Templates/Keypaths.md) to `context`.

---

## nodeinfo.link()

See [ractive.link()](../Instance Methods.md#ractive.link()).

---

## nodeinfo.merge()

See [ractive.merge()](../Instance Methods.md#ractive.merge()).

---

## nodeinfo.node

_`(Node|undefined)`_

The node the event originated from. Normally present when the event is a Ractive DOM. May be `undefined` on custom events or events from event plugins.

---

## nodeinfo.original

_`(Event|undefined)`_

The original DOM event object. Normally present when the event is a Ractive DOM event. May be `undefined` on custom events or events from event plugins.

---

## nodeinfo.pop()

See [ractive.pop()](../Instance Methods.md#ractive.pop()).

---

## nodeinfo.push()

See [ractive.push()](../Instance Methods.md#ractive.push()).

---

## nodeinfo.ractive

_(Ractive)_

This property holds a reference to the Ractive instance that controls the node represented by this info object.

---

## nodeinfo.resolve()

Resolves the given [keypath](../../Concepts/Templates/Keypaths.md) to a full keypath. If a Ractive instance is supplied, the resolved path will also account for any mappings defined for the instance.

**Syntax**

- `nodeinfo.resolve([keypath[, ractive]])`

**Arguments**

- `[keypath] (string)`: The [keypath](../../Concepts/Templates/Keypaths.md) to resolve.
- `[ractive] (Ractive)`: The instance to resolve the [keypath](../../Concepts/Templates/Keypaths.md) against.

**Returns**

- `(string)`: The resolved keypath.

**Examples**

```js
// TODO
```

---

## nodeinfo.reverse()

See [ractive.reverse()](../Instance Methods.md#ractive.reverse()).

---

## nodeinfo.set()

See [ractive.set()](../Instance Methods.md#ractive.set()).

---

## nodeinfo.setBinding()

Sets the binding of the node represented by this info object to the specified value.

**Syntax**

- `nodeinfo.setBinding(value)`

**Arguments**

- `value (any)`. The value to set.

**Returns**

- `(Promise)`

**Examples**

```js
// TODO
```

---

## nodeinfo.shift()

See [ractive.shift()](../Instance Methods.md#ractive.shift()).

---

## nodeinfo.splice()

See [ractive.splice()](../Instance Methods.md#ractive.splice()).

---

## nodeinfo.sort()

See [ractive.sort()](../Instance Methods.md#ractive.sort()).

---

## nodeinfo.subtract()

See [ractive.subtract()](../Instance Methods.md#ractive.subtract()).

---

## nodeinfo.toggle()

See [ractive.toggle()](../Instance Methods.md#ractive.toggle()).

---

## nodeinfo.unlink()

See [ractive.unlink()](../Instance Methods.md#ractive.unlink()).

---

## nodeinfo.unshift()

See [ractive.unshift()](../Instance Methods.md#ractive.unshift()).

---

## nodeinfo.update()

See [ractive.update()](../Instance Methods.md#ractive.update()).

---

## nodeinfo.updateModel()

See [ractive.updateModel()](../Instance Methods.md#ractive.updateModel()).
