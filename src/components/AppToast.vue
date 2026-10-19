<script setup>
import { onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

// Notification affichée après un ajout ou une suppression, quel que soit l'endroit d'où elle vient
const store = useStore()
const message = ref('')
let timer

const MESSAGES = {
  ADD_MOVIE: (movie) => `« ${movie.title} » ajouté à la bibliothèque`,
  REMOVE_MOVIE: () => 'Film supprimé de la bibliothèque',
}

const unsubscribe = store.subscribe(({ type, payload }) => {
  if (!MESSAGES[type]) return
  message.value = MESSAGES[type](payload)
  clearTimeout(timer)
  timer = setTimeout(() => (message.value = ''), 2500)
})

onUnmounted(() => {
  unsubscribe()
  clearTimeout(timer)
})
</script>

<template>
  <div class="toast-zone" role="status" aria-live="polite">
    <Transition name="toast">
      <p v-if="message" class="toast">{{ message }}</p>
    </Transition>
  </div>
</template>

<style scoped>
.toast-zone {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
}
.toast {
  margin: 0;
  background: var(--primary);
  color: #fff;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  width: max-content;
  max-width: calc(100vw - 2rem);
  text-align: center;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
