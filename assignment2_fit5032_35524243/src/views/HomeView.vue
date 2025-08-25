<script setup>
import { ref } from 'vue'
import RatingComponent from '../components/RatingComponent.vue' // 导入评分组件

const isLoggedIn = ref(false)

// 检查用户是否已登录
if (localStorage.getItem('isLoggedIn') === 'true') {
  isLoggedIn.value = true
}

// 退出登录功能
function handleLogout() {
  // 只清除登录相关的数据，不清除用户评分数据
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('role')

  alert('Logged out successfully!')
  window.location.href = '/login' // 跳转到登录页面
}
</script>

<template>
  <div class="container home">

    <!-- 顶部工具栏：左侧品牌，右侧登录/注册或登出 -->
    <header class="topbar" role="banner">
      <div class="brand">MindConnect</div>

      <nav class="auth-actions" aria-label="authentication">
        <router-link
          v-if="!isLoggedIn"
          class="btn-flat btn-small"
          to="/register"
          aria-label="Register Now"
        >Register Now</router-link>

        <router-link
          v-if="!isLoggedIn"
          class="btn-flat btn-small"
          to="/login"
          aria-label="Login"
        >Login</router-link>

        <button
          v-if="isLoggedIn"
          class="btn red darken-1 btn-small"
          @click="handleLogout"
          aria-label="Log out"
        >Log Out</button>
      </nav>
    </header>

    <!-- 居中标题 -->
    <section class="hero center-align">
      <h1 class="hero-title">Welcome to MindConnect</h1>
      <p class="hero-subtitle">Support for individuals facing mental health challenges</p>
    </section>

    <!-- 三张等高卡片 -->
    <section class="cards" aria-label="audience sections">
      <div class="row no-margin">
        <div class="col s12 m6 l4 card-col">
          <div class="card hoverable card-fill">
            <div class="card-content">
              <span class="card-title">For Students</span>
              <p>Anonymous self‑assessment, mental health articles, peer discussions.</p>
              <div class="rating-wrap">
                <RatingComponent sectionName="For Students" />
              </div>
            </div>
            <div class="card-action"><a class="link" href="#" aria-label="Learn more for students">Learn More</a></div>
          </div>
        </div>

        <div class="col s12 m6 l4 card-col">
          <div class="card hoverable card-fill">
            <div class="card-content">
              <span class="card-title">For Professionals</span>
              <p>Stress management, mood tracking, professional counseling.</p>
              <div class="rating-wrap">
                <RatingComponent sectionName="For Professionals" />
              </div>
            </div>
            <div class="card-action"><a class="link" href="#" aria-label="Explore for professionals">Explore</a></div>
          </div>
        </div>

        <div class="col s12 m12 l4 card-col">
          <div class="card hoverable card-fill">
            <div class="card-content">
              <span class="card-title">For Seniors</span>
              <p>Large text, voice assistance, community support for elderly.</p>
              <div class="rating-wrap">
                <RatingComponent sectionName="For Seniors" />
              </div>
            </div>
            <div class="card-action"><a class="link" href="#" aria-label="Get started for seniors">Get Started</a></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能按钮工具条（自适应换行） -->
    <section class="toolbelt" aria-label="quick actions">
      <router-link to="/email" class="btn teal lighten-1 tool-btn">Send Email</router-link>
      <router-link to="/tables" class="btn teal lighten-1 tool-btn">Data Tables</router-link>
      <router-link to="/functions" class="btn teal lighten-1 tool-btn">Cloud Functions Demo</router-link>
      <router-link to="/map" class="btn teal lighten-1 tool-btn">Map</router-link>
      <router-link to="/admin" class="btn grey darken-1 tool-btn">Go to Admin</router-link>
    </section>

  </div>
</template>

<style scoped>
/* 总体间距 */
.home { padding-top: 8px; padding-bottom: 40px; }

/* 顶部工具栏 */
.topbar{
  display:flex; align-items:center; justify-content:space-between;
  gap:16px; padding:8px 0;
}
.brand{
  font-size:20px; font-weight:700; letter-spacing:.3px;
}
.auth-actions { display:flex; gap:10px; flex-wrap:wrap; }
.btn-flat{
  border-radius:999px; padding:0 14px;
  border:1px solid rgba(0,0,0,.2);
}

/* 英雄标题 */
.hero{ margin:12px 0 24px; }
.hero-title{ margin:0 0 6px; font-weight:800; letter-spacing:.4px; }
.hero-subtitle{ margin:0; color:#607d8b; }

/* 卡片：等高布局 */
.no-margin{ margin:0; }
.card-col{ display:flex; }
.card-fill{
  display:flex; flex-direction:column; width:100%;
  border-radius:14px; overflow:hidden;
}
.card-content{ flex:1 1 auto; }
.card-action{ border-top:0; padding-top:0; }
.link{ color:#1976d2; }
.rating-wrap{ margin-top:8px; }

/* 工具条按钮：居中、可换行、间距统一 */
.toolbelt{
  display:flex; flex-wrap:wrap; justify-content:center; gap:12px;
  margin-top:10px;
}
.tool-btn{
  border-radius:10px; padding:0 16px; font-weight:600;
}

/* 小屏优化 */
@media (max-width: 600px){
  .hero-title{ font-size:28px; }
  .brand{ font-size:18px; }
}
</style>












