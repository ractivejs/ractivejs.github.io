# Ractive.transitions

This is a set of globally-available (i.e, shared between all Ractive instances) [transition functions](transitions.md). If an element with a specified `intro` or `outro` is added or removed, Ractive will first try to find the transition function on [ractive.transitions](ractive-transitions-instance.md) - if it fails, it will then look in `Ractive.transitions`.

A few standard transition plugins have been created and can be found on the [Plugins page](Plugins.md#-a-href-transitions-transitions-a-).

You can add your own transitions - they should adhere to the [transition API](transitions.md#creating-transitions).
