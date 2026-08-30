<script setup>
import { computed } from 'vue'
import { BaseChip, BaseIcon } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'
import { formatTimeRange } from '../composables/useSchedule.js'

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const illustration = computed(() => useSubjectIllustration(props.lesson.subject))
const timeLabel = computed(() => formatTimeRange(props.lesson.start, props.lesson.end))
const status = computed(() => props.lesson.status ?? 'upcoming')
const isPast = computed(() => status.value === 'past')
const isLive = computed(() => status.value === 'live')
const isOnline = computed(() => Boolean(props.lesson.onlineUrl))

const statusChip = computed(() => {
  if (status.value === 'live') return { variant: 'approved', label: 'Идёт сейчас' }
  if (status.value === 'past') return { variant: 'missing', label: 'Прошло' }
  return { variant: 'current', label: 'Скоро' }
})

const locationLabel = computed(() => {
  if (isOnline.value) return 'Онлайн'
  return props.lesson.room || 'Аудитория не указана'
})

function onToggle() {
  emit('toggle', props.lesson.id)
}
</script>

<template>
  <article
    class="lesson-card"
    :class="{
      'lesson-card--expanded': expanded,
      'lesson-card--compact': compact,
      'lesson-card--past': isPast,
      'lesson-card--live': isLive,
    }"
    :style="{ '--subject-color': illustration.color || '#8b5cf6' }"
  >
    <button
      type="button"
      class="lesson-card__summary"
      :aria-expanded="expanded"
      @click="onToggle"
      @keydown.enter.prevent="onToggle"
    >
      <span class="lesson-card__stripe" aria-hidden="true" />

      <BaseIcon
        :name="illustration.name"
        type="avif"
        :size="compact ? 28 : 44"
        class="lesson-card__subject-icon"
        :label="lesson.title"
      />

      <span class="lesson-card__main">
        <span class="lesson-card__title-row">
          <span class="lesson-card__title">{{ lesson.title }}</span>
          <span class="lesson-card__chips">
            <BaseChip :variant="statusChip.variant" size="sm">{{ statusChip.label }}</BaseChip>
            <span v-if="isOnline" class="lesson-card__online">Онлайн</span>
          </span>
        </span>
        <span class="lesson-card__meta">{{ timeLabel }}</span>
      </span>

      <BaseIcon
        v-if="!compact"
        name="chevron-down"
        :size="18"
        class="lesson-card__chevron"
        :class="{ 'lesson-card__chevron--open': expanded }"
      />
    </button>

    <div v-if="expanded" class="lesson-card__details">
      <dl class="lesson-card__facts">
        <div class="lesson-card__fact">
          <dt>Преподаватель</dt>
          <dd>{{ lesson.teacher }}</dd>
        </div>
        <div class="lesson-card__fact">
          <dt>Где</dt>
          <dd>{{ locationLabel }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.lesson-card {
  @include card-surface;

  overflow: hidden;
  min-width: 0;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition-base, border-color $transition-base, filter $transition-base,
    opacity $transition-base;

  &--expanded {
    box-shadow: $shadow-card;
    border-color: $color-primary-muted;
  }

  &--past {
    filter: grayscale(0.35);
    opacity: 0.86;
  }

  &--compact {
    .lesson-card__summary {
      align-items: flex-start;
      padding: $space-2 $space-3;
      gap: $space-2;
    }

    .lesson-card__title {
      font-size: $font-size-sm;
      overflow-wrap: anywhere;
    }

    .lesson-card__meta {
      white-space: nowrap;
    }

    .lesson-card__details {
      padding: 0 $space-3 $space-3;
    }
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: $space-4;
    width: 100%;
    padding: $space-4;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    color: inherit;

    &:focus-visible {
      @include focus-ring;
    }
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

  &--live &__stripe {
    animation: lesson-pulse 1.6s ease-in-out infinite;
  }

  &--compact &__stripe {
    margin: -#{$space-2} 0 -#{$space-2} -#{$space-3};
    min-height: 28px;
  }

  &__subject-icon {
    flex-shrink: 0;
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-1;
  }

  &__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-2 $space-3;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__chips {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-2;
  }

  &__online {
    display: inline-flex;
    align-items: center;
    padding: $space-1 $space-3;
    border-radius: $radius-chip;
    background-color: $color-info-light;
    color: $color-info;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
  }

  &__meta {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }

  &__chevron {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: 0 $space-4 $space-4;
  }

  &__facts {
    display: grid;
    gap: $space-3;
    margin: 0;
  }

  &__fact {
    display: grid;
    gap: 2px;

    dt {
      margin: 0;
      font-size: $font-size-xs;
      color: $color-text-muted;
    }

    dd {
      margin: 0;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

}

@keyframes lesson-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
