# Donut Chart

```
Embed demo here
```

## main.js

```js
var ractive = new BaseView({
  el: demo,
  data: getData()
});

function getData () {
  return {
    months: [
      { name: 'January',   points: { dogs: 4, cats: 3, rabbits: 7 } },
      { name: 'February',  points: { dogs: 2, cats: 7, rabbits: 3 } },
      { name: 'March',     points: { dogs: 5, cats: 4, rabbits: 6 } },
      { name: 'April',     points: { dogs: 6, cats: 8, rabbits: 4 } },
      { name: 'May',       points: { dogs: 8, cats: 9, rabbits: 5 } },
      { name: 'June',      points: { dogs: 3, cats: 2, rabbits: 2 } },
      { name: 'July',      points: { dogs: 4, cats: 4, rabbits: 8 } },
      { name: 'August',    points: { dogs: 2, cats: 5, rabbits: 9 } },
      { name: 'September', points: { dogs: 3, cats: 6, rabbits: 4 } },
      { name: 'October',   points: { dogs: 7, cats: 2, rabbits: 7 } },
      { name: 'November',  points: { dogs: 5, cats: 8, rabbits: 5 } },
      { name: 'December',  points: { dogs: 1, cats: 0, rabbits: 7 } }
    ]
  };
}
```

## BaseView.html

```html
<link rel='ractive' href='DonutChart.html'>

<!-- legend -->
<ul>
  {{#each colors}}
    <li>
      <span class='block' style='background-color: {{this}}'></span>
      <span>{{@key}}</span>
    </li>
  {{/each}}
</ul>

{{#each months:i}}
  <DonutChart style='width: 16.666%;' points='{{points}}' selected='{{id}}' delay='{{i*50}}'>
    <p>{{name}}</p>
  </DonutChart>
{{/each}}

<style>
  p {
    text-align: center;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 0 0 1em;
  }

  .block {
    position: relative;
    top: 0.1em;
    display: inline-block;
    width: 1em;
    height: 1em;
    margin: 0 0.1em 0 0;
    border-radius: 50%;
  }
</style>

<script>
  component.exports = {
    data: function () {
      return {
        id: null,
        colors: {
          dogs: '#000064',
          cats: '#729d34',
          rabbits: '#5050b4'
        }
      };
    }
  };
</script>
```

## DonutChart.html

```html
<div class='donut-chart' style='{{style}}'>
  <div class='square'>
    <svg viewBox='0 0 100 100'>
      <g transform='translate(50,50)'>
        {{#each segments :i}}
          <polygon
            on-mouseover='set("selected",id)'
            on-mouseout='set("selected",null)'
            class='donut-segment'
            fill='{{colors[id]}}'
            opacity='{{selected ? ( selected === id ? 1 : 0.2 ) :1}}'
            points='{{plot(this)}}'
          >
        {{/each}}

        {{#if selected}}
          <text intro-outro='fade' y='6'>{{points[selected]}}</text>
        {{/if}}
      </g>
    </svg>
  </div>

  {{yield}}
</div>

<script>
  component.exports = {
    oninit: function () {
      var self = this, delay = this.get( 'delay' );

      // wait a bit, then animate in
      setTimeout( function () {
        self.animate( 'c', Math.PI * 2, {
          duration: 800,
          easing: 'easeOut'
        });
      }, delay );
    },

    data: {
      c: 0, // we animate from zero to Math.PI * 2 (the number of radians in a circle)
      innerRadius: 20,
      outerRadius: 45,

      plot: function ( segment ) {
        var innerRadius = this.get( 'innerRadius' );
        var outerRadius = this.get( 'outerRadius' );
        var c = this.get( 'c' ); // allows us to animate intro

        var start = segment.start * c;
        var end = segment.end * c;

        function getPoint ( angle, radius ) {
          return ( ( radius * Math.sin( angle ) ).toFixed( 2 ) + ',' + ( radius * -Math.cos( angle ) ).toFixed( 2 ) );
        }

        var points = [];
        var angle;

        // get points along the outer edge of the segment
        for ( angle = start; angle < end; angle += 0.05 ) {
          points.push( getPoint( angle, outerRadius ) );
        }

        points.push( getPoint( end, outerRadius ) );

        // get points along the inner edge of the segment
        for ( angle = end; angle > start; angle -= 0.05 ) {
          points.push( getPoint( angle, innerRadius ) );
        }

        points.push( getPoint( start, innerRadius ) );

        // join them up as an SVG points list
        return points.join( ' ' );
      }
    },

    computed: {
      segments: function () {
        var points = this.get( 'points' );

        var keys = Object.keys( points ).sort( function ( a, b ) {
          return points[b] - points[a];
        });

        // tally up the total value
        var total = keys.reduce( function ( total, id ) {
          return total + points[id];
        }, 0 );

        // find the start and end point of each segment
        var start = 0;

        return keys.map( function ( id ) {
          var size = points[id] / total, end = start + size, segment;

          segment = {
            id: id,
            start: start,
            end: end
          };

          start = end;
          return segment;
        });
      }
    },

    transitions: {
      fade: require( 'ractive-transitions-fade' )
    }
  };
</script>

<style>
  .donut-chart {
    float: left;
  }

  .square {
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 100% 0;
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  polygon {
    stroke: white;
    stroke-width: 1;
    -webkit-transition: opacity 0.2s;
    transition: opacity 0.2s;
  }

  text {
    text-anchor: middle;
    font-size: 1.2em;
    font-weight: 900;
    fill: #999;
  }
</style>
```
