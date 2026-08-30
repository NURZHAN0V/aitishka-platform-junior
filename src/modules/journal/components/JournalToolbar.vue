<script setup>
import { BaseChip } from '@/core/components/ui'

defineProps({
  typeFilter: { type: String, required: true },
  typeTabs: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:typeFilter'])
</script>

<template>
  <div class="journal-toolbar" aria-label="Журнал">
    <div class="journal-toolbar__types" role="tablist" aria-label="Тип события">
      <BaseChip
        v-for="tab in typeTabs"
        :key="tab.id"
        mode="filter"
        toned
        :variant="tab.chip"
        :active="typeFilter === tab.id"
        :count="tab.count"
        @click="emit('update:typeFilter', tab.id)"
      >
        {{ tab.label }}
      </BaseChip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.journal-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-3;

  &__types {
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
    &__types {
      @include chip-scroll-row;
      width: 100%;
    }
  }
}
</style>
