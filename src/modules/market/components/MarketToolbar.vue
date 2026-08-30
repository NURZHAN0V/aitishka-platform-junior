<script setup>
import { BaseChip, BaseSelect } from '@/core/components/ui'

defineProps({
  categoryFilter: { type: String, required: true },
  categoryTabs: { type: Array, default: () => [] },
  sortBy: { type: String, required: true },
  sortOptions: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:categoryFilter', 'update:sortBy'])
</script>

<template>
  <div class="market-toolbar">
    <div class="market-toolbar__filters">
      <div class="market-toolbar__categories" role="tablist" aria-label="Категории товаров">
        <BaseChip
          v-for="tab in categoryTabs"
          :key="tab.id"
          mode="filter"
          toned
          :variant="tab.chip"
          :active="categoryFilter === tab.id"
          @click="emit('update:categoryFilter', tab.id)"
        >
          {{ tab.label }}
        </BaseChip>
      </div>

      <div class="market-toolbar__sort">
        <BaseSelect
          :model-value="sortBy"
          :options="sortOptions"
          id="market-sort"
          aria-label="Сортировка"
          @update:model-value="emit('update:sortBy', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.market-toolbar {
  display: flex;
  flex-direction: column;
  gap: $space-5;

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-3 $space-4;
  }

  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;

    :deep(.base-chip) {
      flex-shrink: 0;
    }
  }

  &__sort {
    flex-shrink: 0;
    width: min(220px, 100%);
    margin-left: auto;
  }
}

@media (max-width: 720px) {
  .market-toolbar {
    gap: $space-4;

    &__categories {
      @include chip-scroll-row;
      width: 100%;

      :deep(.base-chip) {
        min-height: $touch-target-min;
      }
    }

    &__sort {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
