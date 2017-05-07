# Partials

Partials are a good way to split complex templates up into several more manageable files. Take this todo list, for example. It's not too bad, but the template would look neater if we could separate out the code for an individual item.

## Step 1

Well, we can. Add this above the rest of the JavaScript:

```js
var item = "<li class='{{ done ? \"done\" : \"pending\" }}'>" +
             "<input type='checkbox' checked='{{done}}'>" +
             "<span class='description' on-tap='edit'>" +
               "{{description}}" +

               "{{#if editing}}" +
                 "<input class='edit' " +
                          "value='{{description}}' " +
                          "on-blur='stop_editing'>" +
               "{{/if}}" +
             "</span>" +
             "<a class='button' on-tap='remove'>x</a>" +
           "</li>";
```

Then, in the main template we replace all that with a partial, which looks like a regular mustache but with a `>` character:

```handlebars
<ul class='todos'>
  {{#each items:i}}
    {{>item}}
  {{/each}}
</ul>
```

Finally, we need to add the partial when we define our TodoList:

```js
var TodoList = Ractive.extend({
  template: template,
  partials: { item: item },
  // etc...
});
```

Execute this code.

## Step 2

Fine, except that multiline string was fugly. It's good to know that you can pass partials in as strings, but unless you're loading those strings from a template file with AJAX, you'd probably prefer a neater way.

There are two. Firstly, you can add partials as `<script>` tags on the page:

```handlebars
<script id='item' type='text/html'>
<li class='{{ done ? "done" : "pending" }}'>
  <input type='checkbox' checked='{{done}}'>
  <span class='description' on-tap='edit'>
    {{description}}

    {{#if editing}}
      <input class='edit'
             value='{{description}}'
             on-blur='stop_editing'>
    {{/if}}
  </span>
  <a class='button' on-tap='remove'>x</a>
</li>
</script>
```

> Note that the `id` attribute is the name of the partial, and that the `type` attribute is `text/html` (though it could be anything, as long as it's not `text/javascript`). This is a convenient way to quickly test ideas out on a blank page (you can use these script tags as main templates as well as partials - just reference them as e.g. `'#myTemplate'` in your initialisation options).

Or, you can use an _inline partial_. Inline partials are declared within your template, using the `{{#partial myPartialName}}` syntax:

```handlebars
{{#partial item}}
  <li class='{{ done ? "done" : "pending" }}'>
    <input type='checkbox' checked='{{done}}'>
    <span on-tap='edit'>
      {{description}}

      {{#if editing}}
        <input class='edit' value='{{description}}' on-blur='stop_editing'>
      {{/if}}
    </span>
    <a class='button' on-tap='remove'>x</a>
  </li>
{{/partial}}
```

Add the partial to the template, and remove it (and the `var item = ...` bit) from the javascript code.

> In addition to supporting partial strings, Ractive.js will accept a pre-parsed template in the `partials` map, or as the `template` option, for that matter. Pre-parsed partials have the benefit of not requiring the parser at runtime, which means rendering can happen a bit faster - and you can ship a lighter-weight version of Ractive.js to the browser (see the runtime-only build).

## Step 3

TODO: partial context

## Step 4

TODO: partial expressions
