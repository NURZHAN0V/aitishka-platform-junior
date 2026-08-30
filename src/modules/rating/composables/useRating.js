import { computed, ref, watch } from 'vue'
import { addMonths } from '@/modules/schedule/composables/useSchedule.js'
import {
  CURRENT_MONTH_KEY,
  FORMULA_TOOLTIP,
  LEADERBOARD_LIMIT,
  MOCK_RATING_BY_MONTH,
  PERIOD_TABS,
  PREVIOUS_MONTH_KEY,
  RATING_GRADES_WEIGHT,
  RATING_PERIOD_STORAGE_KEY,
  formatMonthTitle,
  getMonthRanking,
  toMonthKey,
} from '../constants/rating.js'

const VALID_PERIODS = new Set(PERIOD_TABS.map((tab) => tab.id))

function readStoredPeriod() {
  try {
    const value = localStorage.getItem(RATING_PERIOD_STORAGE_KEY)
    if (VALID_PERIODS.has(value)) return value
  } catch {
    // ignore
  }
  return 'current'
}

function saveStoredPeriod(value) {
  try {
    localStorage.setItem(RATING_PERIOD_STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

function monthTitleFromKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  return formatMonthTitle(new Date(year, month - 1, 1))
}

export function useRating() {
  const period = ref(readStoredPeriod())
  const fullListOpen = ref(false)
  const mobileDetailsOpen = ref(false)

  watch(period, (value) => saveStoredPeriod(value))

  const monthKey = computed(() =>
    period.value === 'previous' ? PREVIOUS_MONTH_KEY : CURRENT_MONTH_KEY,
  )

  const comparisonMonthKey = computed(() => {
    const [year, month] = monthKey.value.split('-').map(Number)
    return toMonthKey(addMonths(new Date(year, month - 1, 1), -1))
  })

  const rankedStudents = computed(() => getMonthRanking(monthKey.value))
  const previousRanking = computed(() => {
    if (!MOCK_RATING_BY_MONTH[comparisonMonthKey.value]) return []
    return getMonthRanking(comparisonMonthKey.value)
  })

  const total = computed(() => rankedStudents.value.length)
  const leaders = computed(() => rankedStudents.value.slice(0, LEADERBOARD_LIMIT))
  const currentStudent = computed(
    () => rankedStudents.value.find((row) => row.isCurrent) ?? null,
  )

  const previousStudent = computed(() => {
    if (!currentStudent.value || !previousRanking.value.length) return null
    return previousRanking.value.find((row) => row.id === currentStudent.value.id) ?? null
  })

  const isCurrentPeriod = computed(() => period.value === 'current')
  const periodLabel = computed(() => monthTitleFromKey(monthKey.value))
  const periodHint = computed(() =>
    isCurrentPeriod.value ? 'За текущий месяц' : 'Архив · прошлый месяц',
  )

  const dynamics = computed(() => {
    const now = currentStudent.value
    const prev = previousStudent.value
    if (!now || !prev) return null

    const pointsDelta = now.points - prev.points
    const rankDelta = prev.rank - now.rank
    let direction = 'same'
    if (pointsDelta > 0) direction = 'up'
    else if (pointsDelta < 0) direction = 'down'

    const prevMonthTitle = monthTitleFromKey(comparisonMonthKey.value)
    const absPoints = Math.abs(pointsDelta)
    const pointsText =
      pointsDelta === 0
        ? `Баллы как в ${prevMonthTitle.toLowerCase()}`
        : pointsDelta > 0
          ? `На ${absPoints} ${pluralPoints(absPoints)} выше, чем в ${prevMonthTitle.toLowerCase()}`
          : `На ${absPoints} ${pluralPoints(absPoints)} ниже, чем в ${prevMonthTitle.toLowerCase()}`

    let rankText = 'Место не изменилось'
    if (rankDelta > 0) rankText = `Место улучшилось: было ${prev.rank} из ${previousRanking.value.length}`
    else if (rankDelta < 0) rankText = `Место хуже: было ${prev.rank} из ${previousRanking.value.length}`

    return {
      direction,
      pointsDelta,
      rankDelta,
      label: pointsDelta === 0 ? '0' : `${pointsDelta > 0 ? '+' : '−'}${absPoints}`,
      tooltip: `${pointsText}. ${rankText}.`,
    }
  })

  const progressItems = computed(() => {
    const me = currentStudent.value
    if (!me) return []
    return [
      {
        id: 'grades',
        label: 'Средний балл',
        valueLabel: me.avgLabel,
        percent: me.gradesPercent,
        tooltip: `Шкала 2–5. Вклад в рейтинг: ${me.gradesShare} из ${Math.round(RATING_GRADES_WEIGHT * 100)} баллов.`,
      },
      {
        id: 'homework',
        label: 'ДЗ вовремя',
        valueLabel: `${me.homeworkPercent}%`,
        percent: me.homeworkPercent,
        tooltip: `Сдано вовремя и зачтено: ${me.homeworkOnTime} из ${me.homeworkTotal}. Вклад в рейтинг: ${me.homeworkShare} из ${Math.round((1 - RATING_GRADES_WEIGHT) * 100)} баллов.`,
      },
    ]
  })

  const formulaTooltip = FORMULA_TOOLTIP

  function setPeriod(next) {
    if (!VALID_PERIODS.has(next)) return
    period.value = next
  }

  function toggleFullList() {
    fullListOpen.value = !fullListOpen.value
  }

  function showFullList() {
    fullListOpen.value = true
  }

  function toggleMobileDetails() {
    mobileDetailsOpen.value = !mobileDetailsOpen.value
  }

  return {
    period,
    periodLabel,
    periodHint,
    isCurrentPeriod,
    rankedStudents,
    leaders,
    currentStudent,
    total,
    dynamics,
    progressItems,
    formulaTooltip,
    fullListOpen,
    mobileDetailsOpen,
    setPeriod,
    toggleFullList,
    showFullList,
    toggleMobileDetails,
  }
}

function pluralPoints(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'балл'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'балла'
  return 'баллов'
}
