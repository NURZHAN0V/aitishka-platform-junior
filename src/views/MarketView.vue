<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useToast } from '@/core/composables/useToast'
import { useMarket } from '@/modules/market/composables/useMarket.js'
import MarketToolbar from '@/modules/market/components/MarketToolbar.vue'
import MarketProductGrid from '@/modules/market/components/MarketProductGrid.vue'
import MarketPurchaseModal from '@/modules/market/components/MarketPurchaseModal.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const toast = useToast()

const {
  categoryFilter,
  sortBy,
  categoryTabs,
  sortOptions,
  filteredProducts,
  isEmptyFilter,
  purchasePreview,
  purchaseOpen,
  setCategoryFilter,
  setSortBy,
  openPurchase,
  confirmPurchase,
} = useMarket()

function onConfirmPurchase() {
  const result = confirmPurchase()
  if (result.ok) {
    toast.success(`Заказ оформлен: ${result.productName}. Забери в школе на занятиях`)
    return
  }
  if (result.reason === 'short') {
    toast.error('Не хватает монеток для этой покупки')
  } else if (result.reason === 'out') {
    toast.error('Товара больше нет в наличии')
  }
}
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Маркет' }]"
    active-route="market"
  >
    <div class="market-view">
      <MarketToolbar
        :category-filter="categoryFilter"
        :category-tabs="categoryTabs"
        :sort-by="sortBy"
        :sort-options="sortOptions"
        @update:category-filter="setCategoryFilter"
        @update:sort-by="setSortBy"
      />

      <MarketProductGrid
        :products="filteredProducts"
        :is-empty-filter="isEmptyFilter"
        @buy="openPurchase"
      />

      <MarketPurchaseModal
        v-model="purchaseOpen"
        :product="purchasePreview"
        @confirm="onConfirmPurchase"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.market-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .market-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
