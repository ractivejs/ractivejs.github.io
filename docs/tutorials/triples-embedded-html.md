# Triples (Embedded HTML)

Ordinarily in a template, mustaches stand in for data, which is HTML escaped for sanitary purposes. But occasionally you need to insert chunks of HTML into your view – for that, we have the triple-stache: `{{{content}}}`.

## Step 1
<div class="tutorial">
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbACphiwyh4bl+AexiKDCrkigCuwrgWYAiQ5MDAor78CskYGFxOdg5OAIL8SFpuHu7k3rgSqggh4ZGi0bHxCUkpuGnpnJn8XGIVuGwgOMLwpEzk5pbW5NQ+CADu5ABKFlakCAAUwFmRzAi4sQDkAMTbLPtYW0qq6jHkRwrKagpnWUjqDA0C5F-kickIyQcROUkig2ABlSS+GS4aLkEgAM3hCBg-1ECAA-N1gfxQftPuQMAIMABKADcmCAA">Start</button>
</div>

Try running this code:

```js
ractive.set( 'content', '<a href="http://bit.ly/QOyWC1"><img src="/gifs/image.gif"/></a>' );
```

> That was a short tutorial! When using triples, bear in mind that when their data changes, the nodes they represent must be removed from the DOM before being re-rendered and reinserted. For that reason, you shouldn't use triples where regular mustaches will do the same job – Ractive.js is able to operate more efficiently with mustaches.
