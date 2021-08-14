import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
//import Trusts from '../views/Trusts.vue'
import Test from '../views/Test.vue'
//import ForYou from '../views/ForYou.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  /*
  {
    path: '/ForYou',
    name: 'ForYou',
    component: ForYou
  },
  {
    path: '/trusts',
    name: 'Trusts',
    component: Trusts
  },
  */
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Test',
    name: 'Test',
    component: Test
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
