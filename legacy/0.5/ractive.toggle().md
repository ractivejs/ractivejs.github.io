# ractive.toggle()

Toggles the selected [keypath](keypaths.md). In other words, if `foo` is [truthy](http://james.padolsey.com/javascript/truthy-falsey/), then `ractive.toggle('foo')` will make it `false`, and vice-versa.


> ### ractive.toggle( keypath )
> Returns a `Promise` (see [Promises](Promises.md))

> > #### **keypath** *`String`*
> > The [keypath](keypaths.md) to toggle the value of
