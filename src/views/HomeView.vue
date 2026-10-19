<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import SearchBar from '../components/SearchBar.vue'
import MovieList from '../components/MovieList.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()

// La recherche est gardée dans l'URL (?q=) pour la retrouver au retour du détail
const query = ref(route.query.q ?? '')
const featured = ref([])

const results = ref([])

function handleResults(data) {
    results.value = data
}

/*
onMounted(() => {
  getFeatured()
    .then((list) => (featured.value = list))
    .catch(() => {}) // pas bloquant : la section est simplement masquée
  if (query.value) search()
})*/
</script>

<template>
  <section>
    <div class="intro">
      <div>
        <h1>Bienvenue sur Ma Cinémathèque</h1>
        <p>
          Recherchez n'importe quel film, ajoutez-le à votre bibliothèque, marquez ceux que vous avez vus, gardez vos
          favoris et notez-les. Tout est sauvegardé dans votre navigateur.
        </p>
      </div>
      <div v-if="featured.length" class="featured">
        <h2>En vedette</h2>
        <div class="featured-list">
          <RouterLink v-for="m in featured" :key="m.id" :to="`/movie/${m.id}`" class="featured-item">
            <img v-if="m.poster" :src="m.poster" :alt="`Affiche de ${m.title}`" />
            <span v-if="m.rating" class="small-rating">{{ formatRating(m.rating) }}</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <SearchBar @search-results="handleResults" />
    <MovieList :results="results" />

  
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  gap: 1.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.25rem;
}
.intro > div:first-child {
  flex: 1;
  min-width: 240px;
}
.intro p {
  color: var(--muted);
  line-height: 1.5;
}
.featured h2 {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: var(--accent);
  text-align: center;
}
.featured-list {
  display: flex;
  gap: 0.75rem;
}
.featured-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
}
.featured-item img {
  width: 90px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 6px;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 1.25rem;
}
.search-bar svg {
  color: #fff;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  flex-shrink: 0;
}
.search-bar input {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.8rem;
  border: none;
  border-radius: 6px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
}
.search-bar .btn {
  background: var(--surface);
  color: var(--accent);
  border: none;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.search-bar .btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.result {
  background: var(--surface);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}
.poster {
  aspect-ratio: 2 / 3;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  text-decoration: none;
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}
.info p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}
.title {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}
.title:hover {
  color: var(--accent);
}
.info .btn,
.btn-added {
  margin-top: auto;
  border: none;
  font: inherit;
  cursor: pointer;
}
.info button {
  margin-top: 0.6rem;
  padding: 0.45rem;
}
.btn-added {
  background: var(--surface-2);
  color: var(--muted);
  border-radius: 6px;
  cursor: default;
}
.small-rating {
  color: #c48a00;
  font-weight: 600;
  font-size: 0.8rem;
  margin-left: 0.3rem;
}
.error {
  background: #fdecec;
  color: #a12626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--muted);
  padding: 1.5rem;
}
.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid var(--surface-2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.more {
  text-align: center;
  margin-top: 1.5rem;
}
.more .btn {
  border: none;
  font: inherit;
  cursor: pointer;
}
</style>
