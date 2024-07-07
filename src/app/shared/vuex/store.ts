import { createStore } from 'vuex';
import AuthReducer from './reducer/authReducer';
import ScrollReducer from './reducer/scrollReducer';
import CredReducer from './reducer/credReducer';

const store = createStore({
  modules: {
    authReducer: AuthReducer,
    scrollReducer: ScrollReducer,
    credReducer: CredReducer,
  }
});

export default store