const util = require('util')
const RedPanda = require('./src/RedPanda')

let net = new RedPanda()
net.set('a', {method: 'GET'})
net.set('b', {url: 'https://jsonplaceholder.typicode.com/posts/1', inherits: ['a']})
net.set('c', {url: 'https://jsonplaceholder.typicode.com/posts/2'})
net.set('d', ['b', 'c'])

console.log(util.inspect(net.get('b'), {showHidden: false, depth: null}))

let net2 = new RedPanda()
net2.set('b', {b : 5})
console.log(util.inspect(net2.get('b'), {showHidden: false, depth: null}))
console.log(util.inspect(net.get('d'), {showHidden: false, depth: null}))

net.send('d')
  .then(data => { console.log(data.length); return  Promise.all(data.map(item => item.json()))})
  .then(jsonStack => jsonStack.forEach(json => console.log(json)))
