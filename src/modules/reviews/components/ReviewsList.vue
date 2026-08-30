<script setup>
import { BaseCard } from '@/core/components/ui'
import ReviewCard from './ReviewCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
})
</script>

<template>
  <section class="reviews-list" aria-label="Список отзывов">
    <BaseCard v-if="isEmpty" padding="md" class="reviews-list__empty">
      <p class="reviews-list__empty-title">Отзывов пока нет</p>
      <p class="reviews-list__empty-hint">
        Когда преподаватель напишет отзыв, он появится здесь.
      </p>
    </BaseCard>

    <div v-else class="reviews-list__feed">
      <ReviewCard v-for="item in items" :key="item.id" :review="item" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.reviews-list {
  &__empty {
    text-align: center;
  }

  &__empty-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__empty-hint {
    margin: $space-2 0 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__feed {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
}
</style>
