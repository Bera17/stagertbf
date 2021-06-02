import { createRouter, createWebHashHistory } from 'vue-router'
import Scheduler from '../components/Scheduler.vue'
import AuthView from '../components/AuthView.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: AuthView,
    beforeEnter: (to, from, next) => {
      if(store.getters.isLogged) 
        next('/scheduler');
      else next();
    }
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    component: Scheduler,
    beforeEnter: (to, from, next) => {
      if(!store.getters.isLogged)
        next('/');
      else next();
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
