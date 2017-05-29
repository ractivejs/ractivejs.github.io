# Migrating from previous versions

These are notes to help you migrate from an older version of Ractive.js to a newer one, mostly centered on breaking changes between versions. If you'd like to find out more about new features, you can check out the [changelog](https://github.com/ractivejs/ractive/blob/dev/CHANGELOG.md).

## 0.8 to 0.9

### Removed deprecations

0.9 removes any of the remaining deprecations from 0.8, including:

* `decorator="name:{{arg1}},{{arg2}}` directives, to be replaced with `as-name="arg1, arg2"`
* `intro="name:{{ { arg1: arg1, arg2, arg2 } }}"` and the same forms of `outro` and `intro-outro` to be replaced with `name-in="{ arg1, arg2 }"` and the same forms of `name-out` and `name-in-out`
* The `ractive.data` getter, to be replaced with `ractive.get()`, which returns a computed object tree containing virtual keys like mappings, links, and computations. The optional form `ractive.get({ virtual: false })` will return the raw root object without any virtual keys.
* Lifecycle methods `init` and `beforeInit`, to be replaced with lifecycle events or equivalent instance methods. `beforeInit` corresponds to the `construct` lifecycle event.
* Partial comments in the form of `<!-- {{>myPartial}} -->...<!-- {{/myPartial}} -->`, to be replaced with partial blocks `{{#partial myPartial}}...{{/partial}}`

Part of removing directive deprecations allowed using the plain expression parser for attributes and directives, which means that directives that parse in an expression context are much more resilient to things like quote pileup with strings e.g. `as-target=""id as a string""`.

__Note__: this also means that directive values aren't processed as HTML before being parsed, so HTML entities are no longer automatically encoded within directive values.

### Template format

The template format produced by `Ractive.parse` has changed, making it incompatible with previous versions of Ractive.js and their template formats. You will need to re-parse any pre-parsed templates for use with 0.9.

### Partial context

Any context provided to a partial `{{>my-partial context}}` is no longer wrapped around the partial but is instead wrapped around the _content_ of the partial. It's a subtle difference that only shows up when the partial name is an expression e.g. `{{>.type ~/external.item}}`. Before this break, the `.type` would resolve to `~/external.item.type`, and now it will resolve to `.type` on the context in which the partial appears.

### Yielding

Yielding is no longer restricted to inline partials, and each partial may be yielded more than once. You will no longer get a warning if you try to yield an instance or dynamic partial or if you yield the same partial multiple times.

### `noIntro` inheritance

The `noIntro` setting of an instance that contains components will now apply to the components too, unless those components have their own `noIntro` setting.

### Polyfills

There is no longer a `legacy` build of Ractive.js available. Instead, a separate `polyfills` library is available that can be included before Ractive.js is loaded, or you can supply your own polyfills, shims, or shams.

### Node registry

Elements with an `id` attribute are no longer collected into a `nodes` map on the Ractive.js instance. If you require similar functionality, it can be achieved in a much more flexible way with a decorator.

### Unresolved references

References that don't resolve are no longer kept in an unresolved state, waiting on an appropriate keypath to pop into existence somewhere in the context hierarchy. Instead, references that don't resolve are immediately resolved in the current context, which tends to be the desired behavior in most circumstances.

### Live queries

Element and component queries no longer support automatically keeping the resulting array up to date as new matching elements or components are rendered. If you require similar functionality, it can be achieved with a decorator for elements or bubbled lifecycle events for components.

### `change` event

The `change` event has been removed and replaced by recursive observers, which are strictly opt-in and can be scoped to a deeper keypath than the root.

### `event` reference

The `event` special reference available to event directives has been deprecated and replaced with three special references:

* `@context`, which is roughly equivalent to `event`, but with both an `event` and `original` key that point to the original event object. This is a [context object](/api/context.md).
* `@event`, which is resolves to the original event that triggered the directive.
* `@node`, which resolves to the element to which the event directive is attached.

### `ractive.merge`

`ractive.merge` has been removed and replaced by an option on `ractive.set`, `{ shuffle: true }`, which more accurately reflects what actually happens. `merge` did not merge data, but instead re-arranged any DOM associated with the elements in the given array to match the order of the array - hence `shuffle` rather than `merge`.

### Isolation

Components are now `isolated` by default. If you need non-`isolated` components in order to create implicit mappings as data is accessed, you can pass `isolated: false` to `extend` when creating the component. If you prefer all components to be non-`isolated` by default, you can set `Ractive.defaults.isolated = false`.

Further, non-`isolated` components will now create implicit mappings when necessary for `set` operations, including `add`, `subtract`, etc, in addition to `get` operations. To avoid creating an implicit mapping with a `set` operation from a non-`isolated` component, pass `{ isolated: true }` as an option to the `set` method.

### Magic and array adaptors

The magic and array adaptors are no longer part of Ractive.js core. They may be reappear as independent plugins at some point in the future.

### `class-` directives

`class-` directives are now parsed in an expression context like decorator, transition, and event directives, rather than in a string context like attributes and `style-` directives. This means that mustaches are no longer required for `class-` directive values, so you should use `class-selected=".selected"` rather than `class-selected="{{.selected}}"`.

### `getNodeInfo`

`ractive.getNodeInfo` has been renamed to `ractive.getContext`, as has the static version of the function, to more accurately reflect its function. The `getNodeInfo` alias is deprecated and will be removed in a future version.

### Multiple inheritance

Components can no longer inherit from multiple other components at the same level, meaning that `Ractive.extend(FirstComponent, SecondComponent)` is no longer possible. You can still set up an inheritance hierachy multiple levels deep with `Ractive.extend(FirstComponent).extend(SecondComponent)`.

## 0.7 to 0.8

### Template format

The template format produced by `Ractive.parse` has changed, making it incompatible with previous versions of Ractive.js and their template formats. You will need to re-parse any pre-parsed templates for use with 0.8.

### IE8

IE8 is no longer supported. If you still need to support IE8, well, we're very, very sorry...

### Expressions and binding

Two-way bindings are no longer supported in computed contexts that don't have a `set`ter, including template expression contexts. This means that `{{#each filter(list)}}<input value="{{.name}}" />{{/each}}` is no longer possible. The reasoning behind this change is that the original `list.${index}.name` is not updated when the binding within the computed context in the `each` expression is changed. 0.9 adds an instance flag `syncComputedChildren` that can address this.

### Relaxed partial names

Partial names can now include `\` characters, which can be problematic if you happen to use division with no spaces arount the `/` in a partial expression.

### Integer references

Integers are no longer considered references, even in an array context, meaning that in `{{#with [1, 2, 3]}}{{0}}{{/with}}` will no longer result in `1` being rendered. Integers are now stricly considered to integer literals. If you need to reference a specific index in an array context, you can do so with a context specific reference like `{{this.0}}`.

### Array modification

`modifyArrays` now defaults to `false`, so the array adaptor is not applied to arrays automatically as they are added to the instance data. The preferred method of performing array operations is using the `splice`, `push`, `pop`, etc methods on the Ractive.js instance.
