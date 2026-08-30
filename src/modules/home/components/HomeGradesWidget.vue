<script setup>
import { RouterLink } from 'vue-router'
import { GRADES_WIDGET_MOCK } from '../constants/widgets.js'
import AttendanceLineChart from './AttendanceLineChart.vue'

defineProps({
  attendancePercent: { type: Number, default: GRADES_WIDGET_MOCK.attendancePercent },
  periodLabel: { type: String, default: GRADES_WIDGET_MOCK.periodLabel },
  statusLabel: { type: String, default: GRADES_WIDGET_MOCK.statusLabel },
  linkHref: { type: String, default: GRADES_WIDGET_MOCK.linkHref },
  chartData: { type: Array, default: () => GRADES_WIDGET_MOCK.chartData },
})
</script>

<template>
  <article class="home-grades-widget">
    <header class="home-grades-widget__header">
      <h2 class="home-grades-widget__title">Оценки и посещаемость</h2>
    </header>

    <div class="home-grades-widget__panel">
      <section class="home-grades-widget__summary">
        <p class="home-grades-widget__summary-label">Средняя посещаемость</p>
        <p class="home-grades-widget__summary-value">{{ attendancePercent }}%</p>
        <p class="home-grades-widget__summary-period">{{ periodLabel }}</p>
        <span class="home-grades-widget__status">
          <span class="home-grades-widget__status-star" aria-hidden="true">★</span>
          {{ statusLabel }}
        </span>
      </section>

      <div class="home-grades-widget__divider" aria-hidden="true" />

      <section class="home-grades-widget__chart">
        <AttendanceLineChart :data="chartData" />
      </section>
    </div>

    <footer class="home-grades-widget__footer">
      <RouterLink :to="linkHref" class="home-grades-widget__link">Подробнее →</RouterLink>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-grades-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: $space-4;
  border-radius: $radius-card;
  background-color: $gradient-widget-grades;
  box-shadow: $shadow-sm;

  &__header {
    flex-shrink: 0;
    margin-bottom: $space-3;
    @include no-select;
  }

  &__title {
    margin: 0;
    min-width: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: #312e81;
  }

  &__panel {
    display: grid;
    grid-template-columns: minmax(0, 0.34fr) 1px minmax(0, 0.66fr);
    gap: 0 $space-4;
    flex: 1;
    align-items: stretch;
    min-height: 0;
    padding: $space-3 $space-4;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    box-shadow: $shadow-sm;

    @include media-phone {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: $space-3 0;
    }
  }

  &__summary {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    padding-right: $space-2;

    @include media-phone {
      padding-right: 0;
    }
  }

  &__divider {
    align-self: stretch;
    width: 1px;
    background-color: $color-border;

    @include media-phone {
      width: 100%;
      height: 1px;
    }
  }

  &__summary-label {
    margin: 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
  }

  &__summary-value {
    margin: $space-2 0 0;
    font-size: 2.25rem;
    font-weight: $font-weight-bold;
    line-height: 1;
    color: $color-success;
    letter-spacing: -0.02em;
  }

  &__summary-period {
    margin: $space-1 0 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    align-self: flex-start;
    margin-top: $space-3;
    padding: $space-1 $space-3;
    border-radius: $radius-chip;
    background-color: $color-bg-muted;
    color: $color-text-primary;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
  }

  &__status-star {
    color: $color-coin;
    font-size: 0.875em;
  }

  &__chart {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    padding-left: $space-1;

    @include media-phone {
      height: auto;
      min-height: 10rem;
      padding-left: 0;
    }
  }

  &__footer {
    flex-shrink: 0;
    margin-top: $space-3;
  }

  &__link {
    display: block;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-primary;
    text-align: center;
    text-decoration: none;
    @include no-select;

    &:hover {
      color: $color-primary-hover;
      text-decoration: underline;
    }
  }
}
</style>
