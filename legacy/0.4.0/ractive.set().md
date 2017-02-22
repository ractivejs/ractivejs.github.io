# ractive.set()

Updates data and triggers a re-render of any mustaches that are affected (directly or indirectly) by the change. Any [observers](observers.md) of affected [keypaths](keypaths.md) will be notified.

A `set` [event](events.md) will be fired with `keypath` and `value` as arguments (or `map`, if you set multiple options at once).


> ### ractive.set( keypath, value )
> Returns a `Promise` (see [Promises](Promises.md))

> > #### **keypath** *`String`*
> > The [keypath](keypaths.md) of the data we're changing, e.g. `user` or `user.name` or `user.friends[1]`

> > #### **value**
> > The value we're changing it to. Can be a primitive or an object (or array), in which case dependants of *downstream keypaths* will also be re-rendered (if they have changed)


> ### ractive.set( map )
> Returns `ractive`

> > #### **map** *`Object`*
> > A map of `keypath: value` pairs, as above
