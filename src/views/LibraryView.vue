<script setup>
import MovieList from '../components/MovieList.vue';

const library = []
</script>

<template>
  <MovieList :results="library" />
</template>

<style scoped>
.stats {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.stats li {
  background: var(--surface);
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  color: var(--muted);
  box-shadow: var(--shadow);
}
.stats strong {
  color: var(--accent);
  font-size: 1.1rem;
  margin-right: 0.25rem;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}
.toolbar input {
  flex: 1;
  min-width: 200px;
}
.toolbar input,
.toolbar select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
  background: var(--surface);
  color: var(--text);
}
.btn-dev {
  border: 1px dashed #c47f00;
  background: #fff8e6;
  color: #8a5a00;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}
</style>
