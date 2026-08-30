import { computed } from 'vue'
import {
  MOCK_REVIEWS,
  SUBJECT_LABELS,
  formatReviewDate,
} from '../constants/reviews.js'

function enrichReview(item) {
  return {
    ...item,
    subjectLabel: SUBJECT_LABELS[item.subject] || item.subject,
    dateLabel: formatReviewDate(item.at),
  }
}

export function useReviews(sourceItems = MOCK_REVIEWS) {
  const items = computed(() =>
    sourceItems
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .map(enrichReview),
  )

  const isEmpty = computed(() => items.value.length === 0)

  return {
    items,
    isEmpty,
  }
}
