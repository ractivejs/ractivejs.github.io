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
