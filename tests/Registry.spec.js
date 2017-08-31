import Registry from '../src/Registry'
const kindOf = require('kind-of')
import RequestSequence from '../src/RequestSequence'

describe('(Private) Registry', () => {
  let reg

  before(() => reg = new Registry())

  it('Should be a key-value storage', () => expect(kindOf(reg.items)).to.equal('object'))

  describe('#set', () => {
    it('Should throw Error when value is not array or object', () => {
      expect(reg.set.bind('error-1', 'b')).to.throw(Error)
    })

    it('Should throw Error when key is not string', () => {
      expect(reg.set.bind({}, {})).to.throw(Error)
    })

    it('Should save valid key and value', () => {
      reg.set('gets', {method: 'GET'})
      expect(reg.items.gets).to.deep.equal({method: 'GET'})
    })

    it('Should return itself', () => {
      expect(reg.set('gets', {method: 'GET'})).to.equal(reg)
    })
  })

  describe('#get', () => {
    it('Should return array', () => {
      expect(kindOf(reg.get('gets'))).to.equal('array')
    })

    it('Should throw Error when returned value is not object', () => {
      expect(reg.get.bind('error-1')).to.throw(Error)
    })

    it('Should throw Error when the key is not object or string or array', () => {
      expect(reg.get.bind(1)).to.throw(Error)
    })

    it('Should return coresponding value for requested key', () => {
      expect(reg.get('gets')).to.deep.equal([{method: 'GET'}])
    })

    it('Should return object when rawObject flag turned on', () => {
      expect(reg.get('gets', true)).to.deep.equal({method: 'GET'})
    })

    it('Should return the key-self when it is an object', () => {
      expect(reg.get({test : 1})).to.deep.equal([{test : 1}])
    })

    it('Should walk throw the key when it is an array', () => {
      expect(reg.get([{test : 1}, 'gets'])).to.deep.equal([{test : 1}, {method: 'GET'}])
    })

    it('Should apply inherits into the key if object provided', () => {
      expect(reg.get({inherits: ['gets']})).to.deep.equal([{method: 'GET', inherits: ['gets']}])
    })

    it('Should apply inherits into the items of key if array provided', () => {
      expect(reg.get([{inherits: ['gets']}, {inherits: ['gets']}])).to.deep.equal([{method: 'GET', inherits: ['gets']}, {method: 'GET', inherits: ['gets']}])
    })

    it('Should apply inherits into value if value is object', () => {
      reg.set('test-inherits', {inherits: ['gets']})
      expect(reg.get('test-inherits')).to.deep.equal([{method: 'GET', inherits: ['gets']}])
    })

    it('Should apply inherits into the items of value if value is array', () => {
      reg.set('test-inherits', [{inherits: ['gets']}, {inherits: ['gets']}])
      expect(reg.get('test-inherits')).to.deep.equal([{method: 'GET', inherits: ['gets']}, {method: 'GET', inherits: ['gets']}])
    })
  })

  describe('#applyInherits', () => {
    it('Should throw Error when no object param passed in', () => {
      expect(reg.applyInherits.bind('a')).to.throw(Error)
    })

    it('Should return the object itself when no inherit found', () => {
      let testObject = {test : 1}
      expect(reg.applyInherits(testObject)).to.equal(testObject)
    })

    it('Should return the object with inherits applied', () => {
      let testObject = {test : 1, inherits: ['gets']}
      expect(reg.applyInherits(testObject)).to.deep.equal({test: 1, method: 'GET', inherits: ['gets']})
    })

    it('Should apply multiple inheritance through #join method', () => {
      let inherit1 = {a : 1}
      let inherit2 = {a : 2}
      let testInherits = {inherits : [inherit1, inherit2]}
      expect(reg.applyInherits(testInherits)).to.deep.equal(Object.assign({}, reg.join(testInherits.inherits), testInherits))
    })

    it('Should be able to hot inherits', () => {
      let testObject = {test : 1, inherits: [{test : 2, test2 : 3}]}
      expect(reg.applyInherits(testObject)).to.deep.equal({test: 1, test2: 3, inherits: [{test : 2, test2 : 3}]})
    })
  })

  describe('#has', () => {
    it('Should return true if item exists', () => {
      expect(reg.has('gets')).to.equal(true)
    })

    it('Should return false if item doesn\'t exist', () => {
      expect(reg.has('non-existing')).to.equal(false)
    })
  })

  describe('#getRaw', () => {
    it('Should return object or array', () => {
      expect(kindOf(reg.getRaw('gets'))).to.equal('object')
      expect(kindOf(reg.getRaw([{a : 1, b : 2}]))).to.equal('array')
    })

    it('Should throw Error when returned value is not object', () => {
      expect(reg.getRaw.bind('error-1')).to.throw(Error)
    })

    it('Should throw Error when the key is not object or string or array', () => {
      expect(reg.getRaw.bind(1)).to.throw(Error)
    })

    it('Should return coresponding value for requested key', () => {
      expect(reg.getRaw('gets')).to.deep.equal({method: 'GET'})
    })

    it('Should return the key-self when it is an object', () => {
      expect(reg.getRaw({test : 1})).to.deep.equal({test : 1})
    })

    it('Should walk throw the key when it is an array', () => {
      expect(reg.getRaw([{test : 1}, 'gets'])).to.deep.equal([{test : 1}, {method: 'GET'}])
    })

    it('Should not apply inherits into the key if object provided', () => {
      expect(reg.getRaw({inherits: ['gets']})).to.deep.equal({inherits: ['gets']})
    })

    it('Should not apply inherits into the items of key if array provided', () => {
      expect(reg.getRaw([{inherits: ['gets']}, {inherits: ['gets']}])).to.deep.equal([{inherits: ['gets']}, {inherits: ['gets']}])
    })

    it('Should not apply inherits into value if value is object', () => {
      reg.set('test-inherits', {inherits: ['gets']})
      expect(reg.getRaw('test-inherits')).to.deep.equal({inherits: ['gets']})
    })

    it('Should not apply inherits into the items of value if value is array', () => {
      reg.set('test-inherits', [{inherits: ['gets']}, {inherits: ['gets']}])
      expect(reg.getRaw('test-inherits')).to.deep.equal([{inherits: ['gets']}, {inherits: ['gets']}])
    })
  })

  describe('#flatten', () => {
    it('Should flatten multi level array', () => {
      expect(reg.flatten([[{a : 1}, [{b : 2}]]])).to.deep.equal([{a : 1}, {b : 2}])
      expect(reg.flatten([[{a : 1}, [{b : 2}, [{c : 3}]]]])).to.deep.equal([{a : 1}, {b : 2}, {c : 3}])
    })

    it('Should flatten and keep RequestSequence', () => {
      let sequence = new RequestSequence()
      expect(reg.flatten([[{a : 1}, [sequence]]])).to.deep.equal([{a : 1}, sequence])
    })
  })
})

