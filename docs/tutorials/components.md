# Components

If you've used Backbone Views in the past, you'll be familiar with the basic concept of _extending_ the _base class_ to create a new _subclass_ with default data and additional methods.

## Step 1
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5UWuHDqAcmEqqCYWAB7AHcPPkEZckcKFwY3T0UGYn5QuwjySIZnV3cPSRgEUlCRSQZ+NgAyNQBHAFcAgG4uYRKyrgYw+3T0qKzYnISkgFpiBLQPVK7J9OEdFX0PACMLAGsUGACa-iRh0YRIchqYFQAKAEp6lPDJrh4OtIzeuI9+Y1wi5tKK81qGppaOTjtCaRbhkO7AnoxJ6iBjSYgBZJ3a6SAEoiGg3ipG5goScMQSaRsEA4YTwUhMcjmSzWcjUcgvILkABKFispAQx2AtBgAnSuCYLH2HgAxPzmAg3lhubytEpVOo9uQRQplGoFB4pTz+OkkOoGPsuVrJpxOOR5aIEIEVEgEDBKLtyLr+dLtV0Rgw0AaXVNyMIYKIhZwRihOChiAAzYScPIBBZzRQAOjD4Y13qmMLhCKFABUYNokigtAFyEEAjBluQNjJMjG40pyAxwwo7bgwAhyABWVvkQKHcZGroYNNDrUYc7EkCieAJ7y+fzBchc8KSALCYhWLOUhBq6z1VJBKit-YARgADKeAKR78Jt4goMC4E-nq+pBYBIyDNcALwL+zfMBtGBBjfIxr3sEokBIfgUH2U9yDggBmetTzA1sEDvB99gATlPUgwGvIdBH4GcfBtedGQTF4TCwcgSLnQIKLyApF1SFc1w3fh9gYBZhACFQagUVDcACSRYNQt9cGExQxNfd9P2IH9oL-MtAOA99UJqYRbU-bcEEsfZ+ARBBUIPJAj3IAAmJQhNeQYGB8FBOOcBB+GbVDREOXiYH2Fckjc1JRD4st9mFBgwtQ8MEVweSv0VY9rIEQi6LIhjaKox9AnZGApWI2cUoXBMmNISBMttFjwiWURVnWTZtkClRgvIYUEBagi7Fy0i-FSyjXnK+wJHvR94PElTtLmJsT0kIxfT4qgmsgpA2qI5KuoKoq+twcahpQ2SAO0gbMPIY8ppm0j5sgpaBBW8i0t6j5+Bo67uvW+6NpIZo1G0P8Gqq1CfBeQZb0GmTwmE0TO0vVC2PXeEnO43j+ME-dDzAJ9IcS9qnoKgZtSXcDVxhzd8h3dkRo-b9f3If9VJAqGGEgym4KsxQTJRtGXxvdDgaO59xJWNYNi2QZ6sa4VwwAFgliXLo6+jscSfgdg9ds8dwSrqsF7Zv0VQLXIVvmqoF2rBmhjj9gtVzbQNjXjfyPR1AMgJBjthB1FZszUZ59HOYwoaz29wirry1aKIzDiNoUEw7IcpyLf8-gMEwIA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5UWuHDqAcmEqqCYWAB7AHcPPkEZckcKFwY3T0UGYn5QuwjySIZnV3cPSRgEUg9yAP4AWhdiUQBrAxQA3ACAClEAVxh8-hlS8gBGAEp2EUkGfjYAMjUARxaAgG4uYWHRrgYw+3T0qKzYnISk0uIEtA9UjbP04R0VfQ8AIwsqlBgAlv4kA6OESHI2lUb6YDAQ4MNAAOmEMFEGAw9D6sxS4TOXB4azSGW2cQ8-GMuCKJXKPmqtXqTVa7QQnXIAGpegMQBxFiNxuZpnMFksOJxVqdItwyKieVsYpjRAxpMQSgj1hsCJI2IDgWDReKStCuHLBXzeKlkfyhJwxBJpGwQDhhPBSExyOZLNZyNRyNiguQAEoWKykBCNYC0GACdK4Jgsb4eADEgeYCFxWF9-q0SlU6i+5DDCmUagUHhjfv46SQ6gY3x9ObOnE45ETogQgRUSAQMEon3I+cDsdzG0VyeLcbOENEIc4hxQnBQxAAZsJOHkArdropQaOx1m2+dnGKrCUQwAVGDaJIoLQBchBAIwKrFFoyTLT2dKcgMMcKBu4MAIcgAVhf5ECbROJY2ML-oBAgYHCpogKI8Dgj4db+ME5A+uEkgBMIxAbvw3z5Bm1izKkQRUC+3w9AADMRACkuHhK+xAoGAuBEaRFGpLcARGKUqEAF77t8LEwHWMClCxRiUfYwxICQ-AoN8xHkDJADMd7ESJL4IDRdHfAAnMRpBgJRMKCPw0G+HBzqgtiJhYOQRmwYEpl5AUCGpMhqHod8DC3MIAQqJeCDKQ0kjScpLG4A0iiBcxrHscQXGSTxp78YJrHKS0wj1uxCDXJY3z8CUvl4QRYDfAATEofk4qUDA+CgGHOBST7KWSnkwN8yFJPVqSiF5p7fKGDB9cpY4lLgUUccmPSlSBAjWX4tlWeZ9GBJ6MAxoZ3jGbNoL2aQkCLfWjnhPc1RPC8bzlF1zXkKGCDXXpdirTBM3wWZOL7fYEi0fRslBfFaXXI+RGSEY5CeTBl3iUgt0GdNJlWVtr24H9n1KRFfFpe96m9IDwNeVQYPiZDU1rTZT3zcDSyWdDG1w4yuaIfYJCLGo2g8SoATVMpPjYqU1EfeF4T+d877kcpzloRKNXuSDPnKfhSCEb0jEE-d61PXstNOShYubtaGXqDhEVsZx3HkLxCVCSLDDicbMklYoMsFQxwupDzGMkU7B0PMdrzvJ1rMXaGY4ACxB0HSuU6riRlJ28OHY8zzeyNyadZ0kdBZ78enaLrm1Z09Zp0dGfvPkejqNlASlMXCDqPbcuFQr7v2C7n1u0x-D6YTD0w6CyrofDCgmBVVU1VWucwHpmBAA">Fix Code</button>
</div>

In this tutorial we're first going to learn about Ractive.extend and use it to create an image slideshow, using gifs from [devopsreactions.tumblr.com](http://devopsreactions.tumblr.com).

We've got our basic template set up – we just need to make a few additions. First, we need to add a mustache for the image URL:

```handlebars
<div class='main-image'
     style='background-image: url("{{image.src}}");'>
</div>
```

  We're using a CSS background rather than an `img` element for this example, because you can use the `background-size: contain` CSS rule to ensure that the image is shown at maximum size without distorting the aspect ratio.

Then, we need to add a mustache for the image caption:

```handlebars
<div class='caption'>
  <p>{{image.caption}}</p>
</div>
```

Finally, let's add some event expressions that we can fill in later:

```handlebars
<a class='prev' on-click='@.goto(current - 1)'><span>&laquo;</span></a>
<!-- ... -->
<a class='next' on-click='@.goto(current + 1)'><span>&raquo;</span></a>
```

Execute the JavaScript to redraw the view, with the placeholder data that's already there.

## Step 2
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvWEAbKgmFgA9gHd65XAE9JCOngQAPXJxgNRuMgnYDauImXKiFDYcOoByRctWa3nyCMuTOFG4eXt4AtgzE-EEOoeRhDK7unj6SMAik3uRq-AC0bsSiANZGKGq4agAUogCuMLn8MsXkAIwAlOwikgz8bABk7gCOTWoA3FzCg8NcDMGOqanAwADExABmlHFowgDaza0I7QC6GBjhGVE+cQnFxAcI3slrn6nCegqG3gAjKwVFAwNRNfhIZ6vSDkFoKer0DYvBiHE4tNq4C4AOmEMFE13oPWmSRCny4PDYG04u0JZLWBHSkSy3n4plwBSKpSUlWqtQap0x5AA1N0+iAOPMhqNLJMZnMFhxOMsPmFuGQVqx6bdmdFRAxpMQiqTVgzJFTgCi0YLzljsfrDUVrlxzaqKRrku7eEJOGIJNI2CAcMJ4KQmPtUSpyNRyEdaDBksByHjRLDvDSYihOChdsJODk1AC-jFsTmdt4sK4DTYimmACowXQJFA6NTkDRqGAVQpNGTpAtFhAxcgMHa4BAwHRgBDkACsuDA5HULQK2HjieT+LTGazZbzok8pd2Farjv49cbzdb5B2xBMybUMQQRRnCAUwjstF85AAwgBlP9VywdcQiTFNtxeXdcxpBAj3LSsHRrc9yG8OsVBsfgWwSccYB2KwZyKcgAEl2gnNkZAAURMSQFE7CcgJAxwwK3FCd2zaCNAAZlEOCT0Qo1kNQy9MOvUQ1CQGc6nIAB1Tif2TXAhiQJgkGEBiE1AzdU1YyD2J2PMASaYgFCQXiEOrAS0wANWIYRiAwlsFxnFAml0dt1HbMFxynGdDOMpBk3EKRcDU8g1w0pitIgzM9LzccfjM08kLTIjyCQIpaC-GQ2WQa94pkBcGFwbEZLAIqq34chJDUTxiCLNyak8ooUAAflXECLmmRiNLDSc-yUCSAg0aNyAAJSsGxSFg9lziQepgEY8xOGTJoi31TwqrBAwYBsKMlPIJ8F3E4RyEa6dchAjBiW6gReuTAaVHUYaYzZYb+v8J75sWzhloSH4hlEGcC223aTrOic7A0q7piDEBRHgXEHqG8gFpCaq7OS8hcncSaEC6kINCoBdYS6AAGUmAFJ8ccadiBQMBcBJ8mqeSAE1BMYo7IAL2bWE2ZgCSYGKNmTGp3BBiQEhMNhUnyFlzihzlsXafpxnyAATlJ0gwHxjAHH4RGPs0chsTZMxK0NwanpNnI8hR5J0fsyyRwBYQ1AUXs8eSOpJBlsW2dwOoYj91n2c54geel8h+cF4X2bFpoPyFj8-msWF+BfMXCaQYnyAAJiHMXxzMYoGCUFBkMB0iYDF043ZgWFquwida-dztYU2Bgu7FnYilwcOuYQEnC4EPWDb8K3jdN9lIHUKaYGA8eket7FbdIWe1Hn+2QiBSpQXBSFSjbhvyE2BBz91-XLceqezZkVHHAkVWQ53ztY7+McScke83YG0-JaQJfQQS8jbDVXrkCgD9cAfzVqTf2b8JzFCfgzL+P93ZUH-pLIBAhr7I2nmYZMCwLYTxvmAtehChjb0cCQeY7hdB81opUMWSg2TFBVigpW3s1C+znJTMWjtMYMFdu7T2WciZgCZnw0eV8SF4MeJVKBAjnbYyKrYeBHNua82jggoWIt+EMEllo2WBcYhiJzhI7ozNlYIDphwsmUid7An3hCKEYlaIn02DsAALN47x2CQGTzAfI6EkYqG4F3iCMELiB5D1cH3eI-B-ZOKiYfJRtZXC2hbqzZJB8oS5AMEVdOagkEIAKbgMxud7EsxCOwtWVT-G4JXvxQiUDi79zLnTSumSa6j0wEAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvWEAbKgmFgA9gHd65XAE9JCOngQAPXJxgNRuMgnYDauImXKiFDYcOoByRctWa3nyCMuTOFG4eXt4AtgzE-EEOoeRhDK7unj6SMAik3uRq-AC0bsSiANZGKGq4agAUogCuMLn8MsXkAIwAlOwikgz8bABk7gCOTWoA3FzCg8NcDMGOqanAwADExABmlHFowgDaza0I7QC6GBjhGVE+cQnFxAcI3slrn6nCegqG3gAjKwVFAwNRNfhIZ6vSDkFoKer0DYvBiHE4tNq4C4AOmEMFE13oPWmSRCny4PDYG04u0JZLWBHSkSy3n4plwBSKpSUlWqtQap0x5AA1N0+iAOPMhqNLJMZnMFhxOMsPmFuGQVqx6bdmdFRAxpMQiqTVgzJFTgCi0YLzljsfrDUVrlxzaqKRrku7eEJOGIJNI2CAcMJ4KQmPtUSpyNRyEdaDBksByHjRLDvDSYihOChdsJODk1AC-jFsTmdt4sK4DTYimmACowXQJFA6NTkDRqGAVQpNGTpAtFhAxcgMHa4BAwHRgBDkACsuDA5HULQK2HjieT+LTGazZbzok8pd2Farjv49cbzdb5B2xBMybUMQQRRnCAUwjstF85AAwgBlP9VywdcQiTFNtxeXdcxpBAj3LSsHRrc9yG8OsVBsfgWwSccYB2KwZyKcgAEl2gnNkZAAURMSQFE7CcgJAxwwK3FCd2zaCNAAZlEOCT0Qo1kNQy9MOvUQ1CQGc6nIAB1Tif2TXAhiQJgkGEBiE1AzdU1YyD2J2PMASaYgFCQXiEOrAS0wANWIYRiAwlsFxnFAml0dt1HbMFxynGdDOMpBk3EKRcDU8g1w0pitIgzM9LzccfjM08kLTIjyCQIpaC-GQ2WQa94pkBcGFwbEZLAIqq34chJDUTxiCLNyak8ooUAAflXECLmmRiNLDSc-yUCSAg0aNyAAJSsGxSFg9lziQepgEY3BxxiGiioQNNNj8Qb1A0CtFpqOpYR2CFrAE8h6koSFTHIHpyAWiLWFwXqI0OEaF1s0sEFwC7vCtFQCmJRbHCB8xOCXJS-k8g0RzBCEkBB57+CaYcYwuhIJPvUU-uEbE-kwhcbvIABSF6VFx84UAXLqHuBmmlrAD6P2+lCbXaE8keHQGHvC5JlMUo6TqQ87bvu5JHFyXAWkqpNWdwWEAAYwsWjAQIwLmHB68MtpUHaRrZYb+v8Hb5sWxTmC+jazZYPaHr5hhYVFkJHGx2FseV1WeiDEBRHgXEBp1zQ7uSaq7OS8hcncSaEC6kINCoBdYS6eX5aJmPHGnYgUDAOXumT1PkgBNQTGKOyAC9m1hQuYAkmBikLkw09wQYkBITCFfIRXOKHDvG4zrOc4ATnl0gwBjlXBH4P2jcD7E2TMSsp+2mecjyIOQhD+zLJHAFhDUBRe2j5I6kkBXG8LpbH1Pgui5L4hy7b8gq5ruui8bpoP1rj8-msWF+BfRu45IATuQAATEORu44zDFAYEoFAyFRC2gnI3U4u8YCwmqthJByQxK0TQeQTYDBCGNx2EUXAt9S7rW6OAgQ49F4B2GrPdkkB1BTRgMBSe2shrkGxCvUgzC1CsLXo4IElRQTgkhKUPenZYSbAQHIseDgOH+y4YwswQjcASH7lfEIT8JzFD+GOROkh7y7wGvgluSAFETzoSo3h6iDE53lmfTsz9NHZyMSYveVBzEtysQIGxutVEyClPwBenDAl2JCeokg8x3C6ErrRSojclBsmKH3dxPcj5qBPnOFOjcN5hwYDvPeB8AHxzAInPOfilHTwYY8aWwcaqb1rOHN8RVbDOOLmXCuj8XF6PrvkhgLcemKzATEMpQCKm5zyckdJOck4zJ0cCMRcNJG4JkTsAALFsrZ1SAkz3qdCSM6iREglhhIsulCxLtHiPwM+yzzlQgKVvBBpEYD3NEY84ouQDBFV-mob5CBfm4AmcAhZ+cQhzMqYs8e-jwkz34oRBaIRIFkJgZneBiD3k0MwEAA">Fix Code</button>
</div>

Time to create our `Slideshow` class:

```js
var Slideshow = Ractive.extend({
  // this will be applied to all Slideshow instances
  template: '#slideshow',

  // method for changing the currently displayed image
  goto: function ( imageNum ) {
    // goto method goes here...
  },

  // default data
  oninit: function () {
    // return the default data for the component here
  }
});
```

Each `Slideshow` instance will have a `goto` method in addition to the normal `Ractive` instance methods. We'll also provide default data for the component, notably to start with the `current` index as `0`.

> When providing data for components, you should always use a data function that returns a data dictionary. If you return the same object from each invocation, then all of your component instances will share the same underlying data, but the properties won't necessarily be kept up-to-date across instances.
>
> Component data and instance data is combined into the final instance's data dictionary starting with Ractive default data, moving through the component hierarchy, and ending with the data supplied to the instance constructor.

Let's write our `goto` method:

```js
function ( index ) {
  var images = this.get( 'images' );

  // handle wrap around
  var num = ( index + images.length ) % images.length;

  this.set( 'current', num );
}
```

Let's add some code to instantiate the slideshow with our gifs. There's a ready-made images variable you can use for this step:

```js
var slideshow = new Slideshow({
  target: '#target',
  data: { images: images }
});
```

Go ahead and execute the code – you should now have a working slideshow.

> Needless to say, you could add as many bells and whistles as you wanted – fading or sliding transitions, image preloading, thumbnails, touchscreen gesture controls, and so on.
>
> You could, of course, just use an existing image slideshow library. But then you would have to learn that library, and potentially submit to its design philosophy.
>
> Ractive.js is all about flexibility. If you want to change the design or behaviour of a component (say, adding a class name to a particular element), the power to do so is in your hands – the template is easy to understand and tweak because it's basically just HTML, and the view logic is straightforward.
>
> It's better to be able to build your own solution than to rely on developers maintaining high quality and up-to-date documentation.

## Step 3
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvWEAbKgmFgA9gHd65XAE9JCOngQAPXJxgNRuMgnYDauImXKiFDYcOoByRctWa3nyCMuTOFG4eXt4AtgzE-EEOoeRhDK7unj6SMAik3uRq-AC0bsSiANZGKGq4agAUogCuMLn8MsXkAIwAlOwikgz8bABk7gCOTWoA3FzCg8NcDMGOqanAwADExABmlHFowgDaza0I7QC6GBjhGVE+cQnFxAcI3slrn6nCegqG3gAjKwVFAwNRNfhIZ6vSDkFoKer0DYvBiHE4tNq4C4AOmEMFE13oPWmSRCny4PDYG04u0JZLWBHSkSy3n4plwBSKpSUlWqtQap0x5AA1N0+iAOPMhqNLJMZnMFhxOMsPmFuGQVqx6bdmdFRAxpMQiqTVgzJFTgCi0YLzljsfrDUVrlxzaqKRrku7eEJOGIJNI2CAcMJ4KQmPtUSpyNRyEdaDBksByHjRLDvDSYihOChdsJODk1AC-jFsTmdt4sK4DTYimmACowXQJFA6NTkDRqGAVQpNGTpAtFhAxcgMHa4BAwHRgBDkACsuDA5HULQK2HjieT+LTGazZbzok8pd2Farjv49cbzdb5B2xBMybUMQQRRnCAUwjstF85AAwgBlP9VywdcQiTFNtxeXdcxpBAj3LSsHRrc9yG8OsVBsfgWwSccYB2KwZyKcgAEl2gnNkZAAURMSQFE7CcgJAxwwK3FCd2zaCNAAZlEOCT0Qo1kNQy9MOvUQ1CQGc6nIAB1Tif2TXAhiQJgkGEBiE1AzdU1YyD2J2PMASaYgFCQXiEOrAS0wANWIYRiAwlsFxnFAml0dt1HbMFxynGdDOMpBk3EKRcDU8g1w0pitIgzM9LzccfjM08kLTIjyCQIpaC-GQ2WQa94pkBcGFwbEZLAIqq34chJDUTxiCLNyak8ooUAAflXECLmmRiNLDSc-yUCSAg0aNyAAJSsGxSFg9lziQepgEY3BxxiGiioQNNNj8Qb1A0CtFpqOpYR2CFrAE8h6koSFTHIHpyAWiLWFwXqI0OEaF1s0sEFwC7vCtFQCmJRbHCB8xOCXJS-k8g0RzBCEkBB57+CaYcYwuhIJPvUU-uEbE-kwhcbvIABSF6VFx84UAXLqHuBmmlrAD6P2+lCbXaE8keHQGHvC5JlMUo6TqQ87bvu5JHFyXAWkqpNWdwWEAAYwsWjAQIwLmHB68MtpUHaRrZYb+v8Hb5sWxTmC+jazZYPaHr5hhYVFkJHGx2FseV1WeiDEBRHgXEBp1zQ7uSaq7OS8hcncSaEC6kINCoBdYS6eX5aJmPHGnYgUDAOXumT1PkgBNQTGKOyAC9m1hQuYAkmBikLkw09wQYkBITCFfIRXOKHDvG4zrOc4ATnl0gwBjlXBH4P2jcD7E2TMSsp+2mecjyIOQhD+zLJHAFhDUBRe2j5I6kkBXG8LpbH1Pgui5L4hy7b8gq5ruui8bpoP1rj8-msWF+BfRu45IATuQAATEORu44zDFAYEoFAyFRC2gnI3U4u8YCwmqthJByQxK0TQeQTYDBCGNx2EUXAt9S7rW6OAgQ49F4B2GrPdkkB1BTRgMBSe2shrkGxCvUgzC1CsLXo4IElRQTgkhKUPenZYSbAQHIseDgOH+y4YwswQjcASH7lfEIT8JzFD+GOROkh7y7wGvgluSAFETzoSo3h6iDE53lmfTsz9NHZyMSYveVBzEtysQIGxutVEyClPwBenDAl2JCeokg8x3C6ErrRSojclBsmKH3dxPcj5qBPnOFOjcN5hwYDvPeB8AHxzAInPOfilHTwYY8aWwcaqb1rOHN8RVbDOOLmXCuj8XF6PrvkhgLcemKzATEMpQCKm5zyckdJOck4zJ0cCMRcNJG4JkTsAALFsrZ1SAkz3qdCSM6iREglhhIsulCxLtHiPwM+yzzlQgKVvBBpEYD3NEY84ouQDBFV-mob5CBfm4AmcAhZ+cQhzMqYs8e-jwkz34oRBaIRIFkJgZneBiD3k0MwEAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5YTpUIAtGATEUYXAYAWAAZSMFtBVgdhFSoEYTAAewB3SkUGNGEDYGAkBFIEyWEASTSMjAxNTj4Irh5q+0cKF203T29ff3oAVi7Q8PsG6Nj45NT0uKzgBBLx4XLK+oduMmquMQlpev4RcSkZKgMh3JGkzR09AwUTMwsrUhsQRcbyUTVhTIByI7jEpI-F8jkZ6vBjvagfNLEfj-OwyQFAhgvN6fSQwPIfcgJfjuV7EUQAawMKASuASAApRABXGBo-gydzkACMAEp2CJJAx+GwAGRqACOlISAG41hyuVwGAD4dkAMTEABmYwyAG0qTSEHSALrlYHI8GQ7HEUoID6w+HmwHNNzggBGFnxKBgCUp-CQ7iN40g5GpKjJ9GyHpVatpuE1ADphDBRPMQMyhTCIubaitspwFfNE-CCIiQWCPvxjLgMVicTECUSSeTgxqZABqJmsx7szk88wC4WilsSqXJ3iws1AnhI0GfUQMaTELEJ+xJyRsAPG4Sq6kh8NjidYnWcOcD3tPZZ97acdZ7NggHDCeCkJhKuLkajkZW0GCw4DOKNej5pxQoTgoBXCNuTo2m4ihhv+8ofFgLzjlYWKfgAKjA2hQigWgJOQSQJDA+KYpSMiIqiCQgUo5AMPKCgwFoXjkF0uBgOQiTUhi2DPq+76iJ+36-hBgGiO84EKlBMEbvwiHIah6HkPKxBGM4CSKAgWIIOQCAqMINi0F85AAMIAMp6SxWBsREb6Rpx5BfkaPEAWmCCCZB0HrnBYmWQhcRWPwaFQpR8oWCpWLkEUdIIDABYyAAokYqjYaFRkmfYZkfpZ3F-rZSQAMyiA5wnOZOrkfEhKFeVJogJLkUkAOoZTpzi4JySBMEgwjxS+pkcVx1lpfKgE2pSxAqEgOVObB+WfgAasQwjEJ5aH0SpKCUtomGJJhToKNRKl9QNSDOLs0gteQrFtYlHUpV1vGcAoLjDSJLmfkU5BIFitBaTIBbIFJ10yPR6hhuQlVgOoMH8OQkgJO8xAgctxJrViKAAPwsSZmpCglbUAEq3NYYZlcoyl0sIEYxMcvz3uQWOWDjhYakgZLAAluAKMoagKJ+MrfCcUGM8SpJevKLpU4FZKUK6xjkMy5AMydkTXlRgZ3g+9FTeBCC4CLHwK4dcaMwMMv2JwnCMQ1bhreOZFOi6SC67gcvkPwlKKOTItQrkcn1lrYZuF59ES+QACkt5E97KD0Wj+usBHytExp6uWdWdLCQ7Ts6zLx2wo19X84LLnkGSkvS-2uBorg1Kg2+Ce4F6QRHYzFRtRgqd2G1dvmFT9zkwWKSU3cCD04z9XMGr7ODyw3My8zqjqAgI9KFPCjjxn6gMF6hcRPYuT5IUMwZF6WvGRH0yLnvi5hjJKiUSLAv8EL-Au37b4l2X5AAH7EBGUZhq7xgAPLyhrJoJZCiOhLOuJlG7nhAKIeAxNhhkwZhEcG017rkDRKzawaMIhJCoPRL0jIghBH9pg+wXgfB+DwQQohsIbQJCMO4aaAAvVCXoaEwFyDAdwNCjDENwByJAJAvLV3IDXDKpEgiYIqIIfgsDSajDDAWEw0EZE-DkaiPIUtYRIJmmNMiNphAJBUPhBAPDSSSGrjwmhTMFLmOobQ+hxAmGCPIKw9hnDaE8MpBpDhGk3CWC9PwZSPDsFIFweQAATEoExhZ3AMBiCgVyogayhR4WqfRMAvTgx8sk2EZUVDYS9DKBgRSeHyixLgexDCZ5MkiQISRyiTjkHkYWSAiR7gwGMtIzmZMwxqNIC0hIbSNERDtASR0zpXQ4gMfk8gMoEBzIkXYTpJMVEpCaSYIZ9gJAdBscM7Cri3AUTwZIOS+iSYzP4UgBZUj6ndN6Rs3AByq7CIsXs0K7gtnkKZMc+SZyZQXKuQIG5ciFEyGEGKJRXTVFoiaGKe5JAwVqG0CwvJBIeExALG0MhTzxGwlMV6LohCeFaJQQwPRBijFBJwWAChhLamLKBasg09ziU6LQeoDBti6GMOYc415HCuFEoYPwnlNcImKEpSE6lTJKE8NIds6VtLhn2jGVbSZeT0kzPlAELVWqAVLLgXIg07pjT3JGQ6S2EzGFVLKnSBgUILHKotW6Fl8EXhJJgA60ZTr3kID0OofxCQfV+twBK0J+DFUkPaJ88NVD+CSMBZC1ZeVAoIPsFccpsSfAJPdRIzAQA">Fix Code</button>
</div>

Now we have our lovely slideshow component, but suppose we want to use it in our Ractive.js app rather than mounting it directly on an element. It turns out that that is a pretty simple thing to accomplish. We can register our component with either globally or with our main Ractive.js instance, and anywhere that the template has a `<slideshow />` element, Ractive.js will create an instance of `Slideshow` and mount it inline.

```js
Ractive.components.slideshow = Slideshow;

// or
var ractive = new Ractive({
    // ...

  components: {
    slideshow: Slideshow
  },

  // ...
});
```

Now in the template, we just reference the component as if it were a custom element:

```handlebars
<div style-height="40vh">
  <slideshow />
</div>
```

We _were_ passing the list of pictures to the instance as it was being initialized, but since Ractive.js is now managing the instance, how do we get the list of pictures to the component instance? Well, we create a mapping from the data in the host instance to the `images` keypath in the component by using an attribute:

```handlebars
<div style-height="40vh">
  <slideshow images="{{devopsImages}}" />
</div>
```

Update the code with another images array and put two `slideshow` components in the main instance.

> Mappings are automatically managed cross-instance `link`s. A link is a bit like a filesystem symlink in that the data isn't copied anywhere - it just gets a new path that points to it. Changing the data in either place is effectively the same as changing it everywhere at once.

## Step 4
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5YTpUIAtGATEUYXAYAWAAZSMFtBVgdhFSoEYTAAewB3SkUGNGEDYGAkBFIEyWEASTSMjAxNTj4Irh5q+0cKF203T29ff3oAVi7Q8PsG6Nj45NT0uKzgBBLx4XLK+oduMmquMQlpev4RcSkZKgMh3JGkzR09AwUTMwsrUhsQRcbyUTVhTIByI7jEpI-F8jkZ6vBjvagfNLEfj-OwyQFAhgvN6fSQwPIfcgJfjuV7EUQAawMKASuASAApRABXGBo-gydzkACMAEp2CJJAx+GwAGRqACOlISAG41hyuVwGAD4dkAMTEABmYwyAG0qTSEHSALrlYHI8GQ7HEUoID6w+HmwHNNzggBGFnxKBgCUp-CQ7iN40g5GpKjJ9GyHpVatpuE1ADphDBRPMQMyhTCIubaitspwFfNE-CCIiQWCPvxjLgMVicTECUSSeTgxqZABqJmsx7szk88wC4WilsSqXJ3iws1AnhI0GfUQMaTELEJ+xJyRsAPG4Sq6kh8NjidYnWcOcD3tPZZ97acdZ7NggHDCeCkJhKuLkajkZW0GCw4DOKNej5pxQoTgoBXCNuTo2m4ihhv+8ofFgLzjlYWKfgAKjA2hQigWgJOQSQJDA+KYpSMiIqiCQgUo5AMPKCgwFoXjkF0uBgOQiTUhi2DPq+76iJ+36-hBgGiO84EKlBMEbvwiHIah6HkPKxBGM4CSKAgWIIOQCAqMINi0F85AAMIAMp6SxWBsREb6Rpx5BfkaPEAWmCCCZB0HrnBYmWQhcRWPwaFQpR8oWCpWLkEUdIIDABYyAAokYqjYaFRkmfYZkfpZ3F-rZSQAMyiA5wnOZOrkfEhKFeVJogJLkUkAOoZTpzi4JySBMEgwjxS+pkcVx1lpfKgE2pSxAqEgOVObB+WfgAasQwjEJ5aH0SpKCUtomGJJhToKNRKl9QNSDOLs0gteQrFtYlHUpV1vGcAoLjDSJLmfkU5BIFitBaTIBbIFJ10yPR6hhuQlVgOoMH8OQkgJO8xAgctxJrViKAAPwsSZmpCglbUAEq3NYYZlcoyl0sIEYxMcvz3uQWOWDjhYakgZLAAluAKMoagKJ+MrfCcUGM8SpJevKLpU4FZKUK6xjkMy5AMydkTXlRgZ3g+9FTeBCC4CLHwK4dcaMwMMv2JwnCMQ1bhreOZFOi6SC67gcvkPwlKKOTItQrkcn1lrYZuF59ES+QACkt5E97KD0Wj+usBHytExp6uWdWdLCQ7Ts6zLx2wo19X84LLnkGSkvS-2uBorg1Kg2+Ce4F6QRHYzFRtRgqd2G1dvmFT9zkwWKSU3cCD04z9XMGr7ODyw3My8zqjqAgI9KFPCjjxn6gMF6hcRPYuT5IUMwZF6WvGRH0yLnvi5hjJKiUSLAv8EL-Au37b4l2X5AAH7EBGUZhq7xgAPLyhrJoJZCiOhLOuJlG7nhAKIeAxNhhkwZhEcG017rkDRKzawaMIhJCoPRL0jIghBH9pg+wXgfB+DwQQohsIbQJCMO4aaAAvVCXoaEwFyDAdwNCjDENwByJAJAvLV3IDXDKpEgiYIqIIfgsDSajDDAWEw0EZE-DkaiPIUtYRIJmmNMiNphAJBUPhBAPDSSSGrjwmhTMFLmOobQ+hxAmGCPIKw9hnDaE8MpBpDhGk3CWC9PwZSPDsFIFweQAATEoExhZ3AMBiCgVyogayhR4WqfRMAvTgx8sk2EZUVDYS9DKBgRSeHyixLgexDCZ5MkiQISRyiTjkHkYWSAiR7gwGMtIzmZMwxqNIC0hIbSNERDtASR0zpXQ4gMfk8gMoEBzIkXYTpJMVEpCaSYIZ9gJAdBscM7Cri3AUTwZIOS+iSYzP4UgBZUj6ndN6Rs3AByq7CIsXs0K7gtnkKZMc+SZyZQXKuQIG5ciFEyGEGKJRXTVFoiaGKe5JAwVqG0CwvJBIeExALG0MhTzxGwlMV6LohCeFaJQQwPRBijFBJwWAChhLamLKBasg09ziU6LQeoDBti6GMOYc415HCuFEoYPwnlNcImKEpSE6lTJKE8NIds6VtLhn2jGVbSZeT0kzPlAELVWqAVLLgXIg07pjT3JGQ6S2EzGFVLKnSBgUILHKotW6Fl8EXhJJgA60ZTr3kID0OofxCQfV+twBK0J+DFUkPaJ88NVD+CSMBZC1ZeVAoIPsFccpsSfAJPdRIzAQA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5YTpUIAtGATEUYXAYAWAAZSMFtBVgdhFSoEYTAAewB3SkUGNGEDYGAkBFIEyWEASTSMjAxw+yrcbIBiSSYrBhVyEjE1YkUEGHK7SOrHClE1YUz6NuGGTu72ItaE-gByGQBrfmTyJLB1TYRFmARW4napxWJ+FCxyACMAVxkkvYOjk87zlEoZAgZyBfdh4iiFYGAACADoJh1FAAKACUVwAZs1hDYQOQwAcEQZauwvAcuAw2GCuDw+BFqtlOA0YE0VL1yQ5ONFYvFkmT7CSyOyHDxnK4PF4fH4DABWEWhSqREQxXKslKddJxLLABAlRXCXpozjczm8IRM8RSXDs-giQ3SWQGZmyxJJTQ6PQGBQmMwWKykVE63mTUbURbWuK2xbc8jkQbkH2ZRZpc7Bvqh0PfCMjKOSA6kRa-fj-GJAgwoBK4BLQ0S3GAHfgydzkACMsPYIga-DYADI1ABHW4JADcXGETY4nEJ8YTdWICNS6oA2qXywhKwBden2BPkDnelN+mPZhVoRYj1cJlzaNx+64WFYoGAJW78JDuXcISDkMsqaH0bKP4QzssV3ALsFhBgURNVhbs4wiQ8E3sbJtGIBAVCQF5JmmHoKkg6DGVJA9yEpcdlxkBMk0jP1+GMXBMz+AE83oAsixLX95xkABqWt6xADh+wYZsW3MTsez7AcCRDMNuC5PoR3DEjFlEBhpGIBYIJXIjJDYT9SjiH850XMFZPkhZyi4VTJLEvUIl1Mk+3NY0QBwYR4FIJhJwychqHIKdaBgPpgGcYDn0WThOhQTgUHHYQqWva43EUMFQoRRYrj0qwFn8gAVGA4IuLQEk2BIYBWX57nIH40wSKKlGKhEFBgLQvHIEVcDAdEbxgTNsE87zfNEfzAsUYK4vC0RRli8cEojOTkv4NKMvebLyARYgjGcBIugWQ4EJRWhaH9cgAGEAGV9rarAOoiHygO68gAqCkKwsChARvixKJoUqartSuIrCy85qqRURDgWcgikrboyJkABRIxVDy7pjtOmCup6m6Bs4JIAGZREesakte6bMo+IsIwSXI5oAdTR3a+W4pAmCQYQ4a8s7Eau3r+ruu5iEQrHnv0t7FgANWOYgvoJuqUFubRNkSTZrwUWrDg5xDnGs+nyHaxmEYupG+tuhFwoUFxufG3n-LmJAFi25ZyDI5A5oNmRGvUMFyFJ7YZFk-hyEkBJRmIKLJYLGWFhQAB+NrToXbt4cZgAlN1rF0lbvbIythEAmVAw2Ny48sBPyPnJBoWAeHcAUZQ1AUfzagDOUEpLuiEmfBFb1zwHoUoO9jHIWFcJL+xHJqr9XNq45YoQXB28WL9MzAvvWA1yJOE4dFqbcGW5OK69byQOeB+t25FGH9vzlyJbWK-ME3AuRru-IABSZy4kv+cUEaqOF6qD-S7AUeUQnq7Zx-jGvwA+3d359HVn0GmuAGBNxbpNcgcJe5fwOLgMsnsfKAKYs+IIasS6QIiNSWkwhnzFy-pCU43R-L7gXhURmGBZ4a0ZnvcwucPTDzIikHO7oEBFxLjA5g48q4CJYHXBeZdVDqCfFdWoEiK57BOgvaBsDkESVwLkfIhQ1QZGfF+RRajVQaRIY-NOC0VDVXbs3fgrd+DH1vj5VB6DyAAD9iCAWAmCE+xgADyCJJ57DAWrbu+D9ERAoZ0OB1iEFILIWo5o3R-6LHCV0JAABCGe4CIh0IEAw2yIBRDwAhMcFCXQarF0IT7YWuNirXGEAkFQ9wEBRwiNcQsRZFA4OafYCQvhcDPjRkoLpuBRD1Lys+WoQRJlDOdLgdw8QGDmySM+dwNZJBLRWWs2smzagIl2VcVZS0DlbKWjsvZ5ANmHM2Uc05CJ9mbIucc8gNyhkIgWLMpEZwVDaGfMIbiwg5ndHHM09CAh04sltL3CpwgqkpXIAcCu1ghlJCoI1Z8NZJl3yGYKXpaKMVDNaUYOZxAABe7xnytJgLkGA7gCVDIaEgEgFwcHkFwQMw+QRgV2H4GCm0GwwRkRMFcHlmcUhgjTHkSF9hvbQsms+BgtT6mNOmQUTpfRWmlxWqqlpCRCXQtJUym4eUqU0p1UM24KJqUojcJYZ86wyJIpRWAZ8AAmQZfQZnuGaD4N6-0QYwCGbOOpMBnzex+t0ANozg1PIYDGl5byiXEukTWN1-B0LCrlOQfl5FICJA9DAE63Ka4QrFemHNCQ82StwOeIEV4bx3n+JG8ZCBm2csEIWjOGas0mErT0vwWr7AUuNW4KqaLNl1JlE8hlSBW2gqLXy8VFByn2GHX0ll+KjXdHcL21dRzx1UEnQymd7bwV8oFTILi-AhVztFQu5wTZK1tEkd8m4KgEhAiGTEMinhvA4rXe6lV9UgiYr6NKmFb15XjqVX0ZFSBUW1jxTkrl6bi3bkraB2VcKELqERWqnVCayWGspZu2lIGFmMpQMy11igHWwadfBoDWKf19vo8BlpF5a3bwba+qNOyAgIj4wEI9yG+XbgfBpSt1bLxb3rXq6RIzKxTH4Pi9j0n7zoeqb66qyma2qa3QgPQ6hbUJD0wZ3ANG4PooY30bFzHLOsZBce3loqcaAyXaXcinqYgoB9UxcNOTMBAA">Fix Code</button>
</div>

We have our image slideshow usable from any app now, but what if we wanted to make it slightly more customizable? Perhaps we could allow the user to have a bit more control over the template by, say, letting them include some sort of disclaimer on all of the slides. We could hard-code the disclaimer in a special version for each client, but that sounds like it would be awful to maintain.

Fortunately, Ractive.js allows you to use the content of a component tag to pass partials to the component instance. Any content not within a `{{#patial}}` tag is collected up and exposed to the component as a partial named `content`. Any `{{#partial}}`s are supplied to the component instance with the names they are given in the `{{#partial}}` tag. We'll use a disclaimer partial for our component:

```handlebars
<slideshow>
  {{#partial disclaimer}}<div class="disclaimer">I don't know what we're disclaiming, but we're disclaiming it <a on-click="@.disclaim(), false" href="#">here</a>.</div>{{/partial}}
</slideshow>
```

We can add a reference to the partial in the `Slideshow` component template:

```handlebars
{{>disclaimer}}
```

> It's not a bad idea to supply a default partial with the component, so that Ractive.js doesn't emit any warnings about missing partials. Any partials passed to the component will override any supplied to `extend`.

Now what will happen when you click the "here" link? Partials exist completely in the context of the instance in which they are used, and there is no `disclaim` method on the `Slideshow` component, so nothing will happen (except an error will be logged to the console). If you want a passed-in partial to render in the context from which it was passed, you can `{{yield}}` it.

```handlebars
{{yield disclaimer}}
```

Add a `disclaim` method to the main instance, update the `Slideshow` component, and run the code to see it all in action.

> Since `yield` puts the partial in the context of the caller, there's not much point in using it within an `#each` block because the array being iterated is unreachable from the `yield`. `yield`s can also supply aliases to data local to the component e.g. `{{yield disclaimer with current as currentImage}}`. `yield`ing the `content` partial just requires dropping the name.

## Step 5
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5YTpUIAtGATEUYXAYAWAAZSMFtBVgdhFSoEYTAAewB3SkUGNGEDYGAkBFIEyWEASTSMjAxw+yrcbIBiSSYrBhVyEjE1YkUEGHK7SOrHClE1YUz6NuGGTu72ItaE-gByGQBrfmTyJLB1TYRFmARW4napxWJ+FCxyACMAVxkkvYOjk87zlEoZAgZyBfdh4iiFYGAACADoJh1FAAKACUVwAZs1hDYQOQwAcEQZauwvAcuAw2GCuDw+BFqtlOA0YE0VL1yQ5ONFYvFkmT7CSyOyHDxnK4PF4fH4DABWEWhSqREQxXKslKddJxLLABAlRXCXpozjczm8IRM8RSXDs-giQ3SWQGZmyxJJTQ6PQGBQmMwWKykVE63mTUbURbWuK2xbc8jkQbkH2ZRZpc7Bvqh0PfCMjKOSA6kRa-fj-GJAgwoBK4BLQ0S3GAHfgydzkACMsPYIga-DYADI1ABHW4JADcXGETY4nEJ8YTdWICNS6oA2qXywhKwBden2BPkDnelN+mPZhVoRYj1cJlzaNx+64WFYoGAJW78JDuXcISDkMsqaH0bKP4QzssV3ALsFhBgURNVhbs4wiQ8E3sbJtGIBAVCQF5JmmHoKkg6DGVJA9yEpcdlxkBMk0jP1+GMXBMz+AE83oAsixLX95xkABqWt6xADh+wYZsW3MTsez7AcCRDMNuC5PoR3DEjFlEBhpGIBYIJXIjJDYT9SjiH850XMFZPkhZyi4VTJLEvUIl1Mk+3NY0QBwYR4FIJhJwychqHIKdaBgPpgGcYDn0WThOhQTgUHHYQqWva43EUMFQoRRYrj0qwFn8gAVGA4IuLQEk2BIYBWX57nIH40wSKKlGKhEFBgLQvHIEVcDAdEbxgTNsE87zfNEfzAsUYK4vC0RRli8cEojOTkv4NKMvebLyARYgjGcBIugWQ4EJRWhaH9cgAGEAGV9rarAOoiHygO68gAqCkKwsChARvixKJoUqartSuIrCy85qqRURDgWcgikrboyJkABRIxVDy7pjtOmCup6m6Bs4JIAGZREesakte6bMo+IsIwSXI5oAdTR3a+W4pAmCQYQ4a8s7Eau3r+ruu5iEQrHnv0t7FgANWOYgvoJuqUFubRNkSTZrwUWrDg5xDnGs+nyHaxmEYupG+tuhFwoUFxufG3n-LmJAFi25ZyDI5A5oNmRGvUMFyFJ7YZFk-hyEkBJRmIKLJYLGWFhQAB+NrToXbt4cZgAlN1rF0lbvbIythEAmVAw2Ny48sBPyPnJBoWAeHcAUZQ1AUfzagDOUEpLuiEmfBFb1zwHoUoO9jHIWFcJL+xHJqr9XNq45YoQXB28WL9MzAvvWA1yJOE4dFqbcGW5OK69byQOeB+t25FGH9vzlyJbWK-ME3AuRru-IABSZy4kv+cUEaqOF6qD-S7AUeUQnq7Zx-jGvwA+3d359HVn0GmuAGBNxbpNcgcJe5fwOLgMsnsfKAKYs+IIasS6QIiNSWkwhnzFy-pCU43R-L7gXhURmGBZ4a0ZnvcwucPTDzIikHO7oEBFxLjA5g48q4CJYHXBeZdVDqCfFdWoEiK57BOgvaBsDkESVwLkfIhQ1QZGfF+RRajVQaRIY-NOC0VDVXbs3fgrd+DH1vj5VB6DyAAD9iCAWAmCE+xgADyCJJ57DAWrbu+D9ERAoZ0OB1iEFILIWo5o3R-6LHCV0JAABCGe4CIh0IEAw2yIBRDwAhMcFCXQarF0IT7YWuNirXGEAkFQ9wEBRwiNcQsRZFA4OafYCQvhcDPjRkoLpuBRD1Lys+WoQRJlDOdLgdw8QGDmySM+dwNZJBLRWWs2smzagIl2VcVZS0DlbKWjsvZ5ANmHM2Uc05CJ9mbIucc8gNyhkIgWLMpEZwVDaGfMIbiwg5ndHHM09CAh04sltL3CpwgqkpXIAcCu1ghlJCoI1Z8NZJl3yGYKXpaKMVDNaUYOZxAABe7xnytJgLkGA7gCVDIaEgEgFwcHkFwQMw+QRgV2H4GCm0GwwRkRMFcHlmcUhgjTHkSF9hvbQsms+BgtT6mNOmQUTpfRWmlxWqqlpCRCXQtJUym4eUqU0p1UM24KJqUojcJYZ86wyJIpRWAZ8AAmQZfQZnuGaD4N6-0QYwCGbOOpMBnzex+t0ANozg1PIYDGl5byiXEukTWN1-B0LCrlOQfl5FICJA9DAE63Ka4QrFemHNCQ82StwOeIEV4bx3n+JG8ZCBm2csEIWjOGas0mErT0vwWr7AUuNW4KqaLNl1JlE8hlSBW2gqLXy8VFByn2GHX0ll+KjXdHcL21dRzx1UEnQymd7bwV8oFTILi-AhVztFQu5wTZK1tEkd8m4KgEhAiGTEMinhvA4rXe6lV9UgiYr6NKmFb15XjqVX0ZFSBUW1jxTkrl6bi3bkraB2VcKELqERWqnVCayWGspZu2lIGFmMpQMy11igHWwadfBoDWKf19vo8BlpF5a3bwba+qNOyAgIj4wEI9yG+XbgfBpSt1bLxb3rXq6RIzKxTH4Pi9j0n7zoeqb66qyma2qa3QgPQ6hbUJD0wZ3ANG4PooY30bFzHLOsZBce3loqcaAyXaXcinqYgoB9UxcNOTMBAA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVxEy5YTpUIAtGATEUYXAYAWAAZSMFtBVgdhFSoEYTAAewB3SkUGNGEDYGAkBFIEyWEASTSMjAxw+yrcbIBiSSYrBhVyEjE1YkUEGHK7SOrHClE1YUz6NuGGTu72ItaE-gByGQBrfmTyJLB1TYRFmARW4napxWJ+FCxyACMAVxkkvYOjk87zlEoZAgZyBfdh4iiFYGAACADoJh1FAAKACUVwAZs1hDYQOQwAcEQZauwvAcuAw2GCuDw+BFqtlOA0YE0VL1yQ5ONFYvFkmT7CSyOyHDxnK4PF4fH4DABWEWhSqREQxXKslKcbmc3hCJniKS4dn8ERq6SyAzM2WJJKaHR6AwKExmCxWUioxW8yajaiLA1xI2LbnkciDciOzKLNLnD19L1e76+kb+yQHUiLX78f4xIEGFAJXAJaGiW4wA78GTucgARlh7BEDX4bAAZGoAI63BIAbi4wnLHE4hJDobqxARqXScQA2lmcwg8wBden2UPkDkOyPOwMJzr9xad6ehlzaNzO64WFYoGAJW78JDuZdoSDkbMqaH0bLnwfD3O4Mdg4QwUS9ECwhvBiLr0N7GybRiAQFQkBeSZph6Cp-0AxlSTXchKR7ScZFDcM-WdfhjFwOM-gBZN6FTdNM2zZ9yAAaiLEsQA4FsGArStzDrRtm1bAlPW9bguT6TsfSwxZRAYaRiAWP8pwwyQ2HvUpH3I0cXzBYTRIWcouGk-ieOVCIlTJZsdQ1EAcGEeBSCYPsMnIahyAHWgYD6YBnA-S9Fk4ToUE4FAe2EKlD2uNxFDBbyEUWK4VKsBZXIAFRgECLi0BJNgSGAVl+e5yB+aMEgCpRMoRBQYC0LxyBFXAwHRI8YDjbB7Mc5zRFc9zFE8kLfNEUZgp7MLfREyL+BiuL3kS8gEWIIxnASLoFkOMCUVoWgXXIABhABlVaaqwOqIic99GvINyPK8nz3IQLrQvCvqxIGg7oriKwEvOQqkVEQ4FnIIo826HCZAAUSMVQUu6TbtqAhqmqOtrOCSABmURzp6iLrsG+KPnTX0ElyEaAHUYeWvlGKQJgkGEEGHJ28GDua1qTruYhwIRy7VJuxYADVjmIB60ZKlBbm0TZEk2Q8FGKw46fA5xDNJ8havJsG9ohlrjoRXyFBcRneuZ1y5iQBYFuWcgcOQEa1Zkcr1DBchse2GRhP4chJASUZiAC-nUyFhYUAAfhq7axwbUHyYAJWtaxlKmx2cLzYQ3xlN0NhskPLDD3DRyQaFgFB3AFGUNQFFc2pXTlMKs5IhJLwRY9k-e6FKBPYxyFhZCs-scyiofYRrOK45goQXBa8WDu4x-FvWDlyJOE4dFCbcIWRMyw9jyQUe28N25FC72vzlyCbqI7sE3AucrG-IABSSy4gP0cUHKgPx6qe-s7AHuUX7g6n0Unr+HXxu776WW+hE1wAwCuVd+rkDhM3R+BxcDZntk5D+eZLxBBllnABERqS0mEJeTOj9ISnG6K5Vc490H2CilAviD1OagP4NXe2kDcGUPsD2CB5AACEtdyo9xYNCQeclSZNwAD6CNsmORuV8j4VSbowhk1RRALGEAkNwYIkhMH4APVacc5SXi2PzEgSBBCLRkNoI8DsGCjDrplfg-MO4+1-qPewFRH5OP-ttDAI85bk1XuYZOtou44RSEnG0CAM5Z2AcwPuBdwksBLuPHOqh1AICiUoBJChYmAPUCAihDJcj5EKCUfs2CL7CC2o-BABSMiXn3mNFQhVa6V1of1LeJ8nIwLgeQAAfsQN8H4wTb2MAAeQRAPPYv8ZaNzQaUwBxwoKKBoXQiB0jR7NG6G-RY+DphIDYcPP+EQXH8HccZEAoh4AQhmVCbozcMFO05sjTK1xFEqHuAgAOERrhpnTHM8gQRXn2AkL4XAl4YZKF+bgeRKgUqXlqEEGFoKLS4HcPEBguskiXncIWSQE10WYqLDi2oCICVXAxRNYluKJr4sJeQbFJKcWkopQiIlOLqVkvIPS0FCIFgIqRGcFQ2hLzCEYsIRF3QeyvNggIWOLIjRXPsI7YQtzyEHDztYUFSQqDlUvIWGFp9QWCgBZq7VoL3lGERcQAAXu8S87yYC5BgO4Y1oKGhIBIBcZB3zyDAo3j8gQ4r+CSsNBsMEOETBXH9fHFIYJox5BlbgOVCqboMAeUo55cKCjIKNR8qa6a+jGtNRa11NwUq2vtQkIwoLbgojtSiNwlhLzrBwqq9VYBLwACYQV9Hhe4ZoPgbqvS+jAUFw5FEwEvI7J63RB1KMhayhgs72WcrzUkos7aDkSqLtKoNuFICJFtDALafr12BqjaQbdCRd0xt3ECA8R4Tz-CnSO1lCAn1irsAerRG7g0yEzhEf5fhs1vKLd0dwbgCqapxY8qgrLnVIBfYIN9Uqj0xhjSBwF3yM02qA7+1DpKIMQVqNB2Da732Bs-c4csobD0RuPWRxiMa2gJL5TcCFQJQUxBwp4bw+q0MdrTaVIIOq+hxv6peRNjyU19DVUgDVRZDU+tfWGuU5AwSLhjUJu5Sr1AqpzaWvNlrC0YbtQ6wTyKXUoDdW2xQjapPNpk-x3VnG-22YE28vc16l53ohQ+-FAQEQ+YCIR+DAaI2LjPHJC9rnF63vlWapd8i8xTH4EaiLN7TxqfIX2wqSWr2RdPAcPQ6g60JHcHlhA6grPSa1XZvoerHOVec76hTG6kbvW-fYTt3aUC9sUhOn1mAgA">Fix Code</button>
</div>

Now suppose we wanted to do something to each of our component instances as they're created, like validate that they have certain parameters provided and issue a warning if they don't. Ractive.js components actually have a pretty complete set of lifecycle events that allow component authors to hook into just about every stage of a component's lifecycle - from `construct`ion to `destruct`ion hitting `init`, `render`, `unrender`, `teardown`, `complete` (`render` complete along with any transitions) and a few others in between. Each lifecycle event also happens to be an instance event.

Lets add our check to make sure the `Slideshow` component receives an `image` parameter. There are a few ways to do this, including using `on` and providing an `oninit` function as an initialization parameter.

```js
var ractive = new Ractive({
  // ...
  on: {
    init: function () {}
  },
  // ...
});

// or

var ractive = new Ractive({
  // ...
  oninit: function () {},
  // ...
});

// for other lifecycle events, you can attach after init

ractive.on( 'render', function () {} );
```

Add an `init` event handler that checks to see if there are no images and issues a warning if there are none.

## Step 6
<div class="tutorial">
  <button data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwBBJEnLCA9ooTkG-UWDcwwuRgCDAIAHSRQpxiEtJsIDjC8KRM5ABqxAgA7uTU5ABKFlakEcYK-EgAFMB2ppzBoQgA5EE+5OUI-MLEbvzkpFm5uG7kAGbEKiqUgvwYAJQA3AKpMANDAJLduD6iXvn8ORlDVUt2-KvkbrghawdHRZbWNXWcDbctbeSqDMT9g0cRuNJtM-q8Guodn5kOQ-JMkGF+qJ2gAjLw+bTkADWfxcbjGM2EO18NjmZ1ml3MT1KeXIh1yjxKCBeglwO2YCFwkHIzQAxOyWM0sHUFMo1ApuXzRT8FM0BAtFokQKJ4JggA">Start</button>
  <button data-run="true" data-tutorial="N4IgFiBcoE5SBTAJgcwSAvgGhAF3gDxICWAbgATFIC8AOngIYxq70B8BA9CaW7QHYCCAZwDGMYgAdclGvVwIAtpIA2DBfXK4AnpIR08CAB65OMBqNxkE7AbVwEwARjYBZBsX7kAasQQB3Lmc+QQcAYkUPL04Q+zsHMAAmNgBlBFEAe34kJm0fP0DOJNjw4XSsnJhtEvsACQQYBAByYXJhDMUENvLs3PJM-gVB8gAzGA6tMC7Iz0p+YVwGflEEADp4rjKByuqhTjEJaTYQHGF4UiZ8gPJqcgAlCytSNeMhpAAKYHiFZTUFSHITQAkuQGIpQV5Xgh5sQsuRSAUmgIMABKADcAguMHhBSB80Wyy6t34118AXe6Ls-Cx5AyuCm2OJ1welmsn2+SlU6gQAOBoPBDHIXNmngWSxWEPI-mIKhU5AArmVQf0skMZJImFYGCosJQRm15ZJVH4kKsiGQ2MBgGwBmqMBguDw2Ej+KiMYJqZdzKznjdyCT-PdHmyvqFFswELheWFwywmlgOb9udGflyFC63VTvU81upFqIwABhMAyj44gJ4sWE3XALRMFi8mb8JrkTP8bPWVZ5ixFksqMt0hk1usRqOArYVXItt0nECieCYIA">Fix Code</button>
</div>

When we started out with our slideshow, we were rendering it directly to a target element rather than as a component in another Ractive.js instance. It turns out that having self-contained components like that is a pretty convenient pattern for managing complexity in a larger app. All of the related functionality for a feature or group of features can be grouped into one Ractive.js extension known as a _view_. Each individual view can then be loaded and/or rendered independently.

In order do use views with a main instance controlling the overall app, you would have to have some sort of big `#if`/`else` block with each view included as a branch. You could also resort to some sort of partial generation scheme. There's an easier way though.

Ractive.js will allow you to attach one independent instance to another using `attachChild`, optionally specifying a _target_. If you don't specify a target, then the child instance will not be rendered, but if you _do_ specify a target, then the instance will be rendered into the first available matching _anchor_. An anchor looks like a component or element, but its name always starts with a `#`. You may have as many anchors as you like, and they may each have the same or different names.

```handlebars
<#anchor />
<#ICallThisOneStan>
  Stan has a content partial.
  {{#partial name}}He also has a name partial.{{/partial}}
</ICallThisOneStan>
```

Go ahead and fill out the two provided views as you like, add anchors to the main instance template, and attach an instance of each view to an anchor on the main instance.

> You can detach a child using the conveniently named `detachChild` method.
>
> Child instances can be attached in `prepend`, `insertAt`, or `append` (the default) mode. Ractive.js will try to find a matching anchor for each child starting with the first. If there aren't enough anchors, some instances will not be rendered. Each time a child is attached or detached, Ractive.js will adjust any affected anchors so all instances that can be rendered are rendered.
>
> Each anchor has its own list of children associated with it, which is what the attachment modes are referreing to - `prepend` will insert a child at the front, `append` at the end, and `insertAt` at the specified index. The list of children for a particular anchor, say `<#main />`, os kept up to date in an observable way so that you can automatically generate anchors as components are attached using `{{#each @.children.byName.main}}<#main />{{/each}}`.
>
> An anchored attached child is effectively a component that the host instance doesn't control.
