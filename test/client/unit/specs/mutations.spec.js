import * as mutations from '@/store/mutations'

describe('mutations', () => {
    it('TOGGLE_SIDEBAR', () => {
        const state = {
            app: { sidebar: { opened: false } }
        }
        const opened = true;
        mutations.TOGGLE_SIDEBAR(state, opened)
        expect(state.app.sidebar.opened).to.equal(opened)
    })
})
