# Animation

Animation can play an important role in communicating changing states of your webapp. In this tutorial we'll learn about using `ractive.animate()`.

## Step 1

Here, we've got a bar chart showing average temperatures throughout the year. We want there to be a smooth transition when the user changes the city using the dropdown menu.

Find the code that changes the data in the bar chart when the user makes a selection from the dropdown. Change `this.set` to `this.animate`...

...and that's it! We now have a smooth transition between cities – not just the bar height, but the labels and colours as well.

> Ractive.js is efficient about how it handles animations. Even though there are a total of 72 properties being animated each time (height, colour and label text for two bars for each of twelve months), there is a single animation loop which uses `requestAnimationFrame` where possible, and which runs as long as there are one or more sets of animations in progress.
> 
> If a second animation on a keypath were to start before the first had completed, the first would be cancelled.

## Step 2

That's good, but it looks a bit... robotic. That's because the animation is following a linear path. We can make the whole thing look much slicker with an _easing function_. Find the existing animation code and update it:

```js
this.animate( 'selectedCity', cities[ index ], {
  easing: 'easeOut'
});
```

Execute this code, then try changing the city via the drop-down.

> Ractive.js has four easing functions built in – `linear` (the default), `easeIn`, `easeOut` and `easeInOut`. I personally find `easeOut` and `easeInOut` meet 95% of my needs.
> 
> However you can add more easing functions to `Ractive.easing`, and they will become globally available. Here's an elastic easing function, for example:
> 
    Ractive.easing.elastic = function( pos ) {
      return -1 * Math.pow(4,-8*pos) * Math.sin((pos*6-1)*(2*Math.PI)/2) + 1;
    };
>
> This was taken from [danro's easing.js](https://github.com/danro/easing-js/blob/master/easing.js), which contains just about every easing function you could imagine. Or you could create your own – all it is is a function that takes an x value between 0 (animation start) and 1 (animation end) and returns a y value (usually between 0 and 1, but sometimes just outside as in the `elastic` example).
>
> As an alternative to making easing functions globally available, you can pass a function in as the `easing` parameter rather than a string.

## Step 3

Alongside `easing`, there are several other options you can pass in when creating an animation:

```js
this.animate( 'selectedCity', cities[ index ], {
  easing: 'easeOut',
  duration: 300, // in milliseconds - default 400
  step: function ( t, value ) {
    // function that will be called immediately after
    // each step of the animation loop.
    //
    // `t` is a value between 0 (start) and 1 (end),
    // as determined by the easing function.
    //
    // `value` is the intermediate value
  }
}).then( function () {
  // .animate() returns a promise that fulfils
  // when the animation completes
});
```

Try using `ractive.animate()` to cycle the bar chart through a loop – each city's data is displayed for a couple of seconds before transitioning to the next one. To make it simple, the `<select>` has been removed. If you get stuck, use the 'Fix Code' button to see one possible solution.

> You can animate between numerical properties, and arrays or objects that contain numerical properties (nested however deep – though be aware that Ractive.js doesn't check for cyclical data structures which will cause infinite loops!).
> 
> Strings, such as the city's `name` in this example, are ignored, or rather set immediately on the first animation tick. (Future versions may include clever string interpolators à la [D3](http://d3js.org/).)
