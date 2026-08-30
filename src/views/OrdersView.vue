<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useMarket } from '@/modules/market/composables/useMarket.js'
import OrdersList from '@/modules/market/components/OrdersList.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const { allOrders, isOrdersEmpty } = useMarket()
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[
      { label: 'Главная', href: '/' },
      { label: 'Маркет', href: '/market' },
      { label: 'Мои заказы' },
    ]"
    active-route="orders"
  >
    <div class="orders-view">
      <OrdersList :orders="allOrders" :is-empty="isOrdersEmpty" />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.orders-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .orders-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
