var RedPanda = require('../index')

describe('(Dist) RedPanda Node', () => {
  let net

  before(() => {
    net = new RedPanda()

    net.set('entry-1', {url: 'https://jsonplaceholder.typicode.com/posts/1'})
    net.set('entry-2', {url: 'https://jsonplaceholder.typicode.com/posts/2'})
    net.set('entry-3', {url: 'https://jsonplaceholder.typicode.com/posts/3'})
    net.set('entry-4', {url: 'https://jsonplaceholder.typicode.com/posts/4'})
    net.set('entry-5', {url: 'https://jsonplaceholder.typicode.com/posts/5'})
    net.set('entry-6', {url: 'https://jsonplaceholder.typicode.com/posts/6'})

    net.set('parallel', ['entry-1', 'entry-2', 'entry-3'])
    net.set('sequence', net.sequence(['entry-4', 'entry-5', 'entry-6']))
    net.set('parallel-sequence', [
      'entry-1',
      'entry-2',
      'entry-3',
      net.sequence(['entry-4', 'entry-5', 'entry-6'])
    ])
  })

  it('Should be able to send parallel requests', () => {
    expect(net.send('parallel').then((data) => data.json()).then((json) => json.id).all()).to.become([1, 2, 3])
  })

  it('Should be able to send parallel requests and at callback to last one', () => {
    expect(net.send('parallel').then((data) => data.json()).then((json) => json.id).last()).to.become(3)
  })

  it('Should be able to send sequence requests', () => {
    expect(net.send('sequence').then((data) => data.json()).then((json) => json.id).all()).to.become([[4, 5, 6]])
  })

  it('Should be able to send sequence requests and at callback to last one', () => {
    expect(net.send('sequence').then((data) => data.json()).then((json) => json.id).last()).to.become(6)
  })

  it('Should be able to send parallel requests containing sequence', () => {
    expect(net.send('parallel-sequence').then((data) => data.json()).then((json) => json.id).all()).to.become([1, 2, 3, [4, 5, 6]])
  })

  it('Should be able to send parallel requests containing sequence and at callback to only sequence', () => {
    expect(net.send('parallel-sequence').then((data) => data.json()).then((json) => json.id).last()).to.become([4, 5, 6])
  })
})

