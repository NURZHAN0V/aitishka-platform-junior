import { computed } from 'vue'
import { FORMULA_TOOLTIP, getAllTimeRanking } from '../constants/rating.js'

export function useRating() {
  const rankedStudents = computed(() => getAllTimeRanking())
  const formulaTooltip = computed(() => FORMULA_TOOLTIP)

  return {
    rankedStudents,
    formulaTooltip,
  }
}
