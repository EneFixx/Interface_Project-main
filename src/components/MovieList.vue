<script setup>
defineProps({
    results: Array
})
</script>

<template>
    <ul class="searchResults">
        <li v-for="movie in results" :key="movie.imdbID" class="movie">
            <RouterLink :to="`/movie/${movie.imdbID}`">
                <img :src="movie.Poster" :alt="movie.Title" />
                <p>{{ movie.Title }}</p>
            </RouterLink>
        </li>
    </ul>
</template>

<style scoped>
.movie {
    list-style-type: none;
}
.movie img{
    width: 10rem;
}
</style>