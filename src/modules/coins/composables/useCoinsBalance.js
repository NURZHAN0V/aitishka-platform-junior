import { ref } from 'vue'
import { MOCK_COINS_BALANCE, MOCK_COINS_HISTORY } from '../constants/coins.js'

/** Единый баланс и история на сессию — шапка, маркет, монетки */
const balance = ref(MOCK_COINS_BALANCE)
const historyItems = ref(MOCK_COINS_HISTORY.map((item) => ({ ...item })))

export function useCoinsBalance() {
  return { balance }
}

export function useCoinsHistorySource() {
  return historyItems
}

/**
 * Списание монеток после покупки в маркете.
 * @returns {boolean} удалось ли списать
 */
export function spendCoins(amount, { title = 'Покупка в маркете', context = '' } = {}) {
  const cost = Math.abs(Number(amount) || 0)
  if (cost <= 0 || balance.value < cost) return false

  balance.value -= cost
  historyItems.value = [
    {
      id: `c-market-${Date.now()}`,
      type: 'market',
      at: new Date().toISOString(),
      amount: -cost,
      title,
      context,
    },
    ...historyItems.value,
  ]
  return true
}

/**
 * Начисление монеток (фото в профиле и т.п.).
 * @returns {boolean} удалось ли начислить
 */
export function earnCoins(amount, { type = 'profile', title = '', context = '' } = {}) {
  const value = Math.abs(Number(amount) || 0)
  if (value <= 0) return false

  balance.value += value
  historyItems.value = [
    {
      id: `c-earn-${type}-${Date.now()}`,
      type,
      at: new Date().toISOString(),
      amount: value,
      title,
      context,
    },
    ...historyItems.value,
  ]
  return true
}
