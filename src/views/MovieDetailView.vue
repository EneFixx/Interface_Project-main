<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMovie, getMovieById } from '../services/omdbAPI.js'
import { useStore } from 'vuex'

const props = defineProps({
  id: String
})

const store = useStore()
const router = useRouter()

const movie = ref(null)
const error = ref('')

async function load() {
  error.value = ''
  movie.value = null
  try {
    const query = await getMovieById(props.id)
    movie.value = await getMovie(query)
  } catch (err) {
    error.value = err.message
  }
}

watch(() => props.id, load, {immediate: true})

const goBack = () => (window.history.state?.back ? router.back() : router.push('/'))

const isLoggedIn = computed(() => store.getters['user/isLoggedIn'])
const isInLibrary = computed(() => store.getters['library/has'](movie.value.imdbID))

function toggleLibrary() {
  store.dispatch('library/toggle', movie.value.imdbID)
}
</script>

<template>
  <section>
    <button type="button" class="back" @click="goBack">&larr; Retour</button>

    <p v-if="error">{{ error }}</p>

    <article class="movie" v-if="movie">
      <img class="poster" v-if="movie.Poster !== 'N/A'" :src="movie.Poster" :alt="movie.Title" />
      <div class="content">
        <h1>{{ movie.Title }}</h1>
        <p>Réalisateur : {{ movie.Director }}</p>
        <p>Année : {{ movie.Year }}</p>
        <p>Note IMDb : {{ movie.imdbRating }}</p>
        <p>Genre : {{ movie.Genre }}</p>
        <p>Durée : {{ movie.Runtime }}</p>
        <button v-if="isLoggedIn" class="btn" @click="toggleLibrary">
          {{ isInLibrary ? 'Retirer de ma bibliothèque' : 'Ajouter à ma bibliothèque' }}
        </button>
        <p>{{ movie.Plot }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.back {
  border: none;
  background: none;
  color: var(--accent);
  font: inherit;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
}
.error {
  background: #fdecec;
  color: #a12626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.movie {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}

.poster {
  width: 20rem;
  height: 100%;
  object-fit: cover;
}

.content { 
  flex: 1;
  min-width: 260px;
}
</style>
