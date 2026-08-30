<script setup>
import DayColumn from './DayColumn.vue'

defineProps({
  days: {
    type: Array,
    default: () => [],
  },
  expandedLessonId: {
    type: String,
    default: null,
  },
})

defineEmits(['toggle-lesson'])
</script>

<template>
  <div class="schedule-week">
    <DayColumn
      v-for="day in days"
      :key="day.key"
      :day="day"
      :expanded-lesson-id="expandedLessonId"
      @toggle-lesson="$emit('toggle-lesson', $event)"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.schedule-week {
  display: flex;
  align-items: stretch;
  gap: $space-2;
  overflow-x: auto;
  padding-bottom: $space-1;
}

@media (max-width: 1280px) {
  .schedule-week {
    display: grid;
    grid-template-columns: 1fr;
    overflow-x: visible;
  }
}
</style>
