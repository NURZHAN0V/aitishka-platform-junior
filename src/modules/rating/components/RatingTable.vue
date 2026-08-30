<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="rating-table" aria-label="Рейтинг группы">
    <div class="rating-table__scroll rating-table__desktop">
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
              <span class="rating-table__name">{{ row.fullName }}</span>
            </td>
            <td>{{ row.avgLabel }}</td>
            <td>{{ row.homeworkOnTime }} из {{ row.homeworkTotal }}</td>
            <td class="rating-table__points">{{ row.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul class="rating-table__cards" aria-label="Список рейтинга">
      <li
        v-for="row in rows"
        :key="`card-${row.id}`"
        class="rating-table__card"
        :class="{ 'rating-table__card--current': row.isCurrent }"
      >
        <div class="rating-table__card-top">
          <span class="rating-table__place">{{ row.rank }}</span>
          <span class="rating-table__name">{{ row.fullName }}</span>
          <span class="rating-table__points">{{ row.points }}</span>
        </div>
        <div class="rating-table__card-meta">
          <span>Средний {{ row.avgLabel }}</span>
          <span>ДЗ {{ row.homeworkOnTime }}/{{ row.homeworkTotal }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-table {
  &__scroll {
    overflow-x: auto;
  }

  &__cards {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: column;
    gap: $space-2;
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
        border-radius: $radius-md 0 0 $radius-md;
      }

      &:last-child {
        border-radius: 0 $radius-md $radius-md 0;
        text-align: right;
      }
    }
  }

  &__place {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    font-weight: $font-weight-bold;
  }

  &__name {
    font-weight: $font-weight-medium;
  }

  &__points {
    font-weight: $font-weight-bold;
    font-variant-numeric: tabular-nums;
  }

  &__row--current td {
    background: $color-primary-light;
    color: $color-primary;
  }

  &__card {
    padding: $space-3 $space-4;
    border-radius: $radius-card;
    background: $color-bg-muted;

    &--current {
      background: $color-primary-light;
      color: $color-primary;
    }
  }

  &__card-top {
    display: flex;
    align-items: center;
    gap: $space-3;
    min-height: $touch-target-min;
  }

  &__card-top .rating-table__name {
    flex: 1;
    min-width: 0;
    @include truncate;
  }

  &__card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2 $space-4;
    margin-top: $space-1;
    padding-left: calc(1.75rem + #{$space-3});
    font-size: $font-size-xs;
    color: $color-text-secondary;
  }

  &__card--current &__card-meta {
    color: $color-primary;
  }

  @include media-phone {
    &__desktop {
      display: none;
    }

    &__cards {
      display: flex;
    }
  }
}
</style>
