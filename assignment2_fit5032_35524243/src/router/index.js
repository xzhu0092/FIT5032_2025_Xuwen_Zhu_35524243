// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
   { path: '/register', name: 'register', component: RegisterView },
     { path: '/login', name: 'login', component: LoginView } ,
     {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const role = localStorage.getItem('role')
      if (role === 'admin') {
        next()
      } else {
        alert('Access denied: Admins only')
        next('/') // 返回主页
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
