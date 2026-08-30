export const CURRENT_USER_ID = 'alina'

/** Шкала оценок продукта: 2–5 */
export const GRADE_SCALE_MIN = 2
export const GRADE_SCALE_MAX = 5

/** 50% средний балл + 50% ДЗ вовремя (docs/produkt.md) */
export const RATING_GRADES_WEIGHT = 0.5

export const LEADERBOARD_LIMIT = 5

/** Якорь «сегодня» — как у оценок, август 2026 (месяц в UI не показываем) */
export const RATING_TODAY = new Date(2026, 7, 30)

export const CURRENT_MONTH_KEY = '2026-08'
export const PREVIOUS_MONTH_KEY = '2026-07'
export const EARLIER_MONTH_KEY = '2026-06'

export function formatAverage(value) {
  if (value == null) return '—'
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function student(id, firstName, lastName, avgGrade, homeworkOnTime, homeworkTotal, shortName) {
  return {
    id,
    firstName,
    lastName,
    shortName: shortName ?? `${firstName} ${lastName.charAt(0)}.`,
    avgGrade,
    homeworkOnTime,
    homeworkTotal,
  }
}

const GROUP = [
  ['sofia', 'София', 'Козлова'],
  ['artem', 'Артём', 'Лебедев'],
  ['alina', 'Алина', 'Петрова'],
  ['maxim', 'Максим', 'Дмитриев'],
  ['vika', 'Виктория', 'Соколова', 'Вика С.'],
  ['denis', 'Денис', 'Орлов'],
  ['masha', 'Мария', 'Волкова'],
  ['ilya', 'Илья', 'Новиков'],
  ['katya', 'Екатерина', 'Белова', 'Катя Б.'],
  ['pavel', 'Павел', 'Морозов'],
  ['nika', 'Вероника', 'Крылова', 'Ника К.'],
  ['egor', 'Егор', 'Савельев'],
]

function fromGroup(metricsById) {
  return GROUP.map(([id, firstName, lastName, shortName]) => {
    const metrics = metricsById[id]
    return student(
      id,
      firstName,
      lastName,
      metrics.avgGrade,
      metrics.homeworkOnTime,
      metrics.homeworkTotal,
      shortName,
    )
  })
}

/**
 * Сырые метрики месяца. Баллы считаются по формуле, не хардкодятся.
 * ДЗ: сдано вовремя и зачтено / всего за месяц.
 */
export const MOCK_RATING_BY_MONTH = {
  [CURRENT_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.9, homeworkOnTime: 12, homeworkTotal: 12 },
    artem: { avgGrade: 4.7, homeworkOnTime: 11, homeworkTotal: 12 },
    alina: { avgGrade: 4.7, homeworkOnTime: 10, homeworkTotal: 12 },
    maxim: { avgGrade: 4.5, homeworkOnTime: 10, homeworkTotal: 12 },
    vika: { avgGrade: 4.3, homeworkOnTime: 10, homeworkTotal: 12 },
    denis: { avgGrade: 4.2, homeworkOnTime: 9, homeworkTotal: 12 },
    masha: { avgGrade: 4.1, homeworkOnTime: 9, homeworkTotal: 12 },
    ilya: { avgGrade: 4.0, homeworkOnTime: 8, homeworkTotal: 12 },
    katya: { avgGrade: 3.8, homeworkOnTime: 8, homeworkTotal: 12 },
    pavel: { avgGrade: 3.6, homeworkOnTime: 7, homeworkTotal: 12 },
    nika: { avgGrade: 3.4, homeworkOnTime: 6, homeworkTotal: 12 },
    egor: { avgGrade: 3.2, homeworkOnTime: 5, homeworkTotal: 12 },
  }),
  [PREVIOUS_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.8, homeworkOnTime: 11, homeworkTotal: 11 },
    artem: { avgGrade: 4.6, homeworkOnTime: 10, homeworkTotal: 11 },
    maxim: { avgGrade: 4.5, homeworkOnTime: 10, homeworkTotal: 11 },
    alina: { avgGrade: 4.5, homeworkOnTime: 9, homeworkTotal: 11 },
    vika: { avgGrade: 4.2, homeworkOnTime: 9, homeworkTotal: 11 },
    denis: { avgGrade: 4.1, homeworkOnTime: 8, homeworkTotal: 11 },
    masha: { avgGrade: 4.0, homeworkOnTime: 8, homeworkTotal: 11 },
    ilya: { avgGrade: 3.9, homeworkOnTime: 7, homeworkTotal: 11 },
    katya: { avgGrade: 3.7, homeworkOnTime: 7, homeworkTotal: 11 },
    pavel: { avgGrade: 3.5, homeworkOnTime: 6, homeworkTotal: 11 },
    nika: { avgGrade: 3.3, homeworkOnTime: 5, homeworkTotal: 11 },
    egor: { avgGrade: 3.1, homeworkOnTime: 4, homeworkTotal: 11 },
  }),
  [EARLIER_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.8, homeworkOnTime: 10, homeworkTotal: 10 },
    artem: { avgGrade: 4.4, homeworkOnTime: 8, homeworkTotal: 10 },
    alina: { avgGrade: 4.6, homeworkOnTime: 9, homeworkTotal: 10 },
    maxim: { avgGrade: 4.4, homeworkOnTime: 9, homeworkTotal: 10 },
    vika: { avgGrade: 4.1, homeworkOnTime: 8, homeworkTotal: 10 },
    denis: { avgGrade: 4.0, homeworkOnTime: 7, homeworkTotal: 10 },
    masha: { avgGrade: 4.2, homeworkOnTime: 8, homeworkTotal: 10 },
    ilya: { avgGrade: 3.8, homeworkOnTime: 6, homeworkTotal: 10 },
    katya: { avgGrade: 3.6, homeworkOnTime: 6, homeworkTotal: 10 },
    pavel: { avgGrade: 3.4, homeworkOnTime: 5, homeworkTotal: 10 },
    nika: { avgGrade: 3.2, homeworkOnTime: 5, homeworkTotal: 10 },
    egor: { avgGrade: 3.0, homeworkOnTime: 4, homeworkTotal: 10 },
  }),
}

function aggregateAllMonths() {
  const byId = new Map()

  for (const list of Object.values(MOCK_RATING_BY_MONTH)) {
    for (const row of list) {
      const prev = byId.get(row.id)
      if (!prev) {
        byId.set(row.id, {
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
          shortName: row.shortName,
          gradeWeightSum: row.avgGrade * row.homeworkTotal,
          weight: row.homeworkTotal,
          homeworkOnTime: row.homeworkOnTime,
          homeworkTotal: row.homeworkTotal,
        })
        continue
      }
      prev.gradeWeightSum += row.avgGrade * row.homeworkTotal
      prev.weight += row.homeworkTotal
      prev.homeworkOnTime += row.homeworkOnTime
      prev.homeworkTotal += row.homeworkTotal
    }
  }

  return [...byId.values()].map((row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    shortName: row.shortName,
    avgGrade: row.weight > 0 ? Math.round((row.gradeWeightSum / row.weight) * 10) / 10 : 0,
    homeworkOnTime: row.homeworkOnTime,
    homeworkTotal: row.homeworkTotal,
  }))
}

export function computeRatingBreakdown(row) {
  const ratio = row.homeworkTotal > 0 ? row.homeworkOnTime / row.homeworkTotal : 0
  const gradesNormalized =
    ((row.avgGrade - GRADE_SCALE_MIN) / (GRADE_SCALE_MAX - GRADE_SCALE_MIN)) * 100
  const homeworkPercent = ratio * 100
  const gradesShare = gradesNormalized * RATING_GRADES_WEIGHT
  const homeworkShare = homeworkPercent * (1 - RATING_GRADES_WEIGHT)

  return {
    gradesNormalized,
    homeworkPercent,
    gradesShare,
    homeworkShare,
    points: Math.round(gradesShare + homeworkShare),
  }
}

export function rankStudents(students) {
  return [...students]
    .map((row) => {
      const breakdown = computeRatingBreakdown(row)
      return {
        ...row,
        fullName: `${row.lastName} ${row.firstName}`,
        avgLabel: formatAverage(row.avgGrade),
        gradesPercent: Math.round(breakdown.gradesNormalized),
        homeworkPercent: Math.round(breakdown.homeworkPercent),
        gradesShare: Math.round(breakdown.gradesShare),
        homeworkShare: Math.round(breakdown.homeworkShare),
        points: breakdown.points,
        isCurrent: row.id === CURRENT_USER_ID,
      }
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      return a.fullName.localeCompare(b.fullName, 'ru')
    })
    .map((row, index) => ({ ...row, rank: index + 1 }))
}

export function getAllTimeRanking() {
  return rankStudents(aggregateAllMonths())
}

const allTimeRanking = getAllTimeRanking()
const currentUserRow = allTimeRanking.find((row) => row.isCurrent)

/** Снимок для виджета на главной — те же баллы, что на странице /rating */
export const RATING_WIDGET_SNAPSHOT = {
  rank: currentUserRow?.rank ?? 0,
  total: allTimeRanking.length,
  points: currentUserRow?.points ?? 0,
  periodLabel: 'За всё время',
  gradesPercent: Math.round(RATING_GRADES_WEIGHT * 100),
  homeworkPercent: Math.round((1 - RATING_GRADES_WEIGHT) * 100),
  leaderboard: allTimeRanking.slice(0, LEADERBOARD_LIMIT).map((row) => ({
    rank: row.rank,
    name: row.shortName,
    points: row.points,
    isCurrent: row.isCurrent,
  })),
  leaderboardLimit: LEADERBOARD_LIMIT,
  linkHref: '/rating',
}

export const FORMULA_TOOLTIP =
  '50% средний балл (шкала 2–5) + 50% ДЗ вовремя и зачтённые за всё время обучения. Пересчёт каждый день.'
