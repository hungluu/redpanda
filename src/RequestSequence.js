// import Iterator from './Iterator'
import PromiseCollection from './PromiseCollection'

/**
 * A sequence that has many requests being sent sequentially.
 *
 * Currently no public API provided.
 */
class RequestSequence {// extends Iterator {
  constructor (flattenOptions, net) {
    flattenOptions.forEach(function (e) {
      if (e instanceof RequestSequence) {
        throw Error('[RedPanda RequestSequence] Can not stack another sequence inside.')
      }
    })
    // super()
    this.net = net
    this.resolveStack = []
    this.rejectStack = []
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
    if (this.valid()) {
      let key = this.key
      let resolve = this.resolveStack[key]
      let reject = this.rejectStack[key]
      let currentOption = this.current()

      this.net.send(currentOption)
        .then((data) => {
          resolve(data)
          this.nextRequest()
        })
        .catch((err) => reject(err))
    }
  };

  next () {
    this.key++
  };

  stack () {
    return new PromiseCollection(this.promises)
  };

  rewind () {
    this.key = -1
  };

  current () {
    return this.items[this.key]
  };

  count () {
    return this.items.length
  };

  valid () {
    return this.key >= 0 && this.key < this.count()
  };

  start () {
    this.resolveStack = []
    this.rejectStack = []
    this.promises = this.createPromises()
    this.rewind()
    this.nextRequest()
    return this.stack()
  };
}

export default RequestSequence
