/** Реквизиты ООО «ИТ СОЧИ» (заглушки для MVP) */
export const MOCK_REQUISITES = {
  company: 'ООО «ИТ СОЧИ»',
  inn: '2320250123',
  bik: '040349602',
  account: '40702810900000001234',
  bank: 'Южное ГУ Банка России',
  studentCode: 'ITS-2026-0142',
  studentName: 'Алина Петрова',
}

export function buildPaymentPurpose(requisites = MOCK_REQUISITES) {
  return `Оплата обучения, ${requisites.studentName}, код ${requisites.studentCode}`
}

function isoDate(year, month, day) {
  const date = new Date(year, month - 1, day, 12, 0, 0, 0)
  return date.toISOString()
}

/** График платежей: дата оплаты, описание, сумма в рублях */
export const MOCK_SCHEDULE = [
  {
    id: 'sch-2026-06',
    dueDate: isoDate(2026, 6, 15),
    description: 'Обучение за июнь 2026',
    amount: 8000,
  },
  {
    id: 'sch-2026-07',
    dueDate: isoDate(2026, 7, 15),
    description: 'Обучение за июль 2026',
    amount: 8000,
  },
  {
    id: 'sch-2026-08',
    dueDate: isoDate(2026, 8, 15),
    description: 'Обучение за август 2026',
    amount: 8000,
  },
  {
    id: 'sch-2026-09',
    dueDate: isoDate(2026, 9, 15),
    description: 'Обучение за сентябрь 2026',
    amount: 8000,
  },
  {
    id: 'sch-2026-10',
    dueDate: isoDate(2026, 10, 15),
    description: 'Обучение за октябрь 2026',
    amount: 8000,
  },
]

/** История оплат (вносит учебная часть) */
export const MOCK_PAYMENTS = [
  {
    id: 'pay-2026-06',
    paidAt: isoDate(2026, 6, 12),
    purpose: 'Оплата обучения, Алина Петрова, код ITS-2026-0142 (июнь)',
    amount: 8000,
  },
  {
    id: 'pay-2026-07',
    paidAt: isoDate(2026, 7, 14),
    purpose: 'Оплата обучения, Алина Петрова, код ITS-2026-0142 (июль)',
    amount: 8000,
  },
  {
    id: 'pay-2026-08-partial',
    paidAt: isoDate(2026, 8, 20),
    purpose: 'Оплата обучения, Алина Петрова, код ITS-2026-0142 (август, частично)',
    amount: 3000,
  },
]
