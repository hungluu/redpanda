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

  describe('#get', () => {
    it('Should always return promise', () => {
      expect(collection.get(3)).instanceOf(Promise)
      expect(collection.get(4)).instanceOf(Promise)
    })

    it('Can access promises inside by index', (done) => {
      collection.get(0).then(data => data === 0 && done())
    })

    it('Should throw Error when trying to access item with an invalid index', () => {
      expect(collection.get(5)).to.be.rejected;
    })

    it('Should throw Error when trying to access item which is not a Promise', () => {
      expect(collection.get(2)).to.be.rejected;
    })
  })


  it('Should be countable', () => {
    expect(collection.count()).to.equal(3)
  })

  it('Can get first item', () => {
    expect(collection.first()).to.become(0)
  })

  it('Can get last item', () => {
    collection.items.splice(-1,1)
    expect(collection.last()).to.become(1)
  })

  it('Can return a Promise that resolves when all promises inside resolve', () => {
    expect(collection.all()).to.become([0, 1])
  })

  describe('#then', () => {
    before(function () {
      collection = new PromiseCollection([
        Promise.resolve('then-0'),
        Promise.resolve('then-1')
      ])
    })

    it('Can attach a resolving callback to all promises inside', (done) => {
      let counter = 0
      collection.then(() => {
        if (counter > 0) {
          done()
        }

        counter++
      })
    })

    it('Can attach more than one resolving callback to all promises inside', (done) => {
      let counter = 0
      collection.then(() => {}).then(() => {}).then(() => {
        if (counter > 0) {
          done()
        }

        counter++
      })
    })
  })

  describe('#catch', () => {
    before(function () {
      collection = new PromiseCollection([
        Promise.reject('then-0'),
        Promise.reject('then-1')
      ])
    })

    it('Can attach a rejected callback to all promises inside', (done) => {
      let counter = 0
      collection.then(() => {
        if (counter > 0) {
          done()
        }

        counter++
      })
    })

    it('Can attach more than one rejected callback to all promises inside', (done) => {
      let counter = 0
      collection.then(() => {}).then(() => {}).then(() => {
        if (counter > 0) {
          done()
        }

        counter++
      })
    })
  })
})
