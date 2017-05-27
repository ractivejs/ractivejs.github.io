# Support

## Getting in touch

There are a lot of places to find help if you get stuck with Ractive:

* [StackOverflow](http://stackoverflow.com/questions/tagged/ractivejs)
* [Google Groups](http://groups.google.com/forum/#!forum/ractive-js)
* [GitHub](https://github.com/ractivejs/ractive/issues)
* [Twitter](http://twitter.com/RactiveJS)
* [Gitter](https://gitter.im/ractivejs/ractive)

## Legacy versions

The current site only documents the latest version of Ractive. Legacy versions are [currently stored in Github](https://github.com/ractivejs/ractivejs.github.io/tree/dev/legacy).

## Legacy browsers

The core Ractive library requires the following APIs need to be present:

- `Array.isArray`
- `Array.prototype.every`
- `Array.prototype.filter`
- `Array.prototype.forEach`
- `Array.prototype.indexOf`
- `Array.prototype.map`
- `Array.prototype.reduce`
- `Date.now`
- `Function.prototype.bind`
- `Node.prototype.contains`
- `Object.create`
- `Object.defineProperty`
- `Object.freeze`
- `Object.keys`
- `Promise`
- `requestAnimationFrame`
- `String.prototype.trim`
- `window.addEventListener`
- `window.getComputedStyle`

[Most _modern_ browsers already support these APIs](https://kangax.github.io/compat-table). Should you want to serve your app on older browsers, the Ractive package comes with an optional file called [`polyfills.js`](https://unpkg.com/ractive@0.9.0/polyfills.js) containing these specific polyfills. That way, you can still enjoy the full Ractive experience without lugging in a huge polyfill library. Simply load it up before Ractive.

## SVGs

Ractive doesn't mind whether you're rendering HTML or SVG - it treats both the same way. Unfortunately, some browsers (notably IE8 and below, and Android 2.3 and below) *do* care.

> This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you're trying to render SVG in an older browser. See https://github.com/RactiveJS/Ractive/wiki/SVG-and-older-browsers for more information

If your template includes SVG and these browsers throw an error along those lines, [the only winning move is not to play](http://xkcd.com/601/). You will need to provide an alternate fallback when SVG isn't supported. Ractive provides [`Ractive.svg`](../api/static-properties.md#ractivesvg) to indicate if the browser handles SVGs properly.

```js
new Ractive({
  el: 'container',
  template: Ractive.svg ? awesomeVectorGraphicsContent : highResolutionImageContent
});
```
