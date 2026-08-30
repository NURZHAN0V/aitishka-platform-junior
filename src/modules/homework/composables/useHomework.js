import { computed, ref, watch } from 'vue'
import { isSameDay, startOfDay } from '@/modules/schedule/composables/useSchedule.js'
import {
  HOMEWORK_FIVE_COINS,
  HOMEWORK_ON_TIME_COINS,
  HOMEWORK_PAGE_INITIAL,
  HOMEWORK_PAGE_STEP,
  HOMEWORK_STATUSES,
  MOCK_HOMEWORK,
  STATUS_FILTERS,
  SUBJECT_LABELS,
} from '../constants/homework.js'

const VALID_STATUS_FILTERS = new Set(STATUS_FILTERS.map((item) => item.id))

function cloneItem(item) {
  return {
    ...item,
    materials: (item.materials || []).map((file) => ({ ...file })),
  }
}

const homeworkItems = ref(MOCK_HOMEWORK.map(cloneItem))

function pluralRu(n, one, few, many) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs > 10 && abs < 20) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

function formatIssuedDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
}

function formatDeadlineDate(iso) {
  const date = new Date(iso)
  const dayMonth = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${dayMonth}, ${time}`
}

export function deadlineMeta(deadlineIso, now = new Date()) {
  const deadline = new Date(deadlineIso)
  const diffMs = deadline.getTime() - now.getTime()

  if (diffMs < 0) {
    const daysLate = Math.max(
      1,
      Math.round((startOfDay(now).getTime() - startOfDay(deadline).getTime()) / 86_400_000),
    )
    return {
      tone: 'danger',
      label: `Просрочен на ${daysLate} ${pluralRu(daysLate, 'день', 'дня', 'дней')}`,
    }
  }

  if (isSameDay(deadline, now)) {
    const hours = Math.max(1, Math.ceil(diffMs / 3_600_000))
    return {
      tone: 'danger',
      label: `Осталось ${hours} ${pluralRu(hours, 'час', 'часа', 'часов')}`,
    }
  }

  const days = Math.max(
    1,
    Math.round((startOfDay(deadline).getTime() - startOfDay(now).getTime()) / 86_400_000),
  )

  if (days <= 2) {
    return {
      tone: 'warning',
      label: `Осталось ${days} ${pluralRu(days, 'день', 'дня', 'дней')}`,
    }
  }

  return {
    tone: 'success',
    label: `Осталось ${days} ${pluralRu(days, 'день', 'дня', 'дней')}`,
  }
}

export function effectiveStatus(item, now = new Date()) {
  if (item.status === 'current' && new Date(item.deadline) < now) return 'overdue'
  return item.status
}

function statusRank(status) {
  const order = { overdue: 0, rejected: 1, current: 2, pending: 3, approved: 4 }
  return order[status] ?? 5
}

function downloadBlob(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function emptyCounts() {
  return {
    current: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    overdue: 0,
  }
}

export function useHomework(sourceItems = homeworkItems) {
  const now = ref(new Date())
  const statusFilter = ref('current')
  const subjectFilter = ref('all')
  const uploadTargetId = ref(null)
  const visibleCount = ref(HOMEWORK_PAGE_INITIAL)

  const allItems = computed(() =>
    sourceItems.value.map((item) => {
      const status = effectiveStatus(item, now.value)
      return { ...item, status }
    }),
  )

  const subjectItems = computed(() =>
    allItems.value.filter((item) => {
      if (subjectFilter.value !== 'all' && item.subject !== subjectFilter.value) return false
      return true
    }),
  )

  const statusCounts = computed(() => {
    const counts = emptyCounts()
    subjectItems.value.forEach((item) => {
      counts[item.status] += 1
    })
    return counts
  })

  const statusTabs = computed(() =>
    STATUS_FILTERS.map((item) => ({
      ...item,
      count: statusCounts.value[item.id] ?? 0,
    })),
  )

  const filteredItems = computed(() => {
    return subjectItems.value
      .filter((item) => item.status === statusFilter.value)
      .slice()
      .sort((a, b) => {
        const rank = statusRank(a.status) - statusRank(b.status)
        if (rank !== 0) return rank
        return new Date(a.deadline) - new Date(b.deadline)
      })
      .map(enrichItem)
  })

  function enrichItem(item) {
    const meta = HOMEWORK_STATUSES[item.status] || HOMEWORK_STATUSES.current
    const due = deadlineMeta(item.deadline, now.value)
    const canUpload = item.status === 'current' || item.status === 'rejected' || item.status === 'overdue'
    const canReupload = item.status === 'pending'
    const bonusCoins = item.grade === 5 && item.onTime ? HOMEWORK_FIVE_COINS : 0
    const onTimeCoins = item.status === 'approved' && item.onTime ? HOMEWORK_ON_TIME_COINS : 0

    return {
      ...item,
      subjectLabel: SUBJECT_LABELS[item.subject] || item.title,
      statusMeta: meta,
      issuedLabel: formatIssuedDate(item.issuedAt),
      deadlineLabel: formatDeadlineDate(item.deadline),
      deadlineTone: due.tone,
      deadlineHint: due.label,
      canUpload,
      canReupload,
      canDownload: (item.materials || []).length > 0,
      onTimeCoins,
      bonusCoins,
      coinsTotal: item.coinsEarned || 0,
    }
  }

  const visibleItems = computed(() => filteredItems.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < filteredItems.value.length)

  const isEmpty = computed(() => subjectItems.value.length === 0)
  const isEmptyFilter = computed(
    () => subjectItems.value.length > 0 && filteredItems.value.length === 0,
  )

  const uploadTarget = computed(() => {
    if (!uploadTargetId.value) return null
    const item = allItems.value.find((row) => row.id === uploadTargetId.value)
    return item ? enrichItem(item) : null
  })

  function resetVisible() {
    visibleCount.value = HOMEWORK_PAGE_INITIAL
  }

  watch([statusFilter, subjectFilter], resetVisible)

  function setStatusFilter(next) {
    if (!VALID_STATUS_FILTERS.has(next)) return
    statusFilter.value = next
  }

  function setSubjectFilter(value) {
    subjectFilter.value = value
  }

  function loadMore() {
    if (!hasMore.value) return
    visibleCount.value += HOMEWORK_PAGE_STEP
  }

  function openUpload(id) {
    uploadTargetId.value = id
  }

  function closeUpload() {
    uploadTargetId.value = null
  }

  function findRaw(id) {
    return sourceItems.value.find((item) => item.id === id)
  }

  function submitWork(id, file) {
    const item = findRaw(id)
    if (!item || !file) return false
    const submittedAt = new Date()
    item.submittedAt = submittedAt.toISOString()
    item.uploadedFileName = file.name
    item.onTime = submittedAt.getTime() <= new Date(item.deadline).getTime()
    item.status = 'pending'
    item.grade = null
    item.coinsEarned = 0
    closeUpload()
    statusFilter.value = 'pending'
    return true
  }

  function removeUpload(id) {
    const item = findRaw(id)
    if (!item) return
    const deadlinePassed = new Date(item.deadline) < now.value
    if (item.teacherComment) item.status = 'rejected'
    else if (deadlinePassed) item.status = 'overdue'
    else item.status = 'current'
    item.submittedAt = null
    item.uploadedFileName = null
    item.onTime = false
  }

  function downloadTask(item) {
    const lines = [
      item.title,
      item.topic ? `Тема: ${item.topic}` : '',
      `Предмет: ${item.subjectLabel || item.title}`,
      item.teacher ? `Преподаватель: ${item.teacher}` : '',
      item.description || '',
    ].filter(Boolean)
    downloadBlob(item.downloadFileName || 'zadanie.txt', `${lines.join('\n\n')}\n`)
  }

  return {
    statusFilter,
    subjectFilter,
    statusTabs,
    filteredItems,
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
  }
}
