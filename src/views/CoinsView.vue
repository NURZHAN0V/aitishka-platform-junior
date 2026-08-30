<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useCoins } from '@/modules/coins/composables/useCoins.js'
import CoinsBalanceCard from '@/modules/coins/components/CoinsBalanceCard.vue'
import CoinsHistoryToolbar from '@/modules/coins/components/CoinsHistoryToolbar.vue'
import CoinsHistoryList from '@/modules/coins/components/CoinsHistoryList.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const {
  balance,
  marketLink,
  directionFilter,
  filterTabs,
  visibleItems,
  hasMore,
  isEmpty,
  isEmptyFilter,
  setDirectionFilter,
  loadMore,
} = useCoins()
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Монетки' }]"
    active-route="coins"
  >
    <div class="coins-view">
      <CoinsBalanceCard :balance="balance" :market-link="marketLink" />

      <section class="coins-view__history" aria-label="История начислений и списаний">
        <CoinsHistoryToolbar
          :direction-filter="directionFilter"
          :filter-tabs="filterTabs"
          @update:direction-filter="setDirectionFilter"
        />
        <CoinsHistoryList
          :items="visibleItems"
          :is-empty="isEmpty"
          :is-empty-filter="isEmptyFilter"
          :has-more="hasMore"
          @load-more="loadMore"
        />
      </section>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.coins-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  // Extra top pad so raised coin art clears breadcrumbs (keep overflow visible on card)
  padding: $space-10 $space-5 $space-8;
  overflow: visible;

  &__history {
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }
}

@media (max-width: 720px) {
  .coins-view {
    padding: $space-8 $space-4 $space-4;
    gap: $space-4;
  }
}
</style>
