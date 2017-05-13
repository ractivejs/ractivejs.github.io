# Parsing

In order for Ractive to utilize templates, it first parses the templates into a tree-like data structure, much like how a browser's HTML parser would process HTML. This data structure contains everything Ractive needs to know to construct an instance's DOM, data bindings, events and transitions etc.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwT4hGhVkxCKgCYAVFZIrJZ2FdQbUASvMWqRFlYqABQA5Pg2ytTELoSEzCCSKnGyQmog6gASKqji1ADq4jDINgCEWpFK6qEAlADcTPAmhOLIKiLI4kLBAFIAygDyAHIiZuTwQmQAZgCewYHW9o7Orio19SBoQA"></div>

```
Ractive.parse('<div class="message">Hello World!</div>');

// {"v":4,"t":[{"t":7,"e":"div","m":[{"n":"class","f":"message","t":13}],"f":["Hello World!"]}]}
```

Normally, parsing is done automatically. Ractive will use [`Ractive.parse()`](../../api.md#ractiveparse) under the hood if a string template is provided to the [`template`](../../api.md#template) initialization option.

The parsed template is not designed to be readable nor editable by a human. It is meant to represent the template structure as an object in a way Ractive understands with as few bytes as possible. Where the template doesn't use Ractive-specific features, these parts will be represented as plain HTML in the data structure.

## Pre-parsing

Parsing templates can be a very slow operation, particularly for very large apps, very complex templates, or intricate SVGs. As an optimization option, templates can be pre-parsed into their object form outside of runtime. This would allow Ractive to skip parsing during runtime and speed up app initialization. Typically, a parsed template is only about 30-40% larger than the string version, making pre-parsing a trade-off between space and processing.

Pre-parsing can be done in many different ways as long as Ractive receives the parsed template during runtime. One way would be to simply serve the pre-parsed template separately from the component or instance and load it via AJAX. Another would be to extract and replace the template on the file with the parsed version during compile time - an approach that works well with [component files](../../api.md). Read more about [loaders](../../integrations.md#loaders) to know more about how loaders do pre-parsing on compile time.
