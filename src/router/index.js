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
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/ScheduleView.vue'),
    },
    {
      path: '/grades',
      name: 'grades',
      component: () => import('@/views/GradesView.vue'),
    },
    {
      path: '/homework',
      name: 'homework',
      component: () => import('@/views/HomeworkView.vue'),
    },
    {
      path: '/exams',
      name: 'exams',
      component: () => import('@/views/ExamsView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('@/views/MarketView.vue'),
    },
  ],
})

export default router
