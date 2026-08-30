import { RATING_WIDGET_SNAPSHOT } from '@/modules/rating/constants/rating.js'

export const RATING_WIDGET_MOCK = RATING_WIDGET_SNAPSHOT

export const HOMEWORK_WIDGET_MOCK = {
  pending: 2,
  overdue: 1,
  linkHref: '/homework',
}

export const STREAKS_WIDGET_MOCK = {
  attendance: { current: 7, target: 10 },
  punctuality: { current: 4, target: 5 },
  profileBonus: 5,
  linkHref: '#',
}

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
  itemsLimit: 5,
  linkHref: '#',
  items: [
    {
      id: 1,
      type: 'grade',
      grade: 5,
      text: 'Получил оценку 5 по Python',
      date: '28 мая, 14:30',
    },
    {
      id: 2,
      type: 'homework',
      text: 'Сдал домашнюю работу',
      date: '27 мая, 19:15',
    },
    {
      id: 3,
      type: 'coins',
      amount: 3,
      text: '+3 монетки за ДЗ',
      date: '27 мая, 19:15',
    },
    {
      id: 4,
      type: 'attendance',
      text: 'Посетил занятие',
      date: '26 мая, 16:20',
    },
    {
      id: 5,
      type: 'grade',
      grade: 4,
      text: 'Получил оценку 4 по Математике',
      date: '25 мая, 13:45',
    },
  ],
}
