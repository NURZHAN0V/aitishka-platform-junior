<script setup>
import { BaseCard, BaseChip, BaseIcon, BaseTooltip } from '@/core/components/ui'

defineProps({
  rows: { type: Array, default: () => [] },
  periodLabel: { type: String, required: true },
})
</script>

<template>
  <BaseCard padding="md" class="rating-table" aria-label="Полная таблица группы">
    <div class="rating-table__head">
      <div>
        <h2 class="rating-table__title">Вся группа</h2>
        <p class="rating-table__meta">{{ periodLabel }} · место, ФИО, балл рейтинга</p>
      </div>
      <BaseTooltip
        text="Место за календарный месяц. При равных баллах — по алфавиту"
        placement="top"
      >
        <button type="button" class="rating-table__hint" aria-label="Про таблицу">
          <BaseIcon name="info-circle" :size="16" />
        </button>
      </BaseTooltip>
    </div>

    <div class="rating-table__scroll">
      <table class="rating-table__grid">
        <thead>
          <tr>
            <th>Место</th>
            <th>ФИО</th>
            <th>Средний балл</th>
            <th>ДЗ вовремя</th>
            <th>Баллы</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            :class="{ 'rating-table__row--current': row.isCurrent }"
          >
            <td>
              <span class="rating-table__place">{{ row.rank }}</span>
            </td>
            <td>
              <span class="rating-table__person">
                <span class="rating-table__name">{{ row.fullName }}</span>
                <BaseChip v-if="row.isCurrent" variant="current" size="sm">Вы</BaseChip>
              </span>
            </td>
            <td>{{ row.avgLabel }}</td>
            <td>{{ row.homeworkOnTime }} из {{ row.homeworkTotal }}</td>
            <td class="rating-table__points">{{ row.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-table {
  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: $space-3;
    margin-bottom: $space-4;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__meta {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
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

  &__scroll {
    overflow-x: auto;
  }

  &__grid {
    width: 100%;
    min-width: 560px;
    border-collapse: separate;
    border-spacing: 0 4px;
    font-size: $font-size-sm;

    th {
      padding: 0 $space-3 8px;
      font-weight: $font-weight-medium;
      text-align: left;
      color: $color-text-muted;
      border-bottom: 1px solid $color-border-light;
      white-space: nowrap;

      &:first-child {
        width: 4.5rem;
      }

      &:last-child {
        text-align: right;
      }
    }

    td {
      padding: 10px $space-3;
      color: $color-text-primary;
      background: $color-bg-muted;
      vertical-align: middle;

      &:first-child {
        border-radius: $radius-sm 0 0 $radius-sm;
      }

      &:last-child {
        border-radius: 0 $radius-sm $radius-sm 0;
        text-align: right;
      }
    }
  }

  &__place {
    font-weight: $font-weight-bold;
  }

  &__name {
    font-weight: $font-weight-semibold;
  }

  &__person {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__points {
    font-weight: $font-weight-bold;
  }

  &__row--current td {
    background: $color-primary-light;
    color: $color-primary;
  }
}

@media (max-width: 720px) {
  .rating-table__grid {
    font-size: $font-size-xs;
    min-width: 480px;

    th,
    td {
      padding-left: $space-2;
      padding-right: $space-2;
    }
  }
}
</style>
