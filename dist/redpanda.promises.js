/*! RedPanda 0.0.3 | EosDreams | Hung Luu (c) 2017 | MIT LICENSE */
!function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/Content/",e(e.s=30)}([function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){"use strict";e.__esModule=!0;var r=n(11),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}()},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){var n=t.exports={version:"2.5.0"};"number"==typeof __e&&(__e=n)},function(t,e,n){var r=n(18),o=n(19),i=n(21),u=Object.defineProperty;e.f=n(2)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),i=r(o),u=n(1),a=r(u),s=n(9),c=r(s),f=function(){function t(e,n){(0,i.default)(this,t),e.forEach(function(e){if(e instanceof t)throw Error("[RedPanda RequestSequence] Can not stack another sequence inside.")}),this.net=n,this.resolveStack=[],this.rejectStack=[],this.items=e,this.promises=[]}return(0,a.default)(t,[{key:"createPromises",value:function(){var t=this;return this.items.map(function(e){return new Promise(function(e,n){t.resolveStack.push(e),t.rejectStack.push(n)})})}},{key:"nextRequest",value:function(){var t=this;if(this.next(),this.valid()){var e=this.key,n=this.resolveStack[e],r=this.rejectStack[e],o=this.current();this.net.send(o).then(function(e){n(e),t.nextRequest()}).catch(function(t){return r(t)})}}},{key:"next",value:function(){this.key++}},{key:"stack",value:function(){return new c.default(this.promises)}},{key:"rewind",value:function(){this.key=-1}},{key:"current",value:function(){return this.items[this.key]}},{key:"count",value:function(){return this.items.length}},{key:"valid",value:function(){return this.key>=0&&this.key<this.count()}},{key:"start",value:function(){return this.resolveStack=[],this.rejectStack=[],this.promises=this.createPromises(),this.rewind(),this.nextRequest(),this.stack()}}]),t}();e.default=f},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),i=r(o),u=n(1),a=r(u),s=function(){function t(e){(0,i.default)(this,t),this.items=e}return(0,a.default)(t,[{key:"get",value:function(e){return this.items[e]instanceof Promise||this.items[e]instanceof t?this.items[e]:Promise.reject(new Error("[RedPanda PromiseCollection] No promise found for index "+e))}},{key:"count",value:function(){return this.items.length}},{key:"first",value:function(){return this.get(0)}},{key:"last",value:function(){return this.get(this.count()-1)}},{key:"all",value:function(){return Promise.all(this.items.map(function(e){return e instanceof t?e.all():e}))}},{key:"then",value:function(t){return this.items=this.items.map(function(e){return e.then(t)}),this}},{key:"catch",value:function(t){return this.items=this.items.map(function(e){return e.catch(t)}),this}}]),t}();e.default=s},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),i=r(o),u=n(1),a=r(u),s=n(23),c=r(s),f=n(9),l=r(f),h=n(8),d=r(h),y=function(){function t(){var e=this;(0,i.default)(this,t);var n=new c.default;this.get=function(t){return n.get(t)},this.set=function(t,r){return n.set(t,r),e},this.flatten=function(t){return n.flatten(t)}}return(0,a.default)(t,[{key:"send",value:function(t){var e=this,n=this.flatten(t).map(function(t){return t instanceof d.default?new d.default(t.items,e).start():fetch(t.url,t)});return new l.default(n)}},{key:"sequence",value:function(t){return new d.default(this.flatten(t),this)}},{key:"resolve",value:function(t){return Promise.resolve(t)}},{key:"reject",value:function(t){return Promise.reject(t)}},{key:"waitAll",value:function(t){return Promise.all(t)}}]),t}();e.default=y},function(t,e,n){t.exports={default:n(12),__esModule:!0}},function(t,e,n){n(13);var r=n(5).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(14);r(r.S+r.F*!n(2),"Object",{defineProperty:n(6).f})},function(t,e,n){var r=n(4),o=n(5),i=n(15),u=n(17),a=function(t,e,n){var s,c,f,l=t&a.F,h=t&a.G,d=t&a.S,y=t&a.P,p=t&a.B,b=t&a.W,v=h?o:o[e]||(o[e]={}),m=v.prototype,w=h?r:d?r[e]:(r[e]||{}).prototype;h&&(n=e);for(s in n)(c=!l&&w&&void 0!==w[s])&&s in v||(f=c?w[s]:n[s],v[s]=h&&"function"!=typeof w[s]?n[s]:p&&c?i(f,r):b&&w[s]==f?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(f):y&&"function"==typeof f?i(Function.call,f):f,y&&((v.virtual||(v.virtual={}))[s]=f,t&a.R&&m&&!m[s]&&u(m,s,f)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){var r=n(16);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,n){var r=n(6),o=n(22);t.exports=n(2)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(3);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){t.exports=!n(2)&&!n(7)(function(){return 7!=Object.defineProperty(n(20)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(3),o=n(4).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(3);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),i=r(o),u=n(1),a=r(u),s=n(8),c=r(s),f=n(24),l=function(){function t(){(0,i.default)(this,t),this.items={}}return(0,a.default)(t,[{key:"set",value:function(t,e){if("array"!==f(e)&&"object"!==f(e))throw new Error("[RedPanda Registry] Only array and object value is accepted");if("string"!==f(t))throw new Error("[RedPanda Registry] Only array and object value is accepted");return this.items[t]=e,this}},{key:"get",value:function(t,e){var n=this,r=f(t);if("object"===r)return e?this.applyInherits(t):[this.applyInherits(t)];if("array"===r)return t.map(function(t){return n.get(t,!0)});if("string"!==r)throw Error("[RedPanda Registry] invalid key");return"array"===f(this.items[t])?this.items[t].map(function(t){return n.get(t,!0)}):e?this.applyInherits(this.items[t]):[this.applyInherits(this.items[t])]}},{key:"applyInherits",value:function(t){if("object"!==f(t))throw new Error("[RedPanda Registry] item must be object to inherit");return"array"===f(t.inherits)?Object.assign({},this.join(t.inherits),t):t}},{key:"has",value:function(t){return void 0!==this.items[t]}},{key:"join",value:function(t){var e=this;return t.map(function(t){return e.getRaw(t)}).reduce(function(t,e){return Object.assign({},t,e)})}},{key:"getRaw",value:function(t){var e=this,n=f(t),r=f(this.items[t]);if("object"===n)return t;if("array"===n)return t.map(function(t){return e.getRaw(t)});if("string"!==n)throw Error("[RedPanda Registry] invalid key for getRaw");return"array"===r?this.items[t].map(function(t){return e.getRaw(t)}):this.items[t]}},{key:"flatten",value:function(t,e){var n=this,r=e||[];return this.get(t).forEach(function(t){if(t instanceof c.default)return r.push(t);switch(f(t)){case"array":n.flatten(t,r);break;case"object":r.push(t);break;default:throw Error("[RedPanda Registry] invalid type to flatten")}}),r}}]),t}();e.default=l},function(t,e){function n(t){return t.constructor&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)}var r=Object.prototype.toString;t.exports=function(t){var e=typeof t;return"undefined"===e?"undefined":null===t?"null":!0===t||!1===t||t instanceof Boolean?"boolean":"string"===e||t instanceof String?"string":"number"===e||t instanceof Number?"number":"function"===e||t instanceof Function?void 0!==t.constructor.name&&"Generator"===t.constructor.name.slice(0,9)?"generatorfunction":"function":void 0!==Array.isArray&&Array.isArray(t)?"array":t instanceof RegExp?"regexp":t instanceof Date?"date":(e=r.call(t),"[object RegExp]"===e?"regexp":"[object Date]"===e?"date":"[object Arguments]"===e?"arguments":"[object Error]"===e?"error":"[object Promise]"===e?"promise":n(t)?"buffer":"[object Set]"===e?"set":"[object WeakSet]"===e?"weakset":"[object Map]"===e?"map":"[object WeakMap]"===e?"weakmap":"[object Symbol]"===e?"symbol":"[object Map Iterator]"===e?"mapiterator":"[object Set Iterator]"===e?"setiterator":"[object Int8Array]"===e?"int8array":"[object Uint8Array]"===e?"uint8array":"[object Uint8ClampedArray]"===e?"uint8clampedarray":"[object Int16Array]"===e?"int16array":"[object Uint16Array]"===e?"uint16array":"[object Int32Array]"===e?"int32array":"[object Uint32Array]"===e?"uint32array":"[object Float32Array]"===e?"float32array":"[object Float64Array]"===e?"float64array":"object")}},function(t,e,n){"use strict";function r(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}var o=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(t){r[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var n,a,s=r(t),c=1;c<arguments.length;c++){n=Object(arguments[c]);for(var f in n)i.call(n,f)&&(s[f]=n[f]);if(o){a=o(n);for(var l=0;l<a.length;l++)u.call(n,a[l])&&(s[a[l]]=n[a[l]])}}return s}},function(t,e){!function(t){"use strict";function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function n(t){return"string"!=typeof t&&(t=String(t)),t}function r(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return v.iterable&&(e[Symbol.iterator]=function(){return e}),e}function o(t){this.map={},t instanceof o?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function i(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function u(t){return new Promise(function(e,n){t.onload=function(){e(t.result)},t.onerror=function(){n(t.error)}})}function a(t){var e=new FileReader,n=u(e);return e.readAsArrayBuffer(t),n}function s(t){var e=new FileReader,n=u(e);return e.readAsText(t),n}function c(t){for(var e=new Uint8Array(t),n=new Array(e.length),r=0;r<e.length;r++)n[r]=String.fromCharCode(e[r]);return n.join("")}function f(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function l(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(v.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(v.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(v.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(v.arrayBuffer&&v.blob&&w(t))this._bodyArrayBuffer=f(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!v.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!_(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=f(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):v.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},v.blob&&(this.blob=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return s(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(c(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},v.formData&&(this.formData=function(){return this.text().then(y)}),this.json=function(){return this.text().then(JSON.parse)},this}function h(t){var e=t.toUpperCase();return g.indexOf(e)>-1?e:t}function d(t,e){e=e||{};var n=e.body;if(t instanceof d){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new o(t.headers)),this.method=t.method,this.mode=t.mode,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new o(e.headers)),this.method=h(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function y(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var n=t.split("="),r=n.shift().replace(/\+/g," "),o=n.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}function p(t){var e=new o;return t.split(/\r?\n/).forEach(function(t){var n=t.split(":"),r=n.shift().trim();if(r){var o=n.join(":").trim();e.append(r,o)}}),e}function b(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new o(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var v={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(v.arrayBuffer)var m=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],w=function(t){return t&&DataView.prototype.isPrototypeOf(t)},_=ArrayBuffer.isView||function(t){return t&&m.indexOf(Object.prototype.toString.call(t))>-1};o.prototype.append=function(t,r){t=e(t),r=n(r);var o=this.map[t];this.map[t]=o?o+","+r:r},o.prototype.delete=function(t){delete this.map[e(t)]},o.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},o.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},o.prototype.set=function(t,r){this.map[e(t)]=n(r)},o.prototype.forEach=function(t,e){for(var n in this.map)this.map.hasOwnProperty(n)&&t.call(e,this.map[n],n,this)},o.prototype.keys=function(){var t=[];return this.forEach(function(e,n){t.push(n)}),r(t)},o.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),r(t)},o.prototype.entries=function(){var t=[];return this.forEach(function(e,n){t.push([n,e])}),r(t)},v.iterable&&(o.prototype[Symbol.iterator]=o.prototype.entries);var g=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];d.prototype.clone=function(){return new d(this,{body:this._bodyInit})},l.call(d.prototype),l.call(b.prototype),b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})},b.error=function(){var t=new b(null,{status:0,statusText:""});return t.type="error",t};var j=[301,302,303,307,308];b.redirect=function(t,e){if(-1===j.indexOf(e))throw new RangeError("Invalid status code");return new b(null,{status:e,headers:{location:t}})},t.Headers=o,t.Request=d,t.Response=b,t.fetch=function(t,e){return new Promise(function(n,r){var o=new d(t,e),i=new XMLHttpRequest;i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:p(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;n(new b(e,t))},i.onerror=function(){r(new TypeError("Network request failed"))},i.ontimeout=function(){r(new TypeError("Network request failed"))},i.open(o.method,o.url,!0),"include"===o.credentials&&(i.withCredentials=!0),"responseType"in i&&v.blob&&(i.responseType="blob"),o.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:this)},function(t,e,n){"use strict";function r(){}function o(t){try{return t.then}catch(t){return v=t,m}}function i(t,e){try{return t(e)}catch(t){return v=t,m}}function u(t,e,n){try{t(e,n)}catch(t){return v=t,m}}function a(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("Promise constructor's argument is not a function");this._75=0,this._83=0,this._18=null,this._38=null,t!==r&&p(t,this)}function s(t,e,n){return new t.constructor(function(o,i){var u=new a(r);u.then(o,i),c(t,new y(e,n,u))})}function c(t,e){for(;3===t._83;)t=t._18;if(a._47&&a._47(t),0===t._83)return 0===t._75?(t._75=1,void(t._38=e)):1===t._75?(t._75=2,void(t._38=[t._38,e])):void t._38.push(e);f(t,e)}function f(t,e){b(function(){var n=1===t._83?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._83?l(e.promise,t._18):h(e.promise,t._18));var r=i(n,t._18);r===m?h(e.promise,v):l(e.promise,r)})}function l(t,e){if(e===t)return h(t,new TypeError("A promise cannot be resolved with itself."));if(e&&("object"==typeof e||"function"==typeof e)){var n=o(e);if(n===m)return h(t,v);if(n===t.then&&e instanceof a)return t._83=3,t._18=e,void d(t);if("function"==typeof n)return void p(n.bind(e),t)}t._83=1,t._18=e,d(t)}function h(t,e){t._83=2,t._18=e,a._71&&a._71(t,e),d(t)}function d(t){if(1===t._75&&(c(t,t._38),t._38=null),2===t._75){for(var e=0;e<t._38.length;e++)c(t,t._38[e]);t._38=null}}function y(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function p(t,e){var n=!1,r=u(t,function(t){n||(n=!0,l(e,t))},function(t){n||(n=!0,h(e,t))});n||r!==m||(n=!0,h(e,v))}var b=n(33),v=null,m={};t.exports=a,a._47=null,a._71=null,a._44=r,a.prototype.then=function(t,e){if(this.constructor!==a)return s(this,t,e);var n=new a(r);return c(this,new y(t,e,n)),n}},,,function(t,e,n){t.exports=n(31)},function(t,e,n){"use strict";var r=n(10),o=function(t){return t&&t.__esModule?t:{default:t}}(r);Object.assign=n(25),void 0===window.Promise&&(n(32).enable(),window.Promise=n(35)),n(26),window.RedPanda=o.default},function(t,e,n){"use strict";function r(){c=!1,a._47=null,a._71=null}function o(t){function e(e){(t.allRejections||u(l[e].error,t.whitelist||s))&&(l[e].displayId=f++,t.onUnhandled?(l[e].logged=!0,t.onUnhandled(l[e].displayId,l[e].error)):(l[e].logged=!0,i(l[e].displayId,l[e].error)))}function n(e){l[e].logged&&(t.onHandled?t.onHandled(l[e].displayId,l[e].error):l[e].onUnhandled||(console.warn("Promise Rejection Handled (id: "+l[e].displayId+"):"),console.warn('  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id '+l[e].displayId+".")))}t=t||{},c&&r(),c=!0;var o=0,f=0,l={};a._47=function(t){2===t._83&&l[t._56]&&(l[t._56].logged?n(t._56):clearTimeout(l[t._56].timeout),delete l[t._56])},a._71=function(t,n){0===t._75&&(t._56=o++,l[t._56]={displayId:null,error:n,timeout:setTimeout(e.bind(null,t._56),u(n,s)?100:2e3),logged:!1})}}function i(t,e){console.warn("Possible Unhandled Promise Rejection (id: "+t+"):"),((e&&(e.stack||e))+"").split("\n").forEach(function(t){console.warn("  "+t)})}function u(t,e){return e.some(function(e){return t instanceof e})}var a=n(27),s=[ReferenceError,TypeError,RangeError],c=!1;e.disable=r,e.enable=o},function(t,e,n){"use strict";(function(e){function n(t){u.length||(i(),a=!0),u[u.length]=t}function r(){for(;s<u.length;){var t=s;if(s+=1,u[t].call(),s>c){for(var e=0,n=u.length-s;e<n;e++)u[e]=u[e+s];u.length-=s,s=0}}u.length=0,s=0,a=!1}function o(t){return function(){function e(){clearTimeout(n),clearInterval(r),t()}var n=setTimeout(e,0),r=setInterval(e,50)}}t.exports=n;var i,u=[],a=!1,s=0,c=1024,f=void 0!==e?e:self,l=f.MutationObserver||f.WebKitMutationObserver;i="function"==typeof l?function(t){var e=1,n=new l(t),r=document.createTextNode("");return n.observe(r,{characterData:!0}),function(){e=-e,r.data=e}}(r):o(r),n.requestFlush=i,n.makeRequestCallFromTimer=o}).call(e,n(34))},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";function r(t){var e=new o(o._44);return e._83=1,e._18=t,e}var o=n(27);t.exports=o;var i=r(!0),u=r(!1),a=r(null),s=r(void 0),c=r(0),f=r("");o.resolve=function(t){if(t instanceof o)return t;if(null===t)return a;if(void 0===t)return s;if(!0===t)return i;if(!1===t)return u;if(0===t)return c;if(""===t)return f;if("object"==typeof t||"function"==typeof t)try{var e=t.then;if("function"==typeof e)return new o(e.bind(t))}catch(t){return new o(function(e,n){n(t)})}return r(t)},o.all=function(t){var e=Array.prototype.slice.call(t);return new o(function(t,n){function r(u,a){if(a&&("object"==typeof a||"function"==typeof a)){if(a instanceof o&&a.then===o.prototype.then){for(;3===a._83;)a=a._18;return 1===a._83?r(u,a._18):(2===a._83&&n(a._18),void a.then(function(t){r(u,t)},n))}var s=a.then;if("function"==typeof s){return void new o(s.bind(a)).then(function(t){r(u,t)},n)}}e[u]=a,0==--i&&t(e)}if(0===e.length)return t([]);for(var i=e.length,u=0;u<e.length;u++)r(u,e[u])})},o.reject=function(t){return new o(function(e,n){n(t)})},o.race=function(t){return new o(function(e,n){t.forEach(function(t){o.resolve(t).then(e,n)})})},o.prototype.catch=function(t){return this.then(null,t)}}]);
//# sourceMappingURL=redpanda.promises.js.map