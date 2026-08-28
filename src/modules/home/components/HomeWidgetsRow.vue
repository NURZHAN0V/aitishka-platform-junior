<script setup>
import HomeHomeworkWidget from './HomeHomeworkWidget.vue'
import HomeRatingWidget from './HomeRatingWidget.vue'
import HomeStreaksWidget from './HomeStreaksWidget.vue'
</script>

<template>
  <section class="home-widgets-row" aria-label="Виджеты главной">
    <HomeRatingWidget />
    <HomeHomeworkWidget />
    <HomeStreaksWidget />
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.home-widgets-row {
  display: grid;
  grid-template-columns: minmax(0, 1.38fr) minmax(0, 0.86fr) minmax(0, 1.16fr);
  gap: $space-4;
  align-items: stretch;

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
}
</style>
