import { computed, onScopeDispose, ref, watch } from 'vue'
import { APP_SHELL_TABLET_MQ } from '@/core/composables/useAppShell.js'
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
  HOMEWORK_FIVE_COINS,
  MOCK_GRADES,
  MOCK_HOMEWORK_ON_TIME_RATIO,
  PERIOD_TABS,
  RATING_GRADES_WEIGHT,
  WORK_TYPES,
} from '../constants/grades.js'

const VALID_PERIODS = new Set(PERIOD_TABS.map((tab) => tab.id))
const GRADES_VIEW_STORAGE_KEY_LEGACY = 'elektronnyj-dnevnik:grades-view'

try {
  localStorage.removeItem(GRADES_VIEW_STORAGE_KEY_LEGACY)
} catch {
  // ignore
}

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

function isCompactViewport() {
  return typeof window !== 'undefined' && window.matchMedia(APP_SHELL_TABLET_MQ).matches
}

function initialPeriod() {
  if (isCompactViewport()) return 'day'
  return readStored(GRADES_PERIOD_STORAGE_KEY, VALID_PERIODS, 'month')
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
  const period = ref(initialPeriod())
  const viewMode = ref('detailed')
  const anchorDate = ref(startOfDay(new Date(2026, 7, 30)))
  const expandedGradeId = ref(null)
  const isCompactGrades = ref(isCompactViewport())

  function syncCompactGrades(matches) {
    isCompactGrades.value = matches
    if (matches && period.value !== 'day') {
      period.value = 'day'
    }
  }

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia(APP_SHELL_TABLET_MQ)
    syncCompactGrades(mediaQuery.matches)

    const mediaHandler = (event) => {
      syncCompactGrades(event.matches)
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', mediaHandler)
      onScopeDispose(() => mediaQuery.removeEventListener('change', mediaHandler))
    } else {
      mediaQuery.addListener(mediaHandler)
      onScopeDispose(() => mediaQuery.removeListener(mediaHandler))
    }
  }

  watch(period, (value) => saveStored(GRADES_PERIOD_STORAGE_KEY, value))

  const allGrades = computed(() =>
    [...gradesSource].sort((a, b) => new Date(b.date) - new Date(a.date)),
  )

  const periodGrades = computed(() =>
    allGrades.value.filter((grade) => inPeriod(new Date(grade.date), period.value, anchorDate.value)),
  )

  const filteredGrades = periodGrades

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

  function setPeriod(next) {
    if (!VALID_PERIODS.has(next)) return
    if (isCompactGrades.value && next !== 'day') return
    period.value = next
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
    isCompactGrades,
    viewMode,
    anchorDate,
    expandedGradeId,
    periodLabel,
    averageGrade,
    averageLabel,
    averageTone,
    averageQualitative,
    dynamicsPoints,
    recentGrades: enrichedRecentGrades,
    filteredGrades: enrichedFilteredGrades,
    motivation,
    counts,
    isEmptyPeriod,
    setPeriod,
    goToPrevPeriod,
    goToNextPeriod,
    goToCurrentPeriod,
    toggleGrade,
    enrichGrade,
  }
}

export { formatAverage, scoreTone, formatGradeDate }
