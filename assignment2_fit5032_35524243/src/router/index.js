// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
   { path: '/register', name: 'register', component: RegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
