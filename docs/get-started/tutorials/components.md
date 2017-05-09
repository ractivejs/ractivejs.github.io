# Components

If you've used Backbone Views in the past, you'll be familiar with the basic concept of _extending_ the _base class_ to create a new _subclass_ with default data and additional methods.

## Step 1

In this tutorial we're first going to learn about Ractive.extend and use it to create an image slideshow, using gifs from [devopsreactions.tumblr.com](http://devopsreactions.tumblr.com).

We've got our basic template set up – we just need to make a few additions. First, we need to add a mustache for the image URL:

```handlebars
<div class='main-image'
     style='background-image: url({{image.src}});'>
</div>
```

  We're using a CSS background rather than an `img` element for this example, because you can use the `background-size: contain` CSS rule to ensure that the image is shown at maximum size without distorting the aspect ratio.

Then, we need to add a mustache for the image caption:

```handlebars
<div class='caption'>
  <p>{{image.caption}}</p>
</div>
```

Finally, let's add some event expressions that we can fill in later:

```handlebars
<a class='prev' on-click='@.goto(current - 1)'><span>&laquo;</span></a>
<!-- ... -->
<a class='next' on-click='@.goto(current + 1)'><span>&raquo;</span></a>
```

Execute the JavaScript to redraw the view, with the placeholder data that's already there.

## Step 2

Time to create our `Slideshow` class:

```js
var Slideshow = Ractive.extend({
  // this will be applied to all Slideshow instances
  template: template,

  // method for changing the currently displayed image
  goto: function ( imageNum ) {
    // goto method goes here...
  },

  // initialisation code
  oninit: function ( options ) {
    // initialisation code goes here...
  }
});
```

Each `Slideshow` instance will have a `goto` method in addition to the normal `Ractive` instance methods. Any set-up work we need to do can happen in the `init` lifecycle event, which fires as soon as the nstance is ready to be rendered.

Let's write our `goto` method:

```js
function ( imageNum ) {
  var images = this.get( 'images' );

  // Make sure the image number is between 0...
  while ( imageNum < 0 ) {
    imageNum += images.length;
  }

  // ...and the maximum
  imageNum %= images.length;

  // Then, update the view
  this.set({
    image: images[ imageNum ],
    current: imageNum
  });
}
```

Next, we need to listen for the goto event, so that we can call this.goto(). We wire it up inside our oninit handler:

function ( options ) {
  this.on( 'goto', function ( event, index ) {
    this.goto( index );
  });

  // start with the first image
  this.goto( 0 );
}
Let's add some code to instantiate the slideshow with our gifs. There's a ready-made images variable you can use for this step:

var slideshow = new Slideshow({
  el: output,
  data: { images: images }
});
Go ahead and execute the code – you should now have a working slideshow.

Needless to say, you could add as many bells and whistles as you wanted – fading or sliding transitions, image preloading, thumbnails, touchscreen gesture controls, and so on.

You could, of course, just use an existing image slideshow library. But then you would have to learn that library, and potentially submit to its design philosophy.

Ractive.js is all about flexibility. If you want to change the design or behaviour of a component (say, adding a class name to a particular element), the power to do so is in your hands – the template is easy to understand and tweak because it's basically just HTML, and the view logic is straightforward.

It's better to be able to build your own solution than to rely on developers maintaining high quality and up-to-date documentation.

## Step 3

TODO: lifecycle events

## Step 4

TODO: mappings and links

## Step 5

TODO: anchors
