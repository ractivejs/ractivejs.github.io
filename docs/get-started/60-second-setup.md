# 60-second setup

Create a file called `index.html` and paste in the following (or just open the playground):

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDwCEAtCQAQAqYC5CANggLYIB2u5uA9uU1wK7tONcgEtWAZ1wBDVgGNaZAHwAdGCtYEkogG5ikAXhUhpAB1PGlBAPTadSkDgnxr18gEFyE0U1ONycly+XKxsHEgIAGbioriiIVgBQX4IuLQA7rFgvNIwANb8polSAJ6MEuSySORI0jJqGgBK0nJxOggAdIHBoewSHQASDPRcAOpcMPTVBuTNrbqdCAAeaaxIABTADazknMx+dQiQ5AAG27u7Wrqq6jsXl2AAjEpD9CPkwMC8CBIS0mjkDAYGxPG4ae6XcSmfgcXAlUwIIx4Za4YzkHTSej8RHGT7fX7-WhAtHWMF3S62a7nU5YalyX7HM63e5PD5JEYwY4wZCA6knWnMmp1aTHdYASnIBiU5E21N2LAJaGOAHJxpMkERldSMGLtjqANzbbaucgAWQEQlkYkkMnktC4kWEtG6phCYU4PFwIkC7Gk4gQ6luPqklXMktmLTaCE2e189EOKoIrxGaqmpOViRkMDQuBVAGIzKZlYCxfrMEA"></div>
```html
<!doctype html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset='utf-8'>
  <title>Hello World</title>

  <!-- The latest release of Ractive can always be found at https://cdn.jsdelivr.net/npm/ractive -->
  <script src='https://cdn.jsdelivr.net/npm/ractive'></script>
</head>
<body>

  <!-- The element to mount the instance -->
  <div id="app"></div>

  <script>

    // A simple component definition, complete with markup, styles and data
    Ractive.components.HelloWorld = Ractive.extend({
      template: `
        <div>
          <h1>Hello {{ message }}</h1>
          <input type="text" value="{{ message }}" />
        </div>
      `,
      css: `
        h1 { color: red }
      `,
      data: () => ({
        message: 'World!'
      })
    });

    // Mount an instance of the component to the container
    const app = Ractive({ template: '<HelloWorld/>', target: '#app' });

  </script>
</body>
</html>
```

Now, open the page in a browser. You should see a "Hello World!" greeting. Updating the input values should update the greeting. If you open the console and type `app.set('message', 'Jim')`, the text should update to "Hello Jim".

That's it - you're in business!

# Next steps

- As your app grows, you'll want to separate each component definition into its own file.

- Ractive has many ways to [register](../extend/components.md#registering) a component, as well as [tools](../integrations/tools.md) to allow you to write components depending on your setup.

- Ractive also allows for [single-file components](https://github.com/ractivejs/component-spec/blob/master/authors.md) where you define the markup, styles and logic for a single component in a single file.

- Ractive _works for you_, not the other way around. There are no set rules or conventions. Be creative.
