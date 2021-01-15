import Vue from 'vue'
import Router from 'vue-router'
import User from './views/User.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'user',
      component: User
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import(/* webpackChunkName: "about" */ './views/Blog.vue')
    },
    {
      path: '/plan',
      name: 'plan',
      component: () => import(/* webpackChunkName: "about" */ './views/Plan.vue')
    },
    {
      path: '/itap',
      name: 'itap',
      component: () => import(/* webpackChunkName: "about" */ './views/Itap.vue')
    }
  ]
})
