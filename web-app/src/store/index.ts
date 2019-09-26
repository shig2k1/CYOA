import Vue from 'vue'
import Vuex from 'vuex'

import { extractVuexModule } from 'vuex-class-component'

import MapStore from './modules/map.store'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    ...extractVuexModule(MapStore),
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
})
