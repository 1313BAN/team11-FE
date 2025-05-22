import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import piniaPersist from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import PrimeVueComponents from './plugins/primevue'


// ✅ ConfirmDialog 관련 추가
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error]', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

// ✅ PrimeVue 테마 설정
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue'
      },
      darkModeSelector: '.my-app-dark'
    }
  }
})

// ✅ PrimeVue 구성요소 등록
app.use(PrimeVueComponents)

// ✅ 🔹 여기 추가
app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia) // ✅ 플러그인 적용된 인스턴스 사용
app.use(router)

app.mount('#app')
