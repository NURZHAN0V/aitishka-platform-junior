<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useSchedule } from '@/modules/schedule/composables/useSchedule.js'
import ScheduleToolbar from '@/modules/schedule/components/ScheduleToolbar.vue'
import ScheduleTodayView from '@/modules/schedule/components/ScheduleTodayView.vue'
import ScheduleWeekView from '@/modules/schedule/components/ScheduleWeekView.vue'
import ScheduleMonthView from '@/modules/schedule/components/ScheduleMonthView.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const {
  view,
  isDesktopSchedule,
  expandedLessonId,
  periodLabel,
  daysWithLessons,
  dayLessons,
  monthDays,
  upcomingThisWeek,
  nextLessonAfterDay,
  isSelectedDayToday,
  setView,
  goToPrevPeriod,
  goToNextPeriod,
  goToToday,
  selectMonthDay,
  toggleLesson,
} = useSchedule()
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Расписание' }]"
    active-route="schedule"
  >
    <div class="schedule-view">
      <ScheduleToolbar
        :view="view"
        :period-label="periodLabel"
        :allow-multi-view="isDesktopSchedule"
        @update:view="setView"
        @prev-period="goToPrevPeriod"
        @next-period="goToNextPeriod"
        @go-today="goToToday"
      />

      <ScheduleTodayView
        v-if="view === 'day'"
        :day-lessons="dayLessons"
        :upcoming-this-week="upcomingThisWeek"
        :next-lesson="nextLessonAfterDay"
        :is-today="isSelectedDayToday"
        :expanded-lesson-id="expandedLessonId"
        @toggle-lesson="toggleLesson"
      />

      <ScheduleWeekView
        v-else-if="view === 'week'"
        :days="daysWithLessons"
        :expanded-lesson-id="expandedLessonId"
        @toggle-lesson="toggleLesson"
      />

      <ScheduleMonthView
        v-else
        :days="monthDays"
        @select-day="selectMonthDay"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.schedule-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .schedule-view {
    padding: $space-4;
  }
}
</style>
