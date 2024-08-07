import { createApp } from "vue";
import "./styles.css";
import App from "./app/App.vue";
import router from './app/AppRouter';
import store from './app/shared/vuex/store.ts';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import { library } from '@fortawesome/fontawesome-svg-core'

const app = createApp(App);

library.add(fas, fab, far)
app.component('font-awesome-icon', FontAwesomeIcon)

window.Vue = app
window.Vue.router = router

app.use(router);
app.use(store);
app.mount('#app');
