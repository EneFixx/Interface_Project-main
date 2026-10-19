<script setup>
import { useStore } from 'vuex'

const props = defineProps({
  movie: { type: Object, required: true },
})

const store = useStore()
const toggleWatched = () => store.dispatch('toggleWatched', props.movie.id)
const toggleFavorite = () => store.dispatch('toggleFavorite', props.movie.id)
const remove = () => {
  if (confirm(`Supprimer « ${props.movie.title} » de la bibliothèque ?`)) {
    store.dispatch('removeFromLibrary', props.movie.id)
  }
}
</script>

<template>
  <article class="card">
    <RouterLink :to="`/movie/${movie.id}`" class="poster">
      <img v-if="movie.poster" :src="movie.poster" :alt="`Affiche de ${movie.title}`" loading="lazy" />
      <span v-else class="no-poster">Pas d'affiche</span>
    </RouterLink>

    <div class="body">
      <RouterLink :to="`/movie/${movie.id}`" class="title">{{ movie.title }}</RouterLink>
      <p class="year">
        {{ movie.year || 'Année inconnue' }}
        <span v-if="movie.rating" class="rating">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z" />
          </svg>
          {{ movie.rating }}/5
        </span>
      </p>

      <div class="actions">
        <button
          type="button"
          class="btn-watched"
          :class="{ active: movie.watched }"
          :aria-pressed="movie.watched"
          @click="toggleWatched"
        >
          {{ movie.watched ? 'Vu' : 'Non vu' }}
        </button>

        <button
          type="button"
          class="icon-btn heart"
          :class="{ active: movie.favorite }"
          :aria-pressed="movie.favorite"
          :aria-label="movie.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          :title="movie.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          @click="toggleFavorite"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.3h2C13.8 6.1 15.2 5 17.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z"
            />
          </svg>
        </button>

        <button type="button" class="icon-btn trash" aria-label="Supprimer" title="Supprimer" @click="remove">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
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
}
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-poster {
  color: var(--muted);
  font-size: 0.9rem;
}
.body {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}
.title {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}
.title:hover {
  color: var(--accent);
}
.year {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}
.rating {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  margin-left: 0.5rem;
  color: #c48a00;
  font-weight: 600;
}
.rating svg {
  fill: currentColor;
}
.actions {
  margin-top: auto;
  padding-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.btn-watched {
  flex: 1;
  border: 1px solid var(--accent);
  background: var(--surface);
  color: var(--accent);
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
}
.btn-watched.active {
  background: var(--primary);
  color: #fff;
}
.icon-btn {
  border: none;
  background: transparent;
  padding: 0.3rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
}
.icon-btn:hover {
  background: var(--hover);
}
.icon-btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.heart {
  color: var(--muted);
}
.heart.active {
  color: #d64545;
}
.heart.active svg {
  fill: currentColor;
}
.trash {
  color: var(--muted);
}
.trash:hover {
  color: #d64545;
}
</style>
