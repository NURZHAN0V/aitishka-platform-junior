<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useRating } from '@/modules/rating/composables/useRating.js'
import RatingTable from '@/modules/rating/components/RatingTable.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const { rankGroups } = useRating()
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Рейтинг' }]"
    active-route="rating"
  >
    <div class="rating-view">
      <RatingTable :groups="rankGroups" />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.rating-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .rating-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
