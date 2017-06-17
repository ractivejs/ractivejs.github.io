#Rendering

## Scoped CSS

CSS provided via the [`css`](../api/initialization-options.md#css) initialization option is scoped to the component.

```js
const Component = Ractive.extend({
  template: `
    <span>I'm red</span>
    <div>
      <span>I'm also red</span>
    </div>
  `,
  css: `
    span { color: red }
  `
});

Ractive({
  components: { Component },
  el: 'body',
  template: `
    <Component />
    <span>I'm not red</span>
  `
})
```

This is done by generating a unique id for each component definition. That ID is then added to each selector defined in `css` and to each top-level element in the component's DOM.

```css
span[data-ractive-css~="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}"],
[data-ractive-css~="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}"] span {
  color: red
}
```

```html
<span data-ractive-css="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}">I'm red</span>
<div data-ractive-css="{6f9bd745-a6b9-9346-0c8c-e3cc94b3d2a5}">
  <span>I'm also red</span>
</div>
<span>I'm not red</span>
```

Currently, there are a few limitations to this feature:

- ID-based scoping is not true component scoping and will affect elements of descendant components.
- `css` can only be used with components and not on direct Ractive instances. This may change in the future.

## Progressive Enhancement

TODO

## Server-side

TODO
