# Expressions

One problem with the last example – the population number. Printing out a number like 63230000 just looks a bit daft.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbACpgE5SQHtJAVzVXPfnJPADNyYGBRTx9+XBhtDAxKYXDgL19-YkDEgDouJyFOMQlpNhAcYXhSJnJzS2tyanJ+BAB3cgAlCytSBAAKYAFycgQVSHIAcgBiXCYWCawhrSVVdQRx6YVlfwQFpaR1BnHBoOHyKJi47Q3cN3IAVQBpPdPh9L91LP5xgDYAZgATH8AAyg4FLDACDAASgA3OUQKJ4JggA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbACpgE5SQHtJAVzVXPfnJPADNyYGBRTx9+XBhtDAxKYXDgchDPGEV1AAovX39iQIBKckSAOi4nIU4xCWk2EBxheFImcnNLa3Jqcn4EAHdyACULK1IEHOABcnIEFUhyAHIAYlwmFiWsGa0lVXUERdWFZX8ELZ2kdQZF6aDZ8iiYuO0j3DdyAFUAaQv72fyfnURX4iwAbABmABMEIADPDYdt-ulMtlcIsQjEuoFyDk+j5FORSncHg9iGE8fwCeQ2OQAIwIxnwokdBC4HwwIKU6mcelMxlE8q4TwAMWIRmQeLpLIA1MtyAAjYgqFQgpYAbh2pPJuPxhNpDKZLJgbI5XL15F5hoFxSFovFkvpsvlimVqsCGq1ZIpFoNCONps5uoAsuowOUQipPJluYSrf7SqU5VsluQ5bHyABSPnM4qa5GzE3soNUxT50kYHaV-gYPNNECieCYIA">Fix Code</button>
</div>

We could replace the number with a string, like '63.2 million'. But numbers are generally a hell of a lot easier to work with.

Instead, we can use an _expression_. Expressions look just like regular mustaches:

```handlebars
{{ format(population) }}
```

Add a `format` property alongside the country data (it may seem weird adding a function as 'data', but it will make sense in due course!):

```js
function ( num ) {
  if ( num > 1000000000 ) return ( num / 1000000000 ).toFixed( 1 ) + ' billion';
  if ( num > 1000000 ) return ( num / 1000000 ).toFixed( 1 ) + ' million';
  if ( num > 1000 ) return ( Math.floor( num / 1000 ) ) + ',' + ( num % 1000 );
  return num;
}
```

Execute the code. Doesn't that look better? Try changing the values.

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbACpgE5SQHtJAVzVXPfnJPADNyYGBRTx9+XBhtDAxKYXDgchDPGEV1AAovX39iQIBKckSAOi4nIU4xCWk2EBxheFImcnNLa3Jqcn4EAHdyACULK1IEHOABcnIEFUhyAHIAYlwmFiWsGa0lVXUERdWFZX8ELZ2kdQZF6aDZ8iiYuO0j3DdyAFUAaQv72fyfnURX4iwAbABmABMEIADPDYdt-ulMtlcIsQjEuoFyDk+j5FORSncHg9iGE8fwCeQ2OQAIwIxnwokdBC4HwwIKU6mcelMxlE8q4TwAMWIRmQeLpLIA1MtyAAjYgqFQgpYAbh2pPJuPxhNpDKZLJgbI5XL15F5hoFxSFovFkvpsvlimVqsCGq1ZIpFoNCONps5uoAsuowOUQipPJluYSrf7SqU5VsluQ5bHyABSPnM4qa5GzE3soNUxT50kYHaV-gYPNNECieCYIA" data-eval="E4QwxgLglgbgpgOgM5wgCgN4CgAEOwD2ArgHYTACeAXDgOQDCAFlCSLQDS44AOB3RAGxDQCJGgEYAzAFZxABgWKsAXwCUAbiA"></div>
```js
ractive.set({
  country: 'China',
  population: 1351000000
});
```

> Note that expressions are not part of the mustache syntax – they are specific to Ractive.js.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQawe4YH+-+8wNgAFCVEEcj0YcmBgYgVFDAwuXCC7L3tHIIBFAFcGfisdFLTPAKy2ABUAeycVEr8vFN901u8WsqbcJDZYyTCEJJSetszu3uAAR3zC+O0hznHR7x7htnICAEIAWm3yBiQkLTAI3FqGFXITmAjdxszFjoenV3chTjEJaTYQHGF4UhMcjmSzWcjUcj8BAAd3IACULFZSAgABTAATkcgIFSQcgAcgAxE5mAhcHisBitEpVOoELjCQkaQpyZSkOoGLj0fxMZj4kp6ZJiIVyNUAGbkRTEFQAaxZ3J5-WI4VxAAYAHQAFgAnBT5ZjpgUitpcQBWSkYAQYACUAG5fiBRPBMEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQawe4YH+-+8wNgAFCVEEcj0YcmBgYgVFDAwuXCC7L3tHIIBFAFcGfisdFLTPAKy2ABUAeycVEr8vFN901u8WsqbcJDZY8gAzaphFdQAKSTCEAEpyJJSetszu3uAAR3zC+O05zmXF7x6+weGxyMnyACpydYKi7XIZnb3O5saUlzcPLjEJaTYQHDCeCkJjkcyWazkajkfgIADu5AAShYrKQEKNgAJyOQECpIOQAOQAYiczAQuAJWCxWiUqnUCHxxISdIUlOpSHUDHxmP42Ox8SUjMkxEK5Gq-XIimIKgA1mzeXyJsRwviAAwAOgALABOKkK7E3TY6fEAVj1fIGQxGuHx-Vy-Ah1V5oxhuUUDxi1ItxAlLv4bvIBHIAEYPTBybkYM6Q6rVZdXe6ZgBqQmSAkAbi9fPDuEjvIJAGKCeQU-7FOrcNUAGLEIzIF0AJgemf1s2pGAEGCm6YBIFE8EwQA">Fix Code</button>
</div>

You can also use mathematical expressions. Let's rummage around in the bag of contrived examples and see what comes out... yep... this one will do... it's a shopping basket.

We have an `item` property, a `price`, and a `quantity`. Add an expression where the total should go:

```handlebars
<td>{{ price * quantity }}</td>
```

Execute the code. The total should appear. Now we just need to add a currency formatter – here's one for the UK (if you're not from here, write one for your own currency for extra credit):

```js
function ( num ) {
  if ( num < 1 ) return ( 100 * num ) + 'p';
  return '£' + num.toFixed( 2 );
}
```

Add that, and use in the template it for both the price and the total. Try changing the price and the quantity.

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQawe4YH+-+8wNgAFCVEEcj0YcmBgYgVFDAwuXCC7L3tHIIBFAFcGfisdFLTPAKy2ABUAeycVEr8vFN901u8WsqbcJDZY8gAzaphFdQAKSTCEAEpyJJSetszu3uAAR3zC+O05zmXF7x6+weGxyMnyACpydYKi7XIZnb3O5saUlzcPLjEJaTYQHDCeCkJjkcyWazkajkfgIADu5AAShYrKQEKNgAJyOQECpIOQAOQAYiczAQuAJWCxWiUqnUCHxxISdIUlOpSHUDHxmP42Ox8SUjMkxEK5Gq-XIimIKgA1mzeXyJsRwviAAwAOgALABOKkK7E3TY6fEAVj1fIGQxGuHx-Vy-Ah1V5oxhuUUDxi1ItxAlLv4bvIBHIAEYPTBybkYM6Q6rVZdXe6ZgBqQmSAkAbi9fPDuEjvIJAGKCeQU-7FOrcNUAGLEIzIF0AJgemf1s2pGAEGCm6YBIFE8EwQA" data-eval="E4QwxgLglgbgpgOgM5wgCgN4CgAEOoRwC2AXDgOQBGIAdrSOQDS44AOwUYcZADAgIwBOZngCOAV1rQIATzIB2LAF8AlAG4gA"></div>
```js
ractive.set({
  item: 'banana',
  price: 0.19,
  quantity: 7
});
```

> You might reasonably ask how this works. What happens is this: when the template is parsed, any _references_ inside expressions (such as `price`, `quantity` or `format` in the example above) are identified. At render time, the expression binds to those references and creates a function to calculate the result. (Whenever possible, Ractive.js will re-use functions – for example `{{a+b}}` and `{{c+d}}` would share the same function.)
>
> When the value of one or more of those references change, the expression is re-evaluated. If the result changes, the DOM is updated.
>
> For the super-curious, there's more information on the [docs](../../concepts/templates.md#expressions).

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbGMkhcndhz3LCdK-QDkAEYWANYoMAD2AK78SAC0opEqkTCQ5C5IANye5Hl5AO5UuGDpwMCZGBgApFnkYAjEKGC46QCMSlkBHNxkfIKsA45sEQgI-G6cHkPevtr+1MFhETFxicmp6aPjOQP5hcWl5OXb-FW19Y3NreQdil09PP32nsNBKtEIk9P2RGQ+fkCIVE4SisQSSRSaXI70+u3s+3IRSQJTKwFhCHOdQaTRa7U63S4T08rycIlwUX4KGcCGE0RUrS4vkp1Pczy8-zmCyWIJW4PWUPSzCCAApypVsMdgKcqlgpRiqgBKeEyfY4674+7dV69XhCThiCTSNggHDCeCkJgZCxWUgIcjUcj8BAFcgAJRt1jFAjyCBU6QCAGJcEwWAEsD6tEpVOovuQgwplGoFOHI0h1AwypG8pl0gAGAB0ABYAKwR-j7U75gsANja5f2GOrACZIxgBBhlaaQKJ4JggA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbGMkhcndhz3LCdK-QDkAEYWANYoMAD2AK78SAC0opEqkTCQ5C5IANye5Hl5AO5UuGDpwMCZ5ABU5ACMAAz1GBgApFnkYAjEKGC46bVKWQEc3GR8gqwTjmwRCAj8bpweU96+2v7UwWERMXGJyanps-M5E-mFxaXk5cf81XWNzW0dXT19dYPD5Fw84-ae0yCKmiCEWy3sRDIPj8gRConCUViCSSKTS5CBINO9nO5CKSBKZWAGIQ9waTVa7U63V6-U+bG+o14ngBThEuCi-BQzgQwmiKj6XF8HK57j+Xihaw2W3hOyR+1R6WYQQAFOUALLqMAAOkRcWVlRqACYAKzGgCUzSw12AGpKOt2SGVt3uJvNluttu1usdxJdpotGDNWJk5ypb1piiG9J+YyEnDEEmkbBAOGE8FITAyFispBJ1HI-AQBXIACVs9ZVQI8ggVOkAgBiXBMFgBLBVrRKVTqUHkBsKZRqBSt9tIdQMMrtvKZdL1LUAFmNbbu+VuM61ADZakvzsS14b2xgBIGsimQKJ4JggA">Fix Code</button>
</div>

In this next contrived example, we're going to make a colour mixer.

First, we want to show how much we're using of each colour. We'll use `<div>` elements with a percentage width corresponding to the amount. All the colour values are between 0 and 1, so we need to multiply by 100:

```handlebars
<div style='background-color: red;
     width: {{red*100}}%;'></div>
```

Update the first three `<div>` elements in the template accordingly.

> Pro-tip: in the playground editors, hold the `Cmd` key (or `Ctrl` if you're not on a Mac) and click in each of the places where you need to type 100. Multiple cursors FTW!

To show the result, we can use an `rgb(r,g,b)` CSS colour value. But instead of percentages, these need to be between 0 and 255:

```handlebars
<div style='background-color:
  rgb({{red   * 255}},
      {{green * 255}},
      {{blue  * 255}})'>
</div>
```

Update the template and execute the code. Did it work?

No, it didn't. That's because CSS insists that you use integers – no decimals allowed. So let's use `Math.round` to turn the numbers into integers:

```handlebars
<div style='background-color:
  rgb({{Math.round(red   * 255)}},
      {{Math.round(green * 255)}},
      {{Math.round(blue  * 255)}})'>
</div>
```

Execute the code. Ta-da! Try changing the colours.

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFJbGMkhcndhz3LCdK-QDkAEYWANYoMAD2AK78SAC0opEqkTCQ5C5IANye5Hl5AO5UuGDpwMCZ5ABU5ACMAAz1GBgApFnkYAjEKGC46bVKWQEc3GR8gqwTjmwRCAj8bpweU96+2v7UwWERMXGJyanps-M5E-mFxaXk5cf81XWNzW0dXT19dYPD5Fw84-ae0yCKmiCEWy3sRDIPj8gRConCUViCSSKTS5CBINO9nO5CKSBKZWAGIQ9waTVa7U63V6-U+bG+o14ngBThEuCi-BQzgQwmiKj6XF8HK57j+Xihaw2W3hOyR+1R6WYQQAFOUALLqMAAOkRcWVlRqACYAKzGgCUzSw12AGpKOt2SGVt3uJvNluttu1usdxJdpotGDNWJk5ypb1piiG9J+YyEnDEEmkbBAOGE8FITAyFispBJ1HI-AQBXIACVs9ZVQI8ggVOkAgBiXBMFgBLBVrRKVTqUHkBsKZRqBSt9tIdQMMrtvKZdL1LUAFmNbbu+VuM61ADZakvzsS14b2xgBIGsimQKJ4JggA" data-eval="E4QwxgLglgbgpgOgM5wgCgOTDgEwwGgAIBGASgG4g"></div>
```js
ractive.set( 'red', 1 );
// PSST! Want a sneak preview of something neat?
// Try using ractive.animate() instead of ractive.set().
// You can drop it in after the line 9 in the Script content.
```

> The `Math` object is one of several built-in JavaScript objects you have direct access to within expressions, alongside `Date`, `encodeURI`, `parseInt`, `JSON` and various others. Consult the documentation for a full list. You can also access other globals using the `@global` special reference, where the `JSON` object would be accessible as `@global.JSON`.
>
> Expressions can be as simple or as complex as you like, as long as they only refer to properties of their view model (i.e. the properties on the data object), don't include assignment operators (including `+=`, `-=`, `++` and  `--`), `new`, `delete` or `void`, and don't use function literals.
