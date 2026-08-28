<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="base-modal" role="dialog" aria-modal="true">
        <div class="base-modal__overlay" @click="onOverlayClick" />
        <div class="base-modal__content" :class="`base-modal__content--${size}`">
          <header v-if="title || closable" class="base-modal__header">
            <h2 v-if="title" class="base-modal__title">{{ title }}</h2>
            <button
              v-if="closable"
              type="button"
              class="base-modal__close"
              aria-label="Закрыть"
              @click="close"
            >
              <BaseIcon name="x-close" :size="20" />
            </button>
          </header>
          <div class="base-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.base-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  @include flex-center;

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: $color-bg-overlay;
  }

  &__content {
    position: relative;
    z-index: 1;
    width: calc(100vw - #{$space-8});
    max-height: calc(100vh - #{$space-8});
    overflow-y: auto;
    background-color: $color-bg-card;
    border-radius: $radius-2xl;
    box-shadow: $shadow-modal;

    &--sm {
      max-width: 360px;
    }

    &--md {
      max-width: 480px;
    }

    &--lg {
      max-width: 640px;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-5 $space-6 $space-3;
    @include no-select;
  }

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__close {
    @include flex-center;
    @include no-select;

    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: $radius-md;
    background: transparent;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color $transition-base;

    &:hover {
      background-color: $color-bg-muted;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__body {
    padding: $space-3 $space-6 $space-6;
    color: $color-text-secondary;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: $space-3;
    padding: $space-4 $space-6 $space-6;
    border-top: 1px solid $color-border-light;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-base;

  .base-modal__content {
    transition: transform $transition-base;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .base-modal__content {
    transform: scale(0.95) translateY(8px);
  }
}
</style>
