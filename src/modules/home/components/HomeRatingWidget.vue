<script setup>
import { computed } from 'vue'
import { BaseIcon } from '@/core/components/ui'
import { WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { RATING_WIDGET_MOCK } from '../constants/widgets.js'

const props = defineProps({
  rank: { type: Number, default: RATING_WIDGET_MOCK.rank },
  total: { type: Number, default: RATING_WIDGET_MOCK.total },
  points: { type: Number, default: RATING_WIDGET_MOCK.points },
  periodLabel: { type: String, default: RATING_WIDGET_MOCK.periodLabel },
  gradesPercent: { type: Number, default: RATING_WIDGET_MOCK.gradesPercent },
  homeworkPercent: { type: Number, default: RATING_WIDGET_MOCK.homeworkPercent },
  leaderboard: { type: Array, default: () => RATING_WIDGET_MOCK.leaderboard },
  leaderboardLimit: { type: Number, default: RATING_WIDGET_MOCK.leaderboardLimit },
  linkHref: { type: String, default: RATING_WIDGET_MOCK.linkHref },
})

const progressItems = computed(() => [
  { label: 'Оценки', percent: props.gradesPercent },
  { label: 'ДЗ вовремя', percent: props.homeworkPercent },
])

const visibleLeaderboard = computed(() =>
  props.leaderboard.slice(0, props.leaderboardLimit),
)
</script>

<template>
  <article class="home-rating-widget">
    <header class="home-rating-widget__header">
      <BaseIcon
        :name="WIDGET_ILLUSTRATIONS.trophy"
        type="avif"
        :size="32"
        class="home-rating-widget__icon"
        label=""
      />
      <h2 class="home-rating-widget__title">Мой рейтинг</h2>
    </header>

    <div class="home-rating-widget__body">
      <section class="home-rating-widget__summary">
        <div class="home-rating-widget__summary-top">
          <p class="home-rating-widget__rank">
            <span class="home-rating-widget__rank-value">{{ rank }}</span>
            <span class="home-rating-widget__rank-text"> место из {{ total }}</span>
          </p>
          <p class="home-rating-widget__points">
            <span class="home-rating-widget__points-value">{{ points }}</span>
            <span class="home-rating-widget__points-text"> баллов</span>
          </p>
          <p class="home-rating-widget__period">{{ periodLabel }}</p>
        </div>

        <div class="home-rating-widget__progress-list">
          <div
            v-for="item in progressItems"
            :key="item.label"
            class="home-rating-widget__progress"
          >
            <p class="home-rating-widget__progress-label">{{ item.label }}</p>
            <div class="home-rating-widget__progress-row">
              <div class="home-rating-widget__progress-track" aria-hidden="true">
                <div
                  class="home-rating-widget__progress-fill"
                  :style="{ width: `${item.percent}%` }"
                />
              </div>
              <span class="home-rating-widget__progress-percent">{{ item.percent }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="home-rating-widget__table-panel">
        <table class="home-rating-widget__table">
          <thead>
            <tr>
              <th>Место</th>
              <th>Имя</th>
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleLeaderboard"
              :key="row.rank"
              :class="{ 'home-rating-widget__table-row--current': row.isCurrent }"
            >
              <td>{{ row.rank }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.points }}</td>
            </tr>
          </tbody>
        </table>
        <a :href="linkHref" class="home-rating-widget__link">Вся таблица →</a>
      </section>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-rating-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $space-4;
  border-radius: $radius-2xl;
  background: linear-gradient(145deg, #7c3aed 0%, #6366f1 55%, #8b5cf6 100%);
  color: $color-text-inverse;
  box-shadow: $shadow-md;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-2;
    @include no-select;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
    gap: $space-3;
    flex: 1;
    align-items: stretch;
  }

  &__summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-width: 0;
  }

  &__summary-top {
    display: flex;
    flex-direction: column;
  }

  &__rank {
    margin: 0;
    line-height: 1;
  }

  &__rank-value {
    font-size: 2.125rem;
    font-weight: $font-weight-bold;
    letter-spacing: -0.02em;
  }

  &__rank-text {
    font-size: $font-size-base;
    font-weight: $font-weight-normal;
    opacity: 0.95;
  }

  &__points {
    margin: $space-2 0 0;
    line-height: 1.1;
  }

  &__points-value {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    letter-spacing: -0.01em;
  }

  &__points-text {
    font-size: $font-size-base;
    font-weight: $font-weight-normal;
    opacity: 0.92;
  }

  &__period {
    margin: $space-3 0 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-normal;
    line-height: $line-height-tight;
    opacity: 0.72;
  }

  &__progress-list {
    margin-top: $space-4;
  }

  &__progress {
    & + & {
      margin-top: $space-2;
    }
  }

  &__progress-label {
    margin: 0 0 $space-1;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    line-height: $line-height-tight;
    opacity: 0.95;
  }

  &__progress-row {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__progress-percent {
    flex-shrink: 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-normal;
    line-height: 1;
    opacity: 0.9;
  }

  &__progress-track {
    flex: 1;
    min-width: 0;
    height: 8px;
    overflow: hidden;
    border-radius: $radius-chip;
    background-color: rgba(255, 255, 255, 0.92);
  }

  &__progress-fill {
    height: 100%;
    border-radius: inherit;
    background-color: #3730a3;
  }

  &__table-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: $space-2 $space-3 $space-3;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-primary;
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 2px;
    table-layout: fixed;
    font-size: 0.6875rem;
    line-height: 1.15;

    th {
      padding: 0 $space-1 4px;
      font-weight: $font-weight-medium;
      text-align: left;
      color: $color-text-muted;
      border-bottom: 1px solid $color-border-light;

      &:first-child {
        width: 28%;
      }

      &:last-child {
        width: 24%;
        text-align: right;
      }
    }

    td {
      padding: 5px $space-2;
      color: $color-text-primary;
      @include truncate;

      &:first-child {
        width: 28%;
        padding-left: $space-2;
      }

      &:last-child {
        width: 24%;
        padding-right: $space-2;
        text-align: right;
        font-weight: $font-weight-semibold;
      }
    }
  }

  &__table-row--current {
    td {
      background-color: $color-primary-light;
      color: $color-primary;
      font-weight: $font-weight-bold;

      &:first-child {
        border-radius: $radius-sm 0 0 $radius-sm;
      }

      &:last-child {
        border-radius: 0 $radius-sm $radius-sm 0;
      }
    }
  }

  &__link {
    display: block;
    margin-top: $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-primary;
    text-align: center;
    text-decoration: none;
    @include no-select;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
