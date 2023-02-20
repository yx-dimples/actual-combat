import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)

app.use(Vant).use(createPinia()).use(router).mount('#app')
