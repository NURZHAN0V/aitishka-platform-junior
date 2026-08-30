<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useReviews } from '@/modules/reviews/composables/useReviews.js'
import ReviewsList from '@/modules/reviews/components/ReviewsList.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const { items, isEmpty } = useReviews()
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Мои отзывы' }]"
    active-route="reviews"
  >
    <div class="reviews-view">
      <ReviewsList :items="items" :is-empty="isEmpty" />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.reviews-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .reviews-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
