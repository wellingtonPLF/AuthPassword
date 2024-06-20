import { createStore } from 'vuex';
import AuthReducer from './reducer/authReducer';

const store = createStore({
  modules: {
    authReducer: AuthReducer,
  }
});

export default store