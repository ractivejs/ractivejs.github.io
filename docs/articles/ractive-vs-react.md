# Ractive vs React

![react-v-ractive](../img/react-v-ractive.png)

The last post on this blog attempted to [compare Ractive.js with Angular.js](ractive-vs-angular.md) - two very different projects with superficial similarities. This time, we'll be comparing Ractive with [React.js](http://facebook.github.io/react), which despite appearances is much closer to Ractive in terms of purpose and philosophy.

<!-- break -->


## What is React?

The [project homepage](http://facebook.github.io/react) calls React 'a JavaScript library for building user interfaces', and goes on to describe it as 'the V in MVC'. In other words, it has one job - taking your application state and turning it into a *view* that can be displayed to the user. This focus separates it from frameworks like Angular and Ember.js, which handle things like routing, and communicating with a server, and myriad other concerns in addition to managing views.

What's really interesting about React is *how* it does its job. As Chris Granger [describes it](https://twitter.com/ibdknox/status/413363120862535680), React is 'the [immediate mode](http://en.wikipedia.org/wiki/Immediate_mode) abstraction over the [retained mode](http://en.wikipedia.org/wiki/Retained_mode) DOM'. Rather than describing what changes are required to bring the view up to date, you describe *what the view should look like*. Under the hood, React uses [smart algorithms](http://calendar.perfplanet.com/2013/diff/) to 'diff' that description with the current state of the DOM, then tells the browser what it needs to do.


## The similarities between Ractive and React

React's first public release came about a month before Ractive's. I distinctly remember reading [the post on Hacker News](https://news.ycombinator.com/item?id=5789055) and thinking 'well I may as well give up' - so many of Ractive's ideas, which a day earlier had seemed entirely novel, had already been implemented by a team of engineers with the might of Facebook behind them.

The most striking similarity was the use of a *virtual DOM*. Like Ractive, React had discovered that creating an abstract representation of the DOM allows for lightning-fast operations by minimising the amount of DOM manipulation (the bottleneck in most webapps) that needs to take place. It also facilitates server-side rendering without some of the [crazy hacks](http://www.yearofmoo.com/2012/11/angularjs-and-seo.html) users of other tools have had to employ.

Another was the focus on *reactive programming*. This is one of those phrases that threatens to become meaningless with overuse, but it's a useful concept. Put simply, in a reactive system where the value of `b` depends on the value of `a`, if `a` changes then `b` will also change. Applied to user interfaces, that means that when your application state changes, your view also changes. With traditional MVC libraries you typically have to implement all your render logic manually and wire it up with a web of publish/subscribe events; with React and Ractive you're spared that (tedious, error-prone, hard-to-optimise) step when building your apps.

Finally, both libraries believe that the way to help developers build complex apps is to give them tools that encourage *simplicity* and *composability* and then get out of their way.

Having said all that, there are also some stark differences.


## Templating

The most obvious way in which the two libraries differ is that Ractive wholly embraces templating - specifically, views are described using a variant of [Mustache](http://mustache.github.io/), extended to include inline JavaScript expressions. Support for other languages is on the roadmap.

(The logic-less template cultists would have you believe that allowing expressions in templates is a Bad Thing. [They're wrong](http://www.boronine.com/2012/09/07/Cult-Of-Logic-less-Templates/). [Here's why](ractive-js-expressions-and-the-new-wave-of-reactive-programming.md).)

React doesn't use templating. Instead, you describe your view by calling functions like `React.DOM.div(props, children)`.

This is, it must be said, a totally brilliant idea. It means that your view code is subject to the same rules as the rest of your app - it gets linted, analysed and optimised with everything else, and allows you to (for example) use functional programming techniques.

But personally, I still prefer templates. Manipulating markup, rather than code, brings you closer to the final rendered UI, and (in general) allows you to express the same ideas more concisely. The striking thing about markup is that it's as easy to read as to write, which is a huge productivity boon when working in a team. HTML is generally the first thing new web developers learn, and it is so pervasive in web dev culture (manifested in a million ways, from the vast quantities of high quality learning and reference materials to that fact that every text editor supports HTML syntax highlighting out of the box), that embracing HTML means embracing the entire skill spectrum of the web developer community.

As someone who [learned to code in a newsroom](the-origins-of-ractive.md), and works alongside others walking the same path, I believe that creating tools that beginners can use, as well as experts, is our most urgent task.


## Change tracking

React re-renders the entire app on each state change, and diffs the result. Ractive, on the other hand, implements a change tracking mechanism, so only a subset of the virtual DOM gets notified of any change.

There's no right answer to the question 'which approach is better?'. Ractive's more conservative approach is often faster - as you'd expect, because there's generally less work to do - but React's is undoubtedly *simpler*, in the sense of that word [as used by Clojure author Rich Hickey](http://www.infoq.com/presentations/Simple-Made-Easy). (The Clojure community appears to have had a profound influence on React's design, as evidenced by its popularity among prominent ClojureScript developers such as [David Nolen](https://twitter.com/swannodette), the author of [Om](https://github.com/swannodette/om), and the aforementioned Chris Granger who created [Light Table](http://www.lighttable.com/).)

One point is worth noting however. Unlike just about every other data-binding tool (except Angular, which does something totally different), Ractive doesn't require you to wrap your data up in some library-specific observable class (e.g. `ko.observable()` or `Backbone.Model()`) - a requirement that React developers criticise, not without justification. Instead, it uses an approach based on [keypaths](../concepts/templates/keypaths.md), which means you can use plain old JavaScript objects (though you certainly can use observables, with the use of [adaptors](../extend/adaptors.md), if that's how your app is built).


## Two-way binding

Most data-binding tools implement some form of *two-way binding*, where user interaction - such as text entry in an `<input>` element, or toggling a checkbox - causes the application state to be updated. Implementing this manually is often finicky and requires the developer to be aware of various browser inconsistencies, and so robust two-way binding support is a real timesaver.

React rejects this. In the React world, data flows one way - from parent to child - and two-way binding is seen as a source of bugs and confusion since ([its detractors say](https://twitter.com/asolove/status/459391361310269441)) there's no longer a 'single source of truth' (SSOT).

Done correctly, two-way binding doesn't violate SSOT at all - it simply means that the `<input>` automatically *requests* changes to the SSOT without each developer having to write bothersome (and possibly incorrect!) boilerplate code. In my experience, two-way binding is a huge productivity win.

Having said that, particularly complex interactions between Ractive components *have* been a source of bugs in the past. Our test suite will guard against those bugs reappearing, but it's fair to say that my life would have been easier for a couple of weeks earlier this year had two-way binding never been possible in Ractive.

Would we design the library differently now? No - I believe that solving these hard problems on developers' behalf is exactly what a library like Ractive is for.


## Where React shines

It's only fair to point out that React is *extremely* well battle-tested, having been used at [facebook.com](http://facebook.com) (you may have heard of it?) for some time. If it's good enough for them (where 'good' is defined as performant, testable, maintainable and so on) then it's almost certainly good enough for the rest of us.

The React community is smart and passionate. Not just smart - *wise*. The attention to code quality is obvious. Online and in real life, React people are thoughtful, interesting and kind: these things matter.

React beats Ractive on *clarity of vision*. When you hear React people talk, it's obvious that it wasn't created as a slightly-better version of what already existed; it's an implementation of ideas that are simultaneously ancient (in programming terms) and radical. Ractive, on the other hand, grew *into* its philosophy, from a starting point of 'here are some tasks that are way harder than they ought to be'.

In short, I'd recommend React as the best way to build user interfaces, if Ractive didn't exist!


## Where Ractive shines

For starters, you can [learn Ractive in 60 seconds](/get-started/60-second-setup). If you know HTML and the basics of Mustache (which itself has almost zero learning curve), then all you need to learn is the `ractive.set()` method and you're already most of the way there. People of all levels of experience 'get' Ractive very quickly, because there are so few concepts to learn.

Because of Ractive's newsroom heritage, it has always prioritised certain features that make it easy to build UIs that are *slick* - declarative transitions, animations, and first-class SVG support. A Ractive component can include CSS in its definition, which is encapsulated by default (i.e. component styles don't leak into the page). These are tricky problems that other libraries have, for the most part, yet to solve well, if at all.

Like React, Ractive's community is awesome. I'm constantly amazed and humbled by people's readiness to help each other with creative solutions to tricky problems, and then to work on baking those solutions into the library. I'm truly excited to see how Ractive develops, because the direction is so heavily driven by real-world problem solving that it's impossible to predict what will happen next.


## Conclusion

And I'm excited to see where React goes too. I hope the respect I have for the library and its developers is apparent in this post: it really is a great tool.

So which should you use? Try both. It's an interesting time to be in this space because there are so many competing ideas; if we want the best ones to win, they each need to go under the microscope.
