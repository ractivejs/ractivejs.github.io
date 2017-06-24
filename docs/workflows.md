# Workflows

Ractive offers a lot of configuration options but does not impose any specific workflow when building apps. This allows it to be very flexible and perform  any workflow possible. Some examples are provided in this page.

## Two-way binding

In this workflow, data changes are carried out using two-way binding. Changes on bound UI elements update the bound data. Changes to data will re-render bound UI, recalculate dependent computations, execute observers, update mappings and so on.

<div data-run="true" data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoQN4BjAewDssACASXIAcBXFAYVIFt6K1yUqBeKgCUkxFAEsAbmgB0aAB7pyAEwAUwADowN5KlWWokkKpu269VdpgxIA5mmMByR1p178r8+k7J0xgAaeFlQAPOIMzFQoAJ70aPwaIOiKiVSSSAiM8YnAwJbWdmhUODiJAHxBVIFmOACUnp5klHwAIuIY9MjRbJzcvALCohLScoo8aqZu+obGk+Z6Vhg29k6OeJUeZnrenagOVZV6IcpSZbn5S4XFOCEA9CeSFVsHNfVmjRTUAIL09AMiYiksgUSgmlTIvXIPBQGFmh1oEVYHC4UN462eejaHS6PRR0I26KmBhQRhM8PYGFsTgAEmgEAhSHgqAB1UgwBDKACELmemymO18+2qUyOWN23WRfT4i2W2RA5wptmuqVuTxFoToTCRkOhF1lCXleUVypAVFVlWF5DqDTMP3o6iiSBg9hQTgARqRlNFHMVarggA"></div>

```js
const InputComponent = Ractive.extend({
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}">
  `
})

const DisplayComponent = Ractive.extend({
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <DisplayComponent message="{{ msg }}" />
    <InputComponent message="{{ msg }}" />
  `
})

App({ target: 'body' })
```

## Data in, event out

In this workflow, data is supplied to the component through mappings but data is extracted from the component via an emitted event. `ractive.fire()` is used to emit the event from the component. `twoway` is disabled to prevent data from flowing back up the tree while keeping it open to changes from up the tree.

This workflow is similar binding event handlers on DOM elements to retrieve their values (i.e. listen to `keyup` to get the `value` of an `<input>`).

<div data-run="true" data-playground="N4IgFiBcoE5SAbAhgFwKYGcUgL4BoQN4BjAewDssACASXIAcBXFAYVIFt6K1yUqBeKgCUkxFAEsAbmgB0aAB7pyAEwAUwADrkqVFAHdSepAE9IVAGZIEGNHi07lqJGc3adVdpgxIA5mjMA5AH2VPgh6JzI6GYABiE6ADwAhAC0KVQA8toA1mjGVIz0eFRo7OJ8SNpo0rxU9EgYGOLkPrpgaFTNTCgBGFSSVowdDVRIMD6MnrVpAHzxVAldzLrG9Gj8GiDoipv9g+ubwMAeXr4dODi7FCm5xoUbIAACKGDiGDLm4jBoqgFLPcVHtUeCgZCgxn5QQMEEMAJSbOZuGJ2cg4eHkLRkSh8AAib3oyGMbE43FqghEYiksgUSjUrh0+kMJjMlmsthCjnBLnmnkaZ0CARROjCbgiBNQ-iocTciWUUhmRxOfL8oRwCQA9HLJIidNK0VpMRRqABBej0ATCUQSaRyRQ8OnhAxGUwWKw2IVUMgk8ggjDcmW0BjMYlcH28D06PEYcVEjihkEhEUOJz+9weDA+QIACTQCAQpGKAHVSDAEMoksE3EndKVxdEpfMElGYyHSXxed4-A9FewM6rdurEY3UukAKr0TkdXutPTlMBtDqfGDUCGTEGjPrQoZUWaNujdVth9unLuHY7T-sgKjXf4PZ6vd42FC-aeCqgAEgAjPCr4OQnr0S0U16HUXQITQFBAgAI1IZRjACUJYVwIA"></div>

```js
const InputComponent = Ractive.extend({
  twoway: false,
  data: {
    message: ''
  },
  template: `
    <!-- On key up, emit an event passing the input's value as argument -->
    <input type="text" value="{{ message }}" on-keyup="@this.fire('input', @event.target.value)">
  `,
})

const DisplayComponent = Ractive.extend({
  twoway: false,
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  twoway: false,
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <DisplayComponent message="{{ msg }}" />

    <!-- Update msg with the first argument as value -->
    <InputComponent message="{{ msg }}" on-input="@this.set('msg', $1)" />
  `
})

App({ target: 'body' })
```

## Flux

In this workflow, UI modifications dispatch actions into an external Flux-like library. Store state changes are subscribed to and state is set to the app, propagating through mappings. `twoway` is disabled to achieve a one-way data flow.

```js
const InputComponent = Ractive.extend({
  twoway: false,
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}" on-keyup="@this.handleInput(@event.target.value)">
  `,
  handleInput(){
    dispatch({
      action: 'INPUT_CHANGED',
      value: context.event.target.value
    })
  }
})

const DisplayComponent = Ractive.extend({
  twoway: false,
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  twoway: false,
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <DisplayComponent message="{{ msg }}" />
    <InputComponent message="{{ msg }}" />
  `,
  oninit(){
    store.subscribe(() => {
      const state = store.getState()
      this.set('msg', state.msg, { deep: true })
    })
  }
})

App({ target: 'body' })
```

### Ractive as data store

A modified version of the Flux pattern is to use a standalone Ractive instance as the store. Reducers set the new state on that instance and components "symlink" the instance's data to themselves via `ractive.link()`.

```js
const Store = new Ractive({
  data: {
    msg: 'Hello, World!'
  },
})

register(function(payload) {
  switch (payload.action) {
    case 'INPUT_CHANGED':
      Store.set(msg, payload.value)
      break;
  }
})

const InputComponent = Ractive.extend({
  twoway: false,
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}" on-keyup="@this.handleInput(@event.target.value)">
  `,
  handleInput(){
    dispatch({
      action: 'INPUT_CHANGED',
      value: context.event.target.value
    })
  }
})

const DisplayComponent = Ractive.extend({
  twoway: false,
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  twoway: false,
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <DisplayComponent message="{{ Store.msg }}" />
    <InputComponent message="{{ Store.msg }}" />
  `,
  oninit(){
    // Link the root of the store's data to the Store variable.
    this.link('', 'Store', { ractive: Store })
  }
})

App({ target: 'body' })
```

## Managed and unmanaged components

By default, Ractive manages the creation and teardown of components based on the component's state and what's defined on the template. This cannot be modified during runtime and is fixed througout the lifetime of the app.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAkiQA4Cu5AwkQLZ2kIlUC8lAJQCGBcgEsAbggB0CAB7luSABTAAOjDUlKlJEPJDIldZu07KbBLlxC0RgOT2NWndmdnFHADb6ERgAbu5pQAPGL0TJTkAJ50CLxqIIoKiZQSQl4M8YnAwBZWNmiUGBiJAHxBlIGmGACU7u7EZFQAImK4dD7RrBxcPJT8wqKSMvKKJComLrr6hsaVOpbWtn6UjliVbqY6np2+AQuhSJJlufnLRSUhAPTHEhXbVe51DaZNFJQAgnR0A4Ii4iksgUSlUlWIvRI3HIuCMUzMOlojBY7E4UJ4G0eOjaHS6PTR0M2mOmegMcMObFwKAcAAkEF4vEQsJQAOpEGBeJAAQicjy2012PkUByxoS5AFpxYIlAgYLgomAEJQAEaMggAa0opC80UoAHdFdpKShKO0ojAmGBdZKHtMdLkAMRiABmFipxVKpkOOhCEqlAhlcso8gBOq1UNNzSEJAISqIrpxe26qL6VBt3tCibxKfRVCWhWyIDOxo9qWutpIh1y1xdJVedrFkulE1l8pDojDXEjFGjsa1rqRTHxqco6dFIUHKMh0POBYSRbyJbrIEo5cq1S0Ly9pm+dFUUSEMDQ5AcyqISGi9mKtUwQA"></div>

```js
const InputComponent = Ractive.extend({
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}">
  `
})

const DisplayComponent = Ractive.extend({
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <!-- Renders the block only when msg is truthy -->
    {{#if msg }}

      <!-- Renders exactly one instance of DisplayComponent -->
      <DisplayComponent message="{{ msg }}" />

    {{/if}}

    <!-- Renders exactly one instance of InputComponent -->
    <InputComponent message="{{ msg }}" />
  `
})

App({ target: 'body' })
```

Ractive also supports unmanaged components, where custom logic defines the creation, teardown, attachment and detachment of components. All components need to do is define anchors on the template, and the component can mount/unmount any component dynamically using `ractive.attachChild()` and `ractive.detachChild()`.

<div data-run="true" data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gMYD2AdrgC4AEAkiQA4Cu5AwkQLZ2kIlUC8lAJQCGBcgEsAbggB0CAB7luSABTAAOjDUlKlJEPJDIldZu07KbBLlxC0RgOT2NWndmdnFHADb6ERgAbu5pQAPGL0TJTkAJ50CLxqIIoKiZQSQl4M8YnAwBZWNmiUGBiJAHxBlIGmGACU7u7EZFQAImK4dD7RrBxcPJT8wqKSMvKKJComLrr6hsaVOpbWtn6UjliVbqY6np2+AQuhSJJlufnLRSUhAPTHEhXbVe51DaZNFJQAgnR0A4Ii4iksgUSlUlWIvRI3HIuCMUzMOlojBY7E4UJ4G0eOjaHS6PTR0M2mOmegMcMObFwKAcAAkEF4vEQsJQAOpEGBeJAAQicjy2012PkUByxoS5AFpxZQWggAGbhKyUIQkAhgdmUTjhKgARkokoe0x0IQAxEqVWqYJqeLrrgaSIcQhKpTL5VDcGbVeqrVQAEx68V24Imj0W71+22VfzEsykcJicjKWrw4LvKi4emyv7kMDtV6GyjXa6UACyyoYGS80UoBBgCF8UTACEo4QoyoIVkOqebERRkOhfyRTHxfQTyeC5ljJHjibH4-H2fa0i84QA1sp7JSUPZmRuCitt8ZKDAASMjOmvJmXqLgqVRVetJ3SB9jrihN1USO-ji9u++zwwdeE5TlOCZJocc47DmuBLqu66bgeu4XAgB55MewxSGeGbFPUgGuIc972qKhZfOQBiqma3atiqTbkEQFFthahwLtB+hkWAzA5pyyjhMiw7ouQzJ5AYMBoOQDgMeyYb2NheYIgWRasBM8ZiKQFZVqxIhgLcCBsRRLYGNRlAAEZCOmSCUKQ1YMBQ7CUIyKBiAQTFQdIRBGemMBSHBVIHrKDAquIpDKOkmQIGBuHNrKwUZFklAAGRxZQXIvj+fHQtIdBCLWPDhfmEENouGmqhxYhcSleIfvxglRFlonieaklEFq2rSQR+UYJQ9LppFyhciFsUJbo7SpZV6WZdl5C1PMEXBMx0hIDpmklWVw0VX+k3geYt75m1xTPDhD6mN8dCqDVIk6Q4RlEEg0StbUmBAA"></div>

```js
const InputComponent = Ractive.extend({
  data: {
    message: ''
  },
  template: `
    <input type="text" value="{{ message }}">
  `
})

const DisplayComponent = Ractive.extend({
  data: {
    message: '',
  },
  template: `
    <div>{{ message }}</div>
  `
})

const App = Ractive.extend({
  components: {
    InputComponent,
    DisplayComponent
  },
  data: {
    msg: 'Hello, World!'
  },
  template: `
    <!-- Defines anchor point 1 -->
    <# anchorpoint1 />

    <!-- Defines anchor point 2 -->
    <# anchorpoint2 />
  `,
  oninit(){
  	const self = this

    // Manually create the instances
    const inputComponent = InputComponent({
    	oninit(){
    		this.link('msg', 'message', { ractive: self })
    	}
    })

    const displayComponent = DisplayComponent({
    	oninit(){
    		this.link('msg', 'message', { ractive: self })
    	}
    })

    // Attach an instance to an anchor
    this.attachChild(inputComponent, { target: 'anchorpoint2' })

    // Conditionally attach/detach an instance based on custom logic
    this.observe('msg', function(value){
    	if(value && !displayComponent.parent){
		    this.attachChild(displayComponent, { target: 'anchorpoint1' })
    	} else if(!value && displayComponent.parent) {
    		this.detachChild(displayComponent)
    	}
    })
  }
})

App({ target: 'body' })
```

## Fat models

TODO
