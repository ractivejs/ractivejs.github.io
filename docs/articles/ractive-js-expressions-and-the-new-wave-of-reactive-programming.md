# Ractive.js expressions and the new wave of reactive programming

*Originally posted at [flippinawesome.org](http://flippinawesome.org/2013/08/19/ractive-js-expressions-and-the-new-wave-of-reactive-programming/)*

Dedicated followers of JavaScript fashion will by now have noticed this season’s hot new trend. If you haven’t spotted it yet, here are a few projects sporting this style on the GitHub catwalk – [React](http://facebook.github.io/react/), [Reactive.js](https://github.com/mattbaker/Reactive.js), [component/reactive](https://github.com/component/reactive) and [reactive.coffee](https://github.com/yang/reactive-coffee).

That’s right: *reactive programming* is the new black.

At a high level, the idea behind reactive programming is that changes in state propagate throughout a system. Put crudely, this means that in a reactive system where `a = b * 2`, whenever the value of `b` changes, the value of `a` will also change, rather than forever being equal to whatever `b * 2` was at the time of the statement.

When we take this idea and apply it to user interfaces, we eliminate the DOM manipulation drudgery that dominates web developers’ lives.

<!-- break -->

Ractive.js is a new library initially developed to create interactive (hence the name – not to be confused with Reactive.js!) news applications at [theguardian.com](http://theguardian.com). It is designed to dramatically reduce the effort involved in creating web apps by embracing these principles.

Let’s look at a simple example:

```js
// We create a new ractive, which renders the following to a container element:
// <p>Hello, Dave! You have 4 tasks remaining.</p>

var ractive = new Ractive({
	el: container,
	template: '<p>Hello, {{name}}! You have {{tasks.incomplete}} tasks remaining.</p>',
	data: { name: 'Dave', tasks: { incomplete: 4, total: 11 } }
});

// Later we get some new data:
ractive.set( 'tasks', { incomplete: 5, total: 12 });

// The ractive reacts accordingly, surgically updating the part of the DOM that is
// now out of date:
// <p>Hello, Dave! You have 5 tasks remaining.</p>
```

Rather than doing any kind of polling or brute-force ‘dirty checking,’ this uses an elegant dependency tracking system: the text node containing the number of incomplete tasks depends on the `tasks.incomplete` *keypath*, which is a child of the `tasks` keypath. So when we update `tasks`, we know that we need to check to see if `tasks.incomplete` has changed – but we don’t need to bother checking `tasks.total`, because nothing depends on that keypath.

As applications grow in complexity, this means much less work for the developer. You might think it sounds like more work for the browser, but it’s not. The non-reactive way to do interactive UI typically involves re-rendering views regardless of whether they’ve changed, and replacing chunks of perfectly good DOM (why hello, [garbage collector](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)), which is typically much less efficient.

In other words, reactive UI is a win-win – better for performance, and better for your sanity.

## The secret sauce: expressions

This article won’t go any further into the basics of what Ractive does or why we built it – if you’re interested, you can [follow the interactive tutorials](http://learn.ractivejs.org) or [read the introductory blog post](http://theguardian.com/info/developer-blog/2013/jul/24/ractive-js-next-generation-dom-manipulation). Instead, we’re going to focus on one of the features that helps Ractive stand out from its peers, namely *expressions*.

Expressions allow you to take the logic that only your interface cares about, and put it in your template *where it belongs*. Yes, I just said that! If you’ve ever had to debug badly written PHP (for example), you may well shudder at the suggestion that logic belongs in templates. But while it’s true that *business logic* doesn’t belong in your templates, it’s equally true that a lot of *presentation logic* – aka ‘data massaging’ – doesn’t really belong in your code.

(If you still need convincing, here’s a couple of good articles on the subject: [The Case Against Logic-less Templates](http://www.ebaytechblog.com/2012/10/01/the-case-against-logic-less-templates/) and [Cult of Logic-Less Templates](http://boronine.com/2012/09/07/Cult-Of-Logic-less-Templates/).)

Let’s take our initial example and turn it into a basic todo app along the lines of [TodoMVC](http://todomvc.com). Our template looks like this – ignore the question marks for now:

```html
<p>Hello, {{name}}! You have ??? tasks remaining.</p>

<ul>
{{#tasks :i}}
	<li class='task'>{{i}}: {{description}}</li>
{{/tasks}}
</ul>
```

Meanwhile our *model*, if you want to use MVC terminology, is a simple array of objects representing tasks:

```js
tasks = [
	{ completed: true,	description: 'Add a task' },
	{ completed: false, description: 'Add some more tasks' }.
	{ completed: false, description: 'Solve P = NP' }
];

ractive = new Ractive({
	el: container,
	template: template,
	data: { name: 'Dave', tasks: tasks }
});
```

This renders the following:

```html
<p>Hello, Dave! You have ??? tasks remaining.</p>

<ul>
	<li class='task'>0: Add a task</li>
	<li class='task'>1: Add some more tasks</li>
	<li class='task'>2: Solve P = NP</li>
</ul>
```

This time, there’s no `tasks.incomplete` property, because `tasks` is an array. We’ll come back to that. The first job is to rejig the numbers so that it starts at 1, because lists starting with 0 only make sense to programmers. Doing so is trivial:

```html
<li class='task'>{{i+1}}: {{description}}</li>
```

Next, let’s add a `complete` class to any completed task:

```html
<li class='task {{ completed ? "complete" : "pending" }}'>{{i+1}}: {{description}}</li>
```

Now, our rendered task list looks like this:

```html
<p>Hello, Dave! You have ??? tasks remaining.</p>

<ul>
	<li class='task complete'>1: Add a task</li>
	<li class='task pending'>2: Add some more tasks</li>
	<li class='task pending'>3: Solve P = NP</li>
</ul>
```

Now, let’s deal with those question marks. One way – the traditional way – would be to keep track of the incomplete count as a separate value in our model (or viewmodel, depending on which tribe you belong to), and update it every time the task list changed. The trouble with that is you have to add the necessary logic to every bit of your app that can change the model in some way – a toggle on each task, a ‘mark all as complete’ button, the code that reads from the server (or local storage), or whatever else gets added in future. It doesn’t scale.

A better way is to have the template react to changes by calling any necessary logic *when it needs to*:

```html
<p>Hello, Dave! You have {{ tasks.filter( incomplete ).length }} tasks remaining.</p>
```

Then, we just need to add an `incomplete` filter to our model:

```js
ractive = new Ractive({
	el: container,
	template: template,
	data: {
		name: 'Dave',
		tasks: tasks,
		incomplete: function ( item ) {
			return !item.completed;
		}
	}
});
```

Now, whenever `tasks` changes – whether because we’ve added a new one, or changed the status of one or more tasks, or whatever – the expression will be re-evaluated. If the number of incomplete tasks has changed, the DOM will be updated.

As our app becomes more complex, this approach scales beautifully, saving us from a convoluted observing/massaging/updating of our data.

(You can see a [fully fleshed out TodoMVC implementation here](http://todomvc.com/labs/architecture-examples/ractive/) – (the [source code](https://github.com/tastejs/todomvc/tree/gh-pages/labs/architecture-examples/ractive) is possibly the shortest of any implementation, and arguably some of the most readable).</small>)

It also allows us to do things like [sophisticated animations](../get-started/examples/animated-chart.md), without reams of complex render logic.

## How does it work?

Traditional templating engines work by *interpolating strings*, the result of which is typically rendered using `innerHTML`. Ractive is different – it parses templates into a tree-like JSON structure which contains the DNA of the app, using a [PEG-style parser](http://en.wikipedia.org/wiki/parsing_expression_grammar). When it encounters an expression, the parser first creates an [abstract syntax tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) representation of it, then extracts the *references* from the AST, then collapses it down to a string representation.

```js
Ractive.parse( '{{i+1}}' );

// results in the following - it's deliberately terse, so that
// you can parse on the server and send the result to browsers
// without wasting bytes:
// {
//	 t: 2,					// the type of mustache
//	 x: {					 // the expression
//		 r: [ "i" ],	// the references used in the expression
//		 s: "${0}+1"	// a reference-agnostic string representation
//	 }
// }
```

Later, when Ractive renders this mustache, it will try to *resolve the references* used in the expression. In this example, there’s only one reference – `i` – which resolves to `0` for the first task, then `1`, then `2` and so on. Ractive creates a function – using the [Function constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) – that takes the value of `i` as an argument and returns `i+1`.

This might seem like a roundabout way to add 1 to something. But because we only need to create the function once, rather than repeatedly `eval`ing code (which is slow), it’s a memory-efficient and performant way to solve the problem even when dealing with hundreds of tasks.

And because we know which references are involved, we know when to call the function again. Consider the next expression:

```js
Ractive.parse( '{{ completed ? "complete" : "pending" }}' );

// {
//	 t: 2,
//	 x: {
//		 r: [ "completed" ],
//		 s: "${0}?'complete':'pending'"
//	 }
// }
```

For the first task, the `completed` reference resolves to the keypath `tasks.0.completed` – for the second, `tasks.1.completed` and so on. In each case, Ractive *registers the mustache* as a *dependant* of the keypath, so that when `tasks.0.completed` changes (again, it doesn’t matter what happened to cause it to change – that’s the beauty of reactive programming), the expression is re-evaluated and the DOM is updated.

## So is it ‘real JavaScript’?

Up to a point. Since in a reactive system we don’t have control over when the expression is evaluated, it’s important that expressions don’t have *side effects* – so if we try to use assignment operators such as `foo = bar` or `foo += 1`, the parser will fail. The same goes for certain keywords, such as `new`, `delete` and `function`.

Of course, it’s still possible to create side-effects by referencing a function which itself has side-effects. Remember our `incomplete` filter? There’s nothing to stop you doing this:

```js
ractive = new Ractive({
	el: container,
	template: template,
	data: {
		name: 'Dave',
		tasks: tasks,
		incomplete: function ( item ) {
			doSomeExpensiveComputation();
			counter += 1;
			return !item.completed;
		}
	}
});
```

But by parsing expressions and blocking ‘accidental’ side-effects, we can encourage best practices without preventing power users from manipulating the system to their own ends.

## The future

Expect to see more examples of the reactive programming trend coming to a repository near you. As with all programming paradigms, it’s not a silver bullet, but by integrating reactive thinking into our work we can start to structure our applications in a way that is more readable and (often) more efficient.

Ractive.js is under active development – it’s production-ready (to get started, [try the 60 second setup](https://github.com/RactiveJS/Ractive/wiki/60-second-setup) or [follow the interactive tutorials](http://learn.ractivejs.org)), but will continue to evolve as we collectively figure out the secrets of reactive programming. If you’re interested in being part of that conversation, [come on over to GitHub](https://github.com/RactiveJS/Ractive) and help shape the future of web development.
