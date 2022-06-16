import Vue from 'vue'
import Vuex from 'vuex'
import CarModule from "./CarModule"
import UserModule from "./UserModule"
import CarAvailability from "./CarAvailability"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    CarModule,
    UserModule,
    CarAvailability
  }
})

export default store
