<script setup>
import { RouterLink } from 'vue-router'
import { BaseCard, BaseIcon } from '@/core/components/ui'
import { HELP_FAQ } from '@/modules/help/constants/help.js'

const items = HELP_FAQ
</script>

<template>
  <BaseCard padding="md" class="help-faq">
    <template #title>Частые вопросы</template>

    <p class="help-faq__lead">Короткие ответы — без сложных правил.</p>

    <div class="help-faq__list">
      <details v-for="item in items" :key="item.id" class="help-faq__item">
        <summary class="help-faq__question">
          <span class="help-faq__question-text">{{ item.question }}</span>
          <BaseIcon name="chevron-down" :size="18" class="help-faq__chevron" />
        </summary>
        <div class="help-faq__answer">
          <p>{{ item.answer }}</p>
          <div v-if="item.links?.length" class="help-faq__links">
            <RouterLink
              v-for="link in item.links"
              :key="link.to"
              :to="link.to"
              class="help-faq__link"
            >
              {{ link.label }} →
            </RouterLink>
          </div>
        </div>
      </details>
    </div>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.help-faq {
  &__lead {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-muted;
    line-height: $line-height-base;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__item {
    border-radius: $radius-lg;
    background-color: $color-bg-muted;
    overflow: hidden;

    &[open] {
      .help-faq__chevron {
        transform: rotate(180deg);
      }
    }
  }

  &__question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    padding: $space-3 $space-4;
    cursor: pointer;
    list-style: none;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &:focus-visible {
      @include focus-ring;
      border-radius: $radius-lg;
    }
  }

  &__question-text {
    min-width: 0;
    line-height: $line-height-base;
  }

  &__chevron {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-fast;
  }

  &__answer {
    padding: 0 $space-4 $space-4;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;

    p {
      margin: 0;
    }
  }

  &__links {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2 $space-4;
    margin-top: $space-3;
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
