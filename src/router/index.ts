import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Manage from '../views/Manage.vue'
import Beneficiaries from '../views/Beneficiaries.vue'
import Trustees from '../views/Trustees.vue'
import Developer from '../views/Developer.vue'
import Contact from '../views/Contact.vue'

//import ForYou from '../views/ForYou.vue'

const routes = [
{
    path: '/',
    name: 'Home',
    component: Home
},
{
    path: '/Developer',
    name: 'Developer',
    component: () => import(/* webpackChunkName: "about" */ '../views/Developer.vue')
},
{
    path: '/Beneficiaries',
    name: 'Beneficiaries',
    component: Beneficiaries
},
{
    path: '/Trustees',
    name: 'Trustees',
    component: Trustees
},
{
    path: '/Manage',
    name: 'Manage',
    component: Manage
},
{
    path: '/Contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue')
},
{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
},
{
    path: '/Guide',
    name: 'Guide',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "guide" */ '../views/Guide.vue')
},

]

const router = createRouter({
history: createWebHashHistory(),
routes
})

export default router
