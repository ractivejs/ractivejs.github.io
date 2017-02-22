# ractive.transitions

Each Ractive instance has a `transitions` property, which contains [transition functions](transitions.md) specific to that instance.

When an element with a specified `intro` or `outro` transition is added or removed, Ractive first looks at `ractive.transitions` to see if it can find the right transition function. If it fails, it then looks in `Ractive.transitions` (the [global transitions registry](ractive-transitions-global.md)).

Ordinarily, transitions are added to a Ractive instance as an [initialisation option](initialisation-options.md), but it is possible to swap them out after initialisation (for example, if your app determines that the user's browser can't handle a particular transition, or due to a configuration change).


