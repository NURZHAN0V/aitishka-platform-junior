export const CURRENT_USER_ID = 'alina'

/** Шкала оценок продукта: 2–5 */
export const GRADE_SCALE_MIN = 2
export const GRADE_SCALE_MAX = 5

/** Вторичный балл для незавершивших: 50% средний + 50% ДЗ вовремя */
export const RATING_GRADES_WEIGHT = 0.5

export const LEADERBOARD_LIMIT = 5

/** Якорь «сегодня» — как у оценок, август 2026 */
export const RATING_TODAY = new Date(2026, 7, 30)

export const CURRENT_MONTH_KEY = '2026-08'
export const PREVIOUS_MONTH_KEY = '2026-07'
export const EARLIER_MONTH_KEY = '2026-06'

/** Сколько экзаменов за всё время у группы (мок) */
export const EXAMS_TOTAL_ALL_TIME = 4

export function formatAverage(value) {
  if (value == null) return '—'
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '')
}

function student(id, firstName, lastName, avgGrade, homeworkDone, homeworkOnTime, homeworkTotal, examsDone) {
  return {
    id,
    firstName,
    lastName,
    shortName: `${firstName} ${lastName.charAt(0)}.`,
    avgGrade,
    homeworkDone,
    homeworkOnTime,
    homeworkTotal,
    examsDone,
    examsTotal: EXAMS_TOTAL_ALL_TIME,
  }
}

const GROUP = [
  ['sofia', 'София', 'Козлова'],
  ['artem', 'Артём', 'Лебедев'],
  ['alina', 'Алина', 'Петрова'],
  ['maxim', 'Максим', 'Дмитриев'],
  ['vika', 'Виктория', 'Соколова'],
  ['denis', 'Денис', 'Орлов'],
  ['masha', 'Мария', 'Волкова'],
  ['ilya', 'Илья', 'Новиков'],
  ['katya', 'Екатерина', 'Белова'],
  ['pavel', 'Павел', 'Морозов'],
  ['nika', 'Вероника', 'Крылова'],
  ['egor', 'Егор', 'Савельев'],
  ['kirill', 'Кирилл', 'Фёдоров'],
  ['lera', 'Валерия', 'Громова'],
  ['timur', 'Тимур', 'Анисимов'],
]

function fromGroup(metricsById) {
  return GROUP.map(([id, firstName, lastName]) => {
    const m = metricsById[id]
    return student(
      id,
      firstName,
      lastName,
      m.avgGrade,
      m.homeworkDone,
      m.homeworkOnTime,
      m.homeworkTotal,
      m.examsDone,
    )
  })
}

/**
 * Сырые метрики месяца.
 * homeworkDone — зачтено (approved), homeworkOnTime — вовремя из зачтённых.
 * examsDone — сдано за всё время (в каждом месяце одно и то же значение-накопитель для мока).
 */
export const MOCK_RATING_BY_MONTH = {
  [CURRENT_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.9, homeworkDone: 12, homeworkOnTime: 12, homeworkTotal: 12, examsDone: 4 },
    artem: { avgGrade: 4.7, homeworkDone: 12, homeworkOnTime: 11, homeworkTotal: 12, examsDone: 4 },
    maxim: { avgGrade: 4.5, homeworkDone: 12, homeworkOnTime: 11, homeworkTotal: 12, examsDone: 4 },
    denis: { avgGrade: 4.2, homeworkDone: 12, homeworkOnTime: 10, homeworkTotal: 12, examsDone: 4 },
    masha: { avgGrade: 4.1, homeworkDone: 12, homeworkOnTime: 11, homeworkTotal: 12, examsDone: 4 },
    ilya: { avgGrade: 4.0, homeworkDone: 12, homeworkOnTime: 10, homeworkTotal: 12, examsDone: 4 },
    katya: { avgGrade: 3.9, homeworkDone: 12, homeworkOnTime: 10, homeworkTotal: 12, examsDone: 4 },
    kirill: { avgGrade: 4.4, homeworkDone: 12, homeworkOnTime: 11, homeworkTotal: 12, examsDone: 4 },
    lera: { avgGrade: 4.3, homeworkDone: 12, homeworkOnTime: 12, homeworkTotal: 12, examsDone: 4 },
    timur: { avgGrade: 4.2, homeworkDone: 12, homeworkOnTime: 11, homeworkTotal: 12, examsDone: 4 },
    alina: { avgGrade: 4.7, homeworkDone: 10, homeworkOnTime: 10, homeworkTotal: 12, examsDone: 3 },
    vika: { avgGrade: 4.3, homeworkDone: 10, homeworkOnTime: 9, homeworkTotal: 12, examsDone: 2 },
    pavel: { avgGrade: 3.6, homeworkDone: 7, homeworkOnTime: 7, homeworkTotal: 12, examsDone: 1 },
    nika: { avgGrade: 3.4, homeworkDone: 6, homeworkOnTime: 6, homeworkTotal: 12, examsDone: 0 },
    egor: { avgGrade: 3.2, homeworkDone: 5, homeworkOnTime: 5, homeworkTotal: 12, examsDone: 0 },
  }),
  [PREVIOUS_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.8, homeworkDone: 11, homeworkOnTime: 11, homeworkTotal: 11, examsDone: 4 },
    artem: { avgGrade: 4.6, homeworkDone: 11, homeworkOnTime: 10, homeworkTotal: 11, examsDone: 4 },
    maxim: { avgGrade: 4.5, homeworkDone: 11, homeworkOnTime: 10, homeworkTotal: 11, examsDone: 4 },
    denis: { avgGrade: 4.1, homeworkDone: 11, homeworkOnTime: 9, homeworkTotal: 11, examsDone: 4 },
    masha: { avgGrade: 4.0, homeworkDone: 11, homeworkOnTime: 10, homeworkTotal: 11, examsDone: 4 },
    ilya: { avgGrade: 3.9, homeworkDone: 11, homeworkOnTime: 9, homeworkTotal: 11, examsDone: 4 },
    katya: { avgGrade: 3.8, homeworkDone: 11, homeworkOnTime: 9, homeworkTotal: 11, examsDone: 4 },
    kirill: { avgGrade: 4.3, homeworkDone: 11, homeworkOnTime: 10, homeworkTotal: 11, examsDone: 4 },
    lera: { avgGrade: 4.2, homeworkDone: 11, homeworkOnTime: 11, homeworkTotal: 11, examsDone: 4 },
    timur: { avgGrade: 4.1, homeworkDone: 11, homeworkOnTime: 10, homeworkTotal: 11, examsDone: 4 },
    alina: { avgGrade: 4.5, homeworkDone: 9, homeworkOnTime: 9, homeworkTotal: 11, examsDone: 3 },
    vika: { avgGrade: 4.2, homeworkDone: 9, homeworkOnTime: 9, homeworkTotal: 11, examsDone: 2 },
    pavel: { avgGrade: 3.5, homeworkDone: 6, homeworkOnTime: 6, homeworkTotal: 11, examsDone: 1 },
    nika: { avgGrade: 3.3, homeworkDone: 5, homeworkOnTime: 5, homeworkTotal: 11, examsDone: 0 },
    egor: { avgGrade: 3.1, homeworkDone: 4, homeworkOnTime: 4, homeworkTotal: 11, examsDone: 0 },
  }),
  [EARLIER_MONTH_KEY]: fromGroup({
    sofia: { avgGrade: 4.8, homeworkDone: 10, homeworkOnTime: 10, homeworkTotal: 10, examsDone: 4 },
    artem: { avgGrade: 4.4, homeworkDone: 10, homeworkOnTime: 8, homeworkTotal: 10, examsDone: 4 },
    maxim: { avgGrade: 4.4, homeworkDone: 10, homeworkOnTime: 9, homeworkTotal: 10, examsDone: 4 },
    denis: { avgGrade: 4.0, homeworkDone: 10, homeworkOnTime: 8, homeworkTotal: 10, examsDone: 4 },
    masha: { avgGrade: 4.2, homeworkDone: 10, homeworkOnTime: 9, homeworkTotal: 10, examsDone: 4 },
    ilya: { avgGrade: 3.8, homeworkDone: 10, homeworkOnTime: 8, homeworkTotal: 10, examsDone: 4 },
    katya: { avgGrade: 3.7, homeworkDone: 10, homeworkOnTime: 8, homeworkTotal: 10, examsDone: 4 },
    kirill: { avgGrade: 4.2, homeworkDone: 10, homeworkOnTime: 9, homeworkTotal: 10, examsDone: 4 },
    lera: { avgGrade: 4.1, homeworkDone: 10, homeworkOnTime: 10, homeworkTotal: 10, examsDone: 4 },
    timur: { avgGrade: 4.0, homeworkDone: 10, homeworkOnTime: 9, homeworkTotal: 10, examsDone: 4 },
    alina: { avgGrade: 4.6, homeworkDone: 9, homeworkOnTime: 9, homeworkTotal: 10, examsDone: 3 },
    vika: { avgGrade: 4.1, homeworkDone: 8, homeworkOnTime: 8, homeworkTotal: 10, examsDone: 2 },
    pavel: { avgGrade: 3.4, homeworkDone: 5, homeworkOnTime: 5, homeworkTotal: 10, examsDone: 1 },
    nika: { avgGrade: 3.2, homeworkDone: 5, homeworkOnTime: 5, homeworkTotal: 10, examsDone: 0 },
    egor: { avgGrade: 3.0, homeworkDone: 4, homeworkOnTime: 4, homeworkTotal: 10, examsDone: 0 },
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
          homeworkDone: row.homeworkDone,
          homeworkOnTime: row.homeworkOnTime,
          homeworkTotal: row.homeworkTotal,
          examsDone: row.examsDone,
          examsTotal: row.examsTotal,
        })
        continue
      }
      prev.gradeWeightSum += row.avgGrade * row.homeworkTotal
      prev.weight += row.homeworkTotal
      prev.homeworkDone += row.homeworkDone
      prev.homeworkOnTime += row.homeworkOnTime
      prev.homeworkTotal += row.homeworkTotal
      // экзамены — накопительный счётчик за всё время, берём max из месяцев
      prev.examsDone = Math.max(prev.examsDone, row.examsDone)
      prev.examsTotal = Math.max(prev.examsTotal, row.examsTotal)
    }
  }

  return [...byId.values()].map((row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    shortName: row.shortName,
    avgGrade: row.weight > 0 ? Math.round((row.gradeWeightSum / row.weight) * 10) / 10 : 0,
    homeworkDone: row.homeworkDone,
    homeworkOnTime: row.homeworkOnTime,
    homeworkTotal: row.homeworkTotal,
    examsDone: row.examsDone,
    examsTotal: row.examsTotal,
  }))
}

/** Все ДЗ зачтены и все экзамены сданы → право на 1-е место */
export function isFirstPlaceEligible(row) {
  const hwOk = row.homeworkTotal > 0 && row.homeworkDone >= row.homeworkTotal
  const examsOk = row.examsTotal > 0 && row.examsDone >= row.examsTotal
  return hwOk && examsOk
}

/** Прогресс закрытия ДЗ + экзаменов (0–100) */
export function computeCompletionPercent(row) {
  const hwPart = row.homeworkTotal > 0 ? row.homeworkDone / row.homeworkTotal : 0
  const examPart = row.examsTotal > 0 ? row.examsDone / row.examsTotal : 0
  return Math.round(((hwPart + examPart) / 2) * 100)
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

function enrichStudent(row) {
  const breakdown = computeRatingBreakdown(row)
  const completionPercent = computeCompletionPercent(row)
  const firstPlace = isFirstPlaceEligible(row)

  return {
    ...row,
    fullName: `${row.lastName} ${row.firstName}`,
    avgLabel: formatAverage(row.avgGrade),
    gradesPercent: Math.round(breakdown.gradesNormalized),
    homeworkPercent: Math.round(breakdown.homeworkPercent),
    gradesShare: Math.round(breakdown.gradesShare),
    homeworkShare: Math.round(breakdown.homeworkShare),
    points: breakdown.points,
    completionPercent,
    isFirstPlace: firstPlace,
    isCurrent: row.id === CURRENT_USER_ID,
  }
}

/**
 * 1-е место — общее для всех, кто закрыл все ДЗ и все экзамены.
 * Остальные — dense-ранг по прогрессу, затем по баллу 50/50.
 */
export function rankStudents(students) {
  const enriched = students.map(enrichStudent)

  const champions = enriched
    .filter((row) => row.isFirstPlace)
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'))

  const others = enriched
    .filter((row) => !row.isFirstPlace)
    .sort((a, b) => {
      if (b.completionPercent !== a.completionPercent) {
        return b.completionPercent - a.completionPercent
      }
      if (b.points !== a.points) return b.points - a.points
      return a.fullName.localeCompare(b.fullName, 'ru')
    })

  const ranked = []

  for (const row of champions) {
    ranked.push({ ...row, rank: 1 })
  }

  let nextRank = champions.length > 0 ? 2 : 1
  let i = 0
  while (i < others.length) {
    const current = others[i]
    let j = i + 1
    while (
      j < others.length
      && others[j].completionPercent === current.completionPercent
      && others[j].points === current.points
    ) {
      j += 1
    }
    for (let k = i; k < j; k += 1) {
      ranked.push({ ...others[k], rank: nextRank })
    }
    nextRank += 1
    i = j
  }

  return ranked
}

/** Группы одного места — для UI «несколько учеников на месте» */
export function groupByRank(rankedStudents) {
  const groups = []
  const byRank = new Map()

  for (const row of rankedStudents) {
    if (!byRank.has(row.rank)) {
      const group = {
        rank: row.rank,
        isFirstPlace: row.isFirstPlace,
        points: row.points,
        completionPercent: row.completionPercent,
        students: [],
      }
      byRank.set(row.rank, group)
      groups.push(group)
    }
    byRank.get(row.rank).students.push(row)
  }

  return groups
}

export function getAllTimeRanking() {
  return rankStudents(aggregateAllMonths())
}

const allTimeRanking = getAllTimeRanking()
const currentUserRow = allTimeRanking.find((row) => row.isCurrent)

/** Снимок для виджета на главной — те же места, что на /rating */
export const RATING_WIDGET_SNAPSHOT = {
  rank: currentUserRow?.rank ?? 0,
  total: allTimeRanking.length,
  points: currentUserRow?.points ?? 0,
  periodLabel: 'За всё время',
  homeworkDone: currentUserRow?.homeworkDone ?? 0,
  homeworkTotal: currentUserRow?.homeworkTotal ?? 0,
  examsDone: currentUserRow?.examsDone ?? 0,
  examsTotal: currentUserRow?.examsTotal ?? 0,
  completionPercent: currentUserRow?.completionPercent ?? 0,
  isFirstPlace: currentUserRow?.isFirstPlace ?? false,
  gradesPercent: currentUserRow?.homeworkTotal
    ? Math.round((currentUserRow.homeworkDone / currentUserRow.homeworkTotal) * 100)
    : 0,
  homeworkPercent: currentUserRow?.examsTotal
    ? Math.round((currentUserRow.examsDone / currentUserRow.examsTotal) * 100)
    : 0,
  leaderboard: allTimeRanking.slice(0, LEADERBOARD_LIMIT).map((row) => ({
    rank: row.rank,
    name: row.shortName,
    points: row.points,
    isCurrent: row.isCurrent,
    isFirstPlace: row.isFirstPlace,
  })),
  leaderboardLimit: LEADERBOARD_LIMIT,
  linkHref: '/rating',
}

export const FORMULA_TOOLTIP =
  '1-е место — общее: сделай все ДЗ (зачтены) и сдай все экзамены. Несколько детей могут стоять на 1-м месте рядом. Остальные места — по прогрессу и баллу 50/50. Пересчёт каждый день.'
