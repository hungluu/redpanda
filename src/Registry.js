const kindOf = require('kind-of')

class Registry {
  constructor () {
    this.registry = {}
  };

  set(key, value) {
    this.registry[key] = value
  };

  get(key) {
    if (kindOf(this.registry[key]) === 'array') {
      let results = []
      for (var index = 0, value = this.registry[key], length = value.length; index < length; index++) {
        results.push(this.get(value[index]))
      }

      return results
    }
    if (kindOf(this.registry[key]) === 'object') {
      return this.getInherits(this.registry[key])
    }
    else if (kindOf(key) === 'object') {
      return this.getInherits(key)
    }
    else if (kindOf(key) === 'array') {
      let results = []
      for (var index = 0, length = key.length; index < length; index++) {
        results.push(this.get(key[index]))
      }

      return results
    }
    else {
      throw Error('[RedPanda Registry] Only object type is supported.')
    }
  }

  getInherits(options) {
    if (kindOf(options.inherits) === 'array') {
      let optionStack = options.inherits.map(k => this.get(k)) // get all inherit options to array
      optionStack.push(options)
      let finalOptions = {}

      // Apply options one by one
      for (var index = 0, length = optionStack.length; index < length; index++) {
        finalOptions = Object.assign(finalOptions, optionStack[index])
      }

      return finalOptions
    }
    else {
      return options // no inherit found
    }
  }
};

export default Registry
