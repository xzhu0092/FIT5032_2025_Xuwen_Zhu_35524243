<template>
  <div class="container">
    <h4 class="center-align">Login to MindConnect</h4>

    <form @submit.prevent="handleLogin" novalidate>
      <!-- Email -->
      <div class="input-field">
        <input
          v-model.trim="email"
          type="email"
          id="email"
          required
          :aria-invalid="emailError ? 'true' : 'false'"
          autocomplete="email"
        />
        <label for="email">Email</label>
        <span class="red-text" v-if="emailError">{{ emailError }}</span>
      </div>

      <!-- Password -->
      <div class="input-field">
        <input
          v-model="password"
          type="password"
          id="password"
          required
          :aria-invalid="passwordError ? 'true' : 'false'"
          autocomplete="current-password"
        />
        <label for="password">Password</label>
        <span class="red-text" v-if="passwordError">{{ passwordError }}</span>
      </div>

      <p class="red-text" role="alert" v-if="formError">{{ formError }}</p>

      <button
        class="btn waves-effect"
        type="submit"
        :disabled="!isFormValid || loading"
      >
        <span v-if="!loading">Login</span>
        <span v-else>Logging in…</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiAuth } from '../firebase'

const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')

const isFormValid = computed(() => !!email.value && !!password.value && !loading.value)

async function handleLogin () {
  if (!isFormValid.value) return

  emailError.value = ''
  passwordError.value = ''
  formError.value = ''

  try {
    loading.value = true
    await apiAuth.loginEmail(email.value, password.value)
    router.push('/') // 登录成功后跳转首页
  } catch (e) {
    const msg = e?.code || e?.message || ''
    if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
      emailError.value = 'Email is invalid or not registered.'
    } else if (msg.includes('wrong-password')) {
      passwordError.value = 'Password is incorrect.'
    } else if (msg.includes('too-many-requests')) {
      formError.value = 'Too many attempts. Please try again later.'
    } else {
      formError.value = 'Login failed. ' + (e?.message || '')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-field { margin-bottom: 20px; }
button:disabled { background-color: #c1c1c1; }
</style>


