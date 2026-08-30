<script setup>
import { BaseChip, BaseIcon } from '@/core/components/ui'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

defineProps({
  order: { type: Object, required: true },
})
</script>

<template>
  <article
    class="order-card"
    :style="{ '--accent': order.accent || '#8b5cf6' }"
  >
    <div class="order-card__media" aria-hidden="true">
      <BaseIcon
        :name="order.illustration"
        type="avif"
        :size="72"
        class="order-card__image"
        label=""
      />
    </div>

    <div class="order-card__main">
      <div class="order-card__top">
        <h2 class="order-card__name">{{ order.productName }}</h2>
        <BaseChip :variant="order.statusMeta.chip" size="sm" toned>
          {{ order.statusLabel }}
        </BaseChip>
      </div>

      <p class="order-card__hint">{{ order.statusHint }}</p>

      <div class="order-card__meta">
        <p class="order-card__price">
          <BaseIcon
            :name="BRAND_ILLUSTRATIONS.coin"
            type="avif"
            :size="20"
            label=""
          />
          <span>{{ order.priceLabel }}</span>
        </p>
        <time class="order-card__date" :datetime="order.createdAt">
          {{ order.dateLabel }}
        </time>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.order-card {
  display: flex;
  gap: $space-4;
  align-items: stretch;
  padding: $space-4;
  border-radius: $radius-card;
  background-color: $color-bg-card;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;

  &__media {
    @include flex-center;
    flex-shrink: 0;
    width: 96px;
    border-radius: $radius-card;
    background: linear-gradient(
      165deg,
      color-mix(in srgb, var(--accent) 18%, white) 0%,
      $color-bg-muted 100%
    );
  }

  &__image {
    filter: drop-shadow(0 6px 12px rgba(15, 23, 42, 0.1));
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: $space-2;
    min-width: 0;
    flex: 1;
  }

  &__top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
  }

  &__name {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__hint {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-2;
    margin-top: auto;
  }

  &__price {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-variant-numeric: tabular-nums;
  }

  &__date {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}

@media (max-width: 560px) {
  .order-card {
    flex-direction: column;

    &__media {
      width: 100%;
      min-height: 120px;
    }
  }
}
</style>
