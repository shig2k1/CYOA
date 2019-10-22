import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/'

import Vuetify from 'vuetify'

// logging - we will NOT use console.log this time :-)
import VueLogger from 'vuejs-logger'

// import main
import '@/assets/scss/main.scss'
import './registerServiceWorker'

Vue.config.productionTip = false

// configure logging so console.log never enters production
const isProduction = process.env.NODE_ENV === 'production'
const consoleOptions = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
}

Vue.use(Vuetify)
Vue.use(VueLogger, consoleOptions)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
