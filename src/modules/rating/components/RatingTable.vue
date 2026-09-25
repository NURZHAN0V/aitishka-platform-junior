<script setup>
import { computed, reactive, watch } from 'vue'
import { BaseIcon } from '@/core/components/ui'

const props = defineProps({
  groups: { type: Array, default: () => [] },
})

/** Сколько имён видно в свёрнутой группе */
const COLLAPSED_VISIBLE = 5

const expandedByRank = reactive({})

watch(
  () => props.groups.map((group) => group.rank).join(','),
  () => {
    Object.keys(expandedByRank).forEach((key) => {
      delete expandedByRank[key]
    })
  },
)

function needsExpand(group) {
  return group.students.length > COLLAPSED_VISIBLE
}

function isExpanded(rank) {
  return Boolean(expandedByRank[rank])
}

function visibleStudents(group) {
  if (!needsExpand(group) || isExpanded(group.rank)) {
    return group.students
  }
  return group.students.slice(0, COLLAPSED_VISIBLE)
}

function toggleExpand(rank) {
  expandedByRank[rank] = !expandedByRank[rank]
}

const studentCount = computed(() =>
  props.groups.reduce((sum, group) => sum + group.students.length, 0),
)
</script>

<template>
  <div class="rating-table" aria-label="Рейтинг группы">
    <div class="rating-table__header">
      <span>Ученики ({{ studentCount }})</span>
      <span>Прогресс</span>
    </div>

    <ul class="rating-table__list">
      <li
        v-for="group in groups"
        :key="group.rank"
        class="rating-table__row"
        :class="{
          'rating-table__row--first': group.isFirstPlace,
          'rating-table__row--current': group.students.some((s) => s.isCurrent),
        }"
      >
        <button
          v-if="needsExpand(group)"
          type="button"
          class="rating-table__toggle"
          :aria-expanded="isExpanded(group.rank)"
          :aria-label="isExpanded(group.rank) ? 'Свернуть список' : 'Развернуть список'"
          @click="toggleExpand(group.rank)"
        >
          <BaseIcon
            :name="isExpanded(group.rank) ? 'chevron-down' : 'chevron-right'"
            :size="18"
          />
        </button>
        <span v-else class="rating-table__toggle rating-table__toggle--spacer" aria-hidden="true" />

        <span class="rating-table__place">{{ group.rank }}</span>

        <div class="rating-table__body">
          <ul class="rating-table__names">
            <li
              v-for="student in visibleStudents(group)"
              :key="student.id"
              class="rating-table__name"
              :class="{ 'rating-table__name--current': student.isCurrent }"
            >
              {{ student.shortName }}
            </li>
          </ul>
        </div>

        <span class="rating-table__points">
          <template v-if="group.isFirstPlace">✓</template>
          <template v-else>{{ group.completionPercent }}%</template>
        </span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.rating-table {
  &__header {
    display: grid;
    grid-template-columns: 1.75rem 1.75rem minmax(0, 1fr) auto;
    align-items: center;
    gap: $space-2 $space-3;
    padding: 0 $space-3 8px;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-muted;
    border-bottom: 1px solid $color-border-light;

    span:first-child {
      grid-column: 3;
    }

    span:last-child {
      grid-column: 4;
      text-align: right;
    }
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__row {
    display: grid;
    grid-template-columns: 1.75rem 1.75rem minmax(0, 1fr) auto;
    align-items: start;
    column-gap: $space-3;
    row-gap: 0;
    margin-top: 4px;
    padding: $space-3;
    border-radius: $radius-md;
    background: $color-bg-muted;

    &--first {
      background: rgba($color-success, 0.08);
    }

    &--current:not(.rating-table__row--first) {
      background: $color-primary-light;
    }
  }

  &__toggle {
    @include flex-center;

    width: 1.75rem;
    height: 1.75rem;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: $radius-sm;
    background: transparent;
    color: $color-text-muted;
    cursor: pointer;
    line-height: 0;

    &:hover {
      color: $color-primary;
      background: $color-bg-card;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--spacer {
      visibility: hidden;
      pointer-events: none;
    }
  }

  &__place {
    @include flex-center;

    width: 1.75rem;
    height: 1.75rem;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    line-height: 1;
    color: $color-text-primary;
  }

  &__body {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    min-height: 1.75rem;
  }

  &__names {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-2 $space-4;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    line-height: 1.75rem;
    color: $color-text-primary;
    white-space: nowrap;

    &--current {
      color: $color-primary;
    }
  }

  &__points {
    @include flex-center;

    min-width: 2.5rem;
    height: 1.75rem;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: $color-text-primary;
    justify-content: flex-end;
  }

  &__row--current:not(.rating-table__row--first) &__name:not(.rating-table__name--current),
  &__row--current:not(.rating-table__row--first) &__place,
  &__row--current:not(.rating-table__row--first) &__points {
    color: $color-primary;
  }
}
</style>
