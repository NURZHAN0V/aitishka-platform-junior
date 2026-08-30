<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'
import {
  BRAND_ILLUSTRATIONS,
  JOURNAL_ILLUSTRATIONS,
  WIDGET_ILLUSTRATIONS,
} from '@/core/constants/illustrations'
import { JOURNAL_WIDGET_MOCK } from '../constants/widgets.js'

const props = defineProps({
  itemsLimit: { type: Number, default: JOURNAL_WIDGET_MOCK.itemsLimit },
  linkHref: { type: String, default: JOURNAL_WIDGET_MOCK.linkHref },
  items: { type: Array, default: () => JOURNAL_WIDGET_MOCK.items },
})

const visibleItems = computed(() => props.items.slice(0, props.itemsLimit))

function gradeVariant(grade) {
  if (grade >= 5) return 'excellent'
  if (grade >= 4) return 'good'
  return 'average'
}

function gradeIllustration(grade) {
  return grade >= 5
    ? JOURNAL_ILLUSTRATIONS.gradeStar
    : JOURNAL_ILLUSTRATIONS.gradeDisc
}
</script>

<template>
  <article class="home-journal-widget">
    <header class="home-journal-widget__header">
      <h2 class="home-journal-widget__title">Журнал</h2>
    </header>

    <div class="home-journal-widget__panel">
      <ul class="home-journal-widget__list">
        <li
          v-for="item in visibleItems"
          :key="item.id"
          class="home-journal-widget__item"
        >
          <span
            class="home-journal-widget__item-icon"
            :class="item.type === 'grade'
              ? `home-journal-widget__item-icon--grade-${gradeVariant(item.grade)}`
              : `home-journal-widget__item-icon--${item.type}`"
          >
            <BaseIcon
              v-if="item.type === 'homework'"
              :name="WIDGET_ILLUSTRATIONS.homeworkNotepad"
              type="avif"
              :size="28"
              label=""
            />
            <BaseIcon
              v-else-if="item.type === 'coins'"
              :name="BRAND_ILLUSTRATIONS.coin"
              type="avif"
              :size="28"
              label=""
            />
            <BaseIcon
              v-else-if="item.type === 'attendance'"
              :name="JOURNAL_ILLUSTRATIONS.attendance"
              type="avif"
              :size="28"
              label=""
            />
            <template v-else-if="item.type === 'grade'">
              <BaseIcon
                :name="gradeIllustration(item.grade)"
                type="avif"
                :size="28"
                label=""
                class="home-journal-widget__grade-bg"
              />
              <span class="home-journal-widget__grade">{{ item.grade }}</span>
            </template>
          </span>

          <span class="home-journal-widget__item-text">{{ item.text }}</span>
          <time class="home-journal-widget__item-date">{{ item.date }}</time>
        </li>
      </ul>
    </div>

    <footer class="home-journal-widget__footer">
      <RouterLink :to="linkHref" class="home-journal-widget__link">Весь журнал →</RouterLink>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-journal-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: $space-4;
  border-radius: $radius-2xl;
  background: $gradient-widget-journal;
  box-shadow: $shadow-md;

  &__header {
    flex-shrink: 0;
    margin-bottom: $space-3;
    @include no-select;
  }

  &__title {
    margin: 0;
    min-width: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: #9a3412;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding: $space-2 $space-3;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    box-shadow: $shadow-sm;
  }

  &__list {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: grid;
    flex: 1;
    grid-template-columns: 32px minmax(0, 1fr) auto;
    align-items: center;
    gap: $space-2;
    min-height: 0;

    & + & {
      border-top: 1px solid $color-border-light;
    }
  }

  &__item-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;

    :deep(.base-icon) {
      flex-shrink: 0;
    }
  }

  &__grade-bg {
    position: absolute;
    inset: 0;
    margin: auto;
  }

  &__grade {
    position: relative;
    z-index: 1;
    font-size: 0.8125rem;
    font-weight: $font-weight-bold;
    line-height: 1;
    color: $color-text-inverse;
    text-shadow: 0 1px 2px rgba(15, 23, 42, 0.35);
  }

  &__item-icon--grade-excellent &__grade {
    color: $color-text-inverse;
  }

  &__item-icon--grade-good &__grade {
    color: $color-text-inverse;
  }

  &__item-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    @include truncate;
  }

  &__item-date {
    font-size: $font-size-xs;
    color: $color-text-muted;
    white-space: nowrap;
  }

  &__footer {
    flex-shrink: 0;
    margin-top: $space-3;
  }

  &__link {
    display: block;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: #c2410c;
    text-align: center;
    text-decoration: none;
    @include no-select;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
