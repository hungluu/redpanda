class PromiseCollection {
  constructor (promises) {
    this.items = promises
  };

  get (index) {
    if (typeof index === 'undefined') {
      return Promise.all(this.items)
    }
    else if (this.items[index] instanceof Promise) {
      return this.items[index]
    }
    else {
      return Promise.reject('[RedPanda PromiseCollection] No promise found for index ' + index)
    }
  };

  push (item) {
    this.items.push(item)
  }

  merge (list) {
    this.items.merge(list)
  }

  count () {
    return this.items.length
  };

  first () {
    return this.get(0)
  };

  last () {
    return this.get(this.count() - 1)
  };

  all () {
    return this.get()
  };

  then (fn) {
    this.items = this.items.map((promise) => promise.then(fn))
    return this
  };

  catch (fn) {
    this.items = this.items.map((promise) => promise.catch(fn))
    return this
  };
}

export default PromiseCollection
