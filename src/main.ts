import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Import and use touch events plugin
import Vue3TouchEvents from 'vue3-touch-events'
createApp(App).use(Vue3TouchEvents as any).mount('#app')
