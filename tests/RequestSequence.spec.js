const kindOf = require('kind-of')
import RedPanda from '../src/RedPanda'
import RequestSequence from '../src/RequestSequence'
import PromiseCollection from '../src/PromiseCollection'

describe('(Private) RequestSequence', () => {
  let sequence, net

  before(() => net = new RedPanda())

  it('Should not carry other RequestSequences', (done) => {
    try {
      sequence = new RequestSequence([new RequestSequence([{method: 'GET'}], net)], net)
      done(new Error('Can carry other RequestSequences'))
    }
    catch(Error) {
      done()
    }
  })

  it('Should create promises for items by #createPromises', () => {
    let sequence = new RequestSequence([{method: 'GET'}], net)
    expect(sequence.createPromises()[0]).instanceOf(Promise)
  })

  describe('iterator', () => {
    before(() => {
      sequence = new RequestSequence(['a', 'b'], net)
    })

    // it('Should count items with #count', () => {
    //   expect(sequence.count()).to.equal(2)
    // })

    // it('Should stack items into a PromiseCollection with #stack', () => {
    //   expect(sequence.stack()).instanceOf(PromiseCollection)
    // })

    it('Should move index to -1 with #rewind', () => {
      sequence.rewind()
      expect(sequence.key).to.equal(-1)
    })

    it('Should move to next key with #next', () => {
      sequence.next()
      expect(sequence.key).to.equal(0)
    })

    it('Should get current item if requested', () => {
      expect(sequence.current()).to.equal('a')
    })

    it('Should check if current key is valid', () => {
      sequence.key = -1
      expect(sequence.valid()).to.equal(false)
      sequence.key = 3
      expect(sequence.valid()).to.equal(false)
    })
  })

  describe('request', () => {
    let collection

    before(() => {
      sequence = new RequestSequence([{url : 'https://jsonplaceholder.typicode.com/posts/1'}, {url : 'https://jsonplaceholder.typicode.com/posts/2'}], net)
    })

    it('Should return a PromiseCollection when start', () => {
      collection = sequence.start()
      expect(collection).instanceOf(PromiseCollection)
    })

    it('Should return a PromiseCollection that can resolve', () => {
      expect(collection.then((data) => data.json()).then((json) => json.id)).to.become([1, 2])
    })
  })
})

