# Debugging

## Using `Ractive.getNodeInfo()` for debugging

This is particularly useful for [decorators](../Extend/Decorators.md) and debugging. Notably, in Chrome, if you inspect an element, that element will be added to the Chrome Developer Tools' node list and can be referenced in the console as `$0`. Try inspecting a Ractive-controlled element and using `Ractive.getNodeInfo($0)` in the console.

## Adding debugger on evaluated code

