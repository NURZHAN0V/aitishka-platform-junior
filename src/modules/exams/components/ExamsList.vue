<script setup>
import { computed } from 'vue'
import { BaseCard, BaseChip, BaseIcon } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'
import ExamCard from './ExamCard.vue'

const props = defineProps({
  viewMode: { type: String, required: true },
  items: { type: Array, default: () => [] },
  subjectSummaries: { type: Array, default: () => [] },
  expandedId: { type: String, default: null },
  isEmptyPeriod: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
})

defineEmits(['toggle', 'download', 'upload', 'view-work', 'open-subject'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Нет экзаменов по выбранным фильтрам'
  return 'За этот период экзаменов нет'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) {
    return 'Сбросьте предмет или статус — или откройте «Весь период обучения».'
  }
  return 'Попробуйте соседний месяц или весь период обучения.'
})

function subjectIcon(subject) {
  return useSubjectIllustration(subject)
}
</script>

<template>
  <section class="exams-list" aria-label="Список экзаменов">
    <BaseCard v-if="isEmptyPeriod || isEmptyFilter" padding="md" class="exams-list__empty">
      <p class="exams-list__empty-title">{{ emptyTitle }}</p>
      <p class="exams-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <template v-else-if="viewMode === 'summary'">
      <div class="exams-list__summary-grid">
        <button
          v-for="row in subjectSummaries"
          :key="row.subject"
          type="button"
          class="exams-list__subject"
          :style="{ '--subject-color': subjectIcon(row.subject).color || '#8b5cf6' }"
          @click="$emit('open-subject', row.subject)"
          title="Открыть экзамены предмета"
        >
          <span class="exams-list__subject-stripe" aria-hidden="true" />
          <BaseIcon
            :name="subjectIcon(row.subject).name"
            type="avif"
            :size="40"
            :label="row.title"
          />
          <div class="exams-list__subject-main">
            <h3 class="exams-list__subject-title">{{ row.title }}</h3>
            <p class="exams-list__subject-meta">
              {{ row.count }} экзаменов
              <template v-if="row.openCount">
                · {{ row.openCount }} можно сдать
              </template>
              <template v-else-if="row.nearest">
                · ближайший до {{ row.nearest.deadlineLabel }}
              </template>
            </p>
            <div class="exams-list__subject-chips">
              <BaseChip
                v-if="row.urgency"
                :variant="row.urgency.tone === 'danger' ? 'overdue' : 'pending'"
                size="sm"
              >
                {{ row.urgency.label }}
              </BaseChip>
              <BaseChip
                v-if="row.latest"
                :variant="row.latest.statusMeta.chip"
                size="sm"
              >
                {{ row.latest.statusMeta.label }}
              </BaseChip>
            </div>
          </div>
          <p
            class="exams-list__subject-avg"
            :class="`exams-list__subject-avg--${row.tone}`"
          >
            {{ row.averageLabel }}
          </p>
        </button>
      </div>
    </template>

    <div v-else class="exams-list__grid">
      <ExamCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :expanded="expandedId === item.id"
        @toggle="$emit('toggle', $event)"
        @download="$emit('download', $event)"
        @upload="$emit('upload', $event)"
        @view-work="$emit('view-work', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exams-list {
  &__empty {
    text-align: center;
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

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-4;
  }

  &__summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-3;
  }

  &__subject {
    @include card-surface;

    position: relative;
    display: flex;
    align-items: center;
    gap: $space-4;
    overflow: hidden;
    width: 100%;
    padding: $space-4;
    border: 1px solid $color-border-light;
    box-shadow: $shadow-sm;
    background: $color-bg-card;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      box-shadow: $shadow-card;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__subject-stripe {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--subject-color);
  }

  &__subject-main {
    flex: 1;
    min-width: 0;
  }

  &__subject-title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__subject-meta {
    margin: $space-1 0 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__subject-chips {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    margin-top: $space-2;
  }

  &__subject-avg {
    margin: 0;
    min-width: 2.75rem;
    text-align: center;
    font-size: 1.75rem;
    font-weight: $font-weight-bold;
    line-height: 1;

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
}

@media (max-width: 960px) {
  .exams-list__grid,
  .exams-list__summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
