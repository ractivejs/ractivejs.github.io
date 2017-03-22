# Rating Stars

```
Embed demo here
```

Creating a simple star rating widget is the kind of thing that quickly turns to spaghetti if you try and build it by hand, or even with jQuery – lots of manually adding and removing classes, probably using tricks like `$.index()` or `this.getAttribute('data-index')` and other such horrors.

Because Ractive.js uses dependency tracking to keep the view in sync - with the minimum DOM manipulation possible - there are no such headaches.

## main.js

```html
var ractive = new BaseView({
  el: demo,
  data: {
    rating: 5
  }
});

// if you wanted to save the rating...
ractive.observe( 'rating', function ( rating ) {
  console.log( 'saving to server: ', rating );
}, { init: false }); // init: false so it doesn't save until it changes
```

## BaseView.html

```html
<link rel='ractive' href='Rating.html'>

<p class='current-rating'>current rating: <strong>{{rating}}</strong></p>

<div class='ratings'>
  <h3>Clickable Rating</h3>
  <Rating max='10' rating='{{rating}}'/>

  <h3>Readonly rating</h3>
  <Rating max='10' rating='{{rating}}' readonly/>
</div>

<style>
  h3 {
    font-family: 'Voltaire';
  }

  .current-rating {
    float: left;
    margin-right: 2em;
    padding-top: 2em;
    text-align: center;
  }

  .current-rating strong {
    display: block;
    clear: both;
    font-size: 6em;
    font-family: 'Voltaire';
  }

  .ratings {
    float: left;
    border-left: 1px solid #eee;
    padding-left: 1em;
  }
</style>
```

## Rating.html

```html
<div class='rating {{readonly ? "readonly" : ""}}' on-mouseout='highlight(0)'>
  {{#each stars:i}}
    <span class='star {{ rating > i ? "selected" : "" }} {{ highlighted > i ? "highlighted" : "" }}'
          on-tap='select(i+1)'
          on-mouseover='highlight(i+1)'
    >&#9733;</span>
  {{/each}}
</div>

<script>
  component.exports = {
    computed: {
      // we generate an array of length `max`, so that
      // we can iterate over it in the template
      stars: function () {
        var max = this.get( 'max' );
        return new Array( max );
      }
    },

    select: function ( rating ) {
      if ( !this.get( 'readonly' ) ) {
        this.set( 'rating', rating );
      }
    },

    highlight: function ( rating ) {
      if ( !this.get( 'readonly' ) ) {
        this.set( 'highlighted', rating );
      }
    },

    events: {
      // use the mobile-friendly tap plugin
      tap: require( 'ractive-events-tap' )
    }
  }
</script>

<style>
  .rating {
    margin: 0 0 1em 0;
  }

  .rating:after {
    content: '';
    display: table;
    clear: both;
  }

  .star {
    font-size: 2em;
    color: #eee;
    cursor: pointer;
    display: block;
    float: left;
  }

  .readonly .star {
    cursor: default;
  }

  .highlighted {
    color: #ccc;
  }

  .selected {
    color: #729d34;
  }
</style>
```
