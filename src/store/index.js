import { createStore } from 'vuex'

// Clé utilisée dans le localStorage
const STORAGE_KEY = 'movie-library'

// Retrouve un film par son id (imdbID OMDb, ex. "tt0816692")
const findMovie = (state, id) => state.library.find((m) => m.id === id)

const store = createStore({
  state: () => ({
    library: [],
  }),

  getters: {
    allMovies: (state) => state.library,
    favorites: (state) => state.library.filter((m) => m.favorite),
    // Usage : store.getters.isInLibrary(id)
    isInLibrary: (state) => (id) => state.library.some((m) => m.id === id),

    // Statistiques
    totalCount: (state) => state.library.length,
    watchedCount: (state) => state.library.filter((m) => m.watched).length,
    remainingCount: (state, getters) => getters.totalCount - getters.watchedCount,
    favoritesCount: (state, getters) => getters.favorites.length,
    // Moyenne des notes > 0, 0 si aucune note
    averageRating: (state) => {
      const rated = state.library.filter((m) => m.rating > 0)
      if (!rated.length) return 0
      return rated.reduce((sum, m) => sum + m.rating, 0) / rated.length
    },
  },

  mutations: {
    ADD_MOVIE(state, movie) {
      state.library.push(movie)
    },
    REMOVE_MOVIE(state, id) {
      state.library = state.library.filter((m) => m.id !== id)
    },
    TOGGLE_WATCHED(state, id) {
      const movie = findMovie(state, id)
      if (movie) movie.watched = !movie.watched
    },
    TOGGLE_FAVORITE(state, id) {
      const movie = findMovie(state, id)
      if (movie) movie.favorite = !movie.favorite
    },
    SET_RATING(state, { id, rating }) {
      const movie = findMovie(state, id)
      if (movie) movie.rating = rating
    },
    SET_NOTE(state, { id, note }) {
      const movie = findMovie(state, id)
      if (movie) movie.note = note
    },
    SET_LIBRARY(state, library) {
      state.library = library
    },
  },

  actions: {
    // Point d'entrée pour le bouton "Ajouter" : renvoie true si ajouté, false sinon
    addToLibrary({ commit, getters }, movie) {
      if (!movie || movie.id == null || getters.isInLibrary(movie.id)) return false
      commit('ADD_MOVIE', {
        id: movie.id,
        title: movie.title ?? '',
        director: movie.director ?? '',
        year: movie.year ?? '',
        poster: movie.poster ?? '',
        description: movie.description ?? '',
        watched: false,
        favorite: false,
        rating: 0,
        note: '',
        addedAt: new Date().toISOString(),
      })
      return true
    },
    removeFromLibrary({ commit }, id) {
      commit('REMOVE_MOVIE', id)
    },
    toggleWatched({ commit }, id) {
      commit('TOGGLE_WATCHED', id)
    },
    toggleFavorite({ commit }, id) {
      commit('TOGGLE_FAVORITE', id)
    },
    // Note bornée entre 0 et 5
    setRating({ commit }, { id, rating }) {
      const value = Math.min(5, Math.max(0, Number(rating) || 0))
      commit('SET_RATING', { id, rating: value })
    },
    setNote({ commit }, { id, note }) {
      commit('SET_NOTE', { id, note: String(note ?? '') })
    },
    // Charge la bibliothèque ; JSON absent ou invalide => tableau vide
    loadLibrary({ commit }) {
      let library = []
      try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (Array.isArray(data)) library = data
      } catch {
        console.warn('Bibliothèque illisible dans le localStorage, réinitialisation.')
      }
      commit('SET_LIBRARY', library)
    },
  },
})

// Sauvegarde automatique après chaque mutation
store.subscribe((mutation, state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.library))
  } catch (e) {
    console.error('Sauvegarde impossible :', e)
  }
})

export default store
