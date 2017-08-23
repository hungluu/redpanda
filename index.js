const util = require('util')
const RedPanda = require('./src/main')
import PromiseStack from './src/PromiseStack'
const kindOf = require('kind-of')

let net = new RedPanda()
net.set('a', {method: 'GET'})
net.set('b', {url: 'https://jsonplaceholder.typicode.com/posts/1', inherits: ['a']})
net.set('c', {url: 'https://jsonplaceholder.typicode.com/posts/2'})
net.set('d', [
  // multi-level stacked requests is allowed
  [
    {url: 'https://jsonplaceholder.typicode.com/posts/5'},
    {url: 'https://jsonplaceholder.typicode.com/posts/6'},
    [
      {url: 'https://jsonplaceholder.typicode.com/posts/7'},
      {url: 'https://jsonplaceholder.typicode.com/posts/8'}
    ]
  ],
  'g' // stacking is done when a request made, not when registry record is set
])
net.set('e', {url: 'https://jsonplaceholder.typicode.com/posts/3'})
net.set('f', {url: 'https://jsonplaceholder.typicode.com/posts/4'})
net.set('g', {url: 'https://jsonplaceholder.typicode.com/posts/9', inherits: ['a', 'b']})
net.set('all', ['b', 'c', 'e', 'f', 'd'])
net.set('d_p', [
  {url: 'https://jsonplaceholder.typicode.com/posts/5'},
  {url: 'https://jsonplaceholder.typicode.com/posts/6'},
  {url: 'https://jsonplaceholder.typicode.com/posts/7'},
  {url: 'https://jsonplaceholder.typicode.com/posts/8'},
  'g'
])
net.set('all_p', ['b', 'c', 'e', 'f', 'd_p'])
// net.set('e', {url: 'https://'})

// console.log(util.inspect(net.get('b'), {showHidden: false, depth: null}))

// let net2 = new RedPanda()
// net2.set('b', {b : 5})
// console.log(util.inspect(net2.get('b'), {showHidden: false, depth: null}))
// console.log(util.inspect(net.get('d'), {showHidden: false, depth: null}))
const flattenPromises = (data, walkFn, collector) => {
  let dataKind = kindOf(data)
  if (dataKind === 'object') {
    let itemPromise = walkFn(data)

    if (collector) {
      collector.promises.push(itemPromise)
    }
    else {
      return Promise.all([itemPromise])
    }
  }
  else if (dataKind === 'array') {
    if (typeof collector === 'undefined') {
      var collector = {
        promises: []
      }
    }

    data.forEach((item) => {
      flattenPromises(item, walkFn, collector)
    });

    return Promise.all(collector.promises);
  }
  else {
    return Promise.reject('Not supported')
  }
}
// net.sendSequence('all')
//   .then(data => flattenPromises(data, (i) => i.json()))
//   .then(json => json.forEach(i => console.log(i)))
//   .catch(err => console.log(err))

net.send('all')
  .then(data => flattenPromises(data, (i) => i.json()))
  .then(json => json.forEach(i => console.log('Parallel ' + i.id)))
  .catch(err => console.log(err))
