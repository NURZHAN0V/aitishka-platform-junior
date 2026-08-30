<script setup>
import { computed } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useToast } from '@/core/composables/useToast'
import { useExams } from '@/modules/exams/composables/useExams.js'
import ExamsSummary from '@/modules/exams/components/ExamsSummary.vue'
import ExamsToolbar from '@/modules/exams/components/ExamsToolbar.vue'
import ExamsList from '@/modules/exams/components/ExamsList.vue'
import ExamUploadModal from '@/modules/exams/components/ExamUploadModal.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const toast = useToast()

const {
  period,
  viewMode,
  subjectFilter,
  statusFilter,
  expandedId,
  periodLabel,
  statusTabs,
  filteredItems,
  subjectSummaries,
  upcomingItems,
  periodCounts,
  motivation,
  isEmptyPeriod,
  isEmptyFilter,
  uploadTarget,
  setPeriod,
  setViewMode,
  setSubjectFilter,
  setStatusFilter,
  selectStatus,
  goToPrevPeriod,
  goToNextPeriod,
  goToCurrentPeriod,
  toggleItem,
  openExam,
  openSubject,
  openUpload,
  closeUpload,
  submitWork,
  downloadTask,
  viewWork,
} = useExams()

const uploadOpen = computed({
  get: () => Boolean(uploadTarget.value),
  set: (open) => {
    if (!open) closeUpload()
  },
})

function onSubmit(file) {
  const id = uploadTarget.value?.id
  if (!id) return
  const sent = submitWork(id, file)
  if (sent) toast.success('Работа отправлена на проверку')
}

function onDownload(item) {
  downloadTask(item)
  toast.info('Материалы экзамена скачаны')
}

function onViewWork(item) {
  viewWork(item)
  toast.info('Файл работы скачан')
}
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Экзамены' }]"
    active-route="exams"
  >
    <div class="exams-view">
      <ExamsSummary
        :awaiting-count="periodCounts.awaiting"
        :urgent-count="periodCounts.urgent"
        :missed-count="periodCounts.missed"
        :upcoming-items="upcomingItems"
        :motivation="motivation"
        @select-status="selectStatus"
        @open-exam="openExam"
      />

      <ExamsToolbar
        :period="period"
        :view-mode="viewMode"
        :period-label="periodLabel"
        :subject-filter="subjectFilter"
        :status-filter="statusFilter"
        :status-tabs="statusTabs"
        @update:period="setPeriod"
        @update:view-mode="setViewMode"
        @update:subject-filter="setSubjectFilter"
        @update:status-filter="setStatusFilter"
        @prev-period="goToPrevPeriod"
        @next-period="goToNextPeriod"
        @go-current="goToCurrentPeriod"
      />

      <ExamsList
        :view-mode="viewMode"
        :items="filteredItems"
        :subject-summaries="subjectSummaries"
        :expanded-id="expandedId"
        :is-empty-period="isEmptyPeriod"
        :is-empty-filter="isEmptyFilter"
        @toggle="toggleItem"
        @download="onDownload"
        @upload="openUpload"
        @view-work="onViewWork"
        @open-subject="openSubject"
      />

      <ExamUploadModal
        v-model="uploadOpen"
        :exam="uploadTarget"
        @submit="onSubmit"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.exams-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .exams-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
