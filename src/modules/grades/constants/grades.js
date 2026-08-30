import { SUBJECT_LABELS } from '@/modules/schedule/constants/lessons.js'

export { SUBJECT_LABELS }

export const GRADES_VIEW_STORAGE_KEY = 'elektronnyj-dnevnik:grades-view'
export const GRADES_PERIOD_STORAGE_KEY = 'elektronnyj-dnevnik:grades-period'

/** Шкала оценок продукта: 2–5 */
export const GRADE_SCALE = {
  5: { label: 'Отлично', short: '5' },
  4: { label: 'Хорошо', short: '4' },
  3: { label: 'Удовл.', short: '3' },
  2: { label: 'Неудовл.', short: '2' },
}

export const WORK_TYPES = {
  classwork: { id: 'classwork', label: 'Классная работа' },
  homework: { id: 'homework', label: 'Домашняя работа' },
  exam: { id: 'exam', label: 'Экзамен' },
  control: { id: 'control', label: 'Контрольная' },
}

export const WORK_TYPE_OPTIONS = [
  { value: 'all', label: 'Все типы работ' },
  ...Object.values(WORK_TYPES).map((item) => ({ value: item.id, label: item.label })),
]

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'Все предметы' },
  ...Object.entries(SUBJECT_LABELS).map(([value, label]) => ({ value, label })),
]

export const PERIOD_TABS = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
]

export const VIEW_TABS = [
  { id: 'summary', label: 'Сводный' },
  { id: 'detailed', label: 'Детализированный' },
]

/**
 * Маркеры особых оценок → варианты BaseChip.
 * Согласованы с продуктовой шкалой и аттестацией (docs/produkt.md, docs/kontekst.md).
 */
export const GRADE_STATUS = {
  excellent: {
    id: 'excellent',
    label: 'Отлично',
    chip: 'approved',
    tooltip: 'Отлично · +2 монетки за ДЗ',
  },
  exam: {
    id: 'exam',
    label: 'Экзамен',
    chip: 'current',
    tooltip: 'Экзамен / итоговая',
  },
  retake: {
    id: 'retake',
    label: 'Пересдача',
    chip: 'overdue',
    tooltip: 'После пересдачи',
  },
  not_attested: {
    id: 'not_attested',
    label: 'Не аттестован',
    chip: 'rejected',
    tooltip: 'Нет аттестации',
  },
  late: {
    id: 'late',
    label: 'С опозданием',
    chip: 'pending',
    tooltip: 'Сдано с опозданием',
  },
}

/** Мотивация: рейтинг за календарный месяц = 50% средний балл + 50% ДЗ вовремя */
export const RATING_GRADES_WEIGHT = 0.5
export const HOMEWORK_FIVE_COINS = 2

function aug(day, hour = 12, minute = 0) {
  return new Date(2026, 7, day, hour, minute, 0, 0).toISOString()
}

export const MOCK_GRADES = [
  {
    id: 'g-aug04-python-cw',
    subject: 'python',
    title: 'Python',
    score: 4,
    date: aug(4, 11, 30),
    teacher: 'Виктор Гоголадзе',
    workType: 'classwork',
    statuses: [],
    comment: 'Хорошая работа на уроке по циклам.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug06-scratch-hw',
    subject: 'scratch',
    title: 'Scratch',
    score: 5,
    date: aug(6, 18, 10),
    teacher: 'Мария Козлова',
    workType: 'homework',
    statuses: ['excellent'],
    comment: 'Анимация персонажа — отлично.',
    coinsEarned: HOMEWORK_FIVE_COINS,
  },
  {
    id: 'g-aug08-literacy-cw',
    subject: 'literacy',
    title: 'Компьютерная грамотность',
    score: 5,
    date: aug(8, 10, 20),
    teacher: 'Анна Смирнова',
    workType: 'classwork',
    statuses: ['excellent'],
    comment: null,
    coinsEarned: 0,
  },
  {
    id: 'g-aug11-roblox-hw-late',
    subject: 'roblox',
    title: 'Roblox',
    score: 4,
    date: aug(11, 20, 45),
    teacher: 'Виктор Гоголадзе',
    workType: 'homework',
    statuses: ['late'],
    comment: 'Сдано после срока — монетки не начислены.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug13-python-hw',
    subject: 'python',
    title: 'Python',
    score: 5,
    date: aug(13, 19, 0),
    teacher: 'Виктор Гоголадзе',
    workType: 'homework',
    statuses: ['excellent'],
    comment: 'Задача на списки решена полностью.',
    coinsEarned: HOMEWORK_FIVE_COINS,
  },
  {
    id: 'g-aug15-scratch-control',
    subject: 'scratch',
    title: 'Scratch',
    score: 3,
    date: aug(15, 11, 0),
    teacher: 'Мария Козлова',
    workType: 'control',
    statuses: [],
    comment: 'Нужно внимательнее к скриптам событий.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug18-literacy-exam',
    subject: 'literacy',
    title: 'Компьютерная грамотность',
    score: 4,
    date: aug(18, 12, 30),
    teacher: 'Анна Смирнова',
    workType: 'exam',
    statuses: ['exam'],
    comment: 'Промежуточная аттестация.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug20-python-retake',
    subject: 'python',
    title: 'Python',
    score: 4,
    date: aug(20, 16, 0),
    teacher: 'Виктор Гоголадзе',
    workType: 'control',
    statuses: ['retake'],
    comment: 'Пересдача контрольной по функциям.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug22-roblox-cw',
    subject: 'roblox',
    title: 'Roblox',
    score: 5,
    date: aug(22, 17, 10),
    teacher: 'Виктор Гоголадзе',
    workType: 'classwork',
    statuses: ['excellent'],
    comment: null,
    coinsEarned: 0,
  },
  {
    id: 'g-aug25-scratch-hw',
    subject: 'scratch',
    title: 'Scratch',
    score: 2,
    date: aug(25, 18, 30),
    teacher: 'Мария Козлова',
    workType: 'homework',
    statuses: [],
    comment: 'Проект не запускается — переделайте.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug27-python-hw',
    subject: 'python',
    title: 'Python',
    score: 5,
    date: aug(27, 19, 15),
    teacher: 'Виктор Гоголадзе',
    workType: 'homework',
    statuses: ['excellent'],
    comment: 'Отличная сдача ДЗ вовремя.',
    coinsEarned: HOMEWORK_FIVE_COINS,
  },
  {
    id: 'g-aug28-roblox-na',
    subject: 'roblox',
    title: 'Roblox',
    score: null,
    date: aug(28, 15, 0),
    teacher: 'Виктор Гоголадзе',
    workType: 'exam',
    statuses: ['not_attested', 'exam'],
    comment: 'Не аттестован: работа не загружена к проверке.',
    coinsEarned: 0,
  },
  {
    id: 'g-aug29-literacy-cw',
    subject: 'literacy',
    title: 'Компьютерная грамотность',
    score: 4,
    date: aug(29, 9, 40),
    teacher: 'Анна Смирнова',
    workType: 'classwork',
    statuses: [],
    comment: null,
    coinsEarned: 0,
  },
  {
    id: 'g-aug30-python-cw',
    subject: 'python',
    title: 'Python',
    score: 5,
    date: aug(30, 11, 0),
    teacher: 'Виктор Гоголадзе',
    workType: 'classwork',
    statuses: ['excellent'],
    comment: 'Работа на уроке — отлично.',
    coinsEarned: 0,
  },
]

/** Доля ДЗ вовремя в рейтинге за месяц (мок для мотивации) */
export const MOCK_HOMEWORK_ON_TIME_RATIO = 0.82
