import KProgress from 'k-progress';
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.component('k-progress', KProgress);

new Vue({
  render: h => h(App),
}).$mount('#app');
