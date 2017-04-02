# Ractive vs Angular

![angular-v-ractive](../img/angular-v-ractive.png)

Lots of people have asked what the difference is between Ractive and other libraries and frameworks. It's long been my intention to write a series of articles attempting to answer, but I've always put it off because a) I didn't have anywhere to post the articles, and b) I didn't feel qualified to compare Ractive to libraries that I'm not particularly familiar with.

Now that I've got round to setting up this blog, a) is no longer an issue. As for b)... well, if I get stuff wrong, people will correct me - this is the Internet, after all. And I'll edit these posts as necessary to keep them accurate.

I was going to begin the series by comparing Ractive to [React.js](http://facebook.github.io/react/), which in my view is one of the more interesting JavaScript libraries of 2013. It has lots of philosophical similarities to Ractive, but also some stark differences. It should be an interesting study.

But the question I've had more frequently - and [most recently](http://stackoverflow.com/questions/20893066/differences-between-ractivejs-and-angularjs) - is how Ractive compares to [Angular](http://angularjs.org/). So I'm going to start there.

<!-- break -->


## What is Angular?

You're kidding, right? Angular is a wildly successful project. Its [GitHub repo](https://github.com/angular/angular.js) has 18,579 stargazers (at the time of writing) - almost ten times Ractive's 1,950. Their [twitter account](http://twitter.com/angularjs) has 28,629 followers, and there are hundreds if not thousands of [Angular apps](http://builtwith.angularjs.org/) in the wild. Most days, an article or video or tutorial about Angular will show up on the Hacker News front page if not on dozens of other front end blogs.


<img src='/img/anglebars.jpg' style='width: 5em; float: left; margin: 0 1em 0 0'>

(Fun fact! Way back in the mists of time, Ractive was called Anglebars - because it was kind of halfway between Angular and Handlebars. I even ripped off the logo. In other words, Angular was a big inspiration for Ractive.)

<div style="clear:both"></div>

It is, by any measure, an impressive showing. And it's built and maintained by the geniuses at Google, several of whom work on it full time. Ractive, by contrast, has one core contributor - yours truly (though it has an excellent community which has made it immeasurably better) - and is the product of unpaid evenings and weekends. Given a choice between Angular and Ractive for a large production application, most developers would probably be wise to select Angular.


## So why bother with Ractive?

One word: simplicity. Angular looks easy at first, but to master it you have to learn some novel concepts (scope, dependency injection, transclusions, modules, directives...) that make writing Angular code feel quite different from writing regular JavaScript. (Before I continue, I should emphasise that I'm not an Angular expert by any stretch - my impressions are largely formed from reading what other people have written.)

Ractive, on the other hand, is designed to be as simple as possible, but no simpler. That's because of its heritage: it was [created in the newsroom](the-origins-of-ractive) of [theguardian.com](http://theguardian.com) for building interactive news applications. These apps have to be built in a very short space of time and work reliably across different environments - there's no time for prototyping etc. Just build it and ship it. You can't spend long optimising things, so the library has to make smart decisions for you.

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p><a href="https://twitter.com/dmitrigrabov">@dmitrigrabov</a> Simplest binding framework I&#39;ve ever used is new: <a href="https://twitter.com/RactiveJS">@RactiveJS</a> from the Guardian. &#10;&#10;1. have object&#10;2. have template&#10;&#10;Done.</p>&mdash; Mike MacCana (@mikemaccana) <a href="https://twitter.com/mikemaccana/statuses/411108002297806848">December 12, 2013</a></blockquote>
<script async="async" src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Most of all, a lot of people building these kinds of apps aren't experienced developers - they're journalists or graphics people who have learned some JavaScript because they want to expand their skillsets and stay relevant, not because they get a kick out of watching Douglas Crockford videos.

<blockquote class="twitter-tweet" lang="en"><p>First piece of code that actually makes sense to my design-oriented brain: <a href="https://twitter.com/RactiveJS">@RactiveJS</a> - still on lesson 5, though</p>&mdash; K. Ant.  (@konstantinosant) <a href="https://twitter.com/konstantinosant/statuses/405590478956920832">November 27, 2013</a></blockquote>
<script async="async" src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Don't try explaining to a hacker-journalist that they need to call `$scope.digest()` or that, having just got their head around minification, they need to perform some elaborate maneouvres to prevent the dependency injection from breaking - trust me, they won't care!

## Enough with the sales pitch. What do they have in common?

Well, they're both largely concerned with eliminating ad-hoc DOM manipulation from the list of things developers have to worry about, by doing what's called *data binding* - modifying the page as data (your *model*, in MVC jargon) changes. Both libraries also offer *two-way data binding*, so that user interactions with the page update the model as necessary.

Angular wasn't the first framework to offer data binding, but it arguably did it better than anyone had before, with a concise syntax based on the [Mustache](http://mustache.github.io/) templating language. Ractive also uses Mustache, since it is easy to read and write, is widely used, and comes with a [formal test suite](https://github.com/mustache/spec) against which implementations like Ractive can check compliance.

They also share philosophical underpinnings. From [angularjs.org](http://angularjs.org):

> HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications ... Other frameworks deal with HTML’s shortcomings by either abstracting away HTML, CSS, and/or JavaScript or by providing an imperative way for manipulating the DOM. Neither of these address the root problem that HTML was not designed for dynamic views.

Amen! Ractive, like Angular, takes the view that we should augment HTML to make it better suited to modern application development, rather than hiding the guts of our apps in JavaScript files, where it's hard to form complete mental models and *reason effectively* about them.

Finally, both Angular and Ractive believe that your model should take the form of [POJOs](http://odetocode.com/blogs/scott/archive/2012/02/27/plain-old-javascript.aspx). Loading data from a server without having to convert it to some kind of `Model` or `Collection` object before you can use it is a liberating feeling. (That said, some apps benefit from the more rigorous approach, and Ractive fully supports that via [adaptors](../extend/adaptors.md))


## And where do they differ?

Firstly, Angular isn't just about your user interface - it has opinions on routing, validation, server communication, testing, and so on. In other words it's a *framework* rather than a *library*.

Ractive only really cares about UI. Use any router/backend/whatever you want - that's your responsibility.

In some situations the framework is exactly what you need - a consistent, opinionated foundation on which to build your app. In other situations, it's a straitjacket. Personally I prefer building apps in a more modular fashion, but that's probably because of the type of app I build for a living. YMMV.

Secondly, they have very different approaches to data binding. Angular uses 'dirty checking', whereby properties of the model are checked on every `$scope.digest()`, which is called automatically most of the time. Ractive uses a dependency tracking mechanism instead. When you call `ractive.set('foo', 'bar')`, all the *dependants* of `foo` are notified (if its value changed). The same principle applies when dealing with complex [expressions](../concepts/templates/expressions.md), which means you don't have to constantly worry about whether your computed properties will cause performance issues.

Miško Hevery, the father of Angular, wrote [this Stack Overflow post](http://stackoverflow.com/questions/9682092/databinding-in-angularjs/9693933#9693933) defending dirty checking, containing this zinger when comparing it to dependency tracking as seen in [Knockout.js](http://knockoutjs.com/):

> KO dependency tracking is a clever feature for a problem which angular does not have.

True, but Angular's `$digest` loop is a clever solution for a problem that no other library has! In any case, Pete Hunt of [React.js](http://facebook.github.io/react/) fame [takes issue](http://www.reddit.com/r/javascript/comments/1oo1y8) with the notion that Angular's dirty checking is fast enough.

A final important difference is in how your app is rendered. Traditional templating engines compile a string template to a function that, given some data, returns another string (which typically is `innerHTML`'d into the page). Angular (and also Knockout) work by traversing the DOM, reading attributes, and setting up bindings accordingly. Aside from the [FOUC](http://iarouse.com/blog/2013/10/30/angularjs-avoid-flash-of-unstyled-content-fouc/) that you then have to work around, this means that your page is peppered with non-validating gubbins like `ng-model`.

Ractive takes a different approach. Your template lives as a string, and is parsed (on the server, if needs be - Ractive is [isomorphic](http://nerds.airbnb.com/isomorphic-javascript-future-web-apps/)) into a tree-like structure that can be transported as JSON. From there, Ractive constructs a lightweight [parallel DOM](../concepts/data-binding/parallel-dom.md) containing all the information it needs to construct the real DOM and set up data-binding etc. In my view, this is a more hygienic approach. Parsing the template before the browser has a chance to has many benefits, even if some people do question the sanity of doing so:

<blockquote class="twitter-tweet" lang="en"><p>This is both brilliant &amp; ridiculous at the same time: “Introducing Ractive.js: next-generation DOM manipulation” <a href="http://t.co/17uHMKZFCQ">http://t.co/17uHMKZFCQ</a></p>&mdash; Rev Dan Catt (@revdancatt) <a href="https://twitter.com/revdancatt/statuses/360340071133622272">July 25, 2013</a></blockquote>
<script async="async" src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Honestly, just try it

This was a long post - if you made it this far, I salute you. But if you really want to know the differences between Angular and Ractive, you should just try them both. Ractive has a [60-second setup guide](http://docs.ractivejs.org/latest/second-setup) and a set of [interactive tutorials](http://learn.ractivejs.org) (with more coming soon), and Angular has [learning resources](http://docs.angularjs.org/tutorial) of its own.

Ractive's development has been very community-driven - there is no ivory tower master plan, just hard-won real-life experience distilled into feature requests. It tastes of delicious [dogfood](http://www.newrepublic.com/article/115349/dogfooding-tech-slang-working-out-glitches). So if it doesn't have a feature you need, there's a very real chance it could do soon - just [come on over to GitHub](https://github.com/RactiveJS/Ractive) and raise an issue.
