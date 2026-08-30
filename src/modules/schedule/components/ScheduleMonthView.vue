<script setup>
import { WEEKDAY_SHORT } from '../constants/lessons.js'
import { SUBJECT_COLORS } from '@/core/constants/illustrations'

defineProps({
  days: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['select-day'])

function subjectColor(subject) {
  return SUBJECT_COLORS[subject] ?? '#8b5cf6'
}
</script>

<template>
  <div class="schedule-month">
    <div class="schedule-month__weekdays" aria-hidden="true">
      <span
        v-for="label in WEEKDAY_SHORT"
        :key="label"
        class="schedule-month__weekday"
        :class="{ 'schedule-month__weekday--weekend': label === 'Сб' || label === 'Вс' }"
      >
        {{ label }}
      </span>
    </div>

    <div class="schedule-month__grid">
      <button
        v-for="day in days"
        :key="day.key"
        type="button"
        class="schedule-month__cell"
        :class="{
          'schedule-month__cell--outside': !day.isCurrentMonth,
          'schedule-month__cell--today': day.isToday,
          'schedule-month__cell--weekend': day.isWeekend,
        }"
        :aria-label="day.key"
        @click="$emit('select-day', day.date)"
      >
        <span class="schedule-month__day-number">{{ day.dayNumber }}</span>

        <span v-if="day.lessons.length" class="schedule-month__dots">
          <span
            v-for="lesson in day.lessons.slice(0, 3)"
            :key="lesson.id"
            class="schedule-month__dot"
            :style="{ backgroundColor: subjectColor(lesson.subject) }"
            :title="lesson.title"
          />
          <span v-if="day.lessons.length > 3" class="schedule-month__more">
            +{{ day.lessons.length - 3 }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.schedule-month {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-3;
  border: 1px solid $color-border;
  border-radius: $radius-card;
  background-color: $color-bg-card;
}

.schedule-month__weekdays,
.schedule-month__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: $space-1;
}

.schedule-month__weekday {
  padding: $space-2 0;
  text-align: center;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;

  &--weekend {
    color: $color-weekend;
  }
}

.schedule-month__cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-1;
  min-height: 72px;
  padding: $space-2;
  border: 1px solid transparent;
  border-radius: $radius-md;
  background-color: $color-bg-muted;
  color: $color-text-primary;
  text-align: left;
  cursor: pointer;
  @include press-scale(0.98);
  transition: transform $transition-press, border-color $transition-base, background-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
    background-color: $color-primary-light;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &--outside {
    color: $color-text-muted;
    background-color: transparent;
  }

  &--today {
    border-color: $color-today-ring;
    box-shadow: inset 0 0 0 1px $color-today-ring;
  }

  &--weekend:not(&--outside) .schedule-month__day-number {
    color: $color-weekend;
  }
}

.schedule-month__day-number {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  line-height: 1;
}

.schedule-month__dots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin-top: auto;
}

.schedule-month__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.schedule-month__more {
  font-size: 10px;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
  line-height: 1;
}

@media (max-width: 720px) {
  .schedule-month {
    padding: $space-2;
  }

  .schedule-month__cell {
    min-height: 56px;
    padding: $space-1;
  }

  .schedule-month__weekday {
    font-size: 10px;
  }
}

@include media-phone {
  .schedule-month__cell {
    align-items: center;
    min-height: $touch-target-min;
    min-width: 0;
    padding: $space-1 0;
  }

  .schedule-month__day-number {
    width: 100%;
    text-align: center;
    font-size: $font-size-sm;
  }

  .schedule-month__dots {
    justify-content: center;
    width: 100%;
  }

  .schedule-month__more {
    display: none;
  }
}
</style>
