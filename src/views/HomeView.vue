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
      <h1>Bienvenue sur Ma Cinémathèque</h1>
      <p>
        Recherchez n'importe quel film, ajoutez-le à votre bibliothèque, marquez ceux que vous avez vus, gardez vos
        favoris et notez-les. Tout est sauvegardé dans votre navigateur.
      </p>
    </div>

    <SearchBar @search-results="handleResults" />
    <MovieList :results="results" />

  
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.25rem;
}

.intro p {
  color: var(--muted);
}

</style>
