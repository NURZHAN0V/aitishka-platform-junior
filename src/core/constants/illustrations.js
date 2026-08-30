export const ILLUSTRATION_CATEGORIES = {
  brand: 'brand',
  subjects: 'subjects',
  widgets: 'widgets',
  journal: 'journal',
  market: 'market',
  nav: 'nav',
}

export const BRAND_ILLUSTRATIONS = {
  logo: 'logo-cube',
  coin: 'coin-single',
  coinStack: 'coin-stack',
}

export const SUBJECT_ILLUSTRATIONS = {
  python: 'python-subject',
  scratch: 'scratch-subject',
  roblox: 'roblox-subject',
  literacy: 'literacy-subject',
  html: 'html-subject',
  kodu: 'kodu-subject',
  lego: 'lego-subject',
  gimp: 'gimp-subject',
  construct: 'construct-subject',
  'it-start': 'it-start-subject',
  '3d-world': '3d-world-subject',
  'media-blogging': 'media-blogging-subject',
  animation: 'animation-subject',
  'lego-wedo': 'lego-wedo-subject',
}

export const WIDGET_ILLUSTRATIONS = {
  trophy: 'trophy',
  homeworkNotepad: 'homework-notepad',
  backpack: 'backpack',
  treasureChest: 'treasure-chest',
  shoppingBasket: 'shopping-basket',
  rocket: 'rocket',
  studentBoy: 'student-boy',
  avatarMoreVariants: 'avatar-more-variants',
  photoPolaroidCard: 'photo-polaroid-card',
}

export const JOURNAL_ILLUSTRATIONS = {
  gradeStar: 'journal-grade-star',
  gradeDisc: 'journal-grade-disc',
  attendance: 'journal-attendance',
}

export const MARKET_ILLUSTRATIONS = {
  hoodie: 'market-hoodie',
  bottle: 'market-bottle',
  pencilCase: 'market-pencil-case',
  notebook: 'market-notebook',
  stickers: 'market-stickers',
  dinosaur: 'market-dinosaur',
  unicorn: 'market-unicorn',
  basketballHoop: 'market-basketball-hoop',
}

export const SUBJECT_COLORS = {
  python: '#3b82f6',
  scratch: '#f97316',
  roblox: '#8b5cf6',
  literacy: '#10b981',
  html: '#ef4444',
  kodu: '#06b6d4',
  lego: '#eab308',
  gimp: '#ec4899',
  construct: '#6366f1',
  'it-start': '#8b5cf6',
  '3d-world': '#06b6d4',
  'media-blogging': '#ec4899',
  animation: '#f59e0b',
  'lego-wedo': '#eab308',
}

export const NAV_ILLUSTRATIONS = {
  home: 'nav-home',
  schedule: 'nav-schedule',
  grades: 'nav-grades',
  homework: 'nav-homework',
  exams: 'nav-exams',
  rating: 'nav-rating',
  journal: 'nav-journal',
  coins: 'nav-coins',
  market: 'nav-market',
  orders: 'nav-orders',
  payments: 'nav-payments',
  profile: 'nav-profile',
  reviews: 'nav-reviews',
  settings: 'nav-settings',
  help: 'nav-help',
  logout: 'nav-logout',
}

export const ALL_ILLUSTRATIONS = [
  ...Object.values(BRAND_ILLUSTRATIONS),
  ...Object.values(SUBJECT_ILLUSTRATIONS),
  ...Object.values(WIDGET_ILLUSTRATIONS),
  ...Object.values(JOURNAL_ILLUSTRATIONS),
  ...Object.values(MARKET_ILLUSTRATIONS),
  ...Object.values(NAV_ILLUSTRATIONS),
]

export function getSubjectIllustrationName(slug) {
  return SUBJECT_ILLUSTRATIONS[slug] ?? null
}

export function getSubjectColor(slug) {
  return SUBJECT_COLORS[slug] ?? null
}
