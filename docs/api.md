

# Mustaches

## Variables

`{{ }}`, `{{& }}` and `{{{ }}}` render a reference. They are also used for binding when used on directives. `{{ }}` escapes the reference while `{{& }}` and `{{{ }}}` do not.

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

## Sections

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

## Inverted Sections

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

## Optional section closing text

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

## If sections

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

## Unless sections

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

## Each sections

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

## With sections

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

`{{#with }}` also allows aliasing of references, including special references. Aliasing is in the form of `reference as alias` pairs. Multiple alias pairs can be done by separating each with a comma. In this mode, the context within the block is not altered.

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

## In-template partials

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

## Static mustaches

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

## Expressions

Expressions in mustaches are evaluated, and its result is used as the referenced value. Any changes to the expression's dependencies will re-evaluate the expression and update the rendered value. References to variables are taken from the current context and follow the regular reference resolution routine.

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

Almost any valid JavaScript expression can be used, with a few exceptions:

- No assignment operators (i.e. `a = b`, `a += 1`, `a--` and so on).
- No `new`, `delete`, or `void` operators.
- No function literals (i.e. anything that involves the `function` keyword).

Expressions support only a subset of globals:

- `Array`
- `Date`
- `JSON`
- `Math`
- `NaN`
- `RegExp`
- `decodeURI`
- `decodeURIComponent`
- `encodeURI`
- `encodeURIComponent`
- `isFinite`
- `isNaN`
- `null`
- `parseFloat`
- `parseInt`
- `undefined`

## Comments

`{{! }}` defines a template comment. Comments are ignored by the parser and never make it to the AST.

```html
<h1>Today{{! ignore me }}.</h1>
```

## Custom delimiters

`{{= =}}` defines custom delimiters. Custom delimiters should not contain whitespace or the equals sign.

```html
{{foo}}

{{=<% %>=}}
<% foo %>
```

## Escaping mustaches

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

## Anchors

`<# />` define anchors which are mounting points where instances can be mounted to dynamically during runtime.

<div data-run="true" data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoQN4BjAewDssACAWQE8BhUgWwAcK1yUqBeKgJSTEUASwBuaAHRoAHunIATABTAAOuSpV0bZOkhUABus2aAPAvEA+YMCrNMGJAHM0VHDlMB6C2MvHD6jgAlOrqgsLiaCr+KEgwLij6AOQARqQKdEl4-gqoSPpqGibMGE7JABJoCAikeFQA6qQwCAoAhEn++DFoOqho+kZFZgDEdqQArlzsIlwA7FSefkUG2UUUMyIoSkGFJgueVAwwaH1U5GgA7lQzWORCaP6aZJTczIws7OdcvLTvbBxcbahIb7KgAGRmAGs7KUqKQAGZUVhxTjcFCkOwOZyuBHXF53YgPEFvJj-L4oSQIKFKJIlJxZKi0rEuBm2GBCUQSfQoMAiDBuELkR6ggCSKCS-OYEy4SRmWhE9lawp5fMkqFixDADF5LSUJI+AJQdVssXiaESjKlkxQ0zmSWCnUCQVwQA"></div>

```js
const MyComponent = Ractive.extend({
  template: `
    <div>{{ message }}</div>
  `
})

Ractive({
  target: 'body',
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <# mountpoint7 />
  `,
  oninit(){
    // Create new instance
    const myComponent = MyComponent()

    // Link msg of parent to message of instance
    myComponent.link('msg', 'message', { ractive: this })

    // It's mount'in time!
    this.attachChild(myComponent, { target: 'mountpoint7'})
  }
})
```

## {{>content}}

`{{>content}}` renders the inner HTML in the context of the component. Partials, components, and any other valid template items can be used as inner HTML.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <!-- Prints "Lorem Ipsum" -->
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Partials defined in the inner HTML can be used to override partials defined on the component.

```js
Ractive.components.ChildComponent = Ractive.extend({
  partials: {
    messageWrapper: '<strong>{{message}}</strong>'
  },
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">

        {{#partial messageWrapper}}<em>{{message}}</em>{{/}}

        <div class="inner-content">
          {{> messageWrapper }}
        </div>

      </ChildComponent>
    </div>
  `
});
```

## {{yield}}

`{{yield}}` renders the inner HTML in the context of the parent component. Partials, components, and any other valid template items can be used as inner HTML.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{ yield }}</div>
  `
});

const ractive = Ractive({
  el: 'body',
  data: {
    message: 'Hello, World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <!-- Prints "Hello, World!" -->
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Yields can also be customized using named yields. A named yield will look for a partial of the same name in the inner HTML and render that partial instead.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">
      {{ yield }}
      {{ yield italicYield }}
      {{ yield boldYield }}
    </div>
  `
});

const ractive = Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">

        <!-- Printed by {{ yield italicYield }} -->
        {{#partial italicYield }}<em>{{message}}</em>{{/}}

        <!-- Printed by {{ yield boldYield }} -->
        {{#partial boldYield }}<strong>{{message}}</strong>{{/}}

        <!-- Anything not a partial is printed by {{ yield }} -->
        {{message}}
      </ChildComponent>
    </div>
  `
});
```

Since the yielded content exists entirely in the context of the container (as opposed to the component), there's no way for the yielded content to access data in the component that is yielding. To address that, yields may supply aliases that are made available to the yielded content:

```js
const list = Ractive.extend({
  template: `
    <ul>{{#each items}}<li>{{yield with . as item, @index as index}}</li>{{/each}}</ul>
  `
});

const ractive = Ractive({
  el: 'body',
  data: {
    some: {
      list: [ 1, 2, 3 ]
    }
  },
  select(i) { console.log('you picked', i); },
  template: `
    <list items="{{some.list}}">
      <a href="#" on-click="@.select(item)">Item {{index}}</a>
    </list>
  `,
  components: { list }
});
```

Without the given alises, iterating a list within the component to yield the content would be useless, because the content would not have access to the current iteration. You could get around that by using a normal partial rather than a yield, but at that point, the click event on the content would result in an error because the `select` method does not exist on the `list` component.

You can also yield with aliases for a specific named partial. For instance to yield a `title` partial making the current `page` number available:

```handlebars
{{yield title with meta.pageNumber as page}}
```

# Data binding

## Text inputs

Data can be bound to text inputs via the `value` directive. This includes text-like inputs such as password, email, color, tel, date, etc.

```js
Ractive({
  template: `
    <input type="text" value="{{ msg }}">
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

## Number inputs

Numeric data can be bound to number inputs via the `value` directive. This includes number-like inputs such as range. The value from the input will automatically be converted into a number. When the input is blank, the value returned is `undefined`.

```js
Ractive({
  template: `
    <input type="number" value="{{ daysWithoutSleep }}">
  `,
  data: {
    daysWithoutSleep: 2
  }
});
```

## File inputs

File data can be bound to file inputs via the `value` directive. The value from the input is an instance of `FileList`.

```js
Ractive({
  template: `
    <input type="file" value="{{ file }}">
  `,
  data: {
    file: /* FileList instance */
  }
});
```

or by using events:

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gHYIDuABAEoCGAxgC4CWAbggBTAA6B7tCANpKQDkAYgD2AV1oAHSYKyduPALZTelHgIAGC2sGDCENMKQBmo0Rgw6APFIB8pPQDpLpAdfoEZtUqIIBaajBKAjQAXnZwPl5RSNJaAE8pBAiQE3peBDiAegdrbPsdPWzDIMsdG3FeOwrdfVLjACNKGHKuWm5rXno7Z1EYehQAaQQk9TBXAWcCSiUESyxSXHoALwQp4Cdltdd87pr27mKGts7sqoPOsABmOzNRd2yby9pbGARe4AApAGUAeQAcltaANQvQTAkWPcAJSWfJSd4vazPZowR7PGwIj56X6A4GglDgyGo2EYeGInSaeTtPzQWpgaIPUziAh0eh+Fh0AAe0I4hw6tHSmVwpDCpG5TgIoiQCCcQoQuAA3KRatwANajKTjUXi2hcpzvXCiXjMFjQxUKfncVEABW1YqobOYW1U9FoIzGtDALA1nrA5tVtGofiNmScMRQLEEtu1LRglASkDkpBjXoDVtoqbAAG0AAwAXR10ZaggtGazOqzTgAVqJPFGnIJ09wW0GQ8bZRGo1nk1nmwLuMGCKHO6JI4IJYbjcwBMnfVq02XW4owPRcFsELQWFnFnzlwL+oMPQuwAJ5+NFoHuDM5gJ5bg8-nJbMEJeM9xtutTBkFY+tqt5l3GUECkAQQXEeZ+24Kx2mwHQkHUSg6X5e4BGzABGRYACZFmufM31bVE0PzHQYIwaEQBwWh4GsJAmFIegkFSCRpEkSI7HyOjGDsTAgA"></div>

```js
Ractive({
  ...
  template: `
    {{#each foo}}
    <p>
      {{.}} : <input on-change="hello" type="file" />
    </p>
    {{/each}}
  `,
  on:{
    hello: function(ctx){
      files = ctx.node.files;
      keypath = ctx.resolve();
      console.log('selected files:', files);
      console.log('first file:', files[0]);
      console.log('current context: ', keypath);
    }
  },
  data:{
    foo: [1, 2, 3]
  }
})
```

## Checkboxes

Boolean data can be bound to checkboxes via the `checked` directive.

```js
Ractive({
  template: `
    <input type="checkbox" checked="{{ isChecked }}">
  `,
  data: {
    isChecked: true
  }
});
```

Array data can also be bound to checkboxes via the `name` directive.

```js
Ractive({
  template: `
    <input type="checkbox" name="{{ selectedItems }}" value="1">
    <input type="checkbox" name="{{ selectedItems }}" value="2">
    <input type="checkbox" name="{{ selectedItems }}" value="3">
  `,
  data: {
    selectedItems: ['1', '2']
  }
});
```

When both `checked` and `name` bindings are present, the binding to `checked` will be honored and the binding to `name` will be treated as a regular interpolation.

## Radio buttons

Boolean data can be bound to radio buttons via the `checked` directive.

```js
Ractive({
  template: `
    <input type="radio" name="options" checked="{{ option1 }}">
    <input type="radio" name="options" checked="{{ option2 }}">
    <input type="radio" name="options" checked="{{ option3 }}">
  `,
  data: {
    option1: false,
    option2: true,
    option3: false
  }
});
```

Data can also be bound to radio buttons via the `name` directive.

```js
Ractive({
  template: `
    <input type="radio" name="{{ selectedOption }}" value="1">
    <input type="radio" name="{{ selectedOption }}" value="2">
    <input type="radio" name="{{ selectedOption }}" value="3">
  `,
  data: {
    selectedOption: '1'
  }
});
```

## Text areas

Data can be bound to text areas via the `value` directive.

```js
Ractive({
  template: `
    <textarea value="{{ msg }}"></textarea>
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

Data can also be bound to text areas via its contents.

```js
Ractive({
  template: `
    <textarea>{{ msg }}</textarea>
  `,
  data: {
    msg: 'Hello, World!'
  }
});
```

## Select lists

Data can be bound to select lists via the `value` directive.

```js
Ractive({
  template: `
    <select value="{{ selectedOption }}">
      <option value="1">Red</option>
      <option value="2">Green</option>
      <option value="3">Blue</option>
    </select>
  `,
  data: {
    selectedOption: '2'
  }
});
```

Array data can also be bound to select lists with the `multiple` attribute via the `value` directive.

```js
Ractive({
  template: `
    <select multiple value="{{ selectedItems }}">
      <option value="1">Red</option>
      <option value="2">Green</option>
      <option value="3">Blue</option>
    </select>
  `,
  data: {
    selectedItems: [ '2', '3' ]
  }
});
```

## contenteditable

Data can be bound to elements that have the `contenteditable` attribute via the `value` directive.

```js
Ractive({
  template: `
    <div contenteditable="true" value="{{ msg }}"></div>
  `,
  data: {
    msg: 'Hello, World!'
  }
});

// Rendered as:
// <div contenteditable="true">Hello, World!</div>
```

There are a few caveats when binding to an element with `contenteditable`:

- The returned string may or may not always be HTML.
- The returned string may be different from browser to browser.
- Any value set on the bound data will always be rendered as HTML.

# Directives

## twoway

The element-specific directive form of `twoway`.

```html
<!-- By default, two-way is enabled. Editing the input updates foo. -->
Two-way: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- With twoway="false", editing the input will not update bar. -->
One-way: <input type="text" value="{{ bar }}" twoway="false"> {{ bar }}

<!-- Updating bar via the data will update the UI -->
<button type="button" on-click="@this.set('bar', 'baz')">Set value to bar</button>
```

## lazy

The element-specific directive form of `lazy`.

```html
<!-- Editing the input updates foo on keypress. -->
Eager: <input type="text" value="{{ foo }}"> {{ foo }}

<!-- Editing the input updates bar only when focus moves away from the input. -->
Lazy: <input type="text" value="{{ bar }}" lazy="true"> {{ bar }}
```

## as-\*

`as-*` directives augment the element with decorators. It accepts optional, comma-separated expressions as arguments to the decorator function.

```html
<div as-modal>Div appearing as modal</div>
<div as-modal="true, true, true, false">Div appearing as modal</div>
```

## class-\*

`class-*` directives toggle individual class names based on the truthiness of its value. The part of the directive name following `class-` will be used as the class name. `class-*` directive values are processed as expressions. If there is no expression, the implicit value is `true`, which is useful for applying multiple classes to an element using component `extra-attributes`.

```html
<div class-foo="isFoo">Adds "foo" if isFoo is truthy</div>
<div class-foo-bar="isFooBar">Adds "foo-bar" if isFooBar is truthy</div>
<div class-fooBar="isFooBar">Adds "fooBar" if isFooBar is truthy</div>
<div class-baz>Always has "baz"</div>
```

## on-\*

`on-*` directives attach event handlers to DOM elements and components. `on-*` can be used in two ways: proxy syntax or the expression syntax.

```js
Ractive({
  template: `
    <button type="button" on-click="clickedproxy">Push me!</button>
    <button type="button" on-click="['clickedArray', 'Hello, World!']">Push me!</button>
    <button type="button" on-click="@this.clickedMethod('Hello, World!')">Push me!</button>
  `,
  on: {
    clickedproxy: function(context){
      console.log('Hello, World!');
    },
    clickedArray: function(context, msg){
      console.log(msg);
    }
  },
  clickedMethod(msg){
    console.log(msg);
  }
});
```

Multiple events can also be tied to the same handler by appending event names to the directive, separating them by hyphens:

```js
Ractive({
  template: `
    <button type="button" on-hover-click="@this.someMethod()">Push me!</button>
  `,
  someMethod(){
    console.log('Fires on hover and on click!');
  }
});
```

## \*-in, \*-out, \*-in-out

`*-in`, `*-out`, and `*-in-out` directives apply transitions to the element. `*-in` specifies intro-only, `*-out` specifies outro-only, and `*-in-out` for both intro and outro. All three directives accept optional, comma-separated expressions as arguments to the transition function.

```html
<div fade-in>Fades on render</div>
<div fade-out>Fades before removal</div>
<div fade-in-out>Fades on render and before removal</div>
<div fade-in-out="{ duration: 500 }, someOtherArg">Fades with 500ms duration</div>
```

## style-\*

`style-*` directives update individual `style` properties of the element. The part of the directive following `style-` will be used as the style property name. Style names can either be in kebab case or camel case, and will be normalized on application.

```html
<div style-vertical-align="middle">Applies style.verticalAlign</div>
<div style-textAlign="center">Applies style.textAlign</div>
```

`style-*` directive values are processed as strings. Mustaches can also be used to supply the values. When the values are updated, the appropriate style property on the element will update to the new value.

```html
<div style-vertical-align="{{ vAlign }}" style-textAlign="{{ tAlign }}">...</div>
```


# Keypath prefixes

Normally, keypaths are resolved following a defined routine. But there are times where you want to skip the normal resolution routine and resolve a keypath relative to a specific data context. Keypath prefixes allow you to specify which data context a keypath resolves to, regardless if it resolves to something or not.

## Current context

Resolves the keypath relative to the current data context.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWuAA4CBTbjwDKABQDyegHJiJigLbSYFAB5zTbBjLRMymrWYpkwPe4oD0fiwAKmAIMAgsFLgsTAJKquq+GKbYpmQIZsoc0gjcAAa+ADxI1AB8egCuZLgUSBFeERZkVtZYLMICFSxgRDQswMDxaqwYGIV+JVSlvgMAxCxNLSyjvmzFZQCSTDV1LA0LljZtHV1eFEwA1u2d3b0RA0PqyxgAdOOT0wqKLOtTWyzhIgcTzCNoNcKRaKxfqDF5+FTDZ7vMozYB+FYKApMDAASgA3CAcGR4JggA"></div>

```js
Ractive({
  target: 'body',
  data: {
    spoon: 'SPOON',
    matrix: {
    	agent: 'Smith'
      // There is no spoon
    }
  },
  template: `
    <div>Outside the matrix, you have {{ spoon }}</div>
    {{# matrix }}
      <div>Inside the matrix, you think you have {{ spoon }}.</div>
      <div>In reality, there is no {{ ./spoon }}</div>
    {{/}}
  `
});

// Outside the matrix, you have SPOON
// Inside the matrix, you think you have SPOON.
// In reality, there is no
```

## Parent keypath

Resolves the keypath relative to the parent data. This prefix can be used more than once to reference ancestors.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWFJNx4wERDhTKjxCyeqIBbORMUNKK3kkNGAjGLNsLNjSZbzFLCxeWrXxgBMjvreZC62pqE+4Zb+tgDMIV4xGE5haaGZbNhmZAhGAA4c0gjcAAbpADxI1AB8AJoCAK4sROpKrMDASkgsGBhVAPS1VHXp3QDELAFG-dlhFjX1Ta3tCJ0ePcrzw6PjTBZeUzO28+kxy2OrbR0UXdt9A3v16cfA07Pn0bFL+zfrTbdXq7EavH4xC6-MhXOoAUVwJCIhXuKAAdBiXmMoZd-i1bht7lsWBihjtnmDsRDYrCAXcHiS0UNSeTBpSDilobT8YCicDSQKmaysRzzLFukMBlCJVKFBYZQtKkwMABKADcIBwZHgmCAA"></div>

```js
Ractive({
  target: 'body',
  data: {
    id: 'reality',
    dream: {
    	id: 'dream1',
    	dream: {
    		id: 'dream2',
    		dream: {
    			id: 'dream3',
    		}
    	}
    }
  },
  template: `
    <div>You are in {{ id }}</div>
    {{# dream }}
      <div>You are in {{ id }}</div>
      {{# dream }}
        <div>You are in {{ id }}</div>
        {{# dream }}
          <div>You are in {{ id }}</div>

          <div>Escaping...</div>
          <div>You are in {{ ../id }}</div>
          <div>You are in {{ ../../id }}</div>
          <div>You are in {{ ../../../id }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// You are in reality
// You are in dream1
// You are in dream2
// You are in dream3
// Escaping...
// You are in dream2
// You are in dream1
// You are in reality
```

## Parent context

While parent keypaths and parent contexts are often the same thing, there are some scenarios in which they are very, very different. For instance, in this horribly contrived example:

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATOmEwDm1pkzA5ACMA9gBMAnvwxNWowuz6MWrZmGEBbaoMLZqimStaDE5ZKPLxOARkXN4hTX34B5AA7UY88sPjZ+zNANWTCDmbV1sPgBtUNYlQ0NjU3NLG2ZgOwc9AQBZamxsZgAJQlR-QOVDEMqVeISjEzMLa1t7R1zqc2JS5gAVanhSctiA0IBdA2rWUmp1V2R5bIADUOBgAGJqEjAwnXy0Cvq19YB3clIdgD8AejVNcOoDkdYAHnNKAD4L6lUNH4ewigUtZmORCmsAHRJJqpCFtR5oF7Xd4fZ7MN5UL5gH7ERAwGADUigmaeCg+Xa6QHJZpWUHg4AAPQZ1yhjWBVjhWQOSJRIzW1zOFyeNX5W2IYGFrBW8DQAEoANwgNBAA"></div>

```js
Ractive({
  target: 'body',
  data: {
    homebase: {
      building1: { name: 'Operations' }
    },
    bases: [
      {
        building1: { name: 'Mess Hall' }
      },
      {
        building1: { name: 'Medical Tent' }
      }
    ]
  },
  template: `
    {{#each bases}}
      {{#with ~/homebase}}
        <div>the home base bulding1 is {{.building1.name}}</div>
        <div>the current iteration base building1 is {{^^/.building1.name}}</div>
      {{/with}}
    {{/each}}
  `
});

// the home base bulding1 is Operations
// the current iteration base building1 is Mess Hall
// the home base bulding1 is Operations
// the current iteration base building1 is Medical Tent
```

## Instance root context

Resolves the keypath relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWMAQIC23HgEYxExQAcBMGVxbzFLBmWVqNAJh0K2lg0aImziy5evreAZgdzLzIXYzldJzJgnw0AFkDPKLIMCItk1JSFbF0yBFU9DmkEbgADVOBgAGIWULcWDEzLcwrq2o56zPNmqprDYw7U4K9HNOCAHiRqAD4AUSZcmAomFAA6NbGAekmqKcGkywnpgE0BAFcWIhgEFiWlFVVTYBYAPw2fDs3t3ZGhskOdk7nS7XW7vCovDZtFbvBqfaZ7cZfQEXK43Vhgp6vKFQmEYOE7BFJf5TZHAtF3NSPCHYvpuFY4+4fLbwn5JCobBp7dmchSWbmdFhlJgYACUAG4QDgyPBMEA"></div>

```js
Ractive({
  target: 'body',
  data: {
    room: '1',
    portal: {
    	room: '2',
    	portal: {
    		room: '3',
    		portal: {
    			room: '4',
    		}
    	}
    }
  },
  template: `
    {{# portal }}
	    {{# portal }}
        {{# portal }}
    			<div>Entering...</div>
    			<div>You are in room {{ ~/room }}</div>
    			<div>You are in room {{ ~/portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.portal.room }}</div>
    		{{/}}
    	{{/}}
  	{{/}}
  `
});

// Entering...
// You are in room 1
// You are in room 2
// You are in room 3
// You are in room 4
```

# Special references

Special references are template keywords that act like data references but do not actually exist in your data. These references provide metadata regarding the current instance, context, environment, operation and more.

## `this`

The current data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1s7ajJ4ADNxUP8Iu0kVQkJZIRUnZwAJB2RxagB1cRhkDwBCXwTEqNj48MSklLSMrIAVMBVqAEdEMmIBalcYcQB3W1iADyqGxtq46jDGxuTU9MyXACtESQ5qcVUYamxO6mRZAC8vag9xIRnlmpiFpcfE1ZaN5w6gwmpZVDUWLIASEZzVR5oCGJKGzOywmEJTAJbAqXbnVFOAAGEPwHmU6hG4mwoWA1AAUgBlADyADkRIRsOR4EIyNEvBYTmRCABKahoNBafFKdQQ4DAADEkWe-IRjTxBPm1AAjKSKTT6Yzmaz2ZywNy+QKhQToYtJdLYrLTXYFSKlQAmNVUukMplRHUcrm82XGkXWs1SpUC-024XqJUAZidGtd2rZnv13qNXDDIYDFoKwbhj1t4ZlABZoy6te743qDT6Uybs4lxVws286w3Gk25XZWwksX54GgeQBuEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    info: {
      message: 'Hello World!',
      info: {
        message: 'The quick brown fox',
        info: {
          message: 'jumps over the lazy dog',
          info: {
            message: 'Thats all folks'
          }
        }
      }
    }
  },
  template: `
    <div>root: {{ JSON.stringify(this) }}</div>
    {{# info }}
      <div>info 1: {{ JSON.stringify(this) }}</div>
      {{# info }}
        <div>info 2: {{ JSON.stringify(this) }}</div>
        {{# info }}
          <div>info 3: {{ JSON.stringify(this) }}</div>
          {{# info }}
            <div>info 4: {{ JSON.stringify(this) }}</div>
          {{/}}
        {{/}}
      {{/}}
    {{/}}
  `,
});

// info 1: {"info":{"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}}
// info 2: {"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}
// info 3: {"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}
// info 4: {"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}
// info 5: {"message":"Thats all folks"}
```

## `@this`

The current Ractive instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tqJmwJPmwnAEZ-akxE7BVJCmQglScAA0TI-A9ldQBhcRjQ4Gpo+Bo0NC0ipXV87HxXRDZxW2wvChVmEA6u+BZqboBaYmQyYgFBgAFsMDJCEVkPDwtnGuxnAEoNAEl4UjSVWq1h7G6W8Lt2zpuevoGWa+6xyenZ+ZYllZrSReACyKmWngshxA6gAMuIhNVypcuB94Hc7Dk-OFgWCIVt9mE7JEJPBCOJkCoRMgERYcsREDAYBcaLtqKtqAASYDLVYiITg7a7A5oHL7ADciTQNjQEpAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    count: 1
  },
  template: `
    <div>Count: {{ count }}</div>
    <button type="button" on-click="@this.add('count')">Increment</button>
    <button type="button" on-click="@this.myMethod()">Log count</button>
  `,
  myMethod(){
    console.log(`current count is ${this.get('count')}`);
  }
});
```

`@this` can also be referenced by using its shorthand `@`.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABETCQLwA64uulRkA9NwK4A7SgGsUAOhIB7ALbcYAQxK5yANwSsAfAW6kK1DSBxF4AJUXK1ACmDMBNGggA2kGgHIARpKQBPV1lv2SPK48i42djTMuFKCuC4AjAE02Em4CNKUjsEILgAGSVEESKoaAMKSsWHANDECtBgY2sUqGgW4BO587JJ2uN6UCCwgnd0CrDQ9ALQkjuQkwkMAAmLySEiWrrW4rgCUmgCSAmTpCHXaI7g9rRH2HV2Xvf2DrBc941Mzcwusy9LeALIIXBgLyWPYgDQAGUkKBqFTO3FeAmu9ly-gif0BwNBO3C9iiUgEREkjgQYkcMMsuRIfBgMFOtC2NHIRBoABJgMCWWI0LgNltdhhcjsANxJDC2DCizBAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    count: 1
  },
  template: `
    <div>Count: {{ count }}</div>
    <button type="button" on-click="@.add('count')">Increment</button>
    <button type="button" on-click="@.myMethod()">Log count</button>
  `,
  myMethod(){
    console.log(`current count is ${this.get('count')}`);
  }
});
```

## `@index`

The current iteration index of the containing repeated section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAAC5PAC1AAeVmjM2IRCaswAEuQAhMwAklyG6fZ+vePlAPRVlNVadsArOcRgRVqp8GgAlADcIFikeOXYxDDkcaT9MMQAvAzgpKRxaisrRDwOIAawA5gA6Yh8QwrGAkCg0L7VVb3R7PaogNBAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

For objects, `@index` is still the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzIUFzAAC5PAC1AAeCWjM2IRCaszdpGDk2KP1APRNlM0aWgXLJcRgVRp58GgAlADcIFikePXYxDDkaaTjMMQAvAzgpKRpasvLiHgaQA1gBzAB0xD4lmWMBIFBon2aKzuDyezRAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: {{ this }}</div>
    {{/each}}
  `
});

// User #0 says: Hi! I am bob!
// User #1 says: Hi! I am alice!
// User #2 says: Hi! I am eve!
```

## `@key`

The current key name of the containing object iteration section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzAXMAAIA1tRCCWjM2IRCap3AzKRg5NhD9QD0TZTNGloFiyXEYFUaefBoAJQA3CBYpHj12MQw5GmkIzDEALwM4KSkaWqLi4jwaV6AHMAHTEPiWRYwEgUGjvZpLG53B7NEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User {{ @key }} says: {{ this }}</div>
    {{/each}}
  `
});

// User bob says: Hi! I am bob!
// User alice says: Hi! I am alice!
// User eve says: Hi! I am eve!
```

For arrays, `@key`'s value will be the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAACANbUQlZozNiEQmrMABLkAITMAJJchun2ft2j5QD0VZTVWnbASznEYEVaqfBoAJQA3CBYpHjl2MQw5HGkvTDEALwM4KSkcWpLS4jwOJtADmADpiHxDEsYCQKDQPtVlrd7o9qiA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @key }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

## `@keypath`

The keypath to the current data context relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEBJZXsMGo0NC1ZpXVO4GAAYmpo2qPOuxm5xeXV9a2dt-3D465T849OyXG5JGC-R4JZ5nV57NbUS6fXarX4nOaQ4HXajZCFAhJPAGw94IjbbZE-I5os4Y7CXLgPPF0hkZJl9bBTeBoACUAG4QGggA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @keypath }}</div>
    {{# foo }}
      <div>Keypath: {{ @keypath }}</div>
      {{# bar }}
        <div>Keypath: {{ @keypath }}</div>
        {{# baz }}
          <div>Keypath: {{ @keypath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, the keypath will remain relative to the instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTHjY+LR0jGq2FUkKZCSVVIADBvjgYABiakKS6jQ0bvzsfHDldQBlCJUYcuBqeFlJL1GtaaV1cfipmZc3D3bqXuoNk88RtG2Z-cmd9QBpFQBPCiSwZeoAAQEHy+2DAt3uu3GvS4owaXXgtQA3NV4H5zCpog0VMhUgByABG4nC7xx9TyiWS5XGklkZGx50ehQJwUpeSqEyu7k8nGoAG1cmyBdg1htcQS8STHmyOadcQAJMjUWTIMjEFQAQhxkuwmH5E0FwrO+PE4tJgqlrk5hvl1BUqg1WrQAF1HmNWdqGpU8mFmq0wp1If1LjTkCJGeJgiJpVzbo98MdLYNiuJmCALiCyIQYyBqFw9nq3VCYXk4bUQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @keypath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: info
// Sender: bob
// Message: Hi eve!
// Keypath: info
```

## `@rootpath`

The keypath to the current data context relative to the originating instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEYGPZV6jQ0LVmldU7gYABiamjaw867GbnF5dX1rZ3xPewwA6OuE5nHp2C7XJIwP4PBJPU4vFY-d7bXbw36HY5zKEgq7UbKQ4EJR6AuFvagXD7I-ZogEY-FYrj3fEXel9BJMhl2KbwNAASgA3CA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @rootpath }}</div>
    {{# foo }}
      <div>Keypath: {{ @rootpath }}</div>
      {{# bar }}
        <div>Keypath: {{ @rootpath }}</div>
        {{# baz }}
          <div>Keypath: {{ @rootpath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, it will be adjusted relative to the originating instance's root data context. This is what primarily sets `@rootpath` apart from `@keypath`.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTFj4tHSMKrYVSQpkJJVUgAN6+OBgAGJqQpLqNDQu-Ox8cOV1AGUIlRhy4Gp4WUkvEa0ppXUx+MnplzcPNuoe6nXjz2G0Lem9ie31AGkVAE8KJLAl6gABGHE4nYXxudx2Yx6XBG9U68BqAG4qvA-OYVNF6ipkKkAOQAI3E4Te2LqeUSyXKY0ksjIWLOD0K+OCFLy8VZ2Eu7k8nGoAG1cmyBdhVuscfjccSHmyOSccQAJMjUWTIMjEFQAQmxkuwmH540FwtOePE4pJgqlrk5hvl1BUqg1WrQAF0HqMWdr6pU8mEmi0wh0IX0LtTkCIGeJgiJpVybg98EdLQNiuJmCBztgwGRCDGQNQuLs3ZDoXlYQiQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @rootpath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: mail.inbox.messages.0
// Sender: bob
// Message: Hi eve!
// Keypath: mail.inbox.messages.1
```

## `@global`

The global object of the current environment. For browsers, it references the `window` object. For Node.js, it references the `global` object.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwB3MvAAm44yMkrChWUJXUG1AOQAJFanHUA6uIwyOYAhG5M8BEASvKKqgAUwBFM2N6Q7gBG4uYAnm4YyWwqkhTIsqnpAAaFKcDA1AACQsjiGbLINnYOTtRoaIXV8GgAlADcIGhAA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
    {{ @global.message }}
  `
});

// Hello World!
```

Ractive can automatically update properties on `@global` via two-way binding. However, for changes caused externally, `ractive.update()` must be called to re-render the UI.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogO4CW8AJgPb4B0AtgKbbYCGA5rQAQC8bA5ABK2oybAOpkYyEgEJuAHXhyASowDGAF0IA3WgApgctmwGQeAIzIkAntwz62q2tQAOyRveMADWzNXBgbAALMyGQmjMg09EysbGhotgYAPMSOiKp2Fo60HDIg9gAeqjlsGmGIWTm+AUEhYREMLOyxOQB88WwJJqmqZPDpmdkgnard8iBsPQC0ysiEygDWA-6qYITYlMHMCrQAZrQwtPDKOgCULQAyZMxs+7v7h+wlyGUJAPRDI629Bu3vPX3lgy6PSKk2mswWOSWKzWGwA4sFQshtKcQM0LldqojiqVaK9fvBPt8fkDeqoMgD8SD4FMZvNFstVpRsLRVAAxMhkABCjBg3IAXsiWgBhMCMeDRbpsHLbDlsUIwOWMPlFEiEfZqZAWPEkwnfDok-4DSljUG0iEgKGMxCOEiuHTcQII2p0eqsbgo5pCs12ITW232bXDHqfNoJMjIXVEhIzT3enLo647PYHI7Yp60IpikhsYJkOZsVx2MDsZQ9bDh3EvGNtRIxr3gqUgBOYsJpsqZ0g5jn5wvLEtliuvatfKN10Xi9h9tjJVJt9hZxOZQvYeyObBsACMBc7ACYh4RI3q63GQCKxRKhNwZUJ5Yq+dw2Kr1apNTl94fawetku0ivaGvN23bMdyAth4DIdRU2WZdV0A-BGHXcC0kYeD9nGbYi3YJ9aDUNhlHHVh3xrdpjwbHJ63mH02D9O03yrA9iOjL9-1oGD-3XLcFxAhckNmSdRTSMxljYP8AJ5dhwPwAtUMrYcoxecNdXcGwvg2LZbhTE49BHPCB2QWh1kubQGTWVhVG0B0W3CF0olod1Ti+TBbDhJ0kWObSiVLeBy30wzmG0IhSAoOpbOOABuWwnK+Zk2Q5bleSVZEPO+QLyCoGyGk4Rtr0VBVQmVEBIrkNBwpALBVDwBJsGUGBCEcX8YGUAYwGGNdIBeF5EHgRw5mYShS2oF4YBUdQtBaV5qtq+rmhANAgA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
  	{{ @global.message }}
    <input type="text" value="{{ @global.message }}">
    <button type="button" on-click="@this.logReference()">Log reference value</button>
    <button type="button" on-click="@this.logGlobal()">Log global value</button>
    <button type="button" on-click="@this.setFooBarBaz()">Change to "foo bar baz" directly</button>
    <button type="button" on-click="@this.update('@global.message')">Click to update</button>

    <ol>
      <li>Click "Log reference value" and look at the console</li>
      <li>Click "Log global value" and look at the console</li>
      <li>Change the input value and repeat steps 1 and 2</li>
      <li>Click "Change to 'foo bar baz' directly"</li>
      <li>Repeat steps 1 and 2 and notice that step 1 was not aware of the direct change</li>
      <li>Click "Click to update"</li>
      <li>Repeat steps 1 and 2 and notice that both steps are now aware</li>
    </ol>
  `,
  logReference(){
    console.log(this.get('@global.message'))
  },
  logGlobal(){
    console.log(window.message);
  },
  setFooBarBaz(){
    window.message = "foo bar baz"
  }
});
```

## `@shared`

`@shared` is a Ractive-global model similar to `@global` but not subject to interference from outside of Ractive.

## `@context`

The context object associated with the current context.

## `@event`

The DOM event that is triggering an event directive. This reference is only available to event directive expressions.

## `@node`

The DOM node associated with an event directive. This reference is only available to event directive expressions.

## `@local`

Special context-local storage associated with the current context. This is intended more for library use with decorators and parser transforms.

## `$n`

`$n` is a reference available when handing events using the expression syntax that points to a specific argument passed by the event. Argument positions are denoted by the `n` which is a one-indexed integer.

```js
const CustomButton = Ractive.extend({
  template: `
    <button on-click="@this.fire('buttonevent', 'foo', 'bar')">Click Me</button>
  `
})

Ractive({
  components: { CustomButton },
  template: `
    <!-- Use with proxy expression syntax -->
    <CustomButton on-buttonevent="['proxy', $1, $2]" />

    <!-- Use with method call -->
    <CustomButton on-buttonevent="@this.method($1, $2)" />
  `,
  on: {
    proxy: function(context, foo, bar){
      console.log(foo, bar);
    }
  },
  method(foo,bar){
    console.log(foo, bar);
  }
})
```

## `arguments`

`arguments` is a reference available when handling events using the expression syntax that points to an array of arguments passed by the event.

```js
const CustomButton = Ractive.extend({
  template: `
    <button on-click="@this.fire('buttonevent', 'foo', 'bar')">Click Me</button>
  `
})

Ractive({
  components: { CustomButton },
  template: `
    <!-- Use with proxy expression syntax -->
    <CustomButton on-buttonevent="['proxy', arguments]" />

    <!-- Use with method call -->
    <CustomButton on-buttonevent="@this.method(arguments)" />
  `,
  on: {
    proxy: function(context, args){
      console.log(args);
    }
  },
  method(foo,bar){
    console.log(args);
  }
})
```

`arguments` is a normal array instance and not the special `arguments` JavaScript variable.

# Initialization Options

The following is an exhaustive list of initialisation options that you can pass to `Ractive()` and `Ractive.extend()`. Extra properties passed as options that are not initialization options are added as properties or methods of the instance.

```js
var ractive = Ractive({
  myMethod: function () {
    alert( 'my method was called' );
  }
});

ractive.myMethod(); // triggers the alert
```



## adapt

`(Array<string|Object>)`

An array of adaptors to use. Values can either be names of registered adaptors or an adaptor definition.

```js
adapt: [ 'MyAdaptor', AdaptorDefinition ]
```

`adapt` is not required if you registered adaptors via the `adaptors` initialization property. The adaptors registered via `adaptors` initialization property are automatically used as if they were set with `adapt`.

```js
const instance = Ractive({
  adaptors: { MyAdaptor: AdaptorDefinition }
  // No need to use adapt
});

const Component = Ractive.extend({
  adaptors: { MyAdaptor: AdaptorDefinition }
  // No need to use adapt
});

new Component({
  // No need to use adapt
});
```



## adaptors

`(Object<string, Object>)`

A map of adaptors where the key is the adaptor name and the value is an adaptor definition.

```js
adaptors: {
  MyAdaptor: AdaptorDefinition
}
```

Registering an adaptor via `adaptors` is not required if you directly specified the adaptor definition via `adapt`.

```js
const Adaptor = { ... };

const instance = Ractive({
  adapt: [ AdaptorDefinition ]
  // No need to use adaptors
});
```



## append

`(boolean|string|HTMLElement|array-like)`

Controls how the instance is attached to `el`. Defaults to `false`.

`false` replaces the contents of `el`.

```html
<!-- before -->
<div id='container'>
  <p>existing content</p>
</div>
```
```js
el: '#container',
append: false,
template: '<p>new content</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>new content</p>
</div>
```

`true` appends the instance to `el`.

```html
<!-- before -->
<div id='container'>
  <p>existing content</p>
</div>
```
```js
el: '#container',
append: true,
template: '<p>new content</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>existing content</p>
  <p>new content</p>
</div>
```

An `id` of the element, a CSS selector to an element, an HTML element, or an array-like object whose first item is an HTML element, which is a child of `el` will render the instance before that element.

```html
<!-- before -->
<div id='container'>
  <p>red</p>
  <p>orange</p>
  <p>yellow</p>
</div>
```
```js
el: '#container',
append: document.querySelector('p:nth-child(2)'),
template: '<p>grey</p>'
```
```html
<!-- after -->
<div id='container'>
  <p>red</p>
  <p>grey</p>
  <p>orange</p>
  <p>yellow</p>
</div>
```



## attributes

`(Object<string, [string]|Object<string, [string]>>)`

An array of optional attributes or a map of optional and required attributes. Defaults to `undefined`.

You can supply a list of optional attributes using an array. You can also supply an object with an `optional` array of attribute names and a `required` array of attribute names. At runtime, if a component is created missing a required attribute, Ractive will issue a warning about missing required attributes. Any attributes that are passed to the component that are _not_ included in either of the `optional` or `required` lists of attributes will be collected into a partial named `extra-attributes` so that they can be included on a top-level element in the component template or split apart to be used in a component `init` event.

```js
const Component = Ractive.extend({
  template: `<div class-component-wrapper {{yield extra-attributes}}>Fancy component doing something with list and type</div>`,
  attributes: {
    required: [ 'list' ],
    optional: [ 'type' ]
  }
});

// <Component type="foo" /> will issue a warning about missing list
// <Component list="{{things}}" style-color="green" /> will not warn, but will include the style-color="green" on the wrapper div
```

The extra attributes passed to a component are not limited to simple attributes - they can also include directives, but any mustache sections will not have their contents checked. By default, the `extra-attributes` will _not_ be mapped, meaning that the values won't be available with `get` from the component, so the partial should be yielded. If you need the extra attributes to be mapped, include an additional setting in the attributes map `mapAll: true`.



## components

`(Object<string, Function>)`

A map of components where the key is the component name the value is either a component definition or a function that returns either a name of a registered component or a component definition. The function form receives processed `data` as first argument.

```js
components: {
  StaticComponent: ComponentDefinition,
  DynamicComponent: function(data){
    return data.foo ? 'MyGlobalComponent' : ComponentDefinition;
  }
}
```

During a `ractive.reset()`, components registered using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## computed

`(Object<string, function|Object>)`

A map of computed properties where the key is the name of the computed property and the value is either a computed property expression, a function that returns a value, or an object that has `get` and `set` functions.

```js
// Imagine a square...
computed: {
  // Computed property expression
  diagonal: '${side} * Math.sqrt(2)',

  // A function
  perimeter: function(){
    return 4 * this.get('side');
  },

  // An object with get and set functions
  area: {
    get: function(){
      return Math.pow(this.get('side'), 2);
    },
    set: function(value){
      this.set('side', Math.sqrt(value));
    }
  },
}
```



## csp

`(boolean)`

Whether or not to add inline functions for expressions after parsing. Defaults to `false`.

This can effectively eliminate `eval` caused by expressions in templates. It also makes the resulting template no longer JSON compatible, so the template will have to be served via `script` tag.



## css

`(string)`

Scoped CSS for a component and its descendants.

```js
css: `
  .bold { font-weight: bold }
`
```

At the moment, only applies to components.

```js
// This works
const Component = Ractive.extend({
  css: '...'
});

// This will not work
Ractive({
  css: '...'
});
```



## data

`(Object<string, any>|Function)`

The data for an instance, or default data for a component. Can either be an object or a function that returns an object.

```js
// Object form
data: {
  foo: 'bar'
}

// Function form
data: function() {
  return { foo: 'bar' };
}

// Function form using arrow function for less verbosity
data: () => ({
  foo: 'bar'
})
```

When using the object form, the data is attached to the component's prototype. Standard prototype rules apply.

```js
const Component = Ractive.extend({
  data: {
    foo: { bar: 42 }
  }
});

var component1 = Component();
var component2 = Component();
component1.set( 'foo.bar', 12 );
component2.get( 'foo.bar' ); // returns 12
```

When using the function form, the function is executed to give each instance a copy of the data. Standard prototype rules apply.

```js
const Component = Ractive.extend({
  data: function () {
    return {
      foo: { bar: 42 }
    };
  }
});

var component1 = Component();
var component2 = Component();
component1.set( 'foo.bar', 12 );
component2.get( 'foo.bar' ); // returns 42
```

When extending from a constructor, data from the parent constructor will be shallow-copied over to the child data. Child data takes precedence in the event of collisions.

```js
const Parent = Ractive.extend({
  data: {
    foo: 'Hello',
    bar: 'World'
  }
});

const Child = Parent.extend({
  data: {
    foo: 'Goodbye'
  }
});

Parent().get(); // { foo: 'Hello', bar: 'World' }
Child().get();  // { foo: 'Goodbye', bar: 'World' }
```



## decorators

`(Object<string, Function>)`

A map of decorators where the key is the decorator name and the value is a decorator definition.

```js
decorators: {
  MyDecorator: DecoratorDefinition
}
```



## delegate

`(boolean)`

Whether or not to enable automatic event delegation for iterative sections within an element. Defaults to `true`.

When enabled, DOM events subscribed within iterative sections will not add a DOM event listener to each element. Instead, a single listener will be installed on the element containing the iterative section, and that listener will find appropriate event directives starting from the target element and working back to the containing element with the listener.



## delimiters

`(Array[string])`

Sets the template delimiters. Defaults to `[ '{{', '}}' ]`.

```js
delimiters: [ '<%=', '%>' ],
template: 'hello <%= world %>',
data: { world: 'earth' }

// result:
// hello earth
```



## easing

`(Object<string, Function>)`

A map of easing functions where the key is the easing function name and the value is the easing function.

```js
easing: {
  MyEasing: EasingDefinition
}
```



## el

`(string|HTMLElement|array-like)`

The element to render an instance to. Can either be an `id` of the element, a CSS selector to an element, an HTML element, or an array-like object whose first item is an HTML element.

```js
el: 'container'
el: '#container'
el: document.getElementById('container')
el: jQuery('#container')
```



## enhance

`(boolean)`

Whether or not to apply progressive enhancement by inspecting the contents of `el` and try to reuse as much of the existing tree as possible. Defaults to `false`.

There are a few limitations to this feature:

- This option cannot be used with `append`.

- Unescaped HTML mustaches (triples) don't play nicely with enhance because there's no easy way to match up the string content to the target DOM nodes.

- All matching elements will be reused, except for a few cases regarding text nodes.

    ```
    <div>left text {{#if foo}} middle text {{/if}} right text</div>
    ```

    HTML does not have markup representation for adjacent text nodes. Rendering the snippet above from the server, regardless of `foo`'s value, the browser creates one contiguous text node. However, Ractive will need _three_ adjacent text nodes to represent it: One for `outer text`, another for `right text` and another for `middle text` when `foo` becomes truthy.

    It has been suggested that Ractive could deal with merged text nodes, but that would lead to extra complexity as there are certain scenarios where the text node would have to split and rejoin. When `foo` is falsey, `left text` and `right text` could be merged. But when `foo` becomes truthy, that text node would have to split in order to accomodate `middle text`.



## events

`(Object<string, Function>)`

A map of events where the key is the event name and value is an event definition.

```js
events: {
  MyEvent: EventDefinition
}
```



## interpolators

`(Object<string, Function>)`

A map of interpolators where the key is the interpolator name and the value is an interpolator definition.

```js
interpolators: {
  MyInterpolator: InterpolatorDefinition
}
```



## isolated

`(boolean)`

Controls whether the component will try to resolve data and plugins on its ancestors. Defaults to `true`.

Relevant only to Components.



## lazy

`(boolean|number)`

Whether or not to update data using late-firing DOM events (i.e. `change`, `blur`) instead of events that fire immediately on interaction (i.e. `keyup`, `keydown`). Defaults to `false`.

```js
var ractive = Ractive({
  lazy: true,
  data: { foo: 'bar' },
  template: `
    <input value="{{foo}}">

    <!-- Updates when the input loses focus -->
    {{ foo }}
  `
});
```

`lazy` also accepts a number value, a millisecond value, that indicates the delay between the last UI interaction and Ractive updating the data. Losing element focus is not required for the update to kick in.

```js
var ractive = Ractive({
  lazy: 1000,
  data: { foo: 'bar' },
  template: `
    <input value="{{foo}}">

    <!-- Updates 1000ms after the last interaction on input -->
    {{ foo }}
  `
});
```

`lazy` is only applicable if `twoway` is `true`.


## nestedTransitions

`(boolean)`

Whether or not to allow transitions to fire if they are already downstream from a transitioning element. Defaults to `true`.

```handlebars
{{#if outer}}
  <div fade-in='slow'>
    Outer text.
    {{#if inner}}
      <div fly-in="fast">Inner text.</div>
    {{/if}}
  </div>
{{/if}}
```

In this example, if `inner` is `true` when `outer` becomes `true`, then all of the `div`s will render at the same time. If `nestedTransitions` is disabled, then the `fly` transition on inner `div` will not be run, since the `fade` will already be running on the outer `div`.

This can also be controlled per transition using the `nested` boolean parameter for transitions:

```handlebars
<div fade-in="{ duration: 'slow', nested: false }">...</div>
```



## noCssTransform

`(boolean)`

Prevents component CSS from being transformed with scoping guids. Defaults to `false`.



## noIntro

`(boolean)`

Whether or not to skip intro transitions on initial render. Defaults to `false`.

```js
var ractive = Ractive({
  template: '<ul>{{#items}}<li fade-in>{{.}}</li>{{/items}}</ul>',
  data: { items: [ 'red', 'blue' ] },
  transitions: { fade: function ( t, params ) {...} },
  noIntro: true
});
// 'red' and 'blue' list items do not fade in

ractive.push( 'items', 'green' );
// 'green' list item will fade in
```



## noOutro

`(boolean)`

Whether or not to skip outro transitions during an instance unrender. Defaults to `false`.

```js
var ractive = Ractive({
  template: '<ul>{{#items}}<li fade-out>{{.}}</li>{{/items}}</ul>',
  data: { items: [ 'red', 'blue' ] },
  transitions: { fade: function ( t, params ) {...} },
  noOutro: true
});

ractive.pop( 'items' );
// 'blue' list item will fade out

ractive.unrender();
// 'red' list item will not fade out
```



## observe

`(Object<string, Function|Object>)`

A hash of observers to subscribe during initialization and unsubscribe during teardown. Defaults to `undefined`.

The keys of the hash may be any string that is accepted by `ractive.observe()`, and the values may be either callback functions, as would be passed to `ractive.observe()`, or objects with a `handler` property that is a callback function. The object form also takes other options that control the behavior of the observer.

```js
Ractive({
  // ..
  observe: {
    show ( value ) {
      console.log( `show changed to '${value}'` );
    },
    'users.*.name people.*.name': {
      handler ( value, old, path, idx ) {
        console.log( `${path} changed to '${value}'` );
      },
      init: false,
      strict: true
    }
  }
});
```

The options that may be specified in the object form are (see the `ractive.observe()` docs for more detailed option descriptions):

* `handler (Function)`: The callback function for the observer.
* `once (boolean)`: Use `ractive.observeOnce()` rather than `ractive.observe()` to install the observer, meaning the observer is implicitly `init: false`, will only fire for the first change to the observed path, and will by removed after the first change.
* `strict (boolean)`: Use strict equality when determining whether or not a value has changed.
* `array (boolean)`: Use an array observer rather than a plain observer.
* `defer (boolean)`: Defer the observer until after the DOM is settled.
* `init (boolean)`: Whether or not to fire an initial change event.
* `links (boolean)`: Whether or not to follow links.
* `context (any)`: Context for the callback function.
* `old (Function)`: Modifier function for the `old` value passed to the callback function.

When a sublcass created with `Ractive.extend()` is passed an `observe` hash, then any further subclasses or instances created with an `observe` hash will be combined. Any superclass observers are installed first following the inheritance hierarchy, and finally, any instance observers are installed.



## on

`(Object<string, Function|Object>)`

A hash of event listeners to subscribe during initialization and unsubscribe during teardown. Defaults to `undefined`.

The keys of the hash may be any string that is accepted by `ractive.on()`, and the values may be either callback functions, as would be passed to `ractive.on()`, or objects with a `handler` property that is a callback function. The object form also takes other options that control the behavior of the event handler.

```js
Ractive({
  // ...
  on: {
    init: function(){
      console.log('I will print during init');
    },
    '*.somethingHappened': {
      handler ( ctx ) {
        console.log('I will fire when this instance or any child component fires an instance event named "somethingHappened"');
      },
      once: true
    }
  },
  // ...
});
```

The options that may be specified in the object form are:

* `handler (Function)`: The callback function for the event.
* `once (boolean)`: Use `ractive.once()` rather than `ractive.on()` to subscribe the listener, meaning that the handler will only be called the first time the event is fired and then it will be unsubscribed.

`on` event listeners may subscribe to any instance event, including lifecycle events _after_ `construct`. When a sublcass created with `Ractive.extend()` is passed an `on` hash, then any further subclasses or instances created with an `on` hash will be combined. Any superclass event handlers are installed first following the inheritance hierarchy, and finally, any instance event handlers are installed.



## oncomplete

`(Function)`

A lifecycle event that is called when the instance is rendered and all the transitions have completed.



## onconfig

`(Function)`

A lifecycle event that is called when an instance is constructed and all initialization options have been processed.



## onconstruct

`(Function)`

A lifecycle event that is called when an instance is constructed but before any initialization option has been processed.

Accepts the instance's initialization options as argument.



## ondestruct

`(Function)`

A lifecycle event that is called when an instance is torn down and any associated transitions are complete.



## ondetach

`(Function)`

A lifecycle event that is called whenever `ractive.detach()` is called.

Note that `ractive.insert()` implicitly calls `ractive.detach()` if needed.



## oninit

`(Function)`

A lifecycle event that is called when an instance is constructed and is ready to be rendered.



## oninsert

`(Function)`

A lifecycle event that is called when `ractive.insert()` is called.



## onrender

`(Function)`

A lifecycle event that is called when the instance is rendered but _before_ transitions start.



## onteardown

`(Function)`

A lifecycle event that is called when the instance is being torn down.



## onunrender

`(Function)`

A lifecycle event that is called when the instance is being undrendered.



## onupdate

`(Function)`

A lifecycle event that is called when `ractive.update()` is called.



## partials

`(Object<string, string|Object|Function>)`

A map of partials where the key is the partial name and the value is either a template string, a parsed template object or a function that returns any of the previous options. The function form accepts processed `data` and  Parse Object as arguments.

```js
partials: {
  stringPartial: '<p>{{greeting}} world!</p>',
  parsedPartial: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},
  functionPartial: function(data, p){
    return data.condition ? '<p>hello world</p>' : '<div>yes, we have no foo</div>';
  }
}
```

During a `ractive.reset()`, function partials are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## preserveWhitespace

`(boolean)`

Whether or not to preserve whitespace in templates when parsing. Defaults to `false`.

Whitespace in `<pre>` elements is always preserved. The browser will still deal with whitespace in the normal fashion.

```js
var ractive = Ractive({
  template: '<p>hello\n\n  \tworld   </p>',
  preserveWhitespace: false //default
});

console.log( ractive.toHTML() );
// "<p>hello world</p>"

var ractive = Ractive({
  template: '<p>hello\n\n  \tworld   </p>',
  preserveWhitespace: true
});

console.log( ractive.toHTML() );
//"<p>hello
//
//  world   </p>"
```



## resolveInstanceMembers

`(boolean)`

Whether or not to include members of the Ractive instance at the end of the reference resolution process. Defaults to `true`.

```handlebars
<button on-click="toggle('show')">Toggle</button>
```

If there is no data member `toggle` in the context of the template, with `resolveInstanceMembers` enabled, the reference will resolve to the `ractive.toggle()` method of the instance.



## sanitize

`(boolean|Object)`

Whether or not certain elements will be stripped from the template during parsing.  Defaults to `false`.

`true` strips out blacklisted elements and event attributes. See `Ractive.parse()` for the default list of blacklisted elements.

```js
template: `
  <p>some content</p>
  <frame>Am I a bad element or just misunderstood?</frame>
`,
sanitize: true

// result:
// <p>some content</p>
```

The object form should have `elements` which is an array of blacklisted elements and `eventAttributes` boolean which, when `true`, also strips out event attributes.

```js
template: `
  <p>some content</p>
  <div onclick="doEvil()">the good stuff</div>
`,
sanitize: {
  elements: [ 'p' ],
  eventAttributes: true
}

// result:
// <div>the good stuff</div>
```



## staticDelimiters

`(Array[string])`

Sets the static (one-time binding) delimiters. Defaults to `[ '[[', ']]' ]`.

```js
var ractive = Ractive({
  template: 'hello [[foo]]',
  staticDelimiters: [ '[[', ']]' ], //default
  data: { foo: 'world' }
});
// result: "hello world"

ractive.set( 'foo', 'mars' );
// still is: "hello world"
```



## staticTripleDelimiters

`(Array<string>)`

Sets the static (one-time binding) triple delimiters. Defaults to `[ '[[[', ']]]' ]`.

```js
var ractive = Ractive({
  template: 'hello [[[html]]]',
  staticTripleDelimiters: [ '[[[', ']]]' ], //default
  data: { html: '<span>world</span>' }
});
// result: "hello <span>world</span>"

ractive.set( 'html', '<span>mars</span>' );
// still is: "hello world"
```



## stripComments

`(boolean)`

Whether or not to remove comments in templates when parsing. Defaults to `true`.

```js
template: '<!-- html comment -->hello world',
stripComments: false

// result:
// <!-- html comment -->hello world
```



## syncComputedChildren

`(boolean)`

Whether or not to invalidate the dependencies of an expression when child keypaths of the expression are updated. Defaults to `false`. _Note_: setting this to `true` may cause performance issues for complex expressions involving large arrays.

```handlebars
<input value="{{pattern}}" />
{{#each filter(users, pattern)}}
  <input value="{{.name}}" />
{{/each}}
```

In this example, the `input` inside the iteration is bound to a computation e.g. `filter(users, pattern).0.name` that isn't actually an addressable model. With `syncComputedChildren` enabled, when that virtual keypath is updated by a user changing the `input`, the expression will invalidate its dependencies (`filter`, `users`, and `pattern`), which will cause any other references to the `user` that happens to coincide with result of the expression to also update.



## target

`(string|HTMLElement|array-like)`

Alias for `el`.



## template

`(string|array|object|function)`

The template to use. Must either be a CSS selector string pointing to an element on the page containing the template, an HTML string, an object resulting from `Ractive.parse()` or a function that returns any of the previous options. The function form accepts processed `data` and a Parse Object.

```js
// Selector
template: '#my-template',

// HTML
template: '<p>{{greeting}} world!</p>',

// Template AST
template: {"v":3,"t":[{"t":7,"e":"p","f":[{"t":2,"r":"greeting"}," world!"]}]},

// Function
template: function(data, p){
  return '<p>{{greeting}} world!</p>';
},
```

During a `ractive.reset()`, templates provided using a function are re-evaluated. If the return value changes, the Ractive instance will be re-rendered.



## transitions

`(Object<string, Function>)`

A map of transitions where the key is the name of the transition and the value is a transition definition.



## transitionsEnabled

`(boolean)`

Whether or not transitions are enabled. Defaults to `true`.



## tripleDelimiters

`(Array[string])`

Sets the triple delimiters. Defaults to `[ '{{{', '}}}' ]`.

```js
template: 'hello @html@',
tripleDelimiters: [ '@', '@' ],
data: { html: '<span>world</span>' }

// result:
// hello <span>world</span>
```



## twoway

`(boolean)`

Whether or not two-way binding is enabled. Defaults to `true`.

```js
var ractive = Ractive({
  template: '<input value="{{foo}}">',
  data: { foo: 'bar' },
  twoway: false
});

// user types "fizz" into <input>, but data value is not changed:

console.log( ractive.get( 'foo' ) ); //logs "bar"

// updates from the model are still pushed to the view

ractive.set( 'foo', 'fizz' );

// input now displays "fizz"
```



## warnAboutAmbiguity

`(boolean)`

Whether or not to warn about references that don't resolve to their immediate context. Defaults to `false`.

Ambiguous references can be the cause of some strange behavior when your data changes structure slightly. With `warnAboutAmbiguity` enabled, Ractive will warn you any time a reference isn't scoped and resolves in a context above the immediate context of the reference.

# Static Properties

## Ractive.adaptors

`(Object<string, Object>)`

The registry of globally available adaptors.

## Ractive.components

`(Object<string, Function>)`

The registry of globally available component definitions.

## Ractive.DEBUG

`(boolean)`

Tells Ractive if it's in debug mode or not. When set to `true`, non-fatal errors are logged. When set to `false`, non-fatal errors are suppressed. By default, this is set to `true`.

## Ractive.DEBUG_PROMISES

`(boolean)`

Tells Ractive to log errors thrown inside promises. When set to `true`, errors thrown in promises are logged. When set to `false`, errors inside promises are suppressed. By default, this is set to `true`.

## Ractive.decorators

`(Object<string, Function>)`

The registry of globally available decorators.

## Ractive.defaults

`(Object<string, any>)`

Global defaults for initialisation options with the exception of plugin registries.

```js
// Change the default mustache delimiters to [[ ]] globally
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Future instances now use [[ ]]
ractive1 = Ractive({
    template: 'hello [[world]]'
});
```

Defaults can be specified for a subclass of Ractive, overriding global defaults.

```js
var MyRactive = Ractive.extend();

MyRactive.defaults.el = document.body;
```

Configuration on the instance overrides subclass and global defaults.

```js
Ractive.defaults.delimiters = [ '[[', ']]' ];

// Uses the delimiters specified above
Ractive({
	template: 'hello [[world]]'
});

// Uses the delimiters specified in the init options
Ractive({
	template: 'hello //world\\',
	delimiters: [ '//', '\\' ]
});
```

## Ractive.easing

`(Object<string, Function>)`

The global registry of easing functions.

The easing functions are used by the `ractive.animate` method and by transitions. Four are included by default: `linear`, `easeIn`, `easeOut` and `easeInOut`.

## Ractive.events

`(Object<string, Function>)`

The global registry of custom event plugins.

## Ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by `ractive.animate()` or non-CSS transitions.

## Ractive.partials

`(Object<string, string|Object|Function>)`

The global registry of partial templates.

Like templates, partials are parsed at the point of use. The parsed output is cached and utilized for future use.

## Ractive.svg

`(boolean)`

Indicates whether or not the browser supports SVG.

## Ractive.transitions

`(Object<string, Function>)`

The global registry of transition functions.

## Ractive.VERSION

`(string)`

The version of the currently loaded Ractive.

# Static Methods

## Ractive.escapeKey()

Escapes the given key so that it can be concatenated with a keypath string.

**Syntax**

- `Ractive.escapeKey(key)`

**Arguments**

- `key (string)`: The key to escape.

**Returns**

- `(string)`: The escaped key.

**Examples**

* Simple example

        Ractive.escapeKey('foo.bar'); // 'foo\\.bar'


* [Playground example](https://ractive.js.org/playground/?env=docs#N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOiAPYCuuADi-QHwED0JpnWgDsCAZwDGMYq1yUa9YkPa565XAE9WCOngQAPXDxgBDcbjIIuw2rgKtBKlUJs2CAIxa4GQ8t4C04gA2xOIA1jriYMZCaACqMIFcAMJRMQjksQBKADK8HrheQoLOju6e3r5CAcFhEalxCQBMyfXpWdnkABQA7sS4YOSZpuakCAB0CBLGWp0AlLN55UXWtjz2K3ac5Cs2TAm+AGbbIMZjAFasKKrEopDk7pzAwJQAtigA2gDkpxconwC6Yz2gXIGAweS2GzWxV4EikMk4IBwongQgQ3UGwwsnWAK1wxhgaFwd0+AGJmGwWJ8sHiEC9WIFjLgECTSYplNSVt5oDtcJFog1AncDkwhGZiN45riSi4CmAbmNRAhcJ1PsQ3mNjLRtbRzpcgQlqcceC91Dw0d01kywHqriBZgBuXnYXn8tLxQKNYWi8WS2bS2U2U2hBDqcjUcjfW2fJ0yxz9BVKlVqjWfcgAakx4tGEymWgA0qHOsHQ7MM5GDYEjfQeP0EDwGHWYFb+rb6I7nSsXSUkEzjHcA451SgB7ybFHfp9R3HZcC7jXWNbawweD9LvQx7gMJ2StuZUIMLNMEA)

## Ractive.extend()

Creates a "subclass" of the Ractive constructor or a subclass constructor. See `Components` for an in-depth discussion on the use of `Ractive.extend`.

**Syntax**

- `Ractive.extend([options[, ...optionsN]])`

**Arguments**

- `options] (Object)`: One or more objects that represent the defaults for instances of the subclass, with the latter objects' properties taking precedence over the former. See [Initialization Options for a list of possible options.

**Returns**

- `(Function)`: The subclass constructor function.

**Examples**

```js
const SubClass = Ractive.extend({
    template: '<div>{{message}}</div>',
    data: {
        message: 'Hello World!'
    }
});

// <div>Hello World!</div>
const instance1 = SubClass({
    el: '.div1'
});

// <div>Lorem Ipsum</div>
const instance2 = SubClass({
    el: '.div2',
    data: {
        message: 'Lorem Ipsum'
    }
});
```

## Ractive.extendWith()

Creates a "subclass" of the Ractive constructor or a subclass constructor using an existing constructor. The constructor will be augmented with static methods like `extend`, and it will also process the given initialization options.

**Syntax**

- `Ractive.extendWith(constructor[, options])`

**Arguments**

- `constructor (Function)`: A class constructor - like an ES6 `class`, a plain JavaScript function with a prototpye, or another similarly constructed function (TypeScript, CoffeeScript, etc).
- `options (Object)`: An object with initialization options as properties. See initialization options for a list of possible options.

**Returns**

- `(Function)`: The augmented constructor function.

**Examples**

```js
class Widget {
  notify ( message ) {
    this.push( 'messages', message );
  }

  show () {
    this.set( 'visible', true );
  }

  hide () {
    this.set( 'visible', false );
  }
}

Ractive.extendWith( Widget, {
  template: '{{#if visible}}<ul>{{#each messages}}<li>{{.}}</li>{{/each}}</ul>{{/if}}'
});
```

## Ractive.getCSS()

Returns the scoped CSS from Ractive subclasses defined at the time of the call.

If used without arguments, it will return the scoped CSS of all subclasses. If provided an array of scoping IDs, it will return the scoped CSS of all subclasses whose scoping ID is included in the array.

**Syntax**

- `Ractive.getCSS([key])`

**Arguments**

- `[key] (Array<string>)`: Subclass CSS scoping ID.

**Returns**

- `(string)`: The scoped CSS.

**Examples**

```js
// Assuming the generated ID for this subclass is 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.
const Subclass1 = Ractive.extend({
    ...
    css: 'div{ color: red }'
    ...
});

// Assuming the generated ID for this subclass is 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'.
const Subclass2 = Ractive.extend({
    ...
    css: 'div{ color: green }'
    ...
});

// CSS contains the scoped versions of div{ color: red } and div{ color: green }.
const css = Ractive.getCSS();

// css contains the scoped version of div{ color: red } only.
const css = Ractive.getCSS([ 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' ]);

```

## Ractive.getContext()

Accepts a node and returns a Context object containing details of the Ractive instance the node is associated to.

**Syntax**

- `Ractive.getContext(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of the DOM node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(Context)`: A context object.

**Examples**

```js
const info = Ractive.getContext(document.getElementById('some-node'));

const info = Ractive.getContext('#some-node');
```

## Ractive.joinKeys()

Joins the given keys into a properly escaped keypath.

**Syntax**

- `Ractive.joinKeys(key1 [, ...keyN])`

**Arguments**

- `key (string)`: One or more strings to join.

**Returns**

- `(string)`: A properly joined and escaped keypath.

**Examples**

```js
Ractive.joinKeys( 'foo', 'bar.baz' ); // foo.bar\.baz
```

## Ractive.parse()

Parses the template into an abstract syntax tree that Ractive can work on.

**Syntax**

- `Ractive.parse(template[, options])`

**Arguments**

- `template (string)`: A Ractive-compliant HTML template.
- `[options] (Object)`: Parser options.
    - `[delimiters] ([string])`: Start and end delimiters for normal mustaches. Defaults to `['{{', '}}']`.
    - `[tripleDelimiters] ([string])`: Start and end delimiters for triple mustaches. Defaults to `['{{{', '}}}']`.
    - `[staticDelimiters] ([string])`: Start and end delimiters for static mustaches. Defaults to `['[[', ']]']`.
    - `[staticTripleDelimiters] ([string])`: Start and end delimiters for static triple mustaches. Defaults to `['[[[', ']]]']`.
    - `[contextLines] (integer)`: Additional lines above and below a line with a parse error to include in the error output. Defaults to `0`.
    - `[interpolate] (Object<string, boolean>)`: Map of elements that indicates whether or not to read mustaches within the element. Defaults to `{ script: false, textarea: true, template: false, style: false }`.
    - `[csp]`(boolean)`: When `true` includes pre-compiled expression functions in the template output so that `eval` is not needed at runtime. Defaults to `true`.
    - `[preserveWhitespace] (boolean)`: When `true`, preserves whitespace in templates. Whitespace inside the `<pre>` element is preserved regardless of the value of this option. Defaults to `false`.
    - `[stripComments] (boolean)`: When `false` will leave comments in the parsed template. Defaults to `true`.
    - `[sanitize] (boolean|Object)`: When `true`, strips inline event attributes and certain elements from the markup. Defaults to `false`.
        - `[elements] (Array<string>)`: An array of element names to blacklist.
        - `[eventAttributes] (boolean)`: When `true`, strips off inline event attributes.
    - `[includeLinePositions] (boolean)`: When `true` will include line positions on each node of the parser output. Defaults to `false`.
    - `[textOnlyMode] (boolean)`: When `true` parses elements as text rather than elements. This is useful for generating raw HTML from a template, more like a plain text templating processor. Defaults to `false`.
    - [transforms|parserTransforms] ([Function])`: An array of post-parsing transforms to apply to the output parser AST.


When `sanitize` is `true`, the following elements are stripped:

- `<applet>`
- `<base>`
- `<basefont>`
- `<body>`
- `<frame>`
- `<frameset>`
- `<head>`
- `<html>`
- `<isindex>`
- `<link>`
- `<meta>`
- `<noframes>`
- `<noscript>`
- `<object>`
- `<param>`
- `<script>`
- `<style>`
- `<title>`

**Returns**

- `(Object)` - The object representation of the provided markup.

**Examples**

Assume the following markup.

```html
<div class='gallery'>
  {{#each items}}
    <!-- comments get stripped out of the template -->
    <figure on-tap='select' staggered-in>
      <img class='thumbnail' src='assets/images/{{id}}.jpg'>
      <figcaption>{{( @index+1 )}}: {{description}}</figcaption>
    </figure>
  {{/each}}
</div>
```

`Ractive.parse( template );` will yield the following output:

```js
{"v":4,"t":[{"t":7,"e":"div","m":[{"n":"class","f":"gallery","t":13}],"f":[{"t":4,"f":[" ",{"t":7,"e":"figure","m":[{"n":["tap"],"t":70,"f":"select"},{"n":"staggered","t":72,"v":"t1"}],"f":[{"t":7,"e":"img","m":[{"n":"class","f":"thumbnail","t":13},{"n":"src","f":["assets/images/",{"t":2,"r":"id"},".jpg"],"t":13}]}," ",{"t":7,"e":"figcaption","f":[{"t":2,"x":{"r":["@index"],"s":"_0+1"}},": ",{"t":2,"r":"description"}]}]}],"n":52,"r":"items"}]}],"e":{'_0+1': function(_0) { return _0+1; }}}
```

## Ractive.splitKeypath()

Splits the given keypath into an array of unescaped keys.

**Syntax**

- `Ractive.splitKeypath(keypath)`

**Arguments**

- `keypath (string)`: The keypath to split into keys.

**Returns**

- `(Array)`: Returns an array of unescaped keys.

**Examples**

```js
Ractive.splitKeypath( 'foo.bar\\.baz' ); // [ 'foo', 'bar.baz' ]
```

## Ractive.unescapeKey()

Unescapes the given key e.g. `foo\\.bar` => `foo.bar`.

**Syntax**

- `Ractive.unescapeKey(key)`

**Arguments**

- `key (string)`: The key to unescape.

**Returns**

- `(string)`: The unescaped key.

**Examples**

```js
Ractive.unescapeKey('foo\\.bar'); // foo.bar
```

# Instance Properties

## ractive.adaptors

`(Object<string, Object>)`

The instance-only registry of adaptors.

## ractive.components

`(Object<string, Function>)`

The instance-only registry of components.

## ractive.container

`(Ractive)`

Each component instance that is in a yielded fragment has a container instance that is accessible using `this.container`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

If `bar` `{{yield}}`s, then `baz`'s container will be the `foo` instance.

## ractive.decorators

`(Object<string, Function>)`

The instance-only registry of decorators.

## ractive.easing

`(Object<string, Function>)`

The instance-only registry of easing functions.

## ractive.events

`(Object<string, Function>)`

The instance-only registry of custom event plugins.

## ractive.interpolators

`(Object<string, Function>)`

A key-value hash of interpolators use by `ractive.animate()` or non-CSS transitions.

## ractive.parent

`(Ractive)`

Each component instance can access its parent using `this.parent`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`baz`'s parent is the `bar` instance, and `bar`'s parent is the `foo` instance.

## ractive.partials

`(Object<string, string|Object|Function>)`

The instance-only registry of partials.

## ractive.root

`(Ractive)`

Each component instance can access its root Ractive instance using `this.root`.

```html
<foo>
  <bar>
    <baz />
  </bar>
</foo>
```

`foo`, `bar`, and `baz` will all have the Ractive instance with this template as their `root`.

## ractive.transitions

`(Object<string, Function>)`

The instance-only registry of transitions.

# Instance Methods

## ractive.\_super()

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

## ractive.add()

Increments the selected keypath.

**Syntax**

- `ractive.add(keypath[, number])`

**Arguments**

- `keypath (string)`: The keypath of the number we're incrementing.
- `[number] (number)`: The number to increment by. Defaults to `1`.

**Returns**

- `(Promise)`: A promise that resolves when any transitions associated with the operation complete.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiQmJkzC-r1CmarNeY0ENDOEDQBzTPOvxZud0GD0eEzw9AAjMNoaCVAtlqt1lpNjtlHsDkcTj1zpdrrdtAMYBVIcNYeoDhhXu9Pj8-gD8aZgZNQfh6AAmaGk6a4IA"></div>

```js
var r = Ractive({
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

## ractive.animate()

Similar to `ractive.set()`, this will update the data and re-render any affected mustaches and notify observers.

All animations are handled by a global timer that is shared between Ractive instances (and which only runs if there are one or more animations still in progress), so you can trigger as many separate animations as you like without worrying about timer congestion. Where possible, `requestAnimationFrame` is used rather than `setTimeout`.

Numeric values and strings that can be parsed as numeric values can be interpolated. Objects and arrays containing numeric values (or other objects and arrays which themselves contain numeric values, and so on recursively) are also interpolated.

Note that there is currently no mechanism for detecting cyclical structures! Animating to a value that indirectly references itself will cause an infinite loop.

Future versions of Ractive may include string interpolators - e.g. for SVG paths, colours, transformations and so on, a la D3 - and the ability to pass in your own interpolator.

If an animation is started on a keypath which is *already* being animated, the first animation is cancelled. (Currently, there is no mechanism in place to prevent collisions between e.g. `ractive.animate('foo', { bar: 1 })` and `ractive.animate('foo.bar', 0)`.)

**Syntax**

- `ractive.animate(keypath, value[, options])`

**Arguments**

- `keypath (string)`: The keypath to animate.
- `value (number|string|Object|Array)`: The value to animate to.
- `[options] (Object)`:
    - `[duration] (number)`: How many milliseconds the animation should run for. Defaults to `400`.
    - `[easing] (string|Function)`: The name of an easing function or the easing function itself. Defaults to `linear`.
    - `[step] (Function)`: A function to be called on each step of the animation. Receives `t` and `value` as arguments, where `t` is the animation progress (between `0` and `1`, as determined by the easing function) and `value` is the intermediate value at `t`.
    - `[complete] (Function)`: A function to be called when the animation completes, with the `value` passed to `animate`.

**Returns**

- `(Promise)`: Returns a Promise which resolves with the target `value` and has an additional `stop` method, which cancels the animation.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NinIB7AK7L0MSPWDBNOvThwqSEitTpLVykkyoA3Rqw4ykVVYqvOXBRACDHgXJBh6SJZ6ZTQAd3oAJSRyFFc0AApgFTU0BAMAcgBiLx9CvFyUdBkuVDQi4pQuCqqmVCQDHNUUNRNdNH16AAYqi2UcAEoAblzlDDQUABUqGTRtFEyAMx00qg1lTMnDKpgAOiRlVfrMwv69CvoAJmG8Q3omLRhUfeUDF+Gw3oU1mEzeAEZAcMZrggA"></div>

```js
var r = Ractive({
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

## ractive.attachChild()

Creates a parent-child relationship between two Ractive instances. The child may be an instance of a component defined by `Ractive.extend()`, but that is not a requirement, as children may be a plain Ractive instance created with `Ractive()`.

**Syntax**
```js
ractive.attachChild( child );
ractive.attachChild( child, options );
```

**Arguments**

- `child (Ractive instance)`: The child instance to attach.
- `[options] (Object)`:
    - `target] (string)`: An anchor name at which to render the instance. See [`Components`. If the instance is already rendered, it will be unrendered and re-rendered at an appropriate anchor.
    - `[append] (boolean)`: Default `true` - add the instance to the end of the list for the targeted anchor.
    - `[prepend] (boolean)`: Add the instance to the beginning of the list for the targeted anchor.
    - `[insertAt] (number)`: Index at which to add the instance in the list for the targeted anchor.

When a child is attached to a parent, the child's `parent` property is updated in an observable way, so any references to `@this.parent` in the child will be notified of the change.

A child may be targeted to a `Components` when it is attached. If a child has no specified target, then it is responsible for managing its own render cycle. If a child does have a specified target, then the parent will manage rendering and unrendering the child as appropriate in the same way that a regular component has a managed render cycle.

When a child is attached targeting an anchor, only anchors that belong directly to the parent are considered as hosts. However, any element or component queries on the parent instance, including live queries, will consider the child when trying to match both elements and components. There is also an option on the query methods that allows querying remote, unmanaged instances, so that non-anchored children can also be queried for elements and components.

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

Children can be detached using `ractive.detachChild()`.

**Examples**

```js
// TODO
```

## ractive.detach()

Detaches the instance from the DOM, returning a document fragment. You can reinsert it, possibly in a different place, with `ractive.insert()` (note that if you are reinserting it immediately you don't need to detach it first - it will happen automatically).

**Syntax**

- `ractive.detach()`

**Arguments**

- None

**Returns**

- `(DocumentFragment)`: A document fragment.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJgAjAvIB7AK7L0MSPWDA9h4zhwkp2lWqTKm9DLplpeYlCrsVqOiVVZRImKgA3RlYOGSQqVUU7cIiFEAIMeAikGHpclnplNAB3egAlJHIUSLQACmBHdARTAHIAYjiElrxG9BkuVDRWtpQubsamVCRTBtVfFEsjNBN6AAZGnBUcAEoAbkdlDDQUABUqTwMUWoAzQyqqXWVa7bNG7NyU+gKmXXJ9TyMADpKGhBgBRBBoAFXFopFp7CaRQFIGiCFwAYTAVAQTFqMEBTGOlTAzwRcz0h10kMBCF0AHNailAQkijAABInACyABkyfh6JpVkK9rggA"></div>

```js
var r = Ractive({
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

## ractive.detachChild()

Detaches a child from an instance when it was previously attached with `ractive.attachChild()`.

When a child instance that was attached targeting an anchor is detached, its instance is spliced out of the `@this.children.byName.anchorName` array so that subsequent children move forward to fill the void.

**Syntax**

- `ractive.detachChild( child )`

**Returns**

- `(Promise)`: A `Promise` that resolves with the child instance when any transitions are complete.

**Examples**

```js
// TODO
```

## ractive.find()

Returns the first element inside a given Ractive instance matching a CSS selector. This is similar to doing `this.el.querySelector(selector)` (though it doesn't actually use `querySelector()`).

**Syntax**

- `ractive.find(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the element to find.
- `[options] (Object)`:
    - `remote (boolean}`: Include attached children that are not rendered in anchors when looking for matching elements. Defaults to `false`.

**Returns**

- `(Node)`: A Node.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnsaPtdn4se0mLdXjQ-HFEslXrCguRCU0EGg-NUErdmej0DBTEiALLpTnKfD0ACMAAYVbDcEA"></div>

```js
var r = Ractive({
	el: '#main',
	template: '#tpl'
});

setTimeout(function() {
	var p = r.find('p.target');
	console.log(p.outerHTML);
}, 1000);
```

## ractive.findAll()

This method is similar to [`ractive.find()`]ractivefind), with an important difference - it returns a list of elements matching the selector, rather than a single node.

**Syntax**

- `ractive.findAll(selector[, options])`

**Arguments**

- `selector (string)`: A CSS selector representing the elements to find.
- `[options] (Object)`:
    - `remote (boolean)`: Include attached children that are not rendered in anchors when searching for elements. Defaults to `false`.

**Returns**

- `(Array<Node>)`: An array of nodes.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NihJMqANyWqUakmABMCgBJokTNDBJSTKtQZq7H+lAEllKGAHsAdAEObrbOQU705MgYGMIoSDAA5mj6imFuADI+MGgyjDQYAK4yePQFYCVMPghZ9EgyySUYPvUoYFTKCQF+aSEu6hKaOiq2FNR0Lsoa2oysHDJI7RwKtoMKIAQY8Frx9DD0LPTKaADu9ABKSOQo2mgAFMBBaAiQ9ADkAMTz7a94QegyXFQaBeHxQXFeKhwAEoANwOZQYZIAFSo9R8BRQtwAZgVlFcqD5lLcofQHnptnt8vtdn4se0mABBBAIW6vGivWFBfK0rIAUUuYGxuPxhNuNBJZNc5EJTQQaD81QSYr86PQMFMSIAsulOXpoZCSgBGAAMpthuCAA"></div>

```js
var r = Ractive({
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

## ractive.findAllComponents()

Returns all components inside a given Ractive instance with the given `name` (or all components of any kind if no name is given).

**Syntax**

- `ractive.findAllComponents([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`:
    - `remote (boolean)`: Include attached children that are not rendered in anchors when searching components. Defaults to `false`.

**Returns**

- `(Array<ractive>)`: An array of ractive instances.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cgYeiDGBxel1JgAQQQCGxCNmmzhGJQ60uMIwQu8MAAorowAymSyqGzyBzkY4ULDlBhvAgJghvABzWbkOIobwACTJAFkADLspV4s6nUxGAAMIcuuCAAa"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = Ractive({
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

## ractive.findComponent()

Returns the first component inside a given Ractive instance with the given `name` (or the first component of any kind if no name is given).

**Syntax**

- `ractive.findComponent([name[, options]])`

**Arguments**

- `[name] (string)`: The name of the component to find.
- `[options] (Object)`:
    - `remote (boolean)`: Include attached children that are not rendered in anchors when searching components. Defaults to `false`.

**Returns**

- `(Ractive)`: A ractive instance.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeDAYxgEsAHFAAioBMBeAHUJoQ-pQE8aadoTQAPFAHowKALbcQAPjYA7NimDAAxGiTkw9ANoBGPPQBMpgMwBdHDhVq1JJlQBuCkgGEA9jJrflNGUGZQBXGQAjNBhhDQA6Ox4JDwkXdwd1YAkdPUTlEgkKajolVXy0xlYOGSQqVUUCtIUQAgx4VyQYeh8-AKCGFnoAJV0UNzQ4sXRlJgAKYAz0P2R0SHoAch7-QOD6DTDI6Lt1lRwASgBuB2UOrq7BwIB3YdHx+Yy0BDX1zRq69bwizQy1QaG+mhQXABGXIvm2-QwawWqhQai2fWCa3RO1RKPsynOVzKGDQKAAKlQZGhvKEULMAGahZTkMYBWZnPYZW70cj0QYwOL0upMbH9WabOEYlDrS4wgIYbwICYIbwAc1m5DiKG8AAkyQBZAAy7NlBNMRgADFbLrggA"></div>

```js
var Component = Ractive.extend({
	template: 'Component {{number}}'
});

var r = Ractive({
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

## ractive.fire()

Fires an event, which will be received by handlers that were bound using `ractive.on`. In practical terms, you would mostly likely use this with `Ractive.extend()`, to allow applications to hook into your subclass.

**Syntax**

- `ractive.fire(eventName[, context [, arg1[, ...argN]]])`

**Arguments**

- `name (string)`: The name of the event.
- `[context] (context|object)`: A context object to reuse for the event or an object with properties to assign to a new context object. If you need to pass arguments but don't need to provide context, pass an empty object (`{}`) before the additional arguments.
- `[arg] (any)`: The arguments that event handlers will be called with.

**Returns**

- `(boolean)`

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAAoAlAG4AOt0swAdD0MByAGadODvMycBXbjt33jZmBLcxQuXn40GwROAHNHF05PXRg0ABMHM0scLKtuWycUo2dXTNNcIA"></div>

```js
var r = Ractive();

r.on('foo', function() {
  console.log('foo fired');
});

r.fire('foo');
```

## ractive.get()

Returns the value at `keypath`. If the keypath is omitted, returns a shallow copy of all the data in the instance. This data includes mappings introduced by enclosing components, as well as computed properties. To exclude computed properties, use: `ractive.get({virtual : false})`.

**Syntax**

- `ractive.get([keypath][, options])`

**Arguments**

- `[keypath] (string)`: The keypath of the data to retrieve.
- `[options] (Object)`: An options hash that may contain:
  - `virtual (boolean)`: Whether or not to include virtual keypaths (computations, links, etc) in the composed object for the given keypath. This defaults to `true` for the root keypath and `false` for any other keypaths. Use `ractive.get({ virtual: false })` to get the raw root object.

**Returns**

- `(any)`: Returns the data that exists at the given keypath, or the root data if no keypath is given.

**Examples**

<div data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoRtIQAeMARgD4BhMNAYwGsACFO5+gewDsNOE0JAPQVKIAhngA3JDGZyAvM25oA7swBKSeigCWUtAApgAHW4mUAE1RJIzU+ZQWAZp052HFrygBGsuwDazADkfgBewcwAumbeOLEo8dw4AJQA3LHcXLz8aAB0CJwA5oYweUVoKIbBrpx5fmUADMEp6bhAA"></div>

```js
var r = Ractive({
	data: {
		foo: {
			bar: [ 'baz' ]
		}
	}
});

console.log(r.get('foo.bar.0'));
```

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gG4CGMABGQLykB2CA7qQEpEDGALgJYEIAUwAOtX5skRNkVKRSA6qTny51IgFsEk0vxAAJBDABGutpsELsg4SwD2ygA4BXNsnXANshfIBmly+o93q7ByW1DwAlDLukeQIbHYwsgCsCSZRGClyadQYoeYBwbiWADYIAHSFlig8MCVobGGhpAD0jaQUAHzSSqrqmjr6hppYpF4+UkmZglbUBcVlFVU1MXwEHDCxRIW+G7gI2Q3NrR3AXWpSvboGa5oYIDhs8CxgCCwA1qRsT6RTM+gYQA"></div>

```
var r = new Ractive({
	data : {
        name : "Herbert"
    },
	computed : {
        foo : function(){
            return 55
        }
    }
})

console.log(r.get()) // => {name : "Herbert", foo : 55}

console.log(r.get({virtual : false})) // => {name : "Herbert"}
```

## ractive.getContext()

This is an instance specific version of `Ractive.getContext()` that will only search the local instance DOM for a matching node when a selector is given. If the given value is not a string, then it is passed directly through to the static version of this method.

**Syntax**

- `ractive.getContext(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of a target node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(Context)`: Returns an Context object with helper methods to interact with the Ractive instance and context associated with the given node.

**Examples**

```js
// TODO
```

## ractive.insert()

Inserts the instance to a different location. If the instance is currently in the DOM, it will be detached first. See also `ractive.detach()`.

**Syntax**

- `ractive.insert(target[, anchor])`

**Arguments**

- `target (string|Node|array-like)`: The new parent element.
- `[anchor] (string|Node|array-like)`: The sibling element to insert the instance before. If omitted, the instance will be inserted as the last child of the parent.

**Returns**

- `(undefined)`

**Examples**

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggHQkD2AtgA4MB2C7ZutR-AAgC8A4uWp0EADzJckACmAAddkrKzWAGyKzIApSAA8AIwCu6jgD5gwAJ4UEmpBgyGA9GYvtLBlRgCUKiqcAO6ipJQ0ikGymnoA5ADEDOYs5vFYMRos2roCAAYxaoZgAMw+qmRqxYxICAIk2ri4QgbGZKoglrEIbDBk7rUIlgKeZBwCIRSamgJkMETsuH1kc2D1hkMNTS1tHQaW6zMMgwx1I2MTRVVkAGYwzAK2jpoMYUjUcwwCMMgCH1Rru4yhVqlVKsUAIQAWmhAlhCMRSORKNRsPh0NBNyBl3YAg40MaFBIAGtWiAmAwaAceit3LiscVcfj2ITNMSyQZfrhxr8DtzeQh6eZxt5rkCAQIKEhyYxuEQKJwYABGAwCHm2TQIcnGBgwOowPQAJhYUnVDHZSCeLzeAG4BExFdD1hQUGAyHoAKwABlNB3FA34REONvcQcZAzcANBEIGkulso4ZAVSqNao1Wp1eoNemVpvNlp+yHtjtZLrdHoEPr9XSCsfc0Zi+Sw+kqHD0yjxAm7lKi-k73cHDQ4PIEQeEawovFuiqQAGFmGxONx5PEg-F-LaVEPu3LR8mYGhViIyGAp7QZ+wFEk5cnFQgYEaN1uu0Og7RFbgH2R5Aej5vt0HbBAO7AU9QQeR+xAwc91WccTzPadZwXVgOC4H8134Z9oN3EdVj-BBj0nJCr1XRJbxTB9lWw19B3fT9v1-IhD0IgDaIwGIOPYAIQBwMh4EMeMZQMFIyDSKougbahLF4kASHgWh2jxTs1EYV5DUmM9ZHtGJjFIEkUAeUwr0JC09T0QyiFsHTKhYIgkA+dgUD0UpTRstRdX1B9oQWD5TFwFy3N07MH1zfNcAtaVRm0UkXy4zAgA"></div>

```js
Ractive.components.aaa = Ractive.extend({
    template: "<button>{{yield}}</button>"
})

Ractive({
    ...
    template: `
        <button on-click="move">teleport</button>
        <button on-click="restore">restore</button>

        <div id="container1" style="border: 2px solid yellow; min-height: 50px">
            <aaa>hello</aaa>
        </div>

        <div id="container2" style="border: 1px solid red; min-height: 50px">

        </div>
    `,
    on: {
        move(){
          const aaa = this.findComponent('aaa');
          const target = this.find('#container2');
          aaa.insert(target);
        },
        restore(){
          const aaa = this.findComponent('aaa');
          const target = this.find('#container1');
          aaa.insert(target);
        }
    }
})
```

## ractive.link()

Creates a link between two keypaths that keeps them in sync. Since Ractive can't always watch the contents of objects, copying an object to two different keypaths in your data usually leads to one or both of them getting out of sync. `link` creates a sort of symlink between the two paths so that Ractive knows they are actually the same object. This is particularly useful for master/detail scenarios where you have a complex list of data and you want to be able to select an item to edit in a detail form.

**Syntax**

- `ractive.link(source, destination)`

**Arguments**

- `source (string)`: The keypath of the source item.
- `destination (string)`: The keypath to use as the destination - or where you'd like the data 'copied'.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
ractive.link( 'some.nested.0.list.25.item', 'current' );
ractive.set( 'current.name', 'Rich' ); // some.nested.0.list.25.item.name is also updated to be 'Rich'
```

This can be used to great effect with method events and the `@keypath` special ref:

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

Links can be removed using `ractive.unlink()`.

## ractive.observe()

Observes the data at a particular keypath. Unless specified otherwise, the callback will be fired immediately, with `undefined` as `oldValue`. Thereafter it will be called whenever the *observed keypath* changes.

**Syntax**

- `ractive.observe(keypath, callback[, options])`
- `ractive.observe(map[, options])`

**Arguments**

- `keypath (String)`: The keypath to observe, or a group of space-separated keypaths. Any of the keys can be a `*` character, which is treated as a wildcard. A `**` means recursive.

    The difference between `*` and `**` is that `*` provides your callback function `value` and `keypath` arguments containing the path of the what actually changed, at any level of the keypath. So instead of getting the same parent value on every change, you get the changed value from whatever arbitrarily deep keypath changed.

- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see Observers for more nuance regarding these arguments), whenever the observed keypath changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the keypath will have their matches passed to the callback at the end of the arguments list as well.
- `map (Object)`: A map of keypath-observer pairs.
- `[options] (Object)`:
    - `[init] (boolean)`: Defaults to `true`. Whether or not to initialise the observer, i.e. call the function with the current value of `keypath` as the first argument and `undefined` as the second.
    - `[defer] (boolean)`: Defaults to `false`, in which case observers will fire before any DOM changes take place. If `true`, the observer will fire once the DOM has been updated.
    - `links] (boolean)`: Defaults to `false`.  Whether or not the observer should "follow through" any links created with [`ractive.link()`.
    - `[strict] (boolean)`: Defaults to `false`. `strict` uses object identity to determine if there was a change, meaning that unless the primary object changed, it won't trigger the observer. For example with `{ data: { foo: { bar: 'baz' } } }`, `ractive.observe('foo', ..., { strict: true })` will not fire on `ractive.set('foo.bar', 'bat')` but will on `ractive.set('foo', { bar: 'bip' })`.
    - `[context] (any)`: Defaults to `ractive`. The context the observer is called in (i.e. the value of `this`)
    - `[array] (boolean)`: Defaults to `false`. Whether or not to observe the keypath as an array, meaning that change events will fire with a object containing two lists, `inserted` containing added elements, and `deleted` containing removed elements. There is also a `start` integer property indicating the index at which the replacements begin.
    - `[old] (function)`: Defaults to `undefined`. A function that can be used to modify the `old` value passed to the observer callback. This can be used to freeze the old value, create a deep clone of it for future firings, etc.

**Returns**

- `(Object)`: A handle object for controlling any observers created by the call to `observe`
    - `cancel`: Permanently stops observers controlled by the handle.
    - `isSilenced`: Returns `true` if this handle is currently silenced.
    - `silence`: Stop calling callbacks associated with this handle. The observers are still processed by Ractive, so the old value will still be updated. This means that setting a new value on an observer while it is silenced, resuming the observer, and then setting the same value again will _not_ result in the callback being fired if it would not be fired by the same sequence without silencing.
    - `resume`: Resume calling callbacks associated with this handle.

**Examples**

```js
// TODO
```

Note that you can observe keypath *patterns*...

```js
ractive.observe( 'items.*.status', function ( newValue, oldValue, keypath) {
	var index = /items.(\d+).status/.exec( keypath )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated keypaths simultaneously:

```js
ractive.observe( 'foo bar baz', function ( newValue, oldValue, keypath ) {
	alert( keypath ) + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See Observers for more detail.

## ractive.observeOnce()

Observes the data at a particular keypath until the first change. After the handler has been called, it will be unsubscribed from any future changes.

**Syntax**

- `ractive.observeOnce(keypath, callback[, options])`

**Arguments**

- `keypath (string)`: The keypath to observe, or a group of space-separated keypaths. Any of the keys can be a `` character, which is treated as a wildcard.
- `callback (Function)`: The function that will be called, with `newValue`, `oldValue` and `keypath` as arguments (see Observers for more nuance regarding these arguments), whenever the observed keypath changes value. By default the function will be called with `ractive` as `this`. Any wildcards in the keypath will have their matches passed to the callback at the end of the arguments list as well.
- `[options] (Object)`:
    - `[defer] (boolean)`: Defaults to `false`, in which case observers will fire before any DOM changes take place. If `true`, the observer will fire once the DOM has been updated.
    - `[context] (any)`: Defaults to `ractive`. The context the observer is called in (i.e. the value of `this`)

**Returns**

- `(Object)`: An object with a `cancel` method, for cancelling the observer.

**Examples**

```js
// TODO
```

Note that you can observe keypath *patterns*...

```js
ractive.observeOnce( 'items.*.status', function ( newValue, oldValue, keypath ) {
	var index = /items.(\d+).status/.exec( keypath )[1];
	alert( 'item ' + index + ' status changed from ' + oldValue + ' to ' + newValue );
});
```

...or multiple space-separated keypaths simultaneously:

```js
ractive.observeOnce( 'foo bar baz', function ( newValue, oldValue, keypath ) {
	alert( keypath + ' changed from ' + oldValue + ' to ' + newValue );
});
```

See Observers for more detail.

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

## ractive.on()

Subscribe to events.

**Syntax**

- `ractive.on(eventName, handler)`
- `ractive.on(obj)`

**Arguments**

- `eventName (String)`: The name of the event to subscribe to
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event, but the first argument is always a context object. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel event bubbling.
- `obj (Object)`: An object with keys named for each event to subscribe to. The value at each key is the handler function for that event.

**Returns**

- `(Object)`: A handle object for controlling any listners created by the call to `on`
    - `cancel`: Permanently stops listeners controlled by the handle.
    - `isSilenced`: Returns `true` if this handle is currently silenced.
    - `silence`: Stop calling callbacks associated with this handle.
    - `resume`: Resume calling callbacks associated with this handle.

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

## ractive.once()

Subscribe to an event for a single firing. This is a convenience function on top of `ractive.on()`.

**Syntax**

- `ractive.once(eventName, handler)`

**Arguments**

- `eventName (string)`: The name of the event to subscribe to.
- `handler (Function)`: The function that will be called, with `ractive` as `this`. The arguments depend on the event, but the first argument is always a context object. Returning `false` from the handler will stop propagation and prevent default of DOM events and cancel event bubbling.

**Returns**

- `(Object)`: Returns an `Object` with a `cancel` method, which removes the handler.

**Examples**

```js
// TODO
```

## ractive.pop()

The Ractive equivalent to ```Array.pop``` that removes an element from the end of the array at the given keypath and triggers an update event.

If the given keypath does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.pop(keypath)`

**Arguments**

- `keypath (string)`: The keypath of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

## ractive.push()

The Ractive equivalent to ```Array.push``` that appends one or more elements to the array at the given keypath and triggers an update event.

If the given keypath does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.push(keypath, value[, ...valueN])`

**Arguments**

- `keypath (string)`: The keypath of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to append to the end of the array. One or more values may be supplied.

**Returns**

- `(Promise)` - Returns a Promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

## ractive.readLink()

Gets the source keypath and instance for a link.

**Syntax**

- `ractive.readLink(link[, options])`

**Arguments**

- `link (string)`: The keypath for the link that you would like to read.
- `options (Object)`:
    - `[canonical] (boolean)`: Whether or not to read through any intermediate links too. Pass `canonical: true` to read through links to links all the way to the canonical data keypath. Defaults to `false`.

**Returns**

- `(Object)`:
    - `keypath (string)`: The source keypath to which the link points.
    - `ractive (Ractive)`: The source Ractive instance that contains the keypath to which the link points.

**Examples**

```js
const r = Ractive({
  data: {
    items: [
      { name: 'Apple' },
      { name: 'Banana' },
      { name: 'Orange' }
    ]
  }
});

r.link( 'items.0', 'currentItem' );

r.readLink( 'currentItem' );
// returns { ractive: r, keypath: 'items.0' }
```

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
ractive = Ractive({
  // ...,
  data: { foo: 1 }
});

ractive.set({ bar: 2 });
console.log( ractive.get() ); // { foo: 1, bar: 2 }

ractive.reset({ bar: 2 });
console.log( ractive.get() ); // { bar: 2 }
```

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
ractive = Ractive({
  // ...,
  partials: { foo: 'foo' }
});

// {{>foo}} will be replaced with 'foo'

ractive.resetPartial('foo', 'bar');

// {{>foo}} will be replaced with 'bar'
```

## ractive.reverse()

The Ractive equivalent to ```Array.reverse``` reverses the array at the given keypath and triggers an update event.

If the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.reverse(keypath)`

**Arguments**

- `keypath (String)`: The keypath of the array to reverse, e.g. `list` or `order.items`

**Returns**

- `(Promise)` - A promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

## ractive.set()

Updates data and triggers a re-render of any mustaches that are affected (directly or indirectly) by the change. Any observers of affected keypaths will be notified.

When setting an array value, ractive will reuse the existing DOM nodes for the new array, adding or removing nodes as necessary. This can impact nodes with transitions. Use the `shuffle` option for setting a new array value while retaining existing nodes corresponding to individual array item values.

**Syntax**

- `ractive.set(keypath, value[, options])`
- `ractive.set(map[, options])`

**Arguments**

- `keypath (string)`: The keypath of the data we're changing, e.g.
    * `user`
    * `user.name`
    * `user.friends[1]` or `user.friends.1`
    * `users.*.status`
    * `images.aaa\\.jpg.url`.
- `value (any)`: The value we're changing it to. Can be a primitive or an object (or array), in which case dependants of *downstream keypaths* will also be re-rendered (if they have changed).
- `map (Object)`: A map of `keypath: value` pairs, as above.
- `[options] Object`:
    - `deep (boolean)`: Whether or not to perform a deep set on with the data at the given keypath. A deep set recursively merges the given data into the data structure at the given keypath. Defaults to `false`.
    - `shuffle (boolean|string|Function)`: Whether or not to add/move/remove DOM associated with elements rather than just re-using the existing DOM. Defaults to `false`.
        - `true`: Add/move/remove existing items to their new index using a strict equality comparison.
        - `string`: Add/move/remove existing items to their new index using a property comparison where the property compared is named by the given string.
        - `Function`: Add/move/remove existing items to their new index using the value returned by the given function for comparison.
    - `keep (boolean)`: Whether or not to keep the virtual DOM that would be disposed by the `set` operation. This is useful for hiding components without completely tearing them down and recreating them. It's also a little bit faster, as the virtual DOM doesn't have to be recreated when it would reappear. This _may_ try to keep the actual DOM around for reuse at some point in the future. Defaults to `false`.

**Returns**

- `(Promise)`: Returns a promise that will resolved after any transitions associated with the operation are complete.

**Examples**

```js
// TODO
```

The `keypath` can also contain wildcards pattern-observers. All matching keypaths will be set with the supplied values:

```js
ractive.on('selectAll', function(){
	ractive.set('items.*.selected', true);
})
```

**See Also**

* [`Ractive.escapeKey()`](#ractiveescapekey)

## ractive.shift()

The Ractive equivalent to `Array.shift` that removes an element from the beginning of the array at the given keypath and triggers an update event.

If the given keypath does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.shift(keypath)`

**Arguments**

- `keypath (string)`: The keypath of the array to change, e.g. `list` or `order.items`.

**Returns**

- `(Promise)`: A promise that will resolve with the removed element after the update is complete.

**Examples**

```js
// TODO
```

## ractive.sort()

The Ractive equivalent to ```Array.sort``` sorts the array at the given keypath and triggers an update event.

If the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.sort(keypath[, compareFunction])`

**Arguments**

- `keypath (string)`: The keypath of the array to sort, e.g. `list` or `order.items`.
- `compareFunction (Function)`: A function that defines the sort order.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

## ractive.splice()

The Ractive equivalent to ```Array.splice``` that can add new elements to the array while removing existing elements.

If the given keypath does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.splice(keypath, index, [removeCount[, add]])`

**Arguments**

- `keypath (string)`: The keypath of the array to change, e.g. `list` or `order.items`.
- `index (number)`: The index at which to start the operation.
- `[removeCount] (number)`: The number of elements to remove starting with the element at *`index`. This may be 0 if you don't want to remove any elements.
- `[add] (any)`: Any elements to insert into the array starting at *`index`. There can be 0 or more elements passed to add to the array.

**Returns**

- `(Promise)`: Returns a promise that will resolve with the removed elements after the update is complete.

**Examples**

```js
// TODO
```

## ractive.subtract()

Decrements the selected keypath.

**Syntax**

- `ractive.subtract(keypath[, number])`

**Arguments**

- `keypath (string)`: The keypath of the number we're decrementing.
- `[number] (number)`: Defaults to `1`. The number to decrement by.

**Returns**

- `(Promise)`: Returns a promise.

**Examples**

```js
// TODO
```

## ractive.teardown()

Unrenders this Ractive instance, removing any event handlers that were bound automatically by Ractive.

Calling `ractive.teardown()` causes a `teardown` event to be fired - this is most useful with `Ractive.extend()` as it allows you to clean up anything else (event listeners and other bindings) that are part of the subclass.

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

const subclassInstance = Subclass({...});

// Contains the scoped version of div{ color: red }
subclassInstance.toCSS();
```

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

## ractive.toggle()

Toggles the selected keypath. In other words, if `foo` is truthy, then `ractive.toggle('foo')` will make it `false`, and vice-versa.

**Syntax**

- `ractive.toggle(keypath)`

**Arguments**

- `keypath (string)`: The keypath to toggle the value of. If **keypath** is a pattern, then all matching keypaths will be toggled.

**Returns**

- `(Promise)`: A promise.

**Examples**

```js
// TODO
```

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

## ractive.unlink()

Removes a link set up by `ractive.link()`.

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

## ractive.unrender()

Unrenders this Ractive instance, throwing away any DOM nodes associated with this instance. This is the counterpart to `ractive.render()`. The rest of the ractive instance is left intact, unlike `ractive.teardown()`.

Note that if the instance happens to be a component that is managed by another instance, the owning instance may veto the call to `unrender`. If you need more precise control over component rendering, you should probably use an anchor and `ractive.attachChild()` instead.

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

## ractive.unshift()

The Ractive equivalent to ```Array.unshift``` that prepends one or more elements to the array at the given keypath and triggers an update event.

If the given keypath does not exist (is `undefined`), an empty array will be supplied instead. Otherwise, if the given keypath does not resolve to an array, an error will be thrown.

**Syntax**

- `ractive.unshift(keypath, value)`

**Arguments**

- `keypath (string)`: The keypath of the array to change, e.g. `list` or `order.items`.
- `value (any)`: The value to prepend to the beginning of the array. One or more values may be supplied.

**Returns**

- `(Promise)`: Returns a promise that will resolve after the update is complete.

**Examples**

```js
// TODO
```

## ractive.update()

"Dirty checks" everything that depends directly or indirectly on the specified keypath. If no `keypath` is specified, all keypaths will be checked. Keypaths that involve special references (i.e. `@global`) require the keypath to be supplied.

This is useful when manipulating the instance's data without using the built in setter methods (i.e. `ractive.set()`, `ractive.animate()`).

**Syntax**

- `ractive.update([keypath][, options])`

**Arguments**

- `[keypath] (string)`: The keypath to treat as 'dirty'.
- `[options] (Object<string, any>)`:
    - `force (boolean)`: Force an update regardless of whether or not the internal change check determines that the keypath has _actually_ changed. This is useful for forcing all expressions referencing a particular function to recompute.

**Returns**

- `(Promise)`: A promise that resolves when any transitions associated with the operation complete.

**Examples**

```js
ractive.observe( 'foo', function ( foo ) {
  alert( foo );
});

model.foo = 'changed';   // Does not cause the instance to update.
ractive.update( 'foo' ); // Informs the instance that foo was changed externally.
```

## ractive.updateModel()

If you programmatically manipulate inputs and other elements that have two‐way binding set up, your model can get out of sync. In these cases, we need to force a resync with `ractive.updateModel()`:

**Syntax**

- `ractive.updateModel([keypath[, cascade]])`

**Arguments**

- `keypath (string)`: The keypath to treat as 'dirty'. Any two-way bindings linked to this keypath will be checked to see if the model is out of date
- `cascade (boolean)`: If true, bindings that are *downstream* of `keypath` will also be checked - e.g. `ractive.updateModel( 'items', true )` would check `items.0.foo` and `items.1.foo` and so on. Defaults to `false`.

**Returns**

- `(Promise)`: A promise. If a `keypath` is not specified, all two-way bindings will be checked.

**Examples**

```js
ractive = Ractive({
  el: 'container',
  template: '<input value="{{name}}">'
  data: { name: 'Bob' }
});

ractive.find( 'input' ).value = 'Jim';
alert( ractive.get( 'name' ) ); // alerts 'Bob', not 'Jim'

ractive.updateModel();
alert( ractive.get( 'name' ) ); // alerts 'Jim'
```

# Context Object

The context object is the type of object you receive when calling getContext(). This object contains various properties and methods that allow you to interact with and obtain information about the Ractive instance, the node associated with it and the context surrounding it.

The special `@context` reference is also a context object that is associated with the nearest VDOM item and element. It's frequently used with event directives to interact with the data associated with the immediate context.

Helper methods that take a keypath will resolve relative to that node's context. Special references, template aliases, and key and index aliases are supported. If the method doesn't require a keypath, like `get`, then the keypath will implicitly be `.` rather than `~/`, as with regular instance methods.



## context.add()

See ractive.add().



## context.animate()

See ractive.animate().



## context.decorators

`(Object)`

A map of decorator name to decorator return object for all of the decorators on the node associated with the context.



## context.event

`(Event|undefined)`

The original event for contexts supplied to event directives. This is `undefined` for contexts not associated with an event.



## context.get()

See ractive.get().



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

See ractive.link().



## context.listen()

Subscribes an event listener either directly on the node associated with the context or as a delegate if appropriate. This is not like the `on` method, but is instead basically an `addEventListener` helper that is delegation-aware.

**Syntax**

`context.listen( event, callback )`

**Arguments**

- `event (string)`: The name of the event to subscribe.
- `callback (function)`: The callback function to be called when the event fires.

**Returns**

- `(Object)`: An object with a `cancel` method to unlisten the event.



## context.node

`(Node|undefined)`

The node associated with the context. Note that it is possible to get a context that is not associated with an element, which will leave the node `undefined`.



## context.observe()

See ractive.observe().



## context.observeOnce()

See ractive.observeOnce().



## context.original

`(Event|undefined)`

The original DOM event object. Normally present when the event is a Ractive DOM event. May be `undefined` on custom events or events from event plugins.



## context.pop()

See ractive.pop().



## context.push()

See ractive.push().



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

See ractive.readLink().



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

See ractive.reverse().



## context.set()

See ractive.set().



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

See ractive.shift().



## context.splice()

See ractive.splice().



## context.sort()

See ractive.sort().



## context.subtract()

See ractive.subtract().



## context.toggle()

See ractive.toggle().



## context.unlink()

See ractive.unlink().



## context.unlisten()

Unsubscribe an event listener that was subscribed with `listen`. This is basically a `removeEventListener` helper that is delegation-aware.

**Syntax**

`context.unlisten( event, callback )`

**Arguments**

- `event (string)`: The name of the event to unsubscribe.
- `callback (function)`: The callback that was previously subscribed.



## context.unshift()

See ractive.unshift().



## context.update()

See ractive.update().



## context.updateModel()

See ractive.updateModel().


# Parse Object

The parse object is an object you receive as the second argument in function templates. This helper object provides you with essential functions to dissect markup before turning over the template for use.



## p.fromId()

Retrieves the template from the DOM `<script>` tag specified by `id`. Make sure to set `type='text/ractive'` on the `<script>` tag to prevent the browser from running the template as a script.

**Syntax**

- `p.fromId(id)`

**Arguments**

- `id (string)`: The id of the `<script>` tag containing the template. The leading `#` is optional.

**Returns**

- `(string)`: The template inside the specified element.

**Examples**

```js
// TODO
```



## p.isParsed()

Test whether the supplied template is already parsed and is in its object form.

**Syntax**

- `p.isParsed(template)`

**Arguments**

- `template (string|Object)`: The template, either in its string form or object form.

**Returns**

- `(boolean)`: Returns `true` if the template is already parsed, `false` if otherwise.

**Examples**

```js
// TODO
```



## p.parse()

Parses the template using Ractive.parse(). Full Ractive runtime must be loaded.

**Syntax**

- `p.parse(template[, parseOptions])`

**Arguments**

- `template (string|Object)`: The template in its string form or object form.
- `parseOptions] (Object)`: Template parser options. See [Ractive.parse() for all available options. If `parseOptions` is not specified, it defaults to those of the current instance.

**Returns**

- `(Object)`: The parsed template.

**Examples**

```js
// TODO
```

# Transition Object

The transition object is an object you receive when writing transitions. It has a few properties and methods designed to make creating transitions easier.



## t.animateStyle()

Animates CSS properties to a certain value.

**Syntax**

- `t.animateStyle(prop, value, options[, complete])`
- `t.animateStyle(props, options[, complete])`

**Arguments**

- `props (Object)`: A map of animation properties and values.
- `prop (string)`: The style to animate.
- `value (any)`: The value to animate it to.
- `options (Object)`: Animation options.
  - `duration (number)`: The duration of the animation.
  - `easing (string)`: The easing function of the animation.
  - `delay (number)`: The number of milliseconds before the animation starts.
- `[complete] (Function)`: A function that is executed when the animation completes, or immediately if no changes were made.

**Returns**

- `(Promise)`: A promise that resolves when the animation completes.

**Examples**

```js
// TODO
```



## t.complete()

Signals Ractive that the transition is complete.

**Syntax**

- `t.complete[noReset])`

**Arguments**

- `noReset] (boolean)`: If `true`, [`t.resetStyle()` is not called. Defaults to `false`.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```



## t.getStyle()

Retrieve a CSS property value from `t.node`.

**Syntax**

- `t.getStyle(prop)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `prop (Array)`: An array of CSS properties.

**Returns**

- `(string)`: The value of the specified style property.
- `(Object)`: A key-value pair of properties and their respective values.

**Examples**

```js
// TODO
```

## t.isIntro

`(boolean)`

Should be self-explanatory...

## t.name

`(string)`

The name of the transition.

## t.node

`(Node)`

The node that's entering or leaving the DOM

## t.processParams()

Builds a map of parameters whose values are taken from the provided arguments. When used with a single number or string argument, serves as a shorthand for creating a map with a `duration` property.

**Syntax**

- `t.processParams(params[, defaults])`

**Arguments**

- `params (number)`: Numeric shorthand for the `duration` parameter. Expressed in milliseconds.
- `params (string)`: String shorthand for the `duration` parameter. Valid values are:
    - "fast" - 200ms
    - "slow" - 600ms
    - Any other string - 400ms
- `params (Object)`: A map of parameters and their values.
- `[defaults] (Object)`: A map of parameters and their default values.

**Returns**

- `(Object)`: A map of parameters and their values.

**Examples**

```js
// TODO
```



## t.setStyle()

Sets a CSS property on `t.node` to a value.

**Syntax**

- `t.setStyle(prop, value)`
- `t.setStyle(props)`

**Arguments**

- `prop (string)`: An unprefixed CSS property either in camelCase or kebab-case.
- `props (Object)`: A key-value pair of CSS properties and their respective values.
- `value (string)`: A valid value for the specified CSS property.

**Returns**

- `(undefined)`

**Examples**

```js
// TODO
```

# Component files

Remember the good old days? When all CSS went in `<style>` elements in `<head>`? When all JS went in `<script>` elements just before `</body>`? When all HTML was written in Mustache inside inert `<script>` elements? When it felt good when everything just worked after a page refresh? Ractive remembers, and it's bringing those good times back with component files.

Ractive component files are simply self-contained HTML files that define a component and contains all the markup, data, styles and logic it needs. It's also designed with dependency management in mind, allowing it to declare library and component dependencies. Best of all, component files are written in the same way regardless of the development process involved, build step or none.

## Example component file

```html
<!-- Example component file -->

<!-- Import a component named Foo from the file foo.html. -->
<link rel='ractive' href='foo.html' name='foo'>

<!-- Define the markup for this component. -->
<h1>{{ title }}</h1>

<!-- Use imported foo component -->
<p>This is an imported 'foo' component: <foo/></p>

<!-- Define the styles for this component. -->
<style>
  p { color: red; }
</style>

<!-- Define the behavior for this component. -->
<script>
const $ = require( 'jquery' );

component.exports = {
  onrender: function () {
    $('<p />').text('component rendered').insertAfter($this.find('p'));
  },
  data: {
    title: 'Hello World!'
  }
};
</script>
```

The above component file roughly translates to the following in vanilla JS:

```js
import Ractive from 'ractive';
import $ from 'jquery';
import foo from './foo.html';

export default Ractive.extend({
  components: { foo },
  onrender: function () {
    $('<p />').text('component rendered').insertAfter($this.find('p'));
  },
  data: {
    title: 'Hello World!'
  },
  template: `
    <h1>{{ title }}</h1>
    <p>This is an imported 'foo' component: <foo/></p>
  `,
  css: `
    p { color: red; }
  `
});
```

## Writing

### `<link rel="ractive">`

Top-level `<link rel="ractive">` elements define dependencies on other components. It accepts two attributes:

- `href` - The path to the required component file. Paths that start with `./` or `../` are resolved relative to the importing component file. Otherwise, resolution is loader-specific.

- `name` (optional) - The registered name of the component. This corresponds to the key used in the `components` initialization option. When not defined, the filename of the dependency will be used as the name.

The names and the loaded dependency will be assigned to the component's `components` initialization option.

### `<style>`

Top-level `<style>` elements define the styles for the component. If more than one `<style>` element is found on the component file, their contents are concatenated in the order of appearance of the `<style>` elements. Contents of these elements will be concatenated and assigned to the component's `css` initialization option.

### `<script>`

A top-level `<script>` defines the component's initialization. The script's scope has a `component` object that is similar to Node's `module` object. Initialization options for the component is expected via `component.exports`. It also has a special `require` function that fetches script dependencies. `require`'s behavior depends on the loader used. Refer to the specific loader's documentation to know more.

There can only ever be one `<script>` in a component file. Defining more than one will result in the loader throwing an error.

### Template

After yanking out top-level `<link rel="ractive">`, `<style>` or `<script>` from the component file, anything that's left becomes a part of the template. The remaining markup will be assigned to the component's `template` initialization option.

## Using

In order to use component files, you will have to use _loaders_, Head over to the loaders page to learn more about loaders and help you choose a loader that suits your needs.
