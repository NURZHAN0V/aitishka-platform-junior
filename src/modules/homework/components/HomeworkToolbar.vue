<script setup>
import { BaseChip, BaseSelect, BaseTooltip } from '@/core/components/ui'
import { SUBJECT_OPTIONS } from '../constants/homework.js'

defineProps({
  statusFilter: { type: String, required: true },
  statusTabs: { type: Array, default: () => [] },
  subjectFilter: { type: String, required: true },
})

const emit = defineEmits(['update:statusFilter', 'update:subjectFilter'])
</script>

<template>
  <div class="homework-toolbar" aria-label="Домашние задания">
    <div class="homework-toolbar__statuses" role="tablist" aria-label="Статусы домашних заданий">
      <BaseTooltip v-for="tab in statusTabs" :key="tab.id" :text="tab.tooltip" placement="top">
        <BaseChip
          mode="filter"
          toned
          :variant="tab.chip"
          :active="statusFilter === tab.id"
          :count="tab.count"
          @click="emit('update:statusFilter', tab.id)"
        >
          {{ tab.label }}
        </BaseChip>
      </BaseTooltip>
    </div>

    <div class="homework-toolbar__subject">
      <BaseSelect
        :model-value="subjectFilter"
        :options="SUBJECT_OPTIONS"
        id="homework-subject-filter"
        aria-label="Предмет"
        @update:model-value="emit('update:subjectFilter', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.homework-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-3 $space-4;

  &__statuses {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;

    :deep(.base-chip) {
      flex-shrink: 0;
      min-height: $touch-target-min;
    }
  }

  &__subject {
    flex-shrink: 0;
    width: min(220px, 100%);
    margin-left: auto;
  }

  @include media-tablet-down {
    &__statuses {
      @include chip-scroll-row;
      width: 100%;
    }

    &__subject {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
