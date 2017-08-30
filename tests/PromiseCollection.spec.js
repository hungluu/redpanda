import PromiseCollection from '../src/PromiseCollection'

describe('(Private) PromiseCollection', () => {
  let collection

  before(function () {
    collection = new PromiseCollection([
      Promise.resolve(0),
      Promise.resolve(1),
      2
    ])
  })

  describe('#getter', () => {
    it('Should always return promise', () => {
      expect(collection.get(3)).instanceOf(Promise)
      expect(collection.get(4)).instanceOf(Promise)
    })

    it('Can access promises inside by index', (done) => {
      collection.get(0).then(data => data === 0 && done())
    })

    it('Should throw Error when trying to access item with an invalid index', (done) => {
      collection.get(5).catch((e) => done())
    })

    it('Should throw Error when trying to access item which is not a Promise', (done) => {
      collection.get(2).catch((e) => done())
    })
  })


  it('Should be countable', () => {
    expect(collection.count()).to.equal(3)
  })
})
