# Decorators

If you've worked through the tutorials in order to this point, you may have wondered if there's some sort of hook to let you modify an element as it's created. Well, wonder no more!

Decorators are plugins, somewhat like custom events and transitions, that are attached to individual elements using a decorator directive. A decorator typically adds some sort of behavior to an element - makes it act like something - the decorator directive begins with `as-` and the decorator name.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEybAJIByReRgIGKldvL8APYyuGDqlMqBMLgM-LgAdFw8fIIOyW4eoQjkwnqixD7kPIncTnZpThnkPsKBAcE5dcSR0bEJSWX8XGIS0mwgOMLwAGYArvyWxIH8WuaiANbI5AAU9UgIWLLkAJTkwOWcnEV1wrijw8PkAO7EoWs2qeVeZzAz+4+4CkxIgVf8kOQxhMrNMVrt3vZIaYjuMfjkzhdrrcwPdyvYMOUMfwsQJSExPBYrKRstQAggruQAEqE6zLd7kLRMFgA1wAYhizAQuFcWAEDIUyjUChZ7KUqnUCB5fKKCFEUXUUWEAPp5HsuDmiyQAPVFk10qxGG2AG4BiBRPBMEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEybAJIByReRgIGKldvL8APYyuGDqlMqBMLgM-LgAdFw8fIIOPOQMwgC0uOaiANbIBq7CeqLEPlk8ruxuHqEI5KUI5T7kPIncTnZpTnUZKsKBAcFNw8SR0bEJSd38XGIS0mwgOMLwAGYArvyWxIH8WnmFSOQAFCNICFiy5ACU5MA9xBvn5ACEocTC8UFXwvctGBvr9Av9yNRHhgANw9HpfH5-BDCADaVAAuhDLghYakel5cFsYIcnnjTJxKK9tIEtuQtsJkBlyAAjYj8Ej8FDkDZRcjUomyG788gAdxpKlO-AQjNidMkSHUjW2uysBzh5PIYECIoQpAQMBuLyB+oQJRGcoVCm5Oz2BxuDXaLSi6l5IuIvnIACt6awyZwKczGrgoockNrDrFTl5xN4FKcRWAEIcHUwUACtvLFer1QomGGRfxINaVftDmcHqT7FWrK8LgjQf80UhMdRW9jAVcVAgrfWkaiMbjqxgesP+KOBKQmJ4LFY9VipSLyAAlGfWM6k8haVPdouuADEMWY3dcWAEm4UyjUCl3B6UqkVJ7PjtEzuDMGERY35HsuQsJyLv4FMgT6jhgdyDvweSzggDbIiiJRlBUKhVGQrjovEwg6F28QviovKQq4zIqFsprQqsICiPAmBAA">Fix Code</button>
</div>

Starting with something simple, let's make a decorator that tracks certain nodes to which we want a direct reference. First, here's what a decorator looks like:

```js
function tracked ( node, ...args ) {
  // do stuff with node
  // `this` is the Ractive instance
  
  // return a control handle
  return {
    // called when decorator args change
    function update () {},

    // undo stuff with node
    function teardown () {}
  }
}
```

There's not a _whole lot_ going on there. When the decorator is called, it can do whatever it needs to with the node and return a control handle that lets Ractive tell it when arguments change or tear it down when the node is being unrendered. All we need to do is take an `id` argument, create a `nodes` hash on the Ractive instance if there's not already once there, and store the `node` at the given `id`. Fill in the missing code and then add decorator directive to the second `div`.

```handlebars
<div as-tracked="'special-div'">I am the special div.</div>
```

Then throw a manual style setting at the end of the script just to show everything worked:

```js
ractive.node['special-div'].style.color = 'blue';
```

While that example is a bit contrived, you can probably see the benefit of using decorators when integrating with third party libraries that focus on adding functionality to a single node, like CodeMirror and Ace editor - in fact, the editors in the playground are handled by an Ace editor decorator.

## Step 2

// TODO: formatting decorator
