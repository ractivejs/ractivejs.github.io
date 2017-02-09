# Comments

This example uses the [marked](https://github.com/chjj/marked) library to convert markdown to HTML, before rendering it with a 'triple-stache'. (Note that Ractive.js doesn't sanitize HTML before inserting it – that's the app's responsibility.)

After the comment is created, a newComment event is fired. This would allow us to, for example, save the new comment to a server.

## main.js

```js
// populate our app with some sample comments
var sampleComments = [
  { author: 'Rich', text: 'FIRST!!!' },
  { author: 'anonymous', text: 'I disagree with the previous commenter' },
  { author: 'Samuel L. Ipsum', text: "If they don't know, that means we never told anyone. And if we never told anyone it means we never made it back. Hence we die down here. Just as a matter of deductive logic.\n\nYou think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder." },
  { author: 'Jon Grubber', text: '**Hey you guys!** I can use [markdown](http://daringfireball.net/projects/markdown/) in my posts' }
];

var ractive = new CommentWidget({
  el: demo,
  data: {
    comments: sampleComments
  }
});

ractive.on( 'newComment', function ( comment ) {
  console.log( 'saving to server...', comment );
});
```

## Comment.html

```html
<div class='comment-block' intro='slide'>
  <h4 class='comment-author'>{{author}}</h4>

  <!-- we're using a triple-stache to render the comment body. There
    is a theoretical security risk in that triples insert HTML
    without sanitizing it, so a user could submit a comment with an
    XSS attack hidden in it, which would affect other users.

    In a real-life app, make sure you sanitize on the server
    before sending data to clients! -->
  <div class='comment-text'>{{{ marked(text) }}}</div>
</div>

<style>
  h3, h4 {
    font-family: 'Voltaire';
  }

  h4 {
    margin: 0;
  }

  .comment-block {
    position: relative;
    padding: 0 0 0 10em;
    margin: 0 0 1em 0;
  }

  .comment-author {
    position: absolute;
    left: 0;
    top: 0;
    width: 9em;
    background-color: #eee;
    padding: 0.5em;
  }

  .comment-text {
    position: relative;
    width: 100%;
    height: 100%;
    border-top: 1px solid #eee;
    padding: 0.5em 0.5em 0.5em 1em;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  .comment-text p:last-child {
    margin: 0;
  }
</style>

<script>
  component.exports = {
    data: {
      marked: require( 'marked' )
    },

    transitions: {
      slide: require( 'ractive-transitions-slide' )
    }
  };
</script>
```

## CommentWidget.html

```html
<link rel='ractive' href='Comment.html'>

{{#each comments}}
  <Comment author='{{author}}' text='{{text}}'/>
{{/each}}

<form on-submit='post(event, { author: author, text: text })'>
  <!-- author name -->
  <input class='author-name' value='{{author}}' placeholder='Your name' required>

  <!-- comment body -->
  <textarea value='{{text}}' placeholder='Say something...' required></textarea>

  <!-- 'submit comment' button -->
  <input type='submit' value='Submit comment'>
</form>

<style>
  form {
    position: relative;
    padding: 0 0 0 10.5em;
  }

  .author-name {
    position: absolute;
    left: 0;
    top: 0;
    font-size: inherit;
    font-family: inherit;
    width: 10em;
    padding: 0.5em;
    margin: 0;
    border: 1px solid #eee;
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1);
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  textarea {
    font-size: inherit;
    font-family: inherit;
    width: 100%;
    height: 5em;
    padding: 0.5em;
    border: 1px solid #eee;
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.1);
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }

  input[type="submit"] {
    background-color: #729d34;
    border: none;
    padding: 0.5em;
    font-size: inherit;
    font-family: 'Voltaire';
    color: white;
    opacity: 0.5;
    cursor: pointer;
  }

  input[type="submit"]:hover, input[type="submit"]:focus {
    opacity: 1;
    outline: none;
  }
</style>

<script>
  component.exports = {
    post: function ( event, comment ) {
      // prevent the page from reloading
      event.original.preventDefault();

      // add to the list of comments
      this.push( 'comments', comment );

      // fire an event, so we can (for example)
      // save the comment to our server
      this.fire( 'newComment', comment );

      // reset the form
      document.activeElement.blur();
      this.set({ author: '', text: '' });
    }
  };
</script>
```
