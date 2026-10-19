<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatRating, getFeatured, searchMovies } from '../api/omdb.js'

const store = useStore()
const route = useRoute()
const router = useRouter()

// La recherche est gardée dans l'URL (?q=) pour la retrouver au retour du détail
const query = ref(route.query.q ?? '')
const movies = ref([])
const totalResults = ref(0)
const page = ref(1)
const loading = ref(false)
const error = ref('')
const searched = ref(false)
const lastQuery = ref('')
const featured = ref([])

async function search(more = false) {
  const q = query.value.trim()
  if (!q || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const nextPage = more ? page.value + 1 : 1
    const data = await searchMovies(q, nextPage)
    movies.value = more ? [...movies.value, ...data.movies] : data.movies
    totalResults.value = data.totalResults
    page.value = nextPage
    searched.value = true
    lastQuery.value = q
    if (!more) router.replace({ query: { q } })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const isInLibrary = (id) => store.getters.isInLibrary(id)
const add = (movie) => store.dispatch('addToLibrary', movie)

onMounted(() => {
  getFeatured()
    .then((list) => (featured.value = list))
    .catch(() => {}) // pas bloquant : la section est simplement masquée
  if (query.value) search()
})
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

    <form class="search-bar" role="search" @submit.prevent="search()">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      <input v-model="query" type="search" placeholder="Entrez le nom d'un film..." aria-label="Nom du film" />
      <button type="submit" class="btn" :disabled="loading || !query.trim()">Rechercher</button>
    </form>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div v-if="movies.length" class="grid results">
      <article v-for="m in movies" :key="m.id" class="result">
        <RouterLink :to="`/movie/${m.id}`" class="poster">
          <img v-if="m.poster" :src="m.poster" :alt="`Affiche de ${m.title}`" loading="lazy" />
          <span v-else>Pas d'affiche</span>
        </RouterLink>
        <div class="info">
          <RouterLink :to="`/movie/${m.id}`" class="title">{{ m.title }}</RouterLink>
          <p>{{ m.director || 'Réalisateur inconnu' }}</p>
          <p>
            {{ m.year }}
            <span v-if="m.rating" class="small-rating">{{ formatRating(m.rating) }}</span>
          </p>
          <button v-if="isInLibrary(m.id)" type="button" class="btn-added" disabled>Dans la bibliothèque</button>
          <button v-else type="button" class="btn" @click="add(m)">Ajouter</button>
        </div>
      </article>
    </div>

    <p v-else-if="searched && !loading && !error" class="empty">Aucun film trouvé pour « {{ lastQuery }} ».</p>

    <p v-if="loading" class="loading" aria-live="polite"><span class="spinner" aria-hidden="true"></span> Recherche en cours...</p>

    <div v-if="!loading && movies.length && movies.length < totalResults" class="more">
      <button type="button" class="btn" @click="search(true)">Charger plus</button>
    </div>
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
