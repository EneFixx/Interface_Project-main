import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/library', name: 'library', component: () => import('../views/LibraryView.vue') },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/LibraryView.vue'),
      props: { onlyFavorites: true },
    },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('../views/MovieDetailView.vue'),
      props: true,
    },
  ],
})
