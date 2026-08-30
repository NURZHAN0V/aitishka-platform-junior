<script setup>
import { computed } from 'vue'
import { BaseTabs, PeriodNav } from '@/core/components/ui'

const props = defineProps({
  view: {
    type: String,
    required: true,
  },
  periodLabel: {
    type: String,
    required: true,
  },
  /** Неделя/месяц только на широком экране (SCHEDULE_DESKTOP_MQ). */
  allowMultiView: {
    type: Boolean,
    default: true,
  },
})

defineEmits(['update:view', 'prev-period', 'next-period', 'go-today'])

const viewTabs = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
]

const navLabels = computed(() => {
  if (props.view === 'day') {
    return {
      prev: 'Предыдущий день',
      next: 'Следующий день',
      current: 'Сегодня',
    }
  }
  if (props.view === 'month') {
    return {
      prev: 'Предыдущий месяц',
      next: 'Следующий месяц',
      current: 'Сегодня',
    }
  }
  return {
    prev: 'Предыдущая неделя',
    next: 'Следующая неделя',
    current: 'Сегодня',
  }
})
</script>

<template>
  <div class="schedule-toolbar">
    <div class="schedule-toolbar__row">
      <BaseTabs
        v-if="allowMultiView"
        :model-value="view"
        :tabs="viewTabs"
        @update:model-value="$emit('update:view', $event)"
      />

      <PeriodNav
        class="schedule-toolbar__period"
        :label="periodLabel"
        :prev-label="navLabels.prev"
        :next-label="navLabels.next"
        :current-label="navLabels.current"
        with-tooltips
        @prev="$emit('prev-period')"
        @next="$emit('next-period')"
        @current="$emit('go-today')"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.schedule-toolbar__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
}

.schedule-toolbar__period {
  min-width: 0;
}

@include media-phone {
  .schedule-toolbar__row {
    flex-direction: column;
    align-items: stretch;
    gap: $space-3;
  }

  .schedule-toolbar__period {
    width: 100%;
  }
}
</style>
