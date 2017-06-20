# Data management

## Dependents

Ractive maintains a dependency graph in order to do only the minimum amount of work necessary to keep the DOM up-to-date. If you inspect a Ractive instance, you'll see a property called `_deps`. This is where all dependants are listed, indexed by their dependency.

### Expression dependencies

Ractive uses dynamic analysis to determine dependencies. Depedendencies are determined by capturing references in the viewmodel while the function is executing. Dependencies for functions are re-captured each time the function is executed.

```html
<p>{{ formattedName() }}</p>
```

```js
var ractive = Ractive({
  template: template,
  el: output,
  data: {
    user: { firstName: 'John', lastName: 'Public' },
    formattedName: function() {
      return this.get('user.lastName') + ', ' + this.get('user.firstName')
    }
  }
};
```

Result:
```html
<p>Public, John</p>
```

In this example, the function ```formattedName``` will depend on both ```user.firstName``` and ```user.lastName```, and updating either (or ```user```) will cause any expressions referencing ```formattedName``` to be re-evaluated as well.

```js
ractive.set('user.firstName', 'Jane')
```

Result:
```html
<p>Public, Jane</p>
```

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

Two-way binding allows data to update bi-directionally, from data to the UI and vice versa.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vRk2nSAtrhS8+ACQQAbXUKw8A6kJi6kAQj5Se2W2QQqADrrkJeAA1vSAPBSZnAFcyHjJRZwQAXgYQRwAPMlieKiJdIOjY4GAeNRQ7DFiAPh5s3PUC5h8eXwEQsiElRoBaEl0KEgBrGJAAATIwClwAOlwEMlo+PIl+ABkzJx4ASWdcIJU+AEpigBUhHnbV9d8Aejq2RqLbbyYMTcwgA"></div>

```js
Ractive({
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <input type="text" value="{{ msg }}"> {{ msg }}

    <button on-click="@this.set('msg', 'Lorem Ipsum')">To lipsum</button>
  `
})
```

Two-way binding can be disabled via the [`twoway`](../api/initialization-options.md#twoway) initialization option or the [`twoway`](../api/directives.md#twoway) input directive.

### Ambiguous references

An ambiguous reference refers to a reference whose data does not exist at the time of construction. Ractive must make an assumption, following a [resolution algorithm](./templates.md#reference-resolution), on what ambiguous references resolve to. Until a suitable keypath pops into existence, ambiguous references resolve to `undefined`.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vYNik8yCALYAHADZyEvAAbLpAHgpMNAVzI8qRLRYQBeBiGDAeAjjwwYXAPh43Dy8fZX1JJgwASkwgA"></div>

```js
Ractive({
  data: {},
  template: `
    <input value="{{ msg }}"> {{ msg }}
  `,
})
```

Ambiguous references can be locked to a specific keypath, skipping the whole resolution process, using [keypath prefixes](../api/references.md#keypath-prefixes).

### Lazy updates

By default, Ractive uses various events (i.e. `change`, `click`, `input`, `keypress`) to listen for changes on interactive elements and immediately update bound data. In cases where data updates should only take place after the element loses focus, Ractive also supports lazy updating.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjwA2RAF6jeZGAFcEkptKRF2vRluk8AtrhS8+fKT2zWyCYwAc593gANr0gDxJqAPgAVUUcEHiImJB4SGQoSAGseIVUyXAokULIwUIomR2SvAHpfKj9PHi8cvLIeMmCEAF4GEHsADzImnioiGXVGkGBgEzMbDCa-HgGhlBHrDyYMAEpMIA"></div>

```js
Ractive({
  lazy: true,
  data: {
    msg: ''
  },
  template: `
    <div>Type and click outside the input</div>
    <input type="text" value="{{ msg }}"> {{ msg }}
  `
})
```

Lazy updates can be enabled via the [`lazy`](../api/initialization-options.md#lazy) initialization option or the [`lazy`](../api/directives.md#lazy) directive.

## Computed Properties

Computed properties are top-level pseudo-data references whose value is defined by a computation and which automatically update when its dependencies update.

### Function syntax

The function syntax defines a computed property as a function that returns the computed value. The context of the function is the current instance.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vRk2nSA7hSRkwvAEwAGXZKXKANgiYpNvAMz6pPbHZJCAtgAcArmWQK70jgiJaAEpFZWUYBDJ3GCVNClwAOi5aPjUNMD4gngAqHjjE5L5Tc01M33s7ByMvN2M5BF4AA3KAdXVLHgAeCiYPMjzRVwQAXgYQLwAPMjGeKiJjdxGx4GAeNM17DDGAPnKAGTMLLS6evoGh0fGEKZm5haWQFZ5io82d8oBBCKIFVf8iN5GZpMDBBTBAA"></div>

```js
Ractive({
  data: {
    width: 200,
    length: 300
  },
  computed: {
    area(){
      return this.get('width') * this.get('length')
    }
  },
  template: `
    Width: <input type="text" value="{{ width }}">
    Length: <input type="text" value="{{ length }}">
    Area: {{ area }}
  `
})
```

### Expression syntax

The expression syntax defines a computed property as a string containing a JavaScript expression. `${}` is replaced internally with a `ractive.get()`, using its contents as a keypath.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vRk2nSA7hSRkwvAEwAGXZKXKANgiYpNvAMz6pPbHZJCAtgAcArmWQK70jgiJePgASYDUNMAweACoeUNNzTQw+OwcjLzdjOQReAANfHgB1dUseAB4KJg8yHjJRVwQAXgYQLwAPMhaeKiJjdyaW4GAecM17DBaAPgKAGTMLLXLK6tr6gdaEDq6evvWhngSF8amCgEEYAIVh-yJjo3ymDABKTCA"></div>

```js
Ractive({
  data: {
    width: 200,
    length: 300
  },
  computed: {
    area: '${width} * ${length}'
  },
  template: `
    Width: <input type="text" value="{{ width }}">
    Length: <input type="text" value="{{ length }}">
    Area: {{ area }}
  `
})
```

### Accessor syntax

Both function and expression syntaxes only describe retrieval of the computed property's value, and therefore makes the computed property read-only. The accessor syntax defines a computed property by providing `get` and `set` methods. `get` is called to retrieve its value and `set` is called when something updates its value.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vRk2nTcFJAl4AmAAzapPbPpJCAtgAcArmWQL90jgiK2ly6V1oBKRa9cwEZCxglAFk5MAA6MyEAd1oyMApccPc+VXU+DyweTQ87ZUMXV1x-WiovPNd4xPDislpUtQQJHlD4moBHGDqy3ML8vIx9AulrcwAbOQ0eAAM8gGVG3gAeCiZLMh4yUTMEAF4GEGsADzIDnioiMYs9g+BgHjSEA0GQAD48gEE-Jx4VtatNtsbocECczhcrsC7jwHERngd3i5ZkwMB5MEA"></div>

```js
Ractive({
  data: {
    side: 200
  },
  computed: {
    area: {
      get(){
        return Math.pow(this.get('side'), 2)
      },
      set(v){
        this.set('side', Math.sqrt(v))
      }
    }
  },
  template: `
    Side: <input type="text" value="{{ side }}">
    Area: <input type="text" value="{{ area }}">
  `
})
```

Both function and expression syntaxes are supported for the `get` method.


## Observers

### Nested properties

Observers observe [_upstream_ and _downstream_ keypaths](../concepts/templates.md#upstream-and-downstream-keypaths). This allows observers to execute when data is updated indirectly, whether if it's the enclosing structure or a descendant structure.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAlmeQIYkEKUC8lASvQedQG4IAFMAA6JSpST0GkSqPETKAMyJFZ8xYoBG9GLICMYzRiOVspoltwIYA9aYkByFUUeylAVya9SgkggB3ADV6ABsPBABKDU1KYjIiUIQAOlCiFEFnVTiwRjQkSnJXLEp-YLCIyIczLGqsomSdGDdlLx5qXzKQ8KiYzXjcRJS0jPrG3Ry85ELi0sDuyuqTBWWMKpIxWgpGZmTrckyXceaSgCZ1rYYmFP3D1UcS4Eom2QBmM0jMIA"></div>

```js
const instance = Ractive({
  data: {
    foo: {
      bar: 1
    }
  },
  observe: {
    'foo': function(newValue){
      console.log('foo changed to', newValue)
    },
    'foo.bar': function(newValue){
      console.log('foo.bar changed to', newValue)
    }
  }
})

instance.set('foo.bar', 2)
instance.set('foo', { bar: 3 })
```

Observers can be set to only execute on the specified keypath via the `strict` option for both [`observe`](../api/initialization-options.md#observe) initialization option and [`ractive.observe()`](../api/instance-methods.md#observe).

### Wildcards

Wildcards allow observers to observe keypaths whose segments cannot be determined in advance. This is useful when observing an array, observing items within an array, or observing changes on object properties.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAlmeQIYkEKUC8lASvQedQG4IAFMAA6JSpST0GkSqPETKABwRElAGwSyA2mMWLgJegFstlAOQdqBMJQAS9GDGq5z2PfrlHTs8wFlHcgBPSgA5BHVcUjcPCQBdLFjKYhIAM2oUWXlPSnp1dSIAdwBhImNTEnJcWXIYAFcERIV9PILCgFEkanJZVLzcBCSMD3cFIgAjAZgBLKSAejnKAHlJhGmWG0Y0XEpSSnIwFkcYeiCk8xU1TQA6ACpzXrqmXlJBAEpszxSom4KUQXMx1Ou1W6xg5iwuRgKDqFSqbyGTX0C2WoIEyTAWwQOz2BxY3hYShgajWwV2qVyJBC3QQxho4jxUJOZ2aFkuGgQd2uBIelFSTx41FeHySEm+RF+RH+gKcwJpdImUwE4MhjhhcNwCNZo2RixWSo2mJI2124kYISJJJgZKIFMYIIAVggeOcUukUHdefznkKSO9PvpxZLpRMnTxlMSVNaQoq1sqIVD1QhKpqhiMxBgtWJaBRGMxrko6rgwAD2ZoE4YTGZzAApehRcQAIWJhRIbi1OYYTE5A3IpdUHOuAGYKwTfHWCABrSiN9TcSft7N0PM9hB98xujLXVpFTrdBO1BpvTBAA"></div>

```js
const instance = Ractive({
  data: {
    people: [
      {name: 'Rich Harris'},
      {name: 'Marty Nelson'}
    ],
    config: {
      allowComments: true,
      allowEdit: false
    }
  },
  observe: {
    // Observe changes on the array
    'people.*': function(){
      console.log('array observer', arguments)
    },
    // Observe changes on the name property of any item in the array
    'people.*.name': function(){
      console.log('array item observer', arguments)
    },
    // Observe changes on any property of an object
    'config.*': function(){
      console.log('object property observer', arguments)
    }
  }
})

instance.push('people', {name: 'Jason Brown'})
instance.set('people.3', {name: 'Jack Black'})
instance.set('config.allowEdit', true)
```

### Multiple sources

Multiple keypaths can be observed by adding them one after the other, separating them with a space.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAlmeQIYkEKUC8lASvQedQG4IAFMAA6JSpST0GkSqPETKAV1wIYs4CrUl6AWwSyA5ACMYRAO4lqCAGbJD2MYsrESN6ig3VcAQSS7aWRt6ABtVRwUJYl19EnIAYSIlONkABidKCIkiY1UYAQ0MiUMtGAA6Up19F1J3FDLvPwDxaNiEpLjDIOSealJBAEp5ZyjSXCIQhDKQohRBQykGFzBGNCRDLEp6GBQlNtwBgG4izIyMMQwBsTFaCkZmMtVyedKKvKqEDcpDAjAYb0MRxudHuUye81cdQavn8tC+5BgSgQQKsIKYYIQzx+RBiCDiiWS5C+ABYAExHTBAA"></div>

```js
const instance = Ractive({
  data: {
    user: {username: 'browniefed'},
    config: {isAdmin: false},
    commentCount: 0
  },
  observe: {
    'user.username config.isAdmin commentCount': function(){
      console.log('data changed', arguments);
    }
  }
})

instance.set('user.username', 'chris');
instance.set('config.isAdmin', true);
instance.set('commentCount', 42);
```

### Caveats

Observers do not defensively clone the old and new values as identity of these values may be essential. Thus, observers on non-primitive values may result in having identically equal old and new values.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAlmeQIYkEKUC8lASvQedQG4IAFMAA6JSpST0GkSqPETKxEgDNqKWfMWL6AG11EA7gGEiAWzMIS5XLPIwArgixjtEvQcMBRJNXKyVPVwEV0UMUOxQogAjYJgBTVCJAHJlNRRkgIcmXlJBEgRDADU9JyxKIl0kEt0nAEotN2VcSoQAOgMUfMKapzZWdkrq0oQ6pMpwhUmMMZIxWgpGZjbg8kFU0nS2jyMfP2Ty+3rMIA"></div>

```js
const instance = Ractive({
  data: {
    config: {
      allowComments: true,
      allowEdit: false
    }
  },
  observe: {
    'config': function(newValue, oldValue){
      console.log(newValue === oldValue)
    }
  }
})

instance.set('config.allowEdit', true)
```

Both [`observe`](../api/initialization-options.md#observe) initialization option and [`ractive.observe()`](../api/instance-methods.md#observe) accept an `old` option which allows you to define the old value passed to the observer prior to modifications.

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
