import { SUBJECT_LABELS } from '@/modules/schedule/constants/lessons.js'

export { SUBJECT_LABELS }

export const REVIEWS_PAGE_LINK = '/reviews'

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/**
 * Отзывы преподавателей о студенте (только чтение в дневнике).
 * Даты согласованы с событиями типа review в журнале.
 */
export const MOCK_REVIEWS = [
  {
    id: 'rev-python-gogoladze',
    subject: 'python',
    teacher: 'Виктор Гоголадзе',
    at: atOffset(-4, 18, 10),
    text: 'Алина уверенно работает с циклами и условиями. На уроке помогает одногруппникам, аккуратно оформляет код. Продолжай в том же темпе — скоро разберём функции.',
  },
  {
    id: 'rev-roblox-kozlova',
    subject: 'roblox',
    teacher: 'Мария Козлова',
    at: atOffset(-9, 16, 40),
    text: 'Отличная работа над первым скриптом! Видно, что пробуешь идеи сама, а не только повторяешь за мной. Следи за отступами в коде — так проще читать.',
  },
  {
    id: 'rev-scratch-smirnova',
    subject: 'scratch',
    teacher: 'Анна Смирнова',
    at: atOffset(-15, 19, 0),
    text: 'Проект с анимацией получился живым и понятным. Хорошо продумала сюжет и сцены. На следующем занятии попробуем добавить переменные для очков.',
  },
  {
    id: 'rev-literacy-smirnova',
    subject: 'literacy',
    teacher: 'Анна Смирнова',
    at: atOffset(-22, 14, 20),
    text: 'Алгоритмы на бумаге составляешь чётко и по шагам. Это очень помогает потом в программировании. Молодец, что проверяешь решение перед сдачей.',
  },
  {
    id: 'rev-python-gogoladze-old',
    subject: 'python',
    teacher: 'Виктор Гоголадзе',
    at: atOffset(-35, 17, 5),
    text: 'Первые недели прошли отлично: внимательна на уроке, домашние сдаёшь вовремя. Если что-то непонятно — спрашивай сразу, не стесняйся.',
  },
]

export function formatReviewDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
