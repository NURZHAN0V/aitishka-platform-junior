<script setup>
import { BaseCard, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { COINS_HINT } from '../constants/rating.js'

defineProps({
  rank: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  gradesShare: { type: Number, default: 0 },
  homeworkShare: { type: Number, default: 0 },
  homeworkPercent: { type: Number, default: 0 },
})
</script>

<template>
  <BaseCard padding="md" class="rating-motivation">
    <div class="rating-motivation__row">
      <BaseIcon name="coin" :size="28" class="rating-motivation__icon" />
      <div class="rating-motivation__copy">
        <p class="rating-motivation__title">Монетки и рейтинг</p>
        <p class="rating-motivation__text">{{ COINS_HINT }}</p>
      </div>
      <BaseTooltip
        text="Рейтинг считает средний балл и долю ДЗ вовремя. Монетки — отдельная мотивация"
        placement="top"
      >
        <button type="button" class="rating-motivation__hint" aria-label="Про монетки и рейтинг">
          <BaseIcon name="info-circle" :size="16" />
        </button>
      </BaseTooltip>
    </div>
    <p class="rating-motivation__meta">
      Сейчас {{ rank }} место из {{ total }}
      <span aria-hidden="true">·</span>
      вклад оценок {{ gradesShare }} / вклад ДЗ {{ homeworkShare }}
      <span aria-hidden="true">·</span>
      ДЗ вовремя {{ homeworkPercent }}%
    </p>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-motivation {
  &__row {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: $color-coin-dark;
  }

  &__copy {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__text {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__hint {
    display: inline-flex;
    flex-shrink: 0;
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

  &__meta {
    margin: $space-3 0 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
    display: flex;
    flex-wrap: wrap;
    gap: $space-1 $space-2;
  }
}
</style>
