import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../components/home.vue"
import newSanitise from "../components/newSanitise.vue"
import newModel from "../components/newModel.vue"

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
  },
  {
    path: '/newModel/:id',
    name: 'newModel',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: newModel
  }

]

const router = new VueRouter({
  routes
})

export default router
