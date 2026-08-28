<script setup>
import HomeGradesWidget from './HomeGradesWidget.vue'
import HomeJournalWidget from './HomeJournalWidget.vue'
</script>

<template>
  <section class="home-widgets-second-row" aria-label="Виджеты оценок и журнала">
    <HomeGradesWidget />
    <HomeJournalWidget />
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.home-widgets-second-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: $space-4;
  align-items: stretch;

  > * {
    min-height: 0;
  }

  @media (max-width: 1280px) {
    grid-template-columns: 1fr;
  }
}
</style>
