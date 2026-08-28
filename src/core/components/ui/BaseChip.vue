<script setup>
defineProps({
  variant: {
    type: String,
    default: 'current',
    validator: (v) =>
      ['current', 'pending', 'approved', 'rejected', 'overdue', 'missing'].includes(v),
  },
  mode: {
    type: String,
    default: 'status',
    validator: (v) => ['status', 'filter'].includes(v),
  },
  active: {
    type: Boolean,
    default: false,
  },
  count: {
    type: [Number, String],
    default: null,
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
})

defineEmits(['click'])
</script>

<template>
  <component
    :is="mode === 'filter' ? 'button' : 'span'"
    class="base-chip"
    :class="[
      `base-chip--${variant}`,
      `base-chip--${size}`,
      `base-chip--${mode}`,
      { 'base-chip--active': active },
    ]"
    :type="mode === 'filter' ? 'button' : undefined"
    @click="mode === 'filter' ? $emit('click', $event) : undefined"
  >
    <slot />
    <span v-if="count != null && count !== ''" class="base-chip__count">{{ count }}</span>
  </component>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-chip {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  border: none;
  border-radius: $radius-chip;
  font-weight: $font-weight-medium;
  white-space: nowrap;
  font-family: inherit;

  &--sm {
    padding: $space-1 $space-3;
    font-size: $font-size-xs;
  }

  &--md {
    padding: $space-2 $space-4;
    font-size: $font-size-sm;
  }

  @each $status, $config in $homework-status-colors {
    &--#{$status}:not(.base-chip--filter) {
      @include homework-status-chip($status);
    }
  }

  &--filter {
    background-color: $color-bg-card;
    color: $color-text-secondary;
    border: 1px solid $color-border;
    cursor: pointer;
    @include no-select;
    @include press-scale(0.95);
    transition: transform $transition-press, background-color $transition-base,
      color $transition-base, border-color $transition-base;

    &:hover:not(.base-chip--active) {
      border-color: $color-primary-muted;
      color: $color-text-primary;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &--filter.base-chip--active {
    background: $gradient-primary;
    color: $color-text-inverse;
    border-color: transparent;
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 $space-1;
    border-radius: $radius-chip;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    background-color: rgba(255, 255, 255, 0.25);
  }

  &--filter:not(.base-chip--active) &__count {
    background-color: $color-bg-muted;
    color: $color-text-secondary;
  }
}
</style>
