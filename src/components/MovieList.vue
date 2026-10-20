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
.searchResults {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: var(--surface);
    padding: 3rem;
    border-radius: 8px;
}
.movie {
    list-style-type: none;
    font-size: .9rem;
}
.movie a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: black;
}

.movie p {
    width: 10rem;
    overflow-wrap: break-word;
    margin: 0;
}
.movie img{
    width: 10rem;
}
</style>