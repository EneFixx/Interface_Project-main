<script setup>
import { ref } from 'vue'
import SearchBar from './SearchBar.vue'
import MovieList from './MovieList.vue'

const results = ref([])

function handleResults(data) {
    results.value = data
}
</script>

<template>
    <SearchBar @search-results="handleResults" />
    <MovieList :results="results" />
</template>

<style scoped></style>