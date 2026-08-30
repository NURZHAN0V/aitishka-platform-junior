<script setup>
import { BaseButton, BaseCard, BaseIcon } from '@/core/components/ui'

defineProps({
  fields: { type: Array, default: () => [] },
})

const emit = defineEmits(['copy-field', 'copy-all'])
</script>

<template>
  <BaseCard padding="md" class="payments-requisites">
    <template #title>Реквизиты</template>

    <div class="payments-requisites__head">
      <p class="payments-requisites__hint">
        Переведи оплату по этим данным. В назначении обязательно укажи код студента
      </p>
      <BaseButton
        variant="secondary"
        size="sm"
        icon="clipboard"
        @click="emit('copy-all')"
      >
        Скопировать всё
      </BaseButton>
    </div>

    <ul class="payments-requisites__list" role="list">
      <li v-for="field in fields" :key="field.id" class="payments-requisites__row">
        <div class="payments-requisites__text">
          <span class="payments-requisites__label">{{ field.label }}</span>
          <span
            class="payments-requisites__value"
            :class="{ 'payments-requisites__value--accent': field.id === 'purpose' || field.id === 'studentCode' }"
          >
            {{ field.value }}
          </span>
        </div>
        <button
          type="button"
          class="payments-requisites__copy"
          :aria-label="`Скопировать: ${field.label}`"
          @click="emit('copy-field', field)"
        >
          <BaseIcon name="clipboard" :size="18" />
          <span>Скопировать</span>
        </button>
      </li>
    </ul>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.payments-requisites {
  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-3;
    margin-bottom: $space-4;
  }

  &__hint {
    margin: 0;
    flex: 1;
    min-width: min(100%, 28ch);
    font-size: $font-size-sm;
    color: $color-text-muted;
    line-height: $line-height-base;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    padding: $space-3 $space-4;
    border-radius: $radius-lg;
    background-color: $color-bg-muted;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;
    flex: 1;
  }

  &__label {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  &__value {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    word-break: break-word;
    font-variant-numeric: tabular-nums;

    &--accent {
      color: $color-primary-active;
    }
  }

  &__copy {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    flex-shrink: 0;
    min-height: 36px;
    padding: $space-1 $space-3;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition:
      border-color $transition-base,
      color $transition-base,
      background-color $transition-base;
    @include no-select;

    &:hover {
      border-color: $color-primary-muted;
      color: $color-primary;
      background-color: $color-primary-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

@media (max-width: 560px) {
  .payments-requisites__copy span {
    display: none;
  }

  .payments-requisites__copy {
    width: 36px;
    justify-content: center;
    padding-inline: 0;
  }
}
</style>
