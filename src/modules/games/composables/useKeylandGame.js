import { computed, onUnmounted, ref } from 'vue'
import {
  buildPassage,
  calcAccuracy,
  calcSpeedCpm,
  formatDuration,
  getModeById,
} from '../constants/keyland.js'

/**
 * Состояние одной партии «Клавишленд».
 */
export function useKeylandGame() {
  const modeId = ref(null)
  const passage = ref('')
  const cursor = ref(0)
  const errors = ref(0)
  const startedAt = ref(null)
  const finishedAt = ref(null)
  const phase = ref('idle') // idle | playing | done
  const nowTick = ref(0)

  let tickTimer = null

  const mode = computed(() => (modeId.value ? getModeById(modeId.value) : null))

  const expectedChar = computed(() => passage.value[cursor.value] ?? '')

  const typedText = computed(() => passage.value.slice(0, cursor.value))
  const remainingText = computed(() => passage.value.slice(cursor.value + 1))

  const elapsedMs = computed(() => {
    if (!startedAt.value) return 0
    const end = finishedAt.value ?? nowTick.value ?? Date.now()
    return Math.max(0, end - startedAt.value)
  })

  const elapsedLabel = computed(() => formatDuration(elapsedMs.value))

  const isComplete = computed(() => cursor.value >= passage.value.length && passage.value.length > 0)

  const stats = computed(() => {
    const correct = cursor.value
    const speed = calcSpeedCpm(correct, elapsedMs.value)
    const accuracy = calcAccuracy(correct, errors.value)
    return {
      correct,
      errors: errors.value,
      speed,
      accuracy,
      elapsedMs: elapsedMs.value,
      elapsedLabel: formatDuration(elapsedMs.value),
      finished: Boolean(finishedAt.value),
      abandoned: Boolean(finishedAt.value) && !isComplete.value,
    }
  })

  function clearTick() {
    if (tickTimer) {
      clearInterval(tickTimer)
      tickTimer = null
    }
  }

  function startTick() {
    clearTick()
    nowTick.value = Date.now()
    tickTimer = setInterval(() => {
      nowTick.value = Date.now()
    }, 250)
  }

  function startGame(nextModeId) {
    modeId.value = nextModeId
    passage.value = buildPassage(nextModeId)
    cursor.value = 0
    errors.value = 0
    startedAt.value = null
    finishedAt.value = null
    phase.value = 'playing'
    clearTick()
  }

  function finish(abandoned = false) {
    if (phase.value === 'done') return stats.value
    if (!startedAt.value) {
      startedAt.value = Date.now()
    }
    finishedAt.value = Date.now()
    phase.value = 'done'
    clearTick()
    return { ...stats.value, abandoned }
  }

  function handleKey(rawKey) {
    if (phase.value !== 'playing') return { ok: false, reason: 'idle' }
    if (!passage.value) return { ok: false, reason: 'empty' }

    // Ignore pure modifiers
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(rawKey)) {
      return { ok: false, reason: 'modifier' }
    }

    let key = rawKey
    if (rawKey === 'Space') key = ' '
    if (rawKey.length !== 1 && rawKey !== ' ') {
      return { ok: false, reason: 'ignore' }
    }

    const expected = expectedChar.value
    if (!expected) return { ok: false, reason: 'done' }

    if (!startedAt.value) {
      startedAt.value = Date.now()
      startTick()
    }

    if (key === expected) {
      cursor.value += 1
      if (cursor.value >= passage.value.length) {
        finish(false)
        return { ok: true, finished: true }
      }
      return { ok: true, finished: false }
    }

    errors.value += 1
    return { ok: false, reason: 'mismatch' }
  }

  function abandon() {
    return finish(true)
  }

  function resetToIdle() {
    clearTick()
    modeId.value = null
    passage.value = ''
    cursor.value = 0
    errors.value = 0
    startedAt.value = null
    finishedAt.value = null
    phase.value = 'idle'
  }

  onUnmounted(() => {
    clearTick()
  })

  return {
    modeId,
    mode,
    passage,
    cursor,
    errors,
    phase,
    expectedChar,
    typedText,
    remainingText,
    elapsedMs,
    elapsedLabel,
    isComplete,
    stats,
    startGame,
    handleKey,
    abandon,
    finish,
    resetToIdle,
  }
}
