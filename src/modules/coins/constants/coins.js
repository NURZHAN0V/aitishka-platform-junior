import { BRAND_ILLUSTRATIONS, WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'

/** Баланс mock — согласован с шапкой на всех экранах */
export const MOCK_COINS_BALANCE = 1250

export const COINS_PAGE_INITIAL = 10
export const COINS_PAGE_STEP = 10
export const COINS_MARKET_LINK = '/market'
export const COINS_PAGE_LINK = '/coins'

/** Награды за серии (после награды счётчик обнуляется) */
export const STREAK_ATTENDANCE_REWARDS = [
  { target: 5, coins: 5 },
  { target: 10, coins: 8 },
  { target: 20, coins: 10 },
]

export const STREAK_PUNCTUALITY_REWARDS = [
  { target: 5, coins: 3 },
  { target: 10, coins: 5 },
  { target: 20, coins: 8 },
]

/**
 * Прогресс серий — общий mock для главной и раздела «Монетки».
 * current / target — путь к следующей награде после обнуления.
 */
export const MOCK_STREAKS = {
  attendance: {
    id: 'attendance',
    current: 7,
    target: 10,
    label: 'без пропусков',
    rewardCoins: 8,
    hint: 'Опоздание не ломает эту серию',
  },
  punctuality: {
    id: 'punctuality',
    current: 4,
    target: 5,
    label: 'без опозданий',
    rewardCoins: 3,
    hint: 'Приходи вовремя — копи отдельную серию',
  },
}

export const PROFILE_BONUS_COINS = 5

/** Таблица начислений — шпаргалка «Как получить монетки» */
export const COINS_EARN_RULES = [
  {
    id: 'attendance',
    title: 'Посещение',
    amount: '+1',
    note: 'Только «присутствовал»',
  },
  {
    id: 'homework',
    title: 'ДЗ вовремя и зачтено',
    amount: '+3',
    note: 'Просроченное — без монеток',
  },
  {
    id: 'homework-five',
    title: 'Пятёрка за такое ДЗ',
    amount: '+2',
    note: 'Бонус к трём монеткам',
  },
  {
    id: 'streak-attendance',
    title: 'Серия без пропусков',
    amount: '5 / 8 / 10',
    note: 'За 5, 10 и 20 учебных дней',
  },
  {
    id: 'streak-punctuality',
    title: 'Серия без опозданий',
    amount: '3 / 5 / 8',
    note: 'За 5, 10 и 20 учебных дней',
  },
  {
    id: 'profile',
    title: 'Одобренное фото',
    amount: '+5',
    note: 'Загрузка, после проверки',
  },
  {
    id: 'encouragement',
    title: 'Поощрение на уроке',
    amount: '+1…5',
    note: 'Не больше 5 на всех за занятие',
  },
  {
    id: 'yandex',
    title: 'Отзыв на Яндекс',
    amount: '+10',
    note: 'Один раз на аккаунт',
  },
  {
    id: 'survey',
    title: 'Опрос',
    amount: '+2',
    note: 'За каждый пройденный',
  },
]

export const COINS_TX_TYPES = {
  attendance: {
    id: 'attendance',
    label: 'Посещение',
    icon: { name: BRAND_ILLUSTRATIONS.coin, type: 'avif' },
  },
  homework: {
    id: 'homework',
    label: 'Домашнее задание',
    icon: { name: WIDGET_ILLUSTRATIONS.homeworkNotepad, type: 'avif' },
  },
  homework_bonus: {
    id: 'homework_bonus',
    label: 'Бонус за пятёрку',
    icon: { name: BRAND_ILLUSTRATIONS.coin, type: 'avif' },
  },
  streak_attendance: {
    id: 'streak_attendance',
    label: 'Серия без пропусков',
    icon: { name: BRAND_ILLUSTRATIONS.coinStack, type: 'avif' },
  },
  streak_punctuality: {
    id: 'streak_punctuality',
    label: 'Серия без опозданий',
    icon: { name: BRAND_ILLUSTRATIONS.coinStack, type: 'avif' },
  },
  profile: {
    id: 'profile',
    label: 'Одобренное фото',
    icon: { name: WIDGET_ILLUSTRATIONS.photoPolaroidCard, type: 'avif' },
  },
  encouragement: {
    id: 'encouragement',
    label: 'Поощрение',
    icon: { name: BRAND_ILLUSTRATIONS.coin, type: 'avif' },
  },
  yandex: {
    id: 'yandex',
    label: 'Отзыв на Яндекс',
    icon: { name: 'star', type: 'svg' },
  },
  survey: {
    id: 'survey',
    label: 'Опрос',
    icon: { name: 'check-circle', type: 'svg' },
  },
  market: {
    id: 'market',
    label: 'Маркет',
    icon: { name: 'shopping-bag', type: 'svg' },
    href: COINS_MARKET_LINK,
  },
}

export const HISTORY_FILTERS = [
  { id: 'all', label: 'Все', chip: 'current' },
  { id: 'earn', label: 'Пришло', chip: 'approved' },
  { id: 'spend', label: 'Ушло', chip: 'overdue' },
]

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/**
 * История начислений и списаний.
 * amount > 0 — пришло, amount < 0 — ушло в маркет.
 */
export const MOCK_COINS_HISTORY = [
  {
    id: 'c-hw-bonus',
    type: 'homework_bonus',
    at: atOffset(0, 14, 32),
    amount: 2,
    title: 'Бонус за пятёрку по ДЗ',
    context: 'Python · Циклы',
  },
  {
    id: 'c-hw',
    type: 'homework',
    at: atOffset(-1, 19, 16),
    amount: 3,
    title: 'ДЗ вовремя и зачтено',
    context: 'Python · Циклы',
  },
  {
    id: 'c-attendance',
    type: 'attendance',
    at: atOffset(-2, 16, 21),
    amount: 1,
    title: 'Посещение занятия',
    context: 'Python',
  },
  {
    id: 'c-encouragement',
    type: 'encouragement',
    at: atOffset(-3, 17, 5),
    amount: 3,
    title: 'Поощрение на уроке',
    context: 'Scratch · за работу у доски',
  },
  {
    id: 'c-survey',
    type: 'survey',
    at: atOffset(-5, 11, 6),
    amount: 2,
    title: 'Участие в опросе',
    context: 'Как прошла неделя в лагере',
  },
  {
    id: 'c-market-stickers',
    type: 'market',
    at: atOffset(-6, 20, 0),
    amount: -40,
    title: 'Покупка в маркете',
    context: 'Набор стикеров',
  },
  {
    id: 'c-attendance-2',
    type: 'attendance',
    at: atOffset(-8, 17, 5),
    amount: 1,
    title: 'Посещение занятия',
    context: 'Roblox',
  },
  {
    id: 'c-streak-attendance',
    type: 'streak_attendance',
    at: atOffset(-11, 16, 5),
    amount: 5,
    title: 'Серия без пропусков',
    context: '5 учебных дней подряд',
  },
  {
    id: 'c-hw-2',
    type: 'homework',
    at: atOffset(-12, 18, 40),
    amount: 3,
    title: 'ДЗ вовремя и зачтено',
    context: 'Roblox · Первый скрипт',
  },
  {
    id: 'c-hw-bonus-2',
    type: 'homework_bonus',
    at: atOffset(-12, 18, 41),
    amount: 2,
    title: 'Бонус за пятёрку по ДЗ',
    context: 'Roblox · Первый скрипт',
  },
  {
    id: 'c-yandex',
    type: 'yandex',
    at: atOffset(-16, 10, 20),
    amount: 10,
    title: 'Отзыв на Яндекс',
    context: 'Проверено учебной частью',
  },
  {
    id: 'c-market-notebook',
    type: 'market',
    at: atOffset(-20, 12, 45),
    amount: -60,
    title: 'Покупка в маркете',
    context: 'Блокнот IT Camp',
  },
  {
    id: 'c-streak-punctuality',
    type: 'streak_punctuality',
    at: atOffset(-22, 16, 10),
    amount: 3,
    title: 'Серия без опозданий',
    context: '5 учебных дней подряд',
  },
  {
    id: 'c-attendance-3',
    type: 'attendance',
    at: atOffset(-28, 15, 30),
    amount: 1,
    title: 'Посещение занятия',
    context: 'Scratch',
  },
]

export function formatCoinsDate(iso) {
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

export function formatCoinsAmount(amount) {
  const abs = Math.abs(amount)
  const word =
    abs % 10 === 1 && abs % 100 !== 11
      ? 'монетка'
      : abs % 10 >= 2 && abs % 10 <= 4 && (abs % 100 < 10 || abs % 100 >= 20)
        ? 'монетки'
        : 'монеток'
  const sign = amount > 0 ? '+' : amount < 0 ? '−' : ''
  return { sign, value: abs, word, label: `${sign}${abs} ${word}` }
}

/** Snapshot для виджета на главной */
export const STREAKS_WIDGET_SNAPSHOT = {
  attendance: {
    current: MOCK_STREAKS.attendance.current,
    target: MOCK_STREAKS.attendance.target,
  },
  punctuality: {
    current: MOCK_STREAKS.punctuality.current,
    target: MOCK_STREAKS.punctuality.target,
  },
  profileBonus: PROFILE_BONUS_COINS,
  linkHref: COINS_PAGE_LINK,
  profileLinkHref: '/profile',
}
