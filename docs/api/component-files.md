# Component files

Remember the good old days? When all CSS went in `<style>` elements in `<head>`? When all JS went in `<script>` elements just before `</body>`? When all HTML was written in Mustache inside inert `<script>` elements? When it felt good when everything just worked after a page refresh? Ractive remembers, and it's bringing those good times back with component files.

Ractive component files are simply a self-contained HTML files that define a component and contains all the markup, data, styles and logic it needs. It's also designed with dependency management in mind, allowing it to declare library and component dependencies. Best of all, component files are written in the same way regardless of the development process involved, build step or none.

## Example component file

```html
<!-- Example component file -->

<!-- Import a component named Foo from the file foo.html. -->
<link rel='ractive' href='foo.html' name='foo'>

<!-- Define the markup for this component. -->
<h1>{{ title }}</h1>

<!-- Use imported foo component -->
<p>This is an imported 'foo' component: <foo/></p>

<!-- Define the styles for this component. -->
<style>
  p { color: red; }
</style>

<!-- Define the behavior for this component. -->
<script>
const $ = require( 'jquery' );

component.exports = {
  onrender: function () {
    $('<p />').text('component rendered').insertAfter($this.find('p'));
  },
  data: {
    title: 'Hello World!'
  }
};
</script>
```

The above component file roughly translates to the following in vanilla JS:

```js
import Ractive from 'ractive';
import $ from 'jquery';
import foo from './foo.html';

export default Ractive.extend({
  components: { foo },
  onrender: function () {
    $('<p />').text('component rendered').insertAfter($this.find('p'));
  },
  data: {
    title: 'Hello World!'
  },
  template: `
    <h1>{{ title }}</h1>
    <p>This is an imported 'foo' component: <foo/></p>
  `,
  css: `
    p { color: red; }
  `
});
```

## Writing

### `<link rel="ractive">`

Top-level `<link rel="ractive">` elements define dependencies on other components. It accepts two attributes:

- `href` - The path to the required component file. Paths that start with `./` or `../` are resolved relative to the importing component file. Otherwise, resolution is loader-specific.

- `name` (optional) - The registered name of the component. This corresponds to the key used in the `components` initialization option. When not defined, the filename of the dependency will be used as the name.

The names and the loaded dependency will be assigned to the component's `components` initialization option.

### `<style>`

Top-level `<style>` elements define the styles for the component. If more than one `<style>` element is found on the component file, their contents are concatenated in the order of appearance of the `<style>` elements. Contents of these elements will be concatenated and assigned to the component's `css` initialization option.

### `<script>`

A top-level `<script>` defines the component's initialization. The script's scope has a `component` object that is similar to Node's `module` object. Initialization options for the component is expected via `component.exports`. It also has a special `require` function that fetches script dependencies. `require`'s behavior depends on the loader used. Refer to the specific loader's documentation to know more.

There can only ever be one `<script>` in a component file. Defining more than one will result in the loader throwing an error.

### Template

After yanking out top-level `<link rel="ractive">`, `<style>` or `<script>` from the component file, anything that's left becomes a part of the template. The remaining markup will be assigned to the component's `template` initialization option.

## Using

In order to use component files, you will have to use _loaders_, Head over to the [loaders](../integrations/loaders.md) page to learn more about loaders and help you choose a loader that suits your needs.
