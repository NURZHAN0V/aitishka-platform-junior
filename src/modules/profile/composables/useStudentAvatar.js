import { computed, ref } from 'vue'
import {
  PHOTO_SOURCES,
  canUploadPhoto,
  getPhotoMeta,
} from '../constants/profile.js'
import {
  createAvatarSeed,
  createNextAvatarSeed,
  generateAvatarSvg,
} from '../utils/generateAvatarSvg.js'
import { useProfileSession } from './useProfileSession.js'

/** Seed + source — без огромного data URI; SVG восстанавливается через generateAvatarSvg */
const GENERATED_AVATAR_STORAGE_KEY = 'elektronnyj-dnevnik:generated-avatar'

/** Модалки и UI-состояние — единый session state (действия на экране настроек) */
const uploadOpen = ref(false)
const generateOpen = ref(false)
const uploading = ref(false)
const generating = ref(false)
const currentSeed = ref('')
let generatedAvatarRestored = false
/** Mock: учебная часть одобряет загруженное фото через короткое время */
let mockApprovalTimer = null
const MOCK_PHOTO_APPROVAL_MS = 2500

function clearMockPhotoApproval() {
  if (mockApprovalTimer == null) return
  clearTimeout(mockApprovalTimer)
  mockApprovalTimer = null
}

function revokeIfBlob(url) {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

function persistGeneratedAvatar(accountId, seed) {
  try {
    localStorage.setItem(
      GENERATED_AVATAR_STORAGE_KEY,
      JSON.stringify({
        accountId: String(accountId || ''),
        seed: String(seed),
        source: PHOTO_SOURCES.generated,
      }),
    )
  } catch {
    // localStorage недоступен или переполнен
  }
}

function clearPersistedGeneratedAvatar() {
  try {
    localStorage.removeItem(GENERATED_AVATAR_STORAGE_KEY)
  } catch {
    // ignore
  }
}

function applyGeneratedPhoto(profile, seed) {
  clearMockPhotoApproval()
  const url = generateAvatarSvg(seed)
  revokeIfBlob(profile.photo.url)

  profile.photo.status = 'approved'
  profile.photo.url = url
  profile.photo.fileName = ''
  profile.photo.rejectReason = ''
  profile.photo.source = PHOTO_SOURCES.generated
  profile.photo.seed = seed
}

/** Восстановить Clay-аватар из localStorage (seed → SVG), один раз за сессию модуля */
function restoreGeneratedAvatar(profile) {
  if (generatedAvatarRestored) return
  generatedAvatarRestored = true

  try {
    const raw = localStorage.getItem(GENERATED_AVATAR_STORAGE_KEY)
    if (!raw) return

    const data = JSON.parse(raw)
    if (
      !data?.seed ||
      data.source !== PHOTO_SOURCES.generated ||
      (data.accountId && data.accountId !== String(profile.accountId || ''))
    ) {
      return
    }

    applyGeneratedPhoto(profile, String(data.seed))
  } catch {
    // повреждённые данные / недоступен storage
  }
}

/**
 * Единый поток фото/аватарки (session state для шапки, профиля и настроек).
 * Действия загрузки/генерации — только в настройках аккаунта.
 * Upload → модерация (pending). Generate → сразу approved, без модерации.
 */
export function useStudentAvatar() {
  const { profile, tryAwardProfileBonus } = useProfileSession()
  restoreGeneratedAvatar(profile)

  const photoMeta = computed(() => getPhotoMeta(profile.photo))

  const avatarUrl = computed(() => {
    if (profile.photo.status === 'approved' && profile.photo.url) return profile.photo.url
    if (profile.photo.status === 'pending' && profile.photo.url) return profile.photo.url
    return ''
  })

  const canUpload = computed(() => canUploadPhoto(profile.photo))
  const showRejectReason = computed(
    () => profile.photo.status === 'rejected' && Boolean(profile.photo.rejectReason),
  )

  const headerUser = computed(() => ({
    name: profile.fullName,
    group: profile.group,
    avatar: avatarUrl.value,
  }))

  const variant = computed(() => {
    if (!currentSeed.value) return null
    return {
      seed: currentSeed.value,
      url: generateAvatarSvg(currentSeed.value),
    }
  })

  function openUpload() {
    if (!canUpload.value) return
    uploadOpen.value = true
  }

  function closeUpload() {
    uploadOpen.value = false
  }

  function refreshVariant() {
    currentSeed.value = createNextAvatarSeed(profile.accountId)
  }

  function openGenerate() {
    generateOpen.value = true
    if (!currentSeed.value) {
      refreshVariant()
    }
  }

  function closeGenerate() {
    generateOpen.value = false
  }

  /**
   * Mock-загрузка: фото уходит на модерацию (pending).
   * Пока на проверке — повторная загрузка недоступна.
   * Через короткое время mock «учебная часть» одобряет → +5 (не за Clay-аватарку).
   */
  async function submitPhoto(file) {
    if (!canUpload.value || !file) return false

    uploading.value = true
    await new Promise((resolve) => setTimeout(resolve, 450))

    const previewUrl = URL.createObjectURL(file)
    revokeIfBlob(profile.photo.url)
    clearMockPhotoApproval()

    profile.photo.status = 'pending'
    profile.photo.url = previewUrl
    profile.photo.fileName = file.name
    profile.photo.rejectReason = ''
    profile.photo.source = PHOTO_SOURCES.upload
    profile.photo.seed = ''
    clearPersistedGeneratedAvatar()

    uploading.value = false
    uploadOpen.value = false

    mockApprovalTimer = setTimeout(() => {
      mockApprovalTimer = null
      if (
        profile.photo.status !== 'pending' ||
        profile.photo.source !== PHOTO_SOURCES.upload
      ) {
        return
      }
      profile.photo.status = 'approved'
      tryAwardProfileBonus()
    }, MOCK_PHOTO_APPROVAL_MS)

    return true
  }

  /**
   * Генерация безопасна — модерацию не проходит, сразу становится текущим фото.
   * Seed пишется в localStorage — после reload SVG собирается заново.
   * Подарок +5 за Clay-аватарку не начисляется.
   */
  async function selectGeneratedAvatar(seed) {
    if (!seed) return false

    generating.value = true
    await new Promise((resolve) => setTimeout(resolve, 180))

    const resolvedSeed = seed || createAvatarSeed(profile.accountId)
    applyGeneratedPhoto(profile, resolvedSeed)
    persistGeneratedAvatar(profile.accountId, resolvedSeed)

    generating.value = false
    generateOpen.value = false
    return true
  }

  return {
    photoMeta,
    avatarUrl,
    canUpload,
    showRejectReason,
    headerUser,
    uploadOpen,
    generateOpen,
    uploading,
    generating,
    variant,
    openUpload,
    closeUpload,
    openGenerate,
    closeGenerate,
    refreshVariant,
    submitPhoto,
    selectGeneratedAvatar,
  }
}
