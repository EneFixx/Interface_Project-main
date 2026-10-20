import { createStore } from 'vuex'
import library from './modules/library'
import user from './modules/user'

export default createStore({
  modules: { library, user },
})