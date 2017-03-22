# Todo List

```
Embed demo here
```

This is an adaptation of the [TodoMVC](http://todomvc.com/) application. Ractive.js doesn't take a side in the MVC wars – it aims to be architecturally agnostic – so whereas other TodoMVC implementations have a strict separation between models, views and controllers, Ractive.js encourages you to structure your app around _components_, but ultimately lets you do things however you want.

With MVC frameworks, you'll typically do something like `model.set(key, value)` or `collection.add(model)` to manipulate your data in a way that keeps the view in sync. Ractive flips this script on its head - you call methods on your Ractive instance instead. That means your data can consist of plain old JavaScript objects and arrays - no framework lock-in or interoperability woes.


## main.js

```js
var items;

// try to load from localStorage
try {
  items = JSON.parse( localStorage.todoItems );
} catch ( err ) {}

if ( !items ) {
  items = [
    { completed: true,  description: 'Add a todo' },
    { completed: false, description: 'Add some more todos' },
    { completed: false, description: 'Build something with Ractive.js' }
  ]
}

var ractive = new TodoList({
  el: demo,
  data: {
    items: items
  }
});

// persist changes to localStorage if possible
ractive.observe( 'items', function ( items ) {
  try {
    localStorage.todoItems = JSON.stringify( items );
  } catch ( err ) {}
});
```

## TodoList.html

```html
<div class='todo-app'>
  <header>
    <input
      class='new-todo'
      on-change='createTodo(event)'
      placeholder='What needs to be done?'
      autofocus
    >
  </header>

  {{#if items.length}} <!-- only show when there are one or more items -->
    <section class='main'>

      <!-- 'toggle all' button -->
      <div class='toggle-all-container'>
        <label for='toggle-all'>Mark all as complete</label>
        <input
          name='toggle-all'
          class='toggle toggle-all'
          type='checkbox'
          on-change='toggleAll(event)'
          twoway='false'
          checked='{{ items.length === completedTodos.length }}'
        >
      </div>

      <!-- the actual list -->
      <ul class='todo-list'>
        {{#each items:i}}
          {{#if filter(this)}}
            <li
              intro-outro='slide:fast'
              class='item {{ completed ? "completed" : "" }} {{ currentlyEditing === i ? "editing" : "" }}'
            >
              <div class='view'>
                <input class='toggle' type='checkbox' checked='{{completed}}'>
                <label on-dblclick='set("currentlyEditing",i)'>{{description}}</label>
                <button on-tap='splice("items", i, 1)' class='destroy'></button>
              </div>

              {{#if currentlyEditing === i}}
                <div class='edit-container'>
                  <input
                    decorator='select'
                    class='edit'
                    value='{{description}}'
                    on-blur-change='submitEdit(event, i)'
                  >
                </div>
              {{/if}}
            </li>
          {{/if}}
        {{/each}}
      </ul>
    </section>

    <section class='footer' intro='fade' outro='slide'>
      <span class='todo-count'>
        <strong>{{ activeTodos.length }}</strong> {{ activeTodos.length === 1 ? 'item' : 'items' }} left
      </span>

      <!-- switch filters -->
      <ul class='filters'>
        <li
          class='{{ currentFilter === "all" ? "selected" : "" }}'
          on-tap='set("currentFilter","all")'
        >All</li>

        <li
          class='{{ currentFilter === "active" ? "selected" : "" }}'
          on-tap='set("currentFilter","active")'
        >Active</li>

        <li
          class='{{ currentFilter === "completed" ? "selected" : "" }}'
          on-tap='set("currentFilter","completed")'
        >Completed</li>
      </ul>

      <!-- hidden if no completed items are left -->
      {{#if completedTodos.length }}
        <button class='clear-completed' on-tap='clearCompleted()'>
          Clear completed ({{ completedTodos.length }})
        </button>
      {{/if}}
    </section>
  {{/if}}
</div>


<script>
  // set up some filters
  var filters = {
    completed: function ( item ) { return item.completed; },
    active: function ( item ) { return !item.completed; },
    all: function () { return true; }
  };

  component.exports = {
    data: function () {
      return {
        filters: filters,
        currentFilter: 'all'
      };
    },

    computed: {
      completedTodos: function () {
        return this.get( 'items' ).filter( filters.completed );
      },

      activeTodos: function () {
        return this.get( 'items' ).filter( filters.active );
      },

      filter: function () {
        return filters[ this.get( 'currentFilter' ) ];
      }
    },

    // Methods for interacting with the list
    createTodo: function ( event ) {
      this.push( 'items', {
        description: event.node.value,
        completed: false
      });

      event.node.value = ''; // reset
    },

    submitEdit: function ( event, index ) {
      this.set( 'items[' + index + '].description', event.node.value );
      this.set( 'currentlyEditing', null );
    },

    clearCompleted: function () {
      var items = this.get( 'items' );
      var i = items.length;

      while ( i-- ) {
        if ( items[i].completed ) {
          this.splice( 'items', i, 1 );
        }
      }
    },

    toggleAll: function ( event ) {
      this.set( 'items[*].completed', event.node.checked );
    },

    // Event and transition plugins
    events: {
      tap: require( 'ractive-events-tap' )
    },

    transitions: {
      slide: require( 'ractive-transitions-slide' )
    },

    // Decorators allow you to interact with DOM nodes
    // when they are created or destroyed. In this case,
    // we want to select the contents of the edit <input>
    // as soon as it's created
    decorators: {
      select: function ( node ) {
        setTimeout( function () {
          node.select();
        });

        return {
          // teardown is a noop
          teardown: function () {}
        };
      }
    },

    // disable slide transitions during initial render
    noIntro: true
  };
</script>

<style>
  button, button:hover, button:active, button:focus {
    border: none;
    background: none;
    margin: 0;
  }

  header {
    padding: 0;
    margin: 0;
  }

  .new-todo,
  .edit {
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    outline: none;
    color: inherit;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .new-todo {
    padding: 16px 16px 16px 60px;
    border: 1px dotted #ddd;
  }

  .edit {
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 1px 1px 5px 0 rgba(0, 0, 0, 0.2);
  }

  label[for='toggle-all'] {
    display: none;
  }

  .toggle-all-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 4em;
  }

  .toggle-all {
    position: absolute;
    top: -42px;
    left: -4px;
    width: 40px;
    text-align: center;
    border: none; /* Mobile Safari */
  }

  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .item {
    position: relative;
    font-size: 24px;
    border-bottom: 1px dotted #ccc;
    margin: 0;
  }

  .view {
    padding: 0 40px;
  }

  .item:last-child {
    border-bottom: none;
  }

  .item.editing {
    border-bottom: none;
    padding: 0;
  }

  .item.editing .edit {
    display: block;
    width: 100%;
    padding: 13px 17px 12px 61px;
    margin: 0;
  }

  .item.editing .view {
    display: none;
  }

  .toggle {
    text-align: center;
    width: 40px;
    /* auto, since non-WebKit browsers doesn't support input styling */
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto 0;
    outline: none;
    border: none; /* Mobile Safari */
    -webkit-appearance: none;
    /*-moz-appearance: none;*/
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
  }

  .toggle:after {
    content: '\2713';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 20px;
    color: #d9d9d9;
    text-shadow: 0 -1px 0 #bfbfbf;
  }

  .toggle:checked:after {
    color: #729d34;
    text-shadow: 0 1px 0 #669991;
  }

  .toggle-all::after {
    font-size: 28px;
  }

  .item label {
    word-break: break-word;
    padding: 15px;
    margin-left: 5px;
    display: block;
    line-height: 1.2;
    -webkit-transition: color 0.4s;
    -moz-transition: color 0.4s;
    -ms-transition: color 0.4s;
    -o-transition: color 0.4s;
    transition: color 0.4s;
  }

  .item.completed label {
    color: #a9a9a9;
    text-decoration: line-through;
  }

  .item .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    font-size: 22px;
    color: rgb(180,0,0);
    opacity: 0.3;
    cursor: pointer;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
  }

  .item .destroy:hover {
    opacity: 1;
  }

  .item .destroy:after {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%,-50%);
    content: '\274C';
    line-height: 1;
  }

  .item:hover .destroy {
    display: block;
  }

  .item.editing:last-child {
    margin-bottom: -1px;
  }

  .footer {
    position: relative;
    height: 1.3em;
    color: #777;
    z-index: 1;
    text-align: center;
    background: #f9f9f9;
    padding: 0.5em;
    border-top: 1px dotted #adadad;
  }

  .todo-count {
    float: left;
    text-align: left;
  }

  .filters {
    margin: 0;
    padding: 0;
    list-style: none;
    position: absolute;
    right: 0;
    left: 0;
  }

  .filters li {
    display: inline;
    color: #83756f;
    margin: 2px;
    text-decoration: none;
    cursor: pointer;
  }

  li.selected {
    font-weight: bold;
  }

  .clear-completed {
    float: right;
    position: relative;
    line-height: 20px;
    text-decoration: none;
    background: rgba(0, 0, 0, 0.1);
    font-size: 11px;
    padding: 0 10px;
    border-radius: 3px;
    box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.2);
  }

  .clear-completed:hover {
    background: rgba(0, 0, 0, 0.15);
    box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.3);
  }
</style>
```
