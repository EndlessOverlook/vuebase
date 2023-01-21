import Vue from 'vue';
import skeletonPage from './skeleton/skeleton.vue';

export default new Vue({
  components: {
    skeletonPage
  },
  render: h => h(skeletonPage)
});
