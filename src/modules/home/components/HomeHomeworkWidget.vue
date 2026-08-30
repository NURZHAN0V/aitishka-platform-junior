<script setup>
// import { RouterLink } from 'vue-router' // раздел «Домашние задания» временно скрыт
import { BaseIcon } from '@/core/components/ui'
import { WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { HOMEWORK_WIDGET_MOCK } from '../constants/widgets.js'

defineProps({
  pending: { type: Number, default: HOMEWORK_WIDGET_MOCK.pending },
  overdue: { type: Number, default: HOMEWORK_WIDGET_MOCK.overdue },
  linkHref: { type: String, default: HOMEWORK_WIDGET_MOCK.linkHref },
})
</script>

<template>
  <article class="home-homework-widget">
    <header class="home-homework-widget__header">
      <BaseIcon
        :name="WIDGET_ILLUSTRATIONS.backpack"
        type="avif"
        :size="32"
        class="home-homework-widget__icon"
        label=""
      />
      <h2 class="home-homework-widget__title">Домашние задания</h2>
    </header>

    <div class="home-homework-widget__content">
      <div class="home-homework-widget__stats">
        <div class="home-homework-widget__stat">
          <span class="home-homework-widget__stat-label">На проверке</span>
          <span class="home-homework-widget__stat-value home-homework-widget__stat-value--pending">
            {{ pending }}
          </span>
        </div>
        <div class="home-homework-widget__stat">
          <span class="home-homework-widget__stat-label home-homework-widget__stat-label--overdue">
            Просроченные
          </span>
          <span class="home-homework-widget__stat-value home-homework-widget__stat-value--overdue">
            {{ overdue }}
          </span>
        </div>
      </div>
    </div>

    <!-- Скрыто: переход в раздел «Домашние задания»
    <footer class="home-homework-widget__footer">
      <RouterLink :to="linkHref" class="home-homework-widget__link">Все задания →</RouterLink>
    </footer>
    -->
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-homework-widget {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $space-4;
  border-radius: $radius-2xl;
  background: $gradient-widget-homework;
  color: $color-text-inverse;
  box-shadow: $shadow-md;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-3;
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

  &__content {
    flex: 1;
    display: flex;
    align-items: stretch;
    min-height: 0;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-3;
    width: 100%;
    flex: 1;
    align-items: stretch;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $space-2;
    min-height: 112px;
    height: 100%;
    padding: $space-3 $space-2;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    color: $color-text-primary;
    text-align: center;
  }

  &__stat-label {
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: $color-text-primary;

    &--overdue {
      color: #ef6c00;
    }
  }

  &__stat-value {
    font-size: 2.75rem;
    font-weight: $font-weight-bold;
    line-height: 1;

    &--pending {
      color: #43a047;
    }

    &--overdue {
      color: #ef6c00;
    }
  }

  &__footer {
    margin-top: auto;
    padding-top: $space-3;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 36px;
    padding: $space-2 $space-4;
    border-radius: $radius-chip;
    background-color: rgba(46, 125, 50, 0.32);
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-inverse;
    text-decoration: none;
    @include no-select;
    transition: background-color $transition-fast;

    &:hover {
      background-color: rgba(46, 125, 50, 0.42);
    }
  }
}
</style>
