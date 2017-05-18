# Events

DOM events are central to anything interactive on the web. You've probably written `element.addEventListener('click', handler)` or `$('#button').on('click', handler)`, or similar code, a thousand times.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYAAigq7o4MKgB0MQgwuAAU5ADkAIKWZOrE-CgAhGnkAJTsWVak6ggFXC5unnz8XGIS0mwgOMLwVTDk5tmkCOTU5PwIAO7kAEoWlQjJwALk5AgqkOkAxLhMLGlYy1pKqtUbadvHagr7AhglANydIKLwmEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYAAigq7o4MKgB0MQgwuAAU5ADkAIKWZOrE-CgAhGnkAJRYdjLkVdXkop7C7ioIsZEoqWkJSeQA7gzC5BZB-O7dTajIxSXsWVak6ggFXC5unnz8XGIS0mwgOMLwczDk5tmkCOTU5PwI3eQAShazCMnAAlUIKpDpAMS4TCxpcpeLRKVTzL5pX6gtQKQECDAlADcuxAongmCAA">Fix Code</button>
</div>

With Ractive.js, events are declarative instead, and you declare an event handler like this:

```handlebars
<button on-click="@global.alert( 'Activating!' )">Activate!</button>
```

> "But wait!", you say. "That looks like some sort of global inline event listener horribleness!". It's not though, I promise. Instead, the `on-` directive will bind a shared callback directly to the element using `addEventListener` when it is rendered. When the shared callback is triggered, it will evaluate the expression (or list of expressions) that was passed to the event directive. If you inspect the button element in your browser's Dev Tools, you'll notice that there is no `onclick` attribute. That's because directives don't render directly to the DOM, but instead control behavior related to rendering like attaching event listeners.

This is generally more convenient - you don't need to pepper the DOM with id and class attributes just you've got a hook to identify elements with. It also takes the guesswork out of when to attach and detach event listeners, since Ractive.js will automatically attach and detach handlers as elements are rendered and unrendered. Since the event directive actually accepts a list of expressions as its argument, so go ahead and log a console message after the alert is acknowledged:

```handlebars
<button on-click="@global.alert( 'Activating!' ), console.log( 'alert was acknowledged' )">Activate!</button>
```

> `console` is one of the globals that is exposed to Ractive.js templates, but if you want to get to `alert`, you have to go through the `@global` special reference.
>
> The playground watches for console messages in the output pane and displays them on the `Console` tab, so if you happen to be reading through this in a browser that doesn't have Dev Tools, you can still see most console messages.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVzBg-AK6KARghgYM5Am+e4uAD2-OQhALSiKsSiANYGAAK4YMTCAHQMSEgAFOQA5C7unnnkAJTsANRc-oEhfPxcYhLSbCA4wvCkTOTmltbk1OT8CADu5ABKFlakCNnAAuTkCCqQ+QDEuEwseVgLWkqq6gireRsHago7e0jqDKvzoeT2hR4wqwAMexgCGKUA3G0QKJ4JggA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVzBg-AK6KARghgYMd3ATfOuLgA9vzkoQC0oirEogDWBgACuGDEwgB0ws5uuOaWABTkAOQu7p5F5ACU7BFcAUGhfIJ+9SFhkdGxCfTJqRkMSEiFJa4eMBXVIGwA1HWBbU1cYhLSbCA4wvCkTOR5VqQI5NTk-AgA7uQAShb7CPnAAuTkCCqQxQDEuEwsRViPWkpVOoEG8ip9AWoFL9-kh1Aw3g8wuR7KUxm8AAz-Hz8DCVADc6xAongmCAA">Fix Code</button>
</div>

Okay, we can now annoy users and log debug info. What about something a bit more useful? Back into the bag of contrived examples, and out comes... a number incrementer!

```handlebars
{{number}} <button on-click="@this.add('number')">+</button>
```

> `@this` is a reference to the Ractive.js instance that is controlling the template, so you can call any methods on the Ractive.js API with the `@this` special reference. Since `@this` is a _very_ common reference, it also has an ever so slightly shorter shorthand `@`. `@this.toggle('visible')` and `@.toggle('visible')` are equivalent.

Given that there is a `subtract` method in the Ractive.js API, can you add a decrement button to the example as well?

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++QDvXDA2AFkELmCOKIBlYldifhRIkLsvSN80gJ8-L2zcJFzAwOBgAGIAd2Jg8kUEDAws4pLgADpRAHsK4Qam5u9nAFdcXA7+NgBqLiGRsaLm0s4q4N7PYsjCvqDNtYXy5bByYXiVRJRV-37yUvaunsbd-oIZ0fGpzhe5rYDFg4u87ycArzDK5SIuNweLhiCTSNggHDCeCkJjkcyWazkajkfgICrkABKFispAQAApgAIAggVJByAByMpOZgIXD0rBUrRKVTqBB0xkKZRqBTszlIdQMOmU-gBex1KXkTrdOkABnI2CaxwSSQVSuEqvVnIeGAAlABuBEgUTwTBAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++QDvXDA2AFkELmCOKIBlYldifhRIkLsvSN80gJ8-L2zcJFzAwOBgAGIAd2Jg8kUEDAws4pLgADpRAHsK4Qam5u9nAFdcXA7+cjGAWlEVYlEAawMAAU7+BRNWhiQkAApyAHJ2ruF98gBKdgBqLiGRsY5nGE4i-oHh0fGpmbnF+hWx9a4VrCBC4PaHTrdfZYcgABnO7AAkvsVCpasRhMJyNoOoMYZDhDd3vc+i1OFVgr1PMVIoVSY46dTmqVKtUwORhPFZkkqf5XqUjt1eXlmgRbh8JvxprMFstVoDNttwYKTgiQGxrpxxfcxU8Xv0xcTPlLvrK-vLjECQWCDiroXC1WwABIMMAAQnIAE1ceQVB1hDIcYMYOQCUS7vx9WSKWBhTTOAUXhlcpEXG4PFwxBJpGwQDhhPBSExyOZLNZyNRyPwEBVyAAlCxWUgIHbAAQBBAqSAHMpOZig6HtrRKVTqBDd-a9kdqBSD8bkJDqBjdtvz+x1Feh47d+HYJqchJJTcEnfkRrz88YM4AbjzIFE8EwQA">Fix Code</button>
</div>

To further wangle our incrementer contrivance, suppose we devised a web version of the old traveling game wherein you collect all of the cows that you pass on your side of the car. So we'll need two objects, one for `me` and one for my `sibling`. Each person will have a poroperty, `cows`, which is an integer representing accumulated bovine beasts.

```js
{
  me: { cows: 0 },
  sibling: { cows: 0 }
}
```

The template for this game will include a `table` containing counts for each person and buttons to increment each person's taurine total.

```handlebars
<table>
  <tr>
    <th>Me</th><th>Sibling</th>
  </tr>
  <tr>
    <td>
      {{#with me}}
        {{.cows}}
        <button>+</button>
      {{/with}}
    </td>
    <td>
      {{#with sibling}}
        {{.cows}}
        <button>+</button>
      {{/with}}
    </td>
  </tr>
</table>
```

The event listeners _could_ use the full path to the appropriate `cows` property, which is not too large an imposition here, but with a deeper context, it would quickly become inconvenient. They could also do some keypath manipulation using the special reference `@keypath`, which resolves to the keypath to the current context at any point in the template. That's a bit painful in most contexts and impossible in others. To address this particular issue, Ractive.js provides a special `@context` reference that acts as an API adaptor that is rooted in the current context of the template. `@context` objects have most of the same API methods as a Ractive.js instance, but they can resolve relative keypaths. Add this event directive to each of the buttons to see it in action:

```handlebars
<button on-click="@context.add( '.cows' )">+</button>
```

To complete the rules of the game, when you pass a cemetery on your side of the car, you lose all of your cows. It's a weird game, I know, but I didn't make it up. What would be the easiest way to reset a person's cow count?

## Step 4
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEysg7nOiA1ghiaA9vwC0ij4ArsJKPqT69AACAHRhuAAUwORGkOTRCJH8uLGiKsQIOQAaWOTa6ZnZufmFOQCa5BgAlL4BtR4Gon7CPioIsSo+KIkABgBmxBL8KOTq5IkAJMBVRTUFa8XY5MurOXkbDS0AhKOtIHyCMgvAwEYY27faD61XXDyX9nYOxPySwTJSAwVMEoogjAxlP02v5xj5RKEDNF+D4kAMwv1LIlzuROJcuGIJNI2CAcMJ4ECYOQ3FZIuRqOR+AgAO7kABKFlpCGSAnI5AQKnSAHIAMS4JgsIVYXlaJSqdQIYViuVqBRCgQtADcpJAongYrcnipwG+zKouDA6QAHAAGUjMzXfMAIYgoMC4a12sCOq4AIws7hQMBC-CQ-m6Qxg6RFCFjPowmCAA">Start</button>
</div>

Suppose you need to track the mouse cursor as it moves across a `div` for... reasons. Perhaps you've landed the contract for the frontend of a missile targeting system. Ractive.js provides access to the DOM event object in event directive expressions as the special `@event` reference. Any properties and methods available on the event object passed to the `addEventListener` callback are available from the `@event` reference e.g. `@event.clientX`.

```handlebars
<div id="tracker" on-mousemove="@.set({ x: @event.clientX, y: @event.clientY })" on-click="console.log(`firing at (${@event.clientX}, ${@event.clientY})!`)">
  ({{x}}, {{y}})
</div>
```

The element on which the event directive is installed is also available within event directive expressions as the special `@node` reference. Like the `@event` reference, you can access any properties or methods of the DOM element or even pass it as an argument to another function using `@node`.

```handlebars
<input value="example" on-focus="@node.select()" />
```

> If you need to cancel an event by calling `stopPropagation`, you can simply make `false` the last expression in your event directive expression list.
>
    <a href="/nope" on-click="doSomething(), false">This will do something rather than /nope.</a>
>

## Step 5
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb82AQUtl1CACEXC5unnz8XGIS0mwgOMLwpEzk5n6kCOTU5PwIAO7kAEoWVhkAFMB2bkwskOQA5ADEuDUIuPVYVQrKagp1Td2qAfUCGACUANzxIKLwmEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYAAgB0AGbEMAgAFOQA5BZWpOoIieQAlOwAgpZk6QCEXC5unnz8XGIS0mwgOMLwaTDk5gWkCOTU5PwIAO7kAEop1nHAdm5MLJBJAMS40wi4iViTCspqCrOJC0qq6YkCGFkA3Hb87akI4Z4JyR2HWOSRzvwFnuQJop4KJtnkCaCUyccgAA1wYGIwjBlGEWjAXSu1ko-GEi3eNi85E4oLBP34f1wsOh5AY5AJRO8jgAVghLAJyDjQQx+NoyUgSFZPAwVOQEJ1CWTmM5FAhCfD+u5nCokC93CoVO5BvjfsZic9iJFyMJnJJVMRkIyySoEDBcPd8ql1MR+Cgipkzsczg0QKJ4JggA">Fix Code</button>
</div>

Ractive.js also provides its own instance-level event system, so that you can raise and respond to internal events in a more abstract way. You can name your events however you like, so you can convey more meaning about the intent of the action that triggered the event, such as `addUser` as opposed to `click`.

To listen to an event, you attach an event listener to your Ractive.js instance with the `on` method.

```js
ractive.on( 'activate', function ( context ) {
  // `this` is the ractive instance
  // `context` is a context object
  // any additional event arguments would follow `context`, if supplied
  alert( 'Activating!' );
});
```

To raise an event, you pass the event name and optional context and arguments to the `fire` method.

```js
// this will trigger the 
ractive.fire( 'activate' );
```

Update the template and JavaScript to fire and handle an instance event, then execute. Remember, you can access the current Ractive.js instance with the `@this` special reference or `@` shorthand.

> A Ractive.js instance doesn't need to be rendered to update data or fire and handle events.

## Step 6
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYAAgB0AGbEMAgAFOQA5BZWpOoIieQAlOwAgpZk6QCEXC5unnz8XGIS0mwgOMLwaTDk5gWkCOTU5PwIAO7kAEop1nHAdm5MLJBJAMS40wi4iViTCspqCrOJC0qq6YkCGFkA3Hb87akI4Z4JyR2HWOSRzvwFnuQJop4KJtnkCaCRYqBAwXD3fKpdTEfgoIqZM7HM4NECieCYIA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYAAgB0AGbEMAgAFOQA5BZWpOoIieQAlOwAgpZk6QCEXC5unnyCDmUeXr7+gSH0EdGxCYlICCmFCpk5IGwAIl0FaQolnDUVQpxiEtJsIDjC8Gkw5OajCOTU5PwIAO7kAErdpPHAdm5MLJBJAMS4Nwi4iVhXCspqCneJj0qqdKJAQYLIAbjs-E2qQQ4U8cUuVTO6TukWc-AK8Ky5GA5AYKgQMFw7XyqXUxH4KCKiXB5GwV06yJ+5DRGKsWJxeIJRPawyZFKpNLBdJB4KWIFE8EwQA">Fix Code</button>
</div>

You can subscribe to multiple instance events in one go:

```js
ractive.on({
  activate: function () {
    alert( 'Activating!' );
  },
  deactivate: function () {
    alert( 'Deactivating!' );
  }
});
```

Add a 'deactivate' button and wire it up.

## Step 7
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYA2gDkFlak6gjhWOTOwggwALrsAIKWZLEAhFwubp58-FxiEtJsIDjC8DEw5ObZpAjk1OT8CADu5ABKUdYAFMB2bkwskOThAMS44wi48aMKymoKkzMrqrFLgrhI6gyTI3v2SSnHo-b2-AyKCBsAUu5xV7gYox-8GACUANx2fhNaIIAB0nkGUwGMQU8XIADNnPxshDyJYjAlzg0fuQTvYGCoUrhIeEstF1MR+CgpuQANSJZIwUG3e50qa5cLkf4CX5-aogUTwTBAA">Start</button>
</div>

Converting a DOM event into an instance event is a terribly convenient way to handle user actions in a meaningful way. The signature of the `fire` method is a little cumbersome to include all over your template, especially if you need to pass the `@context` and a few additional arguments. To address that, Ractive.js provides a convenient shorthand method for firing and instance event from an event directive. If there is only one expression in the event directive arguments, that expression returns an array, and that array has a string as the first member, the event directive will fire an internal event with the first array element as the name, the current `@context` as the context, and any remaining members of the array as event arguments. This is generally referred to as a "proxy event".

```handlebars
<button on-click="['activate', user]">Activate!</button>
<!-- which is a bit more convenient than -->
<button on-click="@this.fire('activate', @context, user)">Activate!</button>
```

> Depending on your editor and personal tastes, it might be convenient to use an unquoted attribute for your proxied events: `<button on-click=['activate', user]>Activate!</button>`. There is nothing special going on there - Ractive.js supports just about everything that HTML does, and HTML supports unquoted attributes e.g. `<input value=green />`.

As with regular event expressions, if a handler for a proxied event returns `false`, it will cancel the event.

## Step 8
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYA2gDkFlak6gjhALrsAIKWZLEAhFwubp58gg7ZHl6+-oEh9BFICFFpCgnsACLVqTEKmZyFuUKcYhLSbCA4wvAxMOTmLQjk1OT8CADu5ABKNaQIABTAdm5MLJDk4QDEuLsIuOFY2wrKagr7R9eqseECGACUANx2-BPRCAB0nk221WsX2ADNnPxUp5yOs3uQtvl7AwVAgYLh1gcUtF1MR+Ch0uFPttsNsqqC7uRIdCrLD4Yjtii0RiseEmpT8YTiV98hhXp9BiBRPBMEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEARgFdcuAPb9yngLSiVxKIA1gYA2gDkFlak6gjhALrsAIKWZLEAhFwubp58gg7ZHl6+-oEh9BFICFFpCgnsACLVqTEKmZyFuXYFrkXe-H4BwWHhHigoKnGJIGzAwOTCxJP8osjkAPzk4QBKCMLOigjp4eSQWwDKSwgrRycYGFm9XflOT8UDpcMV4cIekvUzc5-dqdfh5LhiCTSNggHDCeAxGDkcwtBDkajkfgIADu5G2NVICAAFMBurgmCwzuEAMTk5gIXDhLBkpSqWJU2mstR1AQYACUAG47PxEeQAr9rggkRiUdEEAA6Twk7oE9nkABmzhWVk85CJfPIpPy9gYkxguCJWxS0XUxH4KGOgu62G6VVVCjOmu1xF1+sN3RNZotWya7rtDvCTvyLvyv3ckk9WtSvoNRvsgalwfCADl3ORFO4YGjTZnhMdyFH07hxQosTB5aIGDcVPqhdHeZX+LLrIr+Mr8mMJghE96U-7jVZ1XqxcQJXX5bPLstVkg-amA6xq7Pa1L5UX9odWxv7LgwLP5cIGZaflcbkgmRrTZeK22qxhyAgVM+05v7DXJfWizLsSla-m4Z7CBeV5bEB1wrg+uAwM4aKgfYGDOh2AqwiAojwJgQA">Fix Code</button>
</div>

There are a couple of ways to unsubscribe from events. If you've used jQuery, you'll be used to this syntax:

```js
ractive.on( 'select', selectHandler );

// later...
ractive.off( 'select', selectHandler );
```

That's fine, as long as you stored a reference to selectHandler (i.e. you didn't just use an anonymous function). If you didn't, you can also do this:

```js
// remove ALL 'select' handlers
ractive.off( 'select' );

// remove all handlers of ANY type
ractive.off();
```

Alternatively, you can do this:

```js
var listener = ractive.on( 'select', selectHandler );

var otherListeners = ractive.on({
  activate: function () { alert( 'Activating' ); },
  deactivate: function () { alert( 'Deactivating!' ); }
});

// later...
listener.cancel();
otherListeners.cancel();
```

Try adding a 'stop' button which removes the 'activate' and 'deactivate' handlers.

You can also temporarily disable an event handler or set of event handlers by calling `silence` on the handle returned by `on`. You can resume processing of the handler or handlers by calling the conveniently named `resume` method on the handle.

```js
var listener = ractive.on({
  'select', function () { alert( 'Selected!' ); },
  'delete', function () { alert( 'Deleted!' ); }
});

// later...
listener.silence();

// no alerts here
ractive.fire( 'select' );
ractive.fire( 'delete' );

// later...
listener.resume();

// alert here
ractive.fire( 'select' );
```

Try adding a silence button that checks to see if the listener is silenced using the handle's `isSilenced` method, and silences or resumes it as appropriate.

> If you remove your ractive from the DOM with `ractive.teardown()`, any event handlers will be automatically cleaned up.

## Step 9
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABETCQLwA6IA9GwK4B2lA1igB0JAPYBbNjACGJXOQBuCALQJF3XESW4plVgD4CbUhWp7m3cwSQKa5JCzxSYaXPsPX5Zi92JkqtOwdcBDFKABspYNYaXABPSgQghAAPXEkZOUV9c2ZcAgAjTlxcEW4aUqUSMPISPgcAbQByDIVIhEaAXX0AQVlW4IBCQ0Li0q9cgqKSsoqqmrrWJqQEFvk2zv0AERW+tcHhqbGcvJHp8u5K6tqGxpKUFDD2rpA9YGA6ckfuEmQaAH4aI0AEoIIicMQIAaNGiQQEAZU+CG+kOhGAwB1G3HGJ0OMwuc2ui0aRBKlA2LzhpKGbFORx8Rj8phAOCI8DWMBo0l2CBojBo3AQAHcaEDVggABTAY7aZwIXCwxoAYhlLkaWGlIXCbQVys1EWCjXMGAAlABuHLcdk0aokpEIDl8rmZBCCUqS46rbU0ABmPD6pRo4uNNClFlc2keMFw4sBvUykXI3BQULNx2wx2WnuCsN93zkAaDIeOuSkkejgO2WcTycaqbD6bDJJElBzfvzZULodyJbLMcaADkRDQxCIYDzS-aNFCaHXu7gbcEBTBhFJkWEg+b60bZ9wnQoXW6u6N7o9W3nyAXg0fcuRvYHreRbUvBI+EV8fkhC1fi+GF3bl2OYIQhuP65LgYCPoIRByn2RCIsiSBqj6pbQTOm5zhgNAIGEqHXr+j6LvaUHwT8IFhnO4GQdB5bEiRyBIbgMCcDys7hhgabbqazIgCQ8CYEAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwDOAxjAJYAOuABETCQLwA6IA9GwK4B2lA1igB0JAPYBbNjACGJXOQBuCALQJF3XESW4plVgD4CbUhWp7m3cwSQKa5JCzxSYaXPsPX5Zi92JkqtOwdcBDFKABspYNYaXABPSgQghAAPXEkZOUV9c2ZcAgAjTlxcEW4aUq0dBwBtAHIMhUiEWoBdfQBBWUbggEJDQuLSr1yCopKyiu1KGtqkBAb5Jtb9ABF5rsXe-rGhnLyB8fLuSunWOpKUFDDmtpA9YGA6cmvuEmQaAH4aWoAlBCJOGIED1ajRIN8AMrPBCvYGgjAYbaDbjDfY7CbHKYzIglSjLO4Q3F9NgHXY+Ix+UwgHBEeCLGA0aQbBA0Rg0bgIADuNB+CwQAApgHttM4ELhwbUAMQily1LDCkLhJoS6WKiLBWrmDAASgA3DluPSaGFyDiYQgGWymZkEIJSoK9gtlTQAGY8LqlGj87U0IUWVzaa4wXD876dTKRcjcFAgvV7bB7OZO4Lgt2vOSe72+va5KRBkPfNbJqMx2px-0J-04kSUVPujNlLN+3K5-Oh2oAORENDEIhgLLzFo0IJo5ZbuBNZo5MGEUlhYW9+orWrH3GtClt9ubg0u1zr6fImZ929y5BdXuNpuC08EpqhLzeSCzx5zAcn14tgn7AKBi9fuVwMBTUEIgxXbIhoVhJA5VdPNQNHJdxwwGgEDCeCTzfK9zRnCCHwFMcAwAoCiBAsDvlwmFHxg3AYE4FkCNyDB4xXXVqRAEh4EwIA">Fix Code</button>
</div>

It's possible to define custom template events in Ractive.js. You use them just like normal events:

```handlebars
<button on-tap='activate'>Activate!</button>
```

Note that we're using on-tap here instead of `on-click` – `tap` is a custom event.

> Custom events are distributed as plugins, which can be downloaded from here to include in your project.
>
> You can also create your own plugins – just follow the instructions on the docs.

The trouble with `click` is that it's nonsense. If you put your mouse down on the 'activate' button, waggle it about, then lift your finger up after a few seconds, the browser will in most cases consider it a 'click'. I don't. Do you?

Furthermore, if your interface needs to work on touch devices, using `click` means a 300ms delay between the `touchstart`-`touchend` sequence event and the simulated `mousedown`-`mouseup`-`click` sequence.

The tap event corrects for both of these anomalies. Try replacing the click proxies in the template.
