# Components

In many situations, we want to encapsulate concepts into a single reusable *component*, for example a *Shopping Cart* or a *Calendar* which can be dropped into Ractive applications. Technically all Ractive instances are  *components*. However here we use the term  *component* to mean a Ractive instance that is set as a *child* of another Ractive instance, thus establishing a *parent/child* relationship.

There are two types of components, __managed__ and __unmanaged__. Managed components are *instantiated* by their *parents*, while unmanaged components are instantiated like other Ractive instances using the __new__ keyword eg. ```var myComp = new MyComponent()```.

__Managed__ components are referenced differently in templates than __Unmanaged__ components, but we will get to that later. For now we will be looking at __managed__ components.

## Writing

There are several ways to write Ractive components. Standard [initialization options](../api/initialization-options.md) apply for configuration unless where differences are explicitly mentioned.

The most common way to define a component is by using [Ractive.extend()](../api/static-methods.md#ractiveextend).

```js
// A subclass of Ractive
const MyComponent = Ractive.extend({
  template: `
    <div class="my-component">
      <span class="my-component__message">{{ message }}</span>
    </div>
  `,
  css: `
    .my-component__message { color: red }
  `,
  data: { message: 'Hello World' }
});
```

Another way to define a component is by using [component files](../api/component-files.md) and [loaders](../integrations/loaders.md).

```html
<div class="my-component">
  <span class="my-component__message">{{ message }}</span>
</div>

<style>
  .my-component__message { color: red }
</style>

<script>
component.exports = {
  data: { message: 'Hello World' }
};
</script>
```

## Registering components

When using __managed__ components we need to *register* them. Remember that __managed__ components are not created by us, instead the Ractive instance they are registered with is responsible for creating instances of the component.

Like other plugins, there are 3 ways we can register __managed__ components:

__Globally, via the `Ractive.components` static property:__

```js
// Available to all instances of Ractive.
Ractive.components.MyComponent = Ractive.extend({ ... });
```

__Per component, via the component's `components` initialization property.__

```js
// Only available for instances of AnotherComponent.
const AnotherComponent = Ractive.extend({
  components: { MyComponent }
});
```

__Per instance, via the instance's `components` initialization property.__

```js
// Only available to this specific instance.
const ractive = new Ractive({
  components: { MyComponent }
});
```

## Using

But where components really shine is when they're used in templates. They are written like _custom elements_ eg.  ``` <MyComponent/> ```.

Each custom element notation represents one instance of the component.

```js
const AnotherComponent = Ractive.extend({
  template: `
    <div>
      <MyComponent /> <!-- One instance of MyComponent -->
      <MyComponent /> <!-- Another instance of MyComponent -->
      <MyComponent /> <!-- Yet another instance of MyComponent -->
    </div>
  `
});
```

The component's tag name depends on the name used upon registration. The same component can be registered more than once using different names.

```js
const MyComponent = Ractive.extend({...});
Ractive.components.MyComponent = MyComponent;
Ractive.components.MyComponentOtherName = MyComponent;

const AnotherComponent = Ractive.extend({
  template: `
    <div>
      <MyComponent />          <!-- Using MyComponent -->
      <MyComponentOtherName /> <!-- Using MyComponent's other name -->
    </div>
  `
});
```

But what if a parent component needs an instance of a child component in order to call methods on the child, or set data etc?

When using __managed__ components the parent component automatically creates instances of the child components, so there is no reference to the child instance.

We can use the [findComponent()](../api/instance-methods.md#ractivefindcomponent) method to lookup an instance of a child component. For example:

```js
var parent = new Ractive({

    components: { child: ChildComp },

    validate: function( client ) {
        // Lookup a ninstance of the child component.
        var child = this.findComponent("child");

        // Invoke a method
        var valid = child.validate( client );

        if ( valid ) {
            console.log ("Yay! Client data is valid");
        } else {
            console.log ("Oh no! Client data is invalid");
        }
    }
});
```

### Unmanaged

When using __unmanaged__ components we are responsible for creating new instances and **attaching** / **detaching** them from other Ractive instances.

Another difference from __managed__ components is how to declare them in templates. Where managed components uses _custom_elemens_, unmanaged components are declared with __anchors__.

Anchors look similar to custom_elemens but prefixed with a #:
```html
<#MyComp/>
```

Since unmanaged components are instantiated manually, they are not registered with another Ractive instance or component. Instead we tell Ractive which anchor to use when attaching the component through [attachChild()](../api/instance-methods.md#ractiveattachchild).

[attachChild()](../api/instance-methods.md#ractiveattachchild) accepts an anchor name as argument and Ractive will attach the component to that anchor.

Components are simply subclasses of Ractive, which means they are instantiated via the `new` keyword.

Given the following template with anchor:
```html
<#child/>
```
we can attach the child to the parent as follows:
```js
const child = new ChildComponent({ ... });
const parent = new ParentComponent({ ... });

parent.attachChild( child, { target: "child" } );
```

The *target* option specifies the name of the anchor to use.

To detach the child we use [detachChild()](../api/instance-methods.md#ractivedetachchild):
```js
parent.detachChild( child );
```

Unamanged components are more flexible that their managed counterparts in that it allows us to dynamically attach/detach components at runtime.

We can achieve some level of dynamism with managed components by placing components in conditional mustache sections eg:

```html
{{#showA}}
<compA>
{{/}}
{{showB}}
<compB>
{{/}}
```

```js
let parent = new Ractibe({
    components: {
        compA: MyCompA,
        compB: MyCompB
    }
});

// Show A, hide B
parent.set('showA', true);
parent.set('showB', false);

// Show B, hide A
parent.set('showA', false);
parent.set('showB', true);
```

With this approach we can dynamically switch between the two components, however we have to declare upfront all the components in the template. We cannot for example replace MyCompA with MyCompC at runtime.

While not as flexible as unmanaged components, the managed approach clearly communicates all the available components through it's template.

With managed components we just need an anchor and can attach any Ractive instance to it:
```html
<#child/>
```

```ja
parent.attachChild( compA, { target: "child" } );

// Later on
parent.detachChild( compA );
parent.attachChild( childB, { target: "child" } );

// Still later
parent.detachChild( compB );
parent.attachChild( childC, { target: "child" } );
```

### Workflow
Ractive provides a variety of ways that parent and child components can communicate with each other.

Components are great for encapsulating features in their own file and provides a way to reuse compponents in an application, or even across different applications.

For maximum reusability a component should be fully encapsulated and not have any dependencies on it's parent.

To achieve this, communication must be __one way__, from the parent to the child. So the parent can **map data** for the child or invoke the child API but the child must not access the parent instance in order call methods etc. For example, if the child wants to communicate a change to it's parent and does so by calling a parent method, then wherever the child component is used in the application, the parent is responsible for providing the method the child depends upon. So if the child makes 10 calls to the parent, all 10 methods must be made available to the child, which makes reuse difficult. Ideally the child should use a different mechanism to communicate to it's parent where it does not require access the parent.

The solution is for the child to communicate to it's parent, by firing events, that the parent can listen to. This way the child has no dependency on it's parent. The parent can decide which events it is interested in and how to respond to them. Generally the parent will communicate with the child through the child' API. When the parent receives an event from the child, it can respond by calling methods on the child instance.

This is illustrated in the following diagram:

![one-way-data-flow](component-one-way-data-flow.png)

Breaking the dependency between components is great for reusability, but comes at a cost since firing and responding to events is more involved than simply calling methods on the parent.

Let's look at the various ways parent and child components can communicate

#### Data mappings

**Data mapping** is a mechanism that allows us to *connect* pieces of data in the parent to data in the child. When a **data mapping** is specified Ractive creates a [link()](../api/instance-methods.md#ractivelink) between the parent and child data.

Changes on one side will reflect on the other and vice versa.

Data mappings are specified on the child element or anchor. For example:

given the child:
```js
var child = Ractive.extend({
});
```

and it's template:
```html
{{person.name}}  <!-- will render nothing because person is not an object on child -->
```
we can see that child renders the data *person.name*. But child doesn't specify any *data* property called *person*. So where does *person* come from because as things stand Ractive will render nothing since it cannot resolve *person*.

Let's look at the parent to see if we can find where *person* comes from:
```js
var parent = new Ractive({

    data: {
        client: {
            name: "Steve"
        }

        components: {
            child: child
        }
    },
});
```

As we can see above there is no *person* object either. There is a *client* data object though. Say we want the child to access this *client* object, how would we go about it? Through **data mappings** of course.

We want to map the *client* object specified in the parent component to *person* in the child. Mapping *client* to *person* is probably nonsensical, but it should get the point across. Below we show how this is done.

```html
<child person={{client}}/>
```

We map the parent *client* object for the child by specifying an attribute *person* and assigning the *client* object to it.

With the **data mapping** in place the child can now use the reference *person.name* in a mustache as ```{{person.name}}``` and the parent value of *client.name* will be rendered.

Now we can see that the *person* in child is mapped from the parent.

If we are using **unmanaged** components we can specify the **data maping** on the **anchor** tag:

```html
<#child person={{client}}/>
```

If you don't mind mapping the data on parent and child to the same name you can use a short-hand way for the data mapping:

```html
<child bind-client/>
```
Here the data is mapped to the child as *client*, so the child template will be ```{{client.name}}``` to render the client name.

Using the **bind-"name"** notation on the element Ractive will map an object in the parent with the given *name* to the child under the same *name*.

```html
<comp person={{person}}/>
```

#### findComponent

Ractive provides the method  [findComponent()](../api/instance-methods.md#ractivefindcomponent) to lookup a child instance registered under a given name. Once we have a reference to the child we can communicate with the child through it's APIs.

```js
let child = Ractive.extend({

    isPersonValid: function( ) {
        // Perform validation on person object
        var person = child.get('person');
        if ( person.name == '' ) {
            return false;
        }
        return true;
    }
});

let parent= new Ractive({

    save: function() {

        // lookup the child component
        var child = this.findComponent('child');

        // validate person using child API
        if (child.isPersonValid()) {

            var person = child.get('person');
            // save person to database
        }
    }

    components: {child: child}
});
```

In the example above the child has a method *isPersonValid* which forms part of the child API.

The parent can call this API by looking up the child instance through [findComponent()](../api/instance-methods.md#ractivefindcomponent).

#### Fire events
We mentioned earlier that the child should not directly reference the parent but should  [fire()](../api/instance-methods.md#ractivefire) events that the parent can listen to.

Say the child has a save button the user can click once done editing a *person* object. When the *save* button is clicked we want to inform listeners that the *person* object has changed, so we **fire** the event **personChanged** passing the parent object as an argument.

The parent component can register as a listener to receive the **personChanged** event.

Let's look at how we can do that.

Here is the child template:

```html
{{#persons}}
<input value="name" type="text"/>
<button on-click="@.notifyChange( this )">Notify change</button>
{{/}}
```

The child component:
```js
var child = Ractive.extend({

    notifyChange: function( person ) {
          this.fire( 'personChanged', person );
    }
});
```
The child has a button that calls the method *notifyChange* passing along the person object.

Inside the method we [fire()](../api/instance-methods.md#ractivefire) the **personChanged** event to the listeners together with the *parent* object.

When Ractive fires events from components their event names are automatically namespaced with the name they are registered with, meaning Ractive will actually fire the event as *child.personChanged*. In the case of *unmanaged* components, Ractive will use the name of the anchor.

The reason for namespacing is so a parent with multiple components firing events under the same name, say *foo*, know from which child the event was fired from.

For more info on namespacing see [event-management](../concepts/event-management.md#component-propagation).

That covers how the child fires the **personChanged** event. Let's look at how the parent can listen to this event.

Because events from components are automatically namespaced, parents need to listen on the specific namespace in order to receive the event.

```js
let parent = new Ractive({
    on: {
        // Note, we prefix the event name with 'child' to ensure we are listening to right event
        'child.personChanged': function( context, person) {
            console.log("person changed: ", person);
        }
    }

    components: {child: child}
});
```

We make use of [ractive.on()](../api/instance-methods.md#ractiveon) to listener to the event *child.personChanged*. Note the event *personChanged* is namespaced with the component name, *child*.

The event callback function receives a [context](../api/context-object.md) as first argument (ractive always passes in context as a first arg) and the *person* object as second argument.

Next we look at a couple of alternative ways the parent and child components can communicate and pass data. Note that these alternatives will likely decrease reusability of components.

### Isolated

If you aren't interested in reusability of a component or would like to prototype a feature, Ractive provides some convenient features that speeds up the development process.

By default components are **isolated**, meaning the child cannot access the parent' data. This is recommended if you want the child component to be independent of the parent.

By setting **isolated** to *false* the child can access the parent data. This is ideal for prototyping a feature where we aren't certain how the component will pan out. Another common use case for disabling **isolated** is where we want to encapsulate a feature for a view, but not reuse it in the rest of the application.

Let's look at the example from the **data mapping** section but setting **isolated** to false.

Here is the *parent* component again containing the *client* object:
```js
var parent = new Ractive({

    data: {
        client: {
            name: "Steve"
        }

        components: {
            child: child
        }
    },
});
```
Here is the *child* with **isolated** false:
```js
var child = Ractive.extend({

    isolated: false,
});
```

The child template:

```html
{{{client.name}}}  <!-- will render 'Steve' because child has access to parent data -->
```

So referencing ```{{client.name}}``` in the child will render *Steve*, without having to specify a **data mapping**.

Note: in the **data mapping** section we **mapped** *client* to *person* so child could do ```{{person.name}}``` instead of ```{{child.name}}```.

### Parents

While not recommended child components can access their parents through the [findParent()](../api/instance-methods.md#ractivefindparent) method or the [parent](../api/instance-properties.md#ractiveparent) and [root](../api/instance-properties.md#ractiveroot) properties:

```js
var child = Ractive.extend({

    // 'validate' is a method on child
    validate: function( client ) {

        // validate that client name is not empty
        let valid = client.name.length > 0;

        // Get an instance of the parent and call a method on it, informing that client is valid
        var parent = this.findParent( 'parent' ); // Search parent components for component named 'parent'

        if ( valid ) {
            parent.clientIsValid( client );
        } else {
            parent.clientIsInvalid( client );
        }
    }
});
```

Here we get a reference to the parent components through the [findParent()](../api/instance-methods.md#ractivefindparent) method and informing it whether the client is in a valid state or not by invoking either *clientIsValid()* or *clientIsInvalid()*.

__Note:__ when referencing the parent, we are creating a dependency in that any parent that makes use of the child component will have to provide the *clientIsValid* and *clientIsInvalid* methods, even if that parent has no interest in whether the client is valid or not. If *events* was used instead, the parent could simply ignore those events without Javascript throwing error about missing methods!

In addition to the [findParent()](../api/instance-methods.md#ractivefindparent) method, Ractive also supports the [parent](../api/instance-properties.md#ractiveparent) and [root](../api/instance-properties.md#ractiveroot) properties, that returns the direct **parent** of the current component and the **root** Ractive instance respectively.

### Alternative workflows
Please see the [Workflow Guide](TODO) for different approaches that components can communicate with each other.

## Component Directives
### {{>content}}

`{{>content}}` renders the inner HTML in the context of the component. Partials, components, and any other valid template items can be used as inner HTML. `{{>content}}` can be thought of as a special partial.

In the following example, the result will print "Lorem Ipsum" because the inner HTML's context is the component, whose `message` is set to "Lorem Ipsum".

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Partials defined in the inner HTML can be used to override partials defined on the component. This can be used to allow easy customization of each instance using partials.

In the following example, `ChildComponent`'s default template for the `messageWrapper` partial is a `<strong>`. Upon use of `ChildComponent` in the instance, it overrides the partial to use an `<em>` instead.

```js
Ractive.components.ChildComponent = Ractive.extend({
  partials: {
    messageWrapper: '<strong>{{message}}</strong>'
  },
  template: `
    <div class="child-component">{{>content}}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">

        {{#partial messageWrapper}}<em>{{message}}</em>{{/}}

        <div class="inner-content">
          {{> messageWrapper }}
        </div>

      </ChildComponent>
    </div>
  `
});
```

### {{yield}}

`{{yield}}` renders the inner HTML in the context of the parent component. Partials, components, and any other valid template items can be used as inner HTML. A common use case of `{{yield}}` is to provide wrapper markup transparently.

In the following example, the result will print "Hello World!" because the inner HTML's context is the parent component's, whose `message` is "Hello World!".

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">{{ yield }}</div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        <div class="inner-content">{{ message }}</div>
      </ChildComponent>
    </div>
  `
});
```

Yields can also be customized using named yields. Instead of rendering with the component's inner HTML, a named yield will look for a partial in the inner HTML with the same name and use that to render the yielded content.

In the following example, `ChildComponent` renders the yield content 3 times. However, the last two yields will look for `italicYield` and `boldYield` partials in the inner HTML and use that to render. What's rendered is three "Hello World!"s in regular, italic and bold.

```js
Ractive.components.ChildComponent = Ractive.extend({
  template: `
    <div class="child-component">
      {{ yield }}
      {{ yield italicYield }}
      {{ yield boldYield }}
    </div>
  `
});

const ractive = new Ractive({
  el: 'body',
  data: {
    message: 'Hello World!'
  },
  template: `
    <div class="ractive">
      <ChildComponent message="Lorem Ipsum">
        {{#partial italicYield }}<em>{{message}}</em>{{/}}
        {{#partial boldYield }}<strong>{{message}}</strong>{{/}}
        {{message}}
      </ChildComponent>
    </div>
  `
});
```
