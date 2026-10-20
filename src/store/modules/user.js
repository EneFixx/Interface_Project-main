function loadUsers() {
  return JSON.parse(localStorage.getItem('users:list') || '[]')
}
function loadCurrentUsername() {
  return localStorage.getItem('users:current') || null
}

export default {
    namespaced: true,

    state: () => ({
        users: [],
        currentUser: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.currentUser
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users
        },
        SET_CURRENT(state, user) {
            state.currentUser = user
        },
    },

    actions: {
        loadSessions({ commit }) {
            const users = loadUsers()
            commit('SET_USERS', users)
            const username = loadCurrentUsername()
            const found = users.find((u) => u.username === username) || null
            commit('SET_CURRENT', found ? { username: found.username } : null)
            return Promise.resolve()
        },

        register({ commit, state, dispatch }, { username, password }) {
            if (state.users.some((u) => u.username === username)) {
                throw new Error('Ce pseudo est déjà pris')
            }
            const users = [...state.users, { username, password }]
            commit('SET_USERS', users)
            localStorage.setItem('users:list', JSON.stringify(users))
            return dispatch('login', {username, password})
        },

        login({ commit, state, dispatch }, { username, password }) {
            const user = state.users.find((u) => u.username === username && u.password === password)
            if (!user) throw new Error('Identifiants invalides')
            commit('SET_CURRENT', { username: user.username })
            localStorage.setItem('users:current', username)
            return dispatch('library/loadLibrary', null, { root: true })
        },

        logout({ commit, dispatch }) {
            commit('SET_CURRENT', null)
            localStorage.removeItem('users:current')
            return dispatch('library/loadLibrary', null, { root: true })
        },
    }
}