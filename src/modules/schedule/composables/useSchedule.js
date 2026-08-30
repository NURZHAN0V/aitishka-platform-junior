import { computed, ref, watch } from 'vue'
import {
  MOCK_LESSONS,
  SCHEDULE_DESKTOP_MQ,
  SCHEDULE_VIEW_STORAGE_KEY,
  WEEKDAY_FULL,
  WEEKDAY_SHORT,
} from '../constants/lessons.js'

const WEEKDAY_INDEX_MONDAY_FIRST = [6, 0, 1, 2, 3, 4, 5]
const VALID_VIEWS = new Set(['day', 'week', 'month'])

export function startOfDay(value = new Date()) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function startOfWeek(value = new Date()) {
  const date = startOfDay(value)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return date
}

export function startOfMonth(value = new Date()) {
  const date = startOfDay(value)
  date.setDate(1)
  return date
}

export function addDays(value, amount) {
  const date = new Date(value)
  date.setDate(date.getDate() + amount)
  return date
}

export function addMonths(value, amount) {
  const date = startOfMonth(value)
  date.setMonth(date.getMonth() + amount)
  return date
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function lessonStatus(lesson, now = new Date()) {
  const start = new Date(lesson.start)
  const end = new Date(lesson.end)
  if (now < start) return 'upcoming'
  if (now >= end) return 'past'
  return 'live'
}

export function formatTimeRange(startIso, endIso) {
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${formatter.format(new Date(startIso))}–${formatter.format(new Date(endIso))}`
}

export function formatDayMonthYear(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatMonthYear(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${year}`
}

export function formatWeekRange(weekStart) {
  const weekEnd = addDays(weekStart, 6)
  return `${formatDayMonthYear(weekStart)} – ${formatDayMonthYear(weekEnd)}`
}

function weekdayIndexMondayFirst(date) {
  return WEEKDAY_INDEX_MONDAY_FIRST[date.getDay()]
}

function normalizeStoredView(stored) {
  if (stored === 'today') return 'day'
  if (VALID_VIEWS.has(stored)) return stored
  return null
}

function readStoredView() {
  try {
    return normalizeStoredView(localStorage.getItem(SCHEDULE_VIEW_STORAGE_KEY))
  } catch {
    return null
  }
}

function saveView(view) {
  try {
    localStorage.setItem(SCHEDULE_VIEW_STORAGE_KEY, view)
  } catch {
    // ignore
  }
}

function initialView() {
  const stored = readStoredView()
  if (stored) return stored
  if (typeof window !== 'undefined' && window.matchMedia(SCHEDULE_DESKTOP_MQ).matches) {
    return 'week'
  }
  return 'day'
}

export function useSchedule(lessons = MOCK_LESSONS) {
  const now = ref(new Date())
  const today = computed(() => startOfDay(now.value))
  const currentWeekStart = computed(() => startOfWeek(now.value))
  const selectedDay = ref(startOfDay(now.value))
  const weekStart = ref(startOfWeek(now.value))
  const monthStart = ref(startOfMonth(now.value))
  const view = ref(initialView())
  const expandedLessonId = ref(null)

  watch(view, (value) => saveView(value))

  const visibleLessons = computed(() =>
    lessons.filter((lesson) => !lesson.cancelled),
  )

  const weekDays = computed(() =>
    Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart.value, index)
      return {
        date,
        key: date.toISOString().slice(0, 10),
        short: WEEKDAY_SHORT[index],
        full: WEEKDAY_FULL[index],
        dayNumber: date.getDate(),
        isToday: isSameDay(date, today.value),
        isWeekend: index >= 5,
      }
    }),
  )

  const weekLessons = computed(() => {
    const start = weekStart.value
    const end = addDays(start, 7)
    return visibleLessons.value.filter((lesson) => {
      const startDate = new Date(lesson.start)
      return startDate >= start && startDate < end
    })
  })

  const daysWithLessons = computed(() =>
    weekDays.value.map((day) => ({
      ...day,
      lessons: weekLessons.value
        .filter((lesson) => isSameDay(new Date(lesson.start), day.date))
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .map((lesson) => ({
          ...lesson,
          status: lessonStatus(lesson, now.value),
        })),
    })),
  )

  const dayLessons = computed(() => {
    return visibleLessons.value
      .filter((lesson) => isSameDay(new Date(lesson.start), selectedDay.value))
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map((lesson) => ({
        ...lesson,
        status: lessonStatus(lesson, now.value),
      }))
  })

  const upcomingThisWeek = computed(() => {
    const start = currentWeekStart.value
    const end = addDays(start, 7)
    return visibleLessons.value
      .filter((lesson) => {
        const startDate = new Date(lesson.start)
        return startDate >= start && startDate < end
      })
      .map((lesson) => ({ ...lesson, status: lessonStatus(lesson, now.value) }))
      .filter((lesson) => {
        if (lesson.status === 'past') return false
        if (isSameDay(new Date(lesson.start), today.value)) return false
        return new Date(lesson.start) > now.value
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 3)
  })

  const nextLessonAfterDay = computed(() => {
    const upcoming = visibleLessons.value
      .filter((lesson) => new Date(lesson.start) >= addDays(selectedDay.value, 1))
      .sort((a, b) => new Date(a.start) - new Date(b.start))[0]

    if (!upcoming) return null
    return { ...upcoming, status: lessonStatus(upcoming, now.value) }
  })

  const monthDays = computed(() => {
    const start = monthStart.value
    const gridStart = startOfWeek(start)
    const lessonsByDay = new Map()

    for (const lesson of visibleLessons.value) {
      const startDate = new Date(lesson.start)
      if (!isSameMonth(startDate, start)) continue
      const key = startDate.toISOString().slice(0, 10)
      if (!lessonsByDay.has(key)) lessonsByDay.set(key, [])
      lessonsByDay.get(key).push({
        ...lesson,
        status: lessonStatus(lesson, now.value),
      })
    }

    for (const list of lessonsByDay.values()) {
      list.sort((a, b) => new Date(a.start) - new Date(b.start))
    }

    return Array.from({ length: 42 }, (_, index) => {
      const date = addDays(gridStart, index)
      const key = date.toISOString().slice(0, 10)
      const weekdayIndex = weekdayIndexMondayFirst(date)
      return {
        date,
        key,
        dayNumber: date.getDate(),
        short: WEEKDAY_SHORT[weekdayIndex],
        isCurrentMonth: isSameMonth(date, start),
        isToday: isSameDay(date, today.value),
        isWeekend: weekdayIndex >= 5,
        lessons: lessonsByDay.get(key) ?? [],
      }
    })
  })

  const periodLabel = computed(() => {
    if (view.value === 'day') return formatDayMonthYear(selectedDay.value)
    if (view.value === 'month') return formatMonthYear(monthStart.value)
    return formatWeekRange(weekStart.value)
  })

  const isCurrentPeriod = computed(() => {
    if (view.value === 'day') return isSameDay(selectedDay.value, today.value)
    if (view.value === 'month') return isSameMonth(monthStart.value, today.value)
    return isSameDay(weekStart.value, currentWeekStart.value)
  })

  const isSelectedDayToday = computed(() => isSameDay(selectedDay.value, today.value))

  function setView(next) {
    if (!VALID_VIEWS.has(next)) return
    view.value = next
  }

  function goToPrevPeriod() {
    expandedLessonId.value = null
    if (view.value === 'day') {
      selectedDay.value = addDays(selectedDay.value, -1)
      return
    }
    if (view.value === 'month') {
      monthStart.value = addMonths(monthStart.value, -1)
      return
    }
    weekStart.value = addDays(weekStart.value, -7)
  }

  function goToNextPeriod() {
    expandedLessonId.value = null
    if (view.value === 'day') {
      selectedDay.value = addDays(selectedDay.value, 1)
      return
    }
    if (view.value === 'month') {
      monthStart.value = addMonths(monthStart.value, 1)
      return
    }
    weekStart.value = addDays(weekStart.value, 7)
  }

  function goToToday() {
    selectedDay.value = startOfDay(now.value)
    weekStart.value = startOfWeek(now.value)
    monthStart.value = startOfMonth(now.value)
    view.value = 'day'
    expandedLessonId.value = null
  }

  function selectMonthDay(date) {
    selectedDay.value = startOfDay(date)
    weekStart.value = startOfWeek(date)
    view.value = 'day'
    expandedLessonId.value = null
  }

  function toggleLesson(id) {
    expandedLessonId.value = expandedLessonId.value === id ? null : id
  }

  function weekdayLabel(date, { full = false } = {}) {
    const index = weekdayIndexMondayFirst(date)
    return full ? WEEKDAY_FULL[index] : WEEKDAY_SHORT[index]
  }

  return {
    view,
    expandedLessonId,
    selectedDay,
    weekStart,
    monthStart,
    periodLabel,
    weekLabel: periodLabel,
    weekDays,
    daysWithLessons,
    dayLessons,
    todayLessons: dayLessons,
    monthDays,
    upcomingThisWeek,
    nextLessonAfterToday: nextLessonAfterDay,
    nextLessonAfterDay,
    isCurrentWeek: isCurrentPeriod,
    isCurrentPeriod,
    isSelectedDayToday,
    setView,
    goToPrevWeek: goToPrevPeriod,
    goToNextWeek: goToNextPeriod,
    goToPrevPeriod,
    goToNextPeriod,
    goToToday,
    selectMonthDay,
    toggleLesson,
    weekdayLabel,
    formatTimeRange,
  }
}
