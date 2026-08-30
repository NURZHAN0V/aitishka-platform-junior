<script setup>
import { BaseChip, BaseIcon, BaseTabs, BaseTooltip } from '@/core/components/ui'
import { PERIOD_TABS } from '../constants/rating.js'

defineProps({
  period: { type: String, required: true },
  periodLabel: { type: String, required: true },
  isCurrentPeriod: { type: Boolean, default: true },
  formulaTooltip: { type: String, required: true },
})

defineEmits(['update:period'])
</script>

<template>
  <div class="rating-toolbar">
    <div class="rating-toolbar__title-row">
      <h1 class="rating-toolbar__title">Рейтинг</h1>
      <BaseTooltip :text="formulaTooltip" placement="bottom">
        <button type="button" class="rating-toolbar__hint" aria-label="Как считается рейтинг">
          <BaseIcon name="info-circle" :size="18" />
        </button>
      </BaseTooltip>
    </div>

    <div class="rating-toolbar__controls">
      <BaseTabs
        :model-value="period"
        :tabs="PERIOD_TABS"
        @update:model-value="$emit('update:period', $event)"
      />

      <p class="rating-toolbar__period">
        <BaseIcon name="calendar-03" :size="18" />
        <span>{{ periodLabel }}</span>
        <BaseChip v-if="!isCurrentPeriod" variant="pending" size="sm">Архив</BaseChip>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;

  &__title-row {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__title {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__hint {
    display: inline-flex;
    padding: 0;
    border: none;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;

    &:hover {
      color: $color-primary;
    }

    &:focus-visible {
      @include focus-ring;
      border-radius: $radius-sm;
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-3 $space-4;
  }

  &__period {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
  }
}

@media (max-width: 720px) {
  .rating-toolbar {
    flex-direction: column;
    align-items: stretch;

    &__title {
      font-size: $font-size-xl;
    }

    &__controls {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
