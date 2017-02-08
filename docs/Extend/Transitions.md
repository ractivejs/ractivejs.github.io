# Transitions

Transitions allow you to control how enter the DOM and how they leave the DOM. This allows you to define intro and outro behavior, particularly animations, when elements go in and out of the page.

## Writing

```js
Ractive.transitions.myTransition = function ( t, params ) {
  // Manipulate the DOM.
  // Call t.complete() when completed.
};
```

Transitions are simply functions that get called to animate a specified element.

`t` is a helper object that aids in the implementation of the transition. See the Transition Object for details.

`params` is the parameters passed in via the transition directive.

Transitions are expected to be asynchronous. In order to signal Ractive that a transition has completed, the transition must call the `t.complete()`.

Note that transitions control the element's arrival and departure to the page. That means upon completion, any styling done to the element will be removed automatically.

## Registering

Like other plugins, there's 3 ways you can register transitions:

Globally, via the `Ractive.transitions` static property.

```js
Ractive.transitions.myTransition = myTransition;
```

Per component, via the component's `transitions` initialization property.

```js
const MyComponent = Ractive.extend({
  transitions: {
    myTransition: myTransition
  }
});
```

Per instance, via the instance's `transitions` initialization property.

```js
const ractive = new Ractive({
  decorators: {
    myTransition: myTransition
  }
});
```

## Using

Transitions are added to an element via a transition directive. The directive starts with the transition name followed by one or more suffixes. The transition may be intro-only (upon rendering) using the suffix `-in`, outro-only (upon removal) using the suffix `-out`, or both using the suffix `-in-out`.

```html
<div myTransition-in>Intro-only</div>
<div myTransition-out>Outro-only</div>
<div myTransition-in-out>Intro and outro</div>
```

To pass arguments to the transition, simply provide an expression as the directive's value. This will be passed as the second argument of the transition function.

```html
<div myTransition-in="{ /*params */ }">Intro-only</div>
<div myTransition-out="{ /*params */ }">Outro-only</div>
<div myTransition-in-out="{ /*params */ }">Intro and outro</div>
```

## Examples

The following example demonstrates a "flash" transition which colors the element green upon attachment, and red prior to removal.

```js
Ractive.transitions.flash = function(t, params) {
  // Process params and declaring defaults.
  const options = t.processParams(params, {
    color: t.isIntro ? '#0f0' : '#f00',
    duration: 400
  });

  // The "transition"
  t.setStyle('color', options.color);

  // Signal Ractive that the transition is complete.
  setTimeout(t.complete, options.duration);
};

new Ractive({
  el: 'body',
  template: `
    <button on-click='@this.insert()'>Insert item</button>
    <button on-click='@this.remove()'>Remove item</button>
    <ul>
      {{#items}}
      <li flash-in-out>{{this}}</li>
      {{/items}}
    </ul>
  `,
  data: {
    items: []
  },
  insert() {
    this.push('items', Date.now());
  },
  remove() {
    this.splice('items', 0, 1);
  }
});
```
