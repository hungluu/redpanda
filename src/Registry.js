// import Queue from 'Queue'
let kindOf = require('kind-of')

class Registry {
  constructor() {
    // array of objects
    this.items = {}
  };

  set(key, value) {
    // valueKind
    if (kindOf(value) !== 'array' && kindOf(value) !== 'object') {
      throw new Error('[RedPanda Net] Only array and object value is accepted')
    }

    if (kindOf(key) !== 'string') {
      throw new Error('[RedPanda Net] Only array and object value is accepted')
    }

    this.items[key] = value
  };

  // string --> array[object]
  // object --> array[object]
  // array --> array[obj1, obj2, obj3] (inherited)
  get(key) {
    let keyKind = kindOf(key),
      valueKind = kindOf(this.items[key])

    if (keyKind === 'object') {
      return this.applyInherits(key)
    }
    // TODO: add 'Queue' here and Queue need a `.map` method to work as array do
    else if (keyKind === 'array') {
      return key.map(item => this.applyInherits(this.getRaw(item)))
    }
    else if (keyKind !== 'string') {
      throw Error('get')
    }
    else if (valueKind === 'array') {
      return this.items[key].map(item => this.applyInherits(this.getRaw(item)))
    }
    else {
      // valueKind === object
      return [this.applyInherits(this.items[key])]
    }
  };

  // inherits
  applyInherits(item) {
    if (kindOf(item) !== 'object') {
      throw new Error('...');
    }

    return kindOf(item.inherits) === 'array'
      ? Object.assign({}, this.join(item.inherits), item)
      : item
  }

  // check for valid value type
  // array of object
  has(key) {
    // return kindOf(this.items[key]) === 'array'
    // use `typeof` to speed up because we already test
    // value type in .set
    return typeof this.items[key] !== 'undefined'
  }

  // inherits
  // array items
  join(items) {
    return items.map((parentKey) => this.getRaw(parentKey)).reduce((target, source) => Object.assign({}, target, source))
  };

  // no inherits
  getRaw(key) {
    let keyKind = kindOf(key),
      valueKind = kindOf(this.items[key])

    if(keyKind === 'object') {
      // return the object-self
      return key;
    }
    else if (keyKind !== 'string') {
      throw Error('getRaw')
    }
    else if (valueKind === 'array') {
      return this.items[key].map((item) => this.getRaw(item))
    }
    else {
      // valueKind === object
      return this.items[key]
    }
  };
}

// export default Net
module.exports = Registry
