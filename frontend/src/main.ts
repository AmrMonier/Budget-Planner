import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from './router'

// Nucleo Icons
import './assets/css/nucleo-icons.css'
import './assets/css/nucleo-svg.css'

import materialKit from './material-kit'
import axiosInstance from '@/services/axios.service'

const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance
app.use(createPinia())
app.use(router)
app.use(materialKit)
app.mount('#app')
