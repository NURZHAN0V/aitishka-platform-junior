import { computed, ref, watch } from 'vue'
import {
  COINS_MARKET_LINK,
  COINS_PAGE_INITIAL,
  COINS_PAGE_STEP,
  COINS_TX_TYPES,
  HISTORY_FILTERS,
  formatCoinsAmount,
  formatCoinsDate,
} from '../constants/coins.js'
import { useCoinsBalance, useCoinsHistorySource } from './useCoinsBalance.js'

const VALID_FILTERS = new Set(HISTORY_FILTERS.map((item) => item.id))

function enrichItem(item) {
  const typeMeta = COINS_TX_TYPES[item.type] || COINS_TX_TYPES.attendance
  const amountMeta = formatCoinsAmount(item.amount)
  const direction = item.amount >= 0 ? 'earn' : 'spend'

  return {
    ...item,
    typeMeta,
    direction,
    amountMeta,
    dateLabel: formatCoinsDate(item.at),
    href: typeMeta.href || null,
  }
}

export function useCoins() {
  const { balance } = useCoinsBalance()
  const historySource = useCoinsHistorySource()

  const marketLink = COINS_MARKET_LINK

  const directionFilter = ref('all')
  const visibleCount = ref(COINS_PAGE_INITIAL)

  const allItems = computed(() =>
    historySource.value
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .map(enrichItem),
  )

  const filterCounts = computed(() => {
    const counts = { all: allItems.value.length, earn: 0, spend: 0 }
    allItems.value.forEach((item) => {
      counts[item.direction] += 1
    })
    return counts
  })

  const filterTabs = computed(() =>
    HISTORY_FILTERS.map((tab) => ({
      ...tab,
      count: filterCounts.value[tab.id] ?? 0,
    })),
  )

  const filteredItems = computed(() => {
    if (directionFilter.value === 'all') return allItems.value
    return allItems.value.filter((item) => item.direction === directionFilter.value)
  })

  const visibleItems = computed(() => filteredItems.value.slice(0, visibleCount.value))
  const hasMore = computed(() => visibleCount.value < filteredItems.value.length)
  const isEmpty = computed(() => allItems.value.length === 0)
  const isEmptyFilter = computed(
    () => allItems.value.length > 0 && filteredItems.value.length === 0,
  )

  function resetVisible() {
    visibleCount.value = COINS_PAGE_INITIAL
  }

  watch(directionFilter, resetVisible)

  function setDirectionFilter(next) {
    if (!VALID_FILTERS.has(next)) return
    directionFilter.value = next
  }

  function loadMore() {
    if (!hasMore.value) return
    visibleCount.value += COINS_PAGE_STEP
  }

  return {
    balance,
    marketLink,
    directionFilter,
    filterTabs,
    visibleItems,
    hasMore,
    isEmpty,
    isEmptyFilter,
    setDirectionFilter,
    loadMore,
  }
}

export { useCoinsBalance, spendCoins } from './useCoinsBalance.js'
