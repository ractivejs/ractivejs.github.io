# Hello, world!

Welcome to the Ractive.js tutorials. This is a set of interactive tutorials which you can take at your own pace. Each tutorial consists of a number of steps – first up is step 1 of the 'Hello world!' tutorial.

At any time you can start or reset a step by clicking its Start button.

## Step 1
<div class="tutorial">
	<button data-tab="script" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbABIIVKgPZZyAdw8wVJABCLichTjEJaTYQHGF4Tk5yYwRRAFcFLTBiYXJRDyQEX2JcMCyi1QZtcgAjDNwPfkom0qKGyQBaCRQwGXyYfgQYcg8AMyyc8kkGQYFSJnJzS2tyanJBn3IAJQsrUgQACmABci0mFkhyAHIAYlxzhFwrrBOtJUqFS9uFZTUFK4EGAAlABuOz8RJZGAeNI9GEyVrCNoZfzEBgqYTeVowIqTGYjDKSDLkHjFUrkfFUEbjK73ZiPAEQpIzJAUt6-dRFSJSGQ+EplSmssbXH4fBCMyHaGF5fGjYj8VmtAm4IkyUks9li8jc6QjFpgIrOAAqAFkADJnGqYIA">Start</button>
</div>

Try creating a new Ractive by executing the JavaScript in the script tab of the playground by hitting the &#9654; button on the top right-hand corner of the playground.

> In later steps, if you can't get it to work (or if you're just lazy!) you can click the Fix Code button, if there is one available, next to the Start button to insert working code as though you'd followed the instructions exactly.
> 
> Throughout the tutorials, boxes like this will contain technical notes and asides, for the particularly nerdy or curious.

## Step 2
<div class="tutorial">
	<button data-tab="html" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbABIIVKgPZZyAdw8wVJABCLichTjEJaTYQHGF4UiZyc0trcmpyfgQfcgAlCytSBAAKYAFyLSYWSHIAcgBiXCqEXFqscq0lVXUEGoaFZTUFWoEMAEoAbgFMIA">Start</button>
	<button data-tab="script" data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbYMBQwECK-xQZs5F-wMigi+AIRcTkKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwALkWkwskOQA5ADEuHWejVjVWkqq6ggNLQrKagqd3UjqDA3A5G4eXiiDABIIKioA9p05QQNNeRswKkiN5BgCGACUANwCmEA">Fix Code</button>
</div>

That's not very exciting. Let's make our template more templatey – replace the hard-coded text in the template with some variables:

```handlebars
<p>{{greeting}} {{name}}!</p>
```

Then, add some data to it, by adding a data initialisation option to our code on the script tab so that it looks like this:

```js
var ractive = new Ractive({
  target: output,
  template: template,
  data: { greeting: 'Hello', name: 'world' }
});
```
Execute the code (with the &#9654; button). It should look exactly as it did before.

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbYMBQwECK-xQZs5F-wMigi+AIRcTkKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwALkWkwskOQA5ADEuHWejVjVWkqq6ggNLQrKagqd3UjqDA3A5G4eXiiDABIIKioA9p05QQNNeRswKkiN5BgCGACUANwCmEA">Start</button>
</div>

Here's where Ractive differs from other templating libraries. Normally, if you wanted to change the data, you would have to re-render the entire view, which would have the effect of discarding the DOM nodes you'd already created. That's wasteful.

Instead, we can manipulate views we've already created. Try running this code - click the &#9654; button in the top-right corner:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbYMBQwECK-xQZs5F-wMigi+AIRcTkKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwALkWkwskOQA5ADEuHWejVjVWkqq6ggNLQrKagqd3UjqDA3A5G4eXiiDABIIKioA9p05QQNNeRswKkiN5BgCGACUANwCmEA" data-eval="E4QwxgLglgbgpgOgM5wgCgOQHNh1VAOywwBoACDAIQHsCAragV2AwEoBuIA"></div>
```js
ractive.set('greeting', 'Bonjour');
```

And now this:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbYMBQwECK-xQZs5F-wMigi+AIRcTkKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwALkWkwskOQA5ADEuHWejVjVWkqq6ggNLQrKagqd3UjqDA3A5G4eXiiDABIIKioA9p05QQNNeRswKkiN5BgCGACUANwCmEA" data-eval="E4QwxgLglgbgpgOgM5wgCgOQHNh1VAOywwBoACDAIQHsCAragV2AwEoBuAKFElkRXQYCIALZxSFCEwhkANnDIjaAE3EcgA"></div>
```js
ractive.set('name', 'tout le monde');
```

Ooh la la! Even better, we could set both properties in one go. Let's do it in Mandarin this time:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbYMBQwECK-xQZs5F-wMigi+AIRcTkKcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCAAUwALkWkwskOQA5ADEuHWejVjVWkqq6ggNLQrKagqd3UjqDA3A5G4eXiiDABIIKioA9p05QQNNeRswKkiN5BgCGACUANwCmEA" data-eval="E4QwxgLglgbgpgOgM5wgCgN4CgAEODmwcqUAdvgFw4DkgBvKC+mtQDS46kgC2cV1gaHKAyrtSwBfAJQBuIA"></div>
```js
ractive.set({
  greeting: '你好',
  name: '世界'
});
```

What's happening here is that the contents of the `<p>` element are split into four text nodes – one for `{{greeting}}`, one for the comma and space characters, one for `{{name}}`, and one for the `!`. Ractive stores references to the nodes that correspond to the variables, and updates them when the data changes, leaving everything else untouched.

Surgically updating text nodes is much faster than replacing elements, particularly when you only need to change part of your ractive.

> Note that due to the way the tutorials interact with the playground, the eval blocks above are actually running after the entire example is reloaded in the output pane. That's why running the last eval before running the next to last eval doesn't leave the Mandarin greeting intact. Under normal circumstances, the entire example wouldn't need to be re-run, which _would_ leave the Mandarin greeting intact.
