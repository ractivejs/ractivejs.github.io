# Instance Methods

## ractive._super()

Calls the parent method from a child method of the same name.

`ractive._super()` is not always available. Only when Ractive detects its use does it make this reference to the parent method.

**Syntax**

- `ractive._super([arg[, ...argN]])`

**Arguments**

- `[arg] (any)`: One or more arguments to pass to the function.

**Returns**

- `(any)`: Depends on the method called.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGbVOAWwAOPNNxTMAvMwBKSeigCWUtADo0AD3TcAJgApgAHW5OUPI9yMpIzAGYArtyGRjz2AJTMzq4obly8-OYInADm9gDkGAHKaHKe3unhLm44LjjhANzF3DJyAMoBAEYKKmoa2vJKqtzqKBbW6g7Rbh5ePv5BIWGRw7EobEYYZgD6WTkwEVUxcTx8AmbJaZlNzPkohVslZUWu3D0A7swNzV1tKJu4QA"></div>

```js
var Component = Ractive.extend({
	oninit: function() {
		console.log('super init')
	}
});

var SubComponent = Component.extend({
	oninit: function() {
		this._super();
		console.log('sub init');
	}
})

new SubComponent();
```

---

## ractive.add()

Increments the selected keypath.

**Syntax**

- `ractive.add(keypath[, number])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the number we're incrementing.
- `[number] (number)`: The number to increment by. Defaults to `1`.

**Returns**

- `(Promise)`: A promise that resolves when the operation completes.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiQmJkzC-r1CmarNeY0ENDOEDQBzTPOvxZud0GD0eEzw9AAjMNoaCVAtlqt1lpNjtlHsDkcTj1zpdrrdtAMYBVIcNYeoDhhXu9Pj8-gD8aZgZNQfh6AAmaGk6a4IA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	r.add('counter');
	console.log(r.get('counter'));
}, 1000);

setTimeout(function() {
	r.add('counter', 10);
	console.log(r.get('counter'));
}, 2000);
```

---

## ractive.animate()

Similar to [`ractive.set()`](#ractiveset), this will update the data and re-render any affected mustaches and notify [observers](../concepts/events/publish-subscribe.md).

All animations are handled by a global timer that is shared between Ractive instances (and which only runs if there are one or more animations still in progress), so you can trigger as many separate animations as you like without worrying about timer congestion. Where possible, `requestAnimationFrame` is used rather than `setTimeout`.

Numeric values and strings that can be parsed as numeric values can be interpolated. Objects and arrays containing numeric values (or other objects and arrays which themselves contain numeric values, and so on recursively) are also interpolated.

Note that there is currently no mechanism for detecting cyclical structures! Animating to a value that indirectly references itself will cause an infinite loop.

Future versions of Ractive may include string interpolators - e.g. for SVG paths, colours, transformations and so on, a la D3 - and the ability to pass in your own interpolator.

If an animation is started on a [keypath](../concepts/templates/keypaths.md) which is *already* being animated, the first animation is cancelled. (Currently, there is no mechanism in place to prevent collisions between e.g. `ractive.animate('foo', { bar: 1 })` and `ractive.animate('foo.bar', 0)`.)

**Syntax**

- `ractive.animate(keypath, value[, options])`
- `ractive.animate(map[, options])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) to animate.
- `value (number|string|Object|Array)`: The value to animate to.
- `map (Object)`: A key-value hash of [keypath](../concepts/templates/keypaths.md) and value.
- `[options] (Object)`:
    - `[duration] (number)`: How many milliseconds the animation should run for. Defaults to `400`.
    - `[easing] (string|Function)`: The name of an easing function or the easing function itself. Defaults to `linear`.
    - `[step] (Function)`: A function to be called on each step of the animation. Receives `t` and `value` as arguments, where `t` is the animation progress (between `0` and `1`, as determined by the easing function) and `value` is the intermediate value at `t`.
    - `[complete] (Function)`: A function to be called when the animation completes, with the same argument signature as `step` (i.e. `t` is `1`, and `value` is the destination value)

**Returns**

- `(Promise)`: Returns a Promise with an additional `stop` method, which cancels the animation.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiRlVfrMwv69CvoAJmG8Q3omLRhUfeUDF+Gw3oU1mEzeAEZAcMZrggA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	r.animate('counter', 20, { duration: 2000 });
}, 1000);
```

---

## ractive.attachChild()

Creates a parent-child relationship between two Ractive instances. The child may be an instance of a component defined by [`ractive.extend()`](../api/static-methods.md#ractiveextend), but that is not a requirement, as children may be a plain Ractive instance created with `new Ractive()`.

**Syntax**
```js
ractive.attachChild( child );
ractive.attachChild( child, options );
```

**Arguments**

- `child (Ractive instance)`: The child instance to attach.
- `[options] (Object)`:
    - `[target] (string)`: An anchor name at which to render the instance. See [`Components`](../extend/components.md). If the instance is already rendered, it will be unrendered and re-rendered at an appropriate anchor.
    - `[append] (boolean)`: Default `true` - add the instance to the end of the list for the targeted anchor.
    - `[prepend] (boolean)`: Add the instance to the beginning of the list for the targeted anchor.
    - `[insertAt] (number)`: Index at which to add the instance in the list for the targeted anchor.

When a child is attached to a parent, the child's `parent` property is updated in an observable way, so any references to `@this.parent` in the child will be notified of the change.

A child may be targeted to a [`Components`](../extend/components.md) when it is attached. If a child has no specified target, then it is responsible for managing its own render cycle. If a child does have a specified target, then the parent will manage rendering and unrendering the child as appropriate in the same way that a regular component has a managed render cycle.

When a child is attached targeting an anchor, only anchors that belong directly to the parent are considered as hosts. However, any element or component queries on the parent instance, including live queries, will consider the child when trying to match both elements and components. There is also an option on the query methods that allows querying remote, unmanaged instances, so that non-anchored children can also be queried for elements and components.

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

Children can be detached using [`ractive.detachChild()`](#ractivedetachchild).

**Examples**

```js
// TODO
```

---

## ractive.detach()

Detaches the instance from the DOM, returning a document fragment. You can reinsert it, possibly in a different place, with [`ractive.insert()`](#ractiveinsert) (note that if you are reinserting it immediately you don't need to detach it first - it will happen automatically).

**Syntax**

- `ractive.detach()`

**Arguments**

- None

**Returns**

- `(DocumentFragment)`: A document fragment.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJgAjAvIB7AK7L0MSPWDA9h4zhwkp2lWqTKm9DLplpeYlCrsVqOiVVZRImKgA3RlYOGSQqVUU7cIiFEAIMeAikGHpclnplNAB3egAlJHIUSLQACmBHdARTAHIAYjiElrxG9BkuVDRWtpQubsamVCRTBtVfFEsjNBN6AAZGnBUcAEoAbkdlDDQUABUqTwMUWoAzQyqqXWVa7bNG7NyU+gKmXXJ9TyMADpKGhBgBRBBoAFXFopFp7CaRQFIGiCFwAYTAVAQTFqMEBTGOlTAzwRcz0h10kMBCF0AHNailAQkijAABInACyABkyfh6JpVkK9rggA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl',
	data: {
		counter: 0
	}
});

setTimeout(function() {
	var div = document.createElement('div');
	div.appendChild(r.detach());
	console.log(div.innerHTML);
}, 1000);
```

---

## ractive.detachChild()

Detaches a child from an instance when it was previously attached with [`ractive.attachChild()`](#ractiveattachchild).

When a child instance that was attached targeting an anchor is detached, its instance is spliced out of the `@this.children.byName.anchorName` array so that subsequent children move forward to fill the void.

**Syntax**

- `ractive.detachChild( child )`

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

**Examples**

```js
// TODO
```

---

## ractive.find()

Returns the first element inside a given Ractive instance matching a CSS selector. This is similar to doing `this.el.querySelector(selector)` (though it doesn't actually use `querySelector()`).

**Syntax**

- `ractive.find(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the element to find.
- `[options] (Object)`:

**Returns**

- `(Node)`: A Node.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnsaPtdn4se0mLdXjQ-HFEslXrCguRCU0EGg-NUErdmej0DBTEiALLpTnKfD0ACMAAYVbDcEA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl'
});

setTimeout(function() {
	var p = r.find('p.target');
	console.log(p.outerHTML);
}, 1000);
```

---

## ractive.findAll()

This method is similar to [`ractive.find()`]ractivefind), with two important differences. Firstly, it returns a list of elements matching the selector, rather than a single node. Secondly, it can return a *live* list, which will stay in sync with the DOM as it continues to update.

**Syntax**

- `ractive.findAll(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the elements to find.
- `[options] (Object)`
    - `[live] (boolean)`: Whether to return a live list or a static one. Defaults to `false`.

**Returns**

- `(Array<Node>)`: An array of nodes.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnt8vtdn4se0mABBBAIW6vGivWFBfK0rIAUUuYGxuPxhNuNBJZNc5EJTQQaD81QSYr86PQMFMSIAsulOXpoZCSgBGAAMpthuCAA"></div>

```js
var r = new Ractive({
	el: '#main',
	template: '#tpl'
});

setTimeout(function() {
	var ps = r.findAll('p');
	ps.forEach(function(p) {
		console.log(p.outerHTML);
	})
}, 1000);
```

---

## ractive.findAllComponents()

Returns all components inside a given Ractive instance with the given `name` (or all components of any kind if no name is given).

**Syntax**

- `ractive.findAllComponents([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`
    - `[live] (boolean)`: Whether to return a live list or a static one. Defaults to `false`.

**Returns**

- `(Array<ractive>)`: An array of ractive instances.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cgYeiDGBxel1JgAQQQCGxCNmmzhGJQ60uMIwQu8MAAorowAymSyqGzyBzkY4ULDlBhvAgJghvABzWbkOIobwACTJAFkADLspV4s6nUxGAAMIcuuCAAa"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = new Ractive({
	el: '#main',
	template: '#tpl',
	components: {
		Component: Component
	}
});

setTimeout(function() {
	var cs = r.findAllComponents('Component');
	cs.forEach(function(c) {
		console.log(c.toHTML());
	})
}, 1000);
```

---

## ractive.findComponent()

Returns the first component inside a given Ractive instance with the given `name` (or the first component of any kind if no name is given).

**Syntax**

- `ractive.findComponent([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`:

**Returns**

- `(Ractive)`: A ractive instance.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cj0QYwOL0upMbH9WabOEYlDrS4wgIYbwICYIbwAc1m5DiKG8AAkyQBZAAy7NlBNMRgADFbLrggA"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = new Ractive({
	el: '#main',
	template: '#tpl',
	components: {
		Component: Component
	}
});

setTimeout(function() {
	var c = r.findComponent('Component');
	console.log(c.toHTML());
}, 1000);
```

---

## ractive.findContainer()

Returns the first container of this component instance with the given `name`.

**Syntax**

- `ractive.findContainer(name)`

**Arguments**

- `name (string)`: The name of the container to find.

**Returns**

- `(Ractive)`: Returns the first container of this component with the given `name`.

**Examples**

```js
// TODO
```

---

## ractive.findParent()

Returns the first parent of this component instance with the given `name`.

**Syntax**

- `ractive.findParent(name)`

**Arguments**

- `name (string)`: The name of the parent to find.

**Returns**

- `(Ractive)`: Returns the first parent of this component with the given `name`.

**Examples**

```js
// TODO
```

---

## ractive.fire()

Fires an event, which will be received by handlers that were bound using [`ractive.on`](#ractiveon). In practical terms, you would mostly likely use this with [`Ractive.extend()`](../api/static-methods.md#ractiveextend), to allow applications to hook into your subclass.

**Syntax**

- `ractive.fire(eventName[, arg1[, ...argN])`

**Arguments**

- `name (string)`: The name of the event.
- `[arg] (any)`: The arguments that event handlers will be called with.

**Returns**

- `(boolean)`

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAAoAlAG4AOt0swAdD0MByAGadODvMycBXbjt33jZmBLcxQuXn40GwROAHNHF05PXRg0ABMHM0scLKtuWycUo2dXTNNcIA"></div>

```js
var r = new Ractive();

r.on('foo', function() {
  console.log('foo fired');
});

r.fire('foo');
```

---

## ractive.get()

Returns the value at `keypath`. If the [keypath](../concepts/templates/keypaths.md) is omitted, returns a shallow copy of all the data in the instance. This data includes mappings introduced by enclosing components, but excludes computed properties.

**Syntax**

- `ractive.get([keypath])`

**Arguments**

- `[keypath] (string)`: The [keypath](../concepts/templates/keypaths.md) of the data to retrieve.

**Returns**

- `(any)`: Returns whatever data was on the keypath, or all if no [keypath](../concepts/templates/keypaths.md) was provided.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAApgAHW4mUAE1RJIzU+ZQWAZp052HFrygBGsuwDazADkfgBewcwAumbeOLEo8dw4AJQA3LHcXLz8aAB0CJwA5oYweUVoKIbBrpx5fmUADMEp6bhAA"></div>

```js
var r = new Ractive({
	data: {
		foo: {
			bar: [ 'baz' ]
		}
	}
});

console.log(r.get('foo.bar.0'));
```

---

## ractive.getNodeInfo()

This is an instance specific version of [`Ractive.getNodeInfo()`](../api/static-methods.md#ractivegetnodeinfo) that will only search the local instance DOM for a matching node when a selector is given. If the given value is not a string, then it is passed directly through to the static version of this method.

**Syntax**

- `ractive.getNodeInfo(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of a target node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(NodeInfo)`: Returns an [NodeInfo](helper-objects/node-info.md) object with helper methods to interact with the Ractive instance and context associated with the given node.

**Examples**

```js
// TODO
```

---

## ractive.insert()

Inserts the instance to a different location. If the instance is currently in the DOM, it will be detached first. See also [`ractive.detach()`](#ractivedetach).

**Syntax**

- `ractive.insert(target[, anchor])`

**Arguments**

- `target (string|Node|array-like)`: The new parent element.
- `[anchor] (string|Node|array-like)`: The sibling element to insert the instance before. If omitted, the instance will be inserted as the last child of the parent.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

---

## ractive.link()

Creates a link between two [keypaths](../concepts/templates/keypaths.md) that keeps them in sync. Since Ractive can't always watch the contents of objects, copying an object to two different [keypaths](../concepts/templates/keypaths.md) in your data usually leads to one or both of them getting out of sync. `link` creates a sort of symlink between the two paths so that Ractive knows they are actually the same object. This is particularly useful for master/detail scenarios where you have a complex list of data and you want to be able to select an item to edit in a detail form.

**Syntax**

- `ractive.link(source, destination)`

**Arguments**

- `source (string)`: The [keypath](../concepts/templates/keypaths.md) of the source item.
- `destination (string)`: The [keypath](../concepts/templates/keypaths.md) to use as the destination - or where you'd like the data 'copied'.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
ractive.link( 'some.nested.0.list.25.item', 'current' );
ractive.set( 'current.name', 'Rich' ); // some.nested.0.list.25.item.name is also updated to be 'Rich'
```

This can be used to great effect with method events and the [`@keypath`](../concepts/templates/references.md) special ref:

```html
{{#each some.nested}}
  {{#each list}}
    {{#with item}}
      {{.name}}
      <button on-click="event.link('.', 'current')">Select</button>
    {{/with}}
  {{/each}}
{{/each}}

Name: <input value="{{~/current.name}}" />
```

Links can be removed using [`ractive.unlink()`](#ractiveunlink).

---

## ractive.merge()

Sets the indicated [keypath](../concepts/templates/keypaths.md) to the new array value, but "merges" the existing rendered nodes representing the data into the newly rendered array, inserting and removing nodes from the DOM as necessary. Where necessary, items are moved from their current location in the array (and, therefore, in the DOM) to their new location.

This is an efficient way to (for example) handle data from a server. It also helps to control `intro` and `outro` [transitions](../extend/transitions.md) which might not otherwise happen with a basic [`ractive.set()`](#ractiveset) operation.

To determine whether the first item of `['foo', 'bar', 'baz']` is the same as the last item of `['bar', 'baz', 'foo']`, by default we do a strict equality (`===`) check.

In some situations that won't work, because the arrays contain objects, which may *look* the same but not be identical. To deal with these, we use the `compare` option detailed below.

Merge can also be used to created a context block that uses transitions when the context changes.

**Syntax**

- `ractive.merge(keypath, value[, options])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array we're updating.
- `value (Array)`: The new data to merge in.
- `[options] (Object)`
    - `[compare] (boolean)`: If `true`, values will be stringified (with `JSON.stringify`) before comparison.
    - `[compare] (string)`: A property name that will be used to compare the array elements.
    - `[compare] (Function)`: A function that returns a value with which to compare array members.

**Returns**

- `(Promise)` - Returns a promise.

**Examples**


```html
{{#user}}
<div intro='fade'>{{first}} {{last}}</div>
{{/}}
```

```js
var r = new Ractive({
    el: document.body,
    template: '#template',
    data: {
        user: [{
            first: 'sam',
            last: 'smith'
        }]
    },
    complete: function(){
        this.merge('user', [{
            first: 'jane',
            last: 'johnson'
        }])
    }
})
```

---

## ractive.observe()

Observes the data at a particular [keypath](../concepts/templates/keypaths.md). Unless specified otherwise, the callback will be fired immediately, with `undefined` as `oldValue`. Thereafter it will be called whenever the *observed keypath* changes.

**Syntax**

- `ractive.observe(keypath, callback[, options])`
- `ractive.observe(map[, options])`

**Arguments**

- `keypath (String)`: The [keypath](../concepts/templates/keypaths.md) to observe, or a group of space-separated keypaths. Any of the keys can be a `` character, which is treated as a wildcard. A doubled `*` wildcard means `recursive`.

    The difference between `` and `*` is that `*` provides your callback function `value` and `keypath` arguments containing the path of the what actually changed, at any level of the keypath. So instead of getting the same parent value on every change, you get the changed value from whatever arbitrarily deep keypath changed.
- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see [Observers](../concepts/events/publish-subscribe.md) for more nuance regarding these arguments), whenever the observed [keypath](../concepts/templates/keypaths.md) changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the [keypath](../concepts/templates/keypaths.md) will have their matches passed to the callback at the end of the arguments list as well.
- `map (Object)`: A map of keypath-observer pairs.
- `[options] (Object)`:
    - `[init] (boolean)`: Defaults to `true`. Whether or not to initialise the observer, i.e. call the function with the current value of `keypath` as the first argument and `undefined` as the second.
    - `[defer] (boolean)`: Defaults to `false`, in which case [observers](../concepts/events/publish-subscribe.md) will fire before any DOM changes take place. If `true`, the [observer](../concepts/events/publish-subscribe.md) will fire once the DOM has been updated.
    - `[links] (boolean)`: Defaults to `false`.  Whether or not the observer should "follow through" any links created with [`ractive.link()`](#ractivelink).
    - `[strict] (boolean)`: Defaults to `false`. `strict` uses object identity to determine if there was a change, meaning that unless the primary object changed, it won't trigger the observer. For example with `{ data: { foo: { bar: 'baz' } } }`, `ractive.observe('foo', ..., { strict: true })` will not fire on `ractive.set('foo.bar', 'bat')` but will on `ractive.set('foo', { bar: 'bip' })`.
    - `[context] (any)`: Defaults to `ractive`. The context the [observer](../concepts/events/publish-subscribe.md) is called in (i.e. the value of `this`)

**Returns**

- `(Object)`: An object with a `cancel` method, for cancelling all observers

**Examples**

```js
// TODO
```

Note that you can observe [keypath](../concepts/templates/keypaths.md) *patterns*...

```js
ractive.observe( 'items.*.status', function ( newValue, oldValue, [keypath](../concepts/templates/keypaths.md) ) {
	var index = /items.(\d+).status/.exec( [keypath](../concepts/templates/keypaths.md) )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated [keypaths](../concepts/templates/keypaths.md) simultaneously:

```js
ractive.observe( 'foo bar baz', function ( newValue, oldValue, [keypath](../concepts/templates/keypaths.md) ) {
	alert( [keypath](../concepts/templates/keypaths.md) + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See [Observers](../concepts/events/publish-subscribe.md) for more detail.

---

## ractive.observeOnce()

Observes the data at a particular [keypath](../concepts/templates/keypaths.md) until the first change. After the handler has been called, it will be unsubscribed from any future changes.

**Syntax**

- `ractive.observeOnce(keypath, callback[, options])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) to observe, or a group of space-separated keypaths. Any of the keys can be a `` character, which is treated as a wildcard.
- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see [Observers](../concepts/events/publish-subscribe.md) for more nuance regarding these arguments), whenever the observed [keypath](../concepts/templates/keypaths.md) changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the [keypath](../concepts/templates/keypaths.md) will have their matches passed to the callback at the end of the arguments list as well.
- `[options] (Object)`:
    - `[defer] (boolean)`: Defaults to `false`, in which case [observers](../concepts/events/publish-subscribe.md) will fire before any DOM changes take place. If `true`, the [observer](../concepts/events/publish-subscribe.md) will fire once the DOM has been updated.
    - `[context] (any)`: Defaults to `ractive`. The context the [observer](../concepts/events/publish-subscribe.md) is called in (i.e. the value of `this`)

**Returns**

- `(Object)`: An object with a `cancel` method, for cancelling the observer.

**Examples**

```js
// TODO
```

Note that you can observe [keypath](../concepts/templates/keypaths.md) *patterns*...

```js
ractive.observeOnce( 'items.*.status', function ( newValue, oldValue, [keypath](../concepts/templates/keypaths.md) ) {
	var index = /items.(\d+).status/.exec( [keypath](../concepts/templates/keypaths.md) )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated [keypaths](../concepts/templates/keypaths.md) simultaneously:

```js
ractive.observeOnce( 'foo bar baz', function ( newValue, oldValue, [keypath](../concepts/templates/keypaths.md) ) {
	alert( [keypath](../concepts/templates/keypaths.md) + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See [Observers](../concepts/events/publish-subscribe.md) for more detail.

---

## ractive.off()

Removes an event handler, several event handlers, or all event handlers.

To remove a single handler, you must specify both the event name and the handler. If you only specify the event name, all handlers bound to that event name will be removed. If you specify neither event name nor handler, **all** event handlers will be removed.

An alternative way to remove event handlers is to use the `cancel` method of the return value of a call to `ractive.on()`.

**Syntax**

- `ractive.off([eventName[, handler]])`

**Arguments**

- `eventName (string)`: The event name to which this handler is currently bound.
- `handler (Function)`: The handler to remove.

**Returns**

- `(Ractive)`: Returns the `ractive` instance to allow this call to be chainable.

**Examples**

```js
// TODO
```

---

## ractive.on()

Subscribe to [events](../extend/events.md).

**Syntax**

- `ractive.on(eventName, handler)`
- `ractive.on(obj)`

**Arguments**

- `eventName (String)`: The name of the event to subscribe to
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel [event bubbling](../extend/events.md).
- `obj (Object)`: An object with keys named for each event to subscribe to. The value at each key is the handler function for that event.

**Returns**

- `(Object)` - An `Object` with a `cancel` method, which removes the handler.
- `(Object)` - An `Object` with a `cancel` method, which removes all handlers in the passed-in `obj`.

**Examples**

```js
// single handler to function
ractive.on( 'activate', function () {...});

// wildcard pattern matching
ractive.on( 'foo.*', function () {...} );

// multiple handlers to one function
ractive.on( 'activate select', function () {...} );

// map of handler/function pairs
ractive.on({
	activate: function () {...},
	select: function () {...}
});

// knock yourself out:
ractive.on({
	activate: function () {...},
	'bip bop boop': function () {...},
	'select foo.* bar': function () {...}
});
```

---

## ractive.once()

Subscribe to an event for a single firing. This is a convenience function on top of [`ractive.on()`](#ractiveon).

**Syntax**

- `ractive.once(eventName, handler)`

**Arguments**

- `eventName (string)`: The name of the event to subscribe to.
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel [event bubbling](../extend/events.md).

**Returns**

- `(Object)`: Returns an `Object` with a `cancel` method, which removes the handler.

**Examples**

```js
// TODO
```

---

## ractive.pop()

The Ractive equivalent to ```Array.pop``` that removes an element from the end of the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.pop(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.push()

The Ractive equivalent to ```Array.push``` that appends one or more elements to the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.push(keypath, value[, ...valueN])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to append to the end of the array. One or more values may be supplied.

**Returns**

- `(Promise)` - Returns a Promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.render()

Renders the component into a DOM element.

**Syntax**

- `ractive.render(target)`

**Arguments**

- `target (Node|String|array-like)`: The DOM element to render to.

**Returns**

- `(Promise)`: A promise that resolves when rendering completes or when the instance is already rendered.

**Examples**

```js
// TODO
```

---

## ractive.reset()

Resets the entire `ractive.data` object and updates the DOM.

**Syntax**

- `ractive.reset(data)`

**Arguments**

- `data (Object)`: The data to reset with. Defaults to `{}`.

**Returns**

- `(Promise)`: A promise.

**Examples**

This differs from `ractive.set()` in the following way:

```js
ractive = new Ractive({
  // ...,
  data: { foo: 1 }
});

ractive.set({ bar: 2 });
console.log( ractive.get() ); // { foo: 1, bar: 2 }

ractive.reset({ bar: 2 });
console.log( ractive.get() ); // { bar: 2 }
```

---

## ractive.resetPartial()

Resets a partial and re-renders all of its use-sites, including in any components that have inherited it. If a component has a partial with a same name that is its own, that partial will not be affected.

Inline partials that don't belong directly to a Ractive instance aren't affected by `resetPartial`.

**Syntax**

- `ractive.resetPartial(name, partial)`

**Arguments**

- `name (string)`: The partial to reset.
- `partial (string|Object|Function)`: A template string, pre-parsed template or a function that returns either.

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
ractive = new Ractive({
  // ...,
  partials: { foo: 'foo' }
});

// {{>foo}} will be replaced with 'foo'

ractive.resetPartial('foo', 'bar');

// {{>foo}} will be replaced with 'bar'
```

---

## ractive.reverse()

The Ractive equivalent to ```Array.reverse``` reverses the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.reverse(keypath)`

**Arguments**

- `keypath (String)`: The [keypath](../concepts/templates/keypaths.md) of the array to reverse, e.g. `list` or `order.items`

**Returns**

- `(Promise)` - A promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.set()

Updates data and triggers a re-render of any mustaches that are affected (directly or indirectly) by the change. Any [observers](../concepts/events/publish-subscribe.md) of affected [keypaths](../concepts/templates/keypaths.md) will be notified.

When setting an array value, ractive will reuse the existing DOM nodes for the new array, adding or removing nodes as necessary. This can impact nodes with [transitions](../extend/transitions.md). See [`ractive.merge()`](#ractivemerge) for setting a new array value while retaining existing nodes corresponding to individual array item values.

**Syntax**

- `ractive.set(keypath, value)`
- `ractive.set(map)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the data we're changing, e.g. `user` or `user.name` or `user.friends[1]` or `users.*.status`.
- `value (any)`: The value we're changing it to. Can be a primitive or an object (or array), in which case dependants of *downstream keypaths* will also be re-rendered (if they have changed).
- `map (Object)`: A map of `keypath: value` pairs, as above.

**Returns**

- `(Promise)`: Returns a promise that will be called after the set operation and any transitions are complete.

**Examples**

```js
// TODO
```

The `keypath` can also contain wildcards [pattern-observers](../concepts/events/publish-subscribe.md). All matching [keypaths](../concepts/templates/keypaths.md) will be set with the supplied values:

```js
ractive.on('selectAll', function(){
	ractive.set('items.*.selected', true);
})
```

---

## ractive.shift()

The Ractive equivalent to `Array.shift` that removes an element from the beginning of the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.shift(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: A promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.sort()

The Ractive equivalent to ```Array.sort``` sorts the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.sort(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to sort, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.splice()

The Ractive equivalent to ```Array.splice``` that can add new elements to the array while removing existing elements.

If the given [keypath](../concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.splice(keypath, index, [removeCount[, add]])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `index (number)`: The index at which to start the operation.
- `[removeCount] (number)`: The number of elements to remove starting with the element at *`index`. This may be 0 if you don't want to remove any elements.
- `[add] (any)`: Any elements to insert into the array starting at *`index`. There can be 0 or more elements passed to add to the array.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed elements after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.subtract()

Decrements the selected [keypath](../concepts/templates/keypaths.md).

**Syntax**

- `ractive.subtract(keypath[, number])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the number we're decrementing.
- `[number] (number)`: Defaults to `1`. The number to decrement by.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
// TODO
```

---

## ractive.teardown()

Unrenders this Ractive instance, removing any event handlers that were bound automatically by Ractive.

Calling `ractive.teardown()` causes a `teardown` [event](../extend/events.md) to be fired - this is most useful with [`Ractive.extend()`](../api/static-methods.md#ractiveextend) as it allows you to clean up anything else (event listeners and other bindings) that are part of the subclass.

**Syntax**

- `ractive.teardown()`

**Arguments**

- None

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---

## ractive.toCSS()

Returns the scoped CSS of the current instance and its descendants.

At the moment, this will not work on a direct instance of Ractive and will log a warning. You can only use this method on an instance of a subclass.

**Syntax**

- `ractive.toCSS()`

**Arguments**

- None

**Returns**

- `(string)`: The scoped CSS of the instance.

**Examples**

```js
const Subclass = Ractive.extend({
    ...
    css: 'div{ color: red }'
    ...
});

const subclassInstance = new Subclass({...});

// Contains the scoped version of div{ color: red }
subclassInstance.toCSS();
```

---

## ractive.toHTML()

Returns a chunk of HTML representing the current state of the instance. This is most useful when you're using Ractive in node.js, as it allows you to serve fully-rendered pages (good for SEO and initial pageload performance) to the client.

**Syntax**

- `ractive.toHTML()`

**Arguments**

- None

**Returns**

- `(string)`: The instance HTML.

**Examples**

```js
// TODO
```

---

## ractive.toggle()

Toggles the selected [keypath](../concepts/templates/keypaths.md). In other words, if `foo` is [truthy](http://james.padolsey.com/javascript/truthy-falsey/), then `ractive.toggle('foo')` will make it `false`, and vice-versa.

**Syntax**

- `ractive.toggle(keypath)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) to toggle the value of. If **keypath** is a pattern, then all matching [keypaths](../concepts/templates/keypaths.md) will be toggled.

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---

## ractive.transition()

Triggers a transition on a node managed by this Ractive instance.

**Syntax**

- `ractive.transition(transition, node, options)`

**Arguments**

- `transition (string|Function)`: A transition function or a name of a transition function.
- `node (HTMLElement)`: The node on which to start the transition - optional if called from within a Ractive event handler, as it will be retrieved from the event if not supplied.
- `options (Object)`: Options supplied to the transition.

**Returns**

- `(Promise)`: A promise that resolves when the transition completes.

**Examples**

```js
// TODO
```

---

## ractive.unlink()

Removes a link set up by [`ractive.link()`](#ractivelink).

**Syntax**

- `ractive.unlink(destination)`

**Arguments**

- `destination (string)`: The destination supplied to [`ractive.link()`].

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---
## ractive.unrender()
---

Unrenders this Ractive instance, throwing away any DOM nodes associated with this instance. This is the counterpart to [`ractive.render()`](#ractiverender). The rest of the ractive instance is left intact, unlike [`ractive.teardown()`](#ractiveteardown).

**Syntax**

- `ractive.unrender()`

**Arguments**

- None

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

---
## ractive.unshift()

The Ractive equivalent to ```Array.unshift``` that prepends one or more elements to the array at the given [keypath](../concepts/templates/keypaths.md) and triggers an update event.

If the given [keypath](../concepts/templates/keypaths.md) does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given [keypath](../concepts/templates/keypaths.md) does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.unshift(keypath, value)`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to prepend to the beginning of the array. One or more values may be supplied.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

---

## ractive.update()

Forces everything that depends on the specified [keypaths](../concepts/templates/keypaths.md) (whether directly or indirectly) to be 'dirty checked'. This is useful if you manipulate data without using the built in setter methods (i.e. [`ractive.set()`](#ractiveset), [`ractive.animate()`](#ractiveanimate), or array modification):

If no `keypath` is specified, all mustaches and [observers](../concepts/events/publish-subscribe.md) will be checked.

**Syntax**

- `ractive.update([keypath])`

**Arguments**

- `[keypath] (string)`: The [keypath](../concepts/templates/keypaths.md) to treat as 'dirty'. Any mustaches or [observers](../concepts/events/publish-subscribe.md) that depend (directly or indirectly) on this [keypath](../concepts/templates/keypaths.md) will be checked to see if they need to update

**Returns**

- `(Promise)`: A promise. If a [keypath](../concepts/templates/keypaths.md) is not supplied, this 'dirty checks' everything.

**Examples**

```js
ractive.observe( 'foo', function ( foo ) {
	alert( foo );
});

model.foo = 'changed';
ractive.update( 'foo' ); // causes [observer](../concepts/events/publish-subscribe.md) to alert 'changed'
```

---

## ractive.updateModel()

If you programmatically manipulate inputs and other elements that have [two‐way binding](../concepts/data-binding/two-way-binding.md) set up, your model can get out of sync. In these cases, we need to force a resync with `ractive.updateModel()`:

**Syntax**

- `ractive.updateModel([keypath[, cascade]])`

**Arguments**

- `keypath (string)`: The [keypath](../concepts/templates/keypaths.md) to treat as 'dirty'. Any two-way bindings linked to this [keypath](../concepts/templates/keypaths.md) will be checked to see if the model is out of date
- `cascade (boolean)`: If true, bindings that are *downstream* of `keypath` will also be checked - e.g. `ractive.updateModel( 'items', true )` would check `items.0.foo` and `items.1.foo` and so on. Defaults to `false`.

**Returns**

- `(Promise)`: A promise. If a `keypath` is not specified, all two-way bindings will be checked.

**Examples**

```js
ractive = new Ractive({
  el: 'container',
  template: '<input value="{{name}}">'
  data: { name: 'Bob' }
});

ractive.find( 'input' ).value = 'Jim';
alert( ractive.get( 'name' ) ); // alerts 'Bob', not 'Jim'

ractive.updateModel();
alert( ractive.get( 'name' ) ); // alerts 'Jim'
```

