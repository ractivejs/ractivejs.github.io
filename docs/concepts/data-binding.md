# Computed Properties

The idea is fairly simple: you can define computed properties that update reactively based on their dependencies. In previous versions you may have done something as follows.
```js
ractive = new Ractive({
  el: 'body',
  template: '{{width}} * {{height}} = {{ area() }}', // note the function invocation
  data: {
    width: 100,
    height: 100,
    area: function () { return this.get( 'width' ) * this.get( 'height' ); }
  }
});
```

That's nice and all - the `{{ area() }}` mustache updates reactively as `width` and `height` change - but it's limited. To get the area value programmatically you'd have to do something like...

```js
area = ractive.get('area').call(ractive);
```

...which effectively prevents you from composing computed values together in any meaningful way. And you can't 'observe' the area outside of the template, without doing something like this:

```js
ractive.observe( 'width height', function () {
	var area = this.get( 'width' ) * this.get( 'height' );
	doSomething( area );
});
```

## Computed properties to the rescue

Now, you can do

```js
ractive = new Ractive({
  el: 'body',
  template: '{{width}} * {{height}} = {{area}}', // `area` looks like a regular property
  data: {
    width: 100,
    height: 100
  },
  computed: {
    area: function () { return this.get( 'width' ) * this.get( 'height' ); }
  }
});
```

With this, the `area` property can be treated like any other. It will update reactively (because the calls to `ractive.get()` tell Ractive that it should be recomputed when `width` or `height` change), so you can do...

```js
ractive.observe( 'area', doSomething );
```

...instead of manually recalculating it. And computed values can depend on other computed values, and so on (before anyone asks, we're not doing a topological sort or anything fancy like that - in real world scenarios I'd expect the overhead of doing the sort to be greater than the cost of occasionally recomputing a node in the dependency graph more times than is required).

## Compact syntax

The syntax used above, where each computed property is defined as a function, gives you a lot of flexibility. But there's a more compact string syntax you can use:

```js
ractive = new Ractive({
  ...,
  computed: {
    area: '${width} * ${height}'
  }
});
```

This string is turned into a function with the `Function` constructor (which unfortunately means it isn't [CSP compliant](https://developer.mozilla.org/en-US/docs/Security/CSP)) - any `${...}` blocks are basically turned into `ractive.get('...')`, so it works exactly the same way. Needless to say you can use any JavaScript here - `${foo}.toUpperCase()`, `Math.round(${num})`, and so on.

## Setting computed values

By default, computed values are read-only, and if you try to `ractive.set('someComputedProperty')` an error will be thrown. But you can use a third syntax option which allows you to declare a `set()` method:

```js
ractive = new Ractive({
  data: { firstname: 'Douglas', lastname: 'Crockford' },
  computed: {
    fullname: {
      get: '${firstname} + " " + ${lastname}', // or use the function syntax
      set: function ( fullname ) {
        var names = fullname.split( ' ' );

        this.set({
          firstname: names[0] || '',
          lastname: names[1] || ''
        });
      }
    }
  }
});

ractive.set( 'fullname', 'Rich Harris' );

ractive.get( 'firstname' ); // Rich
ractive.get( 'lastname' ); // Harris
```

## Components

You can, of course, declare computed values on components:

```js
Box = Ractive.extend({
  template: boxTemplate,
  computed: { area: '${width} * ${height}' }
});

box = new Box({
  ...,
  data: { width: 20, height: 40 }
});

box.get( 'area' ); // 800
```

Additional computed properties can be declared on the instance:

```js
box2 = new Box({
  ...,
  data: { width: 20, height: 40, depth: 60 },
  computed: { volume: '${area} * ${depth}' }
});

box2.get( 'area' ); // 800
box2.get( 'volume' ); // 48000
```

## Data context for computed properties

Computed properties can only be calculated for the instance context as a whole. You can't, for example, directly
compute a value for each member of an array:

```js
new Ractive({
  template: '{{#boxes}}{{area}}{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ]
  },
  // there's no way to specify this for "each" box :(
  computed: { area: '${width} * ${height}' }
});
```

The solution is to either use a function that calculates the value for each member:

```js
  template: '{{#boxes:b}}{{ getArea(b) }}{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ],
    getArea: function ( i ) {
      var box = this.get( 'boxes.' + i );
      return box.width * box.area;
    }
  }
```

Or leverage a component to "scope" the data to each item:

```js
Box = Ractive.extend({
  template: boxTemplate,
  computed: { area: '${width} * ${height}' }
});

new Ractive({
  template: '{{#boxes}}<box/>{{/}}',
  data: {
    boxes: [
      { width: 20, height: 40 },
      { width: 30, height: 45 },
      { width: 20, height: 20 }
    ]
  },
  components: { box: Box }
});
```

# Dependents


Ractive maintains a *dependency graph* in order to do the minimum amount of work necessary to keep the DOM up-to-date.

If you inspect a Ractive instance in your console, you'll see a property called `_deps`. This is where all dependants are listed, indexed by their dependency.

There is also a concept of 'priority', which exists to save us some work. If, for example, a section needs to be removed (perhaps it's a conditional section, and the condition just went from truthy to falsy), there is no point in updating all its children, so we make sure that we teardown the section first. As part of that teardown process, the children - which all have lower priority - unregister themselves as dependants before they get a chance to update.

## Indirect dependencies

If you have a mustache which depends on `foo.bar`, and `foo` changes, it's quite possible that the mustache needs to re-render. We say that the mustache has an *indirect dependency* on `foo`, or that it has a *direct dependency on a downstream keypath* of `foo`.

This relationship is expressed through the `_depsMap` property of a Ractive instance - whenever `foo` changes, as well as dealing with direct `foo` dependants we check the map for those indirect dependants.

In the case of [expressions](./templates.md#expressions) and [observers](./data-binding.md#observers), we also need to consider dependants of *upstream keypaths*. For example, suppose we have a section based on a sorted array - if we modify one of the members of the array, we need to see if the sort order has changed or not as a result:

```html
{{#( sort( list, 'name' ) )}}
  <p>{{name}}</p>
{{/()}}
```

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    list: [{ name: 'Bob' }, { name: 'Charles' }, { name: 'Alice' }],
    sort: function ( list, property ) {
      return list.slice().sort( function ( a, b ) {
        return a[ property ] < b[ property ] ? -1 : 1;
      });
    }
  }
});

// renders Alice, Bob, Charles

ractive.set( 'list[0].name', 'Zebediah' );

// updates to Alice, Charles, Zebediah
```

In the example, setting `list[0].name` causes dependants of `list` to be updated.

As well as [expressions](./templates.md#expressions), [Observers](./data-binding.md#observers) respond to both upstream and downstream changes.


## Expressions with multiple dependencies

The expression `{{ a + b }}` has two dependencies - `a` and `b` (or more accurately, whatever those [references](./templates.md#references) resolve to). The `_deps` graph actually includes objects representing those individual references, rather than the expression itself - the reference objects then notify the expression (if their value has changed) that it will need to re-evaluate itself.

Because the expression has multiple dependencies, it won't trigger an update straight away - it will wait until all the new data has come in first. So doing `ractive.set({ a: 1, b: 2 })` will only trigger one update, not two.


---

# Observers

## Like publish/subscribe, but different

A common pattern in modern JavaScript is to make models *observable*, using the traditional [publish/subscribe](http://addyosmani.com/blog/understanding-the-publishsubscribe-pattern-for-greater-javascript-scalability/) mechanism.

For example, you can observe changes to attributes within a Backbone Model like so:

```js
model = Backbone.Model({ myValue: 1 });

model.on( 'change:myValue', function ( model, value, options ) {
  alert( 'myValue changed to ' + value );
});

model.set( 'myValue', 2 ); // alerts 'myValue changed to 2'
```

This works because `Backbone.Model.prototype` inherits from `Backbone.Events`.

Ractive implements pub/sub with [`ractive.on()`](../api/instance-methods.md#ractiveon), [`ractive.off()`](../api/instance-methods.md#ractiveoff) and [`ractive.fire()`](../api/instance-methods.md#ractivefire), [`ractive.off()`](../api/instance-methods.md#ractiveoff) and [`ractive.fire`](../api/instance-methods.md#ractivefire) - see [Events]() for more info.


## Observing models with nested properties

But the normal pub/sub mechanism won't work for monitoring data changes with Ractive, because our data can contain nested properties. It's no good subscribing to a `change:foo.bar` event, if `foo.bar` can change as a result of `foo` changing.

So instead, we introduce the concept of *observers*.

An observer observes a particular [keypath](), and is *notified* when the value of its keypath changes, whether directly or indirectly (because an *upstream* or *downstream* keypath changed). You create one with `ractive.observe()` (see [`ractive.observe()`](../api/instance-properties.md#ractiveobserve) for full method
API).

Here's an example:

```js
ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    foo: { bar: 1 }
  }
});

// The observer will be initialised with ( currentValue, undefined ) unless
// we pass a third `options` argument in which `init` is `false`. In other
// words this will alert 'foo.bar changed to 1'
observer = ractive.observe( 'foo.bar', function ( newValue, oldValue, keypath ) {
  alert( keypath + ' changed to ' + newValue );
});

ractive.set( 'foo.bar', 2 ); // alerts 'foo.bar changed to 2'
ractive.get( 'foo' ); // returns { bar: 2 }

ractive.set( 'foo', { bar: 3 }); // alerts 'foo.bar changed to 3'
ractive.get( 'foo.bar' ); // returns 3

observer.cancel();

ractive.set( 'foo.bar', 4 ); // alerts nothing; the observer was cancelled
```

Observers are most useful in the context of [two‐way binding]().

## Pattern Observers

It is useful to observe on specific keypaths but in the event your data contains array, or a set of dynamic data it isn't logical to bind to every potential keypath that could exist. Pattern observers use a `*` to indicate to Ractive that you would like to be notified whenever anything changes in your data at a particular depth as well as below the specified depth.

There are a few caveats when it comes to observing on array data, when observing on keypath `people.*` you are observing on the length of the array. This means that the `newValue` will be the index at which the new object was pushed. However when you use `set` to change an item at a particular index or a key that is on an object in the array then it will provide the object as the `newValue`.

```js
var ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    people: [
      {name: 'Rich Harris'},
      {name: 'Marty Nelson'}
    ]
  }
});

ractive.observe('people.*', function(newValue, oldValue, keypath) {

});

var people = ractive.get('people');
people.push({name: 'Jason Brown'});
//newValue will equal 3, and the keypath will be people.length

ractive.set('people.3', {name: 'Jack Black'});
//newValue will be {name: 'Jack Black'} and the keypath will be people.3

ractive.set('people.3.isACelebrity', true);
//newValue will be {name: 'Jack Black', isACelebrity: true} and the keypath will be people.3

ractive.set('people.0.info.isCreator', true);
//newValue will be the object for index 0 and the keypath will be people.0

```

Notice that because you are observing at the array level that `newValue` will be set as the entire object. What if you were only interested in knowing when a user became a celebrity? Simply tell Ractive you only want to observe dynamically on the array but only be notified when the `isACelebrity` key changes, `people.*.isACelebrity`.

```js
ractive.observe('people.*.isACelebrity', function(newValue, oldValue, keypath) {

});

ractive.set('people.0.isACelebrity', true); //Rich Harris is a celebrity
//newValue will be `true` and the keypath will be people.0.isACelebrity

```

You are not limited to just one `*` for your pattern, you can use as many as you would like and in any particular order.

```js

ractive.observe('people.*.comments.*', function(newValue, oldValue, keypath) {

});

//even arrays of arrays

ractive.observe('people.*.*', function(newValue, oldValue, keypath) {

});

```

Furthermore it works on objects as well `config.*` will notify you when a value is changed on any key on the config object. However this differs from observing on an array in that it will provide the value set and keypath to the key that was set.

```js
var ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    config: {
      allowComments: true,
      allowEdit: false
    }
  }
});

ractive.observe('config.*', function(newValue, oldValue, keypath) {

});

ractive.set('config.allowEdit', true);
//newValue will be true and the keypath will be config.allowEdit

```

In addition to `newValue`, `oldValue`, and `keypath`, any widlcards that are matched in the `keypath` will be passed to the callback. Each additional wildcard will cause an extra parameter to be passed to the callback. For instance:
```js
ractive.observe('items.*.*', function(newValue, oldValue, keypath, idx, key) {
  console.log('item', idx, key, 'is now', newValue);
});
ractive.set('items.1.foo', 'bar');
// logs 'item 1 foo is now bar'
```

Pattern observers are a simple and flexible that will allow you to observe your data any way that you want.

## Space Delimited Observers

Space delimited observers are useful when different keypaths should trigger the same function. In previous version you would have had to bind each keypath individually to the function.

This is a contrived example but for examples sake bare with us.

```js
var ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: {
    user: {username: 'browniefed'},
    config: {isAdmin: false},
    commentCount: 0
  }
});

function updateServer() {
  //Make call to server because something in user, config, comments changed
}

ractive.observe('user.username', updateServer);
ractive.observe('config.isAdmin', updateServer);
ractive.observe('commentCount', updateServer);

```

This is unecessarily verbose, now with space delimited observers this becomes a single line.

```js
ractive.observe('user.username config.isAdmin commentCount', updateServer);

```

This will work with patterns observers as well.

```js
ractive.observe('user.* config.* commentCount', updateServer);

```


## A 'gotcha' to be aware of

Observers will be notified whenever the new value is not equal to the old value - *sort of*.

What does 'not equal' mean? Well, with *primitive values* such as strings and numbers, that's easy - they're either identical (in the `===` sense) or they're not.

With objects and arrays (hereafter, just 'objects', since that's what arrays technically are), it's not so straightforward:

```js
a = { one: 1, two: 2, three: 3 };
b = { one: 1, two: 2, three: 3 };

alert( a === b ); // alerts 'false' - they look the same, but they ain't

b = a;
b.four = 4;

alert( a === b ); // alerts 'true'. Hang on, `a` didn't have a 'four' property?
alert( a.four ); // alerts '4'. Oh. Right.
```

So one the one hand, objects which look identical aren't. On the other, you can set a property of an object and have no idea whether doing so resulted in a change.

There are two possible responses to this problem. First, we could do a 'deep clone' of an object whenever we do `ractive.set(keypath, object)`, using an algorithm similar to [jQuery extend](http://api.jquery.com/jQuery.extend/#jQuery-extend-deep-target-object1-objectN). That would mean any references you held to `object` would become irrelevant. It would also mean a whole load of extra computation, and probably some very strange behaviour with cyclical data structures. No thanks.

The second is to sidestep the issue, and simply state that for the purposes of determining whether to notify observers, **no two objects are equal, even when they're identical** (unless they're both `null`, of course - since `typeof null === 'object'` due to a [bug in the language](http://www.2ality.com/2013/10/typeof-null.html)).

This is the safest, sanest behaviour, but it can lead to unexpected behaviour in one situation - accessing properties within an observer:

```js
obj = { a: { b: { c: 1 } } };

ractive = new Ractive({
  el: myContainer,
  template: myTemplate,
  data: { obj: obj }
});

// We observe 'obj.a.b.c' indirectly, and directly
ractive.observe({
  'obj': function ( newObj, oldObj ) {
    alert( 'Indirect observer: changed from ' + oldObj.a.b.c + ' to ' + newObj.a.b.c );
  },
  'obj.a.b.c': function ( newC, oldC ) {
    alert( 'Direct observer: changed from ' + oldC + ' to ' + newC );
  }
});

obj.a.b.c = 2;

// The next line will cause two alerts:
//   'Direct observer: changed from 1 to 2'
//   'Indirect observer: changed from 2 to 2' - because oldObj === newObj
ractive.set( 'obj', obj );
```

This is definitely an edge case, but one that it's worth being aware of.

# Parallel DOM

Ractive works by maintaining a simplified model of the part of the DOM that it's responsible for. This model contains all the information - about data-binding, event handling and so on - that it needs to keep things up-to-date.

You can inspect the parallel DOM to understand what's going on under the hood, if you're into that sort of thing. Each Ractive instance, once rendered, has a `fragment` property. Each fragment has a number of properties:

* `contextStack` - the context stack in which mustache [references]() should be evaluated
* `root` - a reference to the Ractive instance to which it belongs
* `owner` - the *item* that owns this fragment (in the case of the root fragment, the same as `root`)
* `items` - the items belonging to this fragment

*Items* means elements, text nodes, and mustaches. Elements may have fragments of their own (i.e. if they have children). A partial mustache will have a fragment, and a section mustache will have zero or more fragments depending on the value of its keypath.

Elements may also have attributes, which have a different kind of fragment (a *text fragment* as opposed to a *DOM fragment*), containing text and mustaches.

Each item has a `descriptor`, which is something like DNA. This comes straight from the [parsed template]().

This is the briefest of overviews - if you want to gain a deeper understanding of what's going on under the hood, [use the source](https://github.com/RactiveJS/Ractive/tree/master/src).


---

# Two-way binding


If that's unhelpful for your app, you can disable it by passing `twoway: false` as an [initialisation option]().

Two-way vinding can also be overridden on a per-element basis using the `twoway` directive e.g. `<input value="{{foo}}" twoway="false">`. If the `twoway` option is set to false, it can be overridden on a per-element bases using `twoway` as a boolean attribute e.g. `<input value="{{foo}}" twoway>` or `<input value="{{foo}}" twoway="true">`.







## Ambiguous references

A mustache used in a two-way binding context must have an *unambiguous reference*. Consider the following:

```html
{{#foo}}
	<input value='{{bar}}'>
{{/foo}}
```

```js
ractive = new Ractive({
	el: myContainer,
	template: myTemplate,
	data: { foo: {} }
});
```

Ractive must decide, straight away, what [keypath]() to bind the input's `value` attribute to. It will first see if it can [reference]() (`'bar'`) given the current context stack (which includes a single context - `'foo'`). It can't, so it is forced to make an assumption - that the `'bar'` reference should resolve to the `'bar'` keypath.

But this might not be what you want - maybe you *did* want it to resolve to `'foo.bar'`.

You have two options - either use a [restricted reference](), i.e. `<input value='{{.bar}}'>`, or ensure that `foo` has a `bar` property (even if the initial value is `undefined`).

## Lazy updates

Under the hood, Ractive always binds to the `change` event (and the `click` event in IE, in the case of checkboxes, due to an IE bug). By default, it will also bind to the `input` event, which means the model is updated instantly when the user enters data (the `change` event fires when a change is ['committed by the user'](https://developer.mozilla.org/en-US/docs/Web/Reference/events/change)). In some situations, that's not what you want - if you want to only bind to `change`, pass in `lazy: true` as an [initialisation option]().

As with `twoway`, laziness may be specified on a per-element basis. Besides `true` (or simply having the attribute preset) and `false` values, the `lazy` directive may also be a number that specifies the number of milliseconds to wait after the last `input` event fires with subsequent `input` events resetting the timeout. For instance `<input value="{{foo}}" lazy>` will trigger updates to `foo` on `change` and `<input value="{{foo}}" lazy="1000">` will trigger updates 1 second after the last keypress.

## Observing changes

To use user input elsewhere in your app, you'll need to observe it using [`ractive.observe()`](../api/instance-properties.md#ractiveobserve):

```html
<input placeholder='Type your name' value='{{user.name}}'>
```

```js
ractive = new Ractive({
	el: myContainer,
	template: myTemplate
});

ractive.observe( 'user.name', function ( newValue ) {
	app.user.name = newValue;
	triggerSomeBehaviour();
});
```
