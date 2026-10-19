import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/library', name: 'library', component: () => import('../views/LibraryView.vue') },
    { path: '/favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue') },
    {
      path: '/movie/:id',
      name: 'movie',
      component: () => import('../views/MovieDetailView.vue'),
      props: true,
    },
  ],
})
