<script setup>
import { computed } from 'vue'
import { BaseTabs, PeriodNav } from '@/core/components/ui'
import { PERIOD_TABS } from '../constants/grades.js'

const props = defineProps({
  period: { type: String, required: true },
  periodLabel: { type: String, required: true },
  /** Неделя/месяц скрыты на телефоне/узком планшете (max-width 900px). */
  allowMultiPeriod: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'update:period',
  'prev-period',
  'next-period',
  'go-current',
])

const navLabels = computed(() => {
  if (props.period === 'day') {
    return { prev: 'Предыдущий день', next: 'Следующий день', current: 'Сегодня' }
  }
  if (props.period === 'week') {
    return { prev: 'Предыдущая неделя', next: 'Следующая неделя', current: 'Текущая неделя' }
  }
  return { prev: 'Предыдущий месяц', next: 'Следующий месяц', current: 'Текущий месяц' }
})
</script>

<template>
  <div class="grades-toolbar">
    <div class="grades-toolbar__row">
      <BaseTabs
        v-if="allowMultiPeriod"
        :model-value="period"
        :tabs="PERIOD_TABS"
        @update:model-value="emit('update:period', $event)"
      />

      <PeriodNav
        class="grades-toolbar__period"
        :label="periodLabel"
        :prev-label="navLabels.prev"
        :next-label="navLabels.next"
        :current-label="navLabels.current"
        @prev="emit('prev-period')"
        @next="emit('next-period')"
        @current="emit('go-current')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.grades-toolbar {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
  }

  &__period {
    min-width: 0;
  }

  @include media-phone {
    &__row {
      flex-direction: column;
      align-items: stretch;
      gap: $space-3;
    }

    &__period {
      width: 100%;
    }
  }
}
</style>
