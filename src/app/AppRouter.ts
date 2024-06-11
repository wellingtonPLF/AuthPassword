import { createRouter, createWebHistory } from 'vue-router';
import LogoAddComponent from "./components/LogoAdd/LogoAdd.vue";
import PasswordAdd from "./components/PasswordAdd/PasswordAdd.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: LogoAddComponent
  },
  {
    path: '/password',
    name: 'password',
    component: PasswordAdd
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
