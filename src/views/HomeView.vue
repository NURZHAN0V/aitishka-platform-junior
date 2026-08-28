<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
// import HomeBannerSlider from '@/modules/home/components/HomeBannerSlider.vue'
import HomeWidgetsRow from '@/modules/home/components/HomeWidgetsRow.vue'
import HomeWidgetsSecondRow from '@/modules/home/components/HomeWidgetsSecondRow.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}
</script>

<template>
  <AppLayout
    greeting
    :coins="1250"
    :user="mockUser"
    active-route="home"
  >
    <div class="home-view">
      <!-- <HomeBannerSlider /> -->
      <HomeWidgetsRow />
      <HomeWidgetsSecondRow />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.home-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-6 $space-6;
}
</style>
