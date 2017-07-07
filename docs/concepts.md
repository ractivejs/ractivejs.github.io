# Architecture

There are three major sections in the Ractive source code: The parser which handles template parsing, the models which handle data management and the views which handle the virtual DOM. This document aims to give a breakdown of just what exactly each of these sections do.

## Parser

Ractive's parser is reponsible for taking in Mustache-like/Handlebar-like templates. Unlike Mustache and Handlebars, however, it turns them into an _AST_ for use by the runtime. In addition, it also supports a fair amount of ES syntax for use in expressions.

Each item expressable in Ractive-flavored mustache has its own parsing function that may also be comprised of other parsing functions. Each bit of ES syntax that Ractive understands for expressions also has its own parsing function. The parser starts at the beginning of the template string and starts applying each parsing function in precedence order. Each function will then consume as much of the template as needed to return an item, like an element, a section, a partial, a bit of text, or an interpolator. It may also return nothing. Most items can also contain children, including items of the same type as themselves, and will thus recurse by trying to parse their content.

### Mustaches

Each type of mustache has its own reader that calls the appropriate expression or reference readers internally. For instance, the partial reader reads the current open mustache delimiter (defaults to `{{`) followed by a `>`. It then expects to find a relaxed reference, meaning it may contain dashes and slashes among other usually-forbidden characters. It may then optionally read a context expression or series of alias definitions

### Expressions

The expression readers are set arranged such that they can read valid ES expressions with the correct operator precedence by starting with ternary conditionals and trying different expression types from there. Once the expression tree has been parsed, it is flattened into an expression string and a list of references that are used within that string. If the parsing is done with `csp` (Content Security Policy) support enabled, then the expression strings are also turned into functions and attached to the output template structure so that the template can be used as-is from a script tag without `eval`ing.

### Cleanup

After all of the nodes have been parsed from the template, the template is cleaned up in a process that, among other things, merges adjacent text nodes and forms individual conditional sections out of `elseif`/`else` trees.

## Models

Ractive wraps any data given to it into a tree-like hierarchy of `Model`. Any data that is rendered into a template will be bound to a `Model`. Access to read and write data in Ractive is handled through the model hierarchy based on keypaths, which are, generally, a list of object properties that one would need to follow to reach a leaf of the data tree starting from the root. Each key along the keypath has its own corresponding model.

Models allow entities that depend upon them to register themeselves to receive change notifications when the model value changes. This is how Ractive keeps track of exactly which parts of the view need to be updated when values change.

All of the data managed by Ractive is represented by its model hierarchy.

Almost every type of Model is a subclass of `Model`, so it seems a good place to start. Each model typically has a parent model, a key that is used to access its value from its parent, and a value. Most models also have children of some sort, which are tracked by key such that `{ foo: { bar: 'baz' } }` would have a model with a `childByKey['foo']`, which would also have a model at `childByKey['bar']`. The value of each of the models listed there would be the object containing `foo: { bar: `baz` }`, its `foo` child would be the object `bar: 'baz'`, and its `bar` child would be the string `'baz'`. Where children of a model are other models, dependents (`deps`) of a model may be anything that wants to be notified of changes, and each model will typically have a number of dependents, too.

Each model has a unique keypath that is assembled by taking its key and each of its parents keys up to the root and joining them with a `.`.

Models are also inherently lazy, meaning their value is not necessarily available when the are created. A value is retrieved from a model using its `get` method which may have the side effect of computing the value. Once a value has been computed, it is generally cached until a change happens that would cause the cache to be invalidated. In most models, there isn't really an opportunity for that change outside of normal change propagation.

### RootModel

Every tree needs a root, and `RootModel` serves that purpose here. Each Ractive instance gets its own `RootModel` that is stored at its `viewmodel` property. This special model is also the storage point for computations and mappings.

### KeyModel

The last major model remaining is the `KeyModel`. Instances of this represent indices of arrays and keys of objects during iteration. The key flavor never is immutable, becuase the keys of  objects never change (they may be removed, but that doesn't change the key itself). The index flavor __does__ change, but only when the array represented by its parent model is shuffled.

### Other models

There are a few other types of `Model` in the code, such as the `RactiveModel`, which represents a Ractive instance, and the `GlobalModel`, which represents the global object of the current environment a.k.a. `window` for browsers and `global` for Node.js.

### Model operations

#### Change propagation

When a change is supplied to a model, its `set` method is called, which usually delegates to `applyValue`. `applyValue` checks to see that the value has actually changed in some way (hint: setting to the same object or array is considered a change because something may have changed further in), and if it has, it will start change notification for all of the model's children and dependents. If the model has resolvers registered with it trying to get an unresolved value, then this is where the unresolved value will be resolved and the resolver satisfied and cleared. Next, any children will be notified that their parent has had a value change and that they may need to update accordingly, which may trigger further cascades of resolution and change notification. Next, any dependents of the model will be notified that the model has had a value change as their `handleChange` methods are called. Finally, upstream models (parents) are notified that a change has taken place somewhere among its children.

The child notification of the propagation is handled by the model's `mark` method. `mark` also checks to see that the value has actually changed, and if it has, will notify its children and dependents that it has had a value change. This is also the method called when the user signals that they have changed some data externally by calling `ractive.update()`.

#### Shuffling

There is a special form of change wherein an array is modified without being swapped out, which is triggered by array methods like `splice`, `push`, and `pop`. When an array modification happens, change propagation takes a special path through the model that allows more precise DOM manipulation rather than throwing all of the DOM out and replacing it with a new result. This is achieved by having the special array method handlers compute which indexes are actually changed and having the array model's deps that can actally handle a shuffle ignore any untouched indices.

The instance method `merge` does something similar, but instead of modifying the underlying array, it compares the members of the new supplied array against the model array to compute the index changes. It the swaps in the new array and triggers a shuffle based on the computed index changes.

#### Adaptation

Between the change check and the change propagation during `applyValue`, there is a step that handles part of adaptation so that external objects with special behaviors, like backbone models, can be used as data sources. An adaptors takes the special object, wraps it up, and returns the wrapper that also has a value that represents the object for consumption by Ractive. Most adaptors also have methods to update values in their source data as well, and those methods are called when an update is applied to an adapted model.

#### Computations

A computation is exactly what is sounds like: a getter and optional setter function that are used to provide read and optional write access to some non-fixed piece of data. Each computation is stored in the root model `computations` hash by its keypath. Computations can be created in two places:

1. Explicitly when a `computed` map is passed to a Ractive instantiation or when an entry is later added to a instance's computed map. These may be read/write and have a keypath that mirrors their name.
2. Implicitly when an expression is used in a template. These are read-only and have a keypath that is an expanded representation of their expression.

A computation is also a form of model, so anything that depends on it will subscribe to it as if it were a regular model. Change propagation happens in the same way as a regular model as well.

Since computations may depend on other bits of data controlled by Ractive, while they are being retrieved, any references to other models will cause the extra references to be `capture`d. When the computation is complete, the computation will register with each of its captured dependencies so that it will be notified when it needs to invalidate and notify its dependents of the change.

#### Mappings

When a Ractive instance has children, typically components, it may supply a handles to its own data to them in the form of mappings. The child instance stores a reference to the parent model at its mapped name and uses it when its dependents request access to keypaths that start with the mapped name. This allows child instances, which may be isolated, to stay in sync with portions of their parents data easily, because the parent still controls the data (single source of truth) and there is no syncing involved. So if a parent has a component `<Component foo="{{bar.baz.bat.bippy}}" />`, then the component instance will get a mapping `foo` that references the parent model at `bar.baz.bat.bippy`.

## Virtual DOM

Every piece of DOM that Ractive can manage has a corresponding class in the virtual DOM to handle the DOM node, which generally end up being either Elements or Text Nodes. View items are grouped together as Fragments of view, which may then be owned by other fragments or items. At the root of every ractive instance is a Fragment instance that contains its entire virtual DOM tree. Each Ractive template construct has at least one analog in the virtual DOM. The bulk of Ractive's view functionality is implemented in the Section, Interpolator, and Element items, with there being a number of specialized element classes to handle special types of HTML element.

All virtual DOM items go through roughly the same lifecycle: creation, binding, rendering, bubbling, updating, unrendering, and unbinding. Creation is basically just the constructor call and almost always is immediately followed by binding. Binding is the point at which the item resolves and registers with its data references. Rendering is the point at which the item inserts an actual DOM node into the DOM. Bubbling and updating are the two halves of the update process, which is discussed in the next section. Unrendering is the point at which the item should no longer be present in the DOM, and it often occurs at the same point as unbinding, which is the point at which the item unregisters with the viewmodel and is effectively destroyed.

There a number of other members, such as events and decorators, and processes, such as change propagation, which are described in detail in the view overview.

Ractive views are structured virtual DOM trees that are assembled from template AST and manage DOM nodes on the page when they are rendered. Virtual DOM items are grouped together in `Fragment`s, which contain them, and they may also own `Fragment`s that contain other items. Each item may contain a reference to a DOM node when rendered, though every item doesn not have a DOM analog.

### Parallel DOM

Ractive works by maintaining a simplified model of the part of the DOM that it's responsible for. This model contains all the information - about data-binding, event handling and so on - that it needs to keep things up-to-date.

You can inspect the parallel DOM to understand what's going on under the hood, if you're into that sort of thing. Each Ractive instance, once rendered, has a `fragment` property. Each fragment has a number of properties:

* `contextStack` - the context stack in which mustache references should be evaluated
* `root` - a reference to the Ractive instance to which it belongs
* `owner` - the *item* that owns this fragment (in the case of the root fragment, the same as `root`)
* `items` - the items belonging to this fragment

*Items* means elements, text nodes, and mustaches. Elements may have fragments of their own (i.e. if they have children). A partial mustache will have a fragment, and a section mustache will have zero or more fragments depending on the value of its keypath.

Elements may also have attributes, which have a different kind of fragment (a *text fragment* as opposed to a *DOM fragment*), containing text and mustaches.

Each item has a `descriptor`, which is something like DNA. This comes straight from the parsed template.

This is the briefest of overviews - if you want to gain a deeper understanding of what's going on under the hood, [use the source](https://github.com/RactiveJS/Ractive/tree/master/src).

### States

Items generally follow a fixed lifecycle.

1. Construction - the item is created and knows about its parent and the template chunk from which it was created. Its template may also indicate what its children should look like if it has them.
2. `bind` - the item looks up any references is may have and registers with the model(s) that they represent. At this point, the item may create child items and bind them as well.
3. `render` - the item may create an actual DOM node and tell its children to create their DOM nodes as necessary. The resulting nodes will be inserted into the document.
4. `unrender` - thie item is no longer needed and will be removed from the document immediately or in the near future.
5. `unbind` - this typically goes along with `unrender` and tells the models on which this item depends that they should no longer send change notifications to it.

There is a sixth floating step `rebind` that happens any time one dependency models shuffles (and in certain other very special circumstances) that causes the items to re-resolve their models and re-register if necessary.

### Virtual DOM Items

#### Text

Text is the simplest item. It simply holds a string that it turns into a `TextNode` when rendered.

#### Interpolator

This is the next simplest item. It resolves a model for its reference or expression and renders the value of the model as a text node if needed. Interpolators don't necessarily render directly, as they may be used for values by other items, such as attributes, mappings, and bindings.

#### Element

An `Element` represents a DOM element. It also contains a number of other items in the form of `Attribute`s, `Decorator`s, `Transition`s, `EventDirective`s, and its children in a `Fragment`.

#### Attributes

There are actually several different items that are treated as attributes for `Element`s, event though only two of them actually may render into the DOM.

* `Attribute`s - maybe obvious, they these represent a DOM attribute on their parent element. There are a number of different handlers for updating attributes depending on the element and attribute name. The `updateDelegate` for a particular attribute can be found in `getUpdateDelegate.js`.
* `ConditionalAttribute`s - render as a string and are parsed into actual DOM attributes using a `div` or an `svg` depending on their parent element.
* `Mapping`s - when rendered add a mapping to their component, and when unrendered, remove it. These aren't attached to `Element`s, but instead, are attached to `Component`s (see below).
* `EventDirective`s - when rendered attach an event listener to their parent, and when unrenedered, remove it. Event parameters are kept in sync with their bindings and are evaluated when the event fires.
* `BindingDirective`s - when rendered and unrendered update their parent element's bindings, if they exist.
* `Decorator`s - when rendered call the named decorator with their parent element, and when unrenedered, remove it. `Decorator`s also have an update cycle related to their parameters.
* `Transition`s - are a sort of weird case. When rendered, they attach a transition handler to their element, and when the element renders or unrenders, if an appropriate transition handler is registered, will trigger the transition. Transition parameters are also kept in sync with their bindings.

#### Bindings

Certain attributes may also trigger a binding to be created on their parent element. For instance, if two-way binding is enabled on the parent element, and the parent element is an `input`, a `value` attribute with a single `Interpolator` as its content will cause a two-way binding to be created between the value of the `input` and the model of the `Interpolator`. This binding will handle updating the model when the input `value` has changed. There are a few other types of bindings for managing check values, content editables, name-bound lists of checkboxes, and other miscellaneous special values.

A `lazy` binding directive will cause any associated two-way bindings to fire either after a timeout or on blur, depending on the value of the `lazy` directive.

#### Section

`Section`s come in many flavors, depending on the chunk of template from which they are created. A section may provide context, be conditional (positive or negative), or be iterative. Generic sections (`{{#something}}...{{/}}` in template) will adjust their type, to a certain extent, based on the value of their model. A generic section will always provide context in the form of their model. An `if`-style conditional section, including `elseif`, `else`, and `unless` do not provide context. An `each` section will always provide context in the form of the current iteration. A `with` section will always provide context as its model, but it will only render if its model is considered truthy by Ractive, which is pretty much the same as JS truthy except `{}` and `[]` are falsey. A generic section will be context/conditional if it is anything other than an array, which will make it iterative.

Sections that provide context do so by binding their `Fragment`s with their model so that the reference resolution process can find the appropriate contexts when resolving.

#### Context/Conditional

Context and conditional sections will render and unrender their child fragment as their model changes truthiness. Conditional sections always stand alone, even it they have `elseif` or `else` branches nested within them, because those branches are turned into independent sections during parsing.

#### Iterative

If section is designated iterative (`{{#each ...}}`) or is a general section with an array value resolution, the section will create a special form of fragment for each index or key in the value. The special form `RepeatedFragment` handles mapping of indices, keys, and references to those to a corresponding model. Iterative sections also have special handling for shuffles so that DOM is not wholesale destroyed and recreated when the array shuffles.

Iterative sections may supply an alias for their context, so that referencing the iterated value is a little bit easier. See `Aliases` below for more info, as this is just a slightly specialized form of that.

Iterative sections may also supply key and/or index aliases so that their keys and/or indices may be referenced by a name from within their child fragments.

#### Alias

Alias sections simply resolve their models and act as a lookup endpoint for reference resolution. Aliasing happens entirely in the view.

#### Component

A component is a sort-of special form of `Element` that, instead of creating a DOM element, creates a new Ractive instance. The child instance will be rendered and unrendered in place of the component placeholder in the DOM.

Any plain `Attribute`s with a single `Interpolator` as content in a component's template are turned into `Mapping`s.

The resolution process no longer happens strictly within the vDOM, as the result of `Ractive.getContext` also uses the target `Element`'s fragment to resolve relative references. Event objects are also extended with methods from the same helper.

### Updates

The `runloop` controls when the DOM is actually updated and when transitions start in `batch`es. It also handles resolving promises when transitions have completed and the DOM is completely up to date.

As changes propagate through the viewmodel, view items are notified of the change through their `handleChange` method. Most items just set a dirty flag and notify their parent, via their `bubble` method, that they will need to be updated at the completion of the runloop turn. The root fragment of each instance affected will then register with the runloop. Once the changes are ready to be flushed to the view, each fragment registered with the runloop is called on to update, where the process happens in reverse, with each parent fragment checking to see if there is a change it needs to respond to and propagating the update downward to its children.



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

In the case of expressions and observers, we also need to consider dependants of *upstream keypaths*. For example, suppose we have a section based on a sorted array - if we modify one of the members of the array, we need to see if the sort order has changed or not as a result:

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

As well as expressions, Observers respond to both upstream and downstream changes.


### Expressions with multiple dependencies

The expression `{{ a + b }}` has two dependencies - `a` and `b` (or more accurately, whatever those references resolve to). The `_deps` graph actually includes objects representing those individual references, rather than the expression itself - the reference objects then notify the expression (if their value has changed) that it will need to re-evaluate itself.

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

Two-way binding can be disabled via the `twoway` initialization option or the `twoway` input directive.

### Ambiguous references

An ambiguous reference refers to a reference whose data does not exist at the time of construction. Ractive must make an assumption, following a resolution algorithm, on what ambiguous references resolve to. Until a suitable keypath pops into existence, ambiguous references resolve to `undefined`.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6Adg2WUTGmZAAQDkAIwD2SAJ58szHjyRF2vYNik8yCALYAHADZyEvAAbLpAHgpMNAVzI8qRLRYQBeBiGDAeAjjwwYXAPh43Dy8fZX1JJgwASkwgA"></div>

```js
Ractive({
  data: {},
  template: `
    <input value="{{ msg }}"> {{ msg }}
  `,
})
```

Ambiguous references can be locked to a specific keypath, skipping the whole resolution process, using keypath prefixes.

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

Lazy updates can be enabled via the `lazy` initialization option or the `lazy` directive.

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

Observers observe _upstream_ and _downstream_ keypaths. This allows observers to execute when data is updated indirectly, whether if it's the enclosing structure or a descendant structure.

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

Observers can be set to only execute on the specified keypath via the `strict` option for both `observe` initialization option and `ractive.observe()`.

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

Both `observe` initialization option and `ractive.observe()` accept an `old` option which allows you to define the old value passed to the observer prior to modifications.

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

Isolation can be disabled via the `isolated` initialization option.

# Event Management

Like many other libraries, Ractive implements its own [publish/subscribe](https://en.wikipedia.org/wiki/Publish–subscribe_pattern) mechanism for triggering and responding to particular events. One of the advantages of using Ractive-managed events is that events are automatically unsubscribed and unreferenced once the instance is torn down, avoiding the need to do manual housekeeping.

## Sources

### Event API

Events that are published as a result of using the event APIs directly (i.e. `ractive.fire`). Most of the other event sources use the event APIs to publish events at some point in their operation.

```js
instance.fire('someevent', 'Hello, World!')
```

### Lifecycle events

Lifecycle events are events that are published by an instance during the different phases of its existence. Ractive instances publish the following lifecycle events:

- `construct`
- `config`
- `init`
- `render`
- `complete`
- `update`
- `insert`
- `detach`
- `unrender`
- `teardown`
- `destruct`

Lifecycle event names are reserved. They should not be used as names of other events.

### DOM events

DOM events are events that are published by the DOM.

```html
<button on-click="...">
```

### Custom events

Custom events are events that are published by event plugins.

```html
<img on-tap="...">
```

### Component events

Component events are events that are published by [components](plugins.md#components).

```html
<MyModal on-close="..." />
```

## Handling

### Event API

Events published from the direct use of the event APIs are also handled by directly using the event APIs (i.e. `ractive.on`, `ractive.once`). Most of the other handling methods use the event APIs to handle events at some point in their operation.

```js
instance.on('someevent', (context, message) => {
  console.log(message)
})
```

### Lifecycle events

Lifecycle events are handled by assigning a function to the appropriate lifecycle event initialization option.

```js
Ractive({
  onrender(){
    console.log('instance has been rendered')
  }
})
```

The event APIs can also subscribe to lifecycle events. However, the handler must subscribe prior to the event publishing. Using the lifecycle event initialization options is the safer option to ensure the correct timing of subscriptions.

### Proxy syntax

Ractive instances do not immediately subscribe to template-based events (DOM events, component events, custom events). The proxy syntax "proxies" template-based events into events that the current instance can subscribe to. From there, the events are handled by event APIs. Arguments are not supported in this syntax.

```js
Ractive({
  template: `
    <button on-click="buttonclicked">Click Me!</button>
  `,
  on: {
    buttonclicked: function(context){
      console.log('button clicked')
    }
  }
})
```

### Expression syntax

A more powerful form of template-based event handling is the expression syntax, which allows the use of expressions as their values. This form acts very similar to inline scripts plus some useful additions. The expression syntax also has full, unmustached access to data and special references.

The first form is a special form of the proxy syntax. It accepts an array whose first item is the event name, and the rest are its arguments.

```js
Ractive({
  template: `
    <button on-click="['buttonclicked', 'foo', 'bar']">Click Me!</button>
  `,
  on: {
    buttonclicked: function(context, foo, bar){
      console.log('button clicked passing', foo, bar)
    }
  }
})
```

The second form uses expressions directly. This allows unrestricted access to almost anything, from calling instance methods, custom methods, or even firing a proxy event manually.

```js
Ractive({
  data: { msg: '' },
  template: `
    <button on-click="@this.set('msg', 'Hello, World!')">Set message</button>
    <button on-click="@this.greetz(msg)">Print message</button>
    <button on-click="@this.fire('manualproxy', msg)">Print message via proxy</button>
    <button on-click="@this.set('foo', 1), @this.set('bar', 2)">Cccombo!!!</button>
  `,
  greetz(message){
    console.log(`${message}`)
  },
  on: {
    manualproxy: function(context, message){
      console.log(`${message}`)
    }
  }
})
```

## Event context

Event handlers, regardless of event source, receive an `context` object as first argument. The `context` object is a special instance of a context object augmented with additional event-related properties where applicable.

- `name` - The name of the published event.
- `node` - A reference to the DOM node publishing the event. Only available on DOM events.
- `event` - A reference to the DOM event. Only available on DOM
- `original` - A reference to the DOM event. Only available on DOM
- `component` - A reference to the component that published the event. Only available on propagated events.

```js
Ractive({
  template: `
    <button on-click="buttonclicked">Click Me!</button>
  `,
  on: {
    buttonclicked: function(context){
      console.log(event.node.type) // submit
    }
  }
})
```

## Namespacing

Pattern-matching is supported on any type of event, allowing a form of event namespacing. This is done by using a keypath-like event name and using wildcards (`*`) on segments during subscription.

```js
Ractive({
  el: 'body',
  append: true,
  template: `
    <button on-click="foo.bar">Click Me!</button>
    <button on-click="foo.baz">Click Me!</button>
    <button on-click="foo.bam">Click Me!</button>
    <button on-click="qux.bar">Click Me!</button>
    <button on-click="qux.baz">Click Me!</button>
    <button on-click="qux.bam">Click Me!</button>
  `,
  on: {
    '*.bar': function(context){
      console.log('A bar event was published')
    },
    'qux.*': function(context){
      console.log('A qux event was published')
    }
  }
})
```

Be aware that handlers subscribing to just `*` will fire for _all_ events.

## Propagation

### DOM event propagation

Native DOM event propagation is preserved, allowing things such as delegation.

```js
Ractive({
  template: `
    <div on-click="buttonclicked">
      <button type="button">Click Me!</button>
    </div>
  `,
  on: {
    buttonclicked: function(context){
      console.log('button clicked')
    }
  }
})
```

### Component propagation

Propagation across component boundaries is also supported. Propagating events are namespaced using the publishing component's name as prefix. This applies to component, proxy, and even lifecycle events.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete(){
    this.fire('childevent')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: '<ChildComponent />'
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent', function(){
  console.log('Hello World!')
})
```

### Stopping propagation

Propagation can be stopped by simply returning `false` from an event handler. If the event is a DOM event, `event.stopPropagation()` and `event.preventDefault()` are automatically called.

```js
Ractive({
  template: `
    <div on-click="ancestorbuttonclick">
      <button on-click="descendantbuttonclick">Click Me!</button>
    </div>
  `,
  on: {
    ancestorbuttonclick: function(context){
      console.log('This will not run')
    },
    descendantbuttonclick: function(context){
      console.log('This will run')
      return false;
    }
  }
})
```

Returning `false` also stops propagation across components.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete: function(){
    this.fire('childevent')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: '<ChildComponent />',
  on: {
    'ChildComponent.childevent': function(){
      return false;
    }
  }
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent', function(){
  console.log('This will not run')
})
```

Assigning a handler using `on-*` will also stop propagation. However, if `on-*` is assigned a proxy event and not stopped, that proxy event will propagate in place of the stopped event.

```js
const ChildComponent = Ractive.extend({
  template: '<div></div>',
  oncomplete: function() {
    this.fire('childevent1')
    this.fire('childevent2')
    this.fire('childevent3')
    this.fire('childevent4')
  }
})

const ParentComponent = Ractive.extend({
  components: { ChildComponent },
  template: `
    <ChildComponent
      on-childevent1=""
      on-childevent2="childevent2proxy"
      on-childevent3="childevent3proxy"
      on-childevent4="@this.parentMethod()"
    />
  `,
  on: {
    childevent2proxy: function() {
      // childevent2proxy replaces childevent2
    },
    childevent3proxy: function() {
      // childevent3proxy replaces childevent3 but stopped
      return false
    }
  },
  parentMethod: function(){
    // childevent4 handled by a method
  }
})

const instance = Ractive({
  components: { ParentComponent },
  template: '<ParentComponent />'
})

instance.on('ChildComponent.childevent1', function() {
  console.log('childevent1 stopped by a blank handler')
})

instance.on('ChildComponent.childevent2', function() {
  console.log('childevent2 stopped by a proxy event')
})

instance.on('ChildComponent.childevent3', function() {
  console.log('childevent3 stopped by a proxy event')
})

instance.on('ChildComponent.childevent4', function() {
  console.log('childevent4 stopped by a method call')
})

instance.on('ParentComponent.childevent3proxy', function() {
  console.log('childevent3proxy stopped by returning false')
})

// This one gets through since its proxy event was left to propagate
instance.on('ParentComponent.childevent2proxy', function() {
  console.log('childevent2proxy fired')
})
```

# Rendering

## Synchronous rendering

Ractive does not batch renders, asynchronously render, nor render at next tick. The instance's DOM is updated immediately after its dependencies update. This is a trade-off between optimization and predictability. Ractive chose the latter route to make it easier to anticipate the state of the DOM at any given moment.

<div data-run="true" data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoQN4BjAewDssACAS0pSXOLSoF4qAlJYlGgNzQAKYAB1yVKgxgBzNCkhUA5ACNSAEwCeivGIlrUSBaPESqZAK7l5VAAw6T+XZLQBbAA7J0CgAZOJAHjV+AD5gYDNSSxQqHBx-AHogvmCnb3scAEoxMTJ6KiS2WnpGZgA6ADM6NUFFJMUs8hyKDFIENFKEUmkagCE0ctIYNEhtfP5SunI0GAAJABUAWQAZBrosEvaMORqLK1GARhsbBtyWto6umoBBcvQYEbwxvgnyKdnFlezyePiqPoGhgobGIflQbncFIcbLggA"></div>

```js
const instance = Ractive({
  target: 'body',
  data: {
    count: 0,
  },
  template: `
    <div>{{ count }}</div>
  `,
})

const div = instance.find('div')

console.log('Before:', div.innerHTML)
instance.set('count', 100)
console.log('After:', div.innerHTML)

// Before: 0
// After: 100
```

The only time rendering happens asynchronously is during animations and transitions. All mutator methods return a promise which resolves when the animations and/or transitions resulting from these operations complete.

<div data-run="true" data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoQN4BjAewDssACAS0pSXOLSoF4qAlJYlGgNzQAKYAB1yVKgxgBzNCkhUA5ACNSAEwCeivGIlrUSBaPESqZAK7l5VAAw6T+XZLQBbAA7J0CgAZOJAHjV+AD5gYDNSSxQqHBx-AHogvmCnb3scAEoxMTJ6KiS2WnpGZgA6ADM6NUFFJMUs8hyKDFIENFKEUmkagCE0ctIYNEhtfP5SunI0GAAJABUAWQAZBrosEvbGGhdUIUULK1GARhsbDNKUMDRyQUEMtmCqYwlclraOrpqOTFaBNRG8GM+BNyFNZosVmJMk1KK12p1uooAILldAwAFAkFg+bLBpieLxKh9AZDBQ2fGElFoskUimcH4IP4KE42XBAA"></div>

```js
const instance = Ractive({
  target: 'body',
  data: {
    count: 0,
  },
  template: `
    <div>{{ count }}</div>
  `,
})

const div = instance.find('div')

console.log('Before:', div.innerHTML)
instance.animate('count', 100).then(() => {
  console.log('Resolved:', div.innerHTML)
})
console.log('After:', div.innerHTML)

// Before: 0
// After: 0
//
// Resolved: 100
```

## Scoped CSS

CSS provided via the `css` initialization option is scoped to the component.

```js
const Component = Ractive.extend({
  template: `
    <span>I'm red</span>
    <div>
      <span>I'm also red</span>
    </div>
  `,
  css: `
    span { color: red }
  `
});

Ractive({
  components: { Component },
  el: 'body',
  template: `
    <Component />
    <span>I'm not red</span>
  `
})
```

This is done by generating a unique id for each component definition. That ID is then added to each selector defined in `css` and to each top-level element in the component's DOM.

```css
span[data-ractive-css~="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}"],
[data-ractive-css~="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}"] span {
  color: red
}
```

```html
<span data-ractive-css="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}">I'm red</span>
<div data-ractive-css="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}">
  <span>I'm also red</span>
</div>
<span>I'm not red</span>
```

Currently, there are a few limitations to this feature:

- ID-based scoping is not true component scoping and will affect elements of descendant components.
- `css` can only be used with components and not on direct Ractive instances. This may change in the future.

## Progressive Enhancement

TODO

## Server-side

Server-side rendering can be achieved using `ractive.toHTML()` and `ractive.toCSS()`. Both methods render the instance and its descendants at their current state to HTML and CSS, respectively.

```js
const Component1 = Ractive.extend({
  data: {
    message: '';
  },
  template: `
    <div class="component1">{{message}}</div>
  `,
  css: `
    .component1 { color: red }
  `
})

const Component2 = Ractive.extend({
  data: {
    greeting: '';
  },
  template: `
    <div class="component2">{{greeting}}</div>
  `,
  css: `
    .component2 { color: green }
  `
})

const App = Ractive.extend({
  components: {
    Component1,
    Component2
  },
  data: {
    greet: '',
    msg: ''
  },
  template: `
    <Component1 message="{{ msg }}" />
    <Component2 greeting="{{ greet }}" />
  `
})

const state = { greet: 'Good Morning!', msg: 'Hello, World!' }
const app = App({ data: state })
const html = app.toHTML()
const css = app.toCSS()
```

Currently, there are a few limitations to this feature:

- `ractive.toHTML()` prints HTML without component IDs while `ractive.toCSS()` prints out selectors with component IDs, which causes the HTML and CSS to not match up.
    - A workaround is to render the CSS as is by setting `noCssTransform` to `true` and to use a CSS naming convention (i.e BEM, OOCSS, SMACSS) to match up selectors with their elements.
- `ractive.toHTML()` does not automatically insert the document CSS when rendering a component that represents a full document. This must be done manually.

# Security

## Use of the Function constructor

Ractive uses the `Function` constructor only to convert expressions (i.e. mustache expressions, expression-style computed properties) into value-generating functions. As of 0.9, `allowExpressions` initialization option is available to toggle the expression-to-function feature. Setting it to `false` will tell Ractive neither to parse nor process expressions.

## Content Security Policy

Out of the box, Ractive will violate certain CSP directives due to the use of the `Function` constructor for evaluating expressions, and dynamically generated `<style>` elements for Ractive-managed CSS.

In order to avoid violating `script-src`, either:

- Pre-parse templates. As of 0.8, the parser will store expressions as functions on the AST. To preserve the functions when serializing the AST, use libraries like [node-tosource](https://github.com/marcello3d/node-tosource) or [serialize-javascript](https://github.com/yahoo/serialize-javascript) instead of `JSON.stringify()`.
- Set `allowExpressions` initialization option to `false`. This will tell Ractive to avoid evaluating expressions.
- Add the `script-src 'unsafe-eval'` CSP directive. This will allow the use of the `Function` constructor.

In order to avoid violating `style-src`, either:

- Add `style-src 'unsafe-inline'` to your CSP directives. This will allow the use of dynamically generated `<style>` elements.

# Templates

Strictly speaking, Ractive templates are not HTML. They are markup representations of objects that are used to construct HTML. Simply put, templates are _HTML-like_. Ractive parses templates into [AST](http://en.wikipedia.org/wiki/Abstract_syntax_tree)s which contain everything Ractive needs to know to construct an instance's DOM, data bindings, events and transitions etc.

```js
Ractive.parse('<div class="message">Hello World!</div>')

// {"v":4,"t":[{"t":7,"e":"div","m":[{"n":"class","f":"message","t":13}],"f":["Hello World!"]}]}
```

## Keypaths

A keypath is a kind of reference that represents the location of a piece of data.

```js
Ractive({
  data: {
    foo: {
      bar: {
        baz: {
          qux: 'Hello, World!'
        }
      }
    }
  },
  template: `
    {{ foo.bar.baz.qux }}
  `
})
```

### Dot and bracket notations

Dot and bracket notation rules for keypaths are similar to vanilla JS. The only addition to this is that the dot notation can also be used to access arrays, by using the index directly on the segment.

```js
const instance = Ractive({
  data: {
    items: [1, 2, 3],
    foo: {
      bar: {
        baz: {
          qux: 'Hello, World!',
          'dotted.key': 'Me, Hungry!'
        }
      }
    },
    dynamicKey: 'bar'
  },
  template: `
    {{ foo['bar']['baz']['qux'] }} <!-- bracket notation object access -->
    {{ foo.bar.baz.qux }}          <!-- dot notation object access -->

    {{ items[0] }} <!-- bracket notation array access -->
    {{ items.0 }}  <!-- dot notation array access -->

    {{ foo.bar.baz['dotted.key'] }} <!-- dotted key access -->

    {{ foo[dynamicKey].baz.qux }} <!-- dynamic key access -->
  `
})
```

### Missing properties

In JavaScript, trying to access a child property of an object that does not exist would throw an error. In Ractive, it would simply return `undefined` or render nothing.

```js
const instance = Ractive({
  data: {
    numbers: [ 1, 2, 3 ]
  },
  template: `
    {{ letters[0] }}
  `
})

ractive.get( 'letters[0]' ) // undefined
```

### Upstream and downstream keypaths

Ractive has this concept of "upstream" and "downstream" keypaths. Upstream keypaths are ancestor keypaths. For the keypath `foo.bar.baz.qux`, it's upstream keypaths are `foo`, `foo.bar` and `foo.bar.baz`. Downstream keypaths are descendant keypaths. For the `foo` keypath, it's downstream keypaths would be `foo.bar`, `foo.bar.baz` and `foo.bar.baz.qux`.

## References

A reference is a string that refers to a piece of data. A keypath is an example of a reference, one that points to a specific location in the data. Special references are also a form of reference, one that provides to a certain value.

### Reference resolution

Ractive follows the following resolution algorithm to find the value of a reference:

1. If the reference a special reference, resolve with that keypath.
2. If the reference is explicit or matches a path in the current context exactly, resolve with that keypath.
3. Grab the current virtual node from the template hierarchy.
4. If the reference matches an alias, section indexes, or keys, resolve with that keypath.
5. If the reference matches any mappings, resolve with that keypath.
6. If the reference matches a path on the context, resolve with that keypath.
7. Remove the innermost context from the stack. Repeat steps 3-7.
8. If the reference is a valid keypath by itself, resolve with that keypath.
9. If the reference is still unresolved, add it to the 'pending resolution' pile. Each time potentially matching keypaths are updated, resolution will be attempted for the unresolved reference.

### Context stack

Whenever Ractive encounters section mustaches or similar constructs, it stores the context in a *context stack*. Ractive then resolves references relative to the top of the stack, and popping off contexts until the reference resolves to a keypath.

```js
Ractive({
  data: {
    qux: 'Me, Hungry!',
    foo: {
      bar: {
        baz: 'Hello, World!'
      }
    }
  },
  template: `
                <!-- context is the root of the data -->
    {{#foo}}    <!-- context is now foo -->
      {{#bar}}  <!-- context is now foo.bar -->
        {{baz}} <!-- Resolution order: foo.bar.baz, foo.baz, baz. Resolved at foo.bar.baz. -->
        {{qux}} <!-- Resolution order: foo.bar.quz, foo.qux, qux. Resolved at qux. -->
      {{/}}
    {{/}}
  `,
})
```

## Conditional attributes

Sections can toggle attributes, whether it's one attribute, multiple attributes or specific values of the attribute.

```html
<!-- one attribute -->
<a href="/" {{#if currentPage}}class="active"{{/if}}>Home</a>

<!-- multiple attributes -->
<a href="/" {{#if currentPage}}class="active" title="Current page"{{/if}}>Home</a>

<!-- specific attribute value -->
<a href="/" class="nav-link {{#if currentPage}}nav-link--active{{/if}}">Home</a>
```

## Optimization

### Pre-parsing

Parsing templates can be a very slow operation. As an optimization option, templates can be pre-parsed outside of runtime, speeding up app initialization. Most loaders do pre-parsing of templates as part of their build process. A parsed template is approximately 30-40% larger than the markup version, making it a trade-off between space and processing.

### Limiting template expressions

While expressions provide power and convenience when building templates, it incurs a performance penalty as Ractive sets up each one on a per-instance level. To avoid this overhead, there are several places where logic can move to, trimming down expressions into mere function calls.

Functions can be set on the data globally via `Ractive.defaults.data`.

```js
Ractive.defaults.data.customLogic = function(){ ... }

Ractive({
  template: `
    {{ customLogic() }}
  `
})
```

Functions can also be defined on a component level using methods.

```js
const Component = Ractive.extend({
  template: `
    {{ @this.customLogic() }}
  `,
  customLogic(){
    ...
  }
})
```

### Expression processing

When Ractive parses a template, it creates a string representation of the expression structure and keeps track of its dependencies. Then Ractive converts these expression strings into a function which can be called to generate the expression's value.

Ractive optimizes this routine starting by generating the same expression string for structurally-identical expressions. Then a value-generating function is created for each _distinct_ expression string, cached globally and shared to all instances. Furthermore, Ractive caches the generated values and only updates them when the expression's dependencies update.

```js
// Expression parsing
Ractive.parse('{{ a + b }}{{ c + d }}');

// {
//   "v": 4,
//   "t": [
//     {
//       "t": 2,
//       "x": {
//         "r": ["a","b"], <-- dependencies here
//         "s": "_0+_1"    <-- expression string here
//       }
//     },
//     {
//       "t": 2,
//       "x": {
//         "r": ["c","d"], <-- dependencies here
//         "s": "_0+_1"    <-- expression string here
//       }
//     }
//   ],
//   "e": {}
// }

// Building and caching of the expression resolver of `_0+_1`
const expressionFunctionsCache = {};
expressionFunctionsCache['_0+_1'] = new Function('_0', '_1', 'return _0+_1');

// Evaluate {{ a + b }}
const dep = ['a', 'b'];
const exp = '_0+_1'
const arg = dep.map(instance.get);
const val = expressionFunctionsCache[exp].apply(instance, arg);

// Evaluate {{ c + d }}
const dep = ['c', 'd'];
const exp = '_0+_1'
const arg = dep.map(instance.get);
const val = expressionFunctionsCache[exp].apply(instance, arg);
```

The `Function` constructor was chosen over `eval` because it allows Ractive to compile the expression string _once_ as well as _cache_ the resulting function, instead of evaluating the string every time the value is needed.
















