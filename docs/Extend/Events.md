# Events

Events allow custom-named events on DOM elements. Common use cases for custom DOM events include normalizing cross-browser events, normalizing cross-device events, implementing custom events, and so much more.

## Writing

```js
Ractive.events.MyEvent = function(node, fire){
  // Setup code
  return {
    teardown: function(){
      // Cleanup code
    }
  };
}
```

Events are simply functions that are called to set up the event on a DOM element. The event function accepts two arguments: `node` and `fire`, and returns an object containing a `teardown` property.

`node` is the element to which the event is being applied.

`fire` is the function that must be called when the event has taken place. `fire` takes a single argument, the event object received by handlers. The minimum requirement for the event object is a `node` property that references DOM node the event is attached to, and an `original` property which references the native DOM `event` object supplied by the native handler, if available.

The event object will be augmented with `context`, `keypath` and `index` properties, whose values depend on the data context the node is in. `context` references the data context that surrounds the node, `keypath` is a string that leads to the current data context and `index` is a number that references the index number of the data, should the data context be in an array.

`teardown` is a function that gets called once the element is torn down. This allows the event to clean up after itself.

## Registering

Like other plugins, there's 3 ways you can register events:

Globally, via the `Ractive.events` static property.

```js
Ractive.events.myevent = MyEvent;
```

Per component, via the component's `events` initialization property.

```js
const MyComponent = Ractive.extend({
  events: {
    myevent: MyEvent
  }
});
```

Per instance, via the instance's `events` initialization property.

```js
const ractive = new Ractive({
  events: {
    myevent: MyEvent
  }
});
```

## Using

Events use the same `on-*` attribute syntax as component and DOM events. When Ractive encounters an `on-*` attribute on a DOM element, it looks for a registered event and applies it on the element. If no matching event name was found, Ractive will think the event name is a native DOM event and will attach one accordingly.

```html
// This will apply the "myevent" custom event if one is registered.
// Otherwise, Ractive will think it's a DOM event. You have been warned!
<span on-myevent="foo()">Click me!</span>
```

## Examples

Here's an example of a "long press" event which fires when the mouse is clicked and held for 1 second.

```js
// Definition
Ractive.events.longpress = function(node, fire){
  let timer = null;

  function clearTimer(){
    if(timer) clearTimeout(timer);
    timer = null;
  }

  function mouseDownHandler(event){
    clearTimer();

    timer = setTimeout(function(){
      fire({
        node: node,
        original: event
      });
    }, 1000);
  }

  function mouseUpHandler(){
    clearTimer();
  }

  node.addEventListener('mousedown', mouseDownHandler);
  node.addEventListener('mouseup', mouseUpHandler);

  return {
    teardown: function(){
      node.removeEventListener('mousedown', mouseDownHandler);
      node.removeEventListener('mouseup', mouseUpHandler);
    }
  };
};

// Usage:
new Ractive({
  el: 'body',
  template: `
    <button type="button" on-longpress="@this.greetz()">Click Me!</button>
  `,
  greetz: function(){
    console.log('Hello World!');
  }
});
```
