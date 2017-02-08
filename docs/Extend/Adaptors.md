# Adaptors

In some cases you want to write your UI in Ractive but have a custom back-end manage the data. [Adaptors](../Extend/Adaptors.md) allow you to teach Ractive how to talk to those custom data sources without having to change the way you write Ractive or having to write a lot of connector code up front.

## Writing

```js
Ractive.adaptors.myAdaptor = {
  filter: function ( object, keypath, ractive ) {
    // return `true` if a particular object is of the type we want to adapt.
  },
  wrap: function ( ractive, object, keypath, prefixer ) {
    // Setup
    return {
      teardown: function(){
        // Code executed on teardown.
      },
      get: function(){
        // Returns POJO version of your data backend.
      },
      set: function(property, value){
        // Data setter for POJO property keypaths.
      },
      reset: function(value){
        // Data setter for POJO keypath.
      }
    }
  }
};
```

Adaptors are simply the translation and sync layers between your custom data source and Ractive instances. The basic principle of an [adaptor](../Extend/Adaptors.md) is as follows:

1. Provides an POJO version of your data source to Ractive.
2. Captures data changes on your data source and mirror them to the data in Ractive.
3. Captures data changes on the data in Ractive and mirror them to the data source.

Whether it's a third-party data modelling library, a RESTful service, a socket server, browser storage, or whatever, as long as all of the three can be done, it can be adapted.

`filter` is a function that gets called to check if `object` needs to use an adaptor.

`object` is the data source to adapt.

`keypath` is the [keypath](../Concepts/Templates/Keypaths.md) to `object`.

`ractive` is the ractive instance that is currently using the adaptor.

`wrap` is a function that gets called to set up the [adaptor](../Extend/Adaptors.md) on `object`.

`prefixer` is a helper function that accepts an object and automatically prefixes `keypath` to the object's keys.

`get` is a function that gets called when Ractive needs the adapted representation of the `object`.

`set` is a function that is called when `ractive.set()` updates a [keypath](../Concepts/Templates/Keypaths.md) to a property of the adapted data. This function allows you to update the same property on `object`.

`property` is the [keypath](../Concepts/Templates/Keypaths.md) to the property being updated, relative to `keypath`.

`value` is the value being passed into `ractive.set()`.

`reset` is a function that is called when `ractive.set()` updates a [keypath](../Concepts/Templates/Keypaths.md) to the adapted data. This function allows you to either update `object` or tear down the adaptor.

`teardown` is a function called when the [adaptor](../Extend/Adaptors.md) is being removed. This function allows you to do cleanup work on anything that was done during the [adaptor](../Extend/Adaptors.md) setup.

### [Adaptors](../Extend/Adaptors.md) only adapt one level

An [adaptor](../Extend/Adaptors.md) only adapts an object's immediate properties. Updating nested data via Ractive or via the data source will not update the other.

### No built-in infinite loop detection

There is no built-in mechanism for avoiding infinite loops. If your [adaptor](../Extend/Adaptors.md) calls `ractive.set()` on adapted data, which in turn will call the adaptor's `set()` method, which may directly or indirectly trigger another `ractive.set()` on the same adapted data, a stack overflow error might occur.

This isn't a problem with primitive values since Ractive doesn't bother calling `set()` if a value hasn't changed. But with objects and arrays, there's no easy and performant way to tell if the contents have changed. So `set()` gets called *in case something changed* rather than *because something changed*.

### Different for every back-end

The [adaptor](../Extend/Adaptors.md) structure only provides you with the means to talk to and listen from a custom back-end. It does not impose any rules on how to write an [adaptor](../Extend/Adaptors.md) for a certain back-end. For instance, an [adaptor](../Extend/Adaptors.md) for a constructor-based object may be written differently from an [adaptor](../Extend/Adaptors.md) meant to interact with a socket server.

## Registering

Like other plugins, there's 3 ways you can register adaptors:

Globally, via the `Ractive.adaptors` static property.

```js
Ractive.adaptors.myAdaptor = myAdaptor;
```

Per component, via the component's `adaptors` initialization property.

```js
const MyComponent = Ractive.extend({
  adaptors: {
    myAdaptor: myAdaptor
  }
});
```

Per instance, via the instance's `adaptors` initialization property.

```js
const ractive = new Ractive({
  adaptors: {
    myAdaptor: myAdaptor
  }
});
```

## Using

In order to use an adaptor, you must tell the component or an instance to use it using the `adapt` [initialization option](../API/Initialization Options.md).

```js
const ractive = new Ractive({
  adapt: [ 'myAdaptor', myAdaptor ]
})
```

## Examples

In the following example, we have a `Box` constructor that uses accessors to get and set its `width` and `height` properties. Since an instance of `Box` will have no publicly visible properties, Ractive cannot bind to them directly.

```js
function Box(width, height){
  var _width = width;
  var _height = height;

  this.getWidth = function(){ return _width; };
  this.setWidth = function(width){ _width = width; };
  this.getHeight = function(){ return _height; };
  this.setHeight = function(height){ _height = height };
}
```

In order for Ractive to properly use a `Box` instance, we build an [adaptor](../Extend/Adaptors.md) for `Box`.

```js
Ractive.adaptors.boxAdaptor = {
  filter: function ( object ) {
    // Checks if the piece of data is an instance of Box.
    return object instanceof Box;
  },
  wrap: function ( ractive, box, keypath, prefixer ) {

    // We keep a reference to the original functions before monkey-patching.
    const setWidth = box.setWidth;
    const setHeight = box.setHeight;

    // Use ractive.set on the the adapted data whenever the setters are used.
    box.setWidth = function(width){
      ractive.set(prefixer({
        width: width
      }));
    };

    box.setHeight = function(height){
      ractive.set(prefixer({
        height: height
      }));
    };

    return {
      // Return a POJO representation of an instance of Box.
      get: function(){
        return {
          width: box.getWidth(),
          height: box.getHeight();
        };
      },
      // Update the adapted object's properties
      set: function(property, value){
        if(property === 'width') setWidth.call(box, value);
        if(property === 'height') setHeight.call(box, value);
      },
      // Update the adapted object.
      reset: function(data){
        // We don't adapt non-objects. And if the new data is an instance of Box
        // there's a high chance that its a new instance. In either case, we
        // need to tear down this adapter and have Ractive set it up again if
        // necessary.
        if(typeof data !== 'object' || data instanceof Box) return false;

        // Otherwise, we just parse through the data and update the existing box
        // instance.
        if(data.width !== undefined) setWidth.call(box, data.width);
        if(data.height !== undefined) setHeight.call(box, data.height);
      },
      // Delete the monkey-patched methods.
      teardown: function(){
        delete box.setWidth;
        delete box.setHeight;
      }
    };
  }
};
```

Then we use `boxAdaptor` on an instance. The data can now be treated like regular Ractive data. Updates done directly on `box` will reflect on Ractive. Any changes via Ractive will reflect on `box`.

```js
const ractive = new Ractive({
  el: 'body',
  // Tell the instance we'll be using boxAdaptor
  adapt: [ 'boxAdaptor' ],
  // We write Ractive like normal.
  template: `
    <div>Box is {{ box.width }}x{{ box.height }}</div>,
    <div><input type="text" value="{{ box.width }}"></div>
    <div><input type="text" value="{{ box.height }}"></div>
  `
});

const box = new Box(3, 4);

// Set the Box instance as if it were a POJO.
ractive.set('box', box);

// Both box instance and box object will have 7 width and 11 height and will
// be rendered in the UI accordingly.
box.setWidth(7);
ractive.set('box.height', 11);
```
