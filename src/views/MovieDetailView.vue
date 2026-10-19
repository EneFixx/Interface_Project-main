<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { formatRating, getMovie } from '../api/omdb.js'

// imdbID du film, reçu depuis la route /movie/:id
const props = defineProps({
  id: { type: String, required: true },
})

const store = useStore()
const router = useRouter()

const apiMovie = ref(null)
const loading = ref(false)
const error = ref('')
const noteDraft = ref('')
const noteSaved = ref(false)

// Version du film dans la bibliothèque (null s'il n'y est pas)
const libraryItem = computed(() => store.getters.allMovies.find((m) => m.id === props.id) ?? null)
// On affiche les données de l'API, sinon celles de la bibliothèque (hors ligne, films de test)
const movie = computed(() => apiMovie.value ?? libraryItem.value)

async function load() {
  loading.value = true
  error.value = ''
  apiMovie.value = null
  noteDraft.value = libraryItem.value?.note ?? ''
  try {
    apiMovie.value = await getMovie(props.id, 'full')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
watch(() => props.id, load, { immediate: true })

const add = () => store.dispatch('addToLibrary', apiMovie.value)
const toggleWatched = () => store.dispatch('toggleWatched', props.id)
const toggleFavorite = () => store.dispatch('toggleFavorite', props.id)
// Recliquer sur la note actuelle l'efface
const rate = (value) =>
  store.dispatch('setRating', { id: props.id, rating: libraryItem.value.rating === value ? 0 : value })
const saveNote = () => {
  store.dispatch('setNote', { id: props.id, note: noteDraft.value.trim() })
  noteSaved.value = true
  setTimeout(() => (noteSaved.value = false), 2000)
}

const goBack = () => (window.history.state?.back ? router.back() : router.push('/'))
</script>

<template>
  <section>
    <button type="button" class="back" @click="goBack">&larr; Retour</button>

    <p v-if="loading" class="loading">Chargement...</p>

    <p v-if="error && !libraryItem" class="error" role="alert">{{ error }}</p>
    <p v-else-if="error" class="warning">Infos en ligne indisponibles, affichage des données de votre bibliothèque.</p>

    <article v-if="movie && !loading" class="detail">
      <div class="poster">
        <img v-if="movie.poster" :src="movie.poster" :alt="`Affiche de ${movie.title}`" />
        <span v-else>Pas d'affiche</span>
      </div>

      <div class="content">
        <h1>{{ movie.title }}</h1>
        <dl>
          <dt>Réalisateur</dt>
          <dd>{{ movie.director || 'Inconnu' }}</dd>
          <dt>Année</dt>
          <dd>{{ movie.year || 'Inconnue' }}</dd>
          <template v-if="apiMovie">
            <dt>Note IMDb</dt>
            <dd>{{ apiMovie.rating ? formatRating(apiMovie.rating) : 'Non notée' }}</dd>
            <template v-if="apiMovie.genre">
              <dt>Genre</dt>
              <dd>{{ apiMovie.genre }}</dd>
            </template>
            <template v-if="apiMovie.runtime">
              <dt>Durée</dt>
              <dd>{{ apiMovie.runtime }}</dd>
            </template>
            <template v-if="apiMovie.actors">
              <dt>Acteurs</dt>
              <dd>{{ apiMovie.actors }}</dd>
            </template>
          </template>
        </dl>

        <button v-if="!libraryItem && apiMovie" type="button" class="btn" @click="add">Ajouter à ma bibliothèque</button>

        <h2>Description</h2>
        <p class="description">{{ movie.description || 'Pas de description disponible.' }}</p>

        <!-- Partie personnelle, seulement si le film est dans la bibliothèque -->
        <div v-if="libraryItem" class="personal">
          <h2>Mon suivi</h2>
          <div class="toggles">
            <button type="button" class="toggle" :class="{ active: libraryItem.watched }" :aria-pressed="libraryItem.watched" @click="toggleWatched">
              {{ libraryItem.watched ? 'Vu' : 'Non vu' }}
            </button>
            <button type="button" class="toggle" :class="{ active: libraryItem.favorite }" :aria-pressed="libraryItem.favorite" @click="toggleFavorite">
              {{ libraryItem.favorite ? 'Favori' : 'Ajouter aux favoris' }}
            </button>
          </div>

          <p class="label" id="rating-label">Ma note</p>
          <div class="stars" role="group" aria-labelledby="rating-label">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              :class="{ on: n <= libraryItem.rating }"
              :aria-label="`${n} sur 5`"
              :aria-pressed="n === libraryItem.rating"
              @click="rate(n)"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z" />
              </svg>
            </button>
          </div>

          <label class="label" for="note">Ma note personnelle</label>
          <textarea id="note" v-model="noteDraft" rows="4" maxlength="1000" placeholder="Ce que j'ai pensé du film..."></textarea>
          <div class="note-actions">
            <button type="button" class="btn" @click="saveNote">Enregistrer</button>
            <span v-if="noteSaved" class="saved" role="status">Note enregistrée</span>
          </div>
        </div>
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
.detail {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  background: var(--surface);
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: var(--shadow);
}
.poster {
  width: 260px;
  max-width: 100%;
  aspect-ratio: 2 / 3;
  background: var(--surface-2);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content {
  flex: 1;
  min-width: 260px;
}
h2 {
  color: var(--accent);
  font-size: 1.1rem;
  margin: 1.25rem 0 0.5rem;
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.4rem 1rem;
  margin: 1rem 0;
}
dt {
  font-weight: 600;
}
dd {
  margin: 0;
  color: var(--muted);
}
.btn {
  border: none;
  font: inherit;
  cursor: pointer;
}
.description {
  line-height: 1.6;
  margin: 0;
}
.personal {
  border-top: 1px solid var(--border);
  margin-top: 1.25rem;
}
.toggles {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.toggle {
  border: 1px solid var(--accent);
  background: var(--surface);
  color: var(--accent);
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font: inherit;
  cursor: pointer;
}
.toggle.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
.label {
  display: block;
  font-weight: 600;
  margin: 1rem 0 0.4rem;
}
.stars {
  display: flex;
  gap: 0.2rem;
}
.stars button {
  border: none;
  background: none;
  padding: 0.1rem;
  cursor: pointer;
  color: var(--border);
  display: flex;
}
.stars button.on {
  color: #e0a100;
}
.stars svg {
  fill: currentColor;
}
textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
  resize: vertical;
}
.note-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.saved {
  color: #2e8b57;
  font-size: 0.9rem;
}
.error {
  background: #fdecec;
  color: #a12626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}
.warning {
  background: #fff8e6;
  color: #8a5a00;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}
.loading {
  color: var(--muted);
}
</style>
