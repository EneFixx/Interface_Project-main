export default {
    namespaced: true,

    state: () => ({
        ids: JSON.parse(localStorage.getItem('library:ids') || '[]'),
    }),

    getters: {
        has: (state) => (imdbID) => state.ids.includes(imdbID),
        count: (state) => state.ids.length,
    },

    mutations: {
        ADD(state, imdbID) {
            if (!state.ids.includes(imdbID)) {
                state.ids.push(imdbID)
            }
        },
        REMOVE(state, imdbID) {
            state.ids = state.ids.filter((id) => id !== imdbID)
        },
        PERSIST(state) {
            localStorage.setItem('library:ids', JSON.stringify(state.ids))
        },
    },

    actions: {
        loadLibrary({ commit }) {
            const ids = JSON.parse(localStorage.getItem('library:ids') || '[]')
            commit('SET_IDS', ids)
            return Promise.resolve()
        },
        add({ commit }, imdbID) {
            commit('ADD', imdbID)
            commit('PERSIST')
        },
        remove({ commit }, imdbID) {
            commit('REMOVE', imdbID)
            commit('PERSIST')
        },
        toggle({ getters, dispatch }, imdbID) {
            getters.has(imdbID) ? dispatch('remove', imdbID) : dispatch('add', imdbID)
        },
    }
}