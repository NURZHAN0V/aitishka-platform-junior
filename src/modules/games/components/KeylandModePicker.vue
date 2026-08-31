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
@use '@/assets/styles/mixins' as *;

.keyland-modes {
  display: flex;
  flex-direction: column;
  gap: $space-6;
}

.keyland-modes__hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
    105deg,
    transparent 30%,
    rgba(18, 10, 48, 0.4) 50%,
    rgba(18, 10, 48, 0.85) 100%
  );
}

.keyland-modes__head {
  position: relative;
  z-index: 2;
  flex: 0 1 auto;
  max-width: 50%;
  padding: $space-5 calc($space-6 + 12px) $space-5 $space-5;
  text-align: right;
  @include no-select;
}

.keyland-modes__title {
  margin: 0;
  display: inline-block;
  max-width: 100%;
  padding-inline-end: 0.2em;
  @include keyland-cover-title-text;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
}

.keyland-modes__lead {
  margin: $space-2 0 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.45;
  text-shadow: 0 1px 4px rgba(10, 6, 32, 0.45);
  text-wrap: balance;
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
