# Partials

A partial is a template snippet which can be reused in templates or in other partials. They help to keep templates uncluttered, non-repetetive and easy to read.

## Writing

```html
Ractive.partials.myPartial = '<!-- template -->';
```

Partials are simply Ractive templates.

## Registering

Unlike other plugins, partials have more than 3 registration options.

Globally via the `Ractive.partials` static property.

```js
Ractive.partials.myPartial = MyPartial;
```

Globally, via a non-executing script tag on the current page.

```html
<script type="ractive/template" id="myPartial">
  ...
</script>
```

Per component, via the component's `partials` initialization property.

```js
const MyComponent = Ractive.extend({
  events: {
    myPartial: myPartial
  }
});
```

Per instance, via the instance's `partials` initialization property.

```js
const ractive = new Ractive({
  events: {
    myPartial: myPartial
  }
});
```

An inline partial, using the `{{#partial}}` mustache. Availability depends on whoever uses the template containing the inline partial, whether its a component, an instance or another partial.

```
{{#partial myPartial}}
  ...
{{/}}
```

## Using

Partials can be used using the `{{>partialName}}` syntax. Partials work where any template would work. It works as if the partial template is manually put into where the partial mustache is positioned.

```html
{{#partial myPartial}}
  <div class="message">{{message}}</div>
{{/}}

<div class="app">
  {{>myPartial}}
</div>
```

### Valid names

Partials may be named with the same rules as any other identifier in Ractive or JavaScript, but since there isn't much danger of trying to do math in a partial name, they enjoy relaxed naming requirements that allow otherwise reserved globals and keywords to be used for partial names.

Partial names may also contain `-` characters as long as they are surrounded by other valid characters e.g. `some-partial-template`.

### Partial context

By default, a partial's context is the context of wherever it is positioned.

In the following example, the context of the partial is the current item in the list.

```html
{{#partial myPartial}}
  {{this}}
{{/}}

{{# list }}
  {{>myPartial}}
{{/}}

```

However, partials may be given explicit context using the `{{>[name expression] [context expression]}}` syntax. It's similar to wrapping the partial with a `{{#with}}` mustache. Ancestor references, members, object literals, and any other expressions that resolve to an object may be used as a context expression.

In the following example, context of the partial is the current item's `foo.bar` value.

```html
{{#partial myPartial}}
  {{this}}
{{/}}

{{# list }}
  {{>myPartial .foo.bar}}
{{/}}
```

Explicit contexts can also be aliased. In the case of plain refereces, it can be used for two-way binding.

In the following example, the current item's `foo.bar` path is aliased with `item`. In the partial, `.label` refers to the current item's `label` property. However, `item` is essentially the current item's `{{.foo.bar.item}}`. The `item` binds two-way and updates the current item's `.foo.bar`.

```html
{{#partial myPartial}}
  <label>{{.label}}</label>
  <input type="text" value="{{item}}">
{{/}}

{{# list }}
  {{>myPartial .foo.bar as item}}
{{/}}
```

### Recursive partials

Partials can be used recursively. A common use case for this is when reusing partials on a tree-like structure, like a directory listing.

```html
<div class='fileSystem'>
  {{#root}}
    {{>folder}}
  {{/root}}
</div>

{{#partial folder}}
<ul class='folder'>
  {{#files}}
    {{>file}}
  {{/files}}
</ul>
{{/partial}}

{{#partial file}}
<li class='file'>
  <img class='icon-{{type}}'>
  <span>{{filename}}</span>

  <!-- if this is actually a folder, embed the folder partial -->
  {{# type === 'folder' }}
    {{>folder}}
  {{/ type === 'folder' }}
</li>
{{/partial}}
```

```js
rv = new Ractive({
  el: 'container',
  template: '#myTemplate',
  data: {
    root: {
      files: [
        { type: 'jpg', filename: 'hello.jpg' },
        { type: 'mp3', filename: 'NeverGonna.mp3' },
        { type: 'folder', filename: 'subfolder', files: [
          { type: 'txt', filename: 'README.txt' },
          { type: 'folder', filename: 'rabbithole', files: [
            { type: 'txt', filename: 'Inception.txt' }
          ]}
        ]}
      ]
    }
  }
});
```

In the example above, subfolders use the `{{>folder}}` partial, which uses the `{{>file}}` partial for each file, and if any of those files are folders, the `{{>folder}}` partial will be invoked again, and so on until there are no more files.

Beware of cyclical data structures! Ractive makes no attempt to detect cyclicality, and will happily continue rendering partials until the [Big Crunch](http://en.wikipedia.org/wiki/Big_Crunch) (or your browser exceeds its maximum call stack size. Whichever is sooner).

### Injecting partials

One good use of partials is to vary the shape of a template according to some condition, the same way you might use [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection) elsewhere in your code.

For example, you might offer a different view to mobile users:

```html
<div class='main'>
  <div class='content'>
    {{>content}}
  </div>

  <div class='sidebar'>
    {{>sidebar}}
  </div>
</div>
```

```js
isMobile = /mobile/i.test( navigator.userAgent ); // please don't do this in real life!

ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  partials: {
    content: isMobile ? mobileContentPartial : desktopContentPartial,
    sidebar: isMobile ? mobileSidebarPartial : desktopSidebarPartial
  }
});
```

Or you might make it possible to [extend](../Extend/Components.md) a subclass without overriding its template:

```html
<div class='modal-background'>
  <div class='modal'>
    {{>modalContent}}
  </div>
</div>
```

```js
// Create a Modal subclass
Modal = Ractive.extend({
  template: modalTemplate,
  init: function () {
    var self = this, resizeHandler;

    resizeHandler = function () {
      self.center();
    };

    // when the window resizes, keep the modal horizontally and vertically centred
    window.addEventListener( 'resize', resizeHandler );

    // clean up after ourselves later
    this.on( 'teardown', function () {
      window.removeEventListener( 'resize', resizeHandler );
    });

    // manually call this.center() the first time
    this.center();
  },
  center: function () {
    // centering logic goes here
  }
});

helloModal = new Modal({
  el: document.body,
  partials: {
    modalContent: '<p>Hello!</p><a class="modal-button" proxy-tap="close">Close</a>'
  }
});

helloModal.on( 'close', function () {
  this.teardown();
});
```

### Partial expressions

Expressions can also be used to reference a partial instead of fixed partial names. Ractive will evaluate the expression and use its return value to select a partial. This is useful when you want the data to indicate what type of partial it should render with.

In the following example, `organisms` contains a list of organisms whose `type` can either be `person` or `animal`. Partials for each type is defined and the list uses the `type` of each item to determine which partial to use.

```html
{{#partial person}}Hi! I am {{.name}} and I have {{.fingerCount}} fingers!{{/}}

{{#partial animal}}Hi! I am a {{.name}} and I have {{.legCount}} legs!{{/}}

<ul>
  {{# organisms }}
    <li>{{> type }}</li>
  {{/}}
</ul>
```

In the case where there's a collision between the expression and a partial of the same name, Ractive will not evaluate the expression and instead, will immediately resolve to that partial.

In the following example, a partial named `type` is defined. Instead of evaluating `type`'s value, it will resolve to the partial named `type`.

```html
{{#partial person}}Hi! I am {{.name}} and I have {{.fingerCount}} fingers!{{/}}

{{#partial animal}}Hi! I am a {{.name}} and I have {{.legCount}} legs!{{/}}

{{#partial type}}Hi! I am {{.name}}{{/}}

<ul>
  {{# organisms }}
    <li>{{> type }}</li>
  {{/}}
</ul>
```

Partials can also be registered on-the-fly as well as have functions determine the partial to use.

In the following example, `makePartial` registers a partial on the fly using `template` and `id`, and returns the partial name for use in the template.

```js
new Ractive({
  el: 'main',
  template: `
    <span>Add a partial:</span>
    <textarea value="{{tpl}}" /></div>
    <button on-click="@this.add()">Add</button><br/>

    {{#list}}
      {{> @this.makePartial(.id, .template) }}
    {{/}}
  `,
  data: {
    list: [],
    tpl: '',

  },
  add: function() {
    this.push('list', {
      id: Math.random(),
      template: this.get('tpl')
    });
    this.set('tpl', '');
  },
  makePartial: function(id, template) {
    const name = 'partial-' + id;
    this.partials[name] = this.partials[name] || template;
    return name;
  }
});
```

### Updating Partials

Partials may be reset after they are rendered using [`ractive.resetPartial()`](../API/Instance Methods.md#ractive.resetPartial()). A reset partial will update everywhere it is referenced, so if it is used multiple times or inherited by a component, those instances will be updated as well. If a component has a partial with the same name as a parent partial, partial resets will not affect it since it is a different partial.

It should be noted that partials evaluate lazily, so it is possible to cause a single partial to update by wrapping it in a conditional section and causing the section to be hidden and re-shown.

```html
{{^toggle}}{{>rickroll}}{{/}}
```

```js
ractive.partials.rickroll = 'I wouldn\'t do that to you, chum.';
ractive.set('toggle', true);
ractive.set('toggle', false);
```

## Examples

Here's an example of a gallery using a partial for its thumbnail information:

```html
<!-- The partial called "thumbnail" -->
<figure class='thumbnail'>
  <img src='assets/thumbnails/{{id}}.jpg'>
  <figcaption>{{description}}</figcaption>
</figure>

<!-- The template that uses the partial -->
<div class='gallery'>
  {{#items}}
    {{>thumbnail}}
  {{/items}}
</div>
```
