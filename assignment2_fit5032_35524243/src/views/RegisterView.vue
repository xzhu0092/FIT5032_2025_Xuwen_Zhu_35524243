<template>
  <div class="container">
    <h4 class="center-align">Register Account</h4>

    <form @submit.prevent="handleRegister" novalidate>
      <!-- Username（应用内显示名，不用于登录） -->
      <div class="input-field">
        <input v-model.trim="username" type="text" id="username" required />
        <label for="username">Username</label>
        <span class="red-text" v-if="usernameError">{{ usernameError }}</span>
      </div>

      <!-- Email（用于 Firebase 登录） -->
      <div class="input-field">
        <input v-model.trim="email" type="email" id="email" required autocomplete="email" />
        <label for="email">Email</label>
        <span class="red-text" v-if="emailError">{{ emailError }}</span>
      </div>

      <!-- Password（≥6位，Firebase 要求） -->
      <div class="input-field">
        <input v-model="password" type="password" id="password" required autocomplete="new-password" />
        <label for="password">Password</label>
        <span class="red-text" v-if="passwordError">{{ passwordError }}</span>
      </div>

      <!-- Role（你原来的角色选择，保存到 localStorage 以兼容现有守卫） -->
      <div class="input-field">
        <select v-model="role" class="browser-default" required>
          <option disabled value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <span class="red-text" v-if="roleError">{{ roleError }}</span>
      </div>

      <p class="red-text" role="alert" v-if="formError">{{ formError }}</p>

      <button class="btn waves-effect" type="submit" :disabled="!isFormValid || loading">
        <span v-if="!loading">Register</span>
        <span v-else>Creating…</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiAuth } from '../firebase' // 我们在前面已创建的 firebase 封装

const router = useRouter()

// 表单字段
const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('')

// 状态 & 错误
const loading = ref(false)
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const roleError = ref('')
const formError = ref('')

// 校验
function isValidEmail(v) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(v)
}
const isFormValid = computed(() =>
  username.value &&
  isValidEmail(email.value) &&
  password.value.length >= 6 &&
  role.value &&
  !loading.value
)

async function handleRegister () {
  // 清空错误
  usernameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  roleError.value = ''
  formError.value = ''

  // 前端校验
  if (!username.value) usernameError.value = 'Username is required.'
  if (!isValidEmail(email.value)) emailError.value = 'Invalid email format.'
  if (password.value.length < 6) passwordError.value = 'Password must be at least 6 characters.'
  if (!role.value) roleError.value = 'Role is required.'
  if (!isFormValid.value) return

  try {
    loading.value = true

    // ✅ 用 Firebase 创建账号（会自动登录）
    await apiAuth.registerEmail(email.value, password.value)

    // ✅ 兼容你现有的角色守卫：仍然把角色存到 localStorage
    localStorage.setItem('role', role.value)

    // （可选）保存一个简易的“资料”到 localStorage（不含密码）
    localStorage.setItem('profile', JSON.stringify({
      username: username.value,
      email: email.value,
      role: role.value,
      createdAt: new Date().toISOString(),
    }))

    // ⚠️ 不再把用户列表/密码写入 localStorage（安全风险），你的旧逻辑可以删掉
    // 例如：不要再使用 localStorage.setItem('users', ...)

    // 成功后跳首页（或跳 /login 也行）
    router.push('/')
  } catch (e) {
    // 根据 Firebase 错误码提示
    const code = e?.code || ''
    if (code.includes('email-already-in-use')) {
      emailError.value = 'This email is already registered.'
    } else if (code.includes('invalid-email')) {
      emailError.value = 'Invalid email.'
    } else if (code.includes('weak-password')) {
      passwordError.value = 'Password must be at least 6 characters.'
    } else {
      formError.value = 'Registration failed. ' + (e?.message || '')
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



