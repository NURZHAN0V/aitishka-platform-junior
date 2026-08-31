<script setup>
import { GAMES_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { getAvifIcon } from '@/utils/icons'
import { KEYLAND_MODES } from '../constants/keyland.js'

defineProps({
  modes: {
    type: Array,
    default: () => KEYLAND_MODES,
  },
})

const emit = defineEmits(['select'])
const coverSrc = getAvifIcon(GAMES_ILLUSTRATIONS.keylandCover)
</script>

<template>
  <div class="keyland-modes">
    <div class="keyland-modes__hero">
      <div class="keyland-modes__cover">
        <img
          v-if="coverSrc"
          :src="coverSrc"
          alt="Клавишленд"
          class="keyland-modes__cover-img"
        />
      </div>
      <header class="keyland-modes__head">
        <p class="keyland-modes__eyebrow">Клавишленд</p>
        <h2 class="keyland-modes__title">Выбери, что тренировать</h2>
        <p class="keyland-modes__lead">
          Короткая партия. Результат можно сохранить в браузере. Монетки за игру не даются.
        </p>
      </header>
    </div>

    <div class="keyland-modes__grid">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        class="keyland-modes__card"
        @click="emit('select', mode.id)"
      >
        <span class="keyland-modes__label">{{ mode.label }}</span>
        <span class="keyland-modes__hint">{{ mode.hint }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.keyland-modes {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.keyland-modes__hero {
  display: grid;
  grid-template-columns: minmax(200px, 280px) 1fr;
  gap: $space-5;
  align-items: center;
}

.keyland-modes__cover {
  border-radius: $radius-lg;
  overflow: hidden;
  background: #1a1240;
  aspect-ratio: 1;
  max-height: 280px;
}

.keyland-modes__cover-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.keyland-modes__head {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  min-width: 0;
}

.keyland-modes__eyebrow {
  margin: 0;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.keyland-modes__title {
  margin: 0;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.keyland-modes__lead {
  margin: 0;
  color: $color-text-secondary;
  line-height: 1.45;
  max-width: 32rem;
}

.keyland-modes__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $space-3;
}

.keyland-modes__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-2;
  padding: $space-4;
  text-align: left;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  background: $color-bg-card;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: $color-primary;
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}

.keyland-modes__label {
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.keyland-modes__hint {
  font-size: $font-size-sm;
  color: $color-text-muted;
  line-height: 1.4;
}
</style>
