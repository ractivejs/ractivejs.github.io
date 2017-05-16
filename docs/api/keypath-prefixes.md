# Keypath prefixes

Normally, keypaths are resolved following a [defined routine](../concepts/templates.md#references). But there are times where you want to skip the normal resolution routine and resolve a keypath relative to a specific data context. Keypath prefixes allow you to specify which data context a keypath resolves to, regardless if it resolves to something or not.

## Current context (`.`)

Resolves the keypath relative to the current data context.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWuAA4CBTbjwDKABQDyegHJiJigLbSYFAB5zTbBjLRMymrWYpkwPe4oD0fiwAKmAIMAgsFLgsTAJKquq+GKbYpmQIZsoc0gjcAAa+ADxI1AB8egCuZLgUSBFeERZkVtZYLMICFSxgRDQswMDxaqwYGIV+JVSlvgMAxCxNLSyjvmzFZQCSTDV1LA0LljZtHV1eFEwA1u2d3b0RA0PqyxgAdOOT0wqKLOtTWyzhIgcTzCNoNcKRaKxfqDF5+FTDZ7vMozYB+FYKApMDAASgA3CAcGR4JggA"></div>

```js
Ractive({
  target: 'body',
  data: {
    spoon: 'SPOON',
    matrix: {
    	agent: 'Smith'
      // There is no spoon
    }
  },
  template: `
    <div>Outside the matrix, you have {{ spoon }}</div>
    {{# matrix }}
      <div>Inside the matrix, you think you have {{ spoon }}.</div>
      <div>In reality, there is no {{ ./spoon }}</div>
    {{/}}
  `
});

// Outside the matrix, you have SPOON
// Inside the matrix, you think you have SPOON.
// In reality, there is no
```

## Parent keypath (`../`)

Resolves the keypath relative to the parent data. This prefix can be used more than once to reference ancestors.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWFJNx4wERDhTKjxCyeqIBbORMUNKK3kkNGAjGLNsLNjSZbzFLCxeWrXxgBMjvreZC62pqE+4Zb+tgDMIV4xGE5haaGZbNhmZAhGAA4c0gjcAAbpADxI1AB8AJoCAK4sROpKrMDASkgsGBhVAPS1VHXp3QDELAFG-dlhFjX1Ta3tCJ0ePcrzw6PjTBZeUzO28+kxy2OrbR0UXdt9A3v16cfA07Pn0bFL+zfrTbdXq7EavH4xC6-MhXOoAUVwJCIhXuKAAdBiXmMoZd-i1bht7lsWBihjtnmDsRDYrCAXcHiS0UNSeTBpSDilobT8YCicDSQKmaysRzzLFukMBlCJVKFBYZQtKkwMABKADcIBwZHgmCAA"></div>

```js
Ractive({
  target: 'body',
  data: {
    id: 'reality',
    dream: {
    	id: 'dream1',
    	dream: {
    		id: 'dream2',
    		dream: {
    			id: 'dream3',
    		}
    	}
    }
  },
  template: `
    <div>You are in {{ id }}</div>
    {{# dream }}
      <div>You are in {{ id }}</div>
      {{# dream }}
        <div>You are in {{ id }}</div>
        {{# dream }}
          <div>You are in {{ id }}</div>

          <div>Escaping...</div>
          <div>You are in {{ ../id }}</div>
          <div>You are in {{ ../../id }}</div>
          <div>You are in {{ ../../../id }}</div>
        {{/}}
      {{/}}
    {{/}}
  `
});

// You are in reality
// You are in dream1
// You are in dream2
// You are in dream3
// Escaping...
// You are in dream2
// You are in dream1
// You are in reality
```

## Parent context (`^^/`)

While parent keypaths and parent contexts are often the same thing, there are some scenarios in which they are very, very different. For instance, in this horribly contrived example:

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATOmEwDm1pkzA5ACMA9gBMAnvwxNWowuz6MWrZmGEBbaoMLZqimStaDE5ZKPLxOARkXN4hTX34B5AA7UY88sPjZ+zNANWTCDmbV1sPgBtUNYlQ0NjU3NLG2ZgOwc9AQBZamxsZgAJQlR-QOVDEMqVeISjEzMLa1t7R1zqc2JS5gAVanhSctiA0IBdA2rWUmp1V2R5bIADUOBgAGJqEjAwnXy0Cvq19YB3clIdgD8AejVNcOoDkdYAHnNKAD4L6lUNH4ewigUtZmORCmsAHRJJqpCFtR5oF7Xd4fZ7MN5UL5gH7ERAwGADUigmaeCg+Xa6QHJZpWUHg4AAPQZ1yhjWBVjhWQOSJRIzW1zOFyeNX5W2IYGFrBW8DQAEoANwgNBAA"></div>
```js
Ractive({
  target: 'body',
  data: {
    homebase: {
      building1: { name: 'Operations' }
    },
    bases: [
      {
        building1: { name: 'Mess Hall' }
      },
      {
        building1: { name: 'Medical Tent' }
      }
    ]
  },
  template: `
    {{#each bases}}
      {{#with ~/homebase}}
        <div>the home base bulding1 is {{.building1.name}}</div>
        <div>the current iteration base building1 is {{^^/.building1.name}}</div>
      {{/with}}
    {{/each}}
  `
});

// the home base bulding1 is Operations
// the current iteration base building1 is Mess Hall
// the home base bulding1 is Operations
// the current iteration base building1 is Medical Tent
```

## Instance root context (`~/`)

Resolves the keypath relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5SBTAJgcwSAvgGhAZ3gEoCGAxgC4CWAbggBTAA6AdgAQsIA2kLA5AEYB7JAE8eWZmyREyRbo1ZsWMAQIC23HgEYxExQAcBMGVxbzFLBmWVqNAJh0K2lg0aImziy5evreAZgdzLzIXYzldJzJgnw0AFkDPKLIMCItk1JSFbF0yBFU9DmkEbgADVOBgAGIWULcWDEzLcwrq2o56zPNmqprDYw7U4K9HNOCAHiRqAD4AUSZcmAomFAA6NbGAekmqKcGkywnpgE0BAFcWIhgEFiWlFVVTYBYAPw2fDs3t3ZGhskOdk7nS7XW7vCovDZtFbvBqfaZ7cZfQEXK43Vhgp6vKFQmEYOE7BFJf5TZHAtF3NSPCHYvpuFY4+4fLbwn5JCobBp7dmchSWbmdFhlJgYACUAG4QDgyPBMEA"></div>

```js
Ractive({
  target: 'body',
  data: {
    room: '1',
    portal: {
    	room: '2',
    	portal: {
    		room: '3',
    		portal: {
    			room: '4',
    		}
    	}
    }
  },
  template: `
    {{# portal }}
	    {{# portal }}
        {{# portal }}
    			<div>Entering...</div>
    			<div>You are in room {{ ~/room }}</div>
    			<div>You are in room {{ ~/portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.room }}</div>
    			<div>You are in room {{ ~/portal.portal.portal.room }}</div>
    		{{/}}
    	{{/}}
  	{{/}}
  `
});

// Entering...
// You are in room 1
// You are in room 2
// You are in room 3
// You are in room 4
```
