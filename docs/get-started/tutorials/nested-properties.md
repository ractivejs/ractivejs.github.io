# Nested Properties

Ractive uses the [mustache syntax](/concepts/templates/mustaches/), which supports nested properties – in JavaScript-land, that means properties that are objects with their own properties (which might be objects with their own properties...).

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmwAcgCCALIAogD6ABLpAErplMLkDOQAKumpAAr5yWUAqgU5+YWiXj5+5ADuxLhg5HnJAJKJAGLJADITzQXk5sT8wQwqKiX8SCUB7pKealbu-OQh5FUA8lX1E3VDp4kz6QB0XAl2sfbxbGVgCOSiDJK9Za-Xr+YjFVzJKpDMqTTIpDL3cgACgIpTAMAQwWoAHIwLhcJJhJBOJxFP9hA8UO53Chwg82g9PABrUnkziqCwITgQqEw6bwrK5AqcAACVzK0PqABFBS0sBNbgBxSUy+5YACMTgAXtitEwWDjMgAjNT8JnYtjCBA-MmSLgMNgASie7OiXDEEmkbBAOGE8FITDmFispB+1HI-AQXQGwesSOAAnIeuYCFwkHI2IAxLh9ansVhE1olByFOmswplHsEPnC0h1Ax0wnDknfu1fNpGxhyCTyAQALR9uYIDmiH59H7ALs9Pqt7zt8h1nOFjACDCOgDcmCAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbgETAgA">Fix Code</button>
</div>

Let's say we were building an app that displayed information about different countries. An object representing a country could look like this:

```js
{
  name: 'The UK',
  climate: { temperature: 'cold', rainfall: 'excessive' },
  population: 63230000,
  capital: { name: 'London', lat: 51.5171, lon: -0.1062 }
}
```

Add that data to our JavaScript – there's a placeholder `country` property.

We can refer to these nested properties in our template using dot notation. So to refer to the country's name, we use `{{country.name}}`.

Go ahead and replace the placeholders in the template with mustaches. Don't forget the `href` on the 'see map' link. If you get stuck, click the **Fix Code** button.

Execute the code. You should see an accurate description of the UK.

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbgETAgA" data-eval="PTAEHkDsGMFNQO6wOQDd4CdaQCayzqAPYCuGoqAlrAgDSLzQCGko0AFiwObwAu7jUpF4YAnqEqQAZkQBQGJtF6V0AOgDOsXgApQyaEJGjk9AN6zQoSEwC2sAFx6AgiXUimAG0pMTFtl5smXgdQU1BgmwAHfCCyEOR2Il4TUAVJKU8PR2QAymCcZFAAX1o-SKJIkg8gyiJIRwAmBoA2BoAGZra20stmSLzPRzDrO2yAYRYAI3wFFOreRwBaAGYAVlUGgA4t+g86xwBGABYATlUD5ePi2SKASgBuWSA"></div>
```js
// Once we've rendered our view, we can change the country info
ractive.set( 'country', {
  name: 'Australia',
  climate: { temperature: 'hot', rainfall: 'limited' },
  population: 22620600,
  capital: { name: 'Canberra', lat: -35.2828, lon: 149.1314 }
});
```

## Step 2
<div class="tutorial">
	<button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbkwIA">Start</button>
	<button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDHAwADEAO7EuGDkol4+fhgYdjLkBJJs8fwMigi5lMLkDOTxoirEiuoIAHQKygjmuJ4wlRgZWb7+KWn1wI3NrW3mxPzBDCoqVXMLSyq1-Ei1Ae6SnmpW7vzkIROS+4fqxCe5bVzF+fnkE8mp6aIMkqlLuS+vQrFAAqYAQGW+v02olS-mINVK5QG5AAFAQ6mB+sFqAByMC4XCSYSQTicFpEtoodzuFDhNqZNqeADWZO+wk4qgsCE4iIquU4AAF4kdclhhXdsABGJwALxxWiYLFxAH0AEZqfhMnFsYQIcHkrgMNgASgeHOi9le8U4YzA-xi+WttvtXDEEmkbBAOGE8FITHI5ks1nI1HI-AQSXIACULFZSAgUcABK9cIqELhIOQcQlU8x0zisMmtEpOQpM9nOqWEAWi0h1AxM0nToDMt4Ro2i4Cw0jy6DwQBVADSNebXamLTL9WLXR6fQQ5cyKiQBYDDHmi2W5eMogQwmE1nl2E7gMuByOt34mYAbABmJw3gAMT4fhdHLchqZUje7FXLABkTiQE4VyOTMAFZJTaCCAHZJSwcgVBOTMAFoHzaSUHyvJxyDyN9cNeXCMGNABuTAgA">Fix Code</button>
</div>

That's all well and good, but it's a little on the verbose side. You can imagine if we had lots more properties on the capital city object that we wanted to refer to – we don't want to keep writing `{{country.capital.xyz}}` if we don't have to.

We don't have to. Instead, we can use a _with section_ to provide _context_:

```handlebars
{{#with country}}
  <p>{{name}} is a {{climate.temperature}} country
  with {{climate.rainfall}} rainfall and a population
  of {{population}}.</p>
{{/with}}
```

> Strictly speaking, you don't need the with - you can just use a # sign by itself:
> 
    {{#country}}
      <p>{{name}} is a {{climate.temperature}} country
      with {{climate.rainfall}} rainfall and a population
      of {{population}}.</p>
    {{/country}}
> In this case, when Ractive looks up country, it will decide whether to render a with, if or each section based on its value. We'll learn about if and each shortly.
>
> Generally, it's better to be explicit about which type of section you intend – other programmers (including future you) will be grateful.

Go ahead and update the template, creating a section for the capital as well. (You can either create a `{{#with country.capital}}` section, or a  `{{#with capital}}` section inside the `{{#with country}}` section. Use whichever structure is easier in a given situation.)

> Notice that if you create a `{{#with capital}}` section, you could end up having two `{{name}}` variables – one for the country, one for the capital.
> 
> We say that the capital `{{name}}` reference has a two-level context stack – if the innermost context (`country.capital`) has a name property, `{{name}}` resolves to the `country.capital.name` keypath.
> 
> If not, Ractive moves _up the context stack_ (in this case, to `country`, and then to the root `data` object) until it _does_ find a context with a `name` property. If no matching property is found, then the reference will resolve to the current context. Once a reference is resolved, its keypath is fixed.
>
> If you ever need to _force_ a reference to resolve in the current context, rather than potentially somewhere up the context stack, you can simply prefix the reference with a `.`. `.stats.area` will _always_ resolve to `country.capital.stats.area` in `{{#with country.capital}}{{.stats.area}}{{/with}}`, even if there is not already a `stats` property on `country.capital` and there is one on `country`. If/when `country.capital.stats` is set, any references will be ready to update.

If you get stuck, hit the **Fix Code** button.

## Step 3
<div class="tutorial">
	<button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbkwIA">Start</button>
</div>

Let's say we want to update a nested property. If we'd stored a reference to our model object, we could do it like this:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbkwIA" data-eval="PTAEHcFNQEwSxgOwOQBdQGdUHsBO0BDUfAM0n0QGNIAaTbUAG0lWQ1gbnUW3ACgAbgVyhK2AK6JUuAJ6gAvMQKVUcAZAB0AcxYAKZGMnSZyAJQBuPn0NTZGyozgBbAqk24CcRCQKNGC0GR1WVAACzgtUORLDxU1TXEABxhXSH0bYzNzIA"></div>
```js
// we didn't store a reference, so let's do it now
var country = ractive.get('country');

country.climate.rainfall = 'very high';
ractive.update('country');
```

Ractive will recognise that only the rainfall property has changed, and leave everything else untouched.

But there's an easier way to do it:

<div data-runtutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYBhAPYBXfrhjbykjDuAGbEKghcznyCrDEEkmzAwKJePn4AdPwMiggYGJTC5AzkSSnevtrpoirEiuoI6QrKCOa4njC5+WVp-gDuxLhgJcmpFVU1dQrp5sT8wQwqKnnkM3MLKkX8SEUB7pKealbu-OQhw91jknsH6sTHeelcCXax9vFsACpgCOSiDJIDBa-Ab+YiFUqjDJ-AG4BaZbKdcgACgIxTAHWC1AA5GBcLhJMJIJxOHUCekUO53ChwlV3OlPABrEn-YScVQWBCcCHlKH-QEqeE5PKcAAC3J6VT5sIFhzyWHFY2h-PSKnu2AAjE4AF5YrRMFjYgD6ACM1PwGVi2MIED9SVwGGwAJSPNnRLhiCTSNggHDCeCkJgrCxWUg-ajkfgIXrkABKwesSOAAnIeuYCFwkHIWIAxLC07gsVhk1olOyFJmc00ywhC8WkOoGJmkycU79Idom8XWxGERWvj8AKoAaVrLe71Vq9SbJearXaCArKRUSELQdm80WFeMogQwmE1l12C7rau+0Od34mYAbABmJw3gAMT4fRbHraV0unWRyFYAMsckGOVdDkzABWdV0nAgB2dUsHIVVL3IABaB90nVB8ryccgMGPHCWzwjBHQAbkwIA" data-eval="E4QwxgLglgbgpgOgM5wgCgORgPYFcB2EwAngmADZQC2IEioU+AZiOeRgDQAEGE22XKrjAALDAEoA3EA"></div>
```js
ractive.set('country.climate.rainfall', 'too much');
```

Try changing properties. (If you're not from the UK, suitable values for rainfall include 'near-constant', 'unnecessarily high', or 'an unholy amount of'.)
