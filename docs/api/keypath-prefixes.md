# Keypath prefixes

Normally, keypaths are resolved following a [defined routine](../concepts/templates.md#references). But there are times where you want to skip the normal resolution routine and resolve a keypath relative to a specific data context. Keypath prefixes allow you to specify which data context a keypath resolves to, regardless if it resolves to something or not.

## Current context (`.`)

Resolves the keypath relative to the current data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNsABz594nLgGUACgHldAOVHiFAWykxyAD1knWDaQHNq8Uhs2nypMFzsKA9P7MACpg1DDUzOTYzPB8iipqfmgmmCak1KZKyFLUnAAGfgA8AlQAfLqIpNjkApHekeakllYYzEJ8iMxghDTMwMAJqixoaEX+pZRlfgMAxMxNLcyjfqwl5QCS8DV1zA0LFtZtHV3e5PAA1u2d3b2RA0Nqy2gAdOOT0-IKzOtTW8wRQjILxCNoNCJRGJxfqDF7+ZTDZ7vcozYD+FbyQrwNAASgA3CAsKQ8EVsMRLEpSIoYMQALwMcCkUhKbCQQKIeBKC6OF7EPimfwwEgUGgMsrjMkU0hlEBoIA"></div>

```js
Ractive({
  el: 'body',
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

## Parent context (`../`)

Resolves the keypath relative to the parent data context. This prefix can be used more than once to reference ancestors.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bNyAzlxjVCycqRFj5EtYQC2s8QoYVl3AQcMBGUadbnr648zkLm580pUujAEwOel6kzjYmId5hFn42AMzBntFojqGpIRmsmKak1IYADshS1JwABmkAPAJUAHwAmnyIzIRqiizAwIoCzGholQD0NZS1aZ0AxMz+hr1ZoebVdY3NrdTt7l1Ks4PDo-DmnhNTNrNp0Ysjyy1t5B2bPX07dWmHwJPTp1ExC7tXq+udbrbIbPL7RM7fUgXWoAUWwxEIBVuAHMAHTop4jCHnX5Na5rW4bZjogZbR4grFgmLQv43O7E1EDElk-oUvbJSE0vH-QmAkn8xkszHsswxToDPoQ8WS+TmaVzCrwNAASgA3CAsKQ8JV4TByAVSMxsDBiABeBjgUikArYSADAaIeAFADWaOIfEMAxgJAoNAttUGuv1pFqIDQQA"></div>

```js
Ractive({
  el: 'body',
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

## Instance root context (`~/`)

Resolves the keypath relative to the instance's root data context.

<div data-playground="N4IgFiBcoE5QdgVwDbIL4BoQGcogEoCGAxgC4CWAbgKYAUwAOvAATPXKTMDkARgPYATAJ5cMTVgMKlCnRi1bMYfPgFtOXAIyjxCgA58Y0jszkLmDUktXqATNvmsL+w4WOmFFi1bXcAzPbNPUmcjWR1HUiDvdQAWAI9I0jRw8ySU5PlMHVJqFV1kKWpOAAMU4GAAYmYQ12Y0DIszcqqa5DqMsybK6oMjdpSgzwdUoIAeASoAPgBReByYcngAcwA6NdGAegnKSYHEi3GpgE0+RGZCGGpmRcVlFRNgZgA-De92ze3d4cHSQ52Ts4XK43N7lZ4bVorN71D5TPZjT4A86Xa4sUGPF6QyHQtCwnbwxJ-SZIoGo26qB7grG9VwrbF3d5bOHfRLlDb1PZsjnyCxcjrMUrwNAASgA3CAsKQ8KNsMQFrpSMxsDBiABeBjgUjBbCQDYbRDwXQAa1WxFUrxIFBoGsmm1l8tIkxAaCAA"></div>

```js
Ractive({
  el: 'body',
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
