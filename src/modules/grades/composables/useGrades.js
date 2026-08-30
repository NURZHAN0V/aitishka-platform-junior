import { computed, ref, watch } from 'vue'
import {
  addDays,
  addMonths,
  formatDayMonthYear,
  formatMonthYear,
  formatWeekRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfWeek,
} from '@/modules/schedule/composables/useSchedule.js'
import { WEEKDAY_SHORT } from '@/modules/schedule/constants/lessons.js'
import {
  GRADE_SCALE,
  GRADE_STATUS,
  GRADES_PERIOD_STORAGE_KEY,
  GRADES_VIEW_STORAGE_KEY,
  HOMEWORK_FIVE_COINS,
  MOCK_GRADES,
  MOCK_HOMEWORK_ON_TIME_RATIO,
  PERIOD_TABS,
  RATING_GRADES_WEIGHT,
  SUBJECT_LABELS,
  VIEW_TABS,
  WORK_TYPES,
} from '../constants/grades.js'

const VALID_PERIODS = new Set(PERIOD_TABS.map((tab) => tab.id))
const VALID_VIEWS = new Set(VIEW_TABS.map((tab) => tab.id))

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

function inPeriod(date, period, anchor) {
  if (period === 'day') return isSameDay(date, anchor)
  if (period === 'week') {
    const start = startOfWeek(anchor)
    const end = addDays(start, 7)
    return date >= start && date < end
  }
  return isSameMonth(date, anchor)
}

function averageScores(grades) {
  const scored = grades.filter((g) => typeof g.score === 'number')
  if (!scored.length) return null
  const sum = scored.reduce((acc, g) => acc + g.score, 0)
  return Math.round((sum / scored.length) * 100) / 100
}

function formatAverage(value) {
  if (value == null) return '—'
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '')
}

function scoreTone(score) {
  if (score == null) return 'muted'
  if (score >= 5) return 'excellent'
  if (score >= 4) return 'good'
  if (score >= 3) return 'ok'
  return 'bad'
}

function formatGradeDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatGradeDateShort(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function useGrades(gradesSource = MOCK_GRADES) {
  const period = ref(readStored(GRADES_PERIOD_STORAGE_KEY, VALID_PERIODS, 'month'))
  const viewMode = ref(readStored(GRADES_VIEW_STORAGE_KEY, VALID_VIEWS, 'summary'))
  const anchorDate = ref(startOfDay(new Date(2026, 7, 30)))
  const subjectFilter = ref('all')
  const workTypeFilter = ref('all')
  const expandedGradeId = ref(null)

  watch(period, (value) => saveStored(GRADES_PERIOD_STORAGE_KEY, value))
  watch(viewMode, (value) => saveStored(GRADES_VIEW_STORAGE_KEY, value))

  const allGrades = computed(() =>
    [...gradesSource].sort((a, b) => new Date(b.date) - new Date(a.date)),
  )

  const periodGrades = computed(() =>
    allGrades.value.filter((grade) => inPeriod(new Date(grade.date), period.value, anchorDate.value)),
  )

  const filteredGrades = computed(() =>
    periodGrades.value.filter((grade) => {
      if (subjectFilter.value !== 'all' && grade.subject !== subjectFilter.value) return false
      if (workTypeFilter.value !== 'all' && grade.workType !== workTypeFilter.value) return false
      return true
    }),
  )

  const periodLabel = computed(() => {
    if (period.value === 'day') return formatDayMonthYear(anchorDate.value)
    if (period.value === 'week') return formatWeekRange(startOfWeek(anchorDate.value))
    return formatMonthYear(anchorDate.value)
  })

  const averageGrade = computed(() => averageScores(filteredGrades.value))
  const averageLabel = computed(() => formatAverage(averageGrade.value))
  const averageTone = computed(() => {
    if (averageGrade.value == null) return 'muted'
    if (averageGrade.value >= 4.5) return 'excellent'
    if (averageGrade.value >= 3.5) return 'good'
    if (averageGrade.value >= 2.5) return 'ok'
    return 'bad'
  })

  const averageQualitative = computed(() => {
    if (averageGrade.value == null) return 'Нет оценок'
    if (averageGrade.value >= 4.5) return GRADE_SCALE[5].label
    if (averageGrade.value >= 3.5) return GRADE_SCALE[4].label
    if (averageGrade.value >= 2.5) return GRADE_SCALE[3].label
    return GRADE_SCALE[2].label
  })

  const recentGrades = computed(() => filteredGrades.value.slice(0, 5))

  const dynamicsPoints = computed(() => {
    if (period.value === 'day') return []

    const scored = filteredGrades.value
      .filter((g) => typeof g.score === 'number')
      .slice()
      .reverse()

    if (period.value === 'week') {
      const weekStart = startOfWeek(anchorDate.value)
      const days = Array.from({ length: 7 }, (_, index) => {
        const day = addDays(weekStart, index)
        const dayGrades = scored.filter((g) => isSameDay(new Date(g.date), day))
        return {
          label: WEEKDAY_SHORT[index].toLowerCase(),
          value: averageScores(dayGrades),
        }
      })
      return days.some((d) => d.value != null) ? days : []
    }

    if (!scored.length) return []

    const byWeek = new Map()
    scored.forEach((grade) => {
      const weekKey = startOfWeek(new Date(grade.date)).toISOString()
      if (!byWeek.has(weekKey)) byWeek.set(weekKey, [])
      byWeek.get(weekKey).push(grade)
    })

    return [...byWeek.entries()]
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([weekKey, list], index) => ({
        label: `Нед. ${index + 1}`,
        value: averageScores(list),
        weekStart: weekKey,
      }))
      .filter((point) => point.value != null)
  })

  function enrichGrade(grade) {
    const statuses = (grade.statuses || [])
      .map((id) => GRADE_STATUS[id])
      .filter(Boolean)

    return {
      ...grade,
      workTypeLabel: WORK_TYPES[grade.workType]?.label ?? grade.workType,
      scoreLabel: grade.score == null ? 'н/а' : String(grade.score),
      scoreTitle: grade.score == null ? 'Не аттестован' : GRADE_SCALE[grade.score]?.label ?? '',
      tone: grade.score == null ? 'muted' : scoreTone(grade.score),
      dateLabel: formatGradeDate(grade.date),
      dateShort: formatGradeDateShort(grade.date),
      statusMeta: statuses,
    }
  }

  const subjectSummaries = computed(() => {
    const map = new Map()

    filteredGrades.value.forEach((grade) => {
      if (!map.has(grade.subject)) {
        map.set(grade.subject, {
          subject: grade.subject,
          title: SUBJECT_LABELS[grade.subject] || grade.title,
          grades: [],
        })
      }
      map.get(grade.subject).grades.push(grade)
    })

    return [...map.values()]
      .map((row) => {
        const avg = averageScores(row.grades)
        return {
          ...row,
          count: row.grades.length,
          average: avg,
          averageLabel: formatAverage(avg),
          tone: scoreTone(avg == null ? null : Math.round(avg)),
          latest: enrichGrade(row.grades[0]),
        }
      })
      .sort((a, b) => a.title.localeCompare(b.title, 'ru'))
  })

  const homeworkFivesInPeriod = computed(() =>
    filteredGrades.value.filter(
      (g) => g.workType === 'homework' && g.score === 5 && (g.coinsEarned ?? 0) > 0,
    ),
  )

  const coinsFromFives = computed(() =>
    homeworkFivesInPeriod.value.reduce(
      (sum, g) => sum + (g.coinsEarned || HOMEWORK_FIVE_COINS),
      0,
    ),
  )

  /** Вклад среднего балла в рейтинг месяца (шкала 2–5 → 0–100) */
  const ratingFromGrades = computed(() => {
    if (averageGrade.value == null) return null
    const normalized = ((averageGrade.value - 2) / 3) * 100
    return Math.round(Math.min(100, Math.max(0, normalized)) * RATING_GRADES_WEIGHT)
  })

  const ratingFromHomework = computed(() =>
    Math.round(MOCK_HOMEWORK_ON_TIME_RATIO * 100 * (1 - RATING_GRADES_WEIGHT)),
  )

  const motivation = computed(() => ({
    averageLabel: averageLabel.value,
    ratingFromGrades: ratingFromGrades.value,
    ratingFromHomework: ratingFromHomework.value,
    ratingTotal:
      ratingFromGrades.value == null
        ? null
        : ratingFromGrades.value + ratingFromHomework.value,
    coinsFromFives: coinsFromFives.value,
    fivesCount: homeworkFivesInPeriod.value.length,
    homeworkOnTimePercent: Math.round(MOCK_HOMEWORK_ON_TIME_RATIO * 100),
  }))

  const counts = computed(() => ({
    total: filteredGrades.value.length,
    period: periodGrades.value.length,
  }))

  const isEmptyPeriod = computed(() => periodGrades.value.length === 0)
  const isEmptyFilter = computed(
    () => periodGrades.value.length > 0 && filteredGrades.value.length === 0,
  )

  function setPeriod(next) {
    if (!VALID_PERIODS.has(next)) return
    period.value = next
    expandedGradeId.value = null
  }

  function setViewMode(next) {
    if (!VALID_VIEWS.has(next)) return
    viewMode.value = next
    expandedGradeId.value = null
  }

  function setSubjectFilter(value) {
    subjectFilter.value = value
    expandedGradeId.value = null
  }

  function setWorkTypeFilter(value) {
    workTypeFilter.value = value
    expandedGradeId.value = null
  }

  function goToPrevPeriod() {
    if (period.value === 'day') anchorDate.value = addDays(anchorDate.value, -1)
    else if (period.value === 'week') anchorDate.value = addDays(anchorDate.value, -7)
    else anchorDate.value = addMonths(anchorDate.value, -1)
    expandedGradeId.value = null
  }

  function goToNextPeriod() {
    if (period.value === 'day') anchorDate.value = addDays(anchorDate.value, 1)
    else if (period.value === 'week') anchorDate.value = addDays(anchorDate.value, 7)
    else anchorDate.value = addMonths(anchorDate.value, 1)
    expandedGradeId.value = null
  }

  function goToCurrentPeriod() {
    anchorDate.value = startOfDay(new Date(2026, 7, 30))
    expandedGradeId.value = null
  }

  function toggleGrade(id) {
    expandedGradeId.value = expandedGradeId.value === id ? null : id
  }

  const enrichedFilteredGrades = computed(() => filteredGrades.value.map(enrichGrade))
  const enrichedRecentGrades = computed(() => recentGrades.value.map(enrichGrade))

  return {
    period,
    viewMode,
    anchorDate,
    subjectFilter,
    workTypeFilter,
    expandedGradeId,
    periodLabel,
    averageGrade,
    averageLabel,
    averageTone,
    averageQualitative,
    dynamicsPoints,
    recentGrades: enrichedRecentGrades,
    filteredGrades: enrichedFilteredGrades,
    subjectSummaries,
    motivation,
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
    enrichGrade,
  }
}

export { formatAverage, scoreTone, formatGradeDate }
