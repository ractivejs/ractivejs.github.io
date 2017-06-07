# Templates

Strictly speaking, Ractive templates are not HTML. They are markup representations of objects that are used to construct HTML. Simply put, templates are _HTML-like_. Ractive parses templates into ASTs which contain everything Ractive needs to know to construct an instance's DOM, data bindings, events and transitions etc.

```js
Ractive.parse('<div class="message">Hello World!</div>')

// {"v":4,"t":[{"t":7,"e":"div","m":[{"n":"class","f":"message","t":13}],"f":["Hello World!"]}]}
```

## Mustaches

[Mustache](http://mustache.github.io/) is one of the most popular HTML templating languages. It has a very lightweight, readable syntax with a [comprehensive specification](https://mustache.github.io/mustache.5.html). If you've used [Handlebars](http://handlebarsjs.com) or [Angular](http://angularjs.org), you'll also find mustaches familiar. Ractive implements a subset of the Mustache specification and adds a few extensions to the language.

### Variables

`{{ }}`, `{{& }}` and `{{{ }}}` render a reference. They are also used for binding when used on [directives](../api/directives.md). `{{ }}` escapes the reference while `{{& }}` and `{{{ }}}` do not.

```js
Ractive({
  data: {
    name: "Chris",
    company: "<b>GitHub</b>"
  },
  template: `
    {{name}}      <!-- Chris -->
    {{age}}       <!--  -->
    {{company}}   <!-- &lt;b&gt;GitHub&lt;/b&gt; -->
    {{&company}}  <!-- <b>GitHub</b> -->
    {{{company}}} <!-- <b>GitHub</b> -->
  `
})
```

### Sections

Sections render a block of markup depending on the value referenced.

If the reference is an array, it renders the block of markup for each item in the array. The context of the section is the value of the currently iterated item. The iteration index is made available by adding a `:` after the array reference followed by the index reference.

```js
Ractive({
  data: {
    people: [{name: 'Alice'},{name: 'Bob'},{name: 'Eve'}]
  },
  template: `
    {{#people}} {{name}} {{/people}}
    {{#people:i}} {{i}} {{name}} {{/people}}
  `
})
```

If the reference is an object _and the key reference is provided_, the section iterates through the object properties. The context of the section is the value of the currently iterated property. The iteration key is made available by adding a `:` after the object reference followed by the key reference.

```js
Ractive({
  data: {
    places: { loc1: 'server room', loc2: 'networking lab', loc3: 'pantry'}
  },
  template: `
    {{#places:key}}
      {{ key }} {{ this }}
    {{/places}}
  `
})
```

If the reference is some other truthy value or an object but not providing the iteration key reference, it renders the block of markup using the reference as context.

```js
Ractive({
  data: {
    isAdmin: true,
    foo: {
      bar: {
        baz: {
          qux: 'Hello, World!'
        }
      }
    }
  },
  template: `
    {{#isAdmin}} Hello Admin! {{/isAdmin}}

    {{#foo.bar.baz}} {{qux}} {{/foo.bar.baz}}
  `
})
```

### Inverted Sections

`{{^ }}` renders a block of markup if the reference is falsy or is an empty iterable.

```js
Ractive({
  data: {
    real: false,
    people: []
  },
  template: `
    {{^real}} Nope, not real {{/real}}

    {{^people}} There's no people {{/people}}
  `
})
```

### Optional section closing text

Regular (`{{# }}`) and inverted (`{{^ }}`) sections can be closed with optional closing text. If the closing text is provided and the section is opened with a reference, the closing text must match the opening text. Otherwise, a warning will be issued for the mismatch. If the section is opened with an expression, the closing text will always be ignored.

```js
Ractive({
  data: {
    items: [1,2,3]
  },
  template: `
    {{#items}}
      {{this}}
    {{/items}}

    {{#items}}
      {{this}}
    {{/}}

    {{# a.concat(b) }}
      {{this}}
    {{/ I'm actually ignored but should be something meaningful like a.concat(b) }}
  `
})
```

### If sections

`{{#if }}` renders a block of markup if the reference is truthy or a non-empty iterable. `{{else}}` and `{{elseif}}` are supported and render if the previous condition failed.

```js
Ractive({
  data: {
    foo: false,
    bar: false
  },
  template: `
    {{#if foo}}
      foo
    {{elseif bar}}
      bar
    {{else}}
      baz
    {{/if}}
  `
})
```

### Unless sections

`{{#unless }}` renders a block of markup if the reference is falsy or is an empty iterable. Unlike `{{#if }}`, the `{{#unless }}` section does not support `{{else}}` nor `{{elseif}}`.

```js
Ractive({
  data: {
    real: false,
  },
  template: `
    {{#unless real}} Fake {{/unless}}
  `
})
```

### Each sections

`{{#each }}` renders the block of markup for each item in the iterable. The context of the section is the value of the currently iterated item. `{{else}}` and `{{elseif}}` are supported and render if the iterable is empty.

```js
Ractive({
  data: {
    people: [{name: 'Alice'},{name: 'Bob'},{name: 'Eve'}]
  },
  template: `
    {{#each people}}
      Hi! I'm {{name}}!
    {{else}}
      There's nobody here
    {{/each}}
  `
})
```

### With sections

`{{#with }}` alters the current section's context by sticking a reference in front of the resolution order. This causes everything within the section to resolve to that reference's context and data hierarchy first before the original section's.

```js
Ractive({
  el: 'body',
  append: true,
  data: {
    foo: {
      qux: 2,
      bar: {
        baz: 1
      }
    },
    fee: {
      baz: 'a'
    }
  },
  template: `
    <!-- context becomes foo -->
    {{#foo}}

      <!-- context becomes foo.bar -->
      {{#bar}}

        <!-- resolution order: [foo.bar.baz], foo.baz, baz -->
        {{baz}}

        <!-- resolution order: foo.bar.qux, [foo.qux], baz -->
        {{qux}}

        <!-- sticks fee in front of foo.bar on the resolution order -->
        {{#with ~/fee}}

          <!-- resolution order: [fee.baz], foo.bar.baz, foo.baz, baz -->
          {{baz}}

          <!-- resolution order: fee.qux, foo.bar.qux, [foo.qux], qux -->
          {{qux}}
        {{/with}}

      {{/}}
    {{/}}
  `
})
```

`{{else}}` and `{{elseif}}` are supported and render when the context reference does not exist.

```js
Ractive({
  data: {},
  template: `
    {{#with people}}
      {{joe}}
    {{/else}}
      Context missing
    {{/with}}
  `
})
```

`{{#with }}` also allows aliasing of references, including [special references](../api/references.md#special-references). Aliasing is in the form of `reference as alias` pairs. Multiple alias pairs can be done by separating each with a comma. In this mode, the context within the block is not altered.

```js
Ractive({
  el: 'body',
  append: true,
  data: {
    foo: 1,
    bar: {
      foo: 2,
      baz: 3
    }
  },
  template: `
    {{foo}} <!-- 1 -->

    {{#with foo as qux, @global as world}}
      {{#bar}}
        {{qux}} <!-- 1 -->
        {{foo}} <!-- 2 -->
        {{baz}} <!-- 3 -->
      {{/}}
    {{/with}}
  `
})
```

### In-template partials

`{{#partial }}` defines a partial that is scoped to the nearest enclosing element or the containing component if defined at the top level of the template.

```js
Ractive({
  data: {
    people: [{name: 'Alice'},{name: 'Bob'},{name: 'Eve'}],
    places: [{name: 'server room'},{name: 'networking lab'},{name: 'pantry'}]
  },
  template: `
    {{#partial item}}
      <li class="item">{{this}}!</li>
    {{/partial}}

    <ul>
      {{#each people}}
        {{> item }}
      {{/each}}
    </ul>

    <ul>
      {{#each places}}
        {{> item }}
      {{/each}}
    </ul>

    <div>
      {{#partial scopedPartial}}
        Usage of {{this}} partial is only available to the descendants of the div
      {{/partial}}
    </div>
  `
})
```

### Static mustaches

`[[ ]]`, `[[& ]]` and `[[[ ]]]` render the reference only during the initial render. After the initial render, any changes to the referece will not update the UI, nor does any change on bound UI elements cause the reference to change. They are the one-time render counterparts of `{{ }}`, `{{& }}` and `{{{ }}}`, respectively.

```js
const instance = Ractive({
  data: {
    msg: 'Hello, World!',
    admin: false
  },
  template: `
    Will change when updated: {{ msg }}     <!-- changes to "Me, Hungry!" after the change -->
    Will not change when updated: [[ msg ]] <!-- remains "Hello, World!" after the change -->

    [[# if admin ]]
      Hello, admin
    [[else]]
      Hello, normal user
    [[/if]]
  `
})

instance.set({ msg: 'Me, Hungry!' })
instance.set('admin', true) // rendering remains 'Hello, normal user'
```

### Expressions

Expressions in mustaches are evaluated, and its result is used as the referenced value. Any changes to the expression's dependencies will re-evaluate the expression and update the rendered value.

```js
Ractive({
  data: {
    num1: 2,
    num2: 3,
    a: [1,2,3],
    b: [4,5,6],
    fn: () => true
  },
  template: `
    {{ num1 + num2 }}

    {{# a.concat(b) }} {{this}} {{/}}
    {{#each a.concat(b) }} {{this}} {{/each}}

    {{# fn() }} Yasss!!! {{/}}
    {{#if fn() }} Yasss!!! {{/if}}
  `
})
```

### Comments

`{{! }}` defines a template comment. Comments are ignored by the parser and never make it to the AST.

```html
<h1>Today{{! ignore me }}.</h1>
```

### Custom delimiters

`{{= =}}` defines custom delimiters. Custom delimiters should not contain whitespace or the equals sign.

```html
{{foo}}

{{=<% %>=}}
<% foo %>
```

### Escaping mustaches

`\` prepended on a mustache interprets the mustache as literal text.

```html
{{ ref }} \{{ ref }} <!-- value {{ ref }} -->
```

For multi-mustache structures, `\` must be prepended on all involved mustaches.

```html
\{{#if foo }} \{{ bar }} \{{/if}} <!-- {{#if foo }} {{ bar }} {{/if}} -->
```

To interpret a `\` as a literal slash before a mustache, simply prepend another `\`. Any further `\` prepended will be treated in this manner.

```html
\\{{ ref }}   <!-- \value -->
\\\{{ ref }}  <!-- \\value -->
\\\\{{ ref }} <!-- \\\value -->
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

A reference is a string that refers to a piece of data. A [keypath](#keypaths) is an example of a reference, one that points to a specific location in the data. [Special references](../api/references.md#special-references) are also a form of reference, one that provides to a certain value.

### Reference resolution

Ractive follows the following resolution algorithm to find the value of a reference:

1. If the reference a [special reference](../api/references.md), resolve with that keypath.
2. If the reference is [explicit](../api/references.md) or matches a path in the current context exactly, resolve with that keypath.
3. Grab the current virtual node from the template hierarchy.
4. If the reference matches an [alias](#aliasing), section indexes, or keys, resolve with that keypath.
5. If the reference matches any [mappings](../extend/components.md#binding), resolve with that keypath.
6. If the reference matches a path on the context, resolve with that keypath.
7. Remove the innermost context from the stack. Repeat steps 3-7.
8. If the reference is a valid keypath by itself, resolve with that keypath.
9. If the reference is still unresolved, add it to the 'pending resolution' pile. Each time potentially matching keypaths are updated, resolution will be attempted for the unresolved reference.

### Context stack

Steps 6 and 7 of the [resolution algorithm](#reference-resolution) defines the ability of Ractive to "climb" contexts when a reference does not resolve in the current context. This is similar to how JavaScript climbs to the global scope to resolve a variable.

To do this, whenever Ractive encounters [section mustaches](#sections) or similar constructs, it stores the context in a *context stack*. Ractive then resolves references starting with the context on the top of the stack, and popping off contexts until the reference resolves to a keypath.

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
})

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



## Expressions

### Valid expressions

These are, of course, JavaScript expressions. Almost any valid JavaScript expression can be used, with a few exceptions:

* No assignment operators (i.e. `a = b`, `a += 1`, `a--` and so on)
* No `new`, `delete`, or `void` operators
* No function literals (i.e. anything that involves the `function` keyword)

Aside from a subset of global objects (e.g. `Math`, `Array`, `parseInt`, `encodeURIComponent` - full list below), any references must be to properties (however deeply nested) of the Ractive instance's data, rather than arbitrary variables. Reference resolution follows the [normal process]().


### Does this use `eval`?

Yes and no. You've probably read that 'eval is evil', or some other such nonsense. The truth is that while it does get abused, and can theoretically introduce security risks when user input gets involved, there are some situations where it's both necessary and sensible.

But repeatedly `eval`ing the same code is a performance disaster. Instead, we use the `Function` constructor, which is a form of `eval`, except that the code gets compiled once instead of every time it executes.


### A note about efficiency

Using the `Function` constructor instead of `eval` is just one way that Ractive optimises expressions. Consider a case like this:

```html
{{a}} + {{b}} = {{ a + b }}
{{c}} + {{d}} = {{ c+d }}
```

At *parse time*, Ractive generates an [abstract syntax tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST) from these expressions, to verify that it's a valid expression and to extract any references that are used. It then 'stringifies' the AST, so that the expression can later be compiled into a function.

As anyone who has seen minified JavaScript can attest, JavaScript cares not one fig what your variables are called. It also doesn't care about whitespace. So both of the expressions can be stringified the same way:

```js
"_0+_1"
```

When we *evaluate* `{{ a + b }}` or `{{ c+d }}`, we can therefore use the same function but with different arguments. Recognising this, the function only gets compiled once, after which it is cached. (The cache is shared between all Ractive instances on the page.) Further, the result of the evaluation is itself cached (until one or more of the dependencies change), so you can repeat expressions as often as you like without creating unnecessary work.

All of this means that you could have an expression within a list section that was repeated 10,000 times, and the corresponding function would be created once *at most*, and only called when necessary.




### Supported global objects

* `Array`
* `Date`
* `JSON`
* `Math`
* `NaN`
* `RegExp`
* `decodeURI`
* `decodeURIComponent`
* `encodeURI`
* `encodeURIComponent`
* `isFinite`
* `isNaN`
* `null`
* `parseFloat`
* `parseInt`
* `undefined`

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

Parsing templates can be a very slow operation. As an optimization option, templates can be pre-parsed outside of runtime, speeding up app initialization. Most [loaders](../integrations/loaders.md) do pre-parsing of templates as part of their build process. A parsed template is approximately 30-40% larger than the markup version, making it a trade-off between space and processing.

### Limiting template expressions

While expressions provide power and convenience when building templates, it incurs a performance penalty as Ractive sets up each one on a per-instance level. To avoid this overhead, there are several places where logic can move to, trimming down expressions into mere function calls.

#### Data functions

These functions can be set on the data globally via `Ractive.defaults.data`.

```js
Ractive.defaults.data.customLogic = function(){ ... }

Ractive({
  template: `
    {{ customLogic() }}
  `
})
```

#### Component methods

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
