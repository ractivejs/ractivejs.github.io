# Expressions and Computations

Accessing data directly from within a template is quite useful, but there are some situations in which it is not at all convenient to have values for every possible data point computed ahead of time. To address that, Ractive supports both computed properties at the instance level and expressions within templates, both of which use a dependency tracking system that allows them to update reactively when data on which they depend changes.

## Template Expressions

Ractive's template parser has a fairly complete JavaScript parser inside it, so that it can read plain JS expressions with Ractive references in order to know what expressions need to be recomputed when data changes. Ractive template expressions can be just about any JavaScript (ES5) expression with a few exceptions:

* Assignments are not permitted i.e. `i = 10`, `a += b`, `i++`, `--a`, etc.
* `new`, `delete`, and `void` are not available.
* Function literals are not permitted i.e. anything involving the `function` keyword.
* As statements (as opposed to expressions), `for`, `with`, `if`, `return`, etc are not permitted.

Beyond those exceptions, pretty much all of JavaScript is available, including some applicable features from later versions of ECMAScript, like array, object, and argument spread operators.

### Functions in Data

Any functions that can be referenced within a template can also be called within the template. Functions may exist in an instance's data, among its members accessed using `@this`, globally via `@global`, and shared across Ractive instances via `@shared`. They can be called, as you would expect, by referencing them and using a call operator or method e.g. `fn(arg)`, `fn.call(context, arg)`, or `fn.apply(context, [arg])`.

### Conversion to Functions

After parsing, template expressions have any references extracted into a list of dependencies, and the references are replaced with numbered placeholders. If the parser is in [csp](../../initialization-options#csp) mode, then the parser will create functions for each expression in the template and attach them to the template object's expression cache by name. After reference extraction, expressions are much more generic, so different expressions can end up referencing the same function. For instance, `a + b` and `answer + otherSum` both reduce to `_0+_1`. When the function for that expression is created, either at parse or runtime, it will look like `function(_0, _1) { return _0+_1; }`.

When the runtime encounters an expression while rendering a template, it will create a special model to stand in as a proxy for the expression. The proxy will have the list of references that expression depends upon along with the function that matches the expression. When asked for a value, the proxy will resolve all of the dependencies to values and call the function with them in the correct order. The function is called inside a `try`/`catch` so that any expceptions that may happen inside the expression don't blow up the render.

### Use

Template expressions can be used just about anywhere in a template that would accept a regular reference, and in a few additional places, like event directives.

## Capture and Dependencies

When evaluating an expression or computation, Ractive will keep track of any keypaths accessed via [`get`](../../api/instance-methods#ractiveget) and record those as dependencies of the computation. The mechanism that tracks dependencies in computations is called capture. If any dependency of a computation changes, then the computation will recompute and notify any of it's dependents that it also has a new value.

> Note: that in addition to be reactive, computations are also lazy, meaning that they will not actually compute a value until a dependent asks for the value.

## Computed Properties

Computed properties are accessible in the same way as references that exist at the root of an instance's viewmodel. They may be read-only or read-write depending on whether or not they have both a getter and a setter. Like expressions, computations use capture to track their dependencies, so changes in a computations dependencies will cause the computation to invalidate and recompute.
