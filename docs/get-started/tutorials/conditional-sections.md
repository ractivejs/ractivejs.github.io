# Conditional Sections

Often, you want to show or hide part of your view depending on whether a particular condition is met. For example you might want to show a slightly different view to users depending on whether they're signed in or not.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEAhAFpn5RQmHCGacgDMAexhyYWIUfmRnYn5yAFdhBBhhclc+QQdJNgB1BBVRAI9yACMLAGsscmBgeMT+Bg8MDEcuTLtWdKdXd09vX0Dg-gD+Z1DwyOi4hKSU5zT7AkyACWItMESER3IABRUEBgTyAgZyMBgEP2oAcgBiS-Ih51EVYlFSq4ABADpR-gBJfgAFABKS5sH6UfhcBgcTitSGcMQSaRsEA4YTwUhMcjmSzWcjUcgRADu5AAShYrKQEADgG1cEwWJByDd6cwELhLlg6UpVOoEEyWTy1ApOW0kOoGEzaTFyLKfsh-ky-AwVAkuTLZYNcABlMIRJCKrQwWI2GXYARyvWGvyxfi4obkYGVC3keyYgb1BD48iSGAFaQA5kAUX4CmC2gCsWCNRgdUKuACIT1EM5zJxlIQAH1lfw7kCANx2dKy9PWb7smltWWymNx-mEz3q+zVpNjA38Jm4Y0IJsyata3Vt60qhJV8gYAsujACCf5zBAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVzBgAYmIAzcsOIp+yAJL8MDDtWXAIAQgBaCPJFBGFhBjRyVwB7GA8vHyQI4n5yAFdhBBhhcii+QRCCSTYAdQQVURTY8gAjCwBrLHJHQuL+BljAsK4a4MdON0Dg8ec3cn4U3ABlTL8AoMr7cKiYuISk1PTF-gjPb2QcvL6SsoiK+22agAliLTBihDDyAAUVBAYRXIBAY5DAMAQrmoAHInNDyClTqIVMRRB0YQABAB0534-gAFABKaFsXGUfhcBgcThjSoTKabLhiCTSNggHDCeCkJjkcyWazkagLBAAd3IACULFZSAh8cBgrgmCxIORYYrmAhcNCsAqlKp1AgVWq9WoFNrgkh1AwVfK8uR7bj1irXAwVEUdXb7YsVmskP4VbgYPkbHbsAIHZl-cl8vx+YjyESeuHyPZucdBghBeRJDBmtJ8aqAKL8BTpbQpfLpG4DFq4FIZbzk7WqvnShAAfRd-HhhIA3HZKvbW9YcZq5cF7fbqxmVTWEB77JOG1ko4HgwuZJPvasLn7+M7XUUJ+QMH3k5tT73MEA">Fix Code</button>
</div>

In this example we've already set up a mock sign-in mechanism – click the 'sign in' button and enter your name in the prompt.

All we need to do is hide the 'please sign in' message when we're signed in, and the 'welcome back!' message when we're not.

Wrap the first block in an `#if` section that uses the `signedIn` property:

```handlebars
{{#if signedIn}}
  <!-- message for signed-in users -->
  <p>Welcome back, {{username}}!</p>
{{/if}}
```

Now do the same for the other block, except with the `notSignedIn` property. Execute the code.

> The plain mustache block `{{#...}}` is equivalent to `{{#if ...}}{{#with ...}}`. It is both conditional and contextual.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVzBgAYmIAzcsOIp+yAJL8MDDtWXAIAQgBaCPJFBGFhBjRyVwB7GA8vHyQI4n5yAFdhBBhhcii+QRCCSTYAdQQVURTY8gAjCwBrLHJHQuL+BljAsK4a4MdON0Dg8ec3cn4U3ABlTL8AoMr7cKiYuISk1PTF-gjPb2QcvL6SsoiK+22agAliLTBihDDyAAUVBAYRXIBAY5DAMAQrmoAHInNDyClTqIVMRRB0YQABAB0534-gAFABKaFsXGUfhcBgcThjSoTKabLhiCTSNggHDCeCkJjkcyWazkagLBAAd3IACULFZSAh8cBgrgmCxIORYYrmAhcNCsAqlKp1AgVWq9WoFNrgkh1AwVfK8uR7bj1irXAwVEUdXb7YsVmskP4VbgYPkbHbsAIHZl-cl8vx+YjyESeuHyPZucdBghBeRJDBmtJ8aqAKL8BTpbQpfLpG4DFq4FIZbzk7WqvnShAAfRd-HhhIA3HZKvbW9YcZq5cF7fbqxmVTWEB77JOG1ko4HgwuZJPvasLn7+M7XUUJ+QMH3k5tT73MEA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVzBgAYmIAzcsOIp+yAJL8MDDtWXAIAQgBaCPJFBGFhBjRyVwB7GA8vHyQI4n5yAFdhBBhhcii+QRCCSTYAdQQVURTY8gAjCwBrLHJHQuL+BljAsK4a4McGosDg+3ComLiEpNT0-hT+CM9vZBy8vpKyiIr7WZqACWItMGKEMPIABRUEBiLyAgZyMBgEV2oAcicf3I6wiohUxFEHX+AAEAHRbfj+AAUAEo-mwEZR+FwGBxOGNKo5OG5ptjOGIJNI2CAcMJ4KQmORzJZrORqOQfAB3cgAJQsVlICCRwGCuCYLEg5ABYuYCFwfywoqUqnUCEl0uVagUCuCSHUDElIry5BNCL8-ElrgYKiKAhN2DtGW8-kt+X4LPW5FRPUd9gZq0GCDZ5EkMGa0iRUoAovwFOltCl8ul9gMWrgUk68rkFVLmQKEAB9K38IEogDcdkqJrz1nhcuFwRNJpTgclqYQiqrTbNSBdWhg+RsXYw5cdQQC5cwQA">Fix Code</button>
</div>

Having two properties (`signedIn` and `notSignedIn`) to represent one piece of data (whether or not the user is signed in) is the sort of thing that makes most programmers itch uncontrollably.

We have a couple of options. We could use an `#unless` section:

```handlebars
{{#unless signedIn}}
  <!-- not-signed-in block -->
{{/unless}}
```

> There's also a plain mustache for negated sections, `{{^signedIn}}...{{/}}`.

Alternatively, we could use else:

```handlebars
{{#if signedIn}}
  <!-- signed-in block -->
{{else}}
  <!-- not-signed-in block -->
{{/if}}
```

Update the template. Then, remove the references to notSignedIn in the JavaScript. Then breathe a sigh of relief – doesn't that feel better?

> If you have another branch in your conditional, you can include it with an `{{elseif ...}}` mustache. An `{{#if}}` section can include as many `elseif`s as you need, but it can only contain one `else`.
