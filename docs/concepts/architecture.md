# Ractive General Overview

There are three major sections in the Ractive source code: The parser which handles template parsing, the models which handle data management and the views which handle the virtual DOM. This document aims to give a breakdown of just what exactly each of these sections do.

## Parser

Ractive's parser is reponsible for taking in Mustache-like/Handlebar-like templates. Unlike Mustache and Handlebars, however, it turns them into an _AST_ for use by the runtime. In addition, it also supports a fair amount of ES syntax for use in expressions.

Each item expressable in Ractive-flavored mustache has its own parsing function that may also be comprised of other parsing functions. Each bit of ES syntax that Ractive understands for expressions also has its own parsing function. The parser starts at the beginning of the template string and starts applying each parsing function in precedence order. Each function will then consume as much of the template as needed to return an item, like an element, a section, a partial, a bit of text, or an interpolator. It may also return nothing. Most items can also contain children, including items of the same type as themselves, and will thus recurse by trying to parse their content.

## Mustaches

Each type of mustache has its own reader that calls the appropriate expression or reference readers internally. For instance, the partial reader reads the current open mustache delimiter (defaults to `{{`) followed by a `>`. It then expects to find a relaxed reference, meaning it may contain dashes and slashes among other usually-forbidden characters. It may then optionally read a context expression or series of alias definitions

## Expressions

The expression readers are set arranged such that they can read valid ES expressions with the correct operator precedence by starting with ternary conditionals and trying different expression types from there. Once the expression tree has been parsed, it is flattened into an expression string and a list of references that are used within that string. If the parsing is done with `csp` (Content Security Policy) support enabled, then the expression strings are also turned into functions and attached to the output template structure so that the template can be used as-is from a script tag without `eval`ing.

## Cleanup

After all of the nodes have been parsed from the template, the template is cleaned up in a process that, among other things, merges adjacent text nodes and forms individual conditional sections out of `elseif`/`else` trees.

# Models

Ractive wraps any data given to it into a tree-like hierarchy of `Model`. Any data that is rendered into a template will be bound to a `Model`. Access to read and write data in Ractive is handled through the model hierarchy based on keypaths, which are, generally, a list of object properties that one would need to follow to reach a leaf of the data tree starting from the root. Each key along the keypath has its own corresponding model.

Models allow entities that depend upon them to register themeselves to receive change notifications when the model value changes. This is how Ractive keeps track of exactly which parts of the view need to be updated when values change.

All of the data managed by Ractive is represented by its model hierarchy.

Almost every type of Model is a subclass of `Model`, so it seems a good place to start. Each model typically has a parent model, a key that is used to access its value from its parent, and a value. Most models also have children of some sort, which are tracked by key such that `{ foo: { bar: 'baz' } }` would have a model with a `childByKey['foo']`, which would also have a model at `childByKey['bar']`. The value of each of the models listed there would be the object containing `foo: { bar: `baz` }`, its `foo` child would be the object `bar: 'baz'`, and its `bar` child would be the string `'baz'`. Where children of a model are other models, dependents (`deps`) of a model may be anything that wants to be notified of changes, and each model will typically have a number of dependents, too.

Each model has a unique keypath that is assembled by taking its key and each of its parents keys up to the root and joining them with a `.`.

Models are also inherently lazy, meaning their value is not necessarily available when the are created. A value is retrieved from a model using its `get` method which may have the side effect of computing the value. Once a value has been computed, it is generally cached until a change happens that would cause the cache to be invalidated. In most models, there isn't really an opportunity for that change outside of normal change propagation.



## RootModel

Every tree needs a root, and `RootModel` serves that purpose here. Each Ractive instance gets its own `RootModel` that is stored at its `viewmodel` property. This special model is also the storage point for computations and mappings.


## KeyModel

The last major model remaining is the `KeyModel`. Instances of this represent indices of arrays and keys of objects during iteration. The key flavor never is immutable, becuase the keys of  objects never change (they may be removed, but that doesn't change the key itself). The index flavor __does__ change, but only when the array represented by its parent model is shuffled.


## Other models

There are a few other types of `Model` in the code, such as the `RactiveModel`, which represents a Ractive instance, and the `GlobalModel`, which represents the global object of the current environment a.k.a. `window` for browsers and `global` for Node.js.


## Model operations


### Change propagation

When a change is supplied to a model, its `set` method is called, which usually delegates to `applyValue`. `applyValue` checks to see that the value has actually changed in some way (hint: setting to the same object or array is considered a change because something may have changed further in), and if it has, it will start change notification for all of the model's children and dependents. If the model has resolvers registered with it trying to get an unresolved value, then this is where the unresolved value will be resolved and the resolver satisfied and cleared. Next, any children will be notified that their parent has had a value change and that they may need to update accordingly, which may trigger further cascades of resolution and change notification. Next, any dependents of the model will be notified that the model has had a value change as their `handleChange` methods are called. Finally, upstream models (parents) are notified that a change has taken place somewhere among its children.

The child notification of the propagation is handled by the model's `mark` method. `mark` also checks to see that the value has actually changed, and if it has, will notify its children and dependents that it has had a value change. This is also the method called when the user signals that they have changed some data externally by calling `ractive.update()`.

### Shuffling

There is a special form of change wherein an array is modified without being swapped out, which is triggered by array methods like `splice`, `push`, and `pop`. When an array modification happens, change propagation takes a special path through the model that allows more precise DOM manipulation rather than throwing all of the DOM out and replacing it with a new result. This is achieved by having the special array method handlers compute which indexes are actually changed and having the array model's deps that can actally handle a shuffle ignore any untouched indices.

The instance method `merge` does something similar, but instead of modifying the underlying array, it compares the members of the new supplied array against the model array to compute the index changes. It the swaps in the new array and triggers a shuffle based on the computed index changes.

### Adaptation

Between the change check and the change propagation during `applyValue`, there is a step that handles part of adaptation so that external objects with special behaviors, like backbone models, can be used as data sources. An adaptors takes the special object, wraps it up, and returns the wrapper that also has a value that represents the object for consumption by Ractive. Most adaptors also have methods to update values in their source data as well, and those methods are called when an update is applied to an adapted model.

### Computations

A computation is exactly what is sounds like: a getter and optional setter function that are used to provide read and optional write access to some non-fixed piece of data. Each computation is stored in the root model `computations` hash by its keypath. Computations can be created in two places:

1. Explicitly when a `computed` map is passed to a Ractive instantiation or when an entry is later added to a instance's computed map. These may be read/write and have a keypath that mirrors their name.
2. Implicitly when an expression is used in a template. These are read-only and have a keypath that is an expanded representation of their expression.

A computation is also a form of model, so anything that depends on it will subscribe to it as if it were a regular model. Change propagation happens in the same way as a regular model as well.

Since computations may depend on other bits of data controlled by Ractive, while they are being retrieved, any references to other models will cause the extra references to be `capture`d. When the computation is complete, the computation will register with each of its captured dependencies so that it will be notified when it needs to invalidate and notify its dependents of the change.

### Mappings

When a Ractive instance has children, typically components, it may supply a handles to its own data to them in the form of mappings. The child instance stores a reference to the parent model at its mapped name and uses it when its dependents request access to keypaths that start with the mapped name. This allows child instances, which may be isolated, to stay in sync with portions of their parents data easily, because the parent still controls the data (single source of truth) and there is no syncing involved. So if a parent has a component `<Component foo="{{bar.baz.bat.bippy}}" />`, then the component instance will get a mapping `foo` that references the parent model at `bar.baz.bat.bippy`.

# Virtual DOM

Every piece of DOM that Ractive can manage has a corresponding class in the virtual DOM to handle the DOM node, which generally end up being either Elements or Text Nodes. View items are grouped together as Fragments of view, which may then be owned by other fragments or items. At the root of every ractive instance is a Fragment instance that contains its entire virtual DOM tree. Each Ractive template construct has at least one analog in the virtual DOM. The bulk of Ractive's view functionality is implemented in the Section, Interpolator, and Element items, with there being a number of specialized element classes to handle special types of HTML element.

All virtual DOM items go through roughly the same lifecycle: creation, binding, rendering, bubbling, updating, unrendering, and unbinding. Creation is basically just the constructor call and almost always is immediately followed by binding. Binding is the point at which the item resolves and registers with its data references. Rendering is the point at which the item inserts an actual DOM node into the DOM. Bubbling and updating are the two halves of the update process, which is discussed in the next section. Unrendering is the point at which the item should no longer be present in the DOM, and it often occurs at the same point as unbinding, which is the point at which the item unregisters with the viewmodel and is effectively destroyed.

There a number of other members, such as events and decorators, and processes, such as change propagation, which are described in detail in the [view overview](view.md).

Ractive views are structured virtual DOM trees that are assembled from template AST and manage DOM nodes on the page when they are rendered. Virtual DOM items are grouped together in `Fragment`s, which contain them, and they may also own `Fragment`s that contain other items. Each item may contain a reference to a DOM node when rendered, though every item doesn not have a DOM analog.

## States

Items generally follow a fixed lifecycle.

1. Construction - the item is created and knows about its parent and the template chunk from which it was created. Its template may also indicate what its children should look like if it has them.
2. `bind` - the item looks up any references is may have and registers with the model(s) that they represent. At this point, the item may create child items and bind them as well.
3. `render` - the item may create an actual DOM node and tell its children to create their DOM nodes as necessary. The resulting nodes will be inserted into the document.
4. `unrender` - thie item is no longer needed and will be removed from the document immediately or in the near future.
5. `unbind` - this typically goes along with `unrender` and tells the models on which this item depends that they should no longer send change notifications to it.

There is a sixth floating step `rebind` that happens any time one dependency models shuffles (and in certain other very special circumstances) that causes the items to re-resolve their models and re-register if necessary.

## Virtual DOM Items

### Text

Text is the simplest item. It simply holds a string that it turns into a `TextNode` when rendered.

### Interpolator

This is the next simplest item. It resolves a model for its reference or expression and renders the value of the model as a text node if needed. Interpolators don't necessarily render directly, as they may be used for values by other items, such as attributes, mappings, and bindings.

### Element

An `Element` represents a DOM element. It also contains a number of other items in the form of `Attribute`s, `Decorator`s, `Transition`s, `EventDirective`s, and its children in a `Fragment`.

### Attributes

There are actually several different items that are treated as attributes for `Element`s, event though only two of them actually may render into the DOM.

* `Attribute`s - maybe obvious, they these represent a DOM attribute on their parent element. There are a number of different handlers for updating attributes depending on the element and attribute name. The `updateDelegate` for a particular attribute can be found in `getUpdateDelegate.js`.
* `ConditionalAttribute`s - render as a string and are parsed into actual DOM attributes using a `div` or an `svg` depending on their parent element.
* `Mapping`s - when rendered add a mapping to their component, and when unrendered, remove it. These aren't attached to `Element`s, but instead, are attached to `Component`s (see below).
* `EventDirective`s - when rendered attach an event listener to their parent, and when unrenedered, remove it. Event parameters are kept in sync with their bindings and are evaluated when the event fires.
* `BindingDirective`s - when rendered and unrendered update their parent element's bindings, if they exist.
* `Decorator`s - when rendered call the named decorator with their parent element, and when unrenedered, remove it. `Decorator`s also have an update cycle related to their parameters.
* `Transition`s - are a sort of weird case. When rendered, they attach a transition handler to their element, and when the element renders or unrenders, if an appropriate transition handler is registered, will trigger the transition. Transition parameters are also kept in sync with their bindings.

### Bindings

Certain attributes may also trigger a binding to be created on their parent element. For instance, if two-way binding is enabled on the parent element, and the parent element is an `input`, a `value` attribute with a single `Interpolator` as its content will cause a two-way binding to be created between the value of the `input` and the model of the `Interpolator`. This binding will handle updating the model when the input `value` has changed. There are a few other types of bindings for managing check values, content editables, name-bound lists of checkboxes, and other miscellaneous special values.

A `lazy` binding directive will cause any associated two-way bindings to fire either after a timeout or on blur, depending on the value of the `lazy` directive.

### Section

`Section`s come in many flavors, depending on the chunk of template from which they are created. A section may provide context, be conditional (positive or negative), or be iterative. Generic sections (`{{#something}}...{{/}}` in template) will adjust their type, to a certain extent, based on the value of their model. A generic section will always provide context in the form of their model. An `if`-style conditional section, including `elseif`, `else`, and `unless` do not provide context. An `each` section will always provide context in the form of the current iteration. A `with` section will always provide context as its model, but it will only render if its model is considered truthy by Ractive, which is pretty much the same as JS truthy except `{}` and `[]` are falsey. A generic section will be context/conditional if it is anything other than an array, which will make it iterative.

Sections that provide context do so by binding their `Fragment`s with their model so that the reference resolution process can find the appropriate contexts when resolving.

### Context/Conditional

Context and conditional sections will render and unrender their child fragment as their model changes truthiness. Conditional sections always stand alone, even it they have `elseif` or `else` branches nested within them, because those branches are turned into independent sections during parsing.

### Iterative

If section is designated iterative (`{{#each ...}}`) or is a general section with an array value resolution, the section will create a special form of fragment for each index or key in the value. The special form `RepeatedFragment` handles mapping of indices, keys, and references to those to a corresponding model. Iterative sections also have special handling for shuffles so that DOM is not wholesale destroyed and recreated when the array shuffles.

Iterative sections may supply an alias for their context, so that referencing the iterated value is a little bit easier. See `Aliases` below for more info, as this is just a slightly specialized form of that.

Iterative sections may also supply key and/or index aliases so that their keys and/or indices may be referenced by a name from within their child fragments.

### Alias

Alias sections simply resolve their models and act as a lookup endpoint for reference resolution. Aliasing happens entirely in the view.

### Component

A component is a sort-of special form of `Element` that, instead of creating a DOM element, creates a new Ractive instance. The child instance will be rendered and unrendered in place of the component placeholder in the DOM.

Any plain `Attribute`s with a single `Interpolator` as content in a component's template are turned into `Mapping`s.

## Resolution

The resolution process for references requires a keypath and a `Fragment` as a starting point.

1. If the reference is a special reference (`@index`, `@this`, etc), the appropriate model is looked up and returned.
2. If the reference is relative (starts with `~/`, `.`, or `../`) the appropriate base model is retrieved and the rest of the keypath is joined onto it and the resulting model is returned.
3. If the reference is non-relative and the base of the keypath is a member of the current context, then the context is joined to the keypath and the resulting model is returned.
4. The reference is ambiguous, so the following loop until resolution or no fragments are left, starting with the given fragment:
  1. If the fragment is an iteration, check to see if there is an index or key alias that matches the root of the reference, and if so, return it.
  2. If the fragment has aliases, check to see if there is one that matches the root of the reference, and if so, return it.
  3. If the fragment has context:
    1. If the fragment is the root of an instance, note it
    2. If the context has a child matching the root of the reference:
      * If we crossed a component boundary, create an implicit mapping the to the newly discovered model in the current component.
      * Return it
  4. If the fragment belongs to a component, use the component's parent fragment and loop.
  5. Use the fragment's parent and loop.

The resolution process is no longer happens strictly the vDOM, as the result of `Ractive.getNodeInfo` also uses the target `Element`'s fragment to resolve relative references. Event objects are also extended with methods from the same helper.

## Updates

The `runloop` controls when the DOM is actually updated and when transitions start in `batch`es. It also handles resolving promises when transitions have completed and the DOM is completely up to date.

As changes propagate through the viewmodel, view items are notified of the change through their `handleChange` method. Most items just set a dirty flag and notify their parent, via their `bubble` method, that they will need to be updated at the completion of the runloop turn. The root fragment of each instance affected will then register with the runloop. Once the changes are ready to be flushed to the view, each fragment registered with the runloop is called on to update, where the process happens in reverse, with each parent fragment checking to see if there is a change it needs to respond to and propagating the update downward to its children.












