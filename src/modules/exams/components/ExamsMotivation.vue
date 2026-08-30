<script setup>
import { BaseCard, BaseIcon, BaseTooltip } from '@/core/components/ui'

defineProps({
  motivation: { type: Object, required: true },
})
</script>

<template>
  <BaseCard padding="md" class="exams-motivation">
    <div class="exams-motivation__row">
      <BaseIcon name="chart-bar" :size="28" class="exams-motivation__icon" />
      <div class="exams-motivation__copy">
        <p class="exams-motivation__title">Экзамен и рейтинг месяца</p>
        <p class="exams-motivation__text">
          Оценка
          <strong>2–5</strong>
          входит в средний балл. Рейтинг месяца:
          <strong>{{ motivation.ratingWeightPercent }}% средний балл</strong>
          и столько же — доля ДЗ вовремя. За экзамен монетки не дают, но балл двигает место в учёбе.
        </p>
      </div>
      <BaseTooltip
        text="Монетки начисляют за ДЗ вовремя и пятёрки по ДЗ, не за сам экзамен"
        placement="top"
      >
        <button type="button" class="exams-motivation__hint" aria-label="Про рейтинг и монетки">
          <BaseIcon name="info-circle" :size="16" />
        </button>
      </BaseTooltip>
    </div>
    <p class="exams-motivation__meta">
      Средний балл за экзамены: {{ motivation.averageLabel }}
      <span aria-hidden="true">·</span>
      сдано {{ motivation.submittedCount }} из {{ motivation.totalCount }}
      <span aria-hidden="true">·</span>
      сейчас {{ motivation.rank }} место из {{ motivation.rankTotal }}
    </p>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exams-motivation {
  &__row {
    display: flex;
    align-items: flex-start;
    gap: $space-3;
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: $color-primary;
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
