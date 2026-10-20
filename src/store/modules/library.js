function storageKey(username) {
  return `library:${username || 'anon'}`
}

export default {
    namespaced: true,

    state: () => ({
        ids: [],
    }),

    getters: {
        has: (state) => (imdbID) => state.ids.includes(imdbID),
        count: (state) => state.ids.length,
        isFavorite: (state) => (imdbID) => state.favorites.includes(imdbID),
        favorites: (state) => state.favorites,
        isWatched: (state) => (imdbID) => state.watched.includes(imdbID),
    },

    mutations: {
        SET_IDS(state, ids) {
            state.ids = ids
        },
        ADD(state, imdbID) {
            if (!state.ids.includes(imdbID)) {
                state.ids.push(imdbID)
            }
        },
        REMOVE(state, imdbID) {
            state.ids = state.ids.filter((id) => id !== imdbID)
            // un film retiré de la bibliothèque n'est plus favori ni vu
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
            localStorage.setItem(storageKey(username), JSON.stringify(state.ids))
        },
    },

    actions: {
        loadLibrary({ commit, rootState }) {
            const username = rootState.user.currentUser?.username
            const ids = JSON.parse(localStorage.getItem(storageKey(username)) || '[]')
            commit('SET_IDS', ids)
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
        toggleFavorite({ commit }, imdbID) {
            commit('TOGGLE_FAVORITE', imdbID)
            commit('PERSIST')
        },
        toggleWatched({ commit }, imdbID) {
            commit('TOGGLE_WATCHED', imdbID)
            commit('PERSIST')
        },
    }
}