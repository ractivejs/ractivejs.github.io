# ractive.reverse()

The Ractive equivalent to ```Array.reverse``` reverses the array at the given keypath and triggers an update event.

> ### ractive.reverse( keypath )
> Returns a `Promise` (see [Promises](Promises.md)) that will resolve after the update is complete.

> > #### **keypath** *`String`*
> > The [keypath](keypaths.md) of the array to reverse, e.g. `list` or `order.items`.

If the given keypath does not resolve to an array, an error will be thrown.
