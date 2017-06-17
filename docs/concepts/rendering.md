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

Server-side rendering can be achieved using [`ractive.toHTML()`](../api/instance-methods.md#ractivetohtml) and [`ractive.toCSS()`](../api/instance-methods.md#ractivetocss). Both methods render the instance and its descendants at their current state to HTML and CSS, respectively.

```js
const Component1 = Ractive.extend({
  data: {
    message: '';
  },
  template: `
    <div class="component1">{{message}}</div>
  `,
  css: `
    .component1 { color: red }
  `
})

const Component2 = Ractive.extend({
  data: {
    greeting: '';
  },
  template: `
    <div class="component2">{{greeting}}</div>
  `,
  css: `
    .component2 { color: green }
  `
})

const App = Ractive.extend({
  components: {
    Component1,
    Component2
  },
  data: {
    greet: '',
    msg: ''
  },
  template: `
    <Component1 message="{{ msg }}" />
    <Component2 greeting="{{ greet }}" />
  `
})

const state = { greet: 'Good Morning!', msg: 'Hello, World!' }
const app = App({ data: state })
const html = app.toHTML()
const css = app.toCSS()
```

Currently, there are a few limitations to this feature:

- `ractive.toHTML()` prints HTML without component IDs while `ractive.toCSS()` prints out selectors with component IDs, which causes the HTML and CSS to not match up.
    - A workaround is to render the CSS as is by setting [`noCSSTransform`](../api/initialization-options.md#nocsstransform) to `true` and to use a CSS naming convention (i.e BEM, OOCSS, SMACSS) to match up selectors with their elements.
- `ractive.toHTML()` does not automatically insert the document CSS when rendering a component that represents a full document. This must be done manually.
