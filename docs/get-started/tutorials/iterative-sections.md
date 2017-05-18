# Iterative Sections

Lists of data, of some form or another, are often at the heart of webapps. In this tutorial we're going to build a sortable table of superheroes, using data taken from [superherodb.com](http://www.superherodb.com).

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++QDvXDA2AGUAVz0YMAQYAHtyfgZFBC5gvy8AxxCAJQQGFUTk1M50u0ygkIioyTiAd1i0kPKs0t9ylqD2zwD7RyQOUoHOvtwBtOGe8lHxoYzW3G6+0pc3Dy4xCWk2EBxheFImcnNLayxyIxT+AG47fk5OciQEADNifgRyOPCYcmFI2IxeIIYQCS4IfjkajkADaAgCwCKKUg5AA5AA5YgoMC4cQMOpuGCo84wfIqJLItEAdQYKA+MHOAGkfrhiYEArUGjAUaiACoINy1GBOKxxfhswLvF5xHk43CSSAPOrKgB0-yiQLiSGcKtEcUUnEx2Nx5gJsU4AEYAAwAWmtAHZOKjyNh4eRERSEDyAMLaUQqOKSYQS9mkgqenkRRQpGDCc6hPW4VnnDn1WI8gDy0mIonIrgYwmT7ICUplaLlCqVqvVgNiWp1eoNvv9geElttAFYrU6XVg3R7ijycnEUOEECHi2HyYO0QBZJjEBDnACC-CSE9TXJ5y+cwjiMGc7xQ5E5sWD51LsqTlc4yrqaoB0Tr2t1+s4w9HCHbNoAHABmC0e1dSF3SRL1qTiFRSFid5xxTAIpwjNEAAl6jcJNzgAKWKc9AlPbk0TyNB6XUYgxQ3S9y2vRVb2rR9NRfRtOCpSDoIkD5vwtAA2QDnQwAQAF1bkEfgTisaCoUSBA6nIHILHEhAAApgDdJxmAQXAeQAYjUlhiVUpRVHUcDUR0wy1AUfSQKQdQGBRREayfYFhBRcFIX4-gMAASmuXYQFEeAcUUQoVM8aV+FwG0XmSYgVG0FFhAYfhhBtYQYJeYSPIEJxXE+UL7GcfdnhgVLJAsI8UStTK7mCd1ygUEwbQKLF+BRNwXlwYSCosABrFB4nCfgkBtPUAwIrSACYpq63FIP3FEtIQJbqpEsY6s8QqYGKm1CqTfUUQtSQjD+SCqHILSkEulbst+NhyAAKnW+wysuiryCtFUOyUTLMCAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++QDvXDA2AGUAVz0YMAQYAHtyfgZFBC5gvy8AxxCAJQQGFUTk1M50u0ygkIioyTiAd1i0kPKs0t9ylvJgYABifNEwcmFI2Jj4hGEMDE6s3HbPQMDHJA4GcjAYBAAzagBybuJ+Lbip3bZupJSprgYOUpWZpdwV7s2Cy4Rr+4zF2ZfgWoNGBfZ4-JZtMHdTj9MBTcppFxuDxcMQSaRsEA4YTwUhMcjmSzWLDkIwpfgAbjs-E4nHISG2hwQ5Di4RgQxG0VicQmAlJCH45Go5AA2gIAsAiilIORdgA5YgoMC4cQMOpuGC7YlvFQfaW7ADqDBQ-FixIA0qzcJrfoDYnqACoINy1GBOKxxfjWwKHY56pW4SSQGl1EMAOmGUTGcSQzlDojiik48sVyvMatinAAjAAGAC0OYA7JxduRsGKupKEHqAMLaUQqOKSYRexba3UyiKKFIwYTE0Lx3BW4kBW0wPUAeWkxFE5FcDGEQ9+lCOcT9g8DwbDEdGXJjcYTnFr9cbwizeYArNni6WsOWJe3djk4ihwggW7828U9QBZJjEBDEgAgvwSTviO9R2jKgHOMIcQwM4hwoOQo7NsSPqrjK-obpwIZ1OGHJRnu8aJk+L4IGeuYABwAMyZteZYChWD76nEKikLEjLvp+UoygAEvUbiDsSABSxSoYEo56nkaAmuY7qesO3ormuAZBjhW4EbusbEZwLFsRxJoUZmABsdEltM-AALqUoI-AElY7GCokCB1OQOQWA5CAABTAOWTjMAguB6j0-ksJqflKKo6hVjKIWRWoCjhYxSDqAw0oStunLjMI0p8gKFkYAAlOSmIgKI8BKoohS+Z4xz8LguZbMkxAqNo0rCAw-DCLmwgcVsNkWQITiuEyNX2M4cH0jAPWSBYiHStmA1UsEXTlAoJi5gUCr8NKbhbLgNnjRYADWKDxOE-BILm8YNmO5A9AATE9h3KqxcHSn0CAIEttnPKtngTTAU25hNg4JtKmaSEYQysVQ91IAjP1DWybDkAAVP99izQj83kNmobnkoA2YEAA">Fix Code</button>
</div>

We've already got an array of objects representing four of the X-Men, over there on the right. We just need to update the template.

Begin by wrapping the second `<tr>` in an `#each` section:

```handlebars
{{#each superheroes}}
  <tr>
    <!-- row content -->
  </tr>
{{/each}}
```

> As with `#with` and `#if` sections, you could just do `{{#superheroes}}...{{/superheroes}}` and it would work the same way, as long as superheroes is an array.

Then, insert mustaches representing each of the three properties in the table – `name`, `realname` and `power`. For extra credit, wrap the name in a link pointing to the info URL.

Execute the code.

```js
// You can use array notation to update the data:
ractive.set( 'superheroes[1].power', 'Martial arts' );

// Or, you can use dot notation. Whichever you prefer:
ractive.set( 'superheroes.3.power', 'Enhanced senses' );
```

> What if there weren't any items in the array? Displaying a table with no rows has been recognized by the International Web Decorum Foundation as impolite, so Ractive.js will allow you to provide alternate content using an `{{else}}` section in the `#each` block, which will be rendered if the array is empty.
>
    {{#each superheroes}}
      <tr>...</tr>
    {{else}}
      <tr><td colspan="4">Oh no! There are no superheroes!</td></tr>
    {{/each}}
>
> This also works with plain mustache sections.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++QDvXDA2AGUAVz0YMAQYAHtyfgZFBC5gvy8AxxCAJQQGFUTk1M50u0ygkIioyTiAd1i0kPKs0t9ylvJgYABifNEwcmFI2Jj4hGEMDE6s3HbPQMDHJA4GcjAYBAAzagBybuJ+Lbip3bZupJSprgYOUpWZpdwV7s2Cy4Rr+4zF2ZfgWoNGBfZ4-JZtMHdTj9MBTcppFxuDxcMQSaRsEA4YTwUhMcjmSzWLDkIwpfgAbjs-E4nHISG2hwQ5Di4RgQxG0VicQmAlJCH45Go5AA2gIAsAiilIORdgA5YgoMC4cQMOpuGC7YlvFQfaW7ADqDBQ-FixIA0qzcJrfoDYnqACoINy1GBOKxxfjWwKHY56pW4SSQGl1EMAOmGUTGcSQzlDojiik48sVyvMatinAAjAAGAC0OYA7JxduRsGKupKEHqAMLaUQqOKSYRexba3UyiKKFIwYTE0Lx3BW4kBW0wPUAeWkxFE5FcDGEQ9+lCOcT9g8DwbDEdGXJjcYTnFr9cbwizeYArNni6WsOWJe3djk4ihwggW7828U9QBZJjEBDEgAgvwSTviO9R2jKgHOMIcQwM4hwoOQo7NsSPqrjK-obpwIZ1OGHJRnu8aJk+L4IGeuYABwAMyZteZYChWD76nEKikLEjLvp+UoygAEvUbiDsSABSxSoYEo56nkaAmuY7qesO3ormuAZBjhW4EbusbEZwLFsRxJoUZmABsdEltM-AALqUoI-AElY7GCokCB1OQOQWA5CAABTAOWTjMAguB6j0-ksJqflKKo6hVjKIWRWoCjhYxSDqAw0oStunLjMI0p8gKFkYAAlOSmIgKI8BKoohS+Z4xz8LguZbMkxAqNo0rCAw-DCLmwgcVsNkWQITiuEyNX2M4cH0jAPWSBYiHStmA1UsEXTlAoJi5gUCr8NKbhbLgNnjRYADWKDxOE-BILm8YNmO5A9AATE9h3KqxcHSn0CAIEttnPKtngTTAU25hNg4JtKmaSEYQysVQ91IAjP1DWybDkAAVP99izQj83kNmobnkoA2YEAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDgtgBlAFc9GDAEGAB7cn4GRQQIqM8A2Mi2ACUEBhVs3PzOUuji71KklMkMgHd0gr8vCN9oxvJgYFDK0TByYWT0tMyEYUhsxMUMDCGSgaLioNwkNhH+FfIAanIARjWI-Y3ix32CBnIwGAQAM2oAchHifjeMtafA7AHJ5K6cBgceo3bZNe7A15VUEIcF7XpNEr7EbtLowVEw-x3epbQkjTjjMBraIRFxuDxcMQSaRsEA4YTwUhMcjmSzWLDkIx5fgAbjs-E4nHISHevwQ5AyiRgUxmqXSGQWAkFCH45Go5AA2gIAsAanklp8AHLEFBgXDiBgdNwwT78xEqZHmgDqDBQ-HS-IA0orcC6MTj0uaACoINztGBOKwZfih4q-f7m224SSQCUdPMAOmmKTmGSQznzogyik4VptdvMjvSnHOAAYALStgDsnE+5GwRuGpoQ5oAwtpRCoMpJhCmmm6PeRPklFHkYMJ+fFK7gQ-yAuGYOaAPLSYiiciuBjCHcYyh-DIZ7fZ3MFouzNVlitVzhjidT4TN9sAFYWx7PssAHE0F0+MoMhQRIEFnDF51qc0AFkmGIBB+QAQX4HJEL3ToI0XbDnGEDIYGcX4UHIfcZ35NN70XTMn04PMOkLFUSw-StqxguCEAAtsAA4AGZzlA-sdUHKDPQyFRSHSWVEOQs1FwACU6Nxt35AApWp6OKfdzQqNA-XMRNk13VM7wfLMczYl8uPfcteM4OSFKUv0hPOAA2CTe3WfgAF1RUEfgeSsRTdWyBAOnIMoLCihAAApgAHJxmAQXBzVCTKWBdDKlFUdRh0XPLirUBRCukpB1AYJYTVfVV5kWAUhT7AQMAASmFVkQFEeBbUUap0s8f5+FwNs3lyYgVG0JZhAYfhhDbYQlLeMKgoEJxXDlMb7GcCjpRgNbJAsailhbLaxUiYZogUEw2yqa1+CWNw3lwMLDosABrFBMkSfgkDbStJwPchQgAJhh767XkiiljGBAEBu8K9nuzwjpgE62yO7cqyWc5JCMKZ5KoSGkCptGdqVNhyAAKkx+xzqpy7yBbfNAKULbMCAA">Fix Code</button>
</div>

Often when working with lists, we want to know the index of the list item we're currently rendering.

Mustache doesn't have a good way of doing this, so Ractive.js introduces the _index reference_:

```handlebars
{{#each list: num}}
  <!-- inside here, {{num}} is the index -->
{{/each}}
```

> If you don't want to name your index, you can also use the generic index special reference `@index`. `@index` will resolve to the index of the nearest iteration, so if you happen to have nested iterations, it will be the nearest parent iteration, not the root.
>
> If your section happens to be iterating an object rather than an array, you can use the `@key` special reference to get the object key of the current iteration.

By declaring `num` to be an index reference, we can use it the same way we'd use any other variable. Let's add a number column to our table – first add the column to the header row:

```handlebars
<tr>
  <th>#</th>
  <th>Superhero name</th>
  <!-- etc -->
</tr>
```

Then to the list row:

```handlebars
{{#each superheroes: num}}
  <tr>
    <td>{{num}}</td>
    <td><a href='{{info}}'>{{name}}</a></td>
    <td>{{realname}}</td>
    <td>{{power}}</td>
  </tr>
{{/each}}
```

Execute the code.

Not bad, but it would look better if the numbers started at 1 rather than 0. Use an expression to increment each row number by 1.

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDgtgBlAFc9GDAEGAB7cn4GRQQIqM8A2Mi2ACUEBhVs3PzOUuji71KklMkMgHd0gr8vCN9oxvJgYFDK0TByYWT0tMyEYUhsxMUMDCGSgaLioNwkNhH+FfIAanIARjWI-Y3ix32CBnIwGAQAM2oAchHifjeMtafA7AHJ5K6cBgceo3bZNe7A15VUEIcF7XpNEr7EbtLowVEw-x3epbQkjTjjMBraIRFxuDxcMQSaRsEA4YTwUhMcjmSzWLDkIx5fgAbjs-E4nHISHevwQ5AyiRgUxmqXSGQWAkFCH45Go5AA2gIAsAanklp8AHLEFBgXDiBgdNwwT78xEqZHmgDqDBQ-HS-IA0orcC6MTj0uaACoINztGBOKwZfih4q-f7m224SSQCUdPMAOmmKTmGSQznzogyik4VptdvMjvSnHOAAYALStgDsnE+5GwRuGpoQ5oAwtpRCoMpJhCmmm6PeRPklFHkYMJ+fFK7gQ-yAuGYOaAPLSYiiciuBjCHcYyh-DIZ7fZ3MFouzNVlitVzhjidT4TN9sAFYWx7PssAHE0F0+MoMhQRIEFnDF51qc0AFkmGIBB+QAQX4HJEL3ToI0XbDnGEDIYGcX4UHIfcZ35NN70XTMn04PMOkLFUSw-StqxguCEAAtsAA4AGZzlA-sdUHKDPQyFRSHSWVEOQs1FwACU6Nxt35AApWp6OKfdzQqNA-XMRNk13VM7wfLMczYl8uPfcteM4OSFKUv0hPOAA2CTe3WfgAF1RUEfgeSsRTdWyBAOnIMoLCihAAApgAHJxmAQXBzVCTKWBdDKlFUdRh0XPLirUBRCukpB1AYJYTVfVV5kWAUhT7AQMAASmFVkQFEeBbUUap0s8f5+FwNs3lyYgVG0JZhAYfhhDbYQlLeMKgoEJxXDlMb7GcCjpRgNbJAsailhbLaxUiYZogUEw2yqa1+CWNw3lwMLDosABrFBMkSfgkDbStJwPchQgAJhh767XkiiljGBAEBu8K9nuzwjpgE62yO7cqyWc5JCMKZ5KoSGkCptGdqVNhyAAKkx+xzqpy7yBbfNAKULbMCAA">Start</button>
</div>

Let's say you wanted to add an item to your list. You could use `ractive.set()` the way you're used to, but you'd have to find the length of the existing array first:

```js
var index = ractive.get( 'superheroes' ).length;
ractive.set( 'superheroes[' + index + ']', newSuperhero );
```

That's not ideal. We could use `ractive.update('superheroes')` instead, which will make sure that the table is up to date:

```js
xmen[ xmen.length ] = newSuperhero;
ractive.update( 'superheroes' );
```

> If you don't pass a keypath argument to `ractive.update()`, Ractive.js will update everything that has changed since the last set or update.

But there's a more convenient way. Ractive.js provides mutator methods for arrays (push, pop, shift, unshift, splice, sort and reverse) that work with a keypath:

```js
ractive.push( 'superheroes', newSuperhero );
```

Try adding Storm to the list by pushing to the array in the Script pane:

```js
var newSuperhero = {
  name: 'Storm',
  realname: 'Monroe, Ororo',
  power: 'Controlling the weather',
  info: 'http://www.superherodb.com/Storm/10-135/'
};

// add the code here...
```

## Step 4
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDg8lE1YWEDYQB7GCdXGxA2AGUAVz0YMAQYVPJ+BkUECKjPANjI+MTk+jSMlzd2ACUEBhUKqprOSL8Y7yaEhiSU9MyunIKiyVSAd1LasdiR32jogOBgUL7RMHJhQtKSsoRhSAr8xQwMfYafLYag3CQ2Q-5H8gAanIAEZnhEfq8GhMfgQGOQwDAEAAzagAckOxH4yNSzzRv2AlWq4M4DA4I0h9WhMIJSP6RIQJO+H2hjh+hxW6xgTMp-jeOw+h04JzAz2iEU67iEnDEEmkbBAOGE8FITHI5ks1iw5CM1X4AG47PxOJxyEgUViEORUvkYOdLsVSqlbgJdQh+ORqOQANoCA6Dar3NEAOWIKDAuHEDFWbhgaO1dJUDKDAHUGCh+KVtQBpW24ePUzmlIMAFQQbhWHSsqX4BYaWJxQYjuEkkBNqw7ADoLkVrqkkM5O6JUopOKHw5HzDHSpwQQAGAC084A7Jw0eRsH7yMAAwggwBhbQJVKSYR16GJ5PkNEFRTVGDCbW5Ye4fPagJFmBBgDy0mIonIVxpjfalKGxVIm1fVt2y7HsridAchxHThD2PU9Z0XABWOc1w3LAtx3K80W6VIUHyBBz2pS8hiDABZJhiAQbUAEF+EqSiPzWYtr2Y5x2mcLEUHIT8z21BsIOvZtoM4DtVm7B0+0Q4dRxIsiEAwhcAA4AGYQVwzcPW3XdU1SFRSFKS1KOowNrwACTWNxX21AApIZRIaT8g16NBM3Mata3fetwMgls2xk2CFIQwdlM4FNTPMiRMw0kEADY9PXF5+AAXUNQR+A1KxzM9CoEFWchugsQqEAACmALcnGYBBcCDUIGpYeN6qUVR1D3a9Wq6tQFA6wykHUBh7h3ODHRuO4dT1PCt3aZryGRfJ+E1GtqviUzHg9ABKbct3sfpSlwLabzmQTAO0ddgWHFRdvIPat0yjA9v1RUQFEeAI0UAY6s8HF+FwBdkSqYgVG0e5hAYfhhAXYQLORXLMoEeYrQB+xnHSc0YARyQLEE+45xRo0mkx19jBB-ow34e43GRXBcqxiwAGsUDKNakAXe70nuUIACYheZyNTL58hjgQBBSbyyJuzmSVDs8URbXae4VixBQYBltGwHljoskgZwUXSDHomHYH3WWtFAD7SNERd5r8Jcwl2RcUJgUCxBcJAnYnO0wpQdeBpAlaxnHSgXbHXxHe4QUkIxzlMqgJaQVOg9wO02HIAAqUOWwYVOifIOd-cDgQMEwIA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDg8lE1YWEDYQB7GCdXGxByVP4AWgTiUQBrAwABADo0jIAKAHJ+BkUEeoBKdgBlAFc9GDAEGFTyJpaIqM8A2Mj4xOT6Gsy3TTzClWKy+irFhpgEBhVR1o6QNgAlfZUR5oRxvxjvGYSGJJT0pezcgqLSiur3hqSVIAd0G7S6vUGQNBMDu0VinFwvmi8PIwGAoX2ojA5GEkP6g1SCGEkBG3UUGAwqOmyMmUyCuCQbHR-HJ5AA1OQAIyUiJM6lTRxMggMchgPYAM2o9XRxH4EtSlPqzOAR15nAYHER-LpU0eTPRewOaowfPueumBuA0MG6sZ5sFiNp-jRwE4WLAlOiERcbg8XDEEmkbBAOGE8FITHI5ks1iw5CMLX4AG47PxOJxyEgEBK5Qhct0YLj8QMhsSBImEPxyNRyABtAQBYDXFqk+oAOWIKDAuHEDGBbhg9XjRsONzbAHUGCh+IN4wBpQu4YcWm0wNsAFQQbiBGXUxDyK6mcoVbZ7uEkkAzwJv1RLhKQzkqolSik4ne7vfMA8GnC5AAZ8gAgB2Th6nIbBGzRFsEDbABhbQElSSRhCPPVRyONsekUFoYGEeNOhfXBl3jAI1zbAB5aRinIVwXhIi1KHlVIz2Iy9r1vPE+lLVJH2fV9OAQpCUL-QCAFZ-zAiCsCg5tMPIeozlSFBulaUjGIw8cFIAWSYYgEHjABBfgmjQqZyIUwznBqZw5RQcg11Q+MTxYhTz3Yzgb2BO9uIfJ8XzfJSVIQUT8gADgAZi5KTIOraD5PqCdUhUUhBjzMzNNbBSAAkQTcYj4wAKRuJzzJBQY2wuNBZ3MKxD3UgIXNYi8r08zj7yGPiAs4JKUrS2dQq5AA2aLwKpfgAF1U0EfgYysVKaxGBBgXIM4LHmhBamAKCnGYBBcDbUJdpYYcdqUVR1FghSjvOtQFFOuKkHUBhSWbLjBh44lSUratYoCRZSQlbp+FjPJaniZLyWrNo0Sg+wDkGXBwfqTp3js2jtHAzkXxUKHyA6OLxowNpk1DEBRHgHtFCubbPAVfhcHyCVmmIFRtFJYQGH4YR8mENKJWm8aBA+WHPGcdJsxgXnJAsOzSX-QW0xmWn7AUEx8gOLt+FJNwJVwab7GcCwShQIZgaQQpkvSUlQgAJntg3eyt9dyExBAEEVmbIn+PcslF+xRELGpSSBOUFBgT3hbAH2PkgZwc3SfMVadhmqwOhTAD7SepHZx63XbEgvHcUJgUDlfIJE-eXKjEpRI4Z6PFl9BAY+QOOE72f2nZUPO3Y9gQhYZpBO-FmBJfycXiNfUkuUkIxcWSqhXaQZe66Rcg2HIAAqTuZeXuXyH-ava-7zAgA">Fix Code</button>
</div>

It's time to make our table sortable. We've added a 'sortable' class to the three headers to indicate they can be clicked on.

First, let's add an event listener to each column header, calling the instance `sort` method with the column header as an argument:

```handlebars
<th class='sortable' on-click='@.sort("name")'>Superhero name</th>
<th class='sortable' on-click='@.sort("realname")'>Real name</th>
<th class='sortable' on-click='@.sort("power")'>Superpower</th>
```

That way, when the user clicks one of the column headers, the view will fire call the `sort` method.

```js
ractive.sort = function ( column ) {
  alert( 'Sorting by ' + column );
});
```

> You can add methods and properties directly to a Ractive.js instance by simply including them in the init options. Any keys that don't match know init options are added to the instance upon creation.

Execute the code. When you click on the three sortable headers, the browser should alert the name of the column we're sorting by. Now we just need to add the sorting logic.

## Step 5
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDg8lE1YWEDYQB7GCdXGxByVP4AWgTiUQBrAwABADo0jIAKAHJ+BkUEeoBKdgBlAFc9GDAEGFTyJpaIqM8A2Mj4xOT6Gsy3TTzClWKy+irFhpgEBhVR1o6QNgAlfZUR5oRxvxjvGYSGJJT0pezcgqLSiur3hqSVIAd0G7S6vUGQNBMDu0VinFwvmi8PIwGAoX2ojA5GEkP6g1SCGEkBG3UUGAwqOmyMmUyCuCQbHR-HJ5AA1OQAIyUiJM6lTRxMggMchgPYAM2o9XRxH4EtSlPqzOAR15nAYHER-LpU0eTPRewOaowfPueumBuA0MG6sZ5sFiNp-jRwE4WLAlOiERcbg8XDEEmkbBAOGE8FITHI5ks1iw5CMLX4AG47PxOJxyEgEBK5Qhct0YLj8QMhsSBImEPxyNRyABtAQBYDXFqk+oAOWIKDAuHEDGBbhg9XjRsONzbAHUGCh+IN4wBpQu4YcWm0wNsAFQQbiBGXUxDyK6mcoVbZ7uEkkAzwJv1RLhKQzkqolSik4ne7vfMA8GnC5AAZ8gAgB2Th6nIbBGzRFsEDbABhbQElSSRhCPPVRyONsekUFoYGEeNOhfXBl3jAI1zbAB5aRinIVwXhIi1KHlVIz2Iy9r1vPE+lLVJH2fV9OAQpCUL-QCAFZ-zAiCsCg5tMPIeozlSFBulaUjGIw8cFIAWSYYgEHjABBfgmjQqZyIUwznBqZw5RQcg11Q+MTxYhTz3Yzgb2BO9uIfJ8XzfJSVIQUT8gADgAZi5KTIOraD5PqCdUhUUhBjzMzNNbBSAAkQTcYj4wAKRuJzzJBQY2wuNBZ3MKxD3UgIXNYi8r08zj7yGPiAs4JKUrS2dQq5AA2aLwKpfgAF1U0EfgYysVKaxGBBgXIM4LHmhBamAKCnGYBBcDbUJdpYYcdqUVR1FghSjvOtQFFOuKkHUBhSWbLjBh44lSUratYoCRZSQlbp+FjPJaniZLyWrNo0Sg+wDkGXBwfqTp3js2jtHAzkXxUKHyA6OLxowNpk1DEBRHgHtFCubbPAVfhcHyCVmmIFRtFJYQGH4YR8mENKJWm8aBA+WHPGcdJsxgXnJAsOzSX-QW0xmWn7AUEx8gOLt+FJNwJVwab7GcCwShQIZgaQQpkvSUlQgAJntg3eyt9dyExBAEEVmbIn+PcslF+xRELGpSSBOUFBgT3hbAH2PkgZwc3SfMVadhmqwOhTAD7SepHZx63XbEgvHcUJgUDlfIJE-eXKjEpRI4Z6PFl9BAY+QOOE72f2nZUPO3Y9gQhYZpBO-FmBJfycXiNfUkuUkIxcWSqhXaQZe66Rcg2HIAAqTuZeXuXyH-ava-7zAgA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwFcDAEYqEfQTPKOYH++XJ7RzA2AGIuXBC7LwDg8lE1YWEDYQB7GCdXGxB4xOEAWjSM5BT03ABhVJUAV0V+cmpG8gByfgZFBGbNVP58hOJRAGsDAAEAOiLcAApW9s6ASnYAZWq9GDAEGFTyNo6IqM8A2MjchiTSjJc3TQSzgsmS+knKmrqGpuaYBAYVXc7u3r9IajCZlGZfH5-ZqLEBsABK3xUOzm+z8MW8J1u5yeZSu2VOSUKZUeIGeVVq9Ua1BaklSAHdNl0cj0+ioBsN6ONJjNaQyYNDlqtNrzNqjorFOLhfNFxeRgMBQt9RGByNzVUL1ptUghhOR5pAdrUMBhZcdpYcjkFcEg2PL+LVyABqcgARmNERtpqOjhtBAY5DAXwAZtRmvLiPwg6ljc1bcA-u7OAwOJLPRajhibfKIb85onrWiM8cs8ARTB82n-N7Jeaq-LOEqwMbohE8R4uGIJNI2CAcMJ4KQmORzJZrFhyEYOvwANx2ficTjkJAIIMRhDkVLVGDqtYbLY6gSThCU8gAbQEAWAyI6BuaADliCgwLhxAw6W5+eOc39bwB1BgoPwmzjgA0luuDNOOGZlreAAqCBuLSlxWD0kEZhGUa3s+uCSJAC50gREwanuqRIM4YyiKkiicA+T4vuY76bJwLoAAz5KxADsnDNOQ2AXnK14ILe5TaAkqSSMIaFFt+cy3isigdDAwjjkslG4BBUHkDBLQAPLSAM5CuGcGlFpQkapFh6m4fhhHCMRWpkRRVGcCJYkScxbEAKwsdxvFYPxV4-i0cKpCg1SdJp0mIkFzQALJMMQCDjgAgvwbRSdB9KbLeyXOEUzgRigWlZUpaEYRZLTYdZnAEXSRG7g55GUdRIVhQgHn5AAHAAzC6vl8fUAkxb+VSkJsa4ZcO0WyS0AAS9JuOp44AFJzJJmnac0CJoEB5gofwk1mZhlVWXhNW2fZWyOc1nAjSoY0SEBHUugAbH1PEmvwAC6s6CPwI5WGNDQ7AgdLkHCFiAwgUzAPxTjMAguC3qE8MsJBcNKKo6hCS0KOY2oCjo4NSDqAwBqw4N9h2Q1+7CAaR78P5lO4GSrz8LeUJMwEVNlAaQbVPwo49FM5BMOY2h6nK-H2PYC7kCg5jOFoGzxFuXz8DIkzxOSdTS6wuCDtulFs8DkTEMIYwsCLzSsxSPHzL93OsBasuLmJQHK+uYsMBLaSi7q-CpDIuDbIopHEEGEuROuAvLjAKjaIVS6k7K9iG6LMDbtS3vaBMbKiNDDup87Vb2F8uBbvUYughkIv84L+0iww45K-MUsu-r5eV6Lp7aybX3eIZvfGxS5ADwA-OQ7HkAaLq-aXuAYEXzOfQEA0BJMfMC0L-AiyPbxtxTTty6sJMKJ7qplH3FJ62bFvCIjMy23UaH7-wy9rwIS-Tr2ICiPAz5FBIgpvYKMGt8hBnaMQBOBphAMH4PccaQZfqfQEJkNw7d7DOHSHHQokgLCFQNCxFBc4TggPUsYXA+QfiPnZuQNwQZcDz1wM4CwgwFabn4EgPoVR0gGlCAAJiEcw42fDyCKgQAgEhf1Ig13QeuchogtxFANLSCMCgYDSLQWAOReJIDOBXOkBR0RKIa2PEjFogA+0maCI3hMB+GeUccwxQTAUARnyBIOiRCxieSUFojWOjJh4jkcgfRhiviYJfHY-hkipFf1IUgSJ2CYC4OwepKis9JBGEvmyRJoQkAFP8VKcgbByAACpIn4IKYQ8gLEfF+K-pgIAA">Fix Code</button>
</div>

So we've wired up our event handler, and it's behaving as it should. The next step is to add some logic that actually sorts the table. For bonus points, we'll add a 'sorted' class to the header of the sorted column.

There's a nice easy way to ensure that the table remains sorted, even when we add more data: an expression. That's right, you can use expressions with sections.

Update the template:

```handlebars
{{#each sort( superheroes ) : num}}
  <tr>
   <!-- row contents -->
  </tr>
{{/each}}
```

Now we need to add the `sort` function. Here's one (if you're not sure why this works, [here's an MDN page](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/sort) that will help explain):

```js
function ( array ) {
  // grab the current sort column
  var column = this.get( 'sortColumn' ); 

  // clone the array so as not to modify the underlying data
  var arr = array.slice();

  return arr.sort( function ( a, b ) {
    return a[ sortColumn ] < b[ sortColumn ] ? -1 : 1;
  });
}
```

Wiring it up is easy:

```js
ractive.sort = function ( column ) {
  this.set( 'sortColumn', column );
});
```

Try executing this code and clicking different headers to sort the table. (You could specify an initial sort column by adding e.g. `sortColumn: 'name'` to `data`.)

The last job is to add a sorted class to the header of the currently sorted column. There are several ways we could do this – you could use a bit of jQuery inside the sort proxy event handler, for example. But for this demonstration we'll put the logic in the template, using the conditional operator:

```handlebars
<th class='sortable' class-sorted="sortColumn === 'name'" on-click='@.sort("name")'>
  Superhero name
</th>
```

> The `class-` directive is similar to the `style-` directive - it gives you direct control over the presence of a single class. The `class-` directive exists in an expression context, so mustaches are not required. If the expression passed to the directive is truthy, Ractive.js will add the class to the element, and if it's false-y, it will remove it.
>
> You could also add an additional expression within the existing `class` attribute using a ternary e.g. `class="sortable {{ sortColumn === 'name' ? 'sorted' : '' }}`.

Do this for each of the headers, then execute the code. Congratulations! You've built a sortable table in just a few steps. Now comes the fun part – add Storm back to the table. The table will maintain its sort order.

```js
ractive.push( 'superheroes', {
  name: 'Storm',
  realname: 'Monroe, Ororo',
  power: 'Controlling the weather',
  info: 'http://www.superherodb.com/Storm/10-135/'
});
```
