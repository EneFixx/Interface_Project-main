<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import MovieCard from '../components/MovieCard.vue'
// TEMPORAIRE - A SUPPRIMER AVANT LE RENDU
import mockMovies from '../dev/mockMovies.js'

const store = useStore()
const movies = computed(() => store.getters.allMovies)
const stats = computed(() => ({
  total: store.getters.totalCount,
  watched: store.getters.watchedCount,
  remaining: store.getters.remainingCount,
  favorites: store.getters.favoritesCount,
  average: store.getters.averageRating,
}))

// Recherche, filtre et tri dans la bibliothèque
const search = ref('')
const filter = ref('all')
const sortBy = ref('addedAt')

const filters = {
  all: () => true,
  watched: (m) => m.watched,
  unwatched: (m) => !m.watched,
  favorites: (m) => m.favorite,
}
const sorters = {
  addedAt: (a, b) => b.addedAt.localeCompare(a.addedAt), // plus récent d'abord
  title: (a, b) => a.title.localeCompare(b.title, 'fr'),
  year: (a, b) => (Number(b.year) || 0) - (Number(a.year) || 0),
  rating: (a, b) => b.rating - a.rating,
}

const visibleMovies = computed(() => {
  const q = search.value.trim().toLowerCase()
  return movies.value
    .filter(filters[filter.value])
    .filter((m) => !q || `${m.title} ${m.director}`.toLowerCase().includes(q))
    .sort(sorters[sortBy.value])
})

// TEMPORAIRE - A SUPPRIMER AVANT LE RENDU
const isDev = import.meta.env.DEV
const addMocks = () => mockMovies.forEach((m) => store.dispatch('addToLibrary', m))
</script>

<template>
  <section>
    <div class="page-header">
      <h1>Votre Bibliothèque</h1>
      <!-- TEMPORAIRE - A SUPPRIMER AVANT LE RENDU -->
      <button v-if="isDev" type="button" class="btn-dev" @click="addMocks">
        [DEV] Ajouter des films de test
      </button>
    </div>

    <template v-if="movies.length">
      <ul class="stats">
        <li><strong>{{ stats.total }}</strong> films</li>
        <li><strong>{{ stats.watched }}</strong> vus</li>
        <li><strong>{{ stats.remaining }}</strong> à voir</li>
        <li><strong>{{ stats.favorites }}</strong> favoris</li>
        <li><strong>{{ stats.average ? stats.average.toFixed(1) : '-' }}</strong> note moyenne</li>
      </ul>

      <div class="toolbar">
        <input v-model="search" type="search" placeholder="Chercher dans ma bibliothèque..." aria-label="Chercher dans ma bibliothèque" />
        <select v-model="filter" aria-label="Filtrer">
          <option value="all">Tous</option>
          <option value="watched">Vus</option>
          <option value="unwatched">À voir</option>
          <option value="favorites">Favoris</option>
        </select>
        <select v-model="sortBy" aria-label="Trier">
          <option value="addedAt">Ajout récent</option>
          <option value="title">Titre (A-Z)</option>
          <option value="year">Année</option>
          <option value="rating">Note</option>
        </select>
      </div>

      <div v-if="visibleMovies.length" class="grid">
        <MovieCard v-for="movie in visibleMovies" :key="movie.id" :movie="movie" />
      </div>
      <p v-else class="empty">Aucun film ne correspond à votre recherche.</p>
    </template>

    <div v-else class="empty">
      <p>Votre bibliothèque est vide.</p>
      <RouterLink to="/" class="btn">Rechercher des films</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.stats {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.stats li {
  background: var(--surface);
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  color: var(--muted);
  box-shadow: var(--shadow);
}
.stats strong {
  color: var(--accent);
  font-size: 1.1rem;
  margin-right: 0.25rem;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.toolbar input {
  flex: 1;
  min-width: 200px;
}
.toolbar input,
.toolbar select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
}
.btn-dev {
  border: 1px dashed #c47f00;
  background: #fff8e6;
  color: #8a5a00;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}
</style>
