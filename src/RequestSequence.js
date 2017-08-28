// import Iterator from './Iterator'
import PromiseCollection from './PromiseCollection'

class RequestSequence {// extends Iterator {
  constructor (flattenOptions, net) {
    // super()
    this.net = net
    this.resolveStack = []
    this.rejectStack  = []
    this.items = flattenOptions
    this.promises = []
  };

  createPromises () {
    return this.items.map((option) => new Promise((resolve, reject) => {
      this.resolveStack.push(resolve)
      this.rejectStack.push(reject)
    }))
  };

  nextRequest () {
    this.next()
    if(this.valid()) {
      let key = this.key,
        resolve = this.resolveStack[key],
        reject  = this.rejectStack[key],
        currentOption = this.current()

      this.net.send(currentOption)
        .then((data) => {
          this.nextRequest()
          resolve(data)
        })
        .catch((err) => reject(err))
    }
  };

  next() {
    this.key++
  };

  stack() {
    return new PromiseCollection(this.promises)
  };

  rewind() {
    this.key = -1
  };

  current() {
    return this.items[this.key]
  };

  count() {
    return this.items.length
  };

  valid() {
    return this.key >= 0 && this.key < this.count()
  };

  start() {
    this.resolveStack = [];
    this.rejectStack  = [];
    this.promises = this.createPromises();
    this.rewind()
    this.nextRequest()
    return this.stack()
  };
}

export default RequestSequence
