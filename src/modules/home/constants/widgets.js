import { RATING_WIDGET_SNAPSHOT } from '@/modules/rating/constants/rating.js'
import { STREAKS_WIDGET_SNAPSHOT } from '@/modules/coins/constants/coins.js'
import {
  JOURNAL_WIDGET_LIMIT,
  JOURNAL_WIDGET_LINK,
  getRecentJournalEvents,
} from '@/modules/journal/constants/journal.js'

export const RATING_WIDGET_MOCK = RATING_WIDGET_SNAPSHOT

export const HOMEWORK_WIDGET_MOCK = {
  pending: 2,
  overdue: 1,
  linkHref: '/homework',
}

export const STREAKS_WIDGET_MOCK = STREAKS_WIDGET_SNAPSHOT

export const GRADES_WIDGET_MOCK = {
  attendancePercent: 86,
  periodLabel: 'За текущую неделю',
  statusLabel: 'Хорошо!',
  linkHref: '/grades',
  chartData: [
    { label: 'Пн', value: 100 },
    { label: 'Вт', value: 100 },
    { label: 'Ср', value: 50 },
    { label: 'Чт', value: 100 },
    { label: 'Пт', value: 100 },
    { label: 'Сб', value: 0 },
    { label: 'Вс', value: 0 },
  ],
}

export const JOURNAL_WIDGET_MOCK = {
  itemsLimit: JOURNAL_WIDGET_LIMIT,
  linkHref: JOURNAL_WIDGET_LINK,
  items: getRecentJournalEvents(),
}
