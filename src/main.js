import RedPanda from './RedPanda'

// const app = self = window ? window : global

// 1) Object.assign
// ------------------------------------
// We can't rely on Object.assign being a function since it may be buggy, so
// defer to `object-assign`. If our Object.assign implementation is correct
// (determined by `object-assign` internally) the polyfill will be discarded
// and the native implementation used.
Object.assign = require('object-assign')

// 3) Exports RedPanda
require('whatwg-fetch')

window.RedPanda = RedPanda
