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

```js
Ractive.escapeKey('foo.bar'); // foo\.bar
```



## Ractive.extend()

Creates a "subclass" of the Ractive constructor or a subclass constructor. See [`Components`](../extend/components.md) for an in-depth discussion on the use of `Ractive.extend`.

**Syntax**

- `Ractive.extend([options[, ...optionsN]])`

**Arguments**

- `[options] (Object)`: One or more objects that represent the defaults for instances of the subclass, with the latter objects' properties taking precedence over the former. See [Initialization Options](../api/initialization-options.md) for a list of possible options.

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
const instance1 = new SubClass({
    el: '.div1'
});

// <div>Lorem Ipsum</div>
const instance2 = new SubClass({
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
- `options (Object)`: An object with initialization options as properties. See [initialization options](../api/initialization-options.md) for a list of possible options.

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

Accepts a node and returns a [Context](./context.md) object containing details of the Ractive instance the node is associated to.

**Syntax**

- `Ractive.getContext(node)`

**Arguments**

- `node (string|Node)`: The DOM node or a CSS selector of the DOM node for which you wish to retrieve the Ractive instance or view details.

**Returns**

- `(Context)`: A [context](./context.md) object.

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
Ractive.splitKeypath( 'foo.bar\.baz' ); // [ 'foo', 'bar.baz' ]
```



## Ractive.unescapeKey()

Unescapes the given key e.g. `foo\.bar` => `foo.bar`.

**Syntax**

- `Ractive.unescapeKey(key)`

**Arguments**

- `key (string)`: The key to unescape.

**Returns**

- `(string)`: The unescaped key.

**Examples**

```js
Ractive.unescapeKey('foo\.bar'); // foo.bar
```
