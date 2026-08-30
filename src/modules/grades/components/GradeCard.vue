<script setup>
import { computed } from 'vue'
import { BaseChip, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

const props = defineProps({
  grade: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const illustration = computed(() => useSubjectIllustration(props.grade.subject))

function onToggle() {
  emit('toggle', props.grade.id)
}
</script>

<template>
  <article
    class="grade-card"
    :class="{
      'grade-card--expanded': expanded,
      'grade-card--special': grade.statusMeta.length > 0,
      [`grade-card--${grade.tone}`]: true,
    }"
    :style="{ '--subject-color': illustration.color || '#8b5cf6' }"
  >
    <button
      type="button"
      class="grade-card__summary"
      :aria-expanded="expanded"
      @click="onToggle"
      @keydown.enter.prevent="onToggle"
    >
      <span class="grade-card__stripe" aria-hidden="true" />

      <BaseIcon
        :name="illustration.name"
        type="avif"
        :size="44"
        class="grade-card__subject-icon"
        :label="grade.title"
      />

      <span class="grade-card__main">
        <span class="grade-card__title-row">
          <span class="grade-card__title">{{ grade.title }}</span>
          <span class="grade-card__chips">
            <BaseTooltip
              v-for="status in grade.statusMeta"
              :key="status.id"
              :text="status.tooltip"
              placement="top"
            >
              <BaseChip :variant="status.chip" size="sm">
                {{ status.label }}
              </BaseChip>
            </BaseTooltip>
          </span>
        </span>
        <span class="grade-card__meta">
          {{ grade.workTypeLabel }}
          <span aria-hidden="true">·</span>
          {{ grade.dateLabel }}
        </span>
      </span>

      <span
        class="grade-card__score"
        :class="`grade-card__score--${grade.tone}`"
        :title="grade.scoreTitle"
      >
        {{ grade.scoreLabel }}
      </span>

      <BaseIcon
        name="chevron-down"
        :size="18"
        class="grade-card__chevron"
        :class="{ 'grade-card__chevron--open': expanded }"
      />
    </button>

    <div v-if="expanded" class="grade-card__details">
      <dl class="grade-card__facts">
        <div class="grade-card__fact">
          <dt>Преподаватель</dt>
          <dd>{{ grade.teacher }}</dd>
        </div>
        <div class="grade-card__fact">
          <dt>Тип работы</dt>
          <dd>{{ grade.workTypeLabel }}</dd>
        </div>
        <div class="grade-card__fact">
          <dt>Оценка</dt>
          <dd>{{ grade.score == null ? 'Не аттестован' : `${grade.score} — ${grade.scoreTitle}` }}</dd>
        </div>
        <div v-if="grade.coinsEarned > 0" class="grade-card__fact">
          <dt>Монетки</dt>
          <dd class="grade-card__coins">
            <BaseIcon :name="BRAND_ILLUSTRATIONS.coin" type="avif" :size="18" label="" />
            +{{ grade.coinsEarned }} за пятёрку по ДЗ
          </dd>
        </div>
      </dl>
      <p v-if="grade.comment" class="grade-card__comment">{{ grade.comment }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.grade-card {
  @include card-surface;

  overflow: hidden;
  min-width: 0;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition-base, border-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
  }

  &--expanded {
    box-shadow: $shadow-card;
    border-color: $color-primary-muted;
  }

  &--special {
    box-shadow: $shadow-sm, 0 0 0 1px rgba(139, 92, 246, 0.08);
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

    &:active {
      background-color: $color-bg-muted;
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

  &__meta {
    color: $color-text-secondary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    display: flex;
    flex-wrap: wrap;
    gap: $space-1 $space-2;
  }

  &__score {
    flex-shrink: 0;
    min-width: 2.5rem;
    text-align: center;
    font-size: 1.75rem;
    font-weight: $font-weight-bold;
    line-height: 1;
    letter-spacing: -0.02em;

    &--excellent {
      color: $color-success;
    }

    &--good {
      color: $color-primary;
    }

    &--ok {
      color: $color-warning;
    }

    &--bad {
      color: $color-error;
    }

    &--muted {
      color: $color-text-muted;
      font-size: $font-size-base;
    }
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
    gap: $space-3;
    padding: 0 $space-4 $space-4;
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

  &__coins {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    color: $color-coin-dark !important;
  }

  &__comment {
    margin: 0;
    padding: $space-3;
    border-radius: $radius-md;
    background-color: $color-bg-muted;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
}

@media (max-width: 640px) {
  .grade-card {
    &__summary {
      gap: $space-3;
      padding: $space-3;
    }

    &__stripe {
      margin: -#{$space-3} 0 -#{$space-3} -#{$space-3};
      min-height: 36px;
    }

    &__subject-icon {
      width: 32px !important;
      height: 32px !important;
    }

    &__score {
      min-width: 2rem;
      font-size: 1.5rem;
    }

    &__facts {
      grid-template-columns: 1fr;
    }
  }
}
</style>
