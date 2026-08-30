<script setup>
import { computed } from 'vue'
import {
  BaseButton,
  BaseChip,
  BaseIcon,
  BaseSelect,
  BaseTabs,
  BaseTooltip,
} from '@/core/components/ui'
import { PERIOD_TABS, SUBJECT_OPTIONS } from '../constants/exams.js'

const props = defineProps({
  period: { type: String, required: true },
  periodLabel: { type: String, required: true },
  subjectFilter: { type: String, required: true },
  statusFilter: { type: String, required: true },
  statusTabs: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:period',
  'update:subjectFilter',
  'update:statusFilter',
  'prev-period',
  'next-period',
  'go-current',
])

const showMonthNav = computed(() => props.period === 'month')
</script>

<template>
  <div class="exams-toolbar">
    <div class="exams-toolbar__row">
      <BaseTabs
        :model-value="period"
        :tabs="PERIOD_TABS"
        @update:model-value="emit('update:period', $event)"
      />

      <div v-if="showMonthNav" class="exams-toolbar__period">
        <div class="exams-toolbar__nav">
          <button
            type="button"
            class="exams-toolbar__nav-btn"
            aria-label="Предыдущий месяц"
            @click="emit('prev-period')"
          >
            <BaseIcon name="chevron-left" :size="18" />
          </button>

          <span class="exams-toolbar__period-label">
            <BaseIcon name="calendar-03" :size="18" />
            {{ periodLabel }}
          </span>

          <button
            type="button"
            class="exams-toolbar__nav-btn"
            aria-label="Следующий месяц"
            @click="emit('next-period')"
          >
            <BaseIcon name="chevron-right" :size="18" />
          </button>
        </div>

        <BaseButton variant="secondary" size="sm" @click="emit('go-current')">
          Текущий месяц
        </BaseButton>
      </div>
    </div>

    <div class="exams-toolbar__filters" aria-label="Экзамены">
      <div class="exams-toolbar__statuses" role="tablist" aria-label="Статусы экзаменов">
        <BaseTooltip v-for="tab in statusTabs" :key="tab.id" :text="tab.tooltip" placement="top">
          <BaseChip
            mode="filter"
            toned
            :variant="tab.chip"
            :active="statusFilter === tab.id"
            :count="tab.count"
            @click="emit('update:statusFilter', tab.id)"
          >
            {{ tab.label }}
          </BaseChip>
        </BaseTooltip>
      </div>

      <div class="exams-toolbar__subject">
        <BaseSelect
          :model-value="subjectFilter"
          :options="SUBJECT_OPTIONS"
          id="exams-subject-filter"
          aria-label="Предмет"
          @update:model-value="emit('update:subjectFilter', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exams-toolbar {
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
    gap: $space-3;
    height: 36px;
    margin-left: auto;
  }

  &__nav {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    height: 100%;
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

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-3 $space-4;
  }

  &__statuses {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;

    :deep(.base-chip) {
      flex-shrink: 0;
    }
  }

  &__subject {
    flex-shrink: 0;
    width: min(220px, 100%);
    margin-left: auto;
  }
}

@media (max-width: 720px) {
  .exams-toolbar__period {
    width: 100%;
    flex-wrap: wrap;
    height: auto;
    margin-left: 0;
  }

  .exams-toolbar__statuses {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: $space-1;
    margin-inline: -#{$space-1};
    padding-inline: $space-1;
    max-width: 100%;
  }

  .exams-toolbar__subject {
    width: 100%;
    margin-left: 0;
  }
}
</style>
