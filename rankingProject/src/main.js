import Vue from 'vue'
import { Row, Col } from 'element-ui'
import axios  from 'axios'
import App from './App.vue'
import utils from './utils/utils.js'
import uuid from './utils/uuid.js'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Row)
Vue.use(Col)
Vue.prototype.$axios = axios;
Vue.prototype.$uuid = uuid.uuid;
Vue.prototype.utils = utils;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
