import { ActionContext } from "vuex/types/index.js";

const CredAction = {
    setCred ({ commit } : ActionContext<string, number>, cred: boolean) {
      commit('setCred', cred)
    }
}

export default CredAction