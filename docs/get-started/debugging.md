# Debugging

## Using `Ractive.getNodeInfo()` for debugging

[`Ractive.getNodeInfo()`](../api.md#ractivegetnodeinfo) is a function that allows you to grab the Ractive instance that holds a specific node. This is especially helpful together with Chrome Dev Tools' `$0` global which references the last selected element in the Element Inspector. You can simply select the element in the Element Inspector and call `Ractive.getNodeInfo($0)` in the console to inspect the Ractive instance.

## Using the `debugger` statement

Some loaders transform component files into Ractive components on the fly using `new Function`. As such, you cannot simply look for the file and put breakpoints. In situations like this, you will have to use the `debugger` statement to put breakpoints on dynamically generated code.
