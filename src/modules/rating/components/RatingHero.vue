<script setup>
import { BaseButton, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { DYNAMICS_TOOLTIP_EMPTY } from '../constants/rating.js'

defineProps({
  rank: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  periodHint: { type: String, default: '' },
  formulaTooltip: { type: String, required: true },
  dynamics: { type: Object, default: null },
  progressItems: { type: Array, default: () => [] },
  leaders: { type: Array, default: () => [] },
  fullListOpen: { type: Boolean, default: false },
  mobileDetailsOpen: { type: Boolean, default: false },
})

defineEmits(['toggle-full-list', 'show-full-list', 'toggle-mobile-details'])
</script>

<template>
  <article
    class="rating-hero"
    :class="{ 'rating-hero--details-open': mobileDetailsOpen }"
    aria-label="Мой рейтинг"
  >
    <header class="rating-hero__header">
      <BaseIcon
        :name="WIDGET_ILLUSTRATIONS.trophy"
        type="avif"
        :size="36"
        class="rating-hero__icon"
        label=""
      />
      <h2 class="rating-hero__title">Мой рейтинг</h2>
      <BaseTooltip :text="formulaTooltip" placement="bottom">
        <button type="button" class="rating-hero__hint" aria-label="Формула рейтинга">
          <BaseIcon name="info-circle" :size="16" />
        </button>
      </BaseTooltip>
    </header>

    <div class="rating-hero__body">
      <section class="rating-hero__metrics">
        <div class="rating-hero__metrics-top">
          <p class="rating-hero__rank">
            <span class="rating-hero__rank-value">{{ rank }}</span>
            <span class="rating-hero__rank-text"> из {{ total }}</span>
          </p>
          <p class="rating-hero__rank-caption">место в группе</p>

          <div class="rating-hero__points-row">
            <p class="rating-hero__points">
              <span class="rating-hero__points-value">{{ points }}</span>
              <span class="rating-hero__points-text"> баллов</span>
            </p>

            <BaseTooltip
              v-if="dynamics"
              :text="dynamics.tooltip"
              placement="top"
            >
              <button
                type="button"
                class="rating-hero__delta"
                :class="`rating-hero__delta--${dynamics.direction}`"
                :aria-label="dynamics.tooltip"
              >
                <template v-if="dynamics.direction === 'up'">↑</template>
                <template v-else-if="dynamics.direction === 'down'">↓</template>
                <template v-else>—</template>
                {{ dynamics.label }}
              </button>
            </BaseTooltip>
            <BaseTooltip v-else :text="DYNAMICS_TOOLTIP_EMPTY" placement="top">
              <button
                type="button"
                class="rating-hero__delta rating-hero__delta--empty"
                aria-label="Нет динамики"
              >
                —
              </button>
            </BaseTooltip>
          </div>

          <p class="rating-hero__period">{{ periodHint }}</p>
        </div>

        <div class="rating-hero__progress-list">
          <div
            v-for="item in progressItems"
            :key="item.id"
            class="rating-hero__progress"
          >
            <div class="rating-hero__progress-head">
              <p class="rating-hero__progress-label">{{ item.label }}</p>
              <BaseTooltip :text="item.tooltip" placement="top">
                <button
                  type="button"
                  class="rating-hero__hint"
                  :aria-label="item.label"
                >
                  <BaseIcon name="info-circle" :size="14" />
                </button>
              </BaseTooltip>
            </div>
            <div class="rating-hero__progress-row">
              <div class="rating-hero__progress-track" aria-hidden="true">
                <div
                  class="rating-hero__progress-fill"
                  :style="{ width: `${item.percent}%` }"
                />
              </div>
              <span class="rating-hero__progress-percent">{{ item.valueLabel }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="rating-hero__leaders" aria-label="Лидеры группы">
        <div class="rating-hero__leaders-head">
          <p class="rating-hero__leaders-title">Лидеры группы</p>
          <BaseTooltip
            text="Топ по баллам за выбранный месяц. Ваша строка выделена"
            placement="top"
          >
            <button type="button" class="rating-hero__hint rating-hero__hint--muted" aria-label="Про лидеров">
              <BaseIcon name="info-circle" :size="14" />
            </button>
          </BaseTooltip>
        </div>

        <table class="rating-hero__table">
          <thead>
            <tr>
              <th>Место</th>
              <th>Имя</th>
              <th>Баллы</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in leaders"
              :key="row.id"
              :class="{ 'rating-hero__table-row--current': row.isCurrent }"
            >
              <td>{{ row.rank }}</td>
              <td>{{ row.shortName }}</td>
              <td>{{ row.points }}</td>
            </tr>
          </tbody>
        </table>

        <BaseButton
          variant="link"
          class="rating-hero__full-link"
          @click="$emit(fullListOpen ? 'toggle-full-list' : 'show-full-list')"
        >
          {{ fullListOpen ? 'Скрыть таблицу' : 'Вся таблица →' }}
        </BaseButton>
      </section>
    </div>

    <div class="rating-hero__mobile-toggle">
      <BaseButton
        variant="secondary"
        size="sm"
        :icon="mobileDetailsOpen ? 'chevron-down' : 'chevron-right'"
        icon-position="trailing"
        @click="$emit('toggle-mobile-details')"
      >
        {{ mobileDetailsOpen ? 'Свернуть детали' : 'Показать детали' }}
      </BaseButton>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-hero {
  display: flex;
  flex-direction: column;
  padding: $space-5;
  border-radius: $radius-2xl;
  background: linear-gradient(145deg, #7c3aed 0%, #6366f1 55%, #8b5cf6 100%);
  color: $color-text-inverse;
  box-shadow: $shadow-md;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-4;
    @include no-select;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
  }

  &__hint {
    display: inline-flex;
    padding: 0;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.78);
    cursor: pointer;

    &:hover {
      color: $color-text-inverse;
    }

    &:focus-visible {
      @include focus-ring;
      border-radius: $radius-sm;
    }

    &--muted {
      color: $color-text-muted;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: $space-5;
    align-items: stretch;
  }

  &__metrics {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    gap: $space-5;
  }

  &__rank {
    margin: 0;
    line-height: 1;
  }

  &__rank-value {
    font-size: 3rem;
    font-weight: $font-weight-bold;
    letter-spacing: -0.03em;
  }

  &__rank-text {
    font-size: $font-size-xl;
    font-weight: $font-weight-normal;
    opacity: 0.95;
  }

  &__rank-caption {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    opacity: 0.8;
  }

  &__points-row {
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-top: $space-4;
    flex-wrap: wrap;
  }

  &__points {
    margin: 0;
    line-height: 1.1;
  }

  &__points-value {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
  }

  &__points-text {
    font-size: $font-size-base;
    opacity: 0.92;
  }

  &__delta {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 4px 10px;
    border: none;
    border-radius: $radius-chip;
    font-family: inherit;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    line-height: 1.2;
    color: inherit;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.18);

    &:focus-visible {
      @include focus-ring;
    }

    &--up {
      background: rgba(16, 185, 129, 0.35);
    }

    &--down {
      background: rgba(239, 68, 68, 0.38);
    }

    &--same,
    &--empty {
      opacity: 0.85;
    }
  }

  &__period {
    margin: $space-3 0 0;
    font-size: $font-size-sm;
    opacity: 0.72;
  }

  &__progress-list {
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__progress-head {
    display: flex;
    align-items: center;
    gap: $space-1;
    margin-bottom: $space-1;
  }

  &__progress-label {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
  }

  &__progress-row {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__progress-percent {
    flex-shrink: 0;
    min-width: 2.75rem;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    text-align: right;
  }

  &__progress-track {
    flex: 1;
    min-width: 0;
    height: 10px;
    overflow: hidden;
    border-radius: $radius-chip;
    background-color: rgba(255, 255, 255, 0.92);
  }

  &__progress-fill {
    height: 100%;
    border-radius: inherit;
    background-color: #3730a3;
    transition: width $transition-base;
  }

  &__leaders {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: $space-4;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-primary;
  }

  &__leaders-head {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-3;
  }

  &__leaders-title {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 4px;
    table-layout: fixed;
    font-size: $font-size-sm;
    line-height: 1.2;

    th {
      padding: 0 $space-2 6px;
      font-weight: $font-weight-medium;
      text-align: left;
      color: $color-text-muted;
      border-bottom: 1px solid $color-border-light;

      &:first-child {
        width: 22%;
      }

      &:last-child {
        width: 24%;
        text-align: right;
      }
    }

    td {
      padding: 8px $space-2;
      color: $color-text-primary;
      @include truncate;

      &:last-child {
        text-align: right;
        font-weight: $font-weight-semibold;
      }
    }
  }

  &__table-row--current td {
    background-color: $color-primary-light;
    color: $color-primary;
    font-weight: $font-weight-bold;

    &:first-child {
      border-radius: $radius-sm 0 0 $radius-sm;
    }

    &:last-child {
      border-radius: 0 $radius-sm $radius-sm 0;
    }
  }

  &__full-link {
    margin-top: auto;
    padding-top: $space-3;
    align-self: center;
  }

  &__mobile-toggle {
    display: none;
    margin-top: $space-4;
  }
}

@media (max-width: 960px) {
  .rating-hero {
    &__body {
      grid-template-columns: 1fr;
    }

    &__rank-value {
      font-size: 2.5rem;
    }
  }
}

@media (max-width: 720px) {
  .rating-hero {
    padding: $space-4;

    &__mobile-toggle {
      display: block;
    }

    &__progress-list,
    &__leaders {
      display: none;
    }

    &--details-open {
      .rating-hero__progress-list,
      .rating-hero__leaders {
        display: flex;
      }
    }

    &__body {
      gap: $space-4;
    }

    :deep(.base-button--secondary) {
      width: 100%;
      justify-content: center;
      color: $color-primary;
      background: rgba(255, 255, 255, 0.92);
      border-color: transparent;
    }
  }
}
</style>
