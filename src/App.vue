<script setup>
import NavBar from './components/NavBar.vue'
import AppToast from './components/AppToast.vue'
</script>

<template>
  <NavBar />
  <main class="container">
    <RouterView />
  </main>
  <AppToast />
</template>
