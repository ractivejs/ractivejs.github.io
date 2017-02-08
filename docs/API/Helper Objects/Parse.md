# Parse

The parse object is an object you receive as the second argument in [function templates](../Initialization Options.md#template). This helper object provides you with essential functions to dissect markup before turning over the template for use.

---

## p.fromId()

Retrieves the template from the DOM `<script>` tag specified by `id`. Make sure to set `type='text/ractive'` on the `<script>` tag to prevent the browser from running the template as a script.

**Syntax**

- `p.fromId(id)`

**Arguments**

- `id (string)`: The id of the `<script>` tag containing the template. The leading `#` is optional.

**Returns**

- `(string)`: The template inside the specified element.

**Examples**

```js
// TODO
```

---

## p.isParsed()

Test whether the supplied template is already parsed and is in its object form.

**Syntax**

- `p.isParsed(template)`

**Arguments**

- `template (string|Object)`: The template, either in its string form or object form.

**Returns**

- `(boolean)`: Returns `true` if the template is already parsed, `false` if otherwise.

**Examples**

```js
// TODO
```

---

## p.parse()

Parses the template using [Ractive.parse()](../Static Methods.md#Ractive.parse()). Full Ractive runtime must be loaded.

**Syntax**

- `p.parse(template[, parseOptions])`

**Arguments**

- `template (string|Object)`: The template in its string form or object form.
- `[parseOptions] (Object)`: Template parser options. See [Ractive.parse()](../Static Methods.md#Ractive.parse()) for all available options. If `parseOptions` is not specified, it defaults to those of the current instance.

**Returns**

- `(Object)`: The parsed template.

**Examples**

```js
// TODO
```
