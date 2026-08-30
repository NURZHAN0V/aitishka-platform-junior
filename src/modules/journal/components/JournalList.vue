<script setup>
import { computed } from 'vue'
import { BaseButton, BaseCard } from '@/core/components/ui'
import JournalEventCard from './JournalEventCard.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
})

defineEmits(['load-more'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Нет событий этого типа'
  return 'В журнале пока пусто'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) {
    return 'Выберите другой тип или «Все».'
  }
  return 'Здесь появятся занятия, оценки, монетки и другие события.'
})
</script>

<template>
  <section class="journal-list" aria-label="Лента журнала">
    <BaseCard v-if="isEmpty || isEmptyFilter" padding="md" class="journal-list__empty">
      <p class="journal-list__empty-title">{{ emptyTitle }}</p>
      <p class="journal-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <template v-else>
      <div class="journal-list__feed">
        <JournalEventCard v-for="item in items" :key="item.id" :item="item" />
      </div>

      <div v-if="hasMore" class="journal-list__more">
        <BaseButton variant="secondary" @click="$emit('load-more')">
          Показать ещё
        </BaseButton>
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.journal-list {
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

  &__more {
    display: flex;
    justify-content: center;
    margin-top: $space-5;
  }
}
</style>
