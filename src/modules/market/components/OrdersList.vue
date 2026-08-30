<script setup>
import { RouterLink } from 'vue-router'
import { BaseCard } from '@/core/components/ui'
import { MARKET_PAGE_LINK } from '../constants/market.js'
import OrderCard from './OrderCard.vue'

defineProps({
  orders: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
})
</script>

<template>
  <section class="orders-list" aria-label="Список заказов">
    <BaseCard v-if="isEmpty" padding="md" class="orders-list__empty">
      <p class="orders-list__empty-title">Пока нет заказов</p>
      <p class="orders-list__empty-hint">Загляни в маркет и обменяй монетки на приз</p>
      <RouterLink :to="MARKET_PAGE_LINK" class="orders-list__cta">
        Открыть маркет
      </RouterLink>
    </BaseCard>

    <div v-else class="orders-list__items">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.orders-list {
  &__items {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__empty {
    text-align: center;
  }

  &__empty-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__empty-hint {
    margin: $space-2 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: $space-2 $space-5;
    border-radius: $radius-button;
    background-color: $color-primary;
    color: $color-text-inverse;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    text-decoration: none;
    transition: background-color $transition-base;
    @include no-select;

    &:hover {
      background-color: $color-primary-hover;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
