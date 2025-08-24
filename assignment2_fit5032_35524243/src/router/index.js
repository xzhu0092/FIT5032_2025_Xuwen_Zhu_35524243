// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import EmailView from '../views/EmailView.vue'
import TablesView from '../views/TablesView.vue'
// ★ 新增：引入我们刚做好的 firebase 工具
import { auth, waitForAuthInit } from '../firebase'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/email', name: 'email', component: EmailView, meta: { requiresAuth: true } }, // ★ 新增：任何登录用户可访问
  { path: '/tables', name: 'tables', component: TablesView, meta: { requiresAuth: true } }, 
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

// ★ 用全局守卫替换你原来的 beforeEnter
router.beforeEach(async (to, _from, next) => {
  // 等 Firebase 恢复会话（刷新页面时很重要）
  const user = await waitForAuthInit()
  // 角色仍用你现有的 localStorage，后面再换 Firestore 也行
  const role = localStorage.getItem('role') || 'member'

  if (to.meta?.requiresAuth && !user) return next('/login')
  if (to.meta?.requiresAdmin && role !== 'admin') {
    alert('Access denied: Admins only')
    return next('/')
  }
  next()
})




export default router

