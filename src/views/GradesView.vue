<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useGrades } from '@/modules/grades/composables/useGrades.js'
import GradesSummary from '@/modules/grades/components/GradesSummary.vue'
import GradesToolbar from '@/modules/grades/components/GradesToolbar.vue'
import GradesList from '@/modules/grades/components/GradesList.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const {
  period,
  viewMode,
  subjectFilter,
  workTypeFilter,
  expandedGradeId,
  periodLabel,
  averageLabel,
  averageTone,
  averageQualitative,
  dynamicsPoints,
  filteredGrades,
  subjectSummaries,
  counts,
  isEmptyPeriod,
  isEmptyFilter,
  setPeriod,
  setViewMode,
  setSubjectFilter,
  setWorkTypeFilter,
  goToPrevPeriod,
  goToNextPeriod,
  goToCurrentPeriod,
  toggleGrade,
} = useGrades()
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Оценки' }]"
    active-route="grades"
  >
    <div class="grades-view">
      <GradesSummary
        :average-label="averageLabel"
        :average-tone="averageTone"
        :average-qualitative="averageQualitative"
        :period="period"
        :period-label="periodLabel"
        :dynamics-points="dynamicsPoints"
        :grades-count="counts.total"
      />

      <GradesToolbar
        :period="period"
        :view-mode="viewMode"
        :period-label="periodLabel"
        :subject-filter="subjectFilter"
        :work-type-filter="workTypeFilter"
        @update:period="setPeriod"
        @update:view-mode="setViewMode"
        @update:subject-filter="setSubjectFilter"
        @update:work-type-filter="setWorkTypeFilter"
        @prev-period="goToPrevPeriod"
        @next-period="goToNextPeriod"
        @go-current="goToCurrentPeriod"
      />

      <GradesList
        :view-mode="viewMode"
        :grades="filteredGrades"
        :subject-summaries="subjectSummaries"
        :expanded-grade-id="expandedGradeId"
        :is-empty-period="isEmptyPeriod"
        :is-empty-filter="isEmptyFilter"
        @toggle-grade="toggleGrade"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.grades-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .grades-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
