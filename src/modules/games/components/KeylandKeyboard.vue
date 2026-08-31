<script setup>
import { computed } from 'vue'
import { getKeyboardRows } from '../constants/keyland.js'

const props = defineProps({
  modeId: {
    type: String,
    required: true,
  },
  highlight: {
    type: String,
    default: '',
  },
})

const rows = computed(() => getKeyboardRows(props.modeId))

function isHighlighted(key) {
  const h = props.highlight
  if (!h) return false
  if (h === ' ') return false
  return key.toLowerCase() === h.toLowerCase() || key === h
}

const spaceHighlighted = computed(() => props.highlight === ' ')
</script>

<template>
  <div class="keyland-kb" aria-hidden="true">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="keyland-kb__row">
      <span
        v-for="key in row"
        :key="`${rowIndex}-${key}`"
        class="keyland-kb__key"
        :class="{ 'keyland-kb__key--active': isHighlighted(key) }"
      >
        {{ key }}
      </span>
    </div>
    <div class="keyland-kb__row keyland-kb__row--space">
      <span
        class="keyland-kb__key keyland-kb__key--space"
        :class="{ 'keyland-kb__key--active': spaceHighlighted }"
      >
        пробел
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.keyland-kb {
  display: flex;
  flex-direction: column;
  gap: $space-2;
  padding: $space-4;
  border-radius: $radius-lg;
  background: $color-bg-card;
  border: 1px solid $color-border;
  user-select: none;
}

.keyland-kb__row {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.keyland-kb__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 40px;
  padding: 0 8px;
  border-radius: $radius-sm;
  background: $color-bg-muted;
  border: 1px solid $color-border;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
  text-transform: none;

  &--space {
    min-width: 220px;
  }

  &--active {
    background: $color-primary;
    border-color: $color-primary;
    color: #fff;
    box-shadow: 0 0 0 3px rgba($color-primary, 0.25);
  }
}
</style>
