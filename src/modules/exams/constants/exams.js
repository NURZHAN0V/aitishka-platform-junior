import { SUBJECT_LABELS } from '@/modules/schedule/constants/lessons.js'
import { GRADE_SCALE } from '@/modules/grades/constants/grades.js'

export { SUBJECT_LABELS, GRADE_SCALE }

export const EXAM_STATUSES = {
  all: {
    id: 'all',
    label: 'Все',
    chip: 'missing',
    tooltip: 'Все экзамены за весь период обучения',
  },
  awaiting: {
    id: 'awaiting',
    label: 'Ожидает загрузки',
    chip: 'current',
    tooltip: 'Работу ещё не загрузили. Загрузить можно один раз — до даты проверки',
  },
  uploaded: {
    id: 'uploaded',
    label: 'Загружено',
    chip: 'pending',
    tooltip: 'Работа на проверке у преподавателя. Повторно загрузить нельзя',
  },
  checked: {
    id: 'checked',
    label: 'Проверено',
    chip: 'approved',
    tooltip: 'Есть оценка. Файл можно посмотреть, загрузка закрыта',
  },
  missed: {
    id: 'missed',
    label: 'Пропущено',
    chip: 'overdue',
    tooltip: 'Срок сдачи прошёл без загрузки. Кнопка активна до даты проверки преподавателя',
  },
}

export const STATUS_FILTERS = [
  EXAM_STATUSES.all,
  EXAM_STATUSES.awaiting,
  EXAM_STATUSES.uploaded,
  EXAM_STATUSES.checked,
  EXAM_STATUSES.missed,
]

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'Все предметы' },
  ...Object.entries(SUBJECT_LABELS).map(([value, label]) => ({ value, label })),
]

function atOffset(dayOffset, hour = 23, minute = 59) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

export const MOCK_EXAMS = [
  {
    id: 'exam-python-loops',
    subject: 'python',
    title: 'Промежуточный экзамен: циклы',
    teacher: 'Виктор Гоголадзе',
    deadline: atOffset(0, 23, 59),
    reviewDate: atOffset(5, 18, 0),
    status: 'awaiting',
    grade: null,
    program:
      'Теория: for, while, range. Практика: три задачи на сумму, фильтр чётных и поиск максимума. Загрузите один файл .py.',
    materials: [
      { name: 'programma-cikly.pdf', kind: 'pdf' },
      { name: 'primer-zadach.py', kind: 'code' },
    ],
    recommendations:
      'Повторите ДЗ «Циклы в Python» и прогоните примеры до загрузки. Файл отправить можно только один раз.',
    teacherComment: null,
    submittedAt: null,
    uploadedFileName: null,
    reviewedAt: null,
  },
  {
    id: 'exam-scratch-anim',
    subject: 'scratch',
    title: 'Экзамен: анимация персонажа',
    teacher: 'Мария Козлова',
    deadline: atOffset(1, 23, 59),
    reviewDate: atOffset(7, 16, 0),
    status: 'awaiting',
    grade: null,
    program:
      'Соберите короткую анимацию: ходьба, смена костюма, цикл. Загрузите проект Scratch (.sb3).',
    materials: [{ name: 'kriterii-animacii.pdf', kind: 'pdf' }],
    recommendations:
      'Проверьте, что проект открывается на школьном компьютере. Добавьте звук, если успеете — это не обязательно.',
    teacherComment: null,
    submittedAt: null,
    uploadedFileName: null,
    reviewedAt: null,
  },
  {
    id: 'exam-python-functions',
    subject: 'python',
    title: 'Экзамен: функции',
    teacher: 'Виктор Гоголадзе',
    deadline: atOffset(1, 23, 59),
    reviewDate: atOffset(4, 18, 0),
    status: 'uploaded',
    grade: null,
    program:
      'Напишите три функции: приветствие, площадь прямоугольника и проверка чётности. Один файл .py.',
    materials: [{ name: 'bilet-funkcii.pdf', kind: 'pdf' }],
    recommendations: 'Подпишите функции понятными именами и добавьте по одному примеру вызова.',
    teacherComment: null,
    submittedAt: atOffset(-1, 19, 40),
    uploadedFileName: 'funkcii-ekzamen.py',
    reviewedAt: null,
  },
  {
    id: 'exam-literacy-att',
    subject: 'literacy',
    title: 'Промежуточная аттестация',
    teacher: 'Анна Смирнова',
    deadline: atOffset(-12, 23, 59),
    reviewDate: atOffset(-8, 12, 30),
    status: 'checked',
    grade: 4,
    program:
      'Тест по файлам, папкам и браузеру плюс практическое задание: подписать скриншоты рабочего стола.',
    materials: [{ name: 'programma-attestaciya.pdf', kind: 'pdf' }],
    recommendations: 'Перед экзаменом повторите расширения файлов и безопасные сайты.',
    teacherComment: 'Хорошая работа. Внимательнее к расширениям скрытых файлов.',
    submittedAt: atOffset(-13, 18, 10),
    uploadedFileName: 'attestaciya-smirnova.pdf',
    reviewedAt: atOffset(-8, 12, 30),
  },
  {
    id: 'exam-scratch-events',
    subject: 'scratch',
    title: 'Контрольный экзамен: события',
    teacher: 'Мария Козлова',
    deadline: atOffset(-6, 23, 59),
    reviewDate: atOffset(-3, 16, 0),
    status: 'checked',
    grade: 5,
    program: 'Игра-кликер: счёт очков, кнопка, смена костюма. Загрузить проект .sb3.',
    materials: [{ name: 'kriterii-kliker.pdf', kind: 'pdf' }],
    recommendations: 'Сначала сделайте счётчик, потом оформление. Не забудьте сохранить проект.',
    teacherComment: 'Отлично: логика событий чистая, проект запускается сразу.',
    submittedAt: atOffset(-7, 20, 5),
    uploadedFileName: 'clicker-ekzamen.sb3',
    reviewedAt: atOffset(-3, 16, 0),
  },
  {
    id: 'exam-literacy-files',
    subject: 'literacy',
    title: 'Экзамен: файлы и папки',
    teacher: 'Анна Смирнова',
    deadline: atOffset(-1, 23, 59),
    reviewDate: atOffset(2, 12, 0),
    status: 'missed',
    grade: null,
    program: 'Подпишите скриншоты: имя файла, расширение и папка. Один PDF или набор изображений.',
    materials: [{ name: 'blank-podpisi.pdf', kind: 'pdf' }],
    recommendations:
      'Срок сдачи уже прошёл, но загрузить ещё можно до даты проверки. Только один файл.',
    teacherComment: null,
    submittedAt: null,
    uploadedFileName: null,
    reviewedAt: null,
  },
  {
    id: 'exam-roblox-gui',
    subject: 'roblox',
    title: 'Экзамен: интерфейс игры',
    teacher: 'Виктор Гоголадзе',
    deadline: atOffset(-4, 23, 59),
    reviewDate: atOffset(-1, 17, 0),
    status: 'missed',
    grade: null,
    program: 'Меню паузы: кнопки «Продолжить» и «Выйти». Загрузить файл места Roblox.',
    materials: [{ name: 'gui-ekzamen.pdf', kind: 'pdf' }],
    recommendations: 'Дата проверки уже прошла — загрузка закрыта. Обратитесь к преподавателю.',
    teacherComment: null,
    submittedAt: null,
    uploadedFileName: null,
    reviewedAt: null,
  },
  {
    id: 'exam-roblox-world',
    subject: 'roblox',
    title: 'Итоговая: свой мир',
    teacher: 'Виктор Гоголадзе',
    deadline: atOffset(12, 23, 59),
    reviewDate: atOffset(18, 17, 0),
    status: 'awaiting',
    grade: null,
    program:
      'Соберите небольшой мир: спавн, три зоны и финиш. Загрузите файл места. Работа одна на экзамен.',
    materials: [
      { name: 'tz-mir.pdf', kind: 'pdf' },
      { name: 'cheklist-zon.pdf', kind: 'pdf' },
    ],
    recommendations:
      'Начните со спавна и чекпоинтов. Не оставляйте загрузку на последний день — файл один.',
    teacherComment: null,
    submittedAt: null,
    uploadedFileName: null,
    reviewedAt: null,
  },
  {
    id: 'exam-python-intro',
    subject: 'python',
    title: 'Вступительный зачёт',
    teacher: 'Виктор Гоголадзе',
    deadline: atOffset(-40, 23, 59),
    reviewDate: atOffset(-35, 18, 0),
    status: 'checked',
    grade: 3,
    program: 'Базовый синтаксис: переменные, ввод-вывод, одно условие. Файл .py.',
    materials: [{ name: 'vstupitelnyj.pdf', kind: 'pdf' }],
    recommendations: 'Этот зачёт уже в архиве периода обучения — смотрите оценку и файл.',
    teacherComment: 'Зачёт принят. Больше тренируйте условия if/else.',
    submittedAt: atOffset(-41, 21, 0),
    uploadedFileName: 'vstupitelnyj.py',
    reviewedAt: atOffset(-35, 18, 0),
  },
]
