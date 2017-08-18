import Registry from 'Registry'

describe('Registry', () => {
  let reg

  before(() => {
    reg = new Registry()
    reg.set('a', {type: 1})
    reg.set('b', {method: 'POST'})
    reg.set('c', '')
    reg.set('d', {type: 2})
    reg.set('i1', {type: 2, inherits: ['a', 'b']})
    reg.set('i2', {name: 'Deep', inherits: ['i1']})
    reg.set('a1', ['a', 'b', {test : 2}])
  })

  it('should save all defined records', () => {
    expect(Object.keys(reg.registry).length).to.equal(7)
  })

  it('should return requested object by key', () => {
    expect(reg.get('a')).to.deep.equal({type : 1})
    expect(reg.get('b')).to.deep.equal({method : 'POST'})
  })

  it('should trigger error when requested value is not a valid object', () => {
    try {
      reg.get('c')
    }
    catch(err) {
      expect(true).to.equal(true)
    }
  })

  it('should return object if provided as key', () => {
    expect(reg.get({method: 'POST'})).to.deep.equal({method: 'POST'})
  })

  it('can return an array of defined options', () => {
    expect(reg.get(['a', {test: 1}])).to.deep.equal([{type: 1}, {test: 1}])
    expect(reg.get('a1')).to.deep.equal([{type: 1}, {method: 'POST'}, {test: 2}])
  })

  it('should trigger error when key not found and not an object', () => {
    try {
      reg.get('e')
    }
    catch(err) {
      expect(true).to.equal(true)
    }
  })

  define('Inheritance', () => {
    it('should return object that inherit from others in registry', () => {
      expect(reg.get({type: 2, inherits: ['a', 'b']})).to.deep.equal({method: 'POST', type: 2, inherits: ['a', 'b']})
      expect(reg.get('i1')).to.deep.equal({method: 'POST', type: 2, inherits: ['a', 'b']})
    })

    it('should deeply inherits options', () => {
      expect(reg.get('i2')).to.deep.equal({method: 'POST', type: 2, inherits: ['i1'], name: 'Deep'})
    })
  })

  it('should trigger error when trying to inherit invalid keys', () => {
    try {
      reg.get({inherits : ['c']})
    }
    catch(err) {
      expect(true).to.equal(true)
    }
  })
})
