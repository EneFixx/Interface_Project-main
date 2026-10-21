<script setup>
import { ref } from 'vue'
import { getMovie, getMovieByTitle, getMovieById, getMovieByYear} from '../services/omdbAPI.js'

const emit = defineEmits(['search-results'])

const searchQuery = ref('')
const yearQuery = ref('')
const error = ref('')
const url = ref('')
const sortByTitle = ref(false)
const sortByYear = ref(false)

async function handleSearch() {
    error.value=''
    emit('search-results', [])

    if (searchQuery.value.trim().length < 3) {
        error.value = 'Tapez au moins 3 charactères'
        return
    } else if (/^tt\d{7,8}$/.test(searchQuery.value.trim())) {
        url.value = await getMovieById(searchQuery.value)
    } else {
        url.value = await getMovieByTitle(searchQuery.value)
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
            <input id="searchInput" type="text" v-model="searchQuery" placeholder="Entrez le titre du film..." />
            <button type="submit">Chercher</button>
            <span id="filterButton" @click="dropdownFilters">> </span>
            <div id="dropdown">
                <input type="text" v-model="yearQuery" placeholder="Année">
                <strong>Trier par:</strong>
                <input type="checkbox" v-model="sortByTitle" @change="sortByYear = false"> Titre
                <input type="checkbox" v-model="sortByYear" @change="sortByTitle = false"> Année
            </div>
        </form>

        <p id="error" v-if="error">{{ error }}</p>
    </section>
</template>

<style scoped>
.search-bar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    color: #e6eaf2;
}


#searchInput {
    height: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    width: 80%;
}

.search-bar input:focus {
    outline: none;
}

.search-bar button {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    border: 1px solid var(--accent);
    background-color: var(--surface)
}

.search-bar button:hover {
    background-color: var(--accent);
    border: 1px solid var(--surface);
    color: var(--text)
}

#filterButton {
    cursor: pointer;
}

#dropdown {
    display: none;
}
#dropdown.show {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.3rem;
}

#dropdown input[type="text"] {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    field-sizing: content;
}

#error {
    color: #e6eaf2;
    font-weight: bold;
}

</style>