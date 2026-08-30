<script setup>
import { BaseButton, BaseIcon } from '@/core/components/ui'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

defineProps({
  product: { type: Object, required: true },
})

const emit = defineEmits(['buy'])
</script>

<template>
  <article
    class="market-card"
    :class="{
      'market-card--disabled': product.action.disabled,
      [`market-card--${product.action.id}`]: true,
    }"
    :style="{ '--accent': product.accent || '#8b5cf6' }"
  >
    <div class="market-card__media" aria-hidden="true">
      <BaseIcon
        :name="product.illustration"
        type="avif"
        :size="112"
        class="market-card__image"
        label=""
      />
    </div>

    <div class="market-card__body">
      <h2 class="market-card__name">{{ product.name }}</h2>

      <p class="market-card__price">
        <BaseIcon
          :name="BRAND_ILLUSTRATIONS.coin"
          type="avif"
          :size="22"
          class="market-card__coin"
          label=""
        />
        <span>{{ product.price }}</span>
      </p>

      <BaseButton
        class="market-card__action"
        :variant="product.canBuy ? 'primary' : 'secondary'"
        :disabled="product.action.disabled"
        size="md"
        @click="product.canBuy ? emit('buy', product.id) : undefined"
      >
        {{ product.action.label }}
      </BaseButton>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.market-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-radius: $radius-2xl;
  background-color: $color-bg-card;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;
  overflow: hidden;
  transition: box-shadow $transition-base, transform $transition-base;

  &:hover:not(.market-card--disabled) {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }

  &__media {
    @include flex-center;
    min-height: 160px;
    padding: $space-5 $space-4 $space-3;
    background: linear-gradient(
      165deg,
      color-mix(in srgb, var(--accent) 18%, white) 0%,
      $color-bg-muted 100%
    );
  }

  &__image {
    filter: drop-shadow(0 8px 16px rgba(15, 23, 42, 0.12));
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    padding: $space-4 $space-5 $space-5;
    flex: 1;
  }

  &__name {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
    @include truncate;
  }

  &__price {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    font-variant-numeric: tabular-nums;
  }

  &__coin {
    flex-shrink: 0;
  }

  &__action {
    width: 100%;
    margin-top: auto;
  }

  &--out,
  &--short {
    .market-card__media {
      opacity: 0.72;
    }

    .market-card__action {
      color: $color-text-muted;
    }
  }
}
</style>
