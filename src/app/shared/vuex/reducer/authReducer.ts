import AuthAction from "../action/authAction"

const AuthReducer = {
  namespaced: true,
  state: {
    auth: ""
  },
  mutations: {
    userLogin (state: any, payload: string) {
      state.auth = payload
    }
  },
  actions: AuthAction
}

export default AuthReducer