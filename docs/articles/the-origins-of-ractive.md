# The Origins of Ractive.js

*Originally posted on [Source](http://source.opennews.org/en-US/articles/introducing-ractivejs/), the blog for newsroom developers and hacker-journalists*

Making interactives is hard. You have to:

* figure out the story
* find some data (possibly) and clean it/transform it (almost certainly)
* design a user interface
* mark it up with HTML
* style it with CSS
* make it dance with JavaScript
* test it in different browsers and on mobile devices
* deploy it
* fix all the bugs you missed
* deploy it again

...and you have to do all that against deadlines that would make most developers wince. And yet here’s the thing: in many newsrooms, the people building these interactive stories — and in so doing figuring out the rules of a [fundamentally new form of media](https://vimeo.com/67076984) — are not experienced developers.

They’re journalist-hackers and lone crusaders, fighting for the future of news against (in some cases) bureaucratic overlords who still think video on the web is the next big thing. And they—we—deserve better weapons for the fight.

<!-- break -->


## Origins

Two years ago, as a journalist at [Citywire](http://citywire.co.uk/money), I began tinkering with JavaScript. I was lucky—I had supportive bosses, and the dev team decided it was better to help me become less dangerous than to try and shut me down—and so we were able to produce a few interactives, such as [this piece on UK-wide rent hikes](http://citywire.co.uk/money/interactive-how-much-has-rent-gone-up-in-your-area/a538600).

But I was so far out of my depth. Keeping all the different components of an interactive in sync, handling user events like mouse clicks, storing dozens of references to jQuery objects so I could manipulate them—it was chaos. I longed for a library that would help me do all these things.

Later, when I joined the [Guardian Interactive team](http://www.theguardian.com/profile/guardian-interactive-department), I found myself surrounded by brilliant and experienced developers, and quickly realised my jQuery spaghetti wasn’t going to cut it any more. But if my dream library didn’t exist, I was going to have to build it.


## How does Ractive.js help?

The core premise of Ractive is that *declarative programming* is easier than *imperative programming*. In other words, if you can *declare* your intentions, rather than laboriously describing the steps you want the computer to take to realise your intentions, you can finish work and get to the pub sooner.

What this means in practice is that more of your app is defined in HTML templates. To take the simplest possible example, let’s make a Hello World template:

```html
<p>Hello, {{name}}!</p>
```

Describing our interactive with an HTML template is obviously better than `document.createElement('p').innerHTML = 'Hello ,' + name + '!'` — very few people would dispute that. But where Ractive differs radically from other templating libraries is that it *parses* the HTML and fully understands its structure — and the bits of data it depends on — rather than simply replacing `{{name}}` and dumping the resulting HTML onto the page.

The result is that updating the interactive with new data is painless:

```js
ractive.set( 'name', 'World' );
```

Moreover, because Ractive is *state-aware*, it can avoid doing unnecessary updates, thus easing what’s generally considered to be the biggest performance bottleneck in web development.


## That’s just the beginning

It turns out that this approach makes it really easy to do a whole suite of things—animations, SVG data visualisations, neater event handling, collecting user input, and so on.

If these sound like things that could make your life easier then you can find all the [examples](http://examples.ractivejs.org), [tutorials](http://learn.ractivejs.org) and [documentation](https://github.com/Rich-Harris/Ractive/wiki) you need to get started—including the [60-second set-up](http://www.ractivejs.org/60-second-setup) — via [ractive.js.org](/).

Ractive has been used to build a number of Guardian interactives, so even though development is still ongoing ([issues and pull requests](https://github.com/Rich-Harris/Ractive/issues) are always welcome!) it’s definitely production-ready. It’s been tested successfully in IE8+ and in all modern browsers.

If you build something with Ractive, we’d love to hear about it.

## Acknowledgment

The development of Ractive.js was made possible, in part, by the [Bill &amp; Melinda Gates Foundation](http://www.gatesfoundation.org/)’s support for [Guardian Global development](http://www.theguardian.com/global-development/).
