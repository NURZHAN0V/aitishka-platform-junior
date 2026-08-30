/**
 * Аватарка в стиле DiceBear Clay (локально через @dicebear/core + styles).
 * Один и тот же seed → одна и та же картинка. Без внешних HTTP-запросов.
 * Анимация — CSS keyframes внутри SVG (`animationVariant`), играет в <img> / data URI.
 */
import { Avatar, Style } from '@dicebear/core'
import clayDefinition from '@dicebear/styles/clay.json'

const clayStyle = new Style(clayDefinition)

/** Скорость встроенной Clay-анимации (см. preset Animated на playground) */
const DEFAULT_ANIMATION_VARIANT = 'medium'

/**
 * @param {string} seed — случайная строка или id пользователя (не имя/email)
 * @param {number} [size=384]
 * @param {{ animated?: boolean, animationVariant?: string }} [options]
 * @returns {string} data:image/svg+xml;...
 */
export function generateAvatarSvg(seed, size = 384, options = {}) {
  const { animated = true, animationVariant = DEFAULT_ANIMATION_VARIANT } = options
  const avatar = new Avatar(clayStyle, {
    seed: String(seed ?? ''),
    size,
    ...(animated && animationVariant !== 'none'
      ? { animationVariant }
      : { animationVariant: 'none' }),
  })
  return avatar.toDataUri()
}

/** Случайный seed (не имя и не email) */
export function createAvatarSeed(prefix = 'u') {
  const rand = Math.random().toString(36).slice(2, 10)
  const time = Date.now().toString(36)
  return `${prefix}_${time}_${rand}`
}

/**
 * Один новый seed для превью («Сгенерировать»).
 * @param {string} accountId — стабильный id аккаунта (не ПИИ)
 */
export function createNextAvatarSeed(accountId) {
  const base = String(accountId || 'account')
  return `${base}:${createAvatarSeed('g')}`
}
