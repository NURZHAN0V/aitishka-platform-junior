<script setup>
import { computed } from 'vue'
import { BaseButton, BaseIcon, BaseTabs, BaseTooltip } from '@/core/components/ui'

const props = defineProps({
  view: {
    type: String,
    required: true,
  },
  periodLabel: {
    type: String,
    required: true,
  },
})

defineEmits(['update:view', 'prev-period', 'next-period', 'go-today'])

const viewTabs = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
]

const navLabels = computed(() => {
  if (props.view === 'day') {
    return { prev: 'Предыдущий день', next: 'Следующий день' }
  }
  if (props.view === 'month') {
    return { prev: 'Предыдущий месяц', next: 'Следующий месяц' }
  }
  return { prev: 'Предыдущая неделя', next: 'Следующая неделя' }
})
</script>

<template>
  <div class="schedule-toolbar">
    <div class="schedule-toolbar__row">
      <BaseTabs
        :model-value="view"
        :tabs="viewTabs"
        @update:model-value="$emit('update:view', $event)"
      />

      <div class="schedule-toolbar__period">
        <BaseTooltip :text="navLabels.prev" placement="bottom">
          <button
            type="button"
            class="schedule-toolbar__nav-btn"
            :aria-label="navLabels.prev"
            @click="$emit('prev-period')"
          >
            <BaseIcon name="chevron-left" :size="18" />
          </button>
        </BaseTooltip>

        <span class="schedule-toolbar__period-label">
          <BaseIcon name="calendar-03" :size="18" />
          {{ periodLabel }}
        </span>

        <BaseTooltip :text="navLabels.next" placement="bottom">
          <button
            type="button"
            class="schedule-toolbar__nav-btn"
            :aria-label="navLabels.next"
            @click="$emit('next-period')"
          >
            <BaseIcon name="chevron-right" :size="18" />
          </button>
        </BaseTooltip>

        <BaseButton variant="secondary" size="sm" @click="$emit('go-today')">
          Сегодня
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.schedule-toolbar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
}

.schedule-toolbar__period {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: $space-1;
  height: 36px;

  :deep(.base-tooltip) {
    display: inline-flex;
    align-items: center;
    height: 100%;
  }

  :deep(.base-button--sm) {
    height: 36px;
    min-height: 36px;
    box-sizing: border-box;
  }
}

.schedule-toolbar__period-label {
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

.schedule-toolbar__nav-btn {
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

@media (max-width: 720px) {
  .schedule-toolbar__period {
    flex-wrap: wrap;
    height: auto;
    row-gap: $space-2;
  }

  .schedule-toolbar__period-label {
    order: -1;
    width: 100%;
    height: 36px;
    justify-content: center;
  }
}
</style>
