<template>
  <div class="container">
    <h4 class="center-align">Register Account</h4>
    <form @submit.prevent="handleRegister">
      <div class="input-field">
        <input v-model="username" type="text" id="username" required />
        <label for="username">Username</label>
        <span class="red-text" v-if="!username">Username is required.</span>
      </div>

      <div class="input-field">
        <input v-model="email" type="email" id="email" required />
        <label for="email">Email</label>
        <span class="red-text" v-if="!isValidEmail(email)">Invalid email format.</span>
      </div>

      <div class="input-field">
        <input v-model="password" type="password" id="password" required />
        <label for="password">Password</label>
        <span class="red-text" v-if="password.length > 0 && password.length < 6">
          Password must be at least 6 characters.
        </span>
      </div>

       <div class="input-field">
        <select v-model="role" class="browser-default">
         <option disabled value="">Select Role</option>
         <option value="user">User</option>
         <option value="admin">Admin</option>
       </select>
       <span class="red-text" v-if="!role">Role is required.</span>
      </div>

      <button class="btn waves-effect" type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const role = ref('')


const username = ref('')
const email = ref('')
const password = ref('')

function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value)
}

function handleRegister() {
  if (!username.value || !isValidEmail(email.value) || password.value.length < 6) {
    alert('Please fix the errors before submitting.')
    return
  }

  const user = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: role.value
  }

  localStorage.setItem('registeredUser', JSON.stringify(user))
  alert('Registration successful!')
}
</script>
