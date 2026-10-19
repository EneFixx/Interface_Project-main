import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'

// On charge la bibliothèque avant de monter l'app
store.dispatch('loadLibrary').then(() => {
  createApp(App).use(store).use(router).mount('#app')
})
