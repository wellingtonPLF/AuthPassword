import { ActionContext } from "vuex/types/index.js";

const AuthAction = {
    setAuth ({ commit } : ActionContext<string, number>, auth: string) {
      commit('userLogin', auth)
    }
}

export default AuthAction