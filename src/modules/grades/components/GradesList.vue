<script setup>
import { computed } from 'vue'
import { BaseCard, BaseChip, BaseIcon } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'
import GradeCard from './GradeCard.vue'

const props = defineProps({
  viewMode: { type: String, required: true },
  grades: { type: Array, default: () => [] },
  subjectSummaries: { type: Array, default: () => [] },
  expandedGradeId: { type: String, default: null },
  isEmptyPeriod: { type: Boolean, default: false },
  isEmptyFilter: { type: Boolean, default: false },
})

defineEmits(['toggle-grade'])

const emptyTitle = computed(() => {
  if (props.isEmptyFilter) return 'Нет оценок по выбранным фильтрам'
  return 'За этот период оценок нет'
})

const emptyHint = computed(() => {
  if (props.isEmptyFilter) return 'Сбросьте предмет или тип работы — или выберите другой период.'
  return 'Попробуйте соседний день, неделю или месяц.'
})

function subjectIcon(subject) {
  return useSubjectIllustration(subject)
}
</script>

<template>
  <section class="grades-list" aria-label="Список оценок">
    <BaseCard v-if="isEmptyPeriod || isEmptyFilter" padding="md" class="grades-list__empty">
      <p class="grades-list__empty-title">{{ emptyTitle }}</p>
      <p class="grades-list__empty-hint">{{ emptyHint }}</p>
    </BaseCard>

    <template v-else-if="viewMode === 'summary'">
      <div class="grades-list__summary-grid">
        <article
          v-for="row in subjectSummaries"
          :key="row.subject"
          class="grades-list__subject"
          :style="{ '--subject-color': subjectIcon(row.subject).color || '#8b5cf6' }"
        >
          <span class="grades-list__subject-stripe" aria-hidden="true" />
          <BaseIcon
            :name="subjectIcon(row.subject).name"
            type="avif"
            :size="40"
            :label="row.title"
          />
          <div class="grades-list__subject-main">
            <h3 class="grades-list__subject-title">{{ row.title }}</h3>
            <p class="grades-list__subject-meta">
              {{ row.count }} оценок
              <template v-if="row.latest">
                · последняя {{ row.latest.dateShort || row.latest.dateLabel }}
              </template>
            </p>
            <div v-if="row.latest?.statusMeta?.length" class="grades-list__subject-chips">
              <BaseChip
                v-for="status in row.latest.statusMeta"
                :key="status.id"
                :variant="status.chip"
                size="sm"
              >
                {{ status.label }}
              </BaseChip>
            </div>
          </div>
          <p
            class="grades-list__subject-avg"
            :class="`grades-list__subject-avg--${row.tone}`"
          >
            {{ row.averageLabel }}
          </p>
        </article>
      </div>
    </template>

    <div v-else class="grades-list__cards">
      <GradeCard
        v-for="grade in grades"
        :key="grade.id"
        :grade="grade"
        :expanded="expandedGradeId === grade.id"
        @toggle="$emit('toggle-grade', $event)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.grades-list {
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

  &__cards {
    display: flex;
    flex-direction: column;
    gap: $space-3;
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
    padding: $space-4;
    border: 1px solid $color-border-light;
    box-shadow: $shadow-sm;
    transition: border-color $transition-base, box-shadow $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      box-shadow: $shadow-card;
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

@media (max-width: 800px) {
  .grades-list__summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
