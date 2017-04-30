# Hello, world!

Welcome to the Ractive.js tutorials. This is a set of interactive tutorials which you can take at your own pace. Each tutorial consists of a number of steps – first up is step 1 of the 'Hello world!' tutorial.

At any time you can start or reset a step by clicking its Start button.

## Step 1
<div class="tutorial">
	<button data-tab="script" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbABIIVKgPZZyAdw8wVJABCLichTjEJaTYQHGF4Tk5yYwRRAFcFLTBiYXJRDyQEX2JcMCyi1QZtcgAjDNwPfkom0qKGyQBaCRQwGXyYfgQYcg8AMyyc8kkGQYFSJnJzS2tyanJBn3IAJQsrUgQACmABcmSVSHIAcgBiXCYWS6wTrSVKhQubhWU1BUuBDAAlABuOz8RJZGAeNI9KEyVrCNoZfzEBgqYTeVowIqTGYjDKSDLkHjFUrkXFUEbjS53ZgIXB-MFJGZIMkvb7qIqRKQyHwlMrklljK5fN4IBng7RQvK40bEfgs1p43AEmTE5ls0XkLnSEYtMBFZwAFQAsgAZLQMGqYIA">Start</button>
</div>

Try creating a new Ractive by executing the JavaScript in the script tab of the playground by hitting the &#9654; button on the top right-hand corner of the playground.

> In later steps, if you can't get it to work (or if you're just lazy!) you can click the Fix Code button, if there is one available, next to the Start button to insert working code as though you'd followed the instructions exactly.
> 
> Throughout the tutorials, boxes like this will contain technical notes and asides, for the particularly nerdy or curious.

## Step 2
<div class="tutorial">
	<button data-tab="html" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2ACQTLlAeyzkA7u5jKkAEIuRwEuUXEpNhAcIXhSJnIzCytyanJ+BG9yACVzS1IEAApgAXJyV0hyAHIAYlwmFmqsMs1FFTUEKrr5JVV5aoEMAEoAbgFMIA">Start</button>
	<button data-tab="script" data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2wYChgIEl-igzZyz-gwKCD4AhFyOAlyi4lJsIDhC8KRM5GYWVuTU5PwIAO7kAErmlqQIABTAAuTkCMqQ5ADkAMS4TCwNWFWaiipqCPXN8kqq8h1dSGoM9cDkru6eKAMAErXKAPYd2YH9jblrMMpIDeQYAhgAlADcAphAA">Fix Code</button>
</div>

That's not very exciting. Let's make our template more templatey – replace the hard-coded text in the template with some variables:

```handlebars
<p>{{greeting}} {{name}}!</p>
```

Then, add some data to it, by adding a data initialisation option to our code on the script tab so that it looks like this:

```js
var ractive = new Ractive({
  el: output,
  template: template,
  data: { greeting: 'Hello', name: 'world' }
});
```
Execute the code (with the &#9654; button). It should look exactly as it did before.

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2wYChgIEl-igzZyz-gwKCD4AhFyOAlyi4lJsIDhC8KRM5GYWVuTU5PwIAO7kAErmlqQIABTAAuTkCMqQ5ADkAMS4TCwNWFWaiipqCPXN8kqq8h1dSGoM9cDkru6eKAMAErXKAPYd2YH9jblrMMpIDeQYAhgAlADcAphAA">Start</button>
</div>

Here's where Ractive differs from other templating libraries. Normally, if you wanted to change the data, you would have to re-render the entire view, which would have the effect of discarding the DOM nodes you'd already created. That's wasteful.

Instead, we can manipulate views we've already created. Try running this code - click on it and hit Shift-Space:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2wYChgIEl-igzZyz-gwKCD4AhFyOAlyi4lJsIDhC8KRM5GYWVuTU5PwIAO7kAErmlqQIABTAAuTkCMqQ5ADkAMS4TCwNWFWaiipqCPXN8kqq8h1dSGoM9cDkru6eKAMAErXKAPYd2YH9jblrMMpIDeQYAhgAlADcAphAA" data-eval="E4QwxgLglgbgpgOgM5wgCgOQHNh1VAOywwBoACDAIQHsCAragV2AwEoBuIA"></div>
```js
ractive.set('greeting', 'Bonjour');
```

And now this:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2wYChgIEl-igzZyz-gwKCD4AhFyOAlyi4lJsIDhC8KRM5GYWVuTU5PwIAO7kAErmlqQIABTAAuTkCMqQ5ADkAMS4TCwNWFWaiipqCPXN8kqq8h1dSGoM9cDkru6eKAMAErXKAPYd2YH9jblrMMpIDeQYAhgAlADcAphAA" data-eval="E4QwxgLglgbgpgOgM5wgCgOQHNh1VAOywwBoACDAIQHsCAragV2AwEoBuAKFElkRXQYCIALZxSFCEwhkANnDIjaAE3EcgA"></div>
```js
ractive.set('name', 'tout le monde');
```

Ooh la la! Even better, we could set both properties in one go. Let's do it in Mandarin this time:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYEAzgGMYxAA65KNergQBbCQBsG8+uVwBPCQjp4EAD1ycYDEbjIJ2A2rgIS2wYChgIEl-igzZyz-gwKCD4AhFyOAlyi4lJsIDhC8KRM5GYWVuTU5PwIAO7kAErmlqQIABTAAuTkCMqQ5ADkAMS4TCwNWFWaiipqCPXN8kqq8h1dSGoM9cDkru6eKAMAErXKAPYd2YH9jblrMMpIDeQYAhgAlADcAphAA" data-eval="E4QwxgLglgbgpgOgM5wgCgN4CgAEODmwcqUAdvgFw4DkgBvKC+mtQDS46kgC2cV1gaHKAyrtSwBfAJQBuIA"></div>
```js
ractive.set({
  greeting: '你好',
  name: '世界'
});
```

What's happening here is that the contents of the `<p>` element are split into four text nodes – one for `{{greeting}}`, one for the comma and space characters, one for `{{name}}`, and one for the `!`. Ractive stores references to the nodes that correspond to the variables, and updates them when the data changes, leaving everything else untouched.

Surgically updating text nodes is much faster than replacing elements, particularly when you only need to change part of your ractive.

> Note that due to the way the tutorials interact with the playground, the eval blocks above are actually running after the entire example is reloaded in the output pane. That's why running the last eval before running the next to last eval doesn't leave the Mandarin greeting intact. Under normal circumstances, the entire example wouldn't need to be re-run, which _would_ leave the Mandarin greeting intact.
