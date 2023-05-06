import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import config from './config'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import axios from 'axios'


createApp(App).use(router).use(ElementPlus).mount('#app')
