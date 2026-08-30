import { computed, ref } from 'vue'
import { startOfDay } from '@/modules/schedule/composables/useSchedule.js'
import {
  buildPaymentPurpose,
  MOCK_PAYMENTS,
  MOCK_REQUISITES,
  MOCK_SCHEDULE,
} from '../constants/payments.js'

function formatMoney(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateLong(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatDateShort(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

async function copyText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  textarea.remove()
  return ok
}

export function usePayments({
  requisites = MOCK_REQUISITES,
  schedule = MOCK_SCHEDULE,
  payments = MOCK_PAYMENTS,
} = {}) {
  const now = ref(new Date())

  const purpose = computed(() => buildPaymentPurpose(requisites))

  const requisitesFields = computed(() => [
    { id: 'company', label: 'Получатель', value: requisites.company },
    { id: 'inn', label: 'ИНН', value: requisites.inn },
    { id: 'bik', label: 'БИК', value: requisites.bik },
    { id: 'account', label: 'Расчётный счёт', value: requisites.account },
    { id: 'bank', label: 'Банк', value: requisites.bank },
    { id: 'studentCode', label: 'Код студента', value: requisites.studentCode },
    { id: 'purpose', label: 'Назначение платежа', value: purpose.value },
  ])

  const allBlockText = computed(() =>
    requisitesFields.value.map((field) => `${field.label}: ${field.value}`).join('\n'),
  )

  const scheduleTotal = computed(() =>
    schedule.reduce((sum, item) => sum + item.amount, 0),
  )

  const paymentsTotal = computed(() =>
    payments.reduce((sum, item) => sum + item.amount, 0),
  )

  /** Задолженность: сумма по наступившим строкам графика − сумма оплат */
  const debt = computed(() => {
    const today = startOfDay(now.value)
    const dueTotal = schedule
      .filter((item) => startOfDay(new Date(item.dueDate)) <= today)
      .reduce((sum, item) => sum + item.amount, 0)
    return Math.max(0, dueTotal - paymentsTotal.value)
  })

  const hasDebt = computed(() => debt.value > 0)

  const scheduleRows = computed(() =>
    [...schedule]
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map((item) => ({
        ...item,
        dueLabel: formatDateLong(item.dueDate),
        dueShort: formatDateShort(item.dueDate),
        amountLabel: formatMoney(item.amount),
        isPast: startOfDay(new Date(item.dueDate)) < startOfDay(now.value),
      })),
  )

  const historyRows = computed(() =>
    [...payments]
      .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
      .map((item) => ({
        ...item,
        dateLabel: formatDateLong(item.paidAt),
        dateShort: formatDateShort(item.paidAt),
        amountLabel: formatMoney(item.amount),
      })),
  )

  const isScheduleEmpty = computed(() => scheduleRows.value.length === 0)
  const isHistoryEmpty = computed(() => historyRows.value.length === 0)

  const debtLabel = computed(() => formatMoney(-debt.value))
  const debtAbsoluteLabel = computed(() => formatMoney(debt.value))

  async function copyField(value) {
    try {
      const ok = await copyText(String(value))
      return ok
    } catch {
      return false
    }
  }

  async function copyAllRequisites() {
    return copyField(allBlockText.value)
  }

  return {
    requisitesFields,
    allBlockText,
    purpose,
    scheduleRows,
    historyRows,
    debt,
    hasDebt,
    debtLabel,
    debtAbsoluteLabel,
    scheduleTotal,
    paymentsTotal,
    isScheduleEmpty,
    isHistoryEmpty,
    copyField,
    copyAllRequisites,
  }
}
