<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useJournal } from '@/modules/journal/composables/useJournal.js'
import JournalToolbar from '@/modules/journal/components/JournalToolbar.vue'
import JournalList from '@/modules/journal/components/JournalList.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const {
  typeFilter,
  typeTabs,
  visibleItems,
  hasMore,
  isEmpty,
  isEmptyFilter,
  setTypeFilter,
  loadMore,
} = useJournal()
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Журнал' }]"
    active-route="journal"
  >
    <div class="journal-view">
      <JournalToolbar
        :type-filter="typeFilter"
        :type-tabs="typeTabs"
        @update:type-filter="setTypeFilter"
      />

      <JournalList
        :items="visibleItems"
        :is-empty="isEmpty"
        :is-empty-filter="isEmptyFilter"
        :has-more="hasMore"
        @load-more="loadMore"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.journal-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .journal-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
