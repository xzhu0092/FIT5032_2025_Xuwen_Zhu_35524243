<template>
  <div class="container">
    <h4 class="center-align">Register Account</h4>
    <form @submit.prevent="handleRegister">
      <!-- Username Field -->
      <div class="input-field">
        <input v-model="username" type="text" id="username" required />
        <label for="username">Username</label>
        <span class="red-text" v-if="!username">Username is required.</span>
      </div>

      <!-- Email Field -->
      <div class="input-field">
        <input v-model="email" type="email" id="email" required />
        <label for="email">Email</label>
        <span class="red-text" v-if="!isValidEmail(email)">Invalid email format.</span>
      </div>

      <!-- Password Field -->
      <div class="input-field">
        <input v-model="password" type="password" id="password" required />
        <label for="password">Password</label>
        <span class="red-text" v-if="password.length > 0 && password.length < 6">
          Password must be at least 6 characters.
        </span>
      </div>

      <!-- Role Selection -->
      <div class="input-field">
        <select v-model="role" class="browser-default">
          <option disabled value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <span class="red-text" v-if="!role">Role is required.</span>
      </div>

      <button class="btn waves-effect" type="submit" :disabled="!isFormValid">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('')

// 邮箱格式验证
function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value)
}

// 表单有效性：用户名必填、邮箱有效、密码 >= 6 字符
const isFormValid = computed(() => {
  return username.value && isValidEmail(email.value) && password.value.length >= 6 && role.value
})

// 注册处理
function handleRegister() {
  // 获取已保存的用户列表
  const savedUsers = JSON.parse(localStorage.getItem('users')) || []

  // 检查用户名是否已经存在
  const existingUser = savedUsers.find(user => user.username === username.value)
  if (existingUser) {
    alert('Username already exists. Please choose another.')
    return
  }

  // 创建新用户
  const newUser = {
    username: username.value,
    email: email.value,
    password: password.value,
    role: role.value,
    ratings: { // 初始化为 null，因为用户还未评分
      'For Students': null,
      'For Professionals': null,
      'For Seniors': null
    }
  }

  // 将新用户添加到已有的用户列表中
  savedUsers.push(newUser)

  // 保存到 LocalStorage
  localStorage.setItem('users', JSON.stringify(savedUsers))

  alert('Registration successful!')
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



