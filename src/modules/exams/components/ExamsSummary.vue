<script setup>
import { BaseChip, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { EXAM_STATUSES } from '../constants/exams.js'
import ExamsMotivation from './ExamsMotivation.vue'

defineProps({
  awaitingCount: { type: Number, default: 0 },
  urgentCount: { type: Number, default: 0 },
  missedCount: { type: Number, default: 0 },
  upcomingItems: { type: Array, default: () => [] },
  motivation: { type: Object, required: true },
})

defineEmits(['select-status', 'open-exam'])
</script>

<template>
  <section class="exams-summary" aria-label="Сводка по экзаменам">
    <div class="exams-summary__head">
      <h1 class="exams-summary__title">Экзамены</h1>

      <div class="exams-summary__stats">
        <BaseTooltip :text="EXAM_STATUSES.awaiting.tooltip" placement="bottom">
          <button
            type="button"
            class="exams-summary__stat exams-summary__stat--awaiting"
            @click="$emit('select-status', 'awaiting')"
          >
            <BaseIcon name="clipboard" :size="22" class="exams-summary__stat-icon" />
            <span class="exams-summary__stat-text">
              Ожидают загрузки:
              <strong>{{ awaitingCount }}</strong>
            </span>
          </button>
        </BaseTooltip>

        <BaseTooltip
          text="Срок сегодня, уже прошёл или осталось 1–2 дня. Клик откроет ближайший экзамен"
          placement="bottom"
        >
          <button
            type="button"
            class="exams-summary__stat exams-summary__stat--urgent"
            @click="upcomingItems[0] ? $emit('open-exam', upcomingItems[0].id) : $emit('select-status', 'awaiting')"
          >
            <BaseIcon name="alert-circle" :size="22" class="exams-summary__stat-icon" />
            <span class="exams-summary__stat-text">
              Ближайшие сроки:
              <strong>{{ urgentCount }}</strong>
            </span>
          </button>
        </BaseTooltip>

        <BaseTooltip :text="EXAM_STATUSES.missed.tooltip" placement="bottom">
          <button
            type="button"
            class="exams-summary__stat exams-summary__stat--missed"
            @click="$emit('select-status', 'missed')"
          >
            <BaseIcon name="calendar-03" :size="22" class="exams-summary__stat-icon" />
            <span class="exams-summary__stat-text">
              Пропущено:
              <strong>{{ missedCount }}</strong>
            </span>
          </button>
        </BaseTooltip>
      </div>
    </div>

    <div v-if="upcomingItems.length" class="exams-summary__upcoming" aria-label="Ближайшие экзамены">
      <div class="exams-summary__upcoming-head">
        <p class="exams-summary__upcoming-title">Ближайшие сроки</p>
        <BaseTooltip
          text="Красный — сегодня или срок уже прошёл, жёлтый — 1–2 дня. Клик раскроет карточку"
          placement="top"
        >
          <button type="button" class="exams-summary__hint" aria-label="Про ближайшие сроки">
            <BaseIcon name="info-circle" :size="16" />
          </button>
        </BaseTooltip>
      </div>
      <ul class="exams-summary__upcoming-list">
        <li v-for="item in upcomingItems" :key="item.id">
          <button
            type="button"
            class="exams-summary__upcoming-item"
            :class="item.urgency ? `exams-summary__upcoming-item--${item.urgency.tone}` : null"
            @click="$emit('open-exam', item.id)"
          >
            <span class="exams-summary__upcoming-copy">
              <span class="exams-summary__upcoming-name">{{ item.title }}</span>
              <span class="exams-summary__upcoming-meta">
                {{ item.subjectLabel }}
                <span aria-hidden="true">·</span>
                до {{ item.deadlineLabel }}
              </span>
            </span>
            <BaseChip
              v-if="item.urgency"
              :variant="item.urgency.tone === 'danger' ? 'overdue' : 'pending'"
              size="sm"
            >
              {{ item.urgency.label }}
            </BaseChip>
          </button>
        </li>
      </ul>
    </div>

    <ExamsMotivation class="exams-summary__motivation" :motivation="motivation" />
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exams-summary {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
  }

  &__title {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: $space-3;
  }

  &__stat {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    padding: $space-2 $space-4;
    border: 1px solid $color-border-light;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    box-shadow: $shadow-sm;
    font-family: inherit;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    cursor: pointer;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:hover {
      box-shadow: $shadow-card;
    }

    &:focus-visible {
      @include focus-ring;
    }

    strong {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
    }

    &--awaiting {
      .exams-summary__stat-icon {
        color: $homework-status-current;
      }
    }

    &--urgent {
      color: $color-error;

      .exams-summary__stat-icon {
        color: $color-error;
      }
    }

    &--missed {
      color: $color-overdue;

      .exams-summary__stat-icon {
        color: $color-overdue;
      }
    }
  }

  &__stat-text {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    color: $color-text-primary;
  }

  &__upcoming {
    @include card-surface;
    padding: $space-4;
    border: 1px solid $color-border-light;
    box-shadow: $shadow-sm;
  }

  &__upcoming-head {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-3;
  }

  &__upcoming-title {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__hint {
    display: inline-flex;
    padding: 0;
    border: none;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;

    &:hover {
      color: $color-primary;
    }

    &:focus-visible {
      @include focus-ring;
      border-radius: $radius-sm;
    }
  }

  &__upcoming-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: $space-3;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__upcoming-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    width: 100%;
    min-height: 72px;
    padding: $space-3;
    border: 1px solid $color-border-light;
    border-radius: $radius-md;
    background: $color-bg-card;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      box-shadow: $shadow-sm;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--danger {
      border-color: $color-error-light;
    }

    &--warning {
      border-color: $color-warning-light;
    }
  }

  &__upcoming-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__upcoming-name {
    @include truncate;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__upcoming-meta {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }
}

@media (max-width: 960px) {
  .exams-summary__upcoming-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .exams-summary {
    display: flex;
  }

  .exams-summary__head {
    display: contents;
  }

  .exams-summary__title {
    order: 0;
    font-size: $font-size-xl;
  }

  .exams-summary__upcoming {
    order: 1;
  }

  .exams-summary__stats {
    order: 2;
  }

  .exams-summary__motivation {
    order: 3;
  }

  .exams-summary__stat {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
}
</style>
