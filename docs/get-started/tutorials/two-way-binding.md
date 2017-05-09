# Two-way Binding

HTML forms are a very important part of many web applications. Most data-binding in a template only goes in one direction - from the model to the view, but form elements provide a point at which the view could update the model. To that end, Ractive.js provides special bindings for form elements that go both ways - from the model to the view and from the view to the model - or two-way bindings.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwE1AIwQq+gmeQCi-BTHLaAPYArv78DIoIkHaeBMT8ksG47vZczq4prB4EkmwAEq4qgVjkwMDhkRgYAIRcuUKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwDG4TCyQ5ADkAMRLzAi4a1iLSqrqUetbR2oKawIYAJQA3G0govCYQA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwE1AIwQq+gmeQCi-BTHLaAPYArv78DIoIkHaeBMT8ksEypAwqwfr0wMDhkRgYth5czq7u9jEEkmwAEq4qgVjkWTkIeQCEXJVCnGIS0mwgOMLwKf7mltbk1OT8CADu5ABKFlakCAAUwDG4TCyQ5ADkAMTbzAi4+1hbSqrqUQfH12oK+wIYAJQA3AMgovCYQA">Fix Code</button>
</div>

The 'Hello, world!' of two-way data binding looks like this:

```handlebars
<label>
  Enter your name:
  <input value='{{name}}'>
</label>

<p>Hello, {{name}}!</p>
```

Update the template and re-render it, then type your name in the box.

> Internally, we're binding to `input` events (and `keyup` for IE, since it doesn't fire `input` correctly) alongside `change` and `blur` events – this ensures instantaneous feedback for a slick experience.
> 
> If you'd rather the updates only happened on `change` and `blur`, pass in `lazy: true` as an initialisation option.
> 
> If you'd rather disable two-way binding altogether, you can do so with `twoway: false`.
>
> You can also control two-way bindings and laziness on a per-element basis using the `twoway` and `lazy` directives. The `lazy` directive may be boolean, or if you'd like to get updates without a blur, you can pass it a number of milliseconds to wait after the last `input` event to trigger the update.

That's a cute demo, but it doesn't have much real world use. In all likelihood we want to do something with the data when it changes. For that, we use `ractive.observe()`:

```js
ractive.observe( 'name', function ( newValue, oldValue ) {
  doSomethingWith( newValue );
});
```

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwE1AIwQq+gmeQLF+kgK4yOnrUAOSiYAiiANZOAPZGIe725OTAwADExABm5OGRUcgYGHnRyACEaa7CCEX8sTIlBUhpnNlFdg6czq5JrB4EWcSuSNW4vSmODC5u3r4BWrr6IeYksSHkpAwqfkswyOuNyGzke0hc3W4dExccPv6Bi6ErxGsbWzuhKHsI-InkXwgfucpj0rl4brN7gtgssGKt1pttksnEi-iidsDpuMvJI2AAVCLkaoqSIKJC5WIqWJ+GCUYReYSSBj8Ik6EmhUSU2IwSCpYCcqkwIoAbkSaQF3KKXEZzLYADouLiOlxBsNRu5peIpGMQDhhPBNrTzJZrORqOR+AgAO7kABKFispAQAApgB1cEwWLyQukPcwELgQlh3UpVOoEN7faG1AoQgIMABKYW6kCieCYIA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwE1AIwQq+gmeQLF+kgK4yOnrUAOSiYAiiANZOAPZGIeThkVHIocDAydHIGBgh7vbk5BkAxMQAZkkR2Ui5WalIAIQZrsIIufyxMvXIGZwVuXYOnM6uBaweBOXErkhtuONFjgwubt6+AVq6+iHmJLGJ-AyKOxmisSqxMLmJpAwqfjswyIk9SGzkz0hco25DS78OD5-IFtqE9sQDuQjid0pkLlcbuQ7g8dihngh+PlyOiEJifisxv8vID1iCtsFdgx9odjqd4ZdrnlkfdHqEnKjsRzHgTVosvJI2AAVCLkNoqSIKJBJBF+GCUYReYSSBj8MU6CWhc6MyDFBmIjAAbnyZwRTK4ytVbAAdFxBUMuNNZvN3BbxFIFiAcMJ4Hd5eZLNZyNRoQgAO7kABKFispAQAApgENcEwWLqQiUU8wELgQlhk0pVOoEOnM4W1AoQgIMABKQ1ekCieCYIA">Fix Code</button>
</div>

You can control whether checkboxes are checked or not like so:

```handlebars
<label>
  <input type='checkbox' checked='{{checked}}'>
  {{#if checked}}checked!{{else}}not checked{{/if}}
</label>
```

Update the template and try toggling the checkbox.

If you have a group of radio buttons, whose values are mutually exclusive, you can do this:

```handlebars
<label><input type='radio' name='{{color}}' value='red' checked> red</label>
<label><input type='radio' name='{{color}}' value='green'> green</label>
<label><input type='radio' name='{{color}}' value='blue'> blue</label>
<p>The selected colour is <span style='color: {{color}};'>{{color}}</span>.</p>
```

Here, because we've set the `name` attribute to `{{color}}`, the value of `color` is set to the `value` attribute of whichever radio button is currently checked. (If you need to read that sentence a couple of times, I don't blame you.) Notice that the value is initialised to `red`, because that option is initially checked.

Add `name='{{color}}'` to each of the options in the template and run the code.

> Front-end über nerds will notice that this isn't how these attributes normally work. For example, a checkbox with checked='false' is the same as one with checked='true', because it's a boolean attribute which either exists on the element or doesn't – its value is completely irrelevant.
> 
> Furthermore, once you've interacted with a checkbox, its checked attribute becomes irrelevant! You can only change the value programmatically by doing element.checked = true rather than  element.setAttribute( 'checked' ).
> 
> Combine all that with cross-browser quirks (e.g. IE8 and below only fire  change events on blur), and we're in some seriously confusing territory.
> 
> So Ractive.js makes no apology for using checked='{{checked}}' to mean 'checked if checked is true, unchecked if it's false'. We're bringing sanity to the process of gathering user input.

Needless to say, you can continue to interact with the values programmatically:

```js
ractive.set( 'checked', true );
ractive.set( 'color', 'green' );
```

This is as good a time as any to introduce the `ractive.toggle()` method:

```js
ractive.toggle( 'checked' );

// Equivalent to:
//   var checked = ractive.get( 'checked' );
//   ractive.set( 'checked', !checked );
```

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEAZsQQqkwhLj6CZ5AmoAjVw5ifkkAVxkdPWoAcnMSAHtY8n4GRX1Y4GBRRJVEmAwMFNIGFXDMmGQU0TAEUQBrZDZyKqQuQOC7X38GIJUQsMitXUqGJJS0jLjs3PzC4vJS8syUKoR+WJa1hA2Ovq6fcj9OgYJQiKjRuITiZNT0zNm8gqKSsoq4gJWt8m+K-b9bz2LjOVzuTzA1g+AiSNgAFTq5A8KnqCiQ5DmiXCMEowj8wkkDH4yJ0qLiWJgkHIz3mRQA3Ftaa8MFxCcS2AA6LhwoScMQSaRsEA4YTwUq48yWazkaipBAAd3IACULFZSAgABTAbq4JgsamxADEeuYnliWF1SlU6gQhpN1rUCliAgwAEp6SKQKJ4JggA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwiEKhJfKkGKgK76A5MGCiAPYqgTAYGD58gjLk-gDECBZg5EEhMMLhdjHk5ASB0sSB-Gz+uGDEGRhc+VZFUfY5-pyJomCZ0VzCTi649awdkmwAKmAI5F3OlsgpwYGeMJTCucKSDPzjOs7UPqmhkLEBs2EYANyR-rvHnavFAHRcg0KcYhLSbCA4wvDuC+aW1uRqOR+AgAO7kABKFispAQAApgFlcEwWPsfHFkcwELgfFgkUpVOoEGiMQS1ApcVkkOoGPtEdF7JdhPsANrkHwwZC49koTkIfjcnwAIy8CB85AAuniGbhLmjeQh+T4shgBBgAJQnD4gUTwTBAA">Fix Code</button>
</div>

As well as `<input>` elements (and `<textarea>`s, which work similarly), two-way binding works with `<select>` menus. Let's replace the radio group from the previous step with a `<select>`:

```handlebars
<select value='{{color}}'>
  <option>red</option>
  <option>green</option>
  <option selected>blue</option>
</select>
```

> I apologise to my fellow Brits, and other English-speaking non-Americans, for the repeated use of color instead of colour. Occupational hazard.

Re-render the ractive. Notice that once again, the data is initialised to the value of the selected `<option>` – in this case, blue. (You can explicity set a `value` attribute, but if you don't, the text content of the `<option>` is used instead.)

That's good, but we can go one better – rather than hard-coding our colours into the template, let's do it properly:

```handlebars
<select value='{{color}}'>
  {{#each colors}}
    <option>{{this}}</option>
  {{/each}}
</select>
```

> We haven't seen `{{this}}` before – it simply means 'the current context'. Previously, whenever we've used lists, they've been lists of objects, so we've been able to use a property of the object (like `{{name}}`). Using this allows us to use lists of primitives (in this case, strings) instead.
> 
> If you prefer, you can use `{{.}}` instead of `{{this}}`.
>
> You can also set up an alias to `this` for a slightly more human friendly template in many circumstances. Within `{{#each users as user}}...{{/each}}`, `user` will resolve to the current iteration. You can still use index names too e.g. `{{#each users as user: i}}...{{/each}}`.

And add some data to our view:

```js
var ractive = new Ractive({
  el: output,
  template: template,
  data: {
    colors: [ 'red', 'green', 'blue' ],
    color: 'green'
  }
});
```

> The template no longer has an `<option>` with a `selected` attribute, so we need to specify an initial value of `color`.
Execute this code. For extra credit, add more colours:

```js
ractive.push( 'colors', 'purple' );
```

## Step 4
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbAKrCE5AgGsARkjYBlMGIAMwdOHz9yBn4kDwi2YGBFBFwGDAwueK0Ae3I3FQRLckUAVxUrVXds6WJs-mFILic7VkEHfMKZUgYVEv0AckSOy2QAYWyVbJhhdP6+NvJyRIBiBAswclEJqZmMFsXFgmqrOoTgXCDdrmPa-nn7RcTONdEwdJauYdx71vsVkLyCAKIyQ40m0wAdAV+CgLu8Fh4nAAVMDuL7ITbbErTKIwBCNTjNBEEMo-A5LYCrdaA4EKUHbabwh7kjwqYh5HQFaj9bwWTwoGDZEoxAC0W3BkApF2IuwA3HNEtKrpw2WSDk8Xm89sTOKSWokgW4mTJEWwAHK5cVCnFMNFAzrICFNH5PELwz7iKTfEA4YTwbowcjmSzWcjUcj8BAAd3IACULFZSAgABTAFqpZgpSX9ZYZlj9LDppSqdT48g5hTKNQKAstJDqBiStNtexW6aSgDa5bxSAL5YFCAQ-D7PN6CBHkmxlX65AAuoWW7hkqlJZwALIWTgQhTCXDJ-gMUjEFDqKYQhiSSQANQQ01uAEpyAB+cujRS98jZ0a4GAqfotbUMHvWUfRAUR4EwIA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbAKrCE5AgGsARkjYBlMGIAMwdOHz9yBn4kDwi2YGBFBFwGDAwueK0Ae3I3FQRLckUAVxUrVXds6WJs-mFILic7QQd8wplSBhUS-QByRPbLZABhbJVsmGF0vuKyioK+VvJyRIBiBAswclFxyemMOxkVj2qrOoTgXCCDrjPa-iX7FcTOTdEwdKOuIdwn1la6xCeQQBWGSDGEymADoCvwUNcvssPE4ACpgdy-ZA7PYlKZRGAIRqcZrIghlf4nVbADZbEFghQQvZTJHPKkeFTEPI6ArUPreCyeFAwbIlGIAWl2UMg1OuxAOAG4+pc5bdOJzKSdXu9PocyZwKUdEqC3Kzjo42AA5XJS0X4piY0EdZDQpr-V4hJE-cRSP4gHDCeBdGDkcyWazkajkfgIADu5AAShYrKQEAAKYBHVLMFIyvprbMsPpYLNKVTqInkfMKZRqBTFo5IdQMGWZ1r2W1TGUAbSrhKQxarwoQCH4g-5PQQ48keMqswAuiX27hkqkZZwALIWTjQhTCXBp-gMUjEFDqSbQhiSSQANQQUweAEpyAB+KsjRQD8h5ka4GAqPojj1DBHwVf0QFEeBOVWI5OxlNZgkQhUjkkBgkBIeEZQABmhABWJRkNaEhhHLbQZWIfhORjcVvAmURPEI+xFCYFAKOwwi9QEMoYNaTl93FfdtAKGV+DqBBGNwVD0IolB2IEDBMCAA">Fix Code</button>
</div>

In some situations you need to make it possible to select several values simultaneously. HTML has us covered – we use the `multiple` attribute with a `<select>`.

Unfortunately that's as helpful as it gets – `selectElement.value` returns the value of the _most recently selected_ option, which is just mad, frankly. In almost all cases, if you're using a select element with the `multiple` attribute, what you really want is an array of the selected values. This is what Ractive.js provides.

Try adding the `multiple` attribute to the template:

```handlebars
<select value='{{selectedColors}}' multiple>
```

Execute, then try making multiple selections. And, of course, it works the other way round:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbAKrCE5AgGsARkjYBlMGIAMwdOHz9yBn4kDwi2YGBFBFwGDAwueK0Ae3I3FQRLckUAVxUrVXds6WJs-mFILic7QQd8wplSBhUS-QByRPbLZABhbJVsmGF0vuKyioK+VvJyRIBiBAswclFxyemMOxkVj2qrOoTgXCCDrjPa-iX7FcTOTdEwdKOuIdwn1la6xCeQQBWGSDGEymADoCvwUNcvssPE4ACpgdy-ZA7PYlKZRGAIRqcZrIghlf4nVbADZbEFghQQvZTJHPKkeFTEPI6ArUPreCyeFAwbIlGIAWl2UMg1OuxAOAG4+pc5bdOJzKSdXu9PocyZwKUdEqC3Kzjo42AA5XJS0X4piY0EdZDQpr-V4hJE-cRSP4gHDCeBdGDkcyWazkajkfgIADu5AAShYrKQEAAKYBHVLMFIyvprbMsPpYLNKVTqInkfMKZRqBTFo5IdQMGWZ1r2W1TGUAbSrhKQxarwoQCH4g-5PQQ48keMqswAuiX27hkqkZZwALIWTjQhTCXBp-gMUjEFDqSbQhiSSQANQQUweAEpyAB+KsjRQD8h5ka4GAqPojj1DBHwVf0QFEeBOVWI5OxlNZgkQhUjkkBgkBIeEZQABmhABWJRkNaEhhHLbQZWIfhORjcVvAmURPEI+xFCYFAKOwwi9QEMoYNaTl93FfdtAKGV+DqBBGNwVD0IolB2IEDBMCAA" data-eval="E4QwxgLglgbgpgOgM5wgCgAQHIUBs6RwAmAwgPa5nBJYA0GA2tgObBxwB2d2ADgK7Ae+LBgC6GAJQBuIA"></div>
```js
ractive.set( 'selectedColors', [ 'green', 'purple' ]);
```
