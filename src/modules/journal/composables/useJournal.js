import { computed, ref, watch } from 'vue'
import {
  JOURNAL_EVENT_TYPES,
  JOURNAL_PAGE_INITIAL,
  JOURNAL_PAGE_STEP,
  MOCK_JOURNAL,
  TYPE_FILTERS,
  formatJournalDate,
  gradeIconName,
} from '../constants/journal.js'

const VALID_TYPE_FILTERS = new Set(TYPE_FILTERS.map((item) => item.id))

function enrichEvent(item) {
  const typeMeta = JOURNAL_EVENT_TYPES[item.type] || JOURNAL_EVENT_TYPES.attendance
  const icon =
    item.type === 'grade'
      ? { name: gradeIconName(item.grade), type: 'avif' }
      : typeMeta.icon

  return {
    ...item,
    typeMeta,
    icon,
    dateLabel: formatJournalDate(item.at),
    href: typeMeta.href || null,
  }
}

export function useJournal(sourceItems = MOCK_JOURNAL) {
  const typeFilter = ref('all')
  const visibleCount = ref(JOURNAL_PAGE_INITIAL)

  const allItems = computed(() =>
    sourceItems
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .map(enrichEvent),
  )

  const typeCounts = computed(() => {
    const counts = { all: allItems.value.length }
    Object.keys(JOURNAL_EVENT_TYPES).forEach((id) => {
      counts[id] = 0
    })
    allItems.value.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1
    })
    return counts
  })

  const typeTabs = computed(() =>
    TYPE_FILTERS.map((tab) => ({
      ...tab,
      count: typeCounts.value[tab.id] ?? 0,
    })),
  )

  const filteredItems = computed(() => {
    if (typeFilter.value === 'all') return allItems.value
    return allItems.value.filter((item) => item.type === typeFilter.value)
  })

  const visibleItems = computed(() => filteredItems.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < filteredItems.value.length)

  const isEmpty = computed(() => allItems.value.length === 0)
  const isEmptyFilter = computed(
    () => allItems.value.length > 0 && filteredItems.value.length === 0,
  )

  function resetVisible() {
    visibleCount.value = JOURNAL_PAGE_INITIAL
  }

  watch(typeFilter, resetVisible)

  function setTypeFilter(next) {
    if (!VALID_TYPE_FILTERS.has(next)) return
    typeFilter.value = next
  }

  function loadMore() {
    if (!hasMore.value) return
    visibleCount.value += JOURNAL_PAGE_STEP
  }

  return {
    typeFilter,
    typeTabs,
    filteredItems,
    visibleItems,
    hasMore,
    isEmpty,
    isEmptyFilter,
    setTypeFilter,
    loadMore,
  }
}
