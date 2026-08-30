<script setup>
import { RouterLink } from 'vue-router'
import { BaseCard, BaseIcon } from '@/core/components/ui'
import { WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { COINS_PAGE_LINK } from '@/modules/coins/constants/coins.js'
import { SETTINGS_PAGE_LINK } from '@/modules/profile/constants/profile.js'

defineProps({
  giftPending: { type: Boolean, default: false },
  giftEarned: { type: Boolean, default: false },
  bonusAmount: { type: Number, default: 5 },
})
</script>

<template>
  <BaseCard padding="md" class="profile-gift">
    <div class="profile-gift__body">
      <header class="profile-gift__header">
        <h2 class="profile-gift__title">Подарок</h2>
        <p
          v-if="giftEarned"
          class="profile-gift__lead profile-gift__lead--done"
        >
          Фото одобрено — подарок получен
        </p>
        <p
          v-else-if="giftPending"
          class="profile-gift__lead profile-gift__lead--pending"
        >
          Фото на проверке — ждём одобрения
        </p>
        <p v-else class="profile-gift__lead">
          Загрузи своё фото — после одобрения получишь +{{ bonusAmount }} монеток
        </p>
      </header>

      <div class="profile-gift__hero" aria-hidden="true">
        <BaseIcon
          :name="WIDGET_ILLUSTRATIONS.photoPolaroidCard"
          type="avif"
          :size="96"
          class="profile-gift__hero-art"
          label=""
        />
      </div>
    </div>

    <RouterLink
      v-if="giftEarned"
      :to="COINS_PAGE_LINK"
      class="profile-gift__cta profile-gift__cta--soft"
    >
      Смотреть в монетках →
    </RouterLink>
    <RouterLink
      v-else
      :to="SETTINGS_PAGE_LINK"
      class="profile-gift__cta"
    >
      {{ giftPending ? 'Смотреть статус →' : 'Загрузить фото →' }}
    </RouterLink>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.profile-gift[class] {
  box-shadow: none;
}

.profile-gift {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
  }

  &__header {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__lead {
    margin: $space-2 0 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;

    &--pending {
      color: $color-warning;
      font-weight: $font-weight-medium;
    }

    &--done {
      color: $color-success;
      font-weight: $font-weight-medium;
    }
  }

  &__hero {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-2;
    border-radius: $radius-card;
    background:
      radial-gradient(120% 80% at 100% 0%, rgba($color-primary, 0.1), transparent 55%),
      radial-gradient(90% 60% at 0% 100%, rgba($color-coin, 0.14), transparent 50%),
      $color-bg-muted;
  }

  &__hero-art {
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08));
  }

  &__cta {
    align-self: flex-start;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &--soft {
      color: $color-text-secondary;
      font-weight: $font-weight-medium;

      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>
