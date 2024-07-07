import CredAction from "../action/credAction"

const INITIAL_STATE_CRED: boolean = false

const CredReducer = {
  namespaced: true,
  state: {
    cred: INITIAL_STATE_CRED
  },
  mutations: {
    setCred (state: any, payload: boolean) {
      state.cred = payload
    }
  },
  actions: CredAction
}

export default CredReducer