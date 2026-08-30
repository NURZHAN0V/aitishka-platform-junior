<script setup>
import { computed } from 'vue'
import { BaseButton, BaseCard } from '@/core/components/ui'
import HomeworkCard from './HomeworkCard.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
})

defineEmits(['download', 'upload', 'reupload', 'load-more'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Нет заданий по выбранным фильтрам'
  return 'Домашних заданий пока нет'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) {
    return 'Смените статус или предмет.'
  }
  return 'Когда преподаватель выдаст задание, оно появится здесь.'
})
</script>

<template>
  <section class="homework-list" aria-label="Список домашних заданий">
    <BaseCard v-if="isEmpty || isEmptyFilter" padding="md" class="homework-list__empty">
      <p class="homework-list__empty-title">{{ emptyTitle }}</p>
      <p class="homework-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <template v-else>
      <div class="homework-list__grid">
        <HomeworkCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @download="$emit('download', $event)"
          @upload="$emit('upload', $event)"
          @reupload="$emit('reupload', $event)"
        />
      </div>

      <div v-if="hasMore" class="homework-list__more">
        <BaseButton variant="secondary" @click="$emit('load-more')">
          Показать ещё
        </BaseButton>
      </div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.homework-list {
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

  &__more {
    display: flex;
    justify-content: center;
    margin-top: $space-5;
  }
}

@media (max-width: 960px) {
  .homework-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>
