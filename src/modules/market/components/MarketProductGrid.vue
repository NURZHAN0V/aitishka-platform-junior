<script setup>
import { BaseCard } from '@/core/components/ui'
import MarketProductCard from './MarketProductCard.vue'

defineProps({
  products: { type: Array, default: () => [] },
  isEmptyFilter: { type: Boolean, default: false },
})

defineEmits(['buy'])
</script>

<template>
  <section class="market-grid" aria-label="Каталог маркета">
    <BaseCard v-if="isEmptyFilter" padding="md" class="market-grid__empty">
      <p class="market-grid__empty-title">В этой категории пока пусто</p>
      <p class="market-grid__empty-hint">Выбери «Все» или другую категорию</p>
    </BaseCard>

    <div v-else class="market-grid__list">
      <MarketProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @buy="$emit('buy', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.market-grid {
  &__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $space-5;
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
    margin: $space-2 0 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }
}

@media (max-width: 1100px) {
  .market-grid__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .market-grid__list {
    grid-template-columns: 1fr;
    gap: $space-4;
  }
}
</style>
