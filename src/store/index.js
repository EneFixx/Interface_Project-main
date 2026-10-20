import { createStore } from 'vuex'
import library from './modules/library'

export default createStore({
    modules: {
      library
    }
})