import { computed, ref, watch } from 'vue'
import {
  FORMULA_TOOLTIP,
  FORMULA_TOOLTIP_ALL_TIME,
  PERIOD_TABS,
  RATING_PERIOD_STORAGE_KEY,
  getRankingForPeriod,
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

export function useRating() {
  const period = ref(readStoredPeriod())

  watch(period, (value) => saveStoredPeriod(value))

  const rankedStudents = computed(() => getRankingForPeriod(period.value))

  const formulaTooltip = computed(() =>
    period.value === 'current' ? FORMULA_TOOLTIP : FORMULA_TOOLTIP_ALL_TIME,
  )

  function setPeriod(next) {
    if (!VALID_PERIODS.has(next)) return
    period.value = next
  }

  return {
    period,
    rankedStudents,
    formulaTooltip,
    setPeriod,
  }
}
