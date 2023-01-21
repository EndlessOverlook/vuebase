import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);

import { Button, Select } from 'element-ui';
Vue.use(Button);
Vue.use(Select);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

console.log('process.env.VUE_APP_URL: ', process.env.VUE_APP_URL);
