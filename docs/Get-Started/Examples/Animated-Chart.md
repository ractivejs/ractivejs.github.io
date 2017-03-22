# Animated Chart

```
Embed demo here
```

Making interactive charts is hard. Charts have many components besides the data itself – controls, axes, labels, annotations – and they often don't need to update at the same time as each other. Normally, you're faced with a choice between having several different render functions, or wastefully re-rendering the entire chart when things change.

For this reason, dedicated charting libraries have become popular. And that's a shame, because it means you're stuck with line charts and bar charts and pie charts and scatter charts, and don't you dare have any data that's better represented using a less conventional chart type, like this plot of high and low temperatures.

Faced with a choice between freedom and ease of use, many developers turn to [D3](http://d3js.org/). D3 is a terrific library, and I won't hear a bad word said about it, but it doesn't solve the problem of efficiently updating different components of a chart because it has no concept of state.

Ractive.js takes a fundamentally different approach to other libraries. Rather than programmatically building up the different components of your chart, and writing logic to update those components, you write your SVG the same way you'd write an HTML template. When it's time to update the chart, you just throw the new state at it – the dependency tracking ensures that we only re-render what's changed. This makes it trivially easy to animate the chart when the user changes city via the drop-down menu.

Note also that we don't need to faff about with event handlers and render logic to switch between celsius and fahrenheit – when the user switches between them, Ractive.js knows what to do, because the labels' dependency on degreeType is written into the template.

## main.js

```js
var cities = [
  { name: 'London, UK', temperatures: [{ high: 7.9, low: 2.4 }, { high: 8.2, low: 2.2 }, { high: 10.9, low: 3.8 }, { high: 13.3, low: 5.2 }, { high: 17.2, low: 8 }, { high: 20.2, low: 11.1 }, { high: 22.8, low: 13.6 }, { high: 22.6, low: 13.3 }, { high: 19.3, low: 10.9 }, { high: 15.2, low: 8 }, { high: 10.9, low: 4.8 }, { high: 8.8, low: 3.3 }] },
  { name: 'San Francisco, CA, US', temperatures: [{ high: 13.8, low: 7.6 }, { high: 15.7, low: 8.6 }, { high: 16.6, low: 9.2 }, { high: 17.3, low: 9.6 }, { high: 17.9, low: 10.6 }, { high: 19.1, low: 11.6 }, { high: 19.2, low: 12.3 }, { high: 20.1, low: 12.8 }, { high: 21.2, low: 12.8 }, { high: 20.7, low: 12.1 }, { high: 17.3, low: 10.1 }, { high: 13.9, low: 7.8 } ] },
  { name: 'Phoenix, AZ, US', temperatures: [{ high: 19.7, low: 7.6 }, { high: 21.6, low: 9.3 }, { high: 25.1, low: 11.9 }, { high: 29.7, low: 15.7 }, { high: 35, low: 20.7 }, { high: 40.1, low: 25.4 }, { high: 41.2, low: 28.6 }, { high: 40.3, low: 28.2 }, { high: 37.8, low: 24.9 }, { high: 31.5, low: 18.2 }, { high: 24.3, low: 11.4 }, { high: 19, low: 7.1 } ] },
  { name: 'New York City, NY, US', temperatures: [{ high: 3.5, low: -2.8 }, { high: 5.3, low: -1.7 }, { high: 9.8, low: 1.8 }, { high: 16.2, low: 7.1 }, { high: 21.6, low: 12.2 }, { high: 26.3, low: 17.6 }, { high: 28.9, low: 20.5 }, { high: 28.1, low: 19.9 }, { high: 24, low: 16 }, { high: 17.7, low: 10 }, { high: 12.1, low: 5.3 }, { high: 6.1, low: 0 } ] },
  { name: 'Buenos Aires, Argentina', temperatures: [{ high: 30.4, low: 20.4 }, { high: 28.7, low: 19.4 }, { high: 26.4, low: 17 }, { high: 22.7, low: 13.7 }, { high: 19, low: 10.3 }, { high: 15.6, low: 7.6 }, { high: 13.9, low: 7.4 }, { high: 17.3, low: 8.9 }, { high: 18.9, low: 9.9 }, { high: 22.5, low: 13 }, { high: 25.3, low: 15.9 }, { high: 28.1, low: 18.4 } ] },
  { name: 'Sydney, Australia', temperatures: [{ high: 25.9, low: 18.7 }, { high: 25.8, low: 18.8 }, { high: 24.7, low: 17.5 }, { high: 22.4, low: 14.7 }, { high: 19.4, low: 11.5 }, { high: 16.9, low: 9.3 }, { high: 16.3, low: 8 }, { high: 17.8, low: 8.9 }, { high: 20, low: 11.1 }, { high: 22.1, low: 13.5 }, { high: 23.6, low: 15.6 }, { high: 25.2, low: 17.5 } ] },
  { name: 'Moscow, Russia', temperatures: [{ high: -4, low: -9.1 }, { high: -3.7, low: -9.8 }, { high: 2.6, low: -4.4 }, { high: 11.3, low: 2.2 }, { high: 18.6, low: 7.7 }, { high: 22, low: 12.1 }, { high: 24.3, low: 14.4 }, { high: 21.9, low: 12.5 }, { high: 15.7, low: 7.4 }, { high: 8.7, low: 2.7 }, { high: 0.9, low: -3.3 }, { high: -3, low: -7.6 } ] },
  { name: 'Berlin, Germany', temperatures: [{ high: 2.9, low: -1.5 }, { high: 4.2, low: -1.6 }, { high: 8.5, low: 1.3 }, { high: 13.2, low: 4.2 }, { high: 18.9, low: 9 }, { high: 21.8, low: 12.3 }, { high: 24, low: 14.7 }, { high: 23.6, low: 14.1 }, { high: 18.8, low: 10.6 }, { high: 13.4, low: 6.4 }, { high: 7.1, low: 2.2 }, { high: 4.4, low: -0.4 } ] },
  { name: 'Beijing, China', temperatures: [{ high: 1.8, low: -8.4 }, { high: 5, low: -5.6 }, { high: 11.6, low: 0.4 }, { high: 20.3, low: 7.9 }, { high: 26, low: 13.6 }, { high: 30.2, low: 18.8 }, { high: 30.9, low: 22 }, { high: 29.7, low: 20.8 }, { high: 25.8, low: 14.8 }, { high: 19.1, low: 7.9 }, { high: 10.1, low: 0 }, { high: 3.7, low: -5.8 } ] },
  { name: 'Nairobi, Kenya', temperatures: [{ high: 24.5, low: 11.5 }, { high: 25.6, low: 11.6 }, { high: 25.6, low: 13.1 }, { high: 24.1, low: 14 }, { high: 22.6, low: 13.2 }, { high: 21.5, low: 11 }, { high: 20.6, low: 10.1 }, { high: 21.4, low: 10.2 }, { high: 23.7, low: 10.5 }, { high: 24.7, low: 12.5 }, { high: 23.1, low: 13.1 }, { high: 23.4, low: 12.6 } ] }
]

var ractive = new BaseView({
  el: demo,
  data: {
  cities: cities,
  selectedCity: cities[0]
  }
});

ractive.observe( 'selectedCity', function ( city ) {
  ractive.animate( 'temperatures', city.temperatures, {
  duration: 400,
  easing: 'easeOut'
  });
});
```

## BaseView.html

```html
<link rel='ractive' href='TemperatureChart.html'>

<div class='temperatures'>
  <!-- header and options -->
  <div class='chart-header'>
    <h3>Average high and low temperature</h3>

    <!-- switch between celsius and fahrenheit -->
    <div class='radio-group'>
      <label>°C <input type='radio' name='{{degreeType}}' value='celsius' checked></label>
      <label>°F <input type='radio' name='{{degreeType}}' value='fahrenheit'></label>
    </div>

    <!-- dropdown menu -->
    <select value='{{selectedCity}}'>
      {{#each cities}}
        <option value='{{this}}'>{{name}}</option>
      {{/each}}
    </select>
  </div>

  <TemperatureChart temperatures='{{temperatures}}' degreeType='{{degreeType}}'/>
</div>

<style>
  .temperatures {
    position: relative;
    width: 100%;
    height: 20em;
    padding: 1em 0 0 0;
    background-color: #fafafa;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .chart-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2em;
    padding: 0.5em;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .radio-group {
    display: inline-block;
    float: right;
    text-align: right;
    padding: 0.5em 0 0 0;
  }

  .chart-header h3 {
    font-family: 'Voltaire';
    font-weight: normal;
    float: left;
    margin: 0;
    border: none;
  }

  .chart-header select {
    position: relative;
    top: 0.1em;
    float: left;
    clear: left;
    font-size: inherit;
    font-family: inherit;
    z-index: 7;
  }

  .chart-header label {
    position: relative;
    z-index: 7;
    display: block;
  }

  .chart-header p {
    float: left;
    clear: left;
    margin: 0;
  }
</style>
```

## TemperatureChart.html

```html
<div class='chart'>
  <div class='wrapper'> <!-- needed to determine size of SVG element in Firefox -->
    <svg>

      <!-- gradient - higher temperatures are redder, lower temperatures are bluer -->
      <defs>
        <linearGradient id='gradient' x2='0' y2='100%' gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stop-color='rgb(255,0,0)' />
          <stop offset='100%' stop-color='rgb(0,0,255)' />
        </linearGradient>
      </defs>

      <!-- horizontal line representing freezing -->
      <g transform='translate( 0, {{ yScale(0) }} )'>
        <line class='freezing' x2='{{width}}'/>
        <text class='freezing-label-bg' x='{{ xScale(6) }}' y='0.3em'>freezing</text>
        <text class='freezing-label' x='{{ xScale(6) }}' y='0.3em'>freezing</text>
      </g>

      <!-- the band -->
      <polygon fill='url(#gradient)' stroke='url(#gradient)' class='temperature-band' points='{{points}}'/>

      {{#each temperatures :i}}
        <!-- point markers for average highs -->
        <g class='marker' transform='translate({{ xScale(i+0.5) }},{{ yScale(high) }})'>
          <circle r='2'/>
          <text y='-10'>{{ format(high) }}</text>
        </g>

        <!-- point markers for average lows -->
        <g class='marker' transform='translate({{ xScale(i+0.5) }},{{ yScale(low) }})'>
          <circle r='2'/>
          <text y='15'>{{ format(low) }}</text>
        </g>
      {{/each}}
    </svg>
  </div>

  <div class='month-labels'>
    {{#monthNames:i}}
      <span style='width: {{ 100 / monthNames.length }}%;'>{{ monthNames[i] }}</span>
    {{/monthNames}}
  </div>
</div>

<style>
  svg {
    width: 100%;
    height: 100%;
  }

  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .chart {
    position: relative;
    padding: 0 0 3em 0;
    width: 100%;
    height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .temperature-band {
    fill-opacity: 0.3;
    stroke-width: 2;
  }

  .freezing {
    stroke: #ccc;
    stroke-width: 1;
  }

  .freezing-label-bg, .freezing-label {
    font-family: 'Helvetica Neue', 'Arial';
    font-size: 0.8em;
    text-anchor: middle;
  }

  .freezing-label-bg {
    stroke: #fafafa;
    stroke-width: 4;
  }

  .freezing-label {
    stroke: none;
    fill: #aaa;
  }

  .marker circle {
    fill: white;
    stroke: black;
    stroke-width: 1;
  }

  .marker text {
    text-anchor: middle;
    font-family: 'Helvetica Neue', 'Arial';
    font-size: 0.6em;
    font-weight: bold;
    fill: #333;
  }

  .month-labels {
    position: absolute;
    left: 0;
    bottom: 1em;
    width: 100%;
  }

  .month-labels span {
    text-align: center;
    float: left;
    display: block;
    font-family: 'Helvetica Neue', 'Arial';
    font-size: 0.6em;
  }
</style>

<script>

  // this returns a function that scales a value from a given domain
  // to a given range. Hat-tip to D3
  function linearScale ( domain, range ) {
    var d0 = domain[0], r0 = range[0], multipler = ( range[1] - r0 ) / ( domain[1] - d0 );

    return function ( num ) {
      return r0 + ( ( num - d0 ) * multipler );
    };
  }

  // this function takes an array of values, and returns an array of
  // points plotted according to the given x scale and y scale
  function plotPoints ( points, xScale, yScale ) {
    var result = points.map( function ( point, i ) {
      return xScale( i + 0.5 ) + ',' + yScale( point );
    });

    // add the december value in front of january, and the january value after
    // december, to show the cyclicality
    result.unshift( xScale( -0.5 ) + ',' + yScale( points[ points.length - 1 ] ) );
    result.push( xScale( points.length + 0.5 ) + ',' + yScale( points[0] ) );

    return result;
  }

  function getHighPoint ( month ) { return month.high; }
  function getLowPoint ( month ) { return month.low; }

  component.exports = {
    onrender: function () {
      var handleResize = this.resize.bind( this );
      window.addEventListener( 'resize', handleResize, false );

      this.on( 'unrender', function () {
        window.removeEventListener( 'resize', handleResize, false );
      });

      this.wrapper = this.find( '.wrapper' );
      this.resize();
    },

    data: function () {
      return {
        // dimensions will be set on render
        width: null,
        height: null,

        // default to °c
        degreeType: 'celsius',

        format: function ( val ) {
          if ( this.get( 'degreeType' ) === 'fahrenheit' ) {
            // convert celsius to fahrenheit
            val = ( val * 1.8 ) + 32;
          }

          return val.toFixed( 1 ) + '°';
        },

        monthNames: [ 'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D' ]
      };
    },

    // because we're using SVG, we need to manually redraw
    // when the container resizes. You *can* use percentages
    // instead of pixel/em lengths, but not in transforms
    resize: function () {
      this.set({
        width: this.wrapper.clientWidth,
        height: this.wrapper.clientHeight
      });
    },

    // when the dimensions change, recompute whatever
    // needs to be recomputed
    computed: {
      xScale: function () {
        return linearScale([ 0, 12 ], [ 0, this.get( 'width' ) ]);
      },

      yScale: function () {
        return linearScale([ -10, 42 ], [ this.get( 'height' ) - 20, 25 ]);
      },

      // this function returns the SVG string for the polygon representing the
      // temperature band
      points: function () {
        var temperatures = this.get( 'temperatures' );
        if ( !temperatures ) return '';

        var xScale = this.get( 'xScale' );
        var yScale = this.get( 'yScale' );

        var high = plotPoints( temperatures.map( getHighPoint ), xScale, yScale );
        var low = plotPoints( temperatures.map( getLowPoint ), xScale, yScale );

        return high.concat( low.reverse() ).join( ' ' );
      }
    }
  };
</script>
```
