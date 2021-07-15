import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../components/home.vue"
import newSanitise from "../components/newSanitise.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/newSanitise/:id',
    name: 'newSanitise',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: newSanitise
  }
]

const router = new VueRouter({
  routes
})

export default router
