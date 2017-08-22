import PromiseStack from './PromiseStack'

class Iterator {
  constructor(items) {
    this.items = items
    this.promises = []
    this.rewind()
  };

  next() {
    this.key++
  }

  getStack() {
    return new PromiseStack(this.promises)
  }

  rewind() {
    this.key = -1
  }

  current() {
    return this.items[this.key]
  }

  count() {
    return this.items.length
  }

  valid() {
    return this.key >= 0 && this.key < this.count()
  }

  start() {
    this.promises = this.createPromises();
    this.rewind()
    this.nextRequest()
    return this.getStack()
  }
}

export default Iterator
