<script setup>
import { BaseButton, BaseModal } from '@/core/components/ui'
import { WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  variant: { type: Object, default: null },
  generating: { type: Boolean, default: false },
  fullName: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select', 'refresh'])

function close() {
  emit('update:modelValue', false)
}

function select() {
  if (!props.variant?.seed || props.generating) return
  emit('select', props.variant.seed)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Сгенерировать аватарку"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="avatar-generate__note">
      Если нравится — выбери. Можно сгенерировать другую. Аватарка сразу станет
      фото профиля, без проверки учебной частью
    </p>

    <div class="avatar-generate__stage">
      <button
        type="button"
        class="avatar-generate__preview"
        :disabled="generating || !variant"
        :aria-label="`Выбрать аватарку для ${fullName || 'профиля'}`"
        @click="select"
      >
        <img
          v-if="variant?.url"
          class="avatar-generate__img"
          :src="variant.url"
          alt=""
        />
        <span v-else class="avatar-generate__placeholder">…</span>
      </button>
    </div>

    <template #footer>
      <div class="avatar-generate__actions">
        <BaseButton variant="secondary" :disabled="generating" @click="close">
          Отмена
        </BaseButton>
        <BaseButton
          class="avatar-generate__refresh"
          variant="secondary"
          :icon="WIDGET_ILLUSTRATIONS.avatarMoreVariants"
          icon-type="avif"
          :disabled="generating"
          @click="emit('refresh')"
        >
          Сгенерировать
        </BaseButton>
        <BaseButton
          variant="primary"
          :disabled="generating || !variant"
          @click="select"
        >
          Выбрать
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.avatar-generate {
  &__note {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__actions {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    gap: $space-3;
    width: 100%;
  }

  &__refresh {
    flex-shrink: 0;
  }

  &__stage {
    @include flex-center;
  }

  &__preview {
    @include flex-center;

    width: min(100%, 220px);
    aspect-ratio: 1;
    padding: 0;
    border: 2px solid $color-border;
    border-radius: $radius-lg;
    background: $color-bg-muted;
    overflow: hidden;
    cursor: pointer;
    transition:
      border-color $transition-fast,
      background-color $transition-fast,
      transform $transition-fast;

    &:hover:not(:disabled) {
      border-color: $color-primary-muted;
      background: $color-primary-light;
      transform: translateY(-1px);
    }

    &:focus-visible {
      @include focus-ring;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    font-size: $font-size-2xl;
    color: $color-text-secondary;
  }
}
</style>
