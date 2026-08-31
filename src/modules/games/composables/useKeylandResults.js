import { computed, ref } from 'vue'
import { getModeById, KEYLAND_RESULTS_LIMIT, KEYLAND_STORAGE_KEY } from '../constants/keyland.js'

function readStore() {
  try {
    const raw = localStorage.getItem(KEYLAND_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStore(list) {
  try {
    localStorage.setItem(KEYLAND_STORAGE_KEY, JSON.stringify(list.slice(0, KEYLAND_RESULTS_LIMIT)))
  } catch {
    // ignore
  }
}

const results = ref(readStore())

/**
 * Последние результаты партий (localStorage).
 */
export function useKeylandResults() {
  const list = computed(() => results.value)

  function saveResult({ modeId, stats }) {
    const mode = getModeById(modeId)
    const entry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      modeId,
      modeLabel: mode?.label ?? modeId,
      at: new Date().toISOString(),
      elapsedLabel: stats.elapsedLabel,
      elapsedMs: stats.elapsedMs,
      correct: stats.correct,
      errors: stats.errors,
      speed: stats.speed,
      accuracy: stats.accuracy,
      abandoned: Boolean(stats.abandoned),
    }
    results.value = [entry, ...results.value].slice(0, KEYLAND_RESULTS_LIMIT)
    writeStore(results.value)
    return entry
  }

  function clearResults() {
    results.value = []
    writeStore([])
  }

  function formatWhen(iso) {
    try {
      const d = new Date(iso)
      return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return {
    list,
    saveResult,
    clearResults,
    formatWhen,
  }
}
