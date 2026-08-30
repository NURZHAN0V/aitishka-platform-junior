<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import HelpContactsCard from '@/modules/help/components/HelpContactsCard.vue'
import HelpFaqList from '@/modules/help/components/HelpFaqList.vue'
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Помощь и поддержка' }]"
    active-route="help"
  >
    <div class="help-view">
      <div class="help-view__grid">
        <HelpContactsCard />
        <HelpFaqList />
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.help-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

.help-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: $space-5;
  align-items: start;
}

@media (max-width: 900px) {
  .help-view__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .help-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
