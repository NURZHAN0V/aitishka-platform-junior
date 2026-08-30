<script setup>
import { computed } from 'vue'
import { BaseCard } from '@/core/components/ui'
import { formatTimeRange } from '../composables/useSchedule.js'
import LessonCard from './LessonCard.vue'

const props = defineProps({
  dayLessons: {
    type: Array,
    default: () => [],
  },
  upcomingThisWeek: {
    type: Array,
    default: () => [],
  },
  nextLesson: {
    type: Object,
    default: null,
  },
  isToday: {
    type: Boolean,
    default: true,
  },
  expandedLessonId: {
    type: String,
    default: null,
  },
})

defineEmits(['toggle-lesson'])

const dayHeading = computed(() => (props.isToday ? 'Сегодня' : 'День'))

const emptyTitle = computed(() =>
  props.isToday ? 'Сегодня занятий нет' : 'В этот день занятий нет',
)

const nextLessonLabel = computed(() => {
  if (!props.nextLesson) return ''
  const date = new Date(props.nextLesson.start)
  const day = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  return `${day}, ${formatTimeRange(props.nextLesson.start, props.nextLesson.end)}`
})
</script>

<template>
  <div class="schedule-today">
    <section class="schedule-today__block">
      <h2 class="schedule-today__heading">{{ dayHeading }}</h2>

      <div v-if="dayLessons.length" class="schedule-today__list">
        <LessonCard
          v-for="lesson in dayLessons"
          :key="lesson.id"
          :lesson="lesson"
          :expanded="expandedLessonId === lesson.id"
          @toggle="$emit('toggle-lesson', $event)"
        />
      </div>

      <BaseCard v-else padding="md" class="schedule-today__empty">
        <p class="schedule-today__empty-title">{{ emptyTitle }}</p>
        <p v-if="nextLesson" class="schedule-today__empty-next">
          Ближайшее: {{ nextLesson.title }} · {{ nextLessonLabel }}
        </p>
        <p v-else class="schedule-today__empty-next">В расписании пока нет следующих занятий.</p>
      </BaseCard>
    </section>

    <section v-if="isToday && upcomingThisWeek.length" class="schedule-today__block">
      <h2 class="schedule-today__heading">Дальше на этой неделе</h2>
      <div class="schedule-today__list">
        <LessonCard
          v-for="lesson in upcomingThisWeek"
          :key="lesson.id"
          :lesson="lesson"
          :expanded="expandedLessonId === lesson.id"
          compact
          @toggle="$emit('toggle-lesson', $event)"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.schedule-today {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.schedule-today__block {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.schedule-today__heading {
  margin: 0;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.schedule-today__list {
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.schedule-today__empty-title {
  margin: 0 0 $space-2;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.schedule-today__empty-next {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
</style>
