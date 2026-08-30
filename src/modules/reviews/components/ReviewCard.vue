<script setup>
import { computed } from 'vue'
import { BaseIcon } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
})

const illustration = computed(() => useSubjectIllustration(props.review.subject))
</script>

<template>
  <article
    class="review-card"
    :style="{ '--subject-color': illustration.color || '#8b5cf6' }"
  >
    <header class="review-card__header">
      <span class="review-card__stripe" aria-hidden="true" />

      <BaseIcon
        :name="illustration.name"
        type="avif"
        :size="44"
        class="review-card__subject-icon"
        :label="review.subjectLabel"
      />

      <div class="review-card__meta">
        <p class="review-card__teacher">{{ review.teacher }}</p>
        <p class="review-card__details">
          <span>{{ review.subjectLabel }}</span>
          <span aria-hidden="true">·</span>
          <time :datetime="review.at">{{ review.dateLabel }}</time>
        </p>
      </div>
    </header>

    <p class="review-card__text">{{ review.text }}</p>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.review-card {
  @include card-surface;

  display: flex;
  flex-direction: column;
  gap: $space-3;
  padding: $space-4;
  min-width: 0;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-4;
    min-width: 0;
  }

  &__stripe {
    flex-shrink: 0;
    width: 4px;
    align-self: stretch;
    min-height: 44px;
    margin: -#{$space-4} 0 -#{$space-4} -#{$space-4};
    border-radius: $radius-lg 0 0 $radius-lg;
    background: var(--subject-color);
  }

  &__subject-icon {
    flex-shrink: 0;
  }

  &__meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__teacher {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__details {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: $space-1 $space-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
  }

  &__text {
    margin: 0;
    padding: $space-3;
    border-radius: $radius-md;
    background-color: $color-bg-muted;
    font-size: $font-size-sm;
    line-height: $line-height-base;
    color: $color-text-secondary;
    white-space: pre-wrap;
  }
}

@media (max-width: 640px) {
  .review-card {
    padding: $space-3;
    gap: $space-3;

    &__header {
      gap: $space-3;
    }

    &__stripe {
      margin: -#{$space-3} 0 -#{$space-3} -#{$space-3};
      min-height: 36px;
    }

    &__subject-icon {
      width: 32px !important;
      height: 32px !important;
    }
  }
}
</style>
