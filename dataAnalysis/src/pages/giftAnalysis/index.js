import Vue from 'vue'
// import createRouter from './router/router.js'
import App from './index.vue'
import axios  from 'axios'
import jsonpAdapter from 'axios-jsonp';
import utils from '../../utils/utils.js'
import uuid from '../../utils/uuid.js'

utils.setAdaption();

// const router = createRouter()
Vue.prototype.$axios = axios;
Vue.prototype.$jsonpAdapter = jsonpAdapter;
Vue.prototype.$uuid = uuid.uuid;
Vue.prototype.utils = utils;
document.getElementById('mark').style.display = 'none';
new Vue({
  // router,
  render: (h) => h(App)
}).$mount('#app')

