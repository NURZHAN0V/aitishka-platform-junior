<script setup>
import { RouterLink } from 'vue-router'
import { MARKET_PAGE_LINK } from '../constants/market.js'
</script>

<template>
  <div class="orders-toolbar">
    <div class="orders-toolbar__intro">
      <h1 class="orders-toolbar__title">Мои заказы</h1>
      <p class="orders-toolbar__lead">
        Следи за статусом. Забрать приз можно в школе на занятиях
      </p>
    </div>

    <RouterLink :to="MARKET_PAGE_LINK" class="orders-toolbar__market">
      В маркет
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.orders-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-4;

  &__intro {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__lead {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
    max-width: 42ch;
  }

  &__market {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: $space-2 $space-4;
    border-radius: $radius-button;
    border: 1.5px solid $color-primary;
    background-color: $color-bg-card;
    color: $color-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    text-decoration: none;
    flex-shrink: 0;
    transition: background-color $transition-base;
    @include no-select;

    &:hover {
      background-color: $color-primary-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

@media (max-width: 720px) {
  .orders-toolbar__title {
    font-size: $font-size-xl;
  }
}
</style>
