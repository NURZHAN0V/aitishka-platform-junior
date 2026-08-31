<script setup>
import { RouterLink } from 'vue-router'
import { GAMES_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { getAvifIcon } from '@/utils/icons'

const coverSrc = getAvifIcon(GAMES_ILLUSTRATIONS.keylandCover)
</script>

<template>
  <div class="games-lobby">
    <RouterLink
      class="games-lobby__tile"
      to="/games/keyland"
      aria-label="Играть в Клавишленд"
    >
      <img
        v-if="coverSrc"
        :src="coverSrc"
        alt=""
        class="games-lobby__tile-img"
      />
      <div class="games-lobby__tile-scrim" aria-hidden="true" />
      <div class="games-lobby__tile-overlay">
        <h2 class="games-lobby__title">Клавишленд</h2>
        <span class="games-lobby__play">Играть</span>
      </div>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.games-lobby {
  display: flex;
  flex-direction: column;
  gap: $space-6;
  max-width: 920px;
}

.games-lobby__tile {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  max-width: 260px;
  border-radius: $radius-card;
  aspect-ratio: 16 / 9;
  background: #1a1240;
  text-decoration: none;
  cursor: pointer;
  isolation: isolate;
  transition:
    transform $transition-base,
    filter $transition-base;

  &:hover,
  &:focus-visible {
    transform: scale(1.02);
    filter: brightness(1.06);
  }

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 3px;
  }

  &:active {
    transform: scale(0.98);
    filter: brightness(1.02);
  }
}

.games-lobby__tile-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 28% 38%;
  display: block;
  z-index: 0;
}

.games-lobby__tile-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 38%,
    rgba(18, 10, 48, 0.35) 58%,
    rgba(18, 10, 48, 0.7) 100%
  );
}

.games-lobby__tile-overlay {
  position: absolute;
  z-index: 2;
  right: $space-3;
  bottom: $space-3;
  left: auto;
  top: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $space-1;
  max-width: 48%;
  text-align: right;
}

.games-lobby__title {
  margin: 0;
  font-size: calc($font-size-sm * 2.5);
  @include keyland-title-text;
  text-wrap: balance;
}

.games-lobby__play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-1 $space-3;
  min-height: 28px;
  border-radius: $radius-button;
  background: $gradient-primary;
  color: $color-text-inverse;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  line-height: $line-height-tight;
  box-shadow: $shadow-sm;
}

@media (max-width: 640px) {
  .games-lobby__tile {
    max-width: 220px;
  }
}
</style>
