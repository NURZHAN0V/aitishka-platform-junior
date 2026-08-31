<script setup>
defineProps({
  elapsedLabel: {
    type: String,
    required: true,
  },
  typedText: {
    type: String,
    default: '',
  },
  currentChar: {
    type: String,
    default: '',
  },
  remainingText: {
    type: String,
    default: '',
  },
  errors: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="keyland-field">
    <div class="keyland-field__meta">
      <p class="keyland-field__timer" aria-live="polite">{{ elapsedLabel }}</p>
      <p class="keyland-field__errors">Ошибки: {{ errors }}</p>
    </div>
    <p class="keyland-field__passage" aria-live="polite">
      <span class="keyland-field__typed">{{ typedText }}</span>
      <span class="keyland-field__current">{{ currentChar === ' ' ? '·' : currentChar }}</span>
      <span class="keyland-field__rest">{{ remainingText }}</span>
    </p>
    <p class="keyland-field__hint">Печатай на клавиатуре. Следующая клавиша подсвечена внизу.</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.keyland-field {
  display: flex;
  flex-direction: column;
  gap: $space-4;
}

.keyland-field__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: $space-4;
}

.keyland-field__timer {
  margin: 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  font-variant-numeric: tabular-nums;
  color: $color-primary;
}

.keyland-field__errors {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}

.keyland-field__passage {
  margin: 0;
  padding: $space-5;
  border-radius: $radius-lg;
  background: $color-bg-muted;
  border: 1px solid $color-border;
  font-size: 1.35rem;
  line-height: 1.7;
  letter-spacing: 0.02em;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.keyland-field__typed {
  color: $color-text-muted;
}

.keyland-field__current {
  color: $color-primary;
  background: rgba($color-primary, 0.12);
  border-radius: 4px;
  padding: 0 2px;
  font-weight: $font-weight-bold;
}

.keyland-field__rest {
  color: $color-text-primary;
}

.keyland-field__hint {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
}
</style>
