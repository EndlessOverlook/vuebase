import { getAppList, saveData } from '@/api/urls';

// initialize state
const state = () => ({
  all: []
});

// getters
const getters = {};

// action
const actions = {
  getAllProducts({ commit }) {
    getAppList().then(res => {
      commit('setProducts', res);
    });
  },
  addProductToCart({ commit }, params) {
    console.log('params: ' + params);
    saveData(params).then(() => {
      commit('saveSuccess');
    });
  }
};

// mutations
const mutations = {
  setProducts(state, products) {
    state.all = products;
  },
  saveSuccess() {
    console.log('save成功');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
