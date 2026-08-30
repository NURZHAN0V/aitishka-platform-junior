<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const isLink = computed(() => Boolean(props.item.href))

function gradeVariant(grade) {
  if (grade >= 5) return 'excellent'
  if (grade >= 4) return 'good'
  return 'average'
}
</script>

<template>
  <component
    :is="isLink ? RouterLink : 'article'"
    class="journal-event-card"
    :class="{
      'journal-event-card--link': isLink,
      [`journal-event-card--${item.type}`]: true,
    }"
    :to="isLink ? item.href : undefined"
  >
    <span
      class="journal-event-card__icon"
      :class="
        item.type === 'grade'
          ? `journal-event-card__icon--grade-${gradeVariant(item.grade)}`
          : `journal-event-card__icon--${item.type}`
      "
    >
      <template v-if="item.type === 'grade'">
        <BaseIcon
          :name="item.icon.name"
          type="avif"
          :size="32"
          label=""
          class="journal-event-card__grade-bg"
        />
        <span class="journal-event-card__grade">{{ item.grade }}</span>
      </template>
      <BaseIcon
        v-else
        :name="item.icon.name"
        :type="item.icon.type"
        :size="item.icon.type === 'avif' ? 32 : 22"
        label=""
      />
    </span>

    <span class="journal-event-card__body">
      <span class="journal-event-card__text">{{ item.text }}</span>
      <span v-if="item.context" class="journal-event-card__context">{{ item.context }}</span>
    </span>

    <time class="journal-event-card__date" :datetime="item.at">{{ item.dateLabel }}</time>
  </component>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.journal-event-card {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-xl;
  background-color: $color-bg-card;
  box-shadow: $shadow-sm;
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &--link {
    cursor: pointer;

    &:hover {
      border-color: $color-border;
      box-shadow: $shadow-md;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: $radius-lg;
    background-color: $color-bg-muted;
    color: $color-text-secondary;

    :deep(.base-icon) {
      flex-shrink: 0;
    }
  }

  &__icon--attendance {
    background-color: rgba(16, 185, 129, 0.12);
    color: $color-success;
  }

  &__icon--homework {
    background-color: $color-primary-light;
    color: $color-primary;
  }

  &__icon--exam {
    background-color: rgba(245, 158, 11, 0.14);
    color: $color-warning;
  }

  &__icon--coins {
    background-color: rgba(245, 158, 11, 0.16);
    color: #d97706;
  }

  &__icon--review {
    background-color: $color-primary-light;
    color: $color-primary;
  }

  &__icon--survey {
    background-color: rgba(16, 185, 129, 0.12);
    color: $color-success;
  }

  &__icon--market {
    background-color: rgba(249, 115, 22, 0.12);
    color: #ea580c;
  }

  &__icon--yandex {
    background-color: rgba(245, 158, 11, 0.14);
    color: #ca8a04;
  }

  &__icon--grade-excellent,
  &__icon--grade-good,
  &__icon--grade-average {
    background-color: transparent;
  }

  &__grade-bg {
    position: absolute;
    inset: 0;
    margin: auto;
  }

  &__grade {
    position: relative;
    z-index: 1;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    line-height: 1;
    color: $color-text-inverse;
    text-shadow: 0 1px 2px rgba(15, 23, 42, 0.35);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__text {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__context {
    font-size: $font-size-sm;
    color: $color-text-muted;
    @include truncate;
  }

  &__date {
    font-size: $font-size-xs;
    color: $color-text-muted;
    white-space: nowrap;
    align-self: start;
    padding-top: 2px;
  }
}

@media (max-width: 560px) {
  .journal-event-card {
    grid-template-columns: 40px minmax(0, 1fr);
    grid-template-rows: auto auto;
    gap: $space-2 $space-3;

    &__date {
      grid-column: 2;
      align-self: start;
      padding-top: 0;
    }
  }
}
</style>
