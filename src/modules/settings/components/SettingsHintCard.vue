<script setup>
import { RouterLink } from 'vue-router'
import { BaseCard } from '@/core/components/ui'
import { PROFILE_PAGE_LINK } from '@/modules/profile/constants/profile.js'

defineProps({
  title: { type: String, required: true },
  text: { type: String, required: true },
  profileCta: { type: String, default: 'Открыть личный кабинет' },
})
</script>

<template>
  <BaseCard padding="md" class="settings-hint">
    <h2 class="settings-hint__title">{{ title }}</h2>
    <p class="settings-hint__text">{{ text }}</p>
    <RouterLink :to="PROFILE_PAGE_LINK" class="settings-hint__link">
      {{ profileCta }} →
    </RouterLink>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.settings-hint {
  &__title {
    margin: 0 0 $space-2;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__text {
    margin: 0 0 $space-3;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__link {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-link;
    text-decoration: none;

    &:hover {
      color: $color-text-link-hover;
      text-decoration: underline;
    }
  }
}
</style>
