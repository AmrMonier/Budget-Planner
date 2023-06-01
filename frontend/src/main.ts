
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './router'

import '@/assets/styles.scss';

const app = createApp(App)
app.use(PrimeVue, { ripple: true });

app.use(createPinia())
app.use(router)

app.mount('#app')
