<script setup>
import { computed } from 'vue'
import { BaseButton, BaseIcon, BaseTabs } from '@/core/components/ui'
import { PERIOD_TABS } from '../constants/grades.js'

const props = defineProps({
  period: { type: String, required: true },
  periodLabel: { type: String, required: true },
})

const emit = defineEmits([
  'update:period',
  'prev-period',
  'next-period',
  'go-current',
])

const navLabels = computed(() => {
  if (props.period === 'day') {
    return { prev: 'Предыдущий день', next: 'Следующий день', current: 'Сегодня' }
  }
  if (props.period === 'week') {
    return { prev: 'Предыдущая неделя', next: 'Следующая неделя', current: 'Текущая неделя' }
  }
  return { prev: 'Предыдущий месяц', next: 'Следующий месяц', current: 'Текущий месяц' }
})
</script>

<template>
  <div class="grades-toolbar">
    <div class="grades-toolbar__row">
      <BaseTabs
        :model-value="period"
        :tabs="PERIOD_TABS"
        @update:model-value="emit('update:period', $event)"
      />

      <div class="grades-toolbar__period">
        <button
          type="button"
          class="grades-toolbar__nav-btn"
          :aria-label="navLabels.prev"
          @click="emit('prev-period')"
        >
          <BaseIcon name="chevron-left" :size="18" />
        </button>

        <span class="grades-toolbar__period-label">
          <BaseIcon name="calendar-03" :size="18" />
          {{ periodLabel }}
        </span>

        <button
          type="button"
          class="grades-toolbar__nav-btn"
          :aria-label="navLabels.next"
          @click="emit('next-period')"
        >
          <BaseIcon name="chevron-right" :size="18" />
        </button>

        <BaseButton variant="secondary" size="sm" @click="emit('go-current')">
          {{ navLabels.current }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.grades-toolbar {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
  }

  &__period {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: $space-1;
    height: 36px;

    :deep(.base-button--sm) {
      height: 36px;
      min-height: 36px;
      box-sizing: border-box;
    }
  }

  &__nav-btn {
    @include flex-center;

    box-sizing: border-box;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    cursor: pointer;
    @include press-scale(0.94);
    transition: transform $transition-press, border-color $transition-base, color $transition-base,
      background-color $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      color: $color-primary;
      background-color: $color-primary-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__period-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    height: 100%;
    padding-inline: $space-1;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    line-height: 1;
    color: $color-text-primary;
    white-space: nowrap;

    :deep(.base-icon) {
      display: block;
      flex-shrink: 0;
      line-height: 0;
    }
  }
}

@media (max-width: 720px) {
  .grades-toolbar__period {
    width: 100%;
    flex-wrap: wrap;
    height: auto;
    row-gap: $space-2;
  }

  .grades-toolbar__period-label {
    order: -1;
    width: 100%;
    height: 36px;
    justify-content: center;
  }
}
</style>
