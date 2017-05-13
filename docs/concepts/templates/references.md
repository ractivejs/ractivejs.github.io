# References

A reference is a string that refers to a piece of data. They may look like a regular [keypath](./keypaths.md), like `{{ foo.bar.baz }}` or may contain special keywords and glyphs, like `{{ @this.sayHello() }}`.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYExhN41aiuSRqAcgBG4gCYBPVxhs7By9ZbFkXa1t7B2oAM3FxFw9ZGH9A6Mx0h2wVSQpkUJUXAAMsmPwvZXUASWoYFViVevhiFTiE6gB3MmwwallqJVlkRCLqYGB28Wo0NC1KpXUyh3x3RDZxe2wfChVmEDWN+BZqTYBaYmQyYgF9gAFeskIRQlkfAAknZHELAEoNADCVxu1AAsiotIdsJsllEHMUAnDaG9Pqgfr9IkEYhJ4IRxMgVCJvkILK4AcMCV44jApP17CpVPAaL1QtREIQVFSBvVGs1WtRof1qJIVL1vK5-ki0Ok0L8ANwgNBAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: 'bar',
  },
  template: `
    <div>I reference foo with a value: {{ foo }}</div>
    <button type="button" on-click="@this.sayHello()">Click Me</button>
  `,
  sayHello(){
    console.log('Called from an event that used a reference to a method')
  }
});
```

## Reference resolution

In order for a reference to be usable, it has to resolve to something. Ractive follows the following resolution algorithm to find the value of a reference:

1. If the reference a [special reference](../../api.md), resolve with that keypath.
2. If the reference is [explicit](../../api.md) or matches a path in the current context exactly, resolve with that keypath.
3. Grab the current virtual node from the template hierarchy.
4. If the reference matches an [alias](./mustaches.md#aliasing), section indexes, or keys, resolve with that keypath.
5. If the reference matches any [mappings](../../extend/components.md#binding), resolve with that keypath.
6. If the reference matches a path on the context, resolve with that keypath.
7. Remove the innermost context from the stack. Repeat steps 3-7.
8. If the reference is a valid keypath by itself, resolve with that keypath.
9. If the reference is still unresolved, add it to the 'pending resolution' pile. Each time potentially matching keypaths are updated, resolution will be attempted for the unresolved reference.

## Context stack

Steps 6 and 7 of the [resolution algorithm](#reference-resolution) defines the ability of Ractive to "climb" contexts when a reference does not resolve in the current context. This is similar to how JavaScript climbs to the global scope to resolve a variable.

To do this, whenever Ractive encounters [section mustaches](./mustaches.md#sections) or similar constructs, it stores the context in a *context stack*. Ractive then resolves references starting with the context on the top of the stack, and popping off contexts until the reference resolves to a keypath.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3ewVSQpkWUCnAAN-O2pgYABiREIVGDQ0aJjqfAp1AHUHCUkVald5AQxY4HhZIrSAQgzMyviiwkJZIRVCNMam6gBNcURqMFlVSr4YFVkPNOpJ6Y9qcQAzSuxxbFl0NGoNreRqVvbOwhFepsHh0MIaZHEhTqWyW3FbOJvsABkHl7Tz2x9SpcY4dLo9QGZLQ5RpxXjJVLpQERPyAjxhWROayQ+YIrEXapFJzOABSZEkvguoNO+JxmX22ycAEYAAyooHzeBTGZOADMF0wF0+PyEL2J+Q88C66J8jSRdiRaAAlABuEBoIA"></div>

```js
Ractive({
  el: 'body',
  template: `
    {{#user}}
      <p>Welcome back, {{name}}!
        {{#messages}}
          You have {{unread}} unread of {{total}} total messages.
          You last logged in on {{lastLogin}}.
        {{/messages}}
      </p>
    {{/user}}
  `,
  data: {
    user: {
      name: 'Jim',
      messages: {
        total: 10,
        unread: 3
      },
      lastLogin: 'Wednesday'
    }
  }
});

// Welcome back, Jim! You have 3 unread of 10 total messages. You last logged in on Wednesday.
```

`{{# user }}` creates a context and the context stack becomes `['user']`. To resolve `name`, the following context resolution order is followed, where `name` resolves with the `user.name` keypath:

1. `user.name` (resolved here)
2. `name`

In the same way, `{{# messages }}` also creates a context. Since the `messages` section under the `user` section, the context stack becomes `['user', 'user.messages']`. To resolve `unread` and `total`, the following resolution order is followed:

`unread`

1. `user.messages.unread` (resolved here)
2. `user.unread`
3. `unread`

`total`

1. `user.messages.total` (resolved here)
2. `user.total`
3. `total`

In the case of `lastLogin`, the `user.messages.lastLogin` keypath does not exist. What Ractive does is pop off `user.messages` from the context stack and tries to resolve `lastLogin` using `user.lastLogin`. Since `user.lastLogin` is a valid keypath, `lastLogin` resolves as `user.lastLogin`.

1. `user.messages.lastLogin`
2. `user.lastLogin` (resolved here)
3. `lastLogin`

# Arrays

Unlike objects where the section uses the object as context, the context of a section that goes over an array are the items of that array.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1s7ajJsFUlOagBtfwi7YGoJeGiMp2cALxUYcWdqTCTk1PTM7GzxeBUikvCytJrK7OwAd0Li0uoAXSSGu2jJCmQglScAAyTgYABiKJjCNDQe2YqVDJWZ4C5F2O3w6fg0AEoAbhA0IA"></div>

```js
Ractive({
  el: 'body',
  data: {
    items: [
      { content: 'zero' },
      { content: 'one' },
      { content: 'two' }
    ]
  },
  template: `
  {{#items}}
    {{content}}
  {{/items}}
  `
});

// zeroonetwo
```

In the example above, context is created for each item on the array. The first time it is `items.0`, then `items.1`, then `items.2`. `content` will be resolved for relative to each, doing `items.0.content`, then `items.1.content` and finally `items.2.content`.
