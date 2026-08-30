<script setup>
import { BaseChip, BaseSelect, BaseTooltip } from '@/core/components/ui'
import { SUBJECT_OPTIONS } from '../constants/exams.js'

defineProps({
  subjectFilter: { type: String, required: true },
  statusFilter: { type: String, required: true },
  statusTabs: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:subjectFilter', 'update:statusFilter'])
</script>

<template>
  <div class="exams-toolbar">
    <div class="exams-toolbar__filters" aria-label="Экзамены">
      <div class="exams-toolbar__statuses" role="tablist" aria-label="Статусы экзаменов">
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

      <div class="exams-toolbar__subject">
        <BaseSelect
          :model-value="subjectFilter"
          :options="SUBJECT_OPTIONS"
          id="exams-subject-filter"
          aria-label="Предмет"
          @update:model-value="emit('update:subjectFilter', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exams-toolbar {
  display: flex;
  flex-direction: column;
  gap: $space-4;

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-3 $space-4;
  }

  &__statuses {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    min-width: 0;

    :deep(.base-chip) {
      flex-shrink: 0;
    }
  }

  &__subject {
    flex-shrink: 0;
    width: min(220px, 100%);
    margin-left: auto;
  }
}

@media (max-width: 720px) {
  .exams-toolbar__statuses {
    @include chip-scroll-row;
    width: 100%;

    :deep(.base-chip) {
      min-height: $touch-target-min;
    }
  }

  .exams-toolbar__subject {
    width: 100%;
    margin-left: 0;
  }
}
</style>
