import { ActionContext } from "vuex/types/index.js";

export interface Scroll {
  position: number,
  index: number | undefined
}

const ScrollAction = {
    setScroll ({ commit } : ActionContext<string, number>, scroll: Scroll) {
      commit('setScroll', scroll)
    }
}

export default ScrollAction