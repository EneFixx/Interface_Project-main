<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const total = computed(() => store.getters.totalCount)
const favCount = computed(() => store.getters.favoritesCount)

// Thème : choix sauvegardé, sinon préférence du système
const THEME_KEY = 'movie-theme'
const readTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}
const theme = ref(readTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem(THEME_KEY, theme.value)
  } catch {
    // stockage indisponible : le thème ne sera pas mémorisé
  }
}
watchEffect(() => (document.documentElement.dataset.theme = theme.value))
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <RouterLink to="/" class="brand">Ma Cinémathèque</RouterLink>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/library">Bibliothèque <span class="badge">{{ total }}</span></RouterLink>
        <button
          type="button"
          class="theme-btn"
          :aria-label="theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'"
          :title="theme === 'dark' ? 'Mode clair' : 'Mode sombre'"
          @click="toggleTheme"
        >
          <!-- Soleil en mode sombre, lune en mode clair -->
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--primary);
  color: #fff;
}
.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.brand {
  color: #fff;
  font-weight: 700;
  font-size: 1.2rem;
  text-decoration: none;
}
nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
nav a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
}
nav a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
/* Lien actif mis en évidence */
nav a.router-link-exact-active {
  color: var(--primary);
  background: #fff;
  font-weight: 600;
}
.theme-btn {
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  color: #fff;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
}
.theme-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.theme-btn svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
/* Contour de focus visible sur le fond bleu */
nav a:focus-visible,
.theme-btn:focus-visible {
  outline-color: #fff;
}
.badge {
  font-size: 0.75rem;
  opacity: 0.8;
}
</style>
