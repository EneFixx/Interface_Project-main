function storageKey(username, suffix) {
  return `library:${username || 'anon'}:${suffix}`
}

export default {
    namespaced: true,

    state: () => ({
        ids: [],
        favorites: [],
        watched: [],
    }),

    getters: {
        has: (state) => (imdbID) => state.ids.includes(imdbID),
        count: (state) => state.ids.length,
        isFavorite: (state) => (imdbID) => state.favorites.includes(imdbID),
        favorites: (state) => state.favorites,
        isWatched: (state) => (imdbID) => state.watched.includes(imdbID),
    },

    mutations: {
        SET_STATE(state, { ids, favorites, watched }) {
            state.ids = ids
            state.favorites = favorites
            state.watched = watched
        },
        ADD(state, imdbID) {
            if (!state.ids.includes(imdbID)) {
                state.ids.push(imdbID)
            }
        },
        REMOVE(state, imdbID) {
            state.ids = state.ids.filter((id) => id !== imdbID)
            state.favorites = state.favorites.filter((id) => id !== imdbID)
            state.watched = state.watched.filter((id) => id !== imdbID)
        },
        TOGGLE_FAVORITE(state, imdbID) {
            if (state.favorites.includes(imdbID)) {
                state.favorites = state.favorites.filter((id) => id !== imdbID)
            } else {
                state.favorites.push(imdbID)
            }
        },
        TOGGLE_WATCHED(state, imdbID) {
            if (state.watched.includes(imdbID)) {
                state.watched = state.watched.filter((id) => id !== imdbID)
            } else {
                state.watched.push(imdbID)
            }
        },
        PERSIST(state, username) {
            localStorage.setItem(storageKey(username, 'ids'), JSON.stringify(state.ids))
            localStorage.setItem(storageKey(username, 'favorites'), JSON.stringify(state.favorites))
            localStorage.setItem(storageKey(username, 'watched'), JSON.stringify(state.watched))
        },
    },

    actions: {
        loadLibrary({ commit, rootState }) {
            const username = rootState.user.currentUser?.username
            const ids = JSON.parse(localStorage.getItem(storageKey(username, 'ids')) || '[]')
            const favorites = JSON.parse(localStorage.getItem(storageKey(username, 'favorites')) || '[]')
            const watched = JSON.parse(localStorage.getItem(storageKey(username, 'watched')) || '[]')
            commit('SET_STATE', { ids, favorites, watched })
            return Promise.resolve()
        },
        add({ commit, rootState }, imdbID) {
            commit('ADD', imdbID)
            commit('PERSIST', rootState.user.currentUser?.username)
        },
        remove({ commit, rootState }, imdbID) {
            commit('REMOVE', imdbID)
            commit('PERSIST', rootState.user.currentUser?.username)
        },
        toggle({ getters, dispatch }, imdbID) {
            getters.has(imdbID) ? dispatch('remove', imdbID) : dispatch('add', imdbID)
        },
        toggleFavorite({ commit, rootState }, imdbID) {
            commit('TOGGLE_FAVORITE', imdbID)
            commit('PERSIST', rootState.user.currentUser?.username)
        },
        toggleWatched({ commit, rootState }, imdbID) {
            commit('TOGGLE_WATCHED', imdbID)
            commit('PERSIST', rootState.user.currentUser?.username)
        },
    }
}