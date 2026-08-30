<script setup>
import LessonCard from './LessonCard.vue'

defineProps({
  day: {
    type: Object,
    required: true,
  },
  expandedLessonId: {
    type: String,
    default: null,
  },
})

defineEmits(['toggle-lesson'])
</script>

<template>
  <section
    class="day-column"
    :class="{
      'day-column--today': day.isToday,
      'day-column--weekend': day.isWeekend,
      'day-column--empty': !day.lessons.length,
    }"
  >
    <header class="day-column__header">
      <div class="day-column__title">
        <span class="day-column__weekday">{{ day.short }}</span>
        <span class="day-column__number">{{ day.dayNumber }}</span>
      </div>
      <span v-if="day.isToday" class="day-column__today-label">Сегодня</span>
    </header>

    <div class="day-column__body">
      <p v-if="!day.lessons.length" class="day-column__empty">Занятий нет</p>
      <LessonCard
        v-for="lesson in day.lessons"
        :key="lesson.id"
        :lesson="lesson"
        :expanded="expandedLessonId === lesson.id"
        compact
        @toggle="$emit('toggle-lesson', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.day-column {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 196px;
  padding: $space-3;
  border-radius: $radius-lg;
  background-color: $color-bg-muted;
  border: 2px solid transparent;

  &--empty {
    flex: 0.62 1 0;
    min-width: 92px;
  }

  &--today {
    background-color: $color-secondary-light;
    border-color: $color-today-ring;
  }

  &--weekend:not(&--today) {
    background-color: #fff5f5;
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-1 $space-2;
    margin-bottom: $space-3;
    min-height: 32px;
  }

  &__title {
    display: flex;
    align-items: baseline;
    gap: $space-2;
  }

  &__weekday {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-secondary;
  }

  &--weekend &__weekday {
    color: $color-weekend;
  }

  &__number {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__today-label {
    margin-left: auto;
    padding: $space-1 $space-3;
    border-radius: $radius-chip;
    background: $gradient-blue;
    color: $color-text-inverse;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    flex: 1;
  }

  &__empty {
    margin: 0;
    padding: $space-3 $space-1;
    color: $color-text-muted;
    font-size: $font-size-xs;
    text-align: center;
  }
}

@media (max-width: 1280px) {
  .day-column,
  .day-column--empty {
    flex: none;
    min-width: 0;
  }
}
</style>
