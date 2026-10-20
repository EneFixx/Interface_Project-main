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
    }
}