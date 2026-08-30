import { PROFILE_BONUS_COINS } from '@/modules/coins/constants/coins.js'

export const PROFILE_PAGE_LINK = '/profile'
export const SETTINGS_PAGE_LINK = '/settings'
export const PROFILE_BONUS = PROFILE_BONUS_COINS

/** Стабильный id аккаунта для seed аватарки (не имя и не email) */
export const MOCK_ACCOUNT_ID = 'acc_itcamp_py1_a7f3'

/**
 * Статусы фото:
 * none — нет фото
 * pending — на проверке (повторная загрузка запрещена)
 * approved — одобрено (загрузка) или сразу после генерации
 * rejected — отклонено (можно загрузить снова)
 */
export const PHOTO_STATUSES = {
  none: {
    id: 'none',
    label: 'Нет фото',
    chip: null,
    hint: 'Загрузи фото на проверку или сгенерируй аватарку',
  },
  pending: {
    id: 'pending',
    label: 'На проверке',
    chip: 'pending',
    hint: 'Фото на проверке. Пока нельзя загрузить новое — можно сгенерировать аватарку',
  },
  approved: {
    id: 'approved',
    label: 'Одобрено',
    chip: 'approved',
    hint: 'Фото одобрено. Можно заменить или сгенерировать аватарку',
  },
  rejected: {
    id: 'rejected',
    label: 'Отклонено',
    chip: 'rejected',
    hint: 'Загрузи другое фото или сгенерируй аватарку',
  },
}

export const PHOTO_SOURCES = {
  upload: 'upload',
  generated: 'generated',
}

/**
 * Mock профиля — ФИО согласовано с рейтингом и шапкой.
 * Фото отклонено → подарок за одобренное фото ещё не получен.
 */
export const MOCK_PROFILE = {
  accountId: MOCK_ACCOUNT_ID,
  fullName: 'Алина Петрова',
  group: 'Группа Python-1',
  school: 'МБОУ СОШ № 25 г. Сочи',
  phone: '+7 (918) 555-12-34',
  email: 'alina.petrova@itcampsochi.ru',
  birthDate: '2014-03-18',
  photo: {
    status: 'rejected',
    url: '',
    fileName: '',
    rejectReason: 'Лицо плохо видно — загрузи более чёткое фото',
    source: null,
    seed: '',
  },
  /** Уже начисляли 5 монеток за одобренное загруженное фото */
  profileBonusAwarded: false,
}

export function formatBirthDate(iso) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function isPhotoFilled(photo) {
  const status = photo?.status
  return status === 'pending' || status === 'approved'
}

/** Подарок +5: только загруженное фото после одобрения (не Clay-аватарка) */
export function isPhotoGiftEligible(photo) {
  return photo?.status === 'approved' && photo?.source === PHOTO_SOURCES.upload
}

export function canUploadPhoto(photo) {
  return photo?.status !== 'pending'
}

/**
 * Метаданные статуса фото для экрана настроек.
 * @param {object} photo
 */
export function getPhotoMeta(photo) {
  const base = PHOTO_STATUSES[photo?.status] || PHOTO_STATUSES.none

  if (photo?.status === 'approved' && photo?.source === PHOTO_SOURCES.generated) {
    return {
      ...base,
      label: 'Аватарка',
      hint: 'Можно заменить на фото или выбрать другую аватарку',
    }
  }

  return base
}
