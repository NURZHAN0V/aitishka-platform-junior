<script setup>
import { BaseCard } from '@/core/components/ui'

defineProps({
  rows: { type: Array, default: () => [] },
  isEmpty: { type: Boolean, default: false },
  hasDebt: { type: Boolean, default: false },
  debtLabel: { type: String, default: '' },
  debtAbsoluteLabel: { type: String, default: '' },
})
</script>

<template>
  <BaseCard padding="md" class="payments-schedule">
    <template #title>График платежей</template>

    <p class="payments-schedule__hint">
      Когда и сколько нужно оплатить.
    </p>

    <div v-if="isEmpty && !hasDebt" class="payments-schedule__empty">
      <p class="payments-schedule__empty-title">Нет платежей в графике</p>
      <p class="payments-schedule__empty-hint">
        Когда появится график оплаты, он отобразится здесь
      </p>
    </div>

    <div v-else class="payments-schedule__table-wrap">
      <table class="payments-schedule__table">
        <thead>
          <tr>
            <th scope="col">Оплатить до</th>
            <th scope="col">Описание</th>
            <th scope="col" class="payments-schedule__amount-col">К оплате</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            :class="{ 'payments-schedule__row--past': row.isPast }"
          >
            <td>
              <time :datetime="row.dueDate">{{ row.dueLabel }}</time>
            </td>
            <td>{{ row.description }}</td>
            <td class="payments-schedule__amount-col">{{ row.amountLabel }}</td>
          </tr>
          <tr v-if="hasDebt" class="payments-schedule__debt">
            <td colspan="2">Задолженность</td>
            <td class="payments-schedule__amount-col">
              <span class="payments-schedule__debt-value" :title="debtAbsoluteLabel">
                {{ debtLabel }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="hasDebt" class="payments-schedule__debt-note">
      Задолженность считается автоматически: сумма по наступившим платежам минус
      все оплаты
    </p>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.payments-schedule {
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
  }

  &__row--past td {
    color: $color-text-secondary;
  }

  &__debt {
    background-color: $color-error-light;

    td {
      color: $color-error-hover;
      font-weight: $font-weight-bold;
      border-bottom: none;
    }
  }

  &__debt-value {
    color: $color-error;
  }

  &__debt-note {
    margin: $space-3 0 0;
    font-size: $font-size-xs;
    color: $color-text-muted;
    flex-shrink: 0;
  }
}

@media (max-width: 560px) {
  .payments-schedule__table {
    th:nth-child(2),
    td:nth-child(2) {
      min-width: 10rem;
    }
  }
}
</style>
