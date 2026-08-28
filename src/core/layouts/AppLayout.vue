<script setup>
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { BaseConfirmContainer, BaseToastContainer } from '@/core/components/ui'

defineProps({
  showShell: {
    type: Boolean,
    default: true,
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  coins: {
    type: Number,
    default: 0,
  },
  user: {
    type: Object,
    default: () => ({
      name: 'Алина Петрова',
      group: 'Группа Python-1',
      avatar: '',
    }),
  },
  activeRoute: {
    type: String,
    default: 'home',
  },
  greeting: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar v-if="showShell" :active-route="activeRoute" />
    <div class="app-layout__main">
      <div class="app-layout__panel">
        <AppHeader
          v-if="showShell"
          :breadcrumbs="breadcrumbs"
          :greeting="greeting"
          :coins="coins"
          :user="user"
        />
        <main class="app-layout__content">
          <slot />
        </main>
      </div>
    </div>
    <BaseToastContainer />
    <BaseConfirmContainer />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: $color-bg-page;

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    padding: $space-4 $space-4 $space-4 $space-2;
    overflow: hidden;
  }

  &__panel {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    border-radius: $radius-2xl;
    background-color: $color-bg-card;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
