import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// font-awesome
import 'font-awesome/css/font-awesome.min.css'
// aixos
import axios from 'axios'
// service

const app = createApp(App)

app.config.globalProperties.$https = axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus).use(createPinia()).use(router).mount('#app')
