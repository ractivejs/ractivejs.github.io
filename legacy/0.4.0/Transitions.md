# Transitions


Transitions allow you to control how elements are first rendered and how they are removed from the DOM. They are added with `intro` and `outro` directives, which look like attributes within a template (but are not rendered to the DOM as attributes):

```html
<div intro='fade'>This element will fade in gradually when it renders</div>
```

This works because (or rather, if) Ractive is able to find a `fade` function on either [ractive.transitions](ractive-transitions-instance.md) (i.e. instance-specific transitions) or [Ractive.transitions](ractive-transitions-global.md) (i.e. globally-available transitions).

To start using transitions, download them from the [Plugins](Plugins.md) page.


## Creating transition plugins

See [Writing transition plugins](Writing transition plugins.md) to learn how to create your own transitions.
