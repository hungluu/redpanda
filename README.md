# RedPanda

RedPanda - A lightweight Javascript library for organizing your API calls, with `fetch` and Promises

[![npm][npm]][npm-url] [![deps][deps]][deps-url] [![builds][builds]][builds-url]
[![saucelabs-matrix][saucelabs-matrix]][saucelabs-matrix-url]

### Features
- Fast and reliable, less code, complete more tasks
- Built on top of whatwg `fetch` API, Promises influenced
- Strict type checking, less error prones
- Well tested with mocha
- Same code for browser (IE9+) and NodeJS, more will be added later...

### Table of contents
- [Installation](#installation)
- [Simple requests](#simple-requests)
- [Fetch API](#fetch-api)
- [Build advanced AJAX application structure](#build-advanced-ajax-application-structure)
- [Options reusing](#options-reusing)

## Installation
```bash
npm i --save redpanda   # or yarn add redpanda
```
RedPanda can also be adopted into your view file from awesome [Jsdelivr](https://www.jsdelivr.com/)

```html
<script src="https://cdn.jsdelivr.net/npm/redpanda@latest/dist/redpanda.js"></script>
```
For older browser like IE11 which doesn't supports the Promise API natively, don't worry we've already packaged it for you. All you need to do is including only one line:
```html
<script src="https://cdn.jsdelivr.net/npm/redpanda@latest/dist/redpanda.promises.js"></script>
```

## Simple requests

#### 1. Calling API and handling response is so simple
```javascript
net = new RedPanda()
net.send({url: '...'})
  .then((data) => console.log(data)) // Body {...}
// Or static method calls like
RedPanda.send({url: '...'}).then((data) => console.log(data))
// ES5 code be like
RedPanda.send({url: '...'}).then(function (data) {
  console.log(data)
})
```

#### 2. Post a request and parse JSON responses
```javascript
// POST return JSON --> JSON.parse object automatically
net.send({url: '...'})
  .then((data) => data.json())
  .then((json) => console.log(json)) // {id: 3, text: 'Lorem ...'}
```

#### 3. Get the responsed HTML
```javascript
net.send({url: '...'})
  .then((data) => data.html())
  .then((html) => console.log(html)) // <p>Lorem Islum</p>
```

#### 4. Calling a bundle of requests parallelly
```javascript
net.send([{url: '...'}, {url: '...'}])
  .then((data) => console.log(data)) // Body {...}
// Or static method calls like
RedPanda.send([{url: '...'}, {url: '...'}]).then((data) => console.log(data)) // Body {...}
```

#### 5. Calling a bundle of requests sequentially
```javascript
let sequence = net.sequence([{url: '...'}, {url: '...'}])
net.send(sequence)
  .then((data) => console.log(data)) // Body {...}
// Or static method calls like
let sequence = RedPanda.sequence([{url: '...'}, {url: '...'}])
RedPanda.send(sequence).then((data) => console.log(data))
```

## Fetch API

This library is built on top of [Github's Fetch polyfill](https://github.com/github/fetch) for browser and [Node native http fetch](https://github.com/bitinn/node-fetch) for NodeJS environment

#### 1. Post a form
```javascript
net.send({url: '...', method: 'POST', body: new FormData(formElement))
```

#### 2. Post JSON
```javascript
net.send({
  url: '...',
  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Hubot',
    login: 'hubot',
  })
})
```

#### 3. Post a file
```javascript
var data = new FormData()
data.append('file', inputElement.files[0])
net.send({
  url: '...',
  method: 'POST',
  body: data
})
```

## Build advanced AJAX application structure

#### 1. Send a parallel stack

```javascript
// Create some entry points
net.set('entry-1', {url: '...'})
net.set('entry-2', {url: '...'})
net.set('entry-3', {url: '...'})

// Create a parallel stack
net.set('parallel', ['entry-1', 'entry-2', 'entry-3'])

// Send the parallel stack
net.send('parallel').then(...) // reponses par-3, par-1, par-2
```

Attach callback into last entry (entry-3)
```javascript
net.send('parallel')
  .last() // point to last promise
  .then(...) // responses par-3
```

Or wait for all reponses
```javascript
net.send('parallel')
  .all() // wait for all promise responses
  .then(...) // responses [par-1, par-2, par-3]
```

#### 2. Send a sequence (request sent only when previous one has responsed)

```javascript
// Create a sequence
net.set('sequence', net.sequence(['entry-1', 'entry-2', 'entry-3']))

// Send the sequence
// And receive responses sequentially
net.send('sequence').then(...) // responses seq-1, seq-2, seq-3
```

Attach callback into last entry (entry-3)
```javascript
net.send('sequence')
  .last() // point to last promise
  .then(...) // responses seq-3
```

Or wait for all reponses
```javascript
net.send('sequence')
  .all() // wait for all promise responses
  .then(...) // responses [seq-1, seq-2, seq-3]
```

#### 3. Send a parallel stack that contains a sequence
```javascript
// Create a parallel stack that contains a sequence
net.set('parallel-sequence', ['parallel', 'sequence'])

// Send the parallel stack that contains a sequence
// The requests inside sequence still keep their order
net.send('parallel-sequence').then(...) // responses par-3, par-1, seq-1, par-2, seq-2, seq-3
```

Attach callback into last entry (entry-3)
```javascript
net.send('parallel-sequence')
  .last() // point to last promise, which is a PromiseCollection
  .then(...) // responses seq-1, seq-2, seq-3
```

Or wait for all reponses
```javascript
// The reponses of sequence still stack with each other
net.send('parallel-sequence')
  .all() // wait for all promise responses
  .then(...) // responses [par-1, par-2, par-3, [seq-1, seq-2, seq-3]]
```

## Options reusing

RedPanda 's option inheritance will help you build a flexible option system

```javascript
let net = new RedPanda()
// Common options
// Send request including cookies
net.set('send-with-cookies', {credentials: 'include'})
// Allow CORS
net.set('allow-cors', {mode: 'cors'})
// Common xsrf implementation
net.set('xsrf', {headers: {'Accept': 'application/json', 'X-XSRF-TOKEN': getCookieValue('XSRF-TOKEN')})

// Reuse common options
net.send({url: '...', inherits: ['send-with-cookies', 'allow-cors', 'xsrf']}).then(...)
```

### Want more?

Please dive deep into our [API DOC](https://github.com/hungluu/redpanda/blob/master/APIDOC.md)


### Message from author

Hello brothers and sisters. Your contribution is my treasure. Please send me a pull request if you have any new ideas. Or open an issues if you have problems using this project. I've got your back :D :D.

I am **RedPanda**, at your services.


![alt text](https://hungluu.com/assets/images/redpanda1.jpg "RedPanda - A lightweight Javascript library for executing, mapping, chaining data with your API calls")


[npm]: https://img.shields.io/npm/v/redpanda.svg
[npm-url]: https://npmjs.com/package/redpanda

[node]: https://img.shields.io/node/v/redpanda.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/hungluu/redpanda.svg
[deps-url]: https://david-dm.org/hungluu/redpanda

[tests-url]: https://travis-ci.org/hungluu/redpanda
[tests]: https://img.shields.io/travis/hungluu/redpanda/master.svg

[builds-url]: https://travis-ci.org/hungluu/redpanda
[builds]: https://travis-ci.org/hungluu/redpanda.svg?branch=master

[licenses-url]: https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fhungluu%2Fredpanda?ref=badge_shield
[licenses]: https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fhungluu%2Fredpanda.svg?type=shield

[cover]: https://img.shields.io/coveralls/hungluu/redpanda.svg
[cover-url]: https://coveralls.io/r/hungluu/redpanda/

[saucelabs-build]: https://saucelabs.com/buildstatus/redpanda?saucy
[saucelabs-build-url]: https://saucelabs.com/beta/builds/0b046336cca0438b9a45b883577bd5ca

[saucelabs-matrix]: https://saucelabs.com/browser-matrix/redpanda.svg
[saucelabs-matrix-url]: https://saucelabs.com/beta/builds/0b046336cca0438b9a45b883577bd5ca
