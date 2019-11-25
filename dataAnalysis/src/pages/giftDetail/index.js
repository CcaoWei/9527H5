import Vue from 'vue'
// import createRouter from '../../router/router'
import App from './index.vue'
import axios  from 'axios'
import utils from '../../utils/utils.js'
import uuid from '../../utils/uuid.js'

utils.setAdaption()
Vue.prototype.$axios = axios;
Vue.prototype.$uuid = uuid.uuid;
Vue.prototype.utils = utils;
document.getElementById('mark').style.display = 'none';
new Vue({
  // router,
  render: (h) => h(App)
}).$mount('#app')
