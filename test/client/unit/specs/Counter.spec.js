import Vue from 'vue'
import Counter from '@/components/Counter'
import { getVM, getMockedStore } from '../utils'

describe('Counter.vue', () => {
  it('rendered correctly', () => {
    const store = getMockedStore()
    const vm = getVM(Counter, store)

    expect(vm.$el).to.be.ok
    expect(vm.$refs.component.increment).to.be.a('function')
    expect(vm.$el.querySelector('.counter h2').textContent).to.equal(`Count: ${store.state.count}`)
  })

  it('increment', () => {
    const store = getMockedStore()
    const vm = getVM(Counter, store)

    expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 0')
    vm.$refs.component.increment()
    Vue.nextTick(() => {
      expect(store.state.count).to.equal(1)
      expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 1')
    })
  })

  it('decrement', () => {
    const store = getMockedStore()
    const vm = getVM(Counter, store)

    expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 0')
    vm.$refs.component.decrement()
    Vue.nextTick(() => {
      expect(store.state.count).to.equal(-1)
      expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: -1')
    })
  })

  it('should reactive when store updated', () => {
    const store = getMockedStore()
    const vm = getVM(Counter, store)

    expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 0')
    store.dispatch('increment')
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 1')
      store.dispatch('decrement')
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.counter h2').textContent).to.equal('Count: 0')
      })
    })
  })
})
