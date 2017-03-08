# ractive.teardown()


Unrenders this Ractive instance, removing any event handlers that were bound automatically by Ractive.

Calling `ractive.teardown()` causes a `teardown` [event](events.md) to be fired - this is most useful with [Ractive.extend()](Ractive.extend().md) as it allows you to clean up anything else (event listeners and other bindings) that are part of the subclass.


> ### ractive.teardown()
> Returns a `Promise` (see [Promises](Promises.md))
