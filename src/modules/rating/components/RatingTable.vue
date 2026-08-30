<script setup>
defineProps({
  rows: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="rating-table" aria-label="Рейтинг группы">
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
              <span class="rating-table__name">{{ row.fullName }}</span>
            </td>
            <td>{{ row.avgLabel }}</td>
            <td>{{ row.homeworkOnTime }} из {{ row.homeworkTotal }}</td>
            <td class="rating-table__points">{{ row.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.rating-table {
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
