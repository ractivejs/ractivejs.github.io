# Analog Clock

```
Embed demo here
```

This example demonstrates the use of expressions to simplify the process of turning raw data (such as the current time) into a renderable view that uses that data in many different ways.

Normally, you'd probably have a `render` function which got all the information we need to update (the day, date, month, hour, minute, second) and calculated any derived values (the rotation of the clock hands, the suffix to append to the date), then updated the view one element at a time.

If you wanted to minimise interactions with the DOM (which are bad for performance) then you'd have to store all these values so you could compare them between renders.

Or perhaps you'd have a bunch of different views – one for the 'Today is...' sentence, one for the digital clock, one for the analogue clock (or possibly one for each of the analogue clock's hands) – each with their own unique render method. You'd still have to store a load of different references, but at least your code would look neater.

With Ractive.js, you only need to store a single reference to the ractive object, and the render function looks like this:

```js
ractive.set( 'date', new Date() );
```

And that's it – all the state management and dependency tracking is done for you.

## main.js

```js
// create our clock...
var ractive = new BaseView({
  el: demo,
  data: {
    datetime: new Date()
  }
});

// ...then update it once a second
setInterval( function () {
  ractive.set( 'datetime', new Date() );
}, 1000 );
```

## BaseView.html

```html
<link rel='ractive' href='Clock.html'>

<div class='clock-container'>
  <Clock datetime='{{datetime}}'/>
</div>

<p>
  Today is {{moment(datetime).format('dddd MMMM Do YYYY')}}.
  The time is <strong>{{moment(datetime).format('h:mm:ss a')}}</strong>
</p>

<style>
  .clock-container {
    width: 10em;
    float: left;
  }

  p {
    float: left;
  }
</style>

<script>
  component.exports = {
    data: {
      moment: require( 'moment' )
    }
  }
</script>
```

## Clock.html

```html
<div class='clock'> <!-- so the SVG keeps its aspect ratio -->
  <svg viewBox='0 0 100 100'>

    <!-- first create a group and move it to 50,50 so
         all co-ords are relative to the center -->
    <g transform='translate(50,50)'>
      <circle class='clock-face' r='48'/>

      <!-- markers every minute (major markers every 5 minutes) -->
      {{#each minor:i}}
        <line class='minor' y1='42' y2='45' transform='rotate( {{
          360 * i / minor.length
        }} )'/>
      {{/each}}

      {{#each major:i}}
        <line class='major' y1='35' y2='45' transform='rotate( {{
          360 * i / major.length
        }} )'/>
      {{/each}}

      <!-- hour hand -->
      <line class='hour' y1='2' y2='-20' transform='rotate( {{
        30 * datetime.getHours() +
        datetime.getMinutes() / 2
      }} )'/>

      <!-- minute hand -->
      <line class='minute' y1='4' y2='-30' transform='rotate( {{
        6 * datetime.getMinutes() +
        datetime.getSeconds() / 10
      }} )'/>

      <!-- second hand -->
      <g transform='rotate( {{
        6 * datetime.getSeconds()
      }} )'>
        <line class='second' y1='10' y2='-38'/>
        <line class='second-counterweight' y1='10' y2='2'/>
      </g>

    </g>

  </svg>
</div>

<style>
  .clock {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .clock-face {
    stroke: #333;
    fill: white;
  }

  .minor {
    stroke: #999;
    stroke-width: 0.5;
  }

  .major {
    stroke: #333;
    stroke-width: 1;
  }

  .hour {
    stroke: #333;
  }

  .minute {
    stroke: #666;
  }

  .second, .second-counterweight {
    stroke: rgb(180,0,0);
  }

  .second-counterweight {
    stroke-width: 3;
  }
</style>

<script>
  component.exports = {
    data: function () {
      return {
        // clock face markers - major (every 5 minutes) and minor (every minute)
        major: new Array( 12 ),
        minor: new Array( 60 )
      };
    }
  };
</script>
```
