import Vue from 'vue';
import Vuex from 'vuex';
import carts from './modules/cart';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    carts
  }
});
