import { useProfileSession } from './useProfileSession.js'
import { useStudentAvatar } from './useStudentAvatar.js'

/**
 * Личный кабинет: сессия профиля + отображение аватара (смена — в настройках).
 */
export function useProfile() {
  const session = useProfileSession()
  const avatar = useStudentAvatar()

  return {
    ...session,
    ...avatar,
  }
}
