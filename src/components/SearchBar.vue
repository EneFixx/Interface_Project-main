<script setup>
import { ref } from 'vue'
import { getMovie, getMovieByTitle, getMovieById, getMovieByYear} from '../services/omdbAPI.js'

const emit = defineEmits(['search-results'])

const searchQuery = ref('')
const yearQuery = ref('')
const error = ref('')
const loading = ref('')
const url = ref('')

async function handleSearch2() {
    error.value=''
    emit('search-results', [])

    if (searchQuery.value.trim()) {
        if (searchQuery.value.trim().length < 3) {
            error.value = 'Tapez au moins 3 charactères'
            return
        } else if (/^tt\d{7,8}$/.test(searchQuery.value.trim())) {
            url.value = await getMovieById(searchQuery.value)
        } else {
            url.value = await getMovieByTitle(searchQuery.value)
        }
    }

    if (yearQuery.value.trim()) {
        return
    }

    try {
        const results = await getMovie(url.value)
        emit('search-results', Array.isArray(results) ? results : [results])
    } catch(err) {
        error.value = err.message
    }
}

async function handleSearch() {
    error.value = ''
    emit('search-results', [])

    if (searchQuery.value.trim().length < 3) {
        error.value = 'Tapez au moins 3 charactères'
        return
    }

    try {
        const results = await getMovieByTitle(searchQuery.value)
        emit('search-results', results)
    } catch (err) {
        if (err.message === "Movie not found!") {
            try {
                const movie = await getMovieById(searchQuery.value)
                emit ('search-results', [movie])
                return
            } catch (err2) {
                error.value = err2.message
                emit('search-results', [])
                return
            }
        }
        error.value = err.message
        emit('search-results', [])
    } finally {
        loading.value = false
    }
}

function dropdownFilters() {
    document.getElementById("dropdown").classList.toggle("show");
}

</script>

<template>
    <section>
        <form class="search-bar" @submit.prevent="handleSearch2">    
            <span id="filterButton" @click="dropdownFilters">> </span>
            <input type="text" v-model="searchQuery" placeholder="Entrez le titre du film..." />
            <button type="submit">Chercher</button>
            <diV id="dropdown" class="dropdown">
                Filtres: 
                <input type="text" v-model="yearQuery" placeholder="Année">
                <br/>
                Trier par:
                Titre <input type="checkbox">
                Année <input type="checkbox">
            </diV>
        </form>

        <p v-if="loading">Chargement...</p>
        <p v-else-if="error">{{ error }}</p>
    </section>
</template>

<style scoped>
#filterButton {
    cursor: pointer;
}

#dropdown {
    display: none;
}
#dropdown.show {
    display: block;
}

</style>