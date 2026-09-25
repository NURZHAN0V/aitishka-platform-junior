import { computed } from 'vue'
import { getAllTimeRanking, groupByRank } from '../constants/rating.js'

export function useRating() {
  const rankedStudents = computed(() => getAllTimeRanking())
  const rankGroups = computed(() => groupByRank(rankedStudents.value))

  return {
    rankedStudents,
    rankGroups,
  }
}
