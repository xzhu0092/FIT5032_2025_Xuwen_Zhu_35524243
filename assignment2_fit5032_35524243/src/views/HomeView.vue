<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)

// 检查用户是否已登录
if (localStorage.getItem('isLoggedIn') === 'true') {
  isLoggedIn.value = true
}

// 退出登录功能
function handleLogout() {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('role')
  alert('Logged out successfully!')
  window.location.href = '/login' // 跳转到登录页面
}
</script>

<template>
  <div class="container">
    <!-- Header Row: Title + Buttons -->
    <div class="header-row">
      <div class="left-space"></div>
      <h4 class="title">Welcome to MindConnect</h4>

      <div class="button-group">
        <a v-if="!isLoggedIn" class="btn blue" href="/register" style="margin-right: 10px;">Register Now</a>
        <a v-if="!isLoggedIn" class="btn blue" href="/login">Login</a>
        <button v-if="isLoggedIn" class="btn red" @click="handleLogout">Log Out</button>
      </div>
    </div>

    <!-- Card Section: For Students, For Professionals, For Seniors -->
    <div class="row">
      <!-- For Students Card -->
      <div class="col s12 m6 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Students</span>
            <p>Anonymous self-assessment, mental health articles, peer discussions.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Learn More</a>
          </div>
        </div>
      </div>

      <!-- For Professionals Card -->
      <div class="col s12 m6 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Professionals</span>
            <p>Stress management, mood tracking, professional counseling.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Explore</a>
          </div>
        </div>
      </div>

      <!-- For Seniors Card -->
      <div class="col s12 m12 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Seniors</span>
            <p>Large text, voice assistance, community support for elderly.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.left-space {
  width: 120px;
}

.title {
  flex: 1;
  text-align: center;
  margin: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: auto;
}

.button-group a, .button-group button {
  margin-right: 10px;
}
</style>




