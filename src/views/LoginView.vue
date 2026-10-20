<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const mode = ref('login')
const username = ref('')
const password = ref('')
const error = ref('')

async function handleSubmit() {
    error.value = ''
    try {
        if (mode.value === 'login') {
            await store.dispatch('user/login', {username: username.value, password: password.value })
        } else {
            await store.dispatch('user/register', { username: username.value, password: password.value })
        }
        router.push('/home')
    } catch (err) {
        error.value = err.message
    }
}

function toggleMode() {
    mode.value = mode.value === 'login' ? 'register' : 'login'
    error.value = ''
}
</script>

<template>
    <section class="auth">
        <h1>{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h1>
        
        <form @submit.prevent="handleSubmit">
            <label>
                Pseudo
                <input v-model="username" type="text" required autocomplete="username" />
            </label>
            <label>
                Mot de passe
                <input v-model="password" type="password" required autocomplete="current-password" />
            </label>

            <p v-if="error" class="error">{{  error }}</p>

            <button type="submit" class="btn">
                {{ mode === 'login' ? 'Se connecter' : "S'inscrire" }}
            </button>
        </form>

        <button type="button" class="link" @click="toggleMode">
            {{ mode === 'login' ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
        </button>
    </section>
</template>

<style scoped></style>