<template>
  <div class="container">
    <h4 class="center-align">Login to MindConnect</h4>
    <form @submit.prevent="handleLogin">
      <!-- Username -->
      <div class="input-field">
        <input v-model="username" type="text" id="username" required />
        <label for="username">Username</label>
        <span class="red-text" v-if="usernameError">Username is incorrect.</span>
      </div>

      <!-- Password -->
      <div class="input-field">
        <input v-model="password" type="password" id="password" required />
        <label for="password">Password</label>
        <span class="red-text" v-if="passwordError">Password is incorrect.</span>
      </div>

      <button class="btn waves-effect" type="submit" :disabled="!isFormValid">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = ref('')
const password = ref('')
const usernameError = ref(false)
const passwordError = ref(false)

// 检查表单是否有效
const isFormValid = computed(() => username.value && password.value)

// 登录验证
function handleLogin() {
  const storedUser = JSON.parse(localStorage.getItem('registeredUser'))

  if (!storedUser) {
    alert('No registered users found!')
    return
  }

  if (username.value === storedUser.username && password.value === storedUser.password) {
    
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('currentUser', JSON.stringify(storedUser))
    localStorage.setItem('role', storedUser.role)

    alert('Login successful!')

    
    if (storedUser.role === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  } else {
    // 显示错误信息
    usernameError.value = username.value !== storedUser.username
    passwordError.value = password.value !== storedUser.password
  }
}
</script>


<style scoped>
.input-field {
  margin-bottom: 20px;
}

button:disabled {
  background-color: #c1c1c1;
}
</style>
