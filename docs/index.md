# Ractive.js

Welcome! These pages aim tso provide all the information you need to master Ractive.

## Philosophy

Ractive takes care of your UI and your application state. But if you're building a complex app, you'll likely have other things in the mix. Routing, history management, server communication, data validation, realtime communication, user authentication, and all that fun stuff.

Unlike other frameworks, Ractive doesn't have an opinion about these things. You are encouraged to build your app from small, loosely coupled modules. It means you're not locked-in writing code for a particular framework The Right Way™. Should you hate one of your modules for some reason, you can easily swap it out for another and move on with life.

## Download

Ractive is available in several places:

```
// unpkg
https://unpkg.com/ractive

// CDNjs
https://cdnjs.com/libraries/ractive

// npm
npm install --save-dev ractive

// Bower
bower install --save ractive
```

## Usage

Using Ractive is very simple. Create a new instance using `new Ractive({...})` with the desired options.

```js
var ractive = new Ractive({
    el: 'body',
    template: '<p>{{greeting}}, {{recipient}}</p>',
    data: {
        greeting: 'Hello',
        recipient: 'World!'
    }
});
```

While there are _no required options_, `el`, `template` and `data` are the most common. They specify _what element_ to attach an instance with _this markup_ having _this data_. Check out [Initialization Options](API/Initialization Options.md) to learn more about the available options.

If you get stuck at any point, visit the [Get Support](Get Started/Support.md) page for places to find help.

---

<small>This project is the brainchild of an Englishman and has contributors from all over the world. There is an ecclectic mix of primarily the Queen's English, a fair amount of 'Murican English, and a bit of others here and there. Things like `adaptor`, `behaviour`, and `dependant` may have more than one spelling but we try to stick to the Queen's English to the extent that we are able.</small>
