// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import VeeValidate from 'vee-validate'
import axios from 'axios'

Vue.use(VeeValidate)

window.axios = axios.create({
  baseURL: 'http://localhost:4000/',
  timeout: 1000
});

if (localStorage.getItem('api_key')) {
  var key = localStorage.getItem('api_key')
  window.api_key = key

  axios.defaults.headers.common = {
      "X-Api-Key": key
  }
}

import App from './App'
import router from './router'

Vue.config.productionTip = false

window.Event = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
