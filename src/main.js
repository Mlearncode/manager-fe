import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import request from './utils/request'
import storage from './utils/storage'

createApp(App).config.globalProperties.$request = request
createApp(App).config.globalProperties.$storage = storage

createApp(App).use(router).use(ElementPlus).mount('#app')
