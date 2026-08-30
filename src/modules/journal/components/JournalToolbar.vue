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
    }
  }
}

@media (max-width: 720px) {
  .journal-toolbar__types {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: $space-1;
    margin-inline: -#{$space-1};
    padding-inline: $space-1;
    max-width: 100%;
  }
}
</style>
