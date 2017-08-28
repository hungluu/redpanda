// const util = require('util')
import RedPanda from './src/RedPanda'
// import PromiseCollection from './src/PromiseCollection'
// const kindOf = require('kind-of')

var net = new RedPanda()
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
  [
    {url: 'https://jsonplaceholder.typicode.com/posts/7'},
    {url: 'https://jsonplaceholder.typicode.com/posts/8'},
  ],
  'g'
])
net.set('all_p', ['b', 'c', 'e', 'f', 'd_p',
  net.sequence([
    [
      {url: 'https://jsonplaceholder.typicode.com/posts/10'},
      {url: 'https://jsonplaceholder.typicode.com/posts/11'}
    ],
    {url: 'https://jsonplaceholder.typicode.com/posts/12'},
    {url: 'https://jsonplaceholder.typicode.com/posts/13'}
  ])
])


// net.send('all_p')
//   .then(data => data.json())
//   .then(json => console.log(json.id))
//   .catch(err => console.log(err))

// net.send('all_p')
//   .then(data => data.json())
//   .then(json => console.log(json.id))
//   .catch(err => console.log(err))

var queueStack = net.send('all_p')
// console.log(queueStack)
queueStack
  .then(data => data.json())
  .then(json => { console.log(json.id); return json.id })
  // .catch(err => console.log(err))
  .all()
  .then((data) => console.log(data))
  .catch(errorMessage => console.log(errorMessage));
