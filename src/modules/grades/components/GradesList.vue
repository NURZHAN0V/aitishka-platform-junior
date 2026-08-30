<script setup>
import { BaseCard } from '@/core/components/ui'
import GradeCard from './GradeCard.vue'

defineProps({
  grades: { type: Array, default: () => [] },
  expandedGradeId: { type: String, default: null },
  isEmptyPeriod: { type: Boolean, default: false },
})

defineEmits(['toggle-grade'])
</script>

<template>
  <section class="grades-list" aria-label="Список оценок">
    <BaseCard v-if="isEmptyPeriod" padding="md" class="grades-list__empty">
      <p class="grades-list__empty-title">За этот период оценок нет</p>
      <p class="grades-list__empty-hint">Попробуйте соседний день, неделю или месяц.</p>
    </BaseCard>

    <div v-else class="grades-list__cards">
      <GradeCard
        v-for="grade in grades"
        :key="grade.id"
        :grade="grade"
        :expanded="expandedGradeId === grade.id"
        @toggle="$emit('toggle-grade', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.grades-list {
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

  &__cards {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
}
</style>
