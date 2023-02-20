import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 插件
import './utils/global'
// element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 默认样式
import './style/index.scss'
// icon
import './assets/font/iconfont.scss'
import './icons'
// 全局过滤器
import './utils/filter'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
