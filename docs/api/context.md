# Context

The context object is the type of object you receive when calling [getContext()](/api/static-methods.md#ractivegetcontext). This object contains various properties and methods that allow you to interact with and obtain information about the Ractive instance, the node associated with it and the context surrounding it.

The special `@context` reference is also a context object that is associated with the nearest VDOM item and element. It's frequently used with event directives to interact with the data associated with the immediate context.

Helper methods that take a [keypath](../concepts/templates.md#keypaths) will resolve relative to that node's context. Special references, template aliases, and key and index aliases are supported. If the method doesn't require a keypath, like `get`, then the keypath will implicitly be `.` rather than `~/`, as with regular instance methods.



## context.add()

See [ractive.add()](./instance-methods.md#ractiveadd).



## context.animate()

See [ractive.animate()](./instance-methods.md#ractiveanimate).



## context.decorators

`(Object)`

A map of decorator name to decorator return object for all of the decorators on the node associated with the context.



## context.event

`(Event|undefined)`

The original event for contexts supplied to event directives. This is `undefined` for contexts not associated with an event.



## context.get()

See [ractive.get()](./instance-methods.md#ractiveget).



## context.getBinding()

Returns the value of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `context.getBinding()`

**Arguments**

- None

**Returns**

- `(any)`: The value of the binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getContext('#findMe').getBinding(); // returns value of foo.bar.baz
```

## context.getBindingPath()

Returns the keypath of the binding if the node represented by this info object has a two-way binding.

**Syntax**

- `context.getBindingPath([ractive])`

**Arguments**

- `[ractive] (Ractive)`: The instance to resolve the keypath against.

**Returns**

- `(string)`: The keypath of the node binding.

**Examples**

```html
{{#with foo.bar}}<input id="findMe" value="{{.baz}}" />{{/with}}
```

```js
Ractive.getContext('#findMe').getBindingPath(); // Returns "foo.bar.baz"
```



## context.isBound()

Returns `true` if the node represented by this info object has a two-way binding.

**Syntax**

- `context.isBound()`

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
Ractive.getContext('#foo').isBound(); // Returns true
Ractive.getContext('#bar').isBound(); // Returns false
```



## context.link()

See [ractive.link()](./instance-methods.md#ractivelink).



## context.node

`(Node|undefined)`

The node associated with the context. Note that it is possible to get a context that is not associated with an element, which will leave the node `undefined`.



## context.observe()

See [ractive.observe()](./instance-methods.md#ractiveobserve).



## context.observeOnce()

See [ractive.observeOnce()](./instance-methods.md#ractiveobserveonce).



## context.original

`(Event|undefined)`

The original DOM event object. Normally present when the event is a Ractive DOM event. May be `undefined` on custom events or events from event plugins.



## context.pop()

See [ractive.pop()](./instance-methods.md#ractivepop).



## context.push()

See [ractive.push()](./instance-methods.md#ractivepush).



## context.ractive

`(Ractive)`

This property holds a reference to the Ractive instance that controls the node represented by this info object.



## context.raise()

Triggers the nearest matching event directive relative to the context. This is useful for decorators and other library constructs that want to be able to raise their own events that aren't necessarily tied to a DOM event. Raised events do not bubble.

**Syntax**

- `context.raise(eventName[, event[, ...args]])`

**Arguments**

- `eventName (string)`: The name of the event to raise. For `<div on-something="...">`, the event name would be `'something'`.
- `[event] (context|object)`: The context for the event or an object of properties to assign to the context for the event. Defaults to `{}`.
- `[args] (...any)`: Additional arguments to supply to the event handler.

**Examples**

```js
// TODO
```



## context.readLink()

See [ractive.readLink()](./instance-methods.md#ractivereadlink).



## context.resolve()

Resolves the given keypath to a full keypath. If a Ractive instance is supplied, the resolved path will also account for any mappings defined for the instance.

**Syntax**

- `context.resolve([keypath[, ractive]])`

**Arguments**

- `[keypath] (string)`: The keypath to resolve.
- `[ractive] (Ractive)`: The instance to resolve the keypath against.

**Returns**

- `(string)`: The resolved keypath.

**Examples**

```js
// TODO
```



## context.reverse()

See [ractive.reverse()](./instance-methods.md#ractivereverse).



## context.set()

See [ractive.set()](./instance-methods.md#ractiveset).



## context.setBinding()

Sets the binding of the node represented by this info object to the specified value.

**Syntax**

- `context.setBinding(value)`

**Arguments**

- `value (any)`. The value to set.

**Returns**

- `(Promise)`

**Examples**

```js
// TODO
```



## context.shift()

See [ractive.shift()](./instance-methods.md#ractiveshift).



## context.splice()

See [ractive.splice()](./instance-methods.md#ractivesplice).



## context.sort()

See [ractive.sort()](./instance-methods.md#ractivesort).



## context.subtract()

See [ractive.subtract()](./instance-methods.md#ractivesubtract).



## context.toggle()

See [ractive.toggle()](./instance-methods.md#ractivetoggle).



## context.unlink()

See [ractive.unlink()](./instance-methods.md#ractiveunlink).



## context.unshift()

See [ractive.unshift()](./instance-methods.md#ractiveunshift).



## context.update()

See [ractive.update()](./instance-methods.md#ractiveupdate).



## context.updateModel()

See [ractive.updateModel()](./instance-methods.md#ractiveupdatemodel).
