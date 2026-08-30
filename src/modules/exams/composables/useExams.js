import { computed, ref, watch } from 'vue'
import {
  addMonths,
  formatMonthYear,
  isSameDay,
  isSameMonth,
  startOfDay,
} from '@/modules/schedule/composables/useSchedule.js'
import {
  EXAM_STATUSES,
  EXAMS_PERIOD_STORAGE_KEY,
  GRADE_SCALE,
  MOCK_EXAMS,
  PERIOD_TABS,
  STATUS_FILTERS,
  SUBJECT_LABELS,
} from '../constants/exams.js'

const VALID_PERIODS = new Set(PERIOD_TABS.map((tab) => tab.id))
const VALID_STATUS_FILTERS = new Set(STATUS_FILTERS.map((item) => item.id))

function cloneItem(item) {
  return {
    ...item,
    materials: (item.materials || []).map((file) => ({ ...file })),
  }
}

const examItems = ref(MOCK_EXAMS.map(cloneItem))

function readStored(key, validSet, fallback) {
  try {
    const value = localStorage.getItem(key)
    if (validSet.has(value)) return value
  } catch {
    // ignore
  }
  return fallback
}

function saveStored(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function pluralRu(n, one, few, many) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs > 10 && abs < 20) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

function formatDateLong(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(new Date(iso))
}

function formatDeadlineDate(iso) {
  const date = new Date(iso)
  const dayMonth = formatDateLong(iso)
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${dayMonth}, ${time}`
}

function scoreTone(score) {
  if (score == null) return 'muted'
  if (score >= 5) return 'excellent'
  if (score >= 4) return 'good'
  if (score >= 3) return 'ok'
  return 'bad'
}

export function effectiveStatus(item, now = new Date()) {
  if (item.grade != null || item.status === 'checked') return 'checked'
  if (item.uploadedFileName || item.status === 'uploaded') return 'uploaded'
  if (new Date(item.deadline) < now) return 'missed'
  return 'awaiting'
}

export function canUploadExam(item, now = new Date()) {
  const status = effectiveStatus(item, now)
  if (status === 'uploaded' || status === 'checked') return false
  if (item.uploadedFileName) return false
  return new Date(item.reviewDate) > now
}

export function urgencyMeta(item, now = new Date()) {
  const status = effectiveStatus(item, now)
  if (status === 'checked' || status === 'uploaded') return null

  const deadline = new Date(item.deadline)
  const review = new Date(item.reviewDate)

  if (now >= review) {
    return {
      id: 'closed',
      label: 'Закрыто',
      tone: 'danger',
      tooltip: 'Дата проверки прошла, загрузка больше недоступна',
    }
  }

  if (deadline < now || isSameDay(deadline, now)) {
    return {
      id: 'critical',
      label: 'Срочно',
      tone: 'danger',
      tooltip:
        deadline < now
          ? 'Срок сдачи прошёл. Загрузить ещё можно до даты проверки — только один раз'
          : 'Конечная дата сегодня. Загрузить можно один раз',
    }
  }

  const days = Math.max(
    1,
    Math.round((startOfDay(deadline).getTime() - startOfDay(now).getTime()) / 86_400_000),
  )

  if (days <= 2) {
    return {
      id: 'approaching',
      label: 'Скоро',
      tone: 'warning',
      tooltip: `До конечной даты ${days} ${pluralRu(days, 'день', 'дня', 'дней')}`,
    }
  }

  return null
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
      label: `Срок прошёл ${daysLate} ${pluralRu(daysLate, 'день', 'дня', 'дней')} назад`,
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

function statusRank(item) {
  if (item.canUpload && item.urgency?.id === 'critical') return 0
  if (item.canUpload && item.urgency?.id === 'approaching') return 1
  if (item.canUpload) return 2
  if (item.status === 'uploaded') return 3
  if (item.status === 'missed') return 4
  return 5
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

export function useExams(sourceItems = examItems) {
  const now = ref(new Date())
  const period = ref(readStored(EXAMS_PERIOD_STORAGE_KEY, VALID_PERIODS, 'month'))
  const viewMode = ref('detailed')
  const anchorDate = ref(startOfDay(now.value))
  const subjectFilter = ref('all')
  const statusFilter = ref('all')
  const uploadTargetId = ref(null)

  watch(period, (value) => saveStored(EXAMS_PERIOD_STORAGE_KEY, value))

  function inSelectedPeriod(item) {
    if (period.value === 'all') return true
    const deadline = new Date(item.deadline)
    const review = new Date(item.reviewDate)
    return isSameMonth(deadline, anchorDate.value) || isSameMonth(review, anchorDate.value)
  }

  const allItems = computed(() =>
    sourceItems.value.map((item) => {
      const status = effectiveStatus(item, now.value)
      return { ...item, status }
    }),
  )

  const periodItems = computed(() =>
    allItems.value.filter((item) => {
      if (subjectFilter.value !== 'all' && item.subject !== subjectFilter.value) return false
      return inSelectedPeriod(item)
    }),
  )

  const periodLabel = computed(() => {
    if (period.value === 'all') return 'Весь период обучения'
    return formatMonthYear(anchorDate.value)
  })

  const statusCounts = computed(() => {
    const counts = { all: 0, awaiting: 0, uploaded: 0, checked: 0, missed: 0 }
    periodItems.value.forEach((item) => {
      counts.all += 1
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

  function enrichItem(item) {
    const meta = EXAM_STATUSES[item.status] || EXAM_STATUSES.awaiting
    const due =
      item.status === 'checked'
        ? {
            tone: 'success',
            label: item.reviewedAt
              ? `Проверено ${formatDateLong(item.reviewedAt)}`
              : 'Проверено',
          }
        : item.status === 'uploaded'
          ? {
              tone: 'warning',
              label: `Ожидает проверки до ${formatDateLong(item.reviewDate)}`,
            }
          : deadlineMeta(item.deadline, now.value)
    const urgency = urgencyMeta(item, now.value)
    const canUpload = canUploadExam(item, now.value)
    const hasFile = Boolean(item.uploadedFileName)

    return {
      ...item,
      subjectLabel: SUBJECT_LABELS[item.subject] || item.title,
      statusMeta: meta,
      deadlineLabel: formatDeadlineDate(item.deadline),
      deadlineTone: due.tone,
      deadlineHint: due.label,
      reviewLabel: formatDateLong(item.reviewDate),
      reviewedLabel: item.reviewedAt ? formatDateLong(item.reviewedAt) : null,
      submittedLabel: item.submittedAt ? formatDeadlineDate(item.submittedAt) : null,
      canUpload,
      canViewWork: hasFile,
      canDownload: (item.materials || []).length > 0,
      urgency,
      gradeLabel: item.grade == null ? '—' : String(item.grade),
      gradeTitle: item.grade == null ? 'Пока нет оценки' : GRADE_SCALE[item.grade]?.label ?? '',
      tone: item.grade == null ? 'muted' : scoreTone(item.grade),
      uploadDisabledReason: hasFile
        ? 'Работу уже загрузили — повторно нельзя'
        : new Date(item.reviewDate) <= now.value
          ? 'Дата проверки прошла, загрузка закрыта'
          : null,
    }
  }

  const filteredItems = computed(() => {
    const list = periodItems.value.filter((item) => {
      if (statusFilter.value === 'all') return true
      return item.status === statusFilter.value
    })

    return list
      .map(enrichItem)
      .sort((a, b) => {
        const rank = statusRank(a) - statusRank(b)
        if (rank !== 0) return rank
        return new Date(a.deadline) - new Date(b.deadline)
      })
  })

  const isEmptyPeriod = computed(() => {
    const unfiltered = allItems.value.filter((item) => inSelectedPeriod(item))
    return unfiltered.length === 0
  })

  const isEmptyFilter = computed(
    () => !isEmptyPeriod.value && filteredItems.value.length === 0,
  )

  const uploadTarget = computed(() => {
    if (!uploadTargetId.value) return null
    const item = allItems.value.find((row) => row.id === uploadTargetId.value)
    return item ? enrichItem(item) : null
  })

  function setPeriod(next) {
    if (!VALID_PERIODS.has(next)) return
    period.value = next
  }

  function setSubjectFilter(value) {
    subjectFilter.value = value
  }

  function setStatusFilter(next) {
    if (!VALID_STATUS_FILTERS.has(next)) return
    statusFilter.value = next
  }

  function goToPrevPeriod() {
    if (period.value !== 'month') return
    anchorDate.value = addMonths(anchorDate.value, -1)
  }

  function goToNextPeriod() {
    if (period.value !== 'month') return
    anchorDate.value = addMonths(anchorDate.value, 1)
  }

  function goToCurrentPeriod() {
    now.value = new Date()
    anchorDate.value = startOfDay(now.value)
  }

  function openUpload(id) {
    const item = allItems.value.find((row) => row.id === id)
    if (!item || !canUploadExam(item, now.value)) return
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
    if (!canUploadExam(item, now.value)) return false
    item.submittedAt = new Date().toISOString()
    item.uploadedFileName = file.name
    item.status = 'uploaded'
    item.grade = null
    closeUpload()
    statusFilter.value = 'uploaded'
    return true
  }

  function downloadTask(item) {
    const lines = [
      item.title,
      `Предмет: ${item.subjectLabel || item.title}`,
      item.teacher ? `Преподаватель: ${item.teacher}` : '',
      item.deadlineLabel ? `Конечная дата: ${item.deadlineLabel}` : '',
      item.reviewLabel ? `Дата проверки: ${item.reviewLabel}` : '',
      item.program ? `Программа:\n${item.program}` : '',
      item.recommendations ? `Рекомендации:\n${item.recommendations}` : '',
      (item.materials || []).length
        ? `Материалы:\n${item.materials.map((file) => file.name).join('\n')}`
        : '',
    ].filter(Boolean)
    downloadBlob(`${item.id}.txt`, `${lines.join('\n\n')}\n`)
  }

  function viewWork(item) {
    if (!item?.uploadedFileName) return
    const lines = [
      item.title,
      `Файл: ${item.uploadedFileName}`,
      item.submittedLabel ? `Загружено: ${item.submittedLabel}` : '',
      item.grade != null ? `Оценка: ${item.grade}` : 'На проверке',
      item.teacherComment || '',
    ].filter(Boolean)
    downloadBlob(item.uploadedFileName, `${lines.join('\n\n')}\n`)
  }

  return {
    period,
    viewMode,
    subjectFilter,
    statusFilter,
    periodLabel,
    statusTabs,
    filteredItems,
    isEmptyPeriod,
    isEmptyFilter,
    uploadTarget,
    setPeriod,
    setSubjectFilter,
    setStatusFilter,
    goToPrevPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    openUpload,
    closeUpload,
    submitWork,
    downloadTask,
    viewWork,
  }
}
