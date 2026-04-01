import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { vGlow } from './composables/useCardGlow'
import 'highlight.js/styles/atom-one-light.css'
import './assets/styles/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.directive('glow', vGlow)

// 初始化主题
import { useThemeStore } from './stores/theme'
const theme = useThemeStore()
theme.init()

app.mount('#app')
