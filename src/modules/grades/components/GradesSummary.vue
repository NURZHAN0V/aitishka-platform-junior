<script setup>
import { computed, ref } from 'vue'
import { BaseCard, BaseIcon, BaseModal, BaseTooltip } from '@/core/components/ui'
import AttendanceLineChart from '@/modules/home/components/AttendanceLineChart.vue'

const props = defineProps({
  averageLabel: { type: String, required: true },
  averageTone: { type: String, default: 'muted' },
  averageQualitative: { type: String, default: '' },
  period: { type: String, default: 'month' },
  periodLabel: { type: String, required: true },
  dynamicsPoints: { type: Array, default: () => [] },
  gradesCount: { type: Number, default: 0 },
})

const GRADE_CHART_TICKS = [2, 3, 4, 5]
const CHART_EMPTY_TEXT = 'Недостаточно данных для построения графика'

const dynamicsExpanded = ref(false)
const showDynamicsChart = computed(
  () => props.period !== 'day' && props.dynamicsPoints.length > 0,
)
</script>

<template>
  <section class="grades-summary" aria-label="Сводка по оценкам">
    <BaseCard padding="md" class="grades-summary__card grades-summary__card--average">
      <div class="grades-summary__average-head">
        <p class="grades-summary__label">Средний балл</p>
        <BaseTooltip text="Средний балл за выбранный период" placement="top">
          <button type="button" class="grades-summary__hint" aria-label="Про средний балл">
            <BaseIcon name="info-circle" :size="16" />
          </button>
        </BaseTooltip>
      </div>
      <p
        class="grades-summary__average-value"
        :class="`grades-summary__average-value--${averageTone}`"
      >
        {{ averageLabel }}
      </p>
      <p class="grades-summary__meta">
        {{ averageQualitative }}
        <span aria-hidden="true">·</span>
        {{ periodLabel }}
        <span aria-hidden="true">·</span>
        {{ gradesCount }} оценок
      </p>
    </BaseCard>

    <BaseCard padding="md" class="grades-summary__card grades-summary__card--dynamics">
      <div class="grades-summary__dynamics-head">
        <div class="grades-summary__average-head grades-summary__average-head--inline">
          <p class="grades-summary__label">Динамика успеваемости</p>
          <BaseTooltip text="Средние оценки в периоде" placement="top">
            <button type="button" class="grades-summary__hint" aria-label="Про динамику">
              <BaseIcon name="info-circle" :size="16" />
            </button>
          </BaseTooltip>
        </div>
        <BaseTooltip text="Развернуть" placement="top">
          <button
            type="button"
            class="grades-summary__expand"
            aria-label="Развернуть"
            :aria-expanded="dynamicsExpanded"
            aria-haspopup="dialog"
            @click="dynamicsExpanded = true"
          >
            <BaseIcon name="maximize-screen" :size="18" />
          </button>
        </BaseTooltip>
      </div>
      <div class="grades-summary__chart">
        <AttendanceLineChart
          v-if="showDynamicsChart"
          :data="dynamicsPoints"
          :min-value="2"
          :max-value="5"
          :y-ticks="GRADE_CHART_TICKS"
          value-suffix=""
          ariaLabel="Динамика оценок"
        />
        <p v-else class="grades-summary__chart-empty">{{ CHART_EMPTY_TEXT }}</p>
      </div>
    </BaseCard>

    <BaseModal
      v-model="dynamicsExpanded"
      title="Динамика успеваемости"
      size="xl"
      close-icon="minimize-screen"
      close-label="Свернуть"
      close-tooltip="Свернуть"
    >
      <template #title-extra>
        <BaseTooltip text="Средние оценки в периоде" placement="top">
          <button type="button" class="grades-summary__hint" aria-label="Про динамику">
            <BaseIcon name="info-circle" :size="16" />
          </button>
        </BaseTooltip>
      </template>
      <div class="grades-summary__expanded-chart">
        <AttendanceLineChart
          v-if="showDynamicsChart"
          :data="dynamicsPoints"
          :min-value="2"
          :max-value="5"
          :y-ticks="GRADE_CHART_TICKS"
          value-suffix=""
          ariaLabel="Динамика оценок, увеличенный график"
        />
        <p v-else class="grades-summary__chart-empty">{{ CHART_EMPTY_TEXT }}</p>
      </div>
    </BaseModal>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.grades-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: $space-4;
  align-items: stretch;

  &__card {
    min-width: 0;
    height: 100%;
  }

  &__card--average,
  &__card--dynamics {
    display: flex;
    flex-direction: column;

    :deep(.base-card__body) {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      min-width: 0;
    }
  }

  &__average-value {
    margin: auto 0 0;
    font-size: clamp(3.75rem, 5vw + 1.5rem, 4.75rem);
    font-weight: $font-weight-bold;
    line-height: 1;
    letter-spacing: -0.04em;

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
    }
  }

  &__meta {
    margin: $space-3 0 auto;
    font-size: $font-size-xs;
    color: $color-text-muted;
    display: flex;
    flex-wrap: wrap;
    gap: $space-1 $space-2;
  }

  &__chart {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    height: 112px;
    min-height: 112px;
    max-height: 112px;
    width: 100%;

    :deep(.attendance-line-chart) {
      min-height: 0;
      height: 100%;
    }
  }
}

.grades-summary__dynamics-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-2;
  margin-bottom: $space-2;
  flex-shrink: 0;
}

.grades-summary__average-head {
  display: flex;
  align-items: center;
  gap: $space-2;
  margin-bottom: $space-2;
  flex-shrink: 0;

  &--inline {
    margin-bottom: 0;
    min-width: 0;
  }
}

.grades-summary__label {
  margin: 0;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-secondary;
}

.grades-summary__hint,
.grades-summary__expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.grades-summary__expand {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: $radius-md;
  transition: background-color $transition-base, color $transition-base;

  &:hover {
    background-color: $color-bg-muted;
  }
}

.grades-summary__chart-empty {
  margin: auto 0;
  padding: 0 $space-3;
  font-size: $font-size-xs;
  color: $color-text-muted;
  text-align: center;
}

.grades-summary__expanded-chart {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;

  :deep(.attendance-line-chart) {
    min-height: 0;
    height: 100%;
  }
}

@media (max-width: 1100px) {
  .grades-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .grades-summary {
    grid-template-columns: 1fr;
  }
}
</style>
