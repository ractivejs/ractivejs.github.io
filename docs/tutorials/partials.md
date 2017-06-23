# Partials

Partials are a good way to split complex templates up into several more manageable chunks. They also allow re-use of bits of template without having to repeat the template.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAVAPYBaJO-Iriwg6cznyCgg7E-JIArjLu-J6iYAz8aAb8CADuHj6aqhYIYO4qSAgw1ADkAOrJMhnIwlq+AEYI5D4ZAPwVofZ2DtEq5KJqwsKVuO4+wj395OTAwADECBZglAqKwpCUGBhz8+QE-sOjwt7x+hUAdB0Is+GHhwSRMTI6epVJCKIA1s3uIwVYZgH6-ZCVRa3S57B72J7zESSFKnBhjSqlMQSaTEeLA+KJfx-AzIYisEC9GQI+ZQzHiKRWeJ7foHamLJbEABm5GupKsqWZj2pz1esVR6IqfIqrOFwtIDBU0SutIQWIZuP4sJlsoRBOaivKFQAAqJ4goTNdJigUCoEAAKcj0XkkfkoTQASiw5E5CuE921OsOBPB2h8mX4BiNvP4ChgAFEjGSHUaEKQEDGvSazcYZO7bEK2cBOFzBfCEVxhMj+JTqQRmrFJvxxeMKvXcI38QkRsRicbTTGc9dK0T7Y6QNdrpx6JnIqUjF6AIzkd09ADrXDbjZrz04-m3i04qySpaCg1CFfp0jYIBwwng8pg5HMlms5Go5AymXIACULFY03awC0DA-S4EwLA7BUYHMAguAVFgwECPMmz5AokFLChagKPBiGCCBTbkJwnDkAAgkgSBaKC5AVGSSjAsiMBWAq5CgjANj4fMDFMSo2wLNguG4fMDDkQAkpsOyctE-AvvE5AOnS2KMk27oLIJhy4GAATXDEwhgA6NGbDMXpARxCIKeq8Q7OZOLxAhplPHcEm+uxSGHBg7oANxqfx+FqWxijuGmYlKBJUkyU2DqzsYy6qaZ9gaVpw49qOBlKEZlD8HOi7Ll5pk+XYpl8sFiihdJSlyRlc4xSZrn5QRalERlgQpKIbSpumMjJJltowMIamWbFrn2J+OTuKV4UVZYRjVWpfTtppwjXMJSDFQ6U3XPwUwINc8qKm0nmzawuDrZtpQ7QqSpvtRFS5UNR1+rgrjEIoCDuLEDqSWVGpySpNX1Ud9gnVt1ycu4ojRMIdoHXFR3ubd-11fM9h8uN5Vrbg02-QJVLzA+5AhmG-AABIpEgPVevq0QwCT3VlF6oq4F64MwGxMYACKqpeSnw30vk48MVOs7gHNqjZTbvutLD6bcnOKRqwLQyyR3rQ90t8pEKDwVoMCXYr4TY08DNXQli2crOasugrPP8wzQ4ILalhQ9bhtRLE1zM0LItc99EuCx1Xty-E8NI7g+x5XZQ2mUg6gMDsf0hxsaU7AA2mpTzAO0lw7LgOsIF67SyxZ-CQWRFEME0PiJ4owKIwiGeOd6zletZSkl+R5DCO4L3kAFbEV74tFbDXEcEenmcZE5PF5wXout9RADCXeqLBbQKkMGltL+L5plosTuBIvo12n5AALreSPSOFQO8aJrgqPfQ6qZMxjM0w1yFWptcmSaUkb7UO+C4ADM1VCLETjAAOVcHGb8h1AYYw2sDSmMAnaHQwOQe2fpKDckfqQL+P91j-3fE4AA7CAxqcYADK88SIAAU4ywNwHjU6bQJbwOYcHR0R1mHnT2ldbhHt-aFzFhwuaKtYLSxbvLL03Ddq6xEVwxBBoUEwzDrVXCcMbwgFEPAMAuBFBDCAuEUGMZPA+kUMQFQ2gdjCBSOcP0EhOReU1HYfgDNk75FakUEoZQT6qXCJkKgGkdgLgAAwhIAKROPsIoBgRhPABKQEE8gTgQlKCibgZE5ENY7BCdcAALGk-oxjcCeGEMQAAXggHYkRWJknScU0xDBzGWOqfwWpuB0kAjiWU8p2TyAAhgKUGAngulOP2GEQYfj7CZJIKkHJnT95DM8JMSQwTJDTU7v4CiSxOQhN2bs9JMS4kJKSSkwp4R-CBFKToW0OxNoZDGS4k4hjpnuDKXPNiWFrDpJmX03JABWJQ5BAFAoBUCpw5z7ADKWQCdsXc1kbOKFQcgKwEAIEOeBSI8z+jmISKCYgKBdHBPOeMgQ-hIBFDTI+F5uBmgWF+CgGAb1MqJGKPvHYOyACcnJuWcseWEcllKyjkDYP0hsskaXuGRKIMkVjyALn5WS4g0IMgio7lWKZ7YczeB+PvdQGodj+AyMssATLoiEvSVKiwsqcnXH+Yq-gJxRVuI+Pob4fwum+JpZIN5ZIDXkAYM0TZsR0X9FtJyO+5AwWKHSSs21xCSVPOIGqzcEr+jQrKHcy4nT6WMuZUgVlKh2VPmQOk00RaYAcs5NWn5vq56BuDQodJEhCWRujbGqV8bIUrOtToW1eSHVOvVSib1db-WfP1WmdJJBhwMDlZEI1CARlFr+Okk5YBglhMif0QKZRORFsyDsTS5F0xrs0goUp0qqkfncJkcwkhY3at3TAfdt6dj238JIMpwgy1U07pW8gPrIixkHcm0VlYUTOtdjIUd7z-UNuKCGjtqyo3pPDW2tdgSN3yq3ek-FrbN0RIWYMzNN6HlFLNKUip16allDqRRkxZiLHzraXRjpAgMCYCAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAVAPYBaJO-Iriwg6cznyCgg7E-JIArjLu-J6iYAz8aAb8CADuHj6aqhYIYO4qSAgw1ADkAOrJMhnIwlq+AEYI5D4ZAPwVofZ2DtEq5KJqwsKVuO4+wj395OTAwADECBZglAqKwpCUGBhz5PaLbMSbeweLnKtJ5+Fcg6FcYhLSbCA4wvCkTBtK5NSHEAEfzDUbCbzxfQVAB0HQQsxA5AA1LQYP0+qwZPNNPMCJEYjIdHpKkkEKIANbNdxGCrDMBk8nISqLWGQvYI5Go9GY+zzQF8kSSFKghhjSqlZ5SKzxWnxRL+Cl0Wj0ZCnZW2REotHhDG87GI+YsiXiKXEeLnTVcnU8rH8w3LYgAM3I0NVVlSFs52t1mL5OIF+NiIrFFTdFU0Wu5GL9Br5cfj3xU0ShRoQkukZv47IjVp9ert8cL5DlzST5QqAAFRPEFCZoZMUCgVAgABSHZUgV0kd0odWIgCUWHIjoYKmE8Jz3pt+f9RbjcsZ2h8mX4SvoFdd-AUMAAokZTm2KwhSAgt0OqzXjDJ+32+Japz6Y3zLk7PZHrdH9QLOMIhfw716Ua+l+uLNLEkz8MG4wVGBuAQbKCQjMQiqVtWW5XtCv4Kq27b0NC0KcH256RKURhDgAjOQ-Y9AA61wsEQQB755ramhcP4d4ANy5tq3wwOQ5iWNY-zkBkmTkAAShYVgni2wC5nBTAsDsFS4EpCC4BUWBWvMmz5AoKlLHpagKFpPECPMnCcOQACCSBIFo9LkBUpxKLSQowFYo7kPSMA2Nq8weV5Y47PJAWHFYmw7K5ig6eQ2DmZB5AMPZACSUXDtE-BCfE5BtsaLzSpB-YLHFulgAE0IxMIYBti5mwzEOYUWfGBWmvEOxtRm8TaeFcZwjsI5jv5LXzBg-bceFCXeuFfmKO4J7pUog1ZTlkFtiRxhUaV4X2LgFXCJhqjITh9VKI1lD8KRFFUZNLXTXY4VuktigrdlRV5ZdpHbc1SUPUlcVWZdgQpKIbTHqeMjJFdzYwMIcUdTtLX2GJOTuG9a2fZYRg-XFGL7ZVKVIC9bbY9C-BTAg0KJsmt145iZMU6U1OjrTAIVBUd0A5i464K4xCKAg7ixG2jqrR9LYlb92I2ozlPQo67iiNEwiS1zMv2ON6sRf9MtuhjEvDLgONSwpcZ8eQi7LvwAASKRILDQ6ltEMB2zDZRDoGuBDsrMB+VuAAiaYmt1-Bc30U5xr7-u4EH6YfQCZMsHVsLB4Vma0hNCkYmTvMp26kQoFpWgwLTWcPpHfJeyJBOHY6JH592mfh7al0EphCDNpYatm1XUSxNC0eQ3HIcJ8MLsxyP6fxNrmtxbrhzhUg6gMKF9O-FsOwANplc+7SQjsuClwgQ7tGn7X8CpdkOQwTQ+BvtIL3GwD7xkg2juOQ5dUVV-2eQwjuEFuQeafk76+BijMeKvVRp7wGsOD+J8z7x0zCpAAwoA1QGk2ijiGPtNoUkhIni0LEdwEgP6P13gAXXntAgGT10K7n3LgA2mZPrHh9sbXGu0rDOjbMeaEmQKpJH+NQAE5EADMP1yBAx3AAOVcDuCS9N7By2Zs7GAPduEYHIJ3cclBeE6NIAIoR6xREAicAAdikTIgAyqgmyAAFHcyjcAWyZm0ROxtyaU1npidxLMkweNEvLIegdz6h18SorxednKp2QTKIc-iaZtHLsjPx8t1GaLSfsKaVotbvBAKIeAYBcCKCGPJcIistyeBHIoYgKhtA7GECkcE44JCOm4lmOw-AvZb3yGDIoJQyiUNKuETIVB9o7HIgABmmQAUk6fYRQDAjCeHGUgSZ5AnDTKUIs3AQp7KFx2NM6EAAWXZ-Qqm4E8MIYgAAvBA0V+C+VOHsq5NSGB1IaU8l5uA9lUlWbcu5RzyBUhgKUGAngAWdP2GEQYoz7AHJIKkY5-zSEQs8JMSQUzJA4wAf4BySxHTTOJcSvZyzVnrM2dsi54R-CBBuToZsOwKYZBhd0kEFTEXuFuT-ASnd1DWD2UikFJyACsfxxF-HFX8JwtL7BgoxVSOCgCcV4uKFQcgKwEAIHJUpSIqL+h1ISPSYgKASlTNpbCgQ-hIBFBPPxLluBmgWHJCgGAwsrqJGKKQnYRKACcjpA3+vZWEW19qyjkDYKC8CuUnXuCFKIU4jTyDkVDTa4grIMhRv-n+BFcErzeDJKQwViN-AZExWAD10RzV7ITRYZNxzoRivTfwEE0belEn0KSCkAKRlOskDy04KDkrNHxbEXV-RmyOmYeQGVig9lYqbRYq1HLiA5oYnG-oiqygsshP8117rPVIG9SoX1-KkB7OrGemAfrHT3uFUOvlDAx3FAnXsiQ5rZ3zsXQm5d8qsUNp0E205rb225uFAOp9I6-ImSFf0EgWEGApsiOWhAUKz0Uj2VSsAUzZkLP6AtMojoz2ZB2BVeyp5sMVQUDcxNjzgmZHMJIRdhaiMwBI+4MjOiVD+EkLc4QV6XYANveQQdkRtxgfXdG38woO39xkFB3lI6X3joUL+7Fc69nTu-dhiZuHU34b2aar9eH5lovBbu4JbLLk1hufchjkRflvLs7U+pKHnllFeQIDAmAgA">Fix Code</button>
</div>

Take this todo list, for example. It's not too bad, but the template would look neater if we could separate out the code for an individual item. Well, we can. Add this above the rest of the JavaScript:

```js
var item = "<li class-done='.done'>" +
           "   <input type='checkbox' checked='{{.done}}'>" +
           "   <span class='description' on-click=\"edit\">" +
           "   {{.description}}" +
           "   {{#if .editing}}" +
           "     <input class='edit'" +
           "              value='{{.description}}'" +
           "              on-blur='@context.toggle( \".editing\" ), false'" +
           "              on-keydown=\"@.enterExit( @event, @context )\">" +
           "   {{/if}}" +
           "   </span>" +
           "   <button class='button' on-click='@context.splice( \"../\", @index, 1 )'>×</button>" +
           " </li>";
```

Then, in the main template we replace all that with a partial, which looks like a regular mustache but with a `>` character:

```handlebars
<ul class='todos'>
  {{#each items: i}}
    {{>item}}
  {{/each}}
</ul>
```

Finally, we need to add the partial when we initialize out instance:

```js
var ractive = new Ractive({
  target: '#target',
  template: '#template',

  partials: { item: item },
  // etc...
});
```

Execute this code.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAVAPYBaJO-Iriwg6cznyCgg7E-JIArjLu-J6iYAz8aAb8CADuHj6aqhYIYO4qSAgw1ADkAOrJMhnIwlq+AEYI5D4ZAPwVofZ2DtEq5KJqwsKVuO4+wj395OTAwADECBZglAqKwpCUGBhz5PaLbMSbeweLnKtJ5+Fcg6FcYhLSbCA4wvCkTBtK5NSHEAEfzDUbCbzxfQVAB0HQQsxA5AA1LQYP0+qwZPNNPMCJEYjIdHpKkkEKIANbNdxGCrDMBk8nISqLWGQvYI5Go9GY+zzQF8kSSFKghhjSqlZ5SKzxWnxRL+Cl0Wj0ZCnZW2REotHhDG87GI+YsiXiKXEeLnTVcnU8rH8w3LYgAM3I0NVVlSFs52t1mL5OIF+NiIrFFTdFU0Wu5GL9Br5cfj3xU0ShRoQkukZv47IjVp9ert8cL5DlzST5QqAAFRPEFCZoZMUCgVAgABSHZUgV0kd0odWIgCUWHIjoYKmE8Jz3pt+f9RbjcsZ2h8mX4SvoFdd-AUMAAokZTm2KwhSAgt0OqzXjDJ+32+Japz6Y3zLk7PZHrdH9QLOMIhfw716Ua+l+uLNLEkz8MG4wVGBuAQbKCQjMQiqVtWW5XtCv4Kq27b0NC0KcH256RKURhDgAjOQ-Y9AA61wsEQQB755ramhcP4d4ANy5tq3wwOQ5iWNY-zkBkmTkAAShYVgni2wC5nBTAsDsFS4EpCC4BUWBWvMmz5AoKlLHpagKFpPECPMnCcOQACCSBIFo9LkBUpxKLSQowFYo7kPSMA2Nq8weV5Y47PJAWHFYmw7K5ig6eQ2DmZB5AMPZACSUXDtE-BCfE5BtsaLzSpB-YLHFulgAE0IxMIYBti5mwzEOYUWfGBWmvEOxtRm8TaeFcZwjsI5jv5LXzBg-bceFCXeuFfmKO4J7pUog1ZTlkFtiRxhUaV4X2LgFXCJhqjITh9VKI1lD8KRFFUZNLXTXY4VuktigrdlRV5ZdpHbc1SUPUlcVWZdgQpKIbTHqeMjJFdzYwMIcUdTtLX2GJOTuG9a2fZYRg-XFGL7ZVKVIC9bbY9C-BTAg0KJsmt145iZMU6U1OjrTAIVBUd0A5i464K4xCKAg7ixG2jqrR9LYlb92I2ozlPQo67iiNEwiS1zMv2ON6sRf9MtuhjEvDLgONSwpcZ8eQi7LvwAASKRILDQ6ltEMB2zDZRDoGuBDsrMB+VuAAiaYmt1-Bc30U5xr7-u4EH6YfQCZMsHVsLB4Vma0hNCkYmTvMp26kQoFpWgwLTWcPpHfJeyJBOHY6JH592mfh7al0EphCDNpYatm1XUSxNC0eQ3HIcJ8MLsxyP6fxNrmtxbrhzhUg6gMKF9O-FsOwANplc+7SQjsuClwgQ7tGn7X8CpdkOQwTQ+BvtIL3GwD7xkg2juOQ5dUVV-2eQwjuEFuQeafk76+BijMeKvVRp7wGsOD+J8z7x0zCpAAwoA1QGk2ijiGPtNoUkhIni0LEdwEgP6P13gAXXntAgGT10K7n3LgA2mZPrHh9sbXGu0rDOjbMeaEmQKpJH+NQAE5EADMP1yBAx3AAOVcDuCS9N7By2Zs7GAPduEYHIJ3cclBeE6NIAIoR6xREAicAAdikTIgAyqgmyAAFHcyjcAWyZm0ROxtyaU1npidxLMkweNEvLIegdz6h18SorxednKp2QTKIc-iaZtHLsjPx8t1GaLSfsKaVotbvBAKIeAYBcCKCGPJcIistyeBHIoYgKhtA7GECkcE44JCOm4lmOw-AvZb3yGDIoJQyiUNKuETIVB9o7HIgABmmQAUk6fYRQDAjCeHGUgSZ5AnDTKUIs3AQp7KFx2NM6EAAWXZ-Qqm4E8MIYgAAvBA0V+C+VOHsq5NSGB1IaU8l5uA9lUlWbcu5RzyBUhgKUGAngAWdP2GEQYoz7AHJIKkY5-zSEQs8JMSQUzJA4wAf4BySxHTTOJcSvZyzVnrM2dsi54R-CBBuToZsOwKYZBhd0kEFTEXuFuT-ASnd1DWD2UikFJyACsfxxF-HFX8JwtL7BgoxVSOCgCcV4uKFQcgKwEAIHJUpSIqL+h1ISPSYgKASlTNpbCgQ-hIBFBPPxLluBmgWHJCgGAwsrqJGKKQnYRKACcjpA3+vZWEW19qyjkDYKC8CuUnXuCFKIU4jTyDkVDTa4grIMhRv-n+BFcErzeDJKQwViN-AZExWAD10RzV7ITRYZNxzoRivTfwEE0belEn0KSCkAKRlOskDy04KDkrNHxbEXV-RmyOmYeQGVig9lYqbRYq1HLiA5oYnG-oiqygsshP8117rPVIG9SoX1-KkB7OrGemAfrHT3uFUOvlDAx3FAnXsiQ5rZ3zsXQm5d8qsUNp0E205rb225uFAOp9I6-ImSFf0EgWEGApsiOWhAUKz0Uj2VSsAUzZkLP6AtMojoz2ZB2BVeyp5sMVQUDcxNjzgmZHMJIRdhaiMwBI+4MjOiVD+EkLc4QV6XYANveQQdkRtxgfXdG38woO39xkFB3lI6X3joUL+7Fc69nTu-dhiZuHU34b2aar9eH5lovBbu4JbLLk1hufchjkRflvLs7U+pKHnllFeQIDAmAgA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAVAPYBaJO-Iriwg6cznyCgg7E-JIArjLu-J6iYAz8aAb8CADuHj6aqhYIYO4qSAgw1ADkAOrJMhnIwlq+AEYI5D4ZAPwVofZ2DtEq5KJqwsKVuO4+wj395OTAwADECBZglAqKwpCUGBhz5PaLbMSbeweLnKtJ5+Fcg72s4YtLkkxWDEOnSrf28wT+YajYTeeL6CoAOg6CFm4Xm-0iMRkOj0lSSCFEAGtmu4jBVhmAMZjkJVFlCwXtYX94SI3vwgQwxpVSmIJNJiPF8fFEv4sQZkKdbHD4fMySzxFIrPFfk9qSKXsQAGbkCECqypGUikUERGxBlMipqioHLWm+akT7RcFihCsyUc-iUk1mrXc5oqaLlCoAAVE8QUJghkxQKBUCAAFIcQKqSOqUJoAJRYciKz7CGHOl3w7nE7Q+TL8Aze1X8BQwACiRlOke9CFICFLyd9-uMMgTQrl8MuSs1NM4wjpj21zVik3pI0Z4wqI9wY65CRGxD5Pr9pdbEIHvIjUYhEM49CbkVKRmTAEZyAmegB1rgzsdD8hcfyPS5vGAfFS3Lh26RsEA4YR4AtGByHMSxrHIahyAyTJyAAJQsKx63DYBaBgfpcCYFgdgqTDmAQXAKiwNCBHmTZ8gUHClnItQFCIkjBHQ+lyAYJAkAASU2HZFWifhwPichI3FNkpXpBMFgYkVcDAAIIRiYQwEjCpvi2IiJKY01hPteIdi09l4mIjStWhbi0xsIz5gwBMAG5JPIbAGLsmAlHcetOKUbjeP4+lIyPYwL3U0jDlnGThA3VQl23ZTNhmZM-JPchzxsuyHKYuy1XcxRPL40TBMofhjwC1CjNSoK7M4Th8sCFJRDaOsGxkZICrDGBhDsnTAuY+wYJydxsu8vLLCMIq7L6ELZNYjjNkjIaIX4KYEAhC0PTaZKjLG2b5tKJbLTaKCKgqWz1tYXB01wVxiEUBB3FiSMeJyh1BPE4qypO+xNoWiFFXcURomEcM1te+wrKO17Sq6hRY363KZtwYbnscmR4WA8hc3zfgAAkUiQFrk3dT0seaso4qiWJk1+mBnNLAARW0JX0-hQfCRGRQpqncFpn9cqg2aWCUqE6ZEh18UB5mTtms7+bVSIUDU3AYCtC8mb6NKkfmXUZCg6TZMVI8pdjEXlbV-KkQ3BAw0sAGjZFDWITZhrOfp7nhk9dnHaF+ImfmYGUsMsqjKQdQGB2F6IY2JRtnIABtOz5XaMEdnlq1k3aQXtP4HCAEE2JYpofHDxR8XB01gHjjJTJUdNkz00Ss5z4R3Cu8hFHcZy898FSZnsv3mLjkyUzM6u04ZnCAGFG9UAi2k+IZpLaBDwPrLRYlb4g0yL2PyAAXV90ajIaspK1OaHHsjOtybhkbjqVPK6whTIZKSSDqCg08AGYivICryHLAA5VxyxwVGuLOGc1Pr4xgFbYBGByDm3TJQZUZ9SD30fusF+UEnAAHZP7f3LAAZVHpnAACuWYB9gUZbT2sMUBlCvbBW6p9ZaisoKULtq7B2w9RJ0I2qAyW5BIQ12FsmVhTDVrcJOqwiBUDjr7BKgxEG-4QCiHgGAXAighioXCN9UsnhUyKGICobQOxhApBBOmCQipbKOjsPwDWUd8i1SKCUMoW8JLhEyFQaSOxTwAAYfEAFIrH2EUAwIwngPFIC8eQJwPilBBNwG8NiMsdg+IhAAFjif0bRuBPDCGIAALwQDsSIhIJC4Hidk3RDB9GGOKfwUppx4k4jCXk-JyTyA4hgKUGAnhmlWP2GEQYbj7CJJIKkFJTTW7dM8JMSQ3jJDDQbv4JA5AliKh8es9Z8SQlhIiVEmJmTwj+ECLknQYYdjzQyP0mxgJNEjPcHk2uoFzbqGsPE0Z7TUkAFYlDkDfr875vynCHPsJ06ZOJZyN3mYs4oVBVkIARdsrCkQJn9H0QkQkxAUCqO8YcgZAh-CQCKPWECdzcDNAsJiFAMAboFUSMUVuOw1kAE5FSsuZdcsIhLiVlHIGwDpo4BJkvcG8UQpwjGJU5QS4g5IMh8vIAOFIwzZytm8BiVuryOr+AyDMsANLojYviSKiw4qUkQi+VK-ggJ+V2JRPodEWJmmuLJZIB5pwHQ7AYM0JZsQEDxLDIqXAZqfmKHibMs1mC8U3OIPKu8Qr+hgrKBcsETTKXUtpUgelKhGXPKQPEv02aYBMsVCW95bqnlep9QoeJEhsVBvIIC0NGERURpBbMk1OgzVpMtdahVdJlWuseR655tE3n9BIJuBgErIjaoQL07NWJ4l7LAN4vxgT+iuTKIqbNmQdgyTYg2JdMkFC5NFUU6C7hMjmEkGG1Vm6YDbsvTsc2-hJB5OEPmz0Dci3kFdZEMsPaY38sVfSG1pMZAuvLcOytxRfVhpbQ2-1CBA2ovcZ4ldiU13xMxXW1dATJldKTReq5WT-S5IKeekpZRGmkZ0Xogx076nUfKQIDAmAgA">Fix Code</button>
</div>

Fine, except that multiline string was fugly. It's good to know that you can pass partials in as strings, but unless you're loading those strings from a template file with AJAX, you'd probably prefer a neater way.

There are two. Firstly, you can add partials as `<script>` tags on the page:

```handlebars
<script id="item" type="text/html">
  <li class-done='.done'>
    <input type='checkbox' checked='{{.done}}'>
    <span class='description' on-click="edit">
      {{.description}}

      {{#if .editing}}
        <input class='edit'
               value='{{.description}}'
               on-blur='@context.toggle( ".editing" ), false'
               on-keydown="@.enterExit( @event, @context )">
      {{/if}}
    </span>
    <button class='button' on-click='@context.splice( "../", @index, 1 )'>×</button>
  </li>
</script>
```

> Note that the `id` attribute is the name of the partial, and that the `type` attribute is `text/html` (though it could be anything, as long as it's not `text/javascript`). This is a convenient way to quickly test ideas out on a blank page (you can use these script tags as main templates as well as partials - just reference them as e.g. `'#myTemplate'` in your initialisation options).

Or, you can use an _inline partial_. Inline partials are declared within your template, using the `{{#partial myPartialName}}` syntax:

```handlebars
{{#partial item}}
  <li class-done='.done'>
    <input type='checkbox' checked='{{.done}}'>
    <span class='description' on-click="edit">
      {{.description}}

      {{#if .editing}}
        <input class='edit'
               value='{{.description}}'
               on-blur='@context.toggle( ".editing" ), false'
               on-keydown="@.enterExit( @event, @context )">
      {{/if}}
    </span>
    <button class='button' on-click='@context.splice( "../", @index, 1 )'>×</button>
  </li>
{{/partial}}
```

Add the partial to the template, and remove it (and the `var item = ...` bit) from the javascript code.

> In addition to supporting partial strings, Ractive.js will accept a pre-parsed template in the `partials` map, or as the `template` option, for that matter. Pre-parsed partials have the benefit of not requiring the parser at runtime, which means rendering can happen a bit faster - and you can ship a lighter-weight version of Ractive.js to the browser (see the runtime-only build).

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAZAPa5h5dwDNyAJoWYF5cznyCrJHAwADECMHk2sFeGBh2rA48Efa5uACuwghJ7vkw5PwMisWSTFYMKuRgCDA2kfZc2RkxnAmiYGlCnGIS0mwgOMLwpEzk5pbW5NQVCADu5ABKFlakCAAUwLQwGbhMLJDkAOSnzAi4l1hHAuRaSqrqCBeXsQrKagoPJ78F5IdQMC6HY7A8j2ZL9LwXADaQJeeWAFSqnyuriYMG0tFol28rmIuFwKmKOKQ2geWl0WMucJCtPcq34LQhdL0XwARoViOzhMJaZVql8APLzCm00RqIXEXzEDlXADC7ku5AwmseUNRmXRooZAGUjeQALIC-is8gAKXcYH4wnc-FpOm5VyZ9ywPjZyvRboZehgTpd3pQ1n4ADlMV8catWvxRAhab4qsQVNpo2KrgB1BoqDVa7AomH6jHZy6uYoAcXM-CQxQAImR3DAk8nvQGvp6Wb6YJyu1c+cIBQghSKY1czTAAHTkOPaFoyuUjxXKyuuFWFzUl+wAXRL6ShGAAlABuCYgUTwTBAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAZAPa5h5dwDNyAJoWYF5cznyCrJHAwADECMHk2sFeGBh2rA48Efa5uDFs-AyKCGnkALQ+AO78CDDkBUUl5AB07jV1aRn2XNkZMZwJomBd-FxiEtI5YxNSMlQGTTYgWrr68sam5pbWttFxxP4tOnrk1OfkAOQARgCuwsS1wsKXo-bkDcAtS2kxLaJqZ6HYh1cgAfnIAAMsOQACRfAEMIG+EEwDCQ8iQK6vdL7BAqYQIQ6tE4IM4XS7JYa4HEZD4xH64+wxfGEt4yT4tXzFYgqbQAOWKpWwnJQ1n4gpKvy+wluvhRRnBULhMrlCvRmOx7IGh1G43EczYIBwwngpCY5G2VlIZOo5FqVXIACULNaEAAKYC0GAZXBMFhYy5+5gIGlYb0CD4KZRqBSB2LR1TqBCXcM+-gfJDqBhYr3pj72KkhYRYgDaEYz5DywHtQsDriYMG0tFol28rmIuFwKjJDaQ2lTqz0gaLYeqtRguaHCEDdweTxeMKWgYA8tse4PEcjUYGAMLuS7kDBHtORquZGvLq4AZWv5AAso9+O1yAApdxgfjCdz8QekkcpIO7QTlO-5XHoMDfr+MJijaEp1lcDZVDACD8KIKYwtyii8gKCGXAA6gwKgqIex7YBWBYXrWJT1mSADi5j8EgZIACJkO4MDoRh04AdSQEdJODQ8Vcc6PAgzyDlelz3jALTkEh2h1JugIPCidT1q4u6kUeFHngAurp6TphgACUADcxogKI8CYEAA">Fix Code</button>
</div>

That covers breaking templates into more manageable or logical chunks, so moving on to reuse, we'll grab our handy bag of contrivances and pull out... a formatted name. It's a bit simple, but it should suffice.

Suppose we have a webapp that deals with people, businesses, and the yachts that they own. All three of those happen to have names that we'll say are broken down in slightly different ways. A yacht just has a name. A business has a name and a potential classifier, like LLC. A person has a given name, a family name, any number of middle names, and a potential suffix. A yacht is also owned by a business or a person, which, as we've established, both have names. (We're gonna go ahead and pretend that most yacht owners don't have a corporate entity to hold their yachts.)

What we want to do is take our list of yachts with their various owners and display them in the table. Here's a partial that would work with each type of entity:

```handlebars
{{#if .type === 'business'}}
  {{.name}}{{.classifier ? `, ${.classifier}` : ''}}
{{elseif .type === 'yacht'}}
  {{name}}
{{else}}
  {{.familyName}}, {{.givenName}}{{.suffix ? ` ${.suffix}` : ''}}
{{/if}}
```

Now we want to use the partial for both the yacht and the owner, but the owner is a property of the yacht. We could use a `#with` block to set the context for the owner partial. It turns out that's a pretty common thing to need when working with complex apps with lots of partials, so Ractive.js has a sugared version of a partial that accepts a context after the partial name:

```handlebars
{{>name .owner}}
```

> This is roughly equivalent to `{{#with .owner}}{{>name}}{{/with}}`, but not quite exactly the same. For reasons that will become clear in the next step, the `#with` portion of the partial with context is wrapped around the template of the partial and not the partial mustache itself.
>
> If no context is supplied to a partial, then it inherits its context from its parent.
>
> Partials may also set aliases instead of passing a context, which is convenient if there's more than one bit of data that needs to be uniform going into the partial. For instance `{{>user .homePhone as phone, .workEmail as email}}` lets the caller of the partial specify what `{{phone}}` and `{{email}}` should mean inside the partial. Again, this is the rough equivalent of the similar `#with` construct, `{{#with .homePhone as phone, .workEmail as email}}{{>user}}{{/with}}`.

## Step 4
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAZAPa5h5dwDNyAJoWYF5cznyCrJHAwADECMHk2sFeGBh2rA48Efa5uDFs-AyKCGnkALQ+AO78CDDkBUUl5AB07jV1aRn2XNkZMZwJomBd-FxiEtI5YxNSMlQGTTYgWrr68sam5pbWttFxxP4tOnrk1OfkAOQARgCuwsS1wsKXo-bkDcAtS2kxLaJqZ6HYh1cgAfnIAAMsOQACRfAEMIG+EEwDCQ8iQK6vdL7BAqYQIQ6tE4IM4XS7JYa4HEZD4xH64+wxfGEt4yT4tXzFYgqbQAOWKpWwnJQ1n4gpKvy+wluvhRRnBULhMrlCvRmOx7IGh1G43EczYIBwwngpCY5G2VlIZOo5FqVXIACULNaEAAKYC0GAZXBMFhYy5+5gIGlYb0CD4KZRqBSB2LR1TqBCXcM+-gfJDqBhYr3pj72KkhYRYgDaEYz5DywHtQsDriYMG0tFol28rmIuFwKjJDaQ2lTqz0gaLYeqtRguaHCEDdweTxeMKWgYA8tse4PEcjUYGAMLuS7kDBHtORquZGvLq4AZWv5AAso9+O1yAApdxgfjCdz8QekkcpIO7QTlO-5XHoMDfr+MJijaEp1lcDZVDACD8KIKYwtyii8gKCGXAA6gwKgqIex7YBWBYXrWJT1mSADi5j8EgZIACJkO4MDoRh04AdSQEdJODQ8Vcc6PAgzyDlelz3jALTkEh2h1JugIPCidT1q4u6kUeFHngAurp6TphgACUADcxogKI8CYEAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwAJjYAZAPa5h5dwDNyAJoWYF5cznyCrJHAwADECMHk2sFeGBh2rA48Efa5uDFs-AyKCGnkALQ+AO78CDDkBUUl5AB07jV1aRn2XNkZMZwJomBd-FxiEtJsIDjC8KRM5OaW1uTU5LVV5ABKFlakCAAUwLQwGbhMLJDkAOQXzAi4N1inAuRaSqrqCNc3sQrKNQKZ6vfjvJDqBjXE5nMHkezJYZea4AbVB7zywA2xR+t1cTBg2lotBu3lcxFwuBUCHI+KQ2meWl0uJuiJCjPatRg0KZel+ACMAK7CYi1YTCRlNFkAeWW1MZojU4uIvmIdV+AGF3DdyBhdS9YRjMlipb8AMpm8gAWVF-Ha5AAUu4wPxhO5+IydHzbmynlhqlyeV6WXoYG6Pf6UNZ+AA5HG-fFVGAIfiiBCM3zFYgqbRxkq-ADqDBUKh1euw6Phxux+bxNIA4uZ+EgaQARMjuGBp9P+4O-X0cjrchq8llCkViiX+023K0wFq0hhVbR1BVKkWq9V41wasu6yv2AC6lYrhvIkiYVmLwmhB9wM5uBQABgASYAtYMYcpSp9pEFn+xWRSb8cRuX4YhaKU-wNN4qxucdRQQcUQJKMDbggqCMAgxUGGVTd6gAfnIJ9-TfFocLwtUYAwJ9yGueh6Ggu8blDcMUPTcD30zRRs1zHE0n9CCowOWN+Kw99hEFXxVSMcgiNosjJOk4gjBouj4RARiMBuE9QQwABKABuGYQFEeBMCAA">Fix Code</button>
</div>

That last contrivance was a bit stretched, so let's stretch it a bit further and see if it breaks. We want to future-proof our webapp in case some other type of entity should arise to be involved with our yachts. So we decide that we want to create a specific partial for each type of entity:

```handlebars
{{#if .type === 'business'}}
  {{>business-name}}
{{elseif .type === 'yacht'}}
  {{>yacht-name}}
{{else}}
  {{>person-name}}
{{/if}}
```

Perhaps that's a bit better, but it's not very expandable _or_ pretty. As it turns out, the name given to a partial mustache may also be an expression that evaluates to a string. So we can go ahead and replace our wrapper-partial with something simple:

```handlebars
{{> `${.type}-name`}}
```

> When the expression evaluates, it will return a string, which will then be used to look up the appropriate partial in the registry. Partials check for a matching name before evaluating as an expression, so if you an expression that could also be a valid partial name, the partial name will be picked rather that the result of evaluating the expression. For example with partials named `user` and `larry` and a property `user: 'larry'`, `{{>user}}` will use the `user` partial rather than the `larry` partial.

Now when it turns out that we need to also keep up with buildings, that for our purposes include a street address in their name, we can do so easily by adding a new partial named `building-name`:

```handlebars
{{.name}}, {{.address}}
```

I think that contrivance has snapped, possibly in more than one place, but hopefully it was served its purpose.
