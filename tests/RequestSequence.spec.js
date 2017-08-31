const kindOf = require('kind-of')
import RedPanda from '../src/RedPanda'
import RequestSequence from '../src/RequestSequence'

describe('(Private) RequestSequence', () => {
  let sequence, net

  before(() => net = new RedPanda())

  it('can not carry other RequestSequences', (done) => {
    try {
      sequence = new RequestSequence([new RequestSequence([{method: 'GET'}], net)], net)
      done(new Error('Can carry other RequestSequences'))
    }
    catch(Error) {
      done()
    }
  })
})

