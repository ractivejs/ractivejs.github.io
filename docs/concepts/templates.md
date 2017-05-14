# Elements

Strictly speaking, Ractive templates are are not HTML. It has a few special directives and other constructs built into its element representation to make DOM manipulation a bit easier. You can think of them as "HTML-like" - they look like HTML for ease of authoring but are not really HTML nor even a superset of HTML. However, when rendered, they are emitted as perfectly valid HTML.

In addition, Ractive's template parser is not quite as forgiving as the browser's HTML parser either and may throw parser errors where it sees ambiguity. However, it does allow things like implicitly closed elements.

## Conditional attributes

You can wrap one or more attributes inside an element tag in a conditional section, and Ractive will add and remove those attributes as the conditional section is rendered and unrendered. For instance:

```html
<div {{#if highlighted}}class="highlighted"{{/if}}>Highlightable element</div>
```

Any number of attributes can be used in a section, and other [Mustache](./mustaches.md) constructs can be used to supply attributes.

```html
<div {{#if highlighted}}class="highlighted {{ anotherClass }}" title="I'm highlighted"{{/if}}>Highlightable element</div>
```

# Expressions

Expressions allow you to use logic within a template. At their simplest, that may just mean a basic arithmetic operation, such as converting to percentages, or making your [index references]() start at 1 rather than 0:

```html
<div class='bar-chart'>
  {{#bars:i}}
    <div style='width: {{ value * 100 }}%;'>{{ i + 1 }}</div>
  {{/bars}}
</div>
```

Or it could mean formatting a currency so that `1.79` renders as `£1.79p`:

```html
<p>Price: <strong>{{ format( price ) }}</strong></p>
```

Or it could mean adding a class based on some condition:

```html
<a class='button {{ active ? "on" : "off" }}'>switch</a>
```

Or it could mean filtering a list to exclude certain records:

```html
<ul>
{{# exclude( list, 'N/A' ) }}
  <li>{{author}}: {{title}}</li>
{{/ end of filter }}
</ul>
```

These are all examples casually plucked from the air - whether they would be useful or not in real life depends on what you're trying to do. The point is that you can include more of your view logic at the declarative layer - the template - where it's easier to *reason about*.

## Frequently Used Expressions

If you use a particular expression frequently, you can save time by adding it Ractive's default data. This way you won't have to set up the expressions on each individual `ractive` instance.

The example below adds expressions for some frequenlty used parts of [moment.js](http://momentjs.com/) to the default data:

```js
var helpers = Ractive.defaults.data;
helpers.fromNow = function(timeString){
	return moment(timeString).fromNow()
}
helpers.formatTime = function(timeString){
	return moment(timeString).format("ddd, h:mmA");
}
helpers.humanizeTime = function(timeString){
	return moment.duration(timeString).humanize();
}
```

## Valid expressions

These are, of course, JavaScript expressions. Almost any valid JavaScript expression can be used, with a few exceptions:

* No assignment operators (i.e. `a = b`, `a += 1`, `a--` and so on)
* No `new`, `delete`, or `void` operators
* No function literals (i.e. anything that involves the `function` keyword)

Aside from a subset of global objects (e.g. `Math`, `Array`, `parseInt`, `encodeURIComponent` - full list below), any references must be to properties (however deeply nested) of the Ractive instance's data, rather than arbitrary variables. Reference resolution follows the [normal process]().


## Does this use `eval`?

Yes and no. You've probably read that 'eval is evil', or some other such nonsense. The truth is that while it does get abused, and can theoretically introduce security risks when user input gets involved, there are some situations where it's both necessary and sensible.

But repeatedly `eval`ing the same code is a performance disaster. Instead, we use the `Function` constructor, which is a form of `eval`, except that the code gets compiled once instead of every time it executes.


## A note about efficiency

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


## The `this` reference

Within an expression, you can use `this` to refer to the current *context*:

```html
<ul>
  {{#items}}
    <!-- here, `this` means 'the current array member' -->
    <li>{{this.toUpperCase()}}</li>
  {{/items}}
</ul>
```

In regular mustache, we have something called the *implicit iterator* - `{{.}}` - which does the same thing. Ractive allows you to use `this` in place of `.` for purely aesthetic reasons.


## Supported global objects

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

## Functions

Any functions that you want to call, outside of the available globals above, must be properties of the Ractive instance's data as well. Functions can also depend on other references and will be re-evaulated when one of their dependencies is changed.

Depedendencies are determined by capturing references in the viewmodel while the function is executing. Dependencies for functions are re-captured each time the function is executed.

```html
<p>{{ formattedName() }}</p>
```

```js
var ractive = new Ractive({
  template: template,
  el: output,
  data: {
    user: { firstName: 'John', lastName: 'Public' },
    formattedName: function() {
      return this.get('user.lastName') + ', ' + this.get('user.firstName');
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

## Functions on helper objects and third-party libraries

You can also add helper objects to your data and call functions on those objects in expressions. For example, you could add a reference to [underscore.js](http://underscorejs.org/):

```js
var ractive = new Ractive({
  template: template,
  el: output,
  data: {
    items: [ 2, 10, 200, 3, 1, 4],
    _: _
  }
};
```

And use that to sort an array in your template:

```html
{{# _.sortBy(items) }}{{.}}, {{/}}

<!-- Result: -->
1, 2, 3, 4, 10, 200,
```

# Keypaths

The main way to interact with a Ractive instance is by setting *keypaths*. A keypath is a string representing the location of a piece of data:

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    foo: {
      bar: 'baz'
    }
  }
});

// Simple keypath
ractive.get( 'foo' ); // returns { bar: 'baz' }

// Compound keypath
ractive.get( 'foo.bar' ); // returns 'baz'
```

## Upstream and downstream keypaths

In the example above, we say that `'foo.bar'` is a *downstream keypath* of `'foo'`, while `'foo'` is an *upstream keypath* of `'foo.bar'`.

## Array versus dot notation

The `'foo.bar'` keypath is an example of *dot notation*. With arrays, you can use dot notation or *array notation*, which may feel more familiar (internally, it gets converted to dot notation):

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    list: [ 'a', 'b', 'c' ]
  }
});

// Array notation
ractive.get( 'list[0]' ); // returns 'a'

// Dot notation
ractive.get( 'list.0' ); // also returns 'a'
```

## Missing properties

Ordinarily in JavaScript, trying to access a child property of an object that didn't exist would cause an error:

```js
data = { numbers: [ 1, 2, 3 ]};
data.letters[0]; // throws an error - cannot read property '0' of undefined
```

Within Ractive, this will simply return `undefined`:

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    numbers: [ 1, 2, 3 ]
  }
});

ractive.get( 'letters[0]' ); // returns undefined
```

## Escaping

While not ideal, sometimes properties of objects have `.`s in name e.g. `foo['bar.baz']`. Note that while numbers are supported in array notation, strings are not. To access a peypath with a literal `.` in one of the keys, you can escape it with a `\` e.g. `foo.bar\.baz`. Any keys accessible in the template will be unescaped, so if you're trying to use them with simple string concatenation to access a keypath with a `.` in it, you'll need to make sure you escape it first.

# Parsing

In order for Ractive to utilize templates, it first parses the templates into a tree-like data structure, much like how a browser's HTML parser would process HTML. This data structure contains everything Ractive needs to know to construct an instance's DOM, data bindings, events and transitions etc.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwT4hGhVkxCKgCYAVFZIrJZ2FdQbUASvMWqRFlYqABQA5Pg2ytTELoSEzCCSKnGyQmog6gASKqji1ADq4jDINgCEWpFK6qEAlADcTPAmhOLIKiLI4kLBAFIAygDyAHIiZuTwQmQAZgCewYHW9o7Orio19SBoQA"></div>

```
Ractive.parse('<div class="message">Hello World!</div>');

// {"v":4,"t":[{"t":7,"e":"div","m":[{"n":"class","f":"message","t":13}],"f":["Hello World!"]}]}
```

Normally, parsing is done automatically. Ractive will use [`Ractive.parse()`](../../api/static-methods.md#ractiveparse) under the hood if a string template is provided to the [`template`](../../api/initialization-options.md#template) initialization option.

The parsed template is not designed to be readable nor editable by a human. It is meant to represent the template structure as an object in a way Ractive understands with as few bytes as possible. Where the template doesn't use Ractive-specific features, these parts will be represented as plain HTML in the data structure.

## Pre-parsing

Parsing templates can be a very slow operation, particularly for very large apps, very complex templates, or intricate SVGs. As an optimization option, templates can be pre-parsed into their object form outside of runtime. This would allow Ractive to skip parsing during runtime and speed up app initialization. Typically, a parsed template is only about 30-40% larger than the string version, making pre-parsing a trade-off between space and processing.

Pre-parsing can be done in many different ways as long as Ractive receives the parsed template during runtime. One way would be to simply serve the pre-parsed template separately from the component or instance and load it via AJAX. Another would be to extract and replace the template on the file with the parsed version during compile time - an approach that works well with [component files](../../api/component-files.md). Read more about [loaders](../../integrations/loaders.md) to know more about how loaders do pre-parsing on compile time.

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

1. If the reference a [special reference](../../api/special-references.md), resolve with that keypath.
2. If the reference is [explicit](../../api/keypath-prefixes.md) or matches a path in the current context exactly, resolve with that keypath.
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

## Arrays

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

# Mustaches

## What is Mustache?

[Mustache](http://mustache.github.io/) is one of the most popular templating languages. It's a very lightweight, readable syntax with a comprehensive specification - which means that implementations (such as Ractive) can test that they're doing things correctly.

If you've used [Handlebars](http://handlebarsjs.com) or [Angular](http://angularjs.org) you'll also find mustaches familiar.

* [What are mustaches?]()
* [Mustache basics]()
  * [Variables]()
  * [Sections]()
  * [Comments]()
  * [Partials]()
  * [Custom delimiters]()
* [Extensions]()
  * [Array indices]()
  * [Object iteration]()
  * [Special references]()
  * [Restricted references]()
  * [Expressions]()
  * [Handlebars-style sections]()
  * [Aliasing]()
  * [Static mustaches]()
  * [`{{else}}` and `{{elseif}}`]()
  * [Escaping Mustaches]()


## What are mustaches?

Within this documentation, and within Ractive's code, 'mustache' means two things - a snippet of a template which uses mustache delimiters, such as `{{name}}`, and the object within our [parallel DOM]() that is responsible for listening to data changes and updating the (real) DOM.

We say that the `{{name}}` mustache has a *[reference]()* of `name`. When it gets rendered, and we create the object whose job it is to represent `name` in the DOM, we attempt to *resolve the reference according to the current context stack*. For example if we're in the `user` context, and `user` has a property of `name`, `name` will resolve to a [keypath]() of `user.name`.

As soon as the mustache knows what its keypath is (which may not be at render time, if data has not yet been set), it registers itself as a *[dependant]()* of the keypath. Then, whenever data changes, Ractive scans the dependency graph to see which mustaches need to update, and notifies them accordingly.


## Mustache basics

If you already know Mustache, Ractive supports all the Mustache features - basic Mustache variables like `{{name}}`, as well as sections, partials, and even delimiter changes. If you're already familiar with Mustache, skip to the Extensions section below.

You can also check out the [tutorials](http://learn.ractivejs.org).


### Variables

The most basic mustache type is the variable. A `{{name}}` tag in a template will try to find the `name` key in the current context. If there is no `name` key in the current context, the parent contexts will be checked recursively. If the top context is reached and the name key is still not found, nothing will be rendered.

All variables are HTML escaped by default. If you want to return unescaped HTML, use the triple mustache: `{{{name}}}`.

You can also use `&` to unescape a variable: `{{& name}}`. This may be useful when changing delimiters (see "Set Delimiter" below).


Template:

```html
 * {{name}}
 * {{age}}
 * {{company}}
 * {{{company}}}
```

With the following data:

```javascript
{
  "name": "Chris",
  "company": "<b>GitHub</b>"
}
```

Will generate the following output:

```
 * Chris
 *
 * &lt;b&gt;GitHub&lt;/b&gt;
 * <b>GitHub</b>
```

### Sections
Sections render blocks of text one or more times, depending on the value of the key in the current context.

A section begins with a pound and ends with a slash. That is, `{{#person}}` begins a "person" section while `{{/person}}` ends it.

The behavior of the section is determined by the value of the key.

### False Values or Empty Lists

If the person key exists and has a value of false or an empty list, the HTML between the pound and slash will not be displayed.

Template:

```html
Shown.
{{#person}}
  Never shown!
{{/person}}
```

Data:

```javascript
{
  "person": false
}
```
Output:

```html
Shown.
```

### Non-Empty Lists

If the person key exists and has a non-false value, the HTML between the pound and slash will be rendered and displayed one or more times.

When the value is a non-empty list, the text in the block will be displayed once for each item in the list. The context of the block will be set to the current item for each iteration. In this way we can loop over collections.

Template:

```html
{{#repo}}
  <b>{{name}}</b>
{{/repo}}
```

Data:

```javascript
{
  "repo": [
    { "name": "resque" },
    { "name": "hub" },
    { "name": "rip" }
  ]
}
```

Output:

```html
<b>resque</b>
<b>hub</b>
<b>rip</b>
```

### Non-False Values

When the value is non-false but not a list, it will be used as the context for a single rendering of the block.

Template:

```html
{{#person?}}
  Hi {{name}}!
{{/person?}}
```

Data:

```javascript
{
  "person?": { "name": "Jon" }
}
```

Output:

```html
Hi Jon!
```

### Inverted Sections

An inverted section begins with a caret (hat) and ends with a slash. That is  `{{^person}}` begins a "person" inverted section while `{{/person}}` ends it.

While sections can be used to render text one or more times based on the value of the key, inverted sections may render text once based on the inverse value of the key. That is, they will be rendered if the key doesn't exist, is false, or is an empty list.

Template:

```html
{{#repo}}
  <b>{{name}}</b>
{{/repo}}
{{^repo}}
  No repos :(
{{/repo}}
```

### Attributes

Sections may also be used within attribute values and around attribute values. Using a conditional section around an attribute or group of attributes will exclude those attributes from the DOM when the conditional is `false` and include them when it is `true`. Using a conditional section within an attribute only affects the value of the attribute, and there may be multiple sections within an attribute value.

In the following terribly contrived example, if `big` is truthy, then the button will have a class `big` in addition to the fixed class `button`. If `planetsAligned` is truthy, the button will also get an annoying `onmousemove` attribute. **Note** that ractive directives cannot currently be placed within a section, but that may change in the future.

```html
<button class="{{#big}}big {{/}}button" {{#planetsAligned}}onmousemove="alert('I am annoying...')"{{/}}>I sure hope the planets aren't aligned...</button>
```

### Comments
Comments begin with a bang and are ignored. The following template:

```html
<h1>Today{{! ignore me }}.</h1>
```

Will render as follows:

```html
<h1>Today.</h1>
```

If you'd like the comments to show up, just use html comments and set [stripComments]() to `false`.
Comments may contain newlines.

### Partials

Partials begin with a greater than sign:

```html
{{> box}}
```

Recursive partials are possible. Just avoid infinite loops.

They also inherit the calling context. For example:

```html
{{> next_more}}
```


In this case, `next_more.mustache` file will inherit the size and start methods from the calling context.

In this way you may want to think of partials as includes, or template expansion:

For example, this template and partial:

base.mustache:

```html
<h2>Names</h2>
{{#names}}
  {{> user}}
{{/names}}
```

With `user.mustache` containing:

```html
<strong>{{name}}</strong>
```

Can be thought of as a single, expanded template:

```html
<h2>Names</h2>
{{#names}}
  <strong>{{name}}</strong>
{{/names}}
```

Partials are a very useful construct, and you can find out more about them on the [partials]() page.

### Custom delimiters

Custom delimiters are set with a 'Set delimiter' tag. Set delimiter tags start with an equal sign and change the tag delimiters from `{{` and `}}` to custom strings.

```html
{{foo}}
  {{=[[ ]]=}}
[[bar]]
```

Custom delimiters may not contain whitespace or the equals sign.


You can also set custom delimiters using the `delimiters` and `tripleDelimiters` options in your Ractive instance.

```javascript
var ractive = new Ractive({
  el: whatever,
  template: myTemplate,
  data: {
    greeting: 'Hello',
    greeted: 'world',
    triple: '<strong>This is a triple-stache</strong>'
  },
  delimiters: [ '[[', ']]' ],
  tripleDelimiters: [ '[[[', ']]]' ]
});
```

## Extensions

Ractive is 99% backwards-compatible with Mustache, but adds several additional features.

### Array index references

Index references are a way of determining where we are within a list section. It's best explained with an example:

```html
{{#items:i}}
  <!-- within here, {{i}} refers to the current index -->
  <p>Item {{i}}: {{content}}</p>
{{/items}}
```

If you then set `items` to `[{content: 'zero'}, {content: 'one'}, {content: 'two'}]`, the result would be

```html
<p>Item 0: zero</p>
<p>Item 1: one</p>
<p>Item 2: two</p>
```

This is particularly useful when you need to respond to user interaction. For example you could add a `data-index='{{i}}'` attribute, then easily find which item a user clicked on.

### Object iteration

Mustache can also iterate over objects, rather than array. The syntax is the same as for Array indices. Given the following ractive:

```javascript
ractive = new Ractive({
  el: container,
  template: template,
  data: {
    users: {
      'Joe': { email: 'joe@example.com' },
      'Jane': { email: 'jane@example.com' },
      'Mary': { email: 'mary@example.com' }
    }
  }
});
```

We can iterate over the users object with the following:

```html
<ul>
  {{#users:name}}
    <li>{{name}}: {{email}}</li>
  {{/users}}
</ul>
```

to create:

```html
<ul>
  <li>Joe: joe@example.com</li>
  <li>Jane: jane@example.com</li>
  <li>Mary: mary@example.com</li>
</ul>
```

In previous versions of Ractive it was required to close a section with the opening keypath. In the example above `{{#users}}` is closed by `{{/users}}`. This is no longer the case, you can now simply close an iterator with `{{/}}`. Ractive will attempt to warn you in the event of a mismatch, `{{#users}}` cannot be closed by `{{/comments}}`. This will not effect [Expressions]() as they have always been able to be closed by `{{/}}`.

```html
<!--- valid markup -->
{{#users}}

{{/users}}

{{#users:i}}

{{/users}}

{{#users}}

{{/}}

{{#users.topUsers}}
<!-- still matches the first part of the keypath, thus a valid closing tag -->
{{/users}}

<!-- invalid markup -->
{{#users}}

{{/comments}}
```

### Expressions

Expressions are a big topic, so they have a [page of their own](). But this section is about explaining the difference between vanilla Mustache and Ractive Mustache, so they deserve a mention here.

Expressions look like any normal mustache. For example this expression converts `num` to a percentage:

```html
<p>{{ num * 100 }}%</p>
```

The neat part is that this expression will recognise it has a dependency on whatever keypath `num` resolves to, and will re-evaluate whenever the value of `num` changes.

Mustache fans may bristle at expressions - after all, the whole point is that mustache templates are *logic-less*, right? But what that really means is that the logic is *embedded in the syntax* (what are conditionals and iterators if not forms of logic?) rather than being language dependent. Expressions just allow you to add a little more, and in so doing make complex tasks simple.


### Handlebars-style sections

In addition to Mustache-style conditional and iterative sections, Ractive adds Handlebars-style ```if```, ```unless```, ```each```, and ```with``` to handle branching, iteration, and context control. For ```if```, ```with```, and ```each```, <a href="#else">```{{elseif}}``` and ```{{else}}```</a> may be used to provide alternate branches for false conditions, missing contexts, or empty iterables.

```html
<button on-click="flip">Flip Coin</button>
<p>Coin flip result: {{#if heads}}heads{{else}}tails{{/if}}</p>
<ul>
  {{#each result}}
    <li>{{.}}</li>
  {{else}}
    <li>No results yet...</li>
  {{/each}}
</ul>
<p>Here is a {{#with some.nested.value}}{{.}}{{/with}} value.</p>
```

```js
var ractive = new Ractive({
  el: document.body,
  template: myTemplate,
  data: {
    results: [],
    heads: true,
    some: { nested: { value: 'nested' } }
  }
});

ractive.on('flip', function() {
  var sadRandom = Math.floor(Math.random() * 2) === 1;
  this.set('heads', sadRandom);
  this.unshift('results', sadRandom ? 'heads' : 'tails');
});
```

In this example, clicking the button gets a "random" coin flip result, sets it in an ```if``` conditional section, and prepends it in an ```each``` iterative section. There is also a ```with``` context section throw in for good measure.

### Aliasing

Any section (or `{{#with}}` section) provides its own context to the template that falls within it, and any references within the section will be resolved against the section context. Ambiguous references are resolved up the model hierarchy _and_ the context hierarchy. Given a data structure that looks like
```js
{
  foo: {
    baz: 99,
    bar: {
      baz: 42
    }
  },
  list: [
    baz: 198,
    bar: {
      baz: 84
    }
  ]
}
```
and a template
```html
{{#each list}}
  explicit 1: {{.bar.baz}}
  {{#with .bar}}
    implicit 1: {{baz}}
    {{#with ~/foo}}
      explicit 2: {{.bar.baz}}
      implicit 2: {{baz}}
    {{/with}}
  {{/with}}
{{/each}}
```
there is no way to reference `~/list.0.baz` from the second implicit site because the site has a different context (`~/foo`) and using an ambiguous reference (`baz`) results in `~/foo.baz`  being used. Aliasing offers an escape hatch for similarly complex scenarios where ambiguity can cause the wrong reference to be used or performance issues to arise, because ambiguity is expensive.

Alias block use the existing `{{#with}}` mustache, but instead of setting a context, they set names for one or more keypaths. Aliases follow the form `destination as alias`, where destination is any valid reference at that point in the template e.g. `{{#with .foo as myFoo, @key as someKey, 10 * @index + ~/offset as someCalculation, .baz.bat as lastOne}}`. Because plain reference aliases, like the `myFoo` and `lastOne` aliases in the example, refer to exactly one non-computed keypath, they can also be used for two-way binding deeper in the template. For example, `<input value="{{myFoo}}" />` as a child of the alias block would bind to `.foo` in the context where the alias block is defined.

Aliasing is also extended to `{{#each}}` blocks so that the iterated item can be named rather than just referred to as `this` or `.`. For instance, `{{#each list as item}}` would make `item` equivalent to `this` directly within the `each` block, but `item` would still refer to same value in further nested contexts. Index and key aliases can still be used with an aliased iteration e.g. `{{#each object as item: key, index}}`.

Finally, partials can also be used with alias shorthand in much the same way that they can be passed context e.g. `{{>somePartial .foo.bar as myBar, 20 * @index + baz as myComp}}`.

### Static mustaches

Sometimes it is useful to have portions of a template render once and stay the same even if their references change. A static mustache will be updated only when its template is rendered and not when its keypath is updated. So, if a static mustache is a child of a section or partial that get re-rendered, the mustache will also be re-rendered using the current value of its keypath.

The default static mustache delimiters are `[[ ]]` for escaped values and `[[[ ]]]` for unescaped values.

```html
[[ foo ]] {{ foo }}
{{^flag}}
  [[ foo ]]
{{/}}
```

```js
var ractive = new Ractive({
  data: { foo: 'bar' },
  ...
});
ractive.set('foo', 'bippy');
ractive.set('flag', true);
ractive.set('flag', false);
```

Output:
```html
bar bippy bippy
```

Static mustaches may also be used for sections that should only be updated on render.

```html
[[# if admin ]]
Hello, admin
[[else]]
Hello, normal user
[[/if]]
```

```js
var ractive = new Ractive({
  data: { admin: false },
  ...
});
ractive.set('admin', true);
```

Output:
```
Hello, normal user
```


### {{else}} and {{elseif}}

Ractive borrows a trick from Handlebars here and lets you perform:

```html
{{#repo}}
  <b>{{name}}</b>
{{else}}
  No repos :(
{{/repo}}
```

Data:

```javascript
{
  "repo": []
}
```

Output:

```html
No repos :(
```

Ractive takes it a step further and also allows you to use `{{elseif otherCondition}}` for alternate cases.

```html
{{#if foo}}
  foo
{{elseif bar}}
  bar but not foo
{{else}}
  neither foo nor bar
{{/if}}
```

In this case, the output would be what you would expect. If `foo` is true, then the output will be `foo`. If `foo` is false and `bar` is true, the the output will be `bar but not foo`. If neither `foo` nor `bar` is true, the the output will be `neither foo nor bar`.

Further, `{{else}}` and `{{elseif}}` clauses can be used with `{{#with}}` and `{{#each}}` sections too. If the context for the `{{#with}}` section doesn't exist, then any else clauses will be processed as if the entire section were a conditional with a false first branch. If the array for the `{{#each}}` (or regular iterative section) is empty or the object has no keys, then any else clauses will be processed as if the entire section were a conditional with a false first branch.


### Escaping mustaches

If you need to have Ractive ignore some mustaches in your template, you can escape them with a '\\'.

```html
{{ interpolated }} {{backslash}}{{ left alone }}
```

If you need to have a backslash before an interpolated mustache, you can escape the backslash with another '\\'. Any additional mustaches will be exported into the template.

```html
{{backslash}}{{backslash}}{{ interpolated }} and preceeded by a single slash.
{{backslash}}{{backslash}}{{backslash}}{{ interpolated }} and preceeded by two slashes.
```


## Footnote

*Ractive implements the Mustache specification as closely as possible. 100% compliance is impossible, because it's unlike other templating libraries - rather than turning a string into a string, Ractive turns a string into DOM, which has to be restringified so we can test compliance. Some things, like lambdas, get lost in translation - it's unavoidable, and unimportant.
