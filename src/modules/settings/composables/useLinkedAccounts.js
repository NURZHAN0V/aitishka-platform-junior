import { reactive } from 'vue'
import { LINKED_ACCOUNT_PROVIDERS } from '../constants/settings.js'

/** Привязки соцсетей на сессию (мок без OAuth). */
const linked = reactive(
  Object.fromEntries(LINKED_ACCOUNT_PROVIDERS.map((provider) => [provider.id, false])),
)

/**
 * Привязка / отвязка Яндекс и ВКонтакте в настройках аккаунта.
 */
export function useLinkedAccounts() {
  function isBound(providerId) {
    return Boolean(linked[providerId])
  }

  function toggle(providerId) {
    if (!(providerId in linked)) return null
    linked[providerId] = !linked[providerId]
    return linked[providerId]
  }

  return {
    providers: LINKED_ACCOUNT_PROVIDERS,
    linked,
    isBound,
    toggle,
  }
}
