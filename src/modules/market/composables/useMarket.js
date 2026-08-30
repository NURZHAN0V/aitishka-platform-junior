import { computed, ref } from 'vue'
import { spendCoins, useCoinsBalance } from '@/modules/coins/composables/useCoinsBalance.js'
import {
  MARKET_CATEGORIES,
  MARKET_SORT_OPTIONS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  ORDER_STATUSES,
  coinsWord,
  formatOrderDate,
} from '../constants/market.js'

const VALID_CATEGORIES = new Set(MARKET_CATEGORIES.map((c) => c.id))
const VALID_SORTS = new Set(MARKET_SORT_OPTIONS.map((o) => o.value))

function cloneProduct(item) {
  return { ...item }
}

function cloneOrder(item) {
  return { ...item }
}

const products = ref(MOCK_PRODUCTS.map(cloneProduct))
const orders = ref(MOCK_ORDERS.map(cloneOrder))

function productAction(product, balance) {
  if (product.stock <= 0) {
    return { id: 'out', label: 'Нет в наличии', disabled: true }
  }
  if (product.price > balance) {
    return { id: 'short', label: 'Не хватает монеток', disabled: true }
  }
  return { id: 'buy', label: 'Купить', disabled: false }
}

function enrichProduct(product, balance) {
  const action = productAction(product, balance)
  return {
    ...product,
    action,
    canBuy: action.id === 'buy',
    priceLabel: `${product.price} ${coinsWord(product.price)}`,
  }
}

function enrichOrder(order) {
  const statusMeta = ORDER_STATUSES[order.status] || ORDER_STATUSES.placed
  return {
    ...order,
    statusMeta,
    statusLabel: statusMeta.label,
    statusHint: statusMeta.hint,
    priceLabel: `${order.price} ${coinsWord(order.price)}`,
    dateLabel: formatOrderDate(order.createdAt),
  }
}

export function useMarket() {
  const { balance } = useCoinsBalance()

  const categoryFilter = ref('all')
  const sortBy = ref('price-asc')
  const purchaseTarget = ref(null)

  const categoryTabs = MARKET_CATEGORIES
  const sortOptions = MARKET_SORT_OPTIONS

  const enrichedProducts = computed(() =>
    products.value.map((item) => enrichProduct(item, balance.value)),
  )

  const filteredProducts = computed(() => {
    let list = enrichedProducts.value
    if (categoryFilter.value !== 'all') {
      list = list.filter((item) => item.category === categoryFilter.value)
    }

    const sorted = list.slice()
    if (sortBy.value === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name, 'ru'))
    } else if (sortBy.value === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name, 'ru'))
    } else if (sortBy.value === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    }
    return sorted
  })

  const isEmptyFilter = computed(() => filteredProducts.value.length === 0)

  const purchasePreview = computed(() => {
    const product = purchaseTarget.value
    if (!product) return null
    const enriched = enrichProduct(product, balance.value)
    return {
      ...enriched,
      balanceAfter: balance.value - product.price,
      balanceAfterLabel: `${balance.value - product.price} ${coinsWord(balance.value - product.price)}`,
    }
  })

  const allOrders = computed(() =>
    orders.value
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(enrichOrder),
  )

  const isOrdersEmpty = computed(() => allOrders.value.length === 0)

  function setCategoryFilter(next) {
    if (!VALID_CATEGORIES.has(next)) return
    categoryFilter.value = next
  }

  function setSortBy(next) {
    if (!VALID_SORTS.has(next)) return
    sortBy.value = next
  }

  function openPurchase(productId) {
    const product = products.value.find((item) => item.id === productId)
    if (!product) return
    const action = productAction(product, balance.value)
    if (action.id !== 'buy') return
    purchaseTarget.value = cloneProduct(product)
  }

  function closePurchase() {
    purchaseTarget.value = null
  }

  /**
   * Подтверждение покупки: списание монеток + заказ «Оформлен».
   * Студент не может отменить заказ.
   */
  function confirmPurchase() {
    const product = purchaseTarget.value
    if (!product) return { ok: false, reason: 'empty' }

    const live = products.value.find((item) => item.id === product.id)
    if (!live || live.stock <= 0) {
      closePurchase()
      return { ok: false, reason: 'out' }
    }
    if (live.price > balance.value) {
      closePurchase()
      return { ok: false, reason: 'short' }
    }

    const spent = spendCoins(live.price, {
      title: 'Покупка в маркете',
      context: live.name,
    })
    if (!spent) {
      closePurchase()
      return { ok: false, reason: 'short' }
    }

    live.stock -= 1

    orders.value = [
      {
        id: `o-${live.id}-${Date.now()}`,
        productId: live.id,
        productName: live.name,
        price: live.price,
        status: 'placed',
        illustration: live.illustration,
        accent: live.accent,
        createdAt: new Date().toISOString(),
      },
      ...orders.value,
    ]

    closePurchase()
    return { ok: true, productName: live.name }
  }

  return {
    balance,
    categoryFilter,
    sortBy,
    categoryTabs,
    sortOptions,
    filteredProducts,
    isEmptyFilter,
    purchaseTarget,
    purchasePreview,
    purchaseOpen: computed({
      get: () => Boolean(purchaseTarget.value),
      set: (open) => {
        if (!open) closePurchase()
      },
    }),
    allOrders,
    isOrdersEmpty,
    setCategoryFilter,
    setSortBy,
    openPurchase,
    closePurchase,
    confirmPurchase,
  }
}
