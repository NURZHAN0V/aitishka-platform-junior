<script setup>
import { computed } from 'vue'
import { BaseButton, BaseCard } from '@/core/components/ui'
import CoinsHistoryItem from './CoinsHistoryItem.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
})

defineEmits(['load-more'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Пока нет таких операций'
  return 'История пока пустая'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) {
    return 'Выбери «Все» или другой фильтр.'
  }
  return 'Ходи на занятия и сдавай ДЗ — монетки появятся здесь.'
})
</script>

<template>
  <section class="coins-history-list" aria-label="История монеток">
    <BaseCard v-if="isEmpty || isEmptyFilter" padding="md" class="coins-history-list__empty">
      <p class="coins-history-list__empty-title">{{ emptyTitle }}</p>
      <p class="coins-history-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <template v-else>
      <div class="coins-history-list__feed">
        <CoinsHistoryItem v-for="item in items" :key="item.id" :item="item" />
      </div>

      <div v-if="hasMore" class="coins-history-list__more">
        <BaseButton variant="secondary" @click="$emit('load-more')">
          Показать ещё
        </BaseButton>
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.coins-history-list {
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
