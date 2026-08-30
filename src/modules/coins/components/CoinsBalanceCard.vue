<script setup>
import { RouterLink } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

defineProps({
  balance: { type: Number, required: true },
  marketLink: { type: String, required: true },
})
</script>

<template>
  <section class="coins-balance" aria-label="Текущий баланс">
    <div class="coins-balance__glow" aria-hidden="true" />

    <div class="coins-balance__main">
      <BaseIcon
        :name="BRAND_ILLUSTRATIONS.coinStack"
        type="avif"
        :size="220"
        class="coins-balance__icon"
        label=""
      />

      <div class="coins-balance__text">
        <p class="coins-balance__value">
          <span class="coins-balance__number">{{ balance }}</span>
          <span class="coins-balance__unit">монеток</span>
        </p>
        <p class="coins-balance__hint">Копи и меняй на крутые ништяки в маркете</p>
      </div>
    </div>

    <RouterLink :to="marketLink" class="coins-balance__cta">
      Потратить в маркете
    </RouterLink>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.coins-balance {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-5;
  padding: $space-4 $space-6;
  border-radius: $radius-2xl;
  background: $gradient-coin;
  color: $color-text-primary;
  box-shadow: $shadow-md;
  overflow: visible;

  &__glow {
    position: absolute;
    top: -40%;
    right: -8%;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, transparent 70%);
    pointer-events: none;
  }

  &__main {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: $space-2;
    min-width: 0;
    overflow: visible;
  }

  &__icon {
    flex-shrink: 0;
    margin-block: -4.75rem;
    transform: translateY(-1.5rem);
    filter: drop-shadow(0 6px 12px rgba(180, 83, 9, 0.25));
  }

  &__text {
    min-width: max-content;
  }

  &__value {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: $space-2;
    line-height: $line-height-tight;
  }

  &__number {
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    letter-spacing: -0.02em;
  }

  &__unit {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: rgba(120, 53, 15, 0.9);
  }

  &__hint {
    margin: $space-2 0 0;
    font-size: $font-size-sm;
    color: rgba(120, 53, 15, 0.75);
    white-space: nowrap;
  }

  &__cta {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: $space-3 $space-6;
    border-radius: $radius-button;
    background-color: $color-primary;
    color: $color-text-inverse;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    text-decoration: none;
    box-shadow: $shadow-sm;
    transition: background-color $transition-fast;
    @include no-select;

    &:hover {
      background-color: $color-primary-hover;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

@media (max-width: 720px) {
  .coins-balance {
    padding: $space-5 $space-5;
    flex-direction: column;
    align-items: stretch;

    &__main {
      flex-direction: column;
      align-items: flex-start;
    }

    &__icon {
      margin-block: -3.5rem;
      transform: translateY(-1.25rem);
    }

    &__cta {
      width: 100%;
    }
  }
}
</style>
