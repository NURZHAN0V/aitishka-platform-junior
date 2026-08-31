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
      <img
        v-if="coverSrc"
        :src="coverSrc"
        alt=""
        class="keyland-modes__hero-img"
      />
      <div class="keyland-modes__hero-scrim" aria-hidden="true" />
      <header class="keyland-modes__head">
        <h1 class="keyland-modes__title">Клавишленд</h1>
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
@use '@/assets/styles/mixins' as *;

.keyland-modes {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.keyland-modes__hero {
  position: relative;
  overflow: hidden;
  border-radius: $radius-lg;
  aspect-ratio: 21 / 10;
  min-height: 240px;
  max-height: 400px;
  background: #1a1240;
  isolation: isolate;
  @include no-select;
}

.keyland-modes__hero-img {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 26% 58%;
}

.keyland-modes__hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(18, 10, 48, 0.82) 0%,
    rgba(18, 10, 48, 0.45) 28%,
    transparent 58%
  );
}

.keyland-modes__head {
  position: absolute;
  z-index: 2;
  bottom: clamp($space-3, 4.5%, $space-5);
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100% - $space-6 * 2);
  padding: 0;
  text-align: center;
  @include no-select;
}

.keyland-modes__title {
  margin: 0;
  @include keyland-cover-title-text;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
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
