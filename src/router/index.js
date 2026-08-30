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
      path: '/rating',
      name: 'rating',
      component: () => import('@/views/RatingView.vue'),
    },
    {
      path: '/journal',
      name: 'journal',
      component: () => import('@/views/JournalView.vue'),
    },
    {
      path: '/coins',
      name: 'coins',
      component: () => import('@/views/CoinsView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('@/views/MarketView.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue'),
    },
    {
      path: '/payments',
      name: 'payments',
      component: () => import('@/views/PaymentsView.vue'),
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('@/views/ReviewsView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('@/views/HelpView.vue'),
    },
  ],
})


export default router
