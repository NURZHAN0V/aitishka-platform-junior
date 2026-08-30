<script setup>
import { computed } from 'vue'
import { BaseButton, BaseIcon, BaseModal } from '@/core/components/ui'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  product: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function close() {
  open.value = false
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <BaseModal
    v-model="open"
    title="Подтверждение покупки"
    size="lg"
    close-label="Закрыть"
  >
    <div v-if="product" class="purchase-modal">
      <div
        class="purchase-modal__media"
        aria-hidden="true"
        :style="{ '--accent': product.accent || '#8b5cf6' }"
      >
        <BaseIcon
          :name="product.illustration"
          type="avif"
          :size="140"
          class="purchase-modal__image"
          label=""
        />
      </div>

      <div class="purchase-modal__info">
        <h3 class="purchase-modal__name">{{ product.name }}</h3>

        <p class="purchase-modal__price">
          <BaseIcon
            :name="BRAND_ILLUSTRATIONS.coin"
            type="avif"
            :size="28"
            label=""
          />
          <span>{{ product.price }}</span>
        </p>

        <div class="purchase-modal__divider" aria-hidden="true" />

        <p class="purchase-modal__balance">
          Баланс после покупки:
          <strong>{{ product.balanceAfterLabel }}</strong>
        </p>

        <p class="purchase-modal__pickup">
          <BaseIcon name="home-01" :size="20" class="purchase-modal__pickup-icon" />
          <span>Забрать в школе на занятиях</span>
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="close">Отмена</BaseButton>
      <BaseButton variant="primary" @click="confirm">Купить</BaseButton>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.purchase-modal {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: $space-6;
  align-items: center;

  &__media {
    @include flex-center;
    min-height: 200px;
    padding: $space-5;
    border-radius: $radius-xl;
    background: linear-gradient(
      165deg,
      color-mix(in srgb, var(--accent) 20%, white) 0%,
      $color-bg-muted 100%
    );
  }

  &__image {
    filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.14));
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__price {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    font-variant-numeric: tabular-nums;
  }

  &__divider {
    height: 0;
    border: none;
    border-top: 1px dashed $color-border;
    margin: $space-1 0;
  }

  &__balance {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;

    strong {
      color: $color-text-primary;
      font-weight: $font-weight-bold;
    }
  }

  &__pickup {
    margin: 0;
    display: flex;
    align-items: flex-start;
    gap: $space-2;
    padding: $space-3;
    border-radius: $radius-lg;
    background-color: $color-primary-light;
    color: $color-primary-active;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    line-height: $line-height-base;
  }

  &__pickup-icon {
    flex-shrink: 0;
    margin-top: 1px;
  }
}

@media (max-width: 640px) {
  .purchase-modal {
    grid-template-columns: 1fr;
    gap: $space-4;

    &__media {
      min-height: 160px;
    }

    &__name {
      font-size: $font-size-lg;
    }

    &__price {
      font-size: $font-size-xl;
    }
  }
}
</style>
