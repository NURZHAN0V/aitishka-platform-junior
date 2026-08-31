<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { BaseButton } from '@/core/components/ui'
import KeylandModePicker from '@/modules/games/components/KeylandModePicker.vue'
import KeylandPlayField from '@/modules/games/components/KeylandPlayField.vue'
import KeylandKeyboard from '@/modules/games/components/KeylandKeyboard.vue'
import KeylandResultModal from '@/modules/games/components/KeylandResultModal.vue'
import { useKeylandGame } from '@/modules/games/composables/useKeylandGame.js'
import { useKeylandResults } from '@/modules/games/composables/useKeylandResults.js'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const router = useRouter()
const resultOpen = ref(false)
const lastStats = ref(null)

const {
  modeId,
  mode,
  phase,
  expectedChar,
  typedText,
  remainingText,
  elapsedLabel,
  errors,
  stats,
  startGame,
  handleKey,
  abandon,
  resetToIdle,
} = useKeylandGame()

const { saveResult } = useKeylandResults()

const breadcrumbs = computed(() => [
  { label: 'Главная', href: '/' },
  { label: 'Игры', href: '/games' },
  { label: 'Клавишленд' },
])

function onSelectMode(id) {
  resultOpen.value = false
  lastStats.value = null
  startGame(id)
}

function openResult(finalStats) {
  lastStats.value = { ...finalStats }
  saveResult({ modeId: modeId.value, stats: finalStats })
  resultOpen.value = true
}

function onKeydown(event) {
  if (phase.value !== 'playing') return
  if (event.ctrlKey || event.metaKey || event.altKey) return

  const key = event.key
  if (key === 'Escape') {
    event.preventDefault()
    onAbandon()
    return
  }

  const result = handleKey(key === ' ' || key === 'Spacebar' ? ' ' : key)
  if (result.ok || result.reason === 'mismatch') {
    event.preventDefault()
  }
  if (result.finished) {
    openResult(stats.value)
  }
}

function onAbandon() {
  const finalStats = abandon()
  openResult(finalStats)
}

function onAgain() {
  resultOpen.value = false
  if (modeId.value) {
    startGame(modeId.value)
  } else {
    resetToIdle()
  }
}

function onFinish() {
  resultOpen.value = false
  resetToIdle()
  router.push('/games')
}

function onResultOpenChange(open) {
  resultOpen.value = open
  if (!open && phase.value === 'done') {
    resetToIdle()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <AppLayout :user="mockUser" :breadcrumbs="breadcrumbs" active-route="keyland">
    <div class="keyland-view">
      <KeylandModePicker v-if="phase === 'idle'" @select="onSelectMode" />

      <template v-else-if="phase === 'playing'">
        <div class="keyland-view__toolbar">
          <p class="keyland-view__mode">{{ mode?.label }}</p>
          <BaseButton variant="secondary" size="sm" @click="onAbandon">Сдаться</BaseButton>
        </div>

        <KeylandPlayField
          :elapsed-label="elapsedLabel"
          :typed-text="typedText"
          :current-char="expectedChar"
          :remaining-text="remainingText"
          :errors="errors"
        />

        <KeylandKeyboard :mode-id="modeId" :highlight="expectedChar" />
      </template>

      <KeylandResultModal
        :model-value="resultOpen"
        :mode-label="mode?.label"
        :stats="lastStats || stats"
        @update:model-value="onResultOpenChange"
        @again="onAgain"
        @finish="onFinish"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.keyland-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  max-width: 880px;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .keyland-view {
    padding: $space-4;
    gap: $space-4;
  }
}

.keyland-view__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;
}

.keyland-view__mode {
  margin: 0;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}
</style>
