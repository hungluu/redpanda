import Iterator from './Iterator'

class RequestQueue extends Iterator {
  constructor (requestOptions, net) {
    super()
    this.net = net
    this.promises = []
  };

  start () {
    this.promises = this.createPromises(requestOptions)
  };

  createPromises (options) {
    return options.map((option) => this.send(option))
  };
}

export default RequestQueue
