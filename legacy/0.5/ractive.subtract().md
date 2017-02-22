# ractive.subtract()

Decrements the value of the given [keypath](keypaths.md).

> ### ractive.subtract( keypath[, number ])
> Returns a `Promise` (see [Promises](Promises.md))

> > #### **keypath** *`String`*
> > The [keypath](keypaths.md) of the number we're decrementing, e.g. `count`

> > #### number
> > Defaults to `1`. The number to decrement by

### Example

This is useful for numeric counters. Instead of using [ractive.get()](ractive-get.md)
and [ractive.set()](ractive-set.md) in succession, using *add()* and *subtract()* will
simplify your code.

```js
quantityBox = new Ractive({
  template: [
    "<button on-click='decrease'> - </button>",
    "<span>{{quantity}}</span>",
    "<button on-click='increase'> + </button>",
  ].join(""),
  
  data: {
    quantity: 20
  }
});

quantityBox.on({
  decrease: function () { this.subtract(); },
  increase: function () { this.add(); }
  }
});
```
