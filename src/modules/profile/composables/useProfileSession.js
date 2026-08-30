import { computed, reactive, ref } from 'vue'
import { PROFILE_BONUS_COINS } from '@/modules/coins/constants/coins.js'
import { earnCoins } from '@/modules/coins/composables/useCoinsBalance.js'
import {
  MOCK_PROFILE,
  PHOTO_SOURCES,
  PROFILE_BONUS,
  PROFILE_PAGE_LINK,
  SETTINGS_PAGE_LINK,
  formatBirthDate,
  isPhotoGiftEligible,
} from '../constants/profile.js'

function cloneProfile(source = MOCK_PROFILE) {
  return {
    ...source,
    photo: { ...source.photo },
  }
}

/** Единый профиль на сессию — шапка, профиль, настройки */
const profile = reactive(cloneProfile(MOCK_PROFILE))
const lastBonusAwarded = ref(false)

export function useProfileSession() {
  const birthDateLabel = computed(() => formatBirthDate(profile.birthDate))

  /** Загруженное фото на модерации — подарок ещё не выдан */
  const photoGiftPending = computed(
    () =>
      profile.photo.status === 'pending' && profile.photo.source === PHOTO_SOURCES.upload,
  )

  /** Подарок получен (одобренное реальное фото) */
  const photoGiftEarned = computed(() => profile.profileBonusAwarded)

  /**
   * +5 только за реальное фото после одобрения.
   * Clay-аватарка и статус «на проверке» не дают монетки.
   */
  function tryAwardProfileBonus() {
    if (profile.profileBonusAwarded || !isPhotoGiftEligible(profile.photo)) return false

    const ok = earnCoins(PROFILE_BONUS_COINS, {
      type: 'profile',
      title: 'Одобренное фото',
      context: 'Фото прошло проверку',
    })
    if (!ok) return false

    profile.profileBonusAwarded = true
    lastBonusAwarded.value = true
    return true
  }

  return {
    profile,
    pageLink: PROFILE_PAGE_LINK,
    settingsLink: SETTINGS_PAGE_LINK,
    bonusAmount: PROFILE_BONUS,
    birthDateLabel,
    photoGiftPending,
    photoGiftEarned,
    lastBonusAwarded,
    tryAwardProfileBonus,
  }
}
