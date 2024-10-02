import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('../views/CreateVue.vue')
    },
    {
      path: '/create-product',
      name: 'create-product',
      component: () => import('../views/CreateProduct.vue')
    },
    {
      path: '/update/:id',
      name: 'update',
      component: () => import('../views/UpdateView.vue')
    },
    {
      path: '/update-product/:id',
      name: 'update-product',
      component: () => import('../views/UpdateProduct.vue')
    },
    {
      path: '/home-product',
      name: 'home-product',
      component: () => import('../views/HomeProduct.vue')
    },
    {
      path: '/home-order',
      name: 'home-order',
      component: () => import('../views/HomeOrder.vue')
    },
    {
      path: '/create-order',
      name: 'create-order',
      component: () => import('../views/CreateOrder.vue')
    },
    {
      path: '/update-order',
      name: 'update-order',
      component: () => import('../views/UpdateOrder.vue')
    },
  ]
})

export default router
