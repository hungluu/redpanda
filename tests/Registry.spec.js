import Registry from '../src/Registry'
const kindOf = require('kind-of')

describe('(Private) Registry', () => {
  let reg

  before(() => reg = new Registry())

  it('Should be a key-value storage', () => expect(kindOf(reg.items)).to.equal('object'))

  describe('#set', () => {
    it('Should throw Error when value is not array or object', () => {
      expect(reg.set.bind('a', 'b')).to.throw(Error)
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
      expect(reg.get('a')).to.be('array')
    })

    it('Should return coresponding value for requested key', () => {
      expect(reg.get('gets')).to.deep.equal({method: 'GET'})
    })
  })
})

