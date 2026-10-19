<script setup>
import { ref } from 'vue'
import { getMovie, getMovieByTitle, getMovieById, getMovieByYear} from '../services/omdbAPI.js'

const emit = defineEmits(['search-results'])

const searchQuery = ref('')
const yearQuery = ref('')
const error = ref('')
const loading = ref('')
const url = ref('')
const sortByTitle = ref(false)
const sortByYear = ref(false)

async function handleSearch() {
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
        if(!/^\d{4}$/.test(yearQuery.value.trim())) {
            error.value = 'Année invalide'
            return
        }
        url.value += await getMovieByYear(yearQuery.value.trim())
    }

    try {
        const results = await getMovie(url.value)
        const list = Array.isArray(results) ? results : [results]
        emit('search-results', sortResults(list))
    } catch(err) {
        if (err.message.includes('Conversion failed')) {
            error.value = 'Aucun résultat pour cette combinaison de recherche'
    } else {
        error.value = err.message
    }
    }
}

function dropdownFilters() {
    document.getElementById("dropdown").classList.toggle("show");
}

function sortResults(movies) {
    const sorted = [...movies]
    if (sortByTitle.value) {
        sorted.sort((a, b) => a.Title.localeCompare(b.Title))
    } else if (sortByYear.value) {
        sorted.sort((a,b) => Number(a.Year) - Number(b.Year))
    }
    return sorted
}

</script>

<template>
    <section>
        <form class="search-bar" @submit.prevent="handleSearch">    
            <span id="filterButton" @click="dropdownFilters">> </span>
            <input type="text" v-model="searchQuery" placeholder="Entrez le titre du film..." />
            <button type="submit">Chercher</button>
            <diV id="dropdown" class="dropdown">
                Filtres: 
                <input type="text" v-model="yearQuery" placeholder="Année">
                <br/>
                Trier par:
                Titre <input type="checkbox" v-model="sortByTitle" @change="sortByYear = false">
                Année <input type="checkbox" v-model="sortByYear" @change="sortByTitle = false">
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