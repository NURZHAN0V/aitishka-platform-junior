<script setup>
import { computed } from 'vue'
import { BaseCard } from '@/core/components/ui'
import ExamCard from './ExamCard.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  isEmptyPeriod: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
})

defineEmits(['download', 'upload', 'view-work'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Нет экзаменов по выбранным фильтрам'
  return 'За этот период экзаменов нет'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) {
    return 'Сбросьте предмет или статус — или откройте «Весь период обучения».'
  }
  return 'Попробуйте соседний месяц или весь период обучения.'
})
</script>

<template>
  <section class="exams-list" aria-label="Список экзаменов">
    <BaseCard v-if="isEmptyPeriod || isEmptyFilter" padding="md" class="exams-list__empty">
      <p class="exams-list__empty-title">{{ emptyTitle }}</p>
      <p class="exams-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <div v-else class="exams-list__grid">
      <ExamCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @download="$emit('download', $event)"
        @upload="$emit('upload', $event)"
        @view-work="$emit('view-work', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.exams-list {
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-4;
  }
}

@media (max-width: 960px) {
  .exams-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>
