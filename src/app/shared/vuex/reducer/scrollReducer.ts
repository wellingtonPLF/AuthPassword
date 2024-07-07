import ScrollAction, { Scroll } from "../action/scrollAction"

const INITIAL_STATE_SCROLL: Scroll = { position: 0, index: undefined }

const ScrollReducer = {
  namespaced: true,
  state: {
    scroll: INITIAL_STATE_SCROLL
  },
  mutations: {
    setScroll (state: any, payload: Scroll) {
      state.scroll = payload
    }
  },
  actions: ScrollAction
}

export default ScrollReducer