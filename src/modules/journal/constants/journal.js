import { BRAND_ILLUSTRATIONS, JOURNAL_ILLUSTRATIONS, WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'

/** Первая порция ленты */
export const JOURNAL_PAGE_INITIAL = 12
/** Шаг кнопки «Показать ещё» */
export const JOURNAL_PAGE_STEP = 12

/** События виджета на главной — за последние N дней */
export const JOURNAL_WIDGET_DAYS = 7
export const JOURNAL_WIDGET_LIMIT = 5
export const JOURNAL_WIDGET_LINK = '/journal'

/**
 * Типы событий журнала (строго по produkt / elektronnyj-dnevnik).
 * href — связанный раздел, если переход уместен.
 */
export const JOURNAL_EVENT_TYPES = {
  attendance: {
    id: 'attendance',
    label: 'Посетил занятие',
    filterLabel: 'Посещения',
    chip: 'approved',
    href: '/schedule',
    icon: { name: JOURNAL_ILLUSTRATIONS.attendance, type: 'avif' },
  },
  homework: {
    id: 'homework',
    label: 'Сдал домашнюю работу',
    filterLabel: 'Домашние задания',
    chip: 'current',
    href: '/homework',
    icon: { name: WIDGET_ILLUSTRATIONS.homeworkNotepad, type: 'avif' },
  },
  exam: {
    id: 'exam',
    label: 'Сдал экзамен',
    filterLabel: 'Экзамены',
    chip: 'pending',
    href: '/exams',
    icon: { name: 'clipboard', type: 'svg' },
  },
  grade: {
    id: 'grade',
    label: 'Получил оценку',
    filterLabel: 'Оценки',
    chip: 'approved',
    href: '/grades',
    icon: { name: JOURNAL_ILLUSTRATIONS.gradeDisc, type: 'avif' },
  },
  coins: {
    id: 'coins',
    label: 'Получил монетки',
    filterLabel: 'Монетки',
    chip: 'pending',
    href: '/coins',
    icon: { name: BRAND_ILLUSTRATIONS.coin, type: 'avif' },
  },
  review: {
    id: 'review',
    label: 'Получил отзыв',
    filterLabel: 'Отзывы',
    chip: 'current',
    href: '/reviews',
    icon: { name: 'user', type: 'svg' },
  },
  survey: {
    id: 'survey',
    label: 'Прошёл опрос',
    filterLabel: 'Опросы',
    chip: 'approved',
    href: null,
    icon: { name: 'check-circle', type: 'svg' },
  },
  market: {
    id: 'market',
    label: 'Оформил заказ',
    filterLabel: 'Маркет',
    chip: 'overdue',
    href: '/market',
    icon: { name: 'shopping-bag', type: 'svg' },
  },
  yandex: {
    id: 'yandex',
    label: 'Отзыв на Яндекс',
    filterLabel: 'Яндекс',
    chip: 'pending',
    href: null,
    icon: { name: 'star', type: 'svg' },
  },
}

export const TYPE_FILTERS = [
  { id: 'all', label: 'Все', chip: 'current' },
  ...Object.values(JOURNAL_EVENT_TYPES).map((type) => ({
    id: type.id,
    label: type.filterLabel,
    chip: type.chip,
  })),
]

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/**
 * Разнообразные события всех типов.
 * Часть — за последние 7 дней (виджет на главной), часть старше.
 */
export const MOCK_JOURNAL = [
  {
    id: 'j-grade-python-5',
    type: 'grade',
    at: atOffset(0, 14, 30),
    subject: 'python',
    grade: 5,
    text: 'Получил оценку 5 по Python',
    context: 'Практическая работа',
  },
  {
    id: 'j-coins-hw-bonus',
    type: 'coins',
    at: atOffset(0, 14, 32),
    amount: 2,
    text: '+2 монетки за пятёрку по ДЗ',
    context: 'Бонус к сдаче вовремя',
  },
  {
    id: 'j-hw-python',
    type: 'homework',
    at: atOffset(-1, 19, 15),
    subject: 'python',
    text: 'Сдал домашнюю работу',
    context: 'Циклы в Python',
  },
  {
    id: 'j-coins-hw',
    type: 'coins',
    at: atOffset(-1, 19, 16),
    amount: 3,
    text: '+3 монетки за ДЗ вовремя',
    context: 'Циклы в Python',
  },
  {
    id: 'j-attendance-python',
    type: 'attendance',
    at: atOffset(-2, 16, 20),
    subject: 'python',
    text: 'Посетил занятие',
    context: 'Python',
  },
  {
    id: 'j-coins-attendance',
    type: 'coins',
    at: atOffset(-2, 16, 21),
    amount: 1,
    text: '+1 монетка за посещение',
    context: 'Python',
  },
  {
    id: 'j-grade-scratch-4',
    type: 'grade',
    at: atOffset(-3, 13, 45),
    subject: 'scratch',
    grade: 4,
    text: 'Получил оценку 4 по Scratch',
    context: 'Работа на уроке',
  },
  {
    id: 'j-review-python',
    type: 'review',
    at: atOffset(-4, 18, 10),
    subject: 'python',
    teacher: 'Виктор Гоголадзе',
    text: 'Получил отзыв от преподавателя',
    context: 'Виктор Гоголадзе · Python',
  },
  {
    id: 'j-survey-camp',
    type: 'survey',
    at: atOffset(-5, 11, 5),
    amount: 2,
    text: 'Прошёл опрос',
    context: 'Как прошла неделя в лагере',
  },
  {
    id: 'j-coins-survey',
    type: 'coins',
    at: atOffset(-5, 11, 6),
    amount: 2,
    text: '+2 монетки за опрос',
    context: 'Участие в опросе',
  },
  {
    id: 'j-exam-python',
    type: 'exam',
    at: atOffset(-6, 15, 40),
    subject: 'python',
    text: 'Сдал экзамен',
    context: 'Итоговый по Python',
  },
  {
    id: 'j-market-stickers',
    type: 'market',
    at: atOffset(-6, 20, 0),
    text: 'Оформил заказ в маркете',
    context: 'Набор стикеров · 40 монеток',
  },
  {
    id: 'j-attendance-roblox',
    type: 'attendance',
    at: atOffset(-8, 17, 0),
    subject: 'roblox',
    text: 'Посетил занятие',
    context: 'Roblox',
  },
  {
    id: 'j-hw-roblox',
    type: 'homework',
    at: atOffset(-9, 21, 30),
    subject: 'roblox',
    text: 'Сдал домашнюю работу',
    context: 'Первый скрипт в Roblox',
  },
  {
    id: 'j-grade-roblox-5',
    type: 'grade',
    at: atOffset(-10, 12, 15),
    subject: 'roblox',
    grade: 5,
    text: 'Получил оценку 5 по Roblox',
    context: 'Домашняя работа',
  },
  {
    id: 'j-coins-streak',
    type: 'coins',
    at: atOffset(-11, 16, 5),
    amount: 5,
    text: '+5 монеток за серию без пропусков',
    context: '5 посещений подряд',
  },
  {
    id: 'j-yandex',
    type: 'yandex',
    at: atOffset(-12, 10, 20),
    text: 'Отзыв на Яндекс отправлен на проверку',
    context: 'Ждёт учебной части',
  },
  {
    id: 'j-attendance-scratch',
    type: 'attendance',
    at: atOffset(-14, 15, 10),
    subject: 'scratch',
    text: 'Посетил занятие',
    context: 'Scratch',
  },
  {
    id: 'j-review-scratch',
    type: 'review',
    at: atOffset(-15, 19, 0),
    subject: 'scratch',
    teacher: 'Анна Смирнова',
    text: 'Получил отзыв от преподавателя',
    context: 'Анна Смирнова · Scratch',
  },
  {
    id: 'j-exam-scratch',
    type: 'exam',
    at: atOffset(-18, 14, 0),
    subject: 'scratch',
    text: 'Сдал экзамен',
    context: 'Промежуточный по Scratch',
  },
  {
    id: 'j-grade-exam-4',
    type: 'grade',
    at: atOffset(-18, 16, 30),
    subject: 'scratch',
    grade: 4,
    text: 'Получил оценку 4 за экзамен',
    context: 'Scratch',
  },
  {
    id: 'j-market-notebook',
    type: 'market',
    at: atOffset(-20, 12, 45),
    text: 'Оформил заказ в маркете',
    context: 'Блокнот IT Camp · 60 монеток',
  },
  {
    id: 'j-hw-literacy',
    type: 'homework',
    at: atOffset(-22, 18, 0),
    subject: 'literacy',
    text: 'Сдал домашнюю работу',
    context: 'Алгоритмы на бумаге',
  },
  {
    id: 'j-survey-feedback',
    type: 'survey',
    at: atOffset(-28, 13, 20),
    text: 'Прошёл опрос',
    context: 'Обратная связь о занятиях',
  },
  {
    id: 'j-attendance-python-old',
    type: 'attendance',
    at: atOffset(-30, 16, 0),
    subject: 'python',
    text: 'Посетил занятие',
    context: 'Python',
  },
]

export function formatJournalDate(iso) {
  const date = new Date(iso)
  const dayMonth = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${dayMonth}, ${time}`
}

export function gradeIconName(grade) {
  return grade >= 5 ? JOURNAL_ILLUSTRATIONS.gradeStar : JOURNAL_ILLUSTRATIONS.gradeDisc
}

/** События за последние days дней, новые сверху, до limit штук — для виджета на главной */
export function getRecentJournalEvents(days = JOURNAL_WIDGET_DAYS, limit = JOURNAL_WIDGET_LIMIT) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  cutoff.setHours(0, 0, 0, 0)

  return MOCK_JOURNAL.filter((item) => new Date(item.at) >= cutoff)
    .slice()
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      type: item.type,
      grade: item.grade,
      amount: item.amount,
      text: item.text,
      date: formatJournalDate(item.at),
    }))
}
