import * as mutations from '@/store/mutations'

describe('mutations', () => {
  it('INCREMENT', () => {
    const state = { count: 0 }
    mutations.INCREMENT(state)
    expect(state.count).to.equal(1)
  })

  it('DECREMENT', () => {
    const state = { count: 0 }
    mutations.DECREMENT(state)
    expect(state.count).to.equal(-1)
  })
})
