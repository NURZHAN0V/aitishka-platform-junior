import { MARKET_ILLUSTRATIONS } from '@/core/constants/illustrations'

export const MARKET_PAGE_LINK = '/market'

export const MARKET_CATEGORIES = [
  { id: 'all', label: 'Все', chip: 'current' },
  { id: 'merch', label: 'Мерч', chip: 'pending' },
  { id: 'stationery', label: 'Канцелярия', chip: 'approved' },
  { id: 'toys', label: 'Игрушки', chip: 'overdue' },
]

export const MARKET_SORT_OPTIONS = [
  { value: 'price-asc', label: 'Сначала дешёвые' },
  { value: 'price-desc', label: 'Сначала дорогие' },
  { value: 'name-asc', label: 'По названию А–Я' },
]

/** Статусы заказа: Оформлен → Готов к выдаче → Получен */
export const ORDER_STATUSES = {
  placed: {
    id: 'placed',
    label: 'Оформлен',
    hint: 'Заказ принят. Скоро его подготовят к выдаче',
    chip: 'pending',
  },
  ready: {
    id: 'ready',
    label: 'Готов к выдаче',
    hint: 'Можно забрать в школе на занятиях',
    chip: 'current',
  },
  received: {
    id: 'received',
    label: 'Получен',
    hint: 'Ты уже забрал этот заказ',
    chip: 'approved',
  },
}

function atOffset(dayOffset, hour = 12, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

/**
 * Каталог маркета.
 * stock === 0 → «Нет в наличии»
 * price > баланс → «Не хватает монеток»
 */
export const MOCK_PRODUCTS = [
  {
    id: 'p-hoodie',
    name: 'Худи IT Camp',
    category: 'merch',
    price: 150,
    stock: 6,
    illustration: MARKET_ILLUSTRATIONS.hoodie,
    accent: '#3b82f6',
  },
  {
    id: 'p-bottle',
    name: 'Бутылка IT Camp',
    category: 'merch',
    price: 90,
    stock: 12,
    illustration: MARKET_ILLUSTRATIONS.bottle,
    accent: '#06b6d4',
  },
  {
    id: 'p-pencil-case',
    name: 'Пенал космос',
    category: 'stationery',
    price: 120,
    stock: 8,
    illustration: MARKET_ILLUSTRATIONS.pencilCase,
    accent: '#8b5cf6',
  },
  {
    id: 'p-notebook',
    name: 'Блокнот в клетку',
    category: 'stationery',
    price: 80,
    stock: 20,
    illustration: MARKET_ILLUSTRATIONS.notebook,
    accent: '#10b981',
  },
  {
    id: 'p-stickers',
    name: 'Набор стикеров',
    category: 'stationery',
    price: 100,
    stock: 15,
    illustration: MARKET_ILLUSTRATIONS.stickers,
    accent: '#f59e0b',
  },
  {
    id: 'p-dino',
    name: 'Мягкая игрушка Дино',
    category: 'toys',
    price: 200,
    stock: 4,
    illustration: MARKET_ILLUSTRATIONS.dinosaur,
    accent: '#22c55e',
  },
  {
    id: 'p-unicorn',
    name: 'Единорог-плюш',
    category: 'toys',
    price: 180,
    stock: 5,
    illustration: MARKET_ILLUSTRATIONS.unicorn,
    accent: '#ec4899',
  },
  {
    id: 'p-hoop',
    name: 'Баскетбольное кольцо',
    category: 'toys',
    price: 300,
    stock: 0,
    illustration: MARKET_ILLUSTRATIONS.basketballHoop,
    accent: '#f97316',
  },
  {
    id: 'p-backpack',
    name: 'Рюкзак Premium',
    category: 'merch',
    price: 1400,
    stock: 2,
    illustration: MARKET_ILLUSTRATIONS.hoodie,
    accent: '#6366f1',
  },
]

/** Заказы в разных статусах — плюс новые после покупки в сессии */
export const MOCK_ORDERS = [
  {
    id: 'o-stickers',
    productId: 'p-stickers',
    productName: 'Набор стикеров',
    price: 40,
    status: 'received',
    illustration: MARKET_ILLUSTRATIONS.stickers,
    accent: '#f59e0b',
    createdAt: atOffset(-6, 20, 0),
  },
  {
    id: 'o-notebook',
    productId: 'p-notebook',
    productName: 'Блокнот IT Camp',
    price: 60,
    status: 'ready',
    illustration: MARKET_ILLUSTRATIONS.notebook,
    accent: '#10b981',
    createdAt: atOffset(-3, 12, 45),
  },
  {
    id: 'o-bottle',
    productId: 'p-bottle',
    productName: 'Бутылка IT Camp',
    price: 90,
    status: 'placed',
    illustration: MARKET_ILLUSTRATIONS.bottle,
    accent: '#06b6d4',
    createdAt: atOffset(-1, 18, 10),
  },
]

export function formatOrderDate(iso) {
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

export function coinsWord(n) {
  const abs = Math.abs(n) % 100
  const mod10 = abs % 10
  if (abs > 10 && abs < 20) return 'монеток'
  if (mod10 === 1) return 'монетка'
  if (mod10 >= 2 && mod10 <= 4) return 'монетки'
  return 'монеток'
}
