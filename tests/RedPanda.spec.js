import RedPanda from '../src/RedPanda'
const kindOf = require('kind-of')
import RequestSequence from '../src/RequestSequence'

describe('(Public) RedPanda', () => {
  let net

  before(() => net = new RedPanda())

  describe('registry', () => {
    it('can not be accessed directly', () => {
      expect(net.reg).to.undefined()
    })

    it('should publish its setter', () => {
      expect(net.set('a', {test: 1})).to.equal(net)
    })

    it('should publish its getter', () => {
      expect(net.get('a')).to.deep.equal([{test : 1}])
    })

    it('should publish its flattener', () => {
      expect(net.flatten([{test : 1}, [{test2 : 2}, [{test2 : 3}]]])).to.deep.equal([{test : 1}, {test2 : 2}, {test2 : 3}])
    })
  })

  describe('#sequence', () => {
    it('should return a RequestSequence object', () => {
      expect(net.sequence([])).instanceOf(RequestSequence)
    })
  })

  describe('promise helpers', () => {
    it('should return a Promise that resolves by a value using #resolve', () => {
      expect(net.resolve(1)).to.become(1)
    })

    it('should return a Promise that rejected by an Error using #reject', (done) => {
      net.reject(new Error('test-error')).catch(e => e.message === 'test-error' && done())
    })

    it('should return a Promise resolves when all provided promises resolve using #waitAll', () => {
      expect(net.waitAll([Promise.resolve(1), Promise.resolve(2)])).to.become([1, 2])
    })
  })

  describe('#send', () => {
    before(() => {
      net = new RedPanda()
      net.set('req-1', {url : 'https://jsonplaceholder.typicode.com/posts/1'})
      net.set('req-2', {url : 'https://jsonplaceholder.typicode.com/posts/2'})
    })

    it('should send a request by request option object and receive response', (done) => {
      net.send({url : 'https://jsonplaceholder.typicode.com/posts/1'}).then((data) => data.json()).then(json => json.id === 1 && done())
    })

    it('should send a request by request name and receive response', (done) => {
      net.send('req-1').then((data) => data.json()).then(json => json.id === 1 && done())
    })

    it('should send a request sequence and receive response', (done) => {
      net.send(net.sequence(['req-1', 'req-2'])).then((data) => data.json()).then((json) => json.id).all().then((data) => {
        if (JSON.stringify(data) === JSON.stringify([[1, 2]])) {
          done()
        }
        else {
          done(new Error('data not equal [[1, 2]]'))
        }
      })
    })

    it('should send a stack of requests if array passed in', (done) => {
      let counter = 0
      net.send(['req-1', 'req-2']).then((data) => {
        counter++
      }).all().then(() => {
        if (counter >= 2) {
          done()
        }
        else {
          done(new Error('counter < 2'))
        }
      })
    })

    it('should send a stack of requests that can wait for all responses received', (done) => {
      net.send(['req-1', 'req-2']).then((data) => data.json()).then((json) => json.id).all().then((data) => {
        if (JSON.stringify(data) === JSON.stringify([1, 2])) {
          done()
        }
        else {
          done(new Error('data not equal [1, 2]'))
        }
      })
    })

    it('should send a stack of requests containing RequestSequence', (done) => {
      let counter = 0
      net.send(['req-1', net.sequence(['req-1', 'req-2'])]).then((data) => {
        counter++
      }).all().then(() => {
        if (counter >= 3) {
          done()
        }
        else {
          done(new Error('counter < 3'))
        }
      })
    })

    it('should flatten request stacks and receive response', (done) => {
      net.send(['req-1', 'req-2', ['req-1', 'req-2'], net.sequence(['req-1', 'req-2'])]).then((data) => data.json()).then((json) => json.id).all().then((data) => {
        if (JSON.stringify(data) === JSON.stringify([1, 2, 1, 2, [1, 2]])) {
          done()
        }
        else {
          console.log(data)
          done(new Error('data not equal [1, 2, 1, 2, [1, 2]'))
        }
      })
    })
  })
})

