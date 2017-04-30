# References and Context

Just about everything you can do with Ractive revolves around data, and each bit of data is accessible by a keypath. Each particular instance of a keypath in a template is called a reference, because it references the data that lives at that keypath. A keypath in Ractive is simply a `.` delimited set of keys that looks something like `foo.bar.baz`, which when placed in a template mustache would be a reference to the value at the `baz` key on the object at the `bar` key on the object at the `foo` key on the data object passed to Ractive. The base key in that keypath is `foo`.

Keypaths in Ractive need not be absolute, and there are a few conveniences built in to make accessing data easier. Before we get into that though, it's important to understand the concepts of context in a Ractive template and how that can affect your references.

## Context

A context in Ractive is simply the bit of data at the current place in the template. There are five ways to introduce a new context in a Ractive template:

1. The root context is the default context at which all templates start.
2. An iterative mustache will introduce a new context for each iteration.
3. A `with` mustache will introduce a new context with whatever is passed to it.
  * There's a special case of `with` that covers passing a context to a partial.
4. A plain block mustache will introduce a new context because it acts like either a conditional `with` or an iterative block, depending on the what is passed to it.
5. Every component introduces its own root context.

Contexts tend to build linearly through a template, meaning that the first context in a template may be `blog`, and nested within the block that created that context may be another `posts`, making the full keypath for the inner context `blog.posts`. If `blog.posts` is an array that is passed to an iterative block, the body of the first iteration would have a context of `blog.posts.0`, the second `blog.posts.1`, and so on. Note though, that context is _not required_ to build linearly like that; it's just very common because it builds naturally alongside the data structure.

If this section is a little confusing, don't worry too much about it because all of these concepts are closely related and tend to make sense more as a whole than individual parts.

## Specificity and Ambiguity

A reference is ambiguous if it does not exist in the current context. Ractive will resolve ambiguous references by looking at each context up the stack from the current point in the template to the root. If no data matching the base key and no matching alias is found, then the current context will be used as the starting point for the reference. That means that with a context of `blog.posts.0`, referencing `author.name` that doesn't exist anywhere in the context hierarchy will end up with a resolved keypath of `blog.posts.0.author.name`. References only resolve once as the template is being rendered, which means that if data appears after a conditional has rendered and the conditional later unrenders and re-renders, then the new, more specific data will be resolved in the newly rendered conditional.

```handlebars
{{#with blog.posts.0}}
  Author: {{author.name}}
{{/with}}
```
<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdc5XAE9JCOngQAPXJzAN+SADYIARk2H1KNergQBbSboaX2A2rmDAAxAHdiuMOQO6AexQAOkkA4VxhYIAGDAwnGXIAQQBXHwCYSHJXBjSwDOD+BisEOITXTi8fMv4uMQlpNhAcYXhSJnIGSUlyanJ+BA9yACUGUVwyBAAKYFoYAXJZJhYsgHI3XGWEXFWsOYXZa1t7BDWNo7tLXf3+RaR7BizZ+dvFv0CUJ5u3t7CI4SyAG1shhyABdb5veIvRbQgQYACUAG4bjdhNsACrEEoBNJTABmKX442IAX4UwR2UhXUkwXRuCmq38QVC4UiMWCuXSMEKxQQu3IqwAUgEwLcAIrBEYIYQBXSkBAwVbIm7YcgARmiWuRmCAA"></div>
```js
var app = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    blog: {
      posts: [ {} ]
    }
  }
});

setTimeout(function() {
  app.set('blog.posts.0.author.name', 'John Q. Resolver');
}, 1000);
```

Ambiguity in Ractive is generally discouraged, since it can lead to weird scenarios like that described above in the unrendering/re-rendering of a conditional section. It's also not as fast to search up the context hierarchy as it is to simply start with the current context, which is usually what you want anyway. To that end, there is a special reference `this`, that refers to the current context at the current point in the template. `this` is meant to mirror the JavaScript keyword of the same name and similar concept. There's also a shorthand for `this`, `.` e.g. `{{this}} is the same as {{.}}` and `{{this.name}} is the same as {{.name}}`. Ambiguity does have its purposes, but generally, if you can, you should use specific references.

```handlebars
{{#if show}}
  {{#with blog}}
    {{#with posts.0}}
      <h2>Ambiguity may be good or bad, depending on what you're trying to do.</h2>
      <p>{{.name}}</p>
      <p>{{name}}</p>
    {{/with}}
  {{/with}}
{{/if}}
```
<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdc5XAE9JCOngQAPXJzAN+SADYIARk2H1KNergQBbSboaX2A2rmDAAxMQBm5YWAD2AO4YGE4y5K5uAcS4YOQGun4owaHkqeHuUTHkkn7CuMIAdAAMyYJhaeQEYABMbACCVgbEKACu0XLkVgwdBgjkKH5+SOR+MHEMSFjkSAiKOsT8KCP85AFaMnJ+LQDkMH24MHILS7h+034FXDV8ZRWpBJJsrgX8DFYIwVyPKXcPT8Cvd6fTjfW5pVycTJgUrOVIQqEwlzATheUpcMQSaRsEA4YTwUhMcgMSSScjUcj8BABcgAJQYolwZAQAApgLQYAJUrgmCxIORtm5ucwELhtlh2ZzZNZbPYEHyBZYbHZLGKJStpvYGHy2Rz1al4oltWq7tlcvk+QBtcIYcgAXXFupNgLl-IAsgxYgAhBIobbGtLYf2pXyBPkHFoIf0hXUYACUAG41WrhCKACrEd5bXDMzwtfgM4h+fjM2Phf3EyQFFPZ7YGlAFHJ5QpFF5vBBi-kASSJVnInkGBSMMEHDAAXtsE-7-dX05mWtnc-nGUWS2XdbCiSSCqcUCh9MztiGAhPE+uwhXt4k9yzD-5j5PHeRsOQAIxFd8PgTPt8f08CTBAA"></div>
```js
var app = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    blog: {
      posts: [ {} ],
      name: 'Mah Blog'
    },
    show: true
  }
});

setTimeout(function() {
  app.set('blog.posts.0.name', 'I am foo.bar.baz');

  setTimeout(function() {
    app.toggle('show');
    app.toggle('show');
  }, 1000);
}, 1000);
```

## Navigating Contexts and Keypaths

Sometimes the data you're after may not exist in the current context or one of it's child keypaths. Ractive offers a few ways to navigate both contexts and keypaths.

Navigating keypaths is very similar to naviagating a filesystem, both syntactically and conceptually. If your current context is `user.settings.display` and you want to access `user.name`, you can pop up the keypath using the `../` prefix e.g. `../../name`. Note that this _only_ traverses the current keypath and not the context stack, even though those turn out to be the same in many cases. If the context stack happens to contain disjointed keypaths e.g. `user.settings` with a nested context of `blog.posts` (also on the root data object), then you would have to pop all the way to the root keypath to access a `user` keypath. That's not a terrible imposition with a shallow data structure, but it can be painful if the current context is more than a few keys deep.

To address that, Ractive also supports a root keypath prefix, `~/` that is meant to mirror the "home" directory prefix available to POSIX environments. From the previous example, instead of using `../../user` from the `blog.posts` context, you could simply use `~/user`. The root prefix refers to the root of the data in the current Ractive instance, meaning that containing instances of a component are not directly accessible using `~/`.

Some contexts are not directly addessable from outside of their context children, like expression contexts e.g. `{{#with { answer: 42, list: [ 1, 2, 3 ] } }}{{#with ~/some.key}} there's no way to get back to the outer context using ../ or ~/ {{/with}}{{/with}}`. If you're not sure what's happening with that outer context, don't worry because that's covered more elsewhere. To address situations like that, Ractive provides a context-popping prefix, `^^/` that is similar to the keypath-popping prefix. In the example, `^^/answer` would resolve to `42` from the inner context because `^^/` steps one step up the context hierarchy and gets the key `answer`, which in this case happens to be on the inline object expression `{ answer: 42, list: [ 1, 2, 3 ] }`. Context popping is not something you need often, but it's the only way to work around some corner-case scenarios explicitly.

Note that aside from `~/`, prefixed keypaths are not accessible from non-context API methods, like `app.set('../answer', 42)` because there's no way to determine to which keypath that should be relative. There are context helpers that make such relative keypaths available, but they're covered elsewhere.

### Iterative Contexts

It's worth noting that iterative mustaches introduce an implicit context that is two levels deeper than the surrounding context, which can be a little confusing at first glance. For instance:

```handlebars
{{#with user.blog}}
  {{#each posts}}
    {{../title}}
  {{/each}}
{{/with}}
```

In that example, you may expect `../title` in the each block body to resolve to `user.blog.title`, but it doesn't. Instead, it resolves to `user.blog.posts.title` because each iteration has two additional keys added e.g. `user.blog.posts.0` to make the current item the context of the iteration body. Popping up the keypath once only removes the index key, leaving you at the list rather than the surrounding context. Note that this is actually quite useful for things like:

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdc5XAE9JCOngQAPXJzAN+SADYIARk2H1KNergQBbSboaX2A2rgIBXXX0G5gwAMQIGUTByXWJhXAwMJxlyAlC2AElLK3IfAAFiHTVyAGpyAEZI8gB7ADNU4AA6Ss59fhRcMCKwisrIrnjon04AoMjorndPLjEJaTYQHGF4UiZyBklJcmpyfgQAd3IAJUDcMgQACmBaGAFyWSYWSHIAcl9cS4RcG6wTs9lrW3sEa7vkr8sLze-HOSHsDGux1OIPIzlC4WuAG0bgtbAgXrdijBtGgMTcjPxtAwbgBdYHnKLQjAASgA3JggA"></div>
```handlebars
<ul>
{{#each list}}
  <li>Item {{@index + 1}} of {{../length}} is {{.}}</li>
{{/each}}
</ul>
```

## Aliases

In addition to direct references, Ractive allows you to create template aliases to other references and expressions that are accessible from nested template blocks. There are four ways to create an alias:

1. With an alias block, which looks like a context section, but with aliases instead of a context e.g. `{{#with foo.bar as bat, (baz.bat * 22) + 14 as magicNumber}}...{{/with}}`. Within that block, `bat` will resolve to `foo.bar` and `magicNumber` will resolve to `(baz.bat * 22) + 14)`.
2. Naming the iteration context in an iterative mustache e.g. `{{#each list as item}}...{{/each}}`. Within that block, `item` will resolve to the current iteration context. This is particularly useful for nested contexts within the iteration body, where `.` is no longer the current iteration.
3. Index and/or key aliases in an iterative mustache e.g. `{{#each list:i}}`. The current index alias `i` is available within the iteration body. The alias can be any name you like, so it doesn't have to be `i`. Similarly, with object iteration e.g. `{{#each someObject:k, i}}`, the first alias is the current key and the second alias is the current index. All of the aliases are completely optional.
4. Naming aliases in a partial or yielder e.g. `{{>myPartial foo.bar as bat, baz.bat as bip}}` or `{{yield myPartial with foo.bar as bat}}`. If you aren't familiar with partials and yielders, don't worry because they're covered elsewhere.

In each of those cases, one or more references is introduced that doesn't directly relate to the data in the current context. Aliases are useful for templates that have many nested contexts to avoid large context or keypath popping prefixes, but note that they will resolve as part of the ambiguous reference resolution process, meaning that a local key with the same name in the current context with resolve before the alias.

## Special References

Ractive provides a number of special references that exist primarily at one particular point in a template and are not directly related to data. Special references are a sort of meta reference that starts with an `@`, and we've already seen one in an example above in the form of `@index`.

### Iteration Index

The current index of an iteration is available as the special `@index` reference. If the iterated reference is an object, then the current key name is available as the special `@key` reference.

### Ractive Instance

The `@this` special reference resolves to a special handle to the current Ractive instance. This is useful for calling methods or accessing properties on the Ractive instance that aren't part of the instance's data. If you have any helper methods that need to be accessible from both the API and the template, or you simply don't like putting helper functions in your data, you can place them on the Ractive instance and access them using `@this`.

As with `this`, `@this` also has a special shorthand form `@`, so `@this.set('answer', 42)` is the same as `@.set('answer', 42)`. The `@this` reference is one of the few special references that is available outside of a template e.g. `app.set('@this.answer', 42)`, and that is handled because it's the only way to have instance properties update directly in an observable way.

Properties on the `@this` reference that have a Ractive instance as a value will resolve to the equivalent `@this` for that value. This means that referencing a property on a foreign instance will result in a binding that updates correctly everywhere when it changes.

In addition to Ractive instance properties, there is a special `data` property (`@.data`) that resolves to the root model of the instance. This means that foreign instance data can be referenced as long as there is a supported path to the instance available in the template. Tight coupling is discouraged in general for components, but some classes of component are greatly simplified by allowing them to be tightly coupled.

### Keypath

The keypath of the current context is available as the special `@keypath` reference. There are some contexts that do not have externally addressable keypaths, like expressions. The keypath resolved by the `@keypath` reference is relative to the immediate instance, meaning that if the current instance happens to be a component and the context is provided by a mapping, then the keypath will be relative to the local component. To get the full path, you can use the special `@rootpath` reference, which will traverse mappings to the root instance to return the full keypath.

### Global

Most of the common JavaScript globals are available as normal references, like `Math`, `Object`, and `JSON`. The rest of the global scope is accessible from the special `@global` reference, which, like the `@this` model, is available to both the template and JavaScript API on any Ractive instance. Any changes made to a `@global` keypath through the `set` or other mutation method will also notify any other dependencies within Ractive that they need to update.

In a node.js environment, `@global` wraps the `global` object, and in most browsers, it wraps the `window` object.

### Ractive-global Storage

The special `@global` reference is subject to interference from outside code, so Ractive also provides its own special `@shared` reference, which is global among all Ractive instances.

### Context

Each block-level node in a Ractive template provides a special `@context` reference. This is the same object that is returned by `Ractive.getNodeInfo()` when called with the nearest parent DOM element. Contexts provided by the template are more precise than those acquired from a DOM element, because the template has access to the surrounding block scopes.

When a `@context` is provided for an event directive, it will be extended with additional properties relevant to the event.

### Event Object

The special `@event` reference is available to event directives and resolves to the current DOM or instance event object. This reference provides direct access to properties like `key`, `clientX`, and `clientY`.

### Event Element

The special `@node` reference is available to event directives and resolves to the DOM element on which the event directive is installed. With the `@node` reference you can use properties, like `value`, and call methods, like `select()`, from an event handler e.g. `<input on-focus="@node.select()" />`, which selects the text of the input when it gains focus.

### Local Model

Ractive provides a special `@local` reference that is a context-local model designed to provide out-of-model storage for plugins like decorators and parser transforms.

## Reference Summary Table

| Prefix / Special | Description |
| ---              | --- |
| `.`              | Immediate context, and any further keys are accessed from the immediate context. |
| `../`            | Move up one level in the keypath of the current context. This can be stacked, and any keys after the prefix are accessed from the resulting context. |
| `~/`             | The local root context, and any keys after the prefix are accessed starting from the root context. |
| `^^/`            | The immediate parent context, and keys after the prefix are accessed from the resulting context. This can also be stacked with `../` e.g. `^^/^^/../name`, which would pop the context twice, then the keypath on that context once, and finally return the `name` key. |
| `@this`          | The instance associated with the current context. |
| `@index`         | The index of the nearest parent iterative mustache. |
| `@key`           | The key of the nearest parent iterative mustache. |
| `@keypath`       | The keypath of the current context relative to the immediate instance. |
| `@rootpath`      | The keypath of the current context relative to the root instance. |
| `@global`        | The global object e.g. `global` in node.js and `window` in the browser. |
| `@shared`        | Ractive-private global storage. |
| `@context`       | The context object associated with the current context. |
| `@event`         | The DOM or instance event triggering an event directive. This is only accessible inside event directives. |
| `@node`          | The DOM element associated with a particular event directive. This is only accessible inside event directives. |
| `@local`         | Special storage associated with the current context. |
