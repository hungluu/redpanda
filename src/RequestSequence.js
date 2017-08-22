import Iterator from './Iterator'

class RequestSequence extends Iterator {
  constructor (requestOptions, net) {
    super()
    this.net = net
    this.resolveStack = []
    this.rejectStack  = []
    this.items = requestOptions
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
        .all()
        .then((data) => {
          this.nextRequest()
          resolve(data)
        })
        .catch((err) => reject(err))
    }
  };
}

export default RequestSequence
