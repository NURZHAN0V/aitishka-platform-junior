<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import GamesLobby from '@/modules/games/components/GamesLobby.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Игры' }]"
    active-route="keyland"
  >
    <div class="games-view">
      <GamesLobby />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.games-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .games-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
