# Hello, world!

Welcome to the interactive tutorials for Ractive.js! These tutorials are designed to take you from zero to expert at your own pace. If you're in a modern browser, each code block in the tutorials has a button on the top, right-hand side that will open the embedded Ractive Playground so that you can implement a feature, fix a bug, or just play around with the code.

The playground has three tabs - one each for HTML, JavaScript, and CSS, much like JSFiddle, JSBin, and CodePen. There are also output and console tabs along the bottom that have the playground output and and console statements logged in the playground, respectively. To run the code on the playground, press the &#9654; button in the top, right-hand corner. The playground takes your HTML and injects it into the body of the document in the output tab. It also injects your script and CSS in the appropriate places in the output tab. The latest version of Ractive is also available in the playground.


## Let's get started

The simplest example of doing anything useful with Ractive requires three things: a template, an element in which to mount a Ractive instance, and a Ractive instance. At its simplest, a template is just HTML, so we'll start there:

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaWyDgGd4AOwQB3cgCUGAY1xkEACmC1h5criYtI5JAHsZAVwC2CYbgB0AR0MIYATwDKCADYI5emIoDkAYk3MCLjeAJRYquq4CMYADi4MUTreBGAATGwAEq4ueljkYp4uSACEXGls3qoYIQDcmEA"></div>

```js
new Ractive({
  target: document.querySelector('#target'),
  template: '<h2>Hello, world!</h2>'
});
```

In this case, our target element is a `div` with an id of `target`. When the script executes, Ractive will parse the template, which consists only of an `h2` element, and render into the given target element. That's really about as simple as it possibly could be, but it's also not terribly useful. If you just wanted to throw `Hello, world!` into an `h2` and onto a page, there are much simpler ways to do so. Maybe you want to greet an entity other than the world, which brings us nicely around to data binding, or the task for which Ractive was made.

## Mustaches

In order to turn our static template into something a bit more dynamic, we'll turn to one of the mustaches understood by Ractive - the interpolator.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaWyDgGd4pJuQYAHceWrkAdggDu5AEoMAxrjIIAFMFqzy5XExaRySAPZqArgFsEs3ADoAjtYQwAngGUEAGwQNCxhtAHIAYmNmBFxQgEosfUNcBFtxPwYUs1CCMAAmNmBgFBgEGOJZFAxsciKHTVxPaoBCLny2UMSDc0yGMz1uwxKyzUrsgAl-PwtOpMNyeuJG7IVgvyRQuYx9DDiAbkwgA"></div>

```js
var app = Ractive({
  target: document.querySelector('#target'),
  template: '<h2>{{greeting}}, {{entity}}!</h2>',
  data: {
    greeting: 'Hello',
    entity: 'world'
  }
});
```

Here, we've introduced two interpolators into our template, `{{greeting}}` and `{{entity}}`, in which Ractive will substitute our `data`, which is simply a plain old JS object. The content of the interpolators specify what Ractive calls a reference in the data, so `greeting` in the interpolator refers to `greeting` in the data. Put your name in the data in place of the entity and switch the greeting to something a little more formal and possibly British, like 'Delighted to meet you' (studies have shown that it's more fun if you say it in your head with an accent). Go ahead, I'll wait.

Here's where Ractive deviates a bit from templating libraries like Mustache and Handlebars. If you want to change any of the bound values in the template with a pure templating library, you would need to re-render everything with the new data, tear down the old rendered HTML, and insert the new. That's terribly wasteful though, so Ractive takes a slightly different approach using a virtual DOM to keep track of which bits of data are tied to which bits of DOM. Then when the data changes, Ractive can update only the bits of DOM that need to be updated. How do you tell Ractive to update the data though?

### Data and Keypaths

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaWyDgGd4pJuQYAHceWrkAdggDu5AEoMAxrjIIAFMFqzy5XExaRySAPZqArgFsEs3ADoAjtYQwAngGUEAGwQNCxhtAHIAYmNmBFxQgEosfUNcBFtxPwYUs1CCMAAmNmBgFBgEGOJZFAxsciKHTVxPaoBCLny2UMSDc0yGMz1uwxKyzUrsgAl-PwtOpMNyeuJG7IVgvyRQuYx9DDiAbn19CXEnARiw4fLKzvJN2lDva3F4vcwgA"></div>
```js
app.set('greeting', '\'Sup');
```

Ractive has a number of data manipulation methods to add, update, and retrieve data, such as the `set` method. The `key` portion of the call to `set`, `'greeting'`, is called a keypath, because it describes the path to the data from the root of Ractive's viewmodel. In this case, the `'greeting'` key exists directly on the root data object, but most useful data isn't just a single object. If the data object were `{ foo: { bar: { greeting: 'Hello' } } }`, then the keypath to access the greeting would be `'foo.bar.greeting'`. Keypaths are Ractive's universal key into your data, and as such, can be used in templates and from the API.

Ractive also provides a `get` method to retrieve data from an instance, and as you may have guessed, the `get` method takes a keypath as a parameter.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaWyDgGd4pJuQYAHceWrkAdggDu5AEoMAxrjIIAFMFqzy5XExaRySAPZqArgFsEs3ADoAjtYQwAngGUEAGwQNCxhtAHIAYmNmBFxQgEosfUNcBFtxPwYUs1CCMAAmNmBgFBgEGOJZFAxsciKHTVxPaoBCLny2AGEwQIBrI27yNQtZAQsAp1DEg3NMhjM9acMSss1K7IAJfz8LSaTDcnriRuyFYL8kUL2MfQw4gG59fQlxJwEYsOXyysnyS9pQ7zWcTxB6yIYjMYIJzbFDaZ5OFgfUpfFDxe6YIA"></div>
```js
console.log(app.get('greeting'));
```

Access to Ractive keypaths is generally safe so that trying to retrieve `foo.bar.baz.greeting` on that more complex object above would not throw an error, but would instead return `undefined` in the same way that accessing a key that doesn't exist on an object returns `undefined`. `set`ting a keypath that doesn't exist results in any missing intermediate objects being created automatically, if possible. This means that `app.set( 'foo.bar.baz.greeting', 'Ta' )` would result in an object containing a `'greeting'` key with the value `'Ta'` being set to a new `'baz'` key on the object at `'foo.bar'`. If the missing intermediate object happens to contain a numeric key, like `'foo.bar.baz.0.greeting'`, Ractive will insert an array instead of an object.

### Conditionals

Mustaches in Ractive come in two flavors - inline and block. Interpolators are inline mustaches in that they have no body other than their value. Inline mustaches generally correspond to a single DOM text node. Block mustaches have a body, and therefore, require an opening and closing mustache. Block mustaches open with a `{{#...}}` and close with `{{/...}}`. Interpolators are great, but by themselves, they aren't particularly useful. Another useful mustache is the conditional block, which will render its content into the DOM if its condition is true.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcwYAGJyAMxokA9qqTlc5ExgxqNNOmHJEaAd3JChNGAlMIYYg2NTc0tVMWdcGABXXDB6W01gHn1rNQIeUgpqFVUCMwA3MQl2XFkYNFxldIKlEBwieHyymllKShpmGlUEFxoAJVkSC3yEAApgNXtS8oRcSBoAcm1pioWsSboEaTkFeaWFbfkENY2keVl5ibCaDSCzCxN5gEYNm1UMAEoAbltVIlmACrkAQIIwxUZ6KKqIahUYfGhXDStSgAOn+uFGCzuIRMaxoAG0ALrfGg8Hg0LbUegtGAwWT0ZyyUw0IwAIwAVgghozvDQ9LIhP9qeQwgMYSM1NgaAAmAAM8u+mCAA"></div>
```handlebars
{{#if condition}}
  this will render if condition is truthy
{{/if}}
```

> **Note:**
> We are using truthy and falsey here instead of `true` and `false` because Ractive follows JavaScript's version of truthiness fairly closely with a few ergonomic deviations.

If `condition` becomes falsey at any point, for instance by calling `app.set('condition', false)`, then the conditional block will unrender its content. Conventiently, an alternate path is also supported for conditionals using the `{{else}}` special mustache.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcwYAGJyAMxokA9qqTlc5ExgxqNNOmHJEaAd3JChNGAlMIYYg2NTc0tVMWdcGABXXDB6W01gBCEiBGsE+1inV3dPb19-fUMTMwsTcJo9WRSEePVEnn101QIeUgpqFRazADcxCXZcWRg0XGVW3qUQHCJ4HuGaWUpKGmYaVQQXGgAlWRILHoQACmA1TOHRyBoAcm0hkYRca6wzugRpOQUr24UP+QRnq8kPJZFdTmEaBogqVQlcAIyvGyqDAASgA3LZVKlcAAVcgCBBGGJHPRRVT7UJHFE0cEaJaUAB02KO12hIRMzxoAG0ALromg8Hg0d7UeiLGAwWT0ZyyUw0IwAIwAVgh9jLvJVqqkxeQwrsKYc1NgaAAmAAMFvRmCAA"></div>
```handlebars
{{#if condition}}
  this will render if condition is truthy
{{else}}
  this will render if condition is falsey
{{/if}}
```

Like most languages that support branching, Ractive's conditional blocks also support alternate branches in the form of special `{{elseif condition}}` mustaches. Fallthrough works as you'd expect from normal branching. If the first condition is truthy, then its content will be rendered and no other branches will be considered. If it is falsey, then the second branch is considered, and so on until a truthy condition is found or an `{{else}}` branch is reached. If no branch has a truthy condition and there is no `{{else}}` branch, then nothing will be rendered.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcwYAGJyAMxokA9qqTlc5ExgxqNNOmHJEaAd3JChNGAlMIYYg2NTc0tVMWdcGABXXDB6W01gBCEiBH0aI1i-AGETMwsrG3VaBydXd09vX390oPzQ8Jo9WRSEehpZUwysmFzggrCyyJi4hK1k1OsE+1iytw8vHyQ-AJoAI0ywQzyQkw6uzZydgY7vJpbU+OKtHn0p1QIeUgpqFQezADcxCXZcWRg0LhlI9PkoQDgiPAPv8OpRKDRmDRVAgXDQAEqyEgWD4IAAUwDUM3+gMgNAA5No-gCELgyVhCXQENI5ApSRSFMz5Ag6QykPJZKSCWEaBo6rtVKSAIz04UaQ69Y6hUnDRTCooYACUAG5bKpUrgACrkAQIIwxXF6KKqLGhXEamhCjSyOEAOn1uLJYoGdJoAG0ALramg8Hg0JnUdr-GCyejOTpIDJrABWCCxcbOzVa7XIYQxNpxCX1RpNZtwFqtNpMdodCSdrvdZPlfXqJh9wE1OuK2BoACYAAwD7Vqbv9wdazBAA"></div>
```handlebars
{{#if condition}}
  this will render if condition is truthy
{{elseif otherCondition}}
  this will render if condition is falsey and otherCondition is truthy
{{else}}
  this will render if both condition and otherCondition are falsey
{{/if}}
```

### Expressions

Having conditional content render based on single variable at a time is also not particularly useful for any but the simplest cases. To work around that, Ractive supports expressions in templates that are equivalent to JavaScript expressions.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcwYAGJyAMxqqArgIBGCGDSU0ArBgxqNNGgElDCZDXk0hCWUVpcAHcAexowWVUkIjowkhCjVUCwrWMzC3tHTWAefUzVAh5SCmoVAqRyADcxCXZcWRg0XGVCisqlEBwieEqGr0pKGmZ3IJoAJVkSXCqEAApgNWd6xoRcSBoAcm1lpo2sRboEaTkFda2FY-kEPYOkeVl1hdVnDTTzGHWAdgOHVQwASgA3JggA"></div>
```handlebars
{{#if number > 5}}
  I need at least two hands to count to {{number}}.
{{/if}}
```

`number > 5` is not just a reference to a bit of data. It is an expression that uses the greater than operator to compare a bit of data to the number `5`, and the result of that expression is used by the conditional block to determine whether or not it should render. Ractive will keep track of each reference (keypath) within each expression in the template as a dependency of the expression, and when a dependency changes, the expression will be re-evaluated to update the view as necessary. In this example, any updates to the `number` keypath (`app.set('number', 2)`, for instance) will cause both of the interpolators to update at the same time.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcwYKoCuAgEYIYGDDVmqiAdyNE6AezpgENAI46ERXOTuqzSJDQ6lPY0WroGRjQAVDQALABMJmoEPKQU1CqqBEjkAG5iEuy4sjBouMopOblKIDhE8LklZpTBzDSqCJY0AEqyJF65CAAUwGo0dCVlkDQA5ADExaUIuDNYY3QI0nIK0-MKW-IIq+tI8rLTo740GuGGMNMA7OsYahgAlADcampEywAq5AECDsOlwQwAZjpVP1vKohm9Qt9ii0AHS-MEzW5GVY0eKfV5YXEABhJn0wQA"></div>
```handlebars
{{number}} answers to the question add up to {{number * 42}}
```

The code allowed in expressions is fairly open-ended, but there are a few notable exceptions that can't be used:

* Assignments i.e. `foo = 10`, `foo += 5`, `foo++`
* `new`, `delete`, and `void` operators
* Function literals i.e. `foo(function() { return 'nope'; })`

Some people frown on putting _any_ sort of logic like that in a template, but it can be much clearer to have view-specific logic directly in the template than to have to craft specific helpers that are relatively distant from the template for each tiny bit of logic needed by the view. Ractive does offer `computed` properties for more complex bits of logic, and you can also call helper functions using template expressions to keep template logic minimal.

> **Note:**
> Ractive supports ES5 and many ES6/ES2015 language features in its expression parser, including function argument spreads, object property shorthand, array spreads, object spreads, and template strings. Each of those constructs is converted to an equivalent ES5 expression at parse time, so you don't have to worry about compatibility with older browsers.

### Iteration

Beyond conditionals, the other basic block structure in most languages is the loop, or some form of iteration. Ractive doesn't support loops, but it does support iterating over each value in an array or each key in an object with its `{{#each}}` block mustache. For each key in the object or value in the array, Ractive will render the content of the block with a few special references available.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcBAK5CV63MGABiBLJJgaQ8kVqyiYhQIwY1GmjQJWl5RzUMABclUkLhoAahoARmcxe0MfBCcMAh4vVwNgHlNzZ3SUnT0U0gpqQqRyADcxCXZcWRg0XGUU8oqlEBwieAr6mllKShpmGlUEAHcaACUzXEqEAApgNXc6hoRcSBoAciNVxq2sZbpEmXkETZ3HU4UDo6R5WU2l1XcNKxtNgG0jjQ0t-pkCCItxeNF+uC2ACNZKoYXYQa8mhCAPYwGFoYE-XAAXSOLlUGAAlABuTBAA"></div>
```handlebars
<ul>
{{#each list as item}}
  <li>item {{@index + 1}} is {{item}}</li>
{{/each}}
</ul>
```

When `list` is the array `['apples', 'bananas', 'oranges']`, Ractive will render the `<li>` template inside the `each` block three times. In the first iteration, `item` will be `'apples'`, as you would expect. There's also a special reference, `@index`, which is a special reference that Ractive supplies to iterative block content. On the first iteration, `@index` will be `0`. On the second iteration, `item` will be `'bananas'`, and `@index` will be `1`. This is a good example of how template expressions are a bit more clear than the corresponding helper version in other view librarys, which tends to look something like `{{@index | add: 1}}`.

Like the `{{#if}}` block, the value being iterated can be any expression. Ractive also supports a special case empty iteration using the `{{else}}` special mustache.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcBAK5CV63MGABiBLJJgaWoghhEMGNRpo0CQ8ksMA6VbIEJ7BDxuehqGCELW9o60LsEAcgD2lta2nmmBwdGGPKbmUfqBOnqBpBTUxUjkAG5iEuy4sjBouMqBlVVKIDhE8FWNNLKUlDTMNKoIAO40AEpmuNUIABTAas4NTQi4kDQA5EbrzTtYq3QI0nIK23sK5-IIRydI8rLbK6rOGlY2RNsA2gC6JwcqgwAEoANyOVTWXAAFXIfgSWlwiwAZlpVCR5glVItQTQ3hpBpRPJQrGBFjsvrYjjRos5gGNfAgrtNyOYaAAJRoUIg7GjYekEpl+K4AKQSYHeAEUtORMfQaABBJ4CPkC476Bkilm7AAyPMVAHVZEIhPzgRoIWpsDQAEwABidEMwQA"></div>
```handlebars
<ul>
{{#each users}}
  <li>{{.name}}</li>
{{else}}
  <li>No users...</li>
{{/each}}
</ul>
```

> **Note:**
> Since Ractive uses a virtual DOM to represent the view, each block-level element must exist as a single unit. This means that unlike string-templating, you can't inject closing and opening tags into a tag by using a conditional section (e.g. `<div>hello{{#if split}}</div><div>{{/if}}world</div>`) because elements are also block-level entities.

## Events

That covers the basics of templating, but it's not particularly interactive. The most immediate example of interactivity in a web app would be responding to an event, and Ractive strives to make event handling as simple and powerful as is possible.

> **Note:**
> Ractive gets its name from the word 'interactive'. See it there hanging out with the 'inte'?

Ractive uses special element attributes, known as directives, to set up special handling for elements, and event handlers use the event directive. An event directive looks much like the old global inline event handler `onclick`, but it's not global or inline. Ractive's `on-click` directive will actually use `addEventListener`, when the directive is rendered, to set up an event listener on the target element.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcBAEYBXXLgD2qmkYC0JIeRIBrSQAFcYckQB0spEgAUAchIGdqgow3gCUyo7ONLr6RgQ80YaqSjRgskRRCAjGFlbWyDTAwH4BQRgYdOQCCERqcaQU1CqqBEjkAG5iEuy4sjBouMpxrW1KIDhE8G29NLKUlDTMNKoIAO40AEqyJLjtCJ7AajR0vf2QNN4AxD19CLjeWId0CNJyCmeXCi-yCPePSPKyM4HYw0DTFQIIGBnAAMjwwagwIQA3JggA"></div>
```handlebars
<button on-click="@this.add('counter')">this button</button> has been clicked {{counter}} times
```

When the `button` is rendered, Ractive will attach its proxy event handler to the button's `click` event, and when the button fires a `click` event, Ractive will evaluate the expression passed to the directive. In this case, the special reference `@this`, also known as the shorthand `@`, is used to get a handle to the Ractive instance and call the method `add`, which increments the given keypath by one (or the number passed if there is one). This means that each `click` event on the button will effectively call `app.add('counter')`.

Event directives can target any DOM event, including touch events where they're supported. The event directive takes the form `on-${eventName}`, and multiple events can be subscribed with the same directive by separating the event names with `-` e.g. `<div on-mouseover-mousemove-mouseout="@.add('movements')">mouse movements: {{movements}}</div>`.

> **Note:**
> Ractive also supports firing and listening to instance events and includes a shortcut for converting a DOM event into an instance event, but that's a bit of a more advanced topic for the Hello, World tutorial.

## Two-way Binding

Events are one major form of interaction, but they are not the only form of user input on a web page. Ractive also has very good support for form controls using two-way bindings to form values. This is a slightly polarizing form of handling user input, where some libraries demand that data updates be one-way and pushed from some external broker that handles input events back into the model. Ractive, however, embraces two-way binding, though you can have one-way updates using event handlers if that's what you want. In fact, Ractive's two-way bindings are effectively library managed event handlers with an appropriate `set` statement as the expression along with a little bit of attribute locking.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcBcqsoBXWgDdZQ3S3bBgAhESKy0GDKJ4r1mykoCaAe111GySBpzS2tbe0cQADoCHnc1GNIKahcCJHIDMQl2XFkYNFxlGLSDJRAcIngjGBpZSkoaZhpVBAB3GgAlWRJcdIQACmA1Gjpc-MCAcgBiHLyEXHGsIboEaTkFCemVmXkEcbUMAEoAbkwgA"></div>
```handlebars
<input value="{{message}}" />
<p>You typed: "{{message}}".</p>
```

When two-way binding is not disabled, Ractive treats `value` attributes as binding directives. In this case, the `value` attribute of the input is bound to the `message` keypath in the model. Each time the input fires an `input` or `change` event, Ractive will update the `message` keypath with the new value. `value` bindings may also be `lazy`, which means they only fire on `change` events (when focus is lost) or are debounced, depending on the value of the `lazy` binding directive.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABLgJ6UIC8AOnggB64D0YuAWwA27GuSRsOAykICGuBOwB8rAHatcBcqsoBXWgDdZQ3S3bBgAhESKy0GDKLkAvepICMABm+ieK9ZqUSgCSAORCQjQIBgiquLrGQvR0CBE09AD2unRg8ulZdIzINOaW1rb2jiAAdAQ8QWp1pBTU-gRI5AZiEuy4sjBouMp1HQZKIDhE8EYwNLKUlDTMNKoIAO40AEqyJLidCAAUwGo0dP2DkDShAMR9Awi4oVgnKdJyCpc3Cm-yCKFqGAAlABuTBAA"></div>
```handlebars
<input value="{{message}}" lazy="1000" />
<p>I'll eventually tell you that you typed "{{message}}".</p>
```

There are also special bindings for checkboxes, radios, selects, multiple selects, content-editiables, and textareas.

## Fin.

That's all for the basic tour of Ractive! From here, each tutorial explores or expands on a particular feature or group of related features in detail.
