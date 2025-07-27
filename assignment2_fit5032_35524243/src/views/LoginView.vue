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

function handleLogin() {
  const savedUsers = JSON.parse(localStorage.getItem('users')) || []  // 获取所有用户

  if (!savedUsers.length) {
    alert('No users found.')
    return
  }

  // 查找匹配的用户
  const user = savedUsers.find(u => u.username === username.value)

  if (!user) {
    usernameError.value = true
    passwordError.value = false
    alert('Username does not exist.')
    return
  }

  if (user.password === password.value) {
    // 登录成功
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('role', user.role)

    alert('Login successful!')

    // 跳转到主页或角色页面
    if (user.role === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  } else {
    usernameError.value = false
    passwordError.value = true
    alert('Incorrect password.')
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

