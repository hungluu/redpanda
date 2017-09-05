import RequestSequence from './RequestSequence'
const kindOf = require('kind-of')

class Registry {
  constructor () {
    // array of objects
    this.items = {}
  };

  // return this
  set (key, value) {
    // valueKind
    if (kindOf(value) !== 'array' && kindOf(value) !== 'object') {
      throw new Error('[RedPanda Registry] Only array and object value is accepted')
    }

    if (kindOf(key) !== 'string') {
      throw new Error('[RedPanda Registry] Only array and object value is accepted')
    }

    this.items[key] = value
    return this
  };

  // string --> array[object]
  // object --> array[object]
  // array --> array[obj1, obj2, obj3] (inherited)
  get (key, rawObject) {
    let keyKind = kindOf(key)

    if (keyKind === 'object') {
      return rawObject ? this.applyInherits(key) : [this.applyInherits(key)]
    } else if (keyKind === 'array') {
      return key.map(item => this.get(item, true))
    } else if (keyKind !== 'string') {
      throw Error('[RedPanda Registry] invalid key')
    } else if (kindOf(this.items[key]) === 'array') {
      return this.items[key].map(item => {
        return this.get(item, true)
      }) // this.applyInherits(this.getRaw(item)))
    } else {
      // valueKind === object
      return rawObject ? this.applyInherits(this.items[key]) : [this.applyInherits(this.items[key])]
    }
  };

  // inherits
  applyInherits (item) {
    let itemKind = kindOf(item)

    if (itemKind !== 'object') {
      // if (itemKind === 'array') {
        // throw new Error('[RedPanda Registry] only one level of stack is allowed');
      // }
      throw new Error('[RedPanda Registry] item must be object to inherit')
    }

    return kindOf(item.inherits) === 'array'
      ? Object.assign({}, this.join(item.inherits), item)
      : item
  }

  // check for valid value type
  // array of object
  // has (key) {
  //   // return kindOf(this.items[key]) === 'array'
  //   // use `typeof` to speed up because we already test
  //   // value type in .set
  //   return typeof this.items[key] !== 'undefined'
  // }

  // inherits
  // array items
  join (items) {
    return items.map((parentKey) => this.getRaw(parentKey))
      .reduce((target, source) => Object.assign({}, target, source))
  };

  // no inherits
  getRaw (key) {
    let keyKind = kindOf(key)
    let valueKind = kindOf(this.items[key])

    if (keyKind === 'object') {
      // return the object-self
      return key
    } else if (keyKind === 'array') {
      return key.map(item => this.getRaw(item))
    } else if (keyKind !== 'string') {
      throw Error('[RedPanda Registry] invalid key for getRaw')
    } else if (valueKind === 'array') {
      return this.items[key].map((item) => this.getRaw(item))
    } else {
      // valueKind === object
      return this.items[key]
    }
  };

  // Convert multi-level request option stack
  // into flat array of request option objects
  flatten (requestOptions, _flatList) {
    let flatList = _flatList || [] // new PromiseCollection([])

    this.get(requestOptions).forEach((option) => {
      if (option instanceof RequestSequence) {
        return flatList.push(option)
      }

      switch (kindOf(option)) {
        case 'array':
          this.flatten(option, flatList)
          break
        case 'object':
          flatList.push(option)
          break
        default:
          throw Error('[RedPanda Registry] invalid type to flatten')
      }
    })

    return flatList
  };
}

export default Registry
