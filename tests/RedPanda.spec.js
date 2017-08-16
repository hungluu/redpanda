import RedPanda from 'RedPanda'

describe('RedPanda', () => {
  it('should exists', () => {
    let panda = new RedPanda()
    expect(panda).not.undefined()
  })
})
