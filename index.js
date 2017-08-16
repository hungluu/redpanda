const querystring = require('querystring')
const url = require('url')

console.log(querystring.parse(url.parse('https://localhost/test?a=1&b=2#aaa').query))
console.log(querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' }))

const fetch = require('isomorphic-fetch')
fetch('https://ispeak.vn/api/top_student/1').then(function (data) {
  return data.json()
}).then(function (json) {
  console.log(json)
})
