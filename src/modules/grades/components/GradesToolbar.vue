<script setup>
import { computed } from 'vue'
import {
  BaseButton,
  BaseIcon,
  BaseSelect,
  BaseTabs,
  BaseTooltip,
} from '@/core/components/ui'
import {
  PERIOD_TABS,
  SUBJECT_OPTIONS,
  VIEW_TABS,
  WORK_TYPE_OPTIONS,
} from '../constants/grades.js'

const props = defineProps({
  period: { type: String, required: true },
  viewMode: { type: String, required: true },
  periodLabel: { type: String, required: true },
  subjectFilter: { type: String, required: true },
  workTypeFilter: { type: String, required: true },
})

const emit = defineEmits([
  'update:period',
  'update:viewMode',
  'update:subjectFilter',
  'update:workTypeFilter',
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
      <div class="grades-toolbar__period-block">
        <BaseTabs
          :model-value="period"
          :tabs="PERIOD_TABS"
          @update:model-value="emit('update:period', $event)"
        />

        <div class="grades-toolbar__period">
          <BaseTooltip :text="navLabels.prev" placement="bottom">
            <button
              type="button"
              class="grades-toolbar__nav-btn"
              :aria-label="navLabels.prev"
              @click="emit('prev-period')"
            >
              <BaseIcon name="chevron-left" :size="18" />
            </button>
          </BaseTooltip>

          <span class="grades-toolbar__period-label">
            <BaseIcon name="calendar-03" :size="18" />
            {{ periodLabel }}
          </span>

          <BaseTooltip :text="navLabels.next" placement="bottom">
            <button
              type="button"
              class="grades-toolbar__nav-btn"
              :aria-label="navLabels.next"
              @click="emit('next-period')"
            >
              <BaseIcon name="chevron-right" :size="18" />
            </button>
          </BaseTooltip>

          <BaseButton variant="secondary" size="sm" @click="emit('go-current')">
            {{ navLabels.current }}
          </BaseButton>
        </div>
      </div>

      <div class="grades-toolbar__view">
        <BaseTabs
          :model-value="viewMode"
          :tabs="VIEW_TABS"
          size="sm"
          @update:model-value="emit('update:viewMode', $event)"
        />
      </div>
    </div>

    <div class="grades-toolbar__filters">
      <div class="grades-toolbar__filter">
        <div class="grades-toolbar__filter-label">Предмет</div>
        <BaseSelect
          :model-value="subjectFilter"
          :options="SUBJECT_OPTIONS"
          id="grades-subject-filter"
          @update:model-value="emit('update:subjectFilter', $event)"
        />
      </div>
      <div class="grades-toolbar__filter">
        <div class="grades-toolbar__filter-label">Тип работы</div>
        <BaseSelect
          :model-value="workTypeFilter"
          :options="WORK_TYPE_OPTIONS"
          id="grades-work-type-filter"
          @update:model-value="emit('update:workTypeFilter', $event)"
        />
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

  &__period-block {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-4;
  }

  &__period {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: $space-1;
    height: 36px;

    :deep(.base-tooltip) {
      display: inline-flex;
    }
  }

  &__nav-btn {
    @include flex-center;
    width: 36px;
    height: 36px;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    cursor: pointer;
    transition: border-color $transition-base, color $transition-base, background-color $transition-base;

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
    gap: $space-2;
    min-width: 7.5rem;
    padding: 0 $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__view {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
  }

  &__filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 220px));
    gap: $space-4;
  }

  &__filter {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    min-width: 0;
  }

  &__filter-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }
}

@media (max-width: 720px) {
  .grades-toolbar__filters {
    grid-template-columns: 1fr;
  }

  .grades-toolbar__period {
    width: 100%;
    flex-wrap: wrap;
    height: auto;
  }
}
</style>
