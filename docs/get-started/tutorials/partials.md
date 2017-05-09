# Partials

Partials are a good way to split complex templates up into several more manageable chunks. They also allow re-use of bits of template without having to repeat the template.

## Step 1

Take this todo list, for example. It's not too bad, but the template would look neater if we could separate out the code for an individual item. Well, we can. Add this above the rest of the JavaScript:

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

Finally, we need to add the partial when we initialize out instance:

```js
var ractive = new Ractive({
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

That covers breaking templates into more manageable or logical chunks, so moving on to reuse, we'll grab our handy bag of contrivances and pull out... a formatted name. It's a bit simple, but it should suffice.

Suppose we have a webapp that deals with people, businesses, and the yachts that they own. All three of those happen to have names that we'll say are broken down in slightly different ways. A yacht just has a name. A business has a name and a potential classifier, like LLC. A person has a given name, a family name, any number of middle names, and a potential suffix. A yacht is also owned by a business or a person, which, as we've established, both have names. (We're gonna go ahead and pretend that most yacht owners don't have a corporate entity to hold their yachts.)

What we want to do is take our list of yachts with their various owners and display them in the table. Here's a partial that would work with each type of entity:

```handlebars
{{#if .type === 'business'}}
  {{.name}}{{.classifier ? `, ${.classifier} : ''}}
{{elseif .type === 'yacht'}}
  {{name}}
{{else}}
  {{.familyName}}, {{.givenName}}{{.suffix ? ` ${.suffix}` : ''}}
{{/if}}
```

Now we want to use the partial for both the yacht and the owner, but the owner is a property of the yacht. We could use a `#with` block to set the context for the owner partial. It turns out that's a pretty common thing to need when working with complex apps with lots of partials, so Ractive.js has a sugared version of a partial that accepts a context after the partial name:

```handlebars
{{>name .owner}}
```

> This is roughly equivalent to `{{#with .owner}}{{>name}}{{/with}}`, but not quite exactly the same. For reasons that will become clear in the next step, the `#with` portion of the partial with context is wrapped around the template of the partial and not the partial mustache itself.
>
> If no context is supplied to a partial, then it inherits its context from its parent.
>
> Partials may also set aliases instead of passing a context, which is convenient if there's more than one bit of data that needs to be uniform going into the partial. For instance `{{>user .homePhone as phone, .workEmail as email}}` lets the caller of the partial specify what `{{phone}}` and `{{email}}` should mean inside the partial. Again, this is the rough equivalent of the similar `#with` construct, `{{#with .homePhone as phone, .workEmail as email}}{{>user}}{{/with}}`.

## Step 4

That last contrivance was a bit stretched, so let's stretch it a bit further and see if it breaks. We want to future-proof our webapp in case some other type of entity should arise to be involved with our yachts. So we decide that we want to create a specific partial for each type of entity:

```handlebars
{{#if .type === 'business'}}
  {{>business-name}}
{{elseif .type === 'yacht'}}
  {{>yacht-name}}
{{else}}
  {{>person-name}}
{{/if}}
```

Perhaps that's a bit better, but it's not very expandable _or_ pretty. As it turns out, the name given to a partial mustache may also be an expression that evaluates to a string. So we can go ahead and replace our wrapper-partial with something simple:

```handlebars
{{> `${.type}-name`}}
```

> When the expression evaluates, it will return a string, which will then be used to look up the appropriate partial in the registry. Partials check for a matching name before evaluating as an expression, so if you an expression that could also be a valid partial name, the partial name will be picked rather that the result of evaluating the expression. For example with partials named `user` and `larry` and a property `user: 'larry'`, `{{>user}}` will use the `user` partial rather than the `larry` partial.

Now when it turns out that we need to also keep up with buildings, that for our purposes include a street address in their name, we can do so easily by adding a new partial named `building-name`:

```handlebars
{{.name}}, {{.address}}
```

I think that contrivance has snapped, possibly in more than one place, but hopefully it was served its purpose.
