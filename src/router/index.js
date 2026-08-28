import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/ui-kit',
      name: 'ui-kit',
      component: () => import('@/views/UiShowcaseView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('@/views/MarketView.vue'),
    },
  ],
})

export default router
