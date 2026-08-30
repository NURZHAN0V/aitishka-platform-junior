import { useProfileSession } from '@/modules/profile/composables/useProfileSession.js'
import { useStudentAvatar } from '@/modules/profile/composables/useStudentAvatar.js'
import { SETTINGS_HINT, SETTINGS_PAGE_LINK } from '../constants/settings.js'
import { useLinkedAccounts } from './useLinkedAccounts.js'

/**
 * Настройки аккаунта: фото и привязка соцсетей (единый source of truth с профилем).
 */
export function useSettings() {
  const session = useProfileSession()
  const avatar = useStudentAvatar()
  const linkedAccounts = useLinkedAccounts()

  return {
    ...session,
    ...avatar,
    ...linkedAccounts,
    pageLink: SETTINGS_PAGE_LINK,
    hint: SETTINGS_HINT,
  }
}
