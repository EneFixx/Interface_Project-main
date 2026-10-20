<script setup>
import MovieList from '../components/MovieList.vue';
import LibraryStats from '../components/LibraryStats.vue';
import { getMovie, getMovieById } from '../services/omdbAPI.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

// true quand on est sur /favorites (voir router)
const props = defineProps({
  onlyFavorites: Boolean
})

const store = useStore()
const router = useRouter()
const ids = computed(() => store.state.library.ids)

const movies = ref([])

const shownMovies = computed(() => {
  if (props.onlyFavorites) {
    return movies.value.filter((movie) => store.getters['library/favorites'].includes(movie.imdbID))
  }
  return movies.value
})

// Le filtre oui/non change de page : /library <-> /favorites
function toggleFilter() {
  router.push(props.onlyFavorites ? '/library' : '/favorites')
}

onMounted(async () => {
  const results = await Promise.all(
    ids.value.map(async (id) => {
      const query = await getMovieById(id)
      return getMovie(query)
    })
  )
  movies.value = results.filter(Boolean)
})

</script>

<template>
  <section class="container" id="library">
    <LibraryStats />
    <section id="favoriFilter">
      Favoris uniquement <input type="checkbox" :checked="onlyFavorites" @change="toggleFilter">

      <MovieList :results="shownMovies" />
    </section>
  </section>
</template>

<style scoped>
#library {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
}
#favoriFilter {
  color: var(--accent);
  font-weight: bold;
}

</style>
