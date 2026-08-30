<script setup>
import { BaseChip } from '@/core/components/ui'

defineProps({
  directionFilter: { type: String, required: true },
  filterTabs: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:directionFilter'])
</script>

<template>
  <div class="coins-history-toolbar">
    <h2 class="coins-history-toolbar__title">История</h2>
    <div class="coins-history-toolbar__filters" role="tablist" aria-label="Тип операций">
      <BaseChip
        v-for="tab in filterTabs"
        :key="tab.id"
        mode="filter"
        toned
        :variant="tab.chip"
        :active="directionFilter === tab.id"
        :count="tab.count"
        @click="emit('update:directionFilter', tab.id)"
      >
        {{ tab.label }}
      </BaseChip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.coins-history-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-3;

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;

    :deep(.base-chip) {
      flex-shrink: 0;
      min-height: $touch-target-min;
    }
  }

  @include media-tablet-down {
    flex-direction: column;
    align-items: stretch;

    &__filters {
      @include chip-scroll-row;
      width: 100%;
    }
  }
}
</style>
