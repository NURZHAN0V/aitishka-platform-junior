<script setup>
import { BaseCard } from '@/core/components/ui'

defineProps({
  rows: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
})
</script>

<template>
  <BaseCard padding="md" class="payments-history">
    <template #title>История платежей</template>

    <p class="payments-history__hint">
      Оплаты, которые уже прошли.
    </p>

    <div v-if="isEmpty" class="payments-history__empty">
      <p class="payments-history__empty-title">Пока нет оплат</p>
      <p class="payments-history__empty-hint">
        Когда учебная часть отметит платёж, он появится здесь
      </p>
    </div>

    <div v-else class="payments-history__table-wrap">
      <table class="payments-history__table">
        <thead>
          <tr>
            <th scope="col">Дата</th>
            <th scope="col">Назначение платежа</th>
            <th scope="col" class="payments-history__amount-col">Оплачено</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <time :datetime="row.paidAt">{{ row.dateLabel }}</time>
            </td>
            <td>{{ row.purpose }}</td>
            <td class="payments-history__amount-col">{{ row.amountLabel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.payments-history {
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.base-card__header) {
    flex-shrink: 0;
  }

  :deep(.base-card__body) {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__hint {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-muted;
    flex-shrink: 0;
  }

  &__empty {
    flex: 1 1 auto;
    text-align: center;
    padding: $space-5 $space-4;
    border-radius: $radius-lg;
    background-color: $color-bg-muted;
  }

  &__empty-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__empty-hint {
    margin: $space-2 0 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__table-wrap {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    margin-inline: -#{$space-1};
    padding-inline: $space-1;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th,
    td {
      padding: $space-3 $space-3;
      text-align: left;
      vertical-align: middle;
    }

    th {
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      color: $color-text-muted;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      border-bottom: 1px solid $color-border;
    }

    td {
      color: $color-text-primary;
      border-bottom: 1px solid $color-border-light;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }
  }

  &__amount-col {
    text-align: right !important;
    font-variant-numeric: tabular-nums;
    font-weight: $font-weight-semibold;
    white-space: nowrap;
    color: $color-success-hover;
  }
}

@media (max-width: 560px) {
  .payments-history__table {
    th:nth-child(2),
    td:nth-child(2) {
      min-width: 12rem;
    }
  }
}
</style>
