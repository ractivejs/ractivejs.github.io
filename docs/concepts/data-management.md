# Data management

## Dependents

Ractive maintains a dependency graph in order to do only the minimum amount of work necessary to keep the DOM up-to-date. If you inspect a Ractive instance, you'll see a property called `_deps`. This is where all dependants are listed, indexed by their dependency.

### Priority

Ractive runs updates based on priority. For instance, when a subtree of the DOM needs to be removed while at the same time updates are pending for that subtree. What Ractive does is prioritize the removal of the subtree over the updates. This causes the dependents on the subtree to unregister themselves, eliminating the need to update, resulting with only the removal operation being done.

### Indirect dependencies

If you have a mustache which depends on `foo.bar`, and `foo` changes, it's quite possible that the mustache needs to re-render. We say that the mustache has an *indirect dependency* on `foo`, or that it has a *direct dependency on a downstream keypath* of `foo`.

This relationship is expressed through the `_depsMap` property of a Ractive instance - whenever `foo` changes, as well as dealing with direct `foo` dependants we check the map for those indirect dependants.

In the case of [expressions](./templates.md#expressions) and [observers](#observers), we also need to consider dependants of *upstream keypaths*. For example, suppose we have a section based on a sorted array - if we modify one of the members of the array, we need to see if the sort order has changed or not as a result:

```html
{{#( sort( list, 'name' ) )}}
  <p>{{name}}</p>
{{/()}}
```

```js
ractive = Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    list: [{ name: 'Bob' }, { name: 'Charles' }, { name: 'Alice' }],
    sort: function ( list, property ) {
      return list.slice().sort( function ( a, b ) {
        return a[ property ] < b[ property ] ? -1 : 1;
      })
    }
  }
})

// renders Alice, Bob, Charles

ractive.set( 'list[0].name', 'Zebediah' )

// updates to Alice, Charles, Zebediah
```

In the example, setting `list[0].name` causes dependants of `list` to be updated.

As well as [expressions](./templates.md#expressions), [Observers](#observers) respond to both upstream and downstream changes.


### Expressions with multiple dependencies

The expression `{{ a + b }}` has two dependencies - `a` and `b` (or more accurately, whatever those [references](./templates.md#references) resolve to). The `_deps` graph actually includes objects representing those individual references, rather than the expression itself - the reference objects then notify the expression (if their value has changed) that it will need to re-evaluate itself.

Because the expression has multiple dependencies, it won't trigger an update straight away - it will wait until all the new data has come in first. So doing `ractive.set({ a: 1, b: 2 })` will only trigger one update, not two.


## Two-way binding

Out of the box, Ractive supports two-way binding. This allows data to update bi-directionally, from data to the UI and vice versa.

```js
const instance = Ractive({
  data: { msg: 'Hello, World!' },
  template: `
    <input type="text" value="{{ msg }}">
    Ractive says: {{ msg }}
  `
})

// Writing on the input updates msg and re-renders anything bound to it.

// Updating msg updates and re-renders anything bound to it.
instance.set('msg', 'Lorem ipsum')
```

Two-way binding can be disabled via the [`twoway`](../api/initialization-options.md#twoway) initialization option or the [`twoway`](../api/attributes.md#twoway) input attribute.

### Ambiguous references

An ambiguous reference refers to a reference whose data does not exist at the time of construction.

```js
Ractive({
  data: { foo: {} },
  template: `
    {{#foo}}
      <input value="{{bar}}">
    {{/foo}}
  `,
})
```

In the example above, `foo.bar` nor `bar` exists on the data. Ractive must make an assumption, following a [resolution algorithm](./templates.md#reference-resolution), on what `bar` should be. Until any of those keypaths pop into existence, `bar` remains `undefined`.

To prevent Ractive from making assumptions on ambiguous references, [keypath prefixes](../api/references.md#keypath-prefixes) can be used to restrict resolution to a specific keypath.

### Lazy updates

By default, Ractive uses various events (i.e. `change`, `click`, `input`, `keypress`) to listen for changes on interactive elements and immediately update bound data. In cases where data updates should only take place after the element loses focus, Ractive also supports lazy updating.

Lazy updates can be enabled via the [`lazy`](../api/initialization-options.md#lazy) initialization option or the [`lazy`](../api/attributes.md#lazy) input attribute.

## Computed Properties

Computed properties are top-level pseudo-data references whose value is defined by a computation and which updates when its data dependencies update. They are useful for cases where a piece of data can be derived from other pieces of data as well as to avoid "watch-and-sync" boilerplate.

```js
Ractive({
  data: {
    width: 200,
    height: 300,
  },
  computed: {
    area(){ return this.get('width') * this.get('height') }
  },
  template: `
    Width: <input type="text" value="{{ width }}>
    Height: <input type="text" value="{{ height }}>
    Area: {{ area }}
  `
})
```

In the example above, the instance keeps a rectangle's length, width, and specifically _its area_. If area was kept as a data property, there's the need for ungodly amounts of "watch-and-sync" code to keep it updated when either `width` or `length` change. With computed properties, you simply define `area` as a function of its `width` and `length`.

### Compact form

For simpler cases, computed properties support a compact syntax. It's a string containing a JavaScript expression. Anything inside a `${}` is replaced internally with a `ractive.get()`, using the contents as a keypath.

```js
Ractive({
  data: {
    width: 200,
    height: 300,
  },
  computed: {
    area: '${width} * ${height}'
  },
  template: `
    Width: <input type="text" value="{{ width }}>
    Height: <input type="text" value="{{ height }}>
    Area: {{ area }}
  `
})
```

### Accessor form

By default, computed properties are read-only. To be able to set data bi-directionally on a computed property, computed properties support an accessor form. The accessor form defines a computed property as an object with a `get` and `set` method. `get` is called to retrieve its value and `set` is called when something updates its value.

```js
Ractive({
  data: {
    side: 200,
  },
  computed: {
    area: {
      get: 'Math.pow(${side}, 2)',
      set: function(v){ this.set('side', Math.sqrt(v) }
    }
  },
  template: `
    Side: <input type="text" value="{{ side }}>
    Area: <input type="text" value="{{ area }}>
  `
})
```

In the example above, updating `side` will recompute `area` while at the same time, setting a value on `area` will update `side`.

## Observers

### Nested properties

Ractive observers observe _upstream_ and _downstream_ keypaths. This allows observers to execute when data is updated indirectly, whether if it's the enclosing structure or a descendant property.

```js
const instance = Ractive({
  data: {
    foo: {
      bar: 1
    }
  }
})

instance.observe('foo', function(newValue){
  console.log('foo changed to', newValue)
})
instance.observe('foo.bar', function(newValue){
  console.log('foo.bar changed to', newValue)
})

// Logs:
// - foo.bar changed to 2
// - foo changed to { bar: 2 }
instance.set('foo.bar', 2 )

// Logs:
// - foo.bar changed to 3
// - foo changed to { bar: 3 }
instance.set('foo', { bar: 3 })
```

To bypass this behavior, observer methods accept a [`strict`](../api/instance-methods.md#observe) option which causes the observer to fire only when the specified keypath is updated.

### Wildcards

Wildcards allow observers to observe keypaths which have parts that cannot be determined in advance. This is useful when observing an array, observing objects within an array, or observing changes on object properties.


```js
const instance = Ractive({
  data: {
    people: [
      {name: 'Rich Harris'},
      {name: 'Marty Nelson'}
    ]
  }
})

// Observe changes on the array
instance.observe('people.*', function(){
  console.log(arguments)
})

// {name: 'Jason Brown'}, undefined, people.2, 2
instance.push('people', {name: 'Jason Brown'})

// {name: 'Jack Black'}, undefined, people.3, 3
instance.set('people.3', {name: 'Jack Black'})
```

```js
const instance = Ractive({
  data: {
    people: [
      {name: 'Rich Harris'},
      {name: 'Marty Nelson'}
    ]
  }
})

// Observe changes on the name property of any item on the array
instance.observe('people.*.name', function(){
  console.log(arguments)
})

// 'Jason Brown', undefined, people.2.name, 2
instance.push('people', {name: 'Jason Brown'})

// 'Jack Black', undefined, people.3.name, 3
instance.set('people.3', {name: 'Jack Black'})
```

```js
const instance = Ractive({
  data: {
    config: {
      allowComments: true,
      allowEdit: false
    }
  }
})

// Observe changes on the object properties
instance.observe('config.*', function() {
  console.log(arguments)
})

// true, false, 'config.allowEdit', 'allowEdit'
instance.set('config.allowEdit', true)
```

### Space delimited observers

Observers also support observing multiple keypaths. This can be done by simply defining the keypaths and separating them with spaces. This can be used for observing multiple specific keypaths on the data where observing an upstream keypath isn't viable.

```js
const instance = Ractive({
  data: {
    user: {username: 'browniefed'},
    config: {isAdmin: false},
    commentCount: 0
  }
})

ractive.observe('user.username config.isAdmin commentCount', function(){
  // executes when any of the 3 keypaths defined changes
})
```

### Caveats

Ractive observers by default do not defensively clone the old and new values as identity of these values may be essential. Thus, observers on non-primitive values may result in having identically equal old and new values.

```js
const instance = Ractive({
  data: {
    config: {
      allowComments: true,
      allowEdit: false
    }
  }
})

instance.observe('config', function(newValue, oldValue) {
  console.log(newValue === oldValue) // true
})

// Old and new values point to the same object since we only changed config's
// properties but not change the config object itself.
// { allowComments: true, allowEdit: true }, { allowComments: true, allowEdit: true }
instance.set('config.allowEdit', true)
```

If the old value's original structure matters, observer methods provide an [`old`](../api/instance-methods.md#ractiveobserve) option. This could be used to define the old value as a deep-clone of the data before any mutations are done.


## Components

### Mappings

Mappings connect pieces of data on the enclosing instance to data on enclosed instances. Changes on one side will reflect on the other.

```js
Ractive.components.MyComponent = Ractive.extend({
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}">
  `
})

const instance = Ractive({
  el: 'body',
  data: {
    text: ''
  },
  template: `
    <MyComponent message="{{ text }} />
  `
})

ractive.set('text', 'Hello World!')
```

In the example above, `text` on the instance is mapped to `MyComponent`'s `message`. Updates on `text` will update `message` and any UI elements bound to it. Updates on `message`, like editing the `<input>` bound with it, will update `text`.


### Data context

Each component instance comes with its own data context so that its data does not pollute the primary data. Any mapping between the component and the enclosing instance will still update across both contexts.

```js
Ractive.components.MyComponent = Ractive.extend({
  data: {
    shades: '',
    option: ''
  }
})

const instance = Ractive({
  template: `
    <MyComponent shades='{{colors}}' option='A' />
  `,
  data: {
    name: 'Colors',
    colors: ['red', 'blue', 'yellow']
  }
})

const widget = ractive.findComponent('MyComponent')

ractive.get() // {"colors":["red","blue","yellow"], "name":"Colors"}
widget.get()  // {"shades":["red","blue","yellow"], "option":"A"}

ractive.set('colors.1', 'green')

ractive.get() // {"colors":["red","green","yellow"], "name":"Colors"}
widget.get()  // {"shades":["red","green","yellow"], "option":"A"}
```

In the example above, the enclosing instance data holds `name` and `colors`. `colors` is mapped to `shades` and `option` is set on an instance of `MyComponent`. Upon inspection, `name` from the enclosing instance does not cross over to `MyComponent` nor does `option` cross over to the enclosing instance. However, since `colors` on the instance is mapped to `shades` on the component, any modifications on either side will reflect on the other.

### Isolation

By default, components are "isolated". Descendant components can update ancestor data only when there is an explicit mapping between them. This avoids unintended mutation of ancestor data and ensures portability of components.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: 'Message missing {{ message }}'
})

const instance = Ractive({
  el: 'body',
  template: '<ChildComponent />',
  data: {
    message: 'The ChildComponent will not know anything about this message'
  }
})
```

In the example above, `<ChildComponent>` will not print anything since `message` is not defined in the component and due to isolation, the component cannot see the instance's `message`.

Isolation can be disabled via the [`isolated`](../api/initialization-options.md#isolated) initialization option.
