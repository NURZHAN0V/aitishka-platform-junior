/** Режимы и пулы текста для «Клавишленд» */

export const KEYLAND_STORAGE_KEY = 'elektronnyj-dnevnik:keyland-results'
export const KEYLAND_RESULTS_LIMIT = 12

export const KEYLAND_MODES = [
  {
    id: 'letters-ru',
    label: 'Буквы (русский)',
    hint: 'Отдельные буквы и простые сочетания',
    layout: 'ru',
    kind: 'letters',
  },
  {
    id: 'letters-en',
    label: 'Буквы (английский)',
    hint: 'Латинские буквы и сочетания',
    layout: 'en',
    kind: 'letters',
  },
  {
    id: 'words-ru',
    label: 'Слова (русский)',
    hint: 'Короткие русские слова',
    layout: 'ru',
    kind: 'words',
  },
  {
    id: 'words-en',
    label: 'Слова (английский)',
    hint: 'Короткие английские слова',
    layout: 'en',
    kind: 'words',
  },
  {
    id: 'punctuation',
    label: 'Знаки препинания',
    hint: 'Точка, запятая и другие знаки',
    layout: 'ru',
    kind: 'punctuation',
  },
  {
    id: 'digits-symbols',
    label: 'Цифры и символы',
    hint: 'Цифры и знаки вроде @ # %',
    layout: 'en',
    kind: 'digits',
  },
]

const LETTERS_RU = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
const LETTERS_EN = 'abcdefghijklmnopqrstuvwxyz'

const WORDS_RU = [
  'кот',
  'дом',
  'мир',
  'лес',
  'река',
  'школа',
  'книга',
  'друг',
  'игра',
  'солнце',
  'луна',
  'вода',
  'город',
  'класс',
  'печать',
  'клавиша',
  'скорость',
  'точность',
  'привет',
  'успех',
]

const WORDS_EN = [
  'cat',
  'dog',
  'sun',
  'moon',
  'book',
  'code',
  'game',
  'play',
  'type',
  'fast',
  'key',
  'word',
  'hello',
  'world',
  'light',
  'space',
  'focus',
  'skill',
  'train',
  'score',
]

const PUNCTUATION_POOL = '.,!?;:()-«»"'
const DIGITS_POOL = '0123456789'
const SYMBOLS_POOL = '@#%&*+=/\\'

/** ЙЦУКЕН (нижний регистр) */
export const LAYOUT_RU = [
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.'],
]

/** QWERTY */
export const LAYOUT_EN = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
]

export const LAYOUT_DIGITS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '%', '&', '*', '+', '=', '/', '\\'],
  [',', '.', '-', '_', '!', '?', ';', ':'],
]

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomChar(pool) {
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildLetters(pool, count = 48) {
  const chunks = []
  while (chunks.join('').replace(/\s/g, '').length < count) {
    const len = 2 + Math.floor(Math.random() * 3)
    let chunk = ''
    for (let i = 0; i < len; i += 1) chunk += randomChar(pool)
    chunks.push(chunk)
  }
  return chunks.join(' ').slice(0, count + 12).trim()
}

function buildWords(words, count = 10) {
  const picked = []
  for (let i = 0; i < count; i += 1) {
    picked.push(randomItem(words))
  }
  return picked.join(' ')
}

function buildMixed(pool, count = 40) {
  const parts = []
  while (parts.join('').replace(/\s/g, '').length < count) {
    const group = []
    const n = 1 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i += 1) group.push(randomChar(pool))
    parts.push(group.join(''))
  }
  return parts.join(' ').slice(0, count + 10).trim()
}

export function getModeById(modeId) {
  return KEYLAND_MODES.find((m) => m.id === modeId) ?? KEYLAND_MODES[0]
}

export function buildPassage(modeId) {
  const mode = getModeById(modeId)
  switch (mode.kind) {
    case 'letters':
      return buildLetters(mode.layout === 'ru' ? LETTERS_RU : LETTERS_EN)
    case 'words':
      return buildWords(mode.layout === 'ru' ? WORDS_RU : WORDS_EN)
    case 'punctuation':
      return buildMixed(PUNCTUATION_POOL + ' ', 36)
    case 'digits':
      return buildMixed(DIGITS_POOL + SYMBOLS_POOL, 40)
    default:
      return buildLetters(LETTERS_RU)
  }
}

export function getKeyboardRows(modeId) {
  const mode = getModeById(modeId)
  if (mode.kind === 'digits') return LAYOUT_DIGITS
  return mode.layout === 'ru' ? LAYOUT_RU : LAYOUT_EN
}

export function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function calcSpeedCpm(chars, elapsedMs) {
  if (!elapsedMs || elapsedMs < 1) return 0
  return Math.round((chars / elapsedMs) * 60000)
}

export function calcAccuracy(correct, errors) {
  const total = correct + errors
  if (total <= 0) return 100
  return Math.round((correct / total) * 1000) / 10
}
