export const SETTINGS_PAGE_LINK = '/settings'

export const SETTINGS_HINT = {
  title: 'Настройки аккаунта',
  text: 'Здесь можно сменить фото, а также привязать Яндекс или ВКонтакте. Полные данные — в личном кабинете.',
  profileCta: 'Открыть личный кабинет',
}

/** Соцсети для привязки (MVP: локальный toggle, без OAuth). */
export const LINKED_ACCOUNT_PROVIDERS = [
  {
    id: 'yandex',
    name: 'Яндекс',
    illustration: 'yandex',
    bindLabel: 'Привязать Яндекс',
    unbindLabel: 'Отвязать Яндекс',
    boundHint: 'Аккаунт Яндекс привязан',
    unboundHint: 'Войти через Яндекс станет проще',
  },
  {
    id: 'vkontakte',
    name: 'ВКонтакте',
    illustration: 'vkontakte',
    bindLabel: 'Привязать ВКонтакте',
    unbindLabel: 'Отвязать ВКонтакте',
    boundHint: 'Аккаунт ВКонтакте привязан',
    unboundHint: 'Войти через ВКонтакте станет проще',
  },
]
