<script setup>
import { computed } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useConfirm } from '@/core/composables/useConfirm'
import { useToast } from '@/core/composables/useToast'
import { useHomework } from '@/modules/homework/composables/useHomework.js'
import HomeworkToolbar from '@/modules/homework/components/HomeworkToolbar.vue'
import HomeworkList from '@/modules/homework/components/HomeworkList.vue'
import HomeworkUploadModal from '@/modules/homework/components/HomeworkUploadModal.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const toast = useToast()
const { confirm } = useConfirm()

const {
  statusFilter,
  subjectFilter,
  statusTabs,
  visibleItems,
  hasMore,
  isEmpty,
  isEmptyFilter,
  uploadTarget,
  setStatusFilter,
  setSubjectFilter,
  loadMore,
  openUpload,
  closeUpload,
  submitWork,
  removeUpload,
  downloadTask,
} = useHomework()

const uploadOpen = computed({
  get: () => Boolean(uploadTarget.value),
  set: (open) => {
    if (!open) closeUpload()
  },
})

async function onReupload(id) {
  const ok = await confirm({
    title: 'Удалить загрузку?',
    message: 'Файл будет удалён. После этого можно загрузить работу заново.',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    variant: 'danger',
  })
  if (!ok) return
  removeUpload(id)
  openUpload(id)
}

function onSubmit(file) {
  const id = uploadTarget.value?.id
  if (!id) return
  const sent = submitWork(id, file)
  if (sent) toast.success('Работа отправлена на проверку')
}

function onDownload(item) {
  downloadTask(item)
  toast.info('Файл задания скачан')
}
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Домашние задания' }]"
    active-route="homework"
  >
    <div class="homework-view">
      <HomeworkToolbar
        :status-filter="statusFilter"
        :status-tabs="statusTabs"
        :subject-filter="subjectFilter"
        @update:status-filter="setStatusFilter"
        @update:subject-filter="setSubjectFilter"
      />

      <HomeworkList
        :items="visibleItems"
        :is-empty="isEmpty"
        :is-empty-filter="isEmptyFilter"
        :has-more="hasMore"
        @download="onDownload"
        @upload="openUpload"
        @reupload="onReupload"
        @load-more="loadMore"
      />

      <HomeworkUploadModal
        v-model="uploadOpen"
        :assignment="uploadTarget"
        @submit="onSubmit"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.homework-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .homework-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
