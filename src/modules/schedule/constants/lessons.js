export const SUBJECT_LABELS = {
  python: 'Python',
  scratch: 'Scratch',
  roblox: 'Roblox',
  literacy: 'Компьютерная грамотность',
}

export const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
export const WEEKDAY_FULL = [
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
  'воскресенье',
]

export const SCHEDULE_VIEW_STORAGE_KEY = 'elektronnyj-dnevnik:schedule-view'
export const SCHEDULE_DESKTOP_MQ = '(min-width: 1281px)'

function atOffset(dayOffset, hour, minute) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function aroundNow(startOffsetMin, durationMin) {
  const start = new Date(Date.now() + startOffsetMin * 60_000)
  const end = new Date(start.getTime() + durationMin * 60_000)
  return { start: start.toISOString(), end: end.toISOString() }
}

const liveWindow = aroundNow(-25, 90)

export const MOCK_LESSONS = [
  {
    id: 'lesson-yesterday-python',
    subject: 'python',
    title: 'Python',
    start: atOffset(-1, 10, 0),
    end: atOffset(-1, 11, 30),
    teacher: 'Виктор Гоголадзе',
    room: 'Аудитория 3',
    onlineUrl: null,
    cancelled: false,
  },
  {
    id: 'lesson-today-past',
    subject: 'literacy',
    title: 'Компьютерная грамотность',
    start: atOffset(0, 9, 0),
    end: atOffset(0, 10, 20),
    teacher: 'Анна Смирнова',
    room: 'Аудитория 1',
    onlineUrl: null,
    cancelled: false,
  },
  {
    id: 'lesson-today-live',
    subject: 'scratch',
    title: 'Scratch',
    start: liveWindow.start,
    end: liveWindow.end,
    teacher: 'Мария Козлова',
    room: null,
    onlineUrl: 'https://itcampsochi.ru/',
    cancelled: false,
  },
  {
    id: 'lesson-today-upcoming',
    subject: 'roblox',
    title: 'Roblox',
    start: atOffset(0, 16, 0),
    end: atOffset(0, 17, 30),
    teacher: 'Виктор Гоголадзе',
    room: 'Аудитория 2',
    onlineUrl: null,
    cancelled: false,
  },
  {
    id: 'lesson-plus1-python',
    subject: 'python',
    title: 'Python',
    start: atOffset(1, 10, 0),
    end: atOffset(1, 11, 30),
    teacher: 'Виктор Гоголадзе',
    room: 'Аудитория 3',
    onlineUrl: null,
    cancelled: false,
  },
  {
    id: 'lesson-plus2-literacy',
    subject: 'literacy',
    title: 'Компьютерная грамотность',
    start: atOffset(2, 12, 0),
    end: atOffset(2, 13, 20),
    teacher: 'Анна Смирнова',
    room: 'Аудитория 1',
    onlineUrl: null,
    cancelled: false,
  },
  {
    id: 'lesson-plus3-scratch',
    subject: 'scratch',
    title: 'Scratch',
    start: atOffset(3, 10, 0),
    end: atOffset(3, 11, 30),
    teacher: 'Мария Козлова',
    room: null,
    onlineUrl: 'https://itcampsochi.ru/',
    cancelled: false,
  },
  {
    id: 'lesson-plus4-python',
    subject: 'python',
    title: 'Python',
    start: atOffset(4, 15, 0),
    end: atOffset(4, 16, 30),
    teacher: 'Виктор Гоголадзе',
    room: 'Аудитория 3',
    onlineUrl: null,
    cancelled: false,
  },
]
