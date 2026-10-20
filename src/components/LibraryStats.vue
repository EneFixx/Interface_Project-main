<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const total = computed(() => store.getters['library/count'])
const favoritesCount = computed(() => store.state.library.favorites.length)
const watchedCount = computed(() => store.state.library.watched.length)
</script>

<template>
  <section class="stats">
    <strong>{{ total }}</strong> film{{ total > 1 ? 's' : '' }}
    <strong>{{ watchedCount }}</strong> vu{{ watchedCount > 1 ? 's' : '' }}
    <strong>{{ favoritesCount }}</strong> favori{{ favoritesCount > 1 ? 's' : '' }}
  </section>
</template>

<style scoped>
.stats {
  margin: 1rem;
  width: max-content;
  gap: 1rem;
  background: var(--surface);
  border-radius: 8px;
  padding: 1rem;
  color: var(--muted);
  box-shadow: var(--shadow);
}
.stats strong {
  color: var(--accent);
  font-size: 1.1rem;
  margin-right: 0.25rem;
}
</style>