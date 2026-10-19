<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import MovieCard from '../components/MovieCard.vue'

const store = useStore()
const favorites = computed(() => store.getters.favorites)
</script>

<template>
  <section>
    <div class="page-header">
      <h1>Mes favoris</h1>
    </div>

    <div v-if="favorites.length" class="grid">
      <MovieCard v-for="movie in favorites" :key="movie.id" :movie="movie" />
    </div>

    <div v-else class="empty">
      <p>Aucun favori pour l'instant. Cliquez sur le cœur d'un film de votre bibliothèque.</p>
      <RouterLink to="/library" class="btn">Voir ma bibliothèque</RouterLink>
    </div>
  </section>
</template>
