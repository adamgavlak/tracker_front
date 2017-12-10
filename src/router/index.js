import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Projects from '@/components/Projects'
import Trackings from '@/components/Trackings'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/trackings',
      name: 'Trackings',
      component: Trackings
    }
  ]
})
