# Special references

Special references are template keywords that act like data references but do not actually exist in your data. These references provide metadata regarding the current instance, context, environment, operation and more.

## `this`

The current data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1s7ajJ4ADNxUP8Iu0kVQkJZIRUnZwAJB2RxagB1cRhkDwBCXwTEqNj48MSklLSMrIAVMBVqAEdEMmIBalcYcQB3W1iADyqGxtq46jDGxuTU9MyXACtESQ5qcVUYamxO6mRZAC8vag9xIRnlmpiFpcfE1ZaN5w6gwmpZVDUWLIASEZzVR5oCGJKGzOywmEJTAJbAqXbnVFOAAGEPwHmU6hG4mwoWA1AAUgBlADyADkRIRsOR4EIyNEvBYTmRCABKahoNBafFKdQQ4DAADEkWe-IRjTxBPm1AAjKSKTT6Yzmaz2ZywNy+QKhQToYtJdLYrLTXYFSKlQAmNVUukMplRHUcrm82XGkXWs1SpUC-024XqJUAZidGtd2rZnv13qNXDDIYDFoKwbhj1t4ZlABZoy6te743qDT6Uybs4lxVws286w3Gk25XZWwksX54GgeQBuEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    info: {
      message: 'Hello World!',
      info: {
        message: 'The quick brown fox',
        info: {
          message: 'jumps over the lazy dog',
          info: {
            message: 'Thats all folks'
          }
        }
      }
    }
  },
  template: `
    <div>root: {{ JSON.stringify(this) }}</div>
    {{# info }}
      <div>info 1: {{ JSON.stringify(this) }}</div>
      {{# info }}
        <div>info 2: {{ JSON.stringify(this) }}</div>
        {{# info }}
          <div>info 3: {{ JSON.stringify(this) }}</div>
          {{# info }}
            <div>info 4: {{ JSON.stringify(this) }}</div>
          {{/}}
        {{/}}
      {{/}}
    {{/}}
  `,
});

// info 1: {"info":{"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}}
// info 2: {"message":"Hello World!","info":{"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}}
// info 3: {"message":"The quick brown fox","info":{"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}}
// info 4: {"message":"jumps over the lazy dog","info":{"message":"Thats all folks"}}
// info 5: {"message":"Thats all folks"}
```

## `@this`

The current Ractive instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3jVqK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tqJmwJPmwnAEZ-akxE7BVJCmQglScAA0TI-A9ldQBhcRjQ4Gpo+Bo0NC0ipXV87HxXRDZxW2wvChVmEA6u+BZqboBaYmQyYgFBgAFsMDJCEVkPDwtnGuxnAEoNAEl4UjSVWq1h7G6W8Lt2zpuevoGWa+6xyenZ+ZYllZrSReACyKmWngshxA6gAMuIhNVypcuB94Hc7Dk-OFgWCIVt9mE7JEJPBCOJkCoRMgERYcsREDAYBcaLtqKtqAASYDLVYiITg7a7A5oHL7ADciTQNjQEpAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    count: 1
  },
  template: `
    <div>Count: {{ count }}</div>
    <button type="button" on-click="@this.add('count')">Increment</button>
    <button type="button" on-click="@this.myMethod()">Log count</button>
  `,
  myMethod(){
    console.log(`current count is ${this.get('count')}`);
  }
});
```

## `@index`

The current iteration index of the containing repeated section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAAC5PAC1AAeVmjM2IRCaswAEuQAhMwAklyG6fZ+vePlAPRVlNVadsArOcRgRVqp8GgAlADcIFikeOXYxDDkcaT9MMQAvAzgpKRxaisrRDwOIAawA5gA6Yh8QwrGAkCg0L7VVb3R7PaogNBAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

For objects, `@index` is still the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzIUFzAAC5PAC1AAeCWjM2IRCaszdpGDk2KP1APRNlM0aWgXLJcRgVRp58GgAlADcIFikePXYxDDkaaTjMMQAvAzgpKRpasvLiHgaQA1gBzAB0xD4lmWMBIFBon2aKzuDyezRAaCAA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User #{{ @index }} says: {{ this }}</div>
    {{/each}}
  `
});

// User #0 says: Hi! I am bob!
// User #1 says: Hi! I am alice!
// User #2 says: Hi! I am eve!
```

## `@key`

The current key name of the containing object iteration section.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGyzxChqX49OXABLkAhMwCSzQgFtmOo6I2sthZOWLU9hk+asWXbu2LyjqTUNB7GZhbWodR2DsxoGpgaIZYADshS7swABvHAwADE1CRgisqqaInwWgrMADwCVAB8AKoVzAXMAAIA1tRCCWjM2IRCap3AzKRg5NhD9QD0TZTNGloFiyXEYFUaefBoAJQA3CBYpHj12MQw5GmkIzDEALwM4KSkaWqLi4jwaV6AHMAHTEPiWRYwEgUGjvZpLG53B7NEBoIA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: {
      bob: 'Hi! I am bob!',
      alice: 'Hi! I am alice!',
      eve: 'Hi! I am eve!'
    }
  },
  template: `
    {{#each users}}
      <div>User {{ @key }} says: {{ this }}</div>
    {{/each}}
  `
});

// User bob says: Hi! I am bob!
// User alice says: Hi! I am alice!
// User eve says: Hi! I am eve!
```

For arrays, `@key`'s value will be the iteration index.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNE2ajGycA2uIUNSwZvEIBbap158eXZpi2sdeg8dOFk5YtUvX5t3fqMnu1DQeYl7MALpanqyk1IYADshS-gAGNszAwADE1CRgisqqaGhMOgrMADwCVAB8AKoFzJkZzAACANbUQlZozNiEQmrMABLkAITMAJJchun2ft2j5QD0VZTVWnbASznEYEVaqfBoAJQA3CBYpHjl2MQw5HGkvTDEALwM4KSkcWpLS4jwOJtADmADpiHxDEsYCQKDQPtVlrd7o9qiA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    users: [
      { name: 'bob' },
      { name: 'alice' },
      { name: 'eve' },
    ]
  },
  template: `
    {{#each users}}
      <div>User #{{ @key }} says: Hi! I'm {{ name }}!</div>
    {{/each}}
  `
});

// User #0 says: Hi! I'm bob!
// User #1 says: Hi! I'm alice!
// User #2 says: Hi! I'm eve!
```

## `@keypath`

The keypath to the current data context relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEBJZXsMGo0NC1ZpXVO4GAAYmpo2qPOuxm5xeXV9a2dt-3D465T849OyXG5JGC-R4JZ5nV57NbUS6fXarX4nOaQ4HXajZCFAhJPAGw94IjbbZE-I5os4Y7CXLgPPF0hkZJl9bBTeBoACUAG4QGggA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @keypath }}</div>
    {{# foo }}
      <div>Keypath: {{ @keypath }}</div>
      {{# bar }}
        <div>Keypath: {{ @keypath }}</div>
        {{# baz }}
          <div>Keypath: {{ @keypath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, the keypath will remain relative to the instance.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTHjY+LR0jGq2FUkKZCSVVIADBvjgYABiakKS6jQ0bvzsfHDldQBlCJUYcuBqeFlJL1GtaaV1cfipmZc3D3bqXuoNk88RtG2Z-cmd9QBpFQBPCiSwZeoAAQEHy+2DAt3uu3GvS4owaXXgtQA3NV4H5zCpog0VMhUgByABG4nC7xx9TyiWS5XGklkZGx50ehQJwUpeSqEyu7k8nGoAG1cmyBdg1htcQS8STHmyOadcQAJMjUWTIMjEFQAQhxkuwmH5E0FwrO+PE4tJgqlrk5hvl1BUqg1WrQAF1HmNWdqGpU8mFmq0wp1If1LjTkCJGeJgiJpVzbo98MdLYNiuJmCALiCyIQYyBqFw9nq3VCYXk4bUQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @keypath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: info
// Sender: bob
// Message: Hi eve!
// Keypath: info
```

## `@rootpath`

The keypath to the current data context relative to the originating instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtUAKYE3hNsK5JGoByAEbiAJgE9nGG3Y9ZbFkna1tsOwAzcXFQ-wiE11kYOPC7dOwkgC9UjLzsSRVCQlkhFSdnMAdkcWoAd3EYZA9nePy0NoSOtOxuu0x4+0kKZCDy6gADTvwPZXUAaRUvCiCwUOBqAAEYGPZV6jQ0LVmldU7gYABiamjaw867GbnF5dX1rZ3xPewwA6OuE5nHp2C7XJIwP4PBJPU4vFY-d7bXbw36HY5zKEgq7UbKQ4EJR6AuFvagXD7I-ZogEY-FYrj3fEXel9BJMhl2KbwNAASgA3CA0EA"></div>

```js
Ractive({
  el: 'body',
  data: {
    foo: {
      bar: {
        baz: {
          message: 'hello world'
        }
      }
    }
  },
  template: `
    <div>Keypath: {{ @rootpath }}</div>
    {{# foo }}
      <div>Keypath: {{ @rootpath }}</div>
      {{# bar }}
        <div>Keypath: {{ @rootpath }}</div>
        {{# baz }}
          <div>Keypath: {{ @rootpath }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// Keypath:
// Keypath: foo
// Keypath: foo.bar
// Keypath: foo.bar.baz
```

If the keypath is a mapping, it will be adjusted relative to the originating instance's root data context. This is what primarily sets `@rootpath` apart from `@keypath`.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwAleYtVipFcfBXxshEQFkVhQrKErqDaqYXKVERUAD2w7ABMACmAmeCZscNlsWUhqSIBKb3U0mLjseLJ4ADNxalTgTFj4tHSMKrYVSQpkJJVUgAN6+OBgAGJqQpLqNDQu-Ox8cOV1AGUIlRhy4Gp4WUkvEa0ppXUx+MnplzcPNuoe6nXjz2G0Lem9ie31AGkVAE8KJLAl6gABGHE4nYXxudx2Yx6XBG9U68BqAG4qvA-OYVNF6ipkKkAOQAI3E4Te2LqeUSyXKY0ksjIWLOD0K+OCFLy8VZ2Eu7k8nGoAG1cmyBdhVuscfjccSHmyOSccQAJMjUWTIMjEFQAQmxkuwmH540FwtOePE4pJgqlrk5hvl1BUqg1WrQAF0HqMWdr6pU8mEmi0wh0IX0LtTkCIGeJgiJpVybg98EdLQNiuJmCBztgwGRCDGQNQuLs3ZDoXlYQiQGggA"></div>

```js
Ractive.components.Message = Ractive.extend({
  data: () => ({
    info : {},
  }),
  template: `
    {{# info }}
      <div>Sender: {{ name }}</div>
      <div>Message: {{ message }}</div>
      <div>Keypath: {{ @rootpath }}</div>
    {{/}}
  `
});

Ractive({
  el: 'body',
  data: {
    mail: {
      inbox: {
        messages: [{
          name: 'bob',
          message: 'Hi alice!'
        },{
          name: 'bob',
          message: 'Hi eve!'
        }]
      }
    }
  },
  template: `
    {{# mail.inbox.messages }}
      <Message info="{{ this }}" />
    {{/}}
  `
});

// Sender: bob
// Message: Hi alice!
// Keypath: mail.inbox.messages.0
// Sender: bob
// Message: Hi eve!
// Keypath: mail.inbox.messages.1
```

## `@global`

The global object of the current environment. For browsers, it references the `window` object. For Node.js, it references the `global` object.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQBcogDwDOAxjAJYAO2ABITMQLwA6422FhkA9F4vBQGsA5gDpiAewC2XGAENi2MgDcApiwB8+LiXJV1ILITwB3MvAAm44yMkrChWUJXUG1AOQAJFanHUA6uIwyOYAhG5M8BEASvKKqgAUwBFM2N6Q7gBG4uYAnm4YyWwqkhTIsqnpAAaFKcDA1AACQsjiGbLINnYOTtRoaIXV8GgAlADcIGhAA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
    {{ @global.message }}
  `
});

// Hello World!
```

Ractive can automatically update properties on `@global` via two-way binding. However, for changes caused externally, [`ractive.update()`](./instance-methods#ractiveupdate) must be called to re-render the UI.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogO4CW8AJgPb4B0AtgKbbYCGA5rQAQC8bA5ABK2oybAOpkYyEgEJuAHXhyASowDGAF0IA3WgApgctmwGQeAIzIkAntwz62q2tQAOyRveMADWzNXBgbAALMyGQmjMg09EysbGhotgYAPMSOiKp2Fo60HDIg9gAeqjlsGmGIWTm+AUEhYREMLOyxOQB88WwJJqmqZPDpmdkgnard8iBsPQC0ysiEygDWA-6qYITYlMHMCrQAZrQwtPDKOgCULQAyZMxs+7v7h+wlyGUJAPRDI629Bu3vPX3lgy6PSKk2mswWOSWKzWGwA4sFQshtKcQM0LldqojiqVaK9fvBPt8fkDeqoMgD8SD4FMZvNFstVpRsLRVAAxMhkABCjBg3IAXsiWgBhMCMeDRbpsHLbDlsUIwOWMPlFEiEfZqZAWPEkwnfDok-4DSljUG0iEgKGMxCOEiuHTcQII2p0eqsbgo5pCs12ITW232bXDHqfNoJMjIXVEhIzT3enLo647PYHI7Yp60IpikhsYJkOZsVx2MDsZQ9bDh3EvGNtRIxr3gqUgBOYsJpsqZ0g5jn5wvLEtliuvatfKN10Xi9h9tjJVJt9hZxOZQvYeyObBsACMBc7ACYh4RI3q63GQCKxRKhNwZUJ5Yq+dw2Kr1apNTl94fawetku0ivaGvN23bMdyAth4DIdRU2WZdV0A-BGHXcC0kYeD9nGbYi3YJ9aDUNhlHHVh3xrdpjwbHJ63mH02D9O03yrA9iOjL9-1oGD-3XLcFxAhckNmSdRTSMxljYP8AJ5dhwPwAtUMrYcoxecNdXcGwvg2LZbhTE49BHPCB2QWh1kubQGTWVhVG0B0W3CF0olod1Ti+TBbDhJ0kWObSiVLeBy30wzmG0IhSAoOpbOOABuWwnK+Zk2Q5bleSVZEPO+QLyCoGyGk4Rtr0VBVQmVEBIrkNBwpALBVDwBJsGUGBCEcX8YGUAYwGGNdIBeF5EHgRw5mYShS2oF4YBUdQtBaV5qtq+rmhANAgA"></div>

```js
window.message = 'Hello World!'

Ractive({
  el: 'body',
  template: `
  	{{ @global.message }}
    <input type="text" value="{{ @global.message }}">
    <button type="button" on-click="@this.logReference()">Log reference value</button>
    <button type="button" on-click="@this.logGlobal()">Log global value</button>
    <button type="button" on-click="@this.setFooBarBaz()">Change to "foo bar baz" directly</button>
    <button type="button" on-click="@this.update('@global.message')">Click to update</button>

    <ol>
      <li>Click "Log reference value" and look at the console</li>
      <li>Click "Log global value" and look at the console</li>
      <li>Change the input value and repeat steps 1 and 2</li>
      <li>Click "Change to 'foo bar baz' directly"</li>
      <li>Repeat steps 1 and 2 and notice that step 1 was not aware of the direct change</li>
      <li>Click "Click to update"</li>
      <li>Repeat steps 1 and 2 and notice that both steps are now aware</li>
    </ol>
  `,
  logReference(){
    console.log(this.get('@global.message'))
  },
  logGlobal(){
    console.log(window.message);
  },
  setFooBarBaz(){
    window.message = "foo bar baz"
  }
});
```

---

## `@shared`

`@shared` is a Ractive-global model similar to `@global` but not subject to interference from outside of Ractive.

---

## `@context`

The [context object](/api/context.md) associated with the current context.

---

## `@event`

The DOM event that is triggering an event directive. This reference is only available to event directive expressions.

---

## `@node`

The DOM node associated with an event directive. This reference is only available to event directive expressions.

---

## `@local`

Special context-local storage associated with the current context. This is intended more for library use with decorators and parser transforms.
