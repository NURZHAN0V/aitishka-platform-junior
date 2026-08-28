<script setup>
import { computed } from 'vue'
import { BaseIcon } from '@/core/components/ui'
import { BRAND_ILLUSTRATIONS, WIDGET_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { STREAKS_WIDGET_MOCK } from '../constants/widgets.js'

const props = defineProps({
  attendance: {
    type: Object,
    default: () => STREAKS_WIDGET_MOCK.attendance,
  },
  punctuality: {
    type: Object,
    default: () => STREAKS_WIDGET_MOCK.punctuality,
  },
  profileBonus: { type: Number, default: STREAKS_WIDGET_MOCK.profileBonus },
  linkHref: { type: String, default: STREAKS_WIDGET_MOCK.linkHref },
})

const streakItems = computed(() => [
  {
    id: 'attendance',
    label: `${props.attendance.current} из ${props.attendance.target} без пропусков`,
    percent: Math.round((props.attendance.current / props.attendance.target) * 100),
  },
  {
    id: 'punctuality',
    label: `${props.punctuality.current} из ${props.punctuality.target} без опозданий`,
    percent: Math.round((props.punctuality.current / props.punctuality.target) * 100),
  },
])
</script>

<template>
  <article class="home-streaks-widget">
    <header class="home-streaks-widget__header">
      <BaseIcon
        :name="BRAND_ILLUSTRATIONS.coin"
        type="avif"
        :size="32"
        class="home-streaks-widget__icon"
        label=""
      />
      <h2 class="home-streaks-widget__title">Серии и монетки</h2>
    </header>

    <div class="home-streaks-widget__panel-wrap">
      <div class="home-streaks-widget__panel">
        <div
          v-for="item in streakItems"
          :key="item.id"
          class="home-streaks-widget__progress"
        >
          <p class="home-streaks-widget__progress-label">{{ item.label }}</p>
          <div class="home-streaks-widget__progress-track" aria-hidden="true">
            <div
              class="home-streaks-widget__progress-fill"
              :style="{ width: `${item.percent}%` }"
            />
          </div>
        </div>

        <a href="#" class="home-streaks-widget__profile-cta" @click.prevent>
          <BaseIcon
            :name="WIDGET_ILLUSTRATIONS.studentBoy"
            type="avif"
            :size="28"
            class="home-streaks-widget__profile-icon"
            label=""
          />
          <span>Заполни профиль — +{{ profileBonus }} монеток</span>
        </a>
      </div>

      <div class="home-streaks-widget__deco" aria-hidden="true">
        <BaseIcon
          :name="WIDGET_ILLUSTRATIONS.treasureChest"
          type="avif"
          :size="128"
          label=""
        />
      </div>
    </div>

    <footer class="home-streaks-widget__footer">
      <a :href="linkHref" class="home-streaks-widget__link">Мои монетки →</a>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-streaks-widget {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: $space-4;
  border-radius: $radius-2xl;
  background: $gradient-widget-streaks;
  color: $color-text-inverse;
  box-shadow: $shadow-md;
  overflow: visible;

  &__header {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-bottom: $space-2;
    @include no-select;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
  }

  &__panel-wrap {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  &__panel {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-4;
    padding: $space-3;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    color: $color-text-primary;
  }

  &__deco {
    position: absolute;
    top: -46px;
    right: -14px;
    z-index: 4;
    width: 38%;
    min-width: 96px;
    max-width: 128px;
    pointer-events: none;

    :deep(.base-icon) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }

    :deep(.base-icon__img) {
      width: 100%;
      height: 100%;
    }
  }

  &__progress {
    padding-right: 22%;

    & + & {
      margin-top: $space-2;
    }
  }

  &__progress-label {
    margin: 0 0 $space-1;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    line-height: $line-height-tight;
    color: $color-text-primary;
  }

  &__progress-track {
    height: 8px;
    overflow: hidden;
    border-radius: $radius-chip;
    background-color: #e2e8f0;
  }

  &__progress-fill {
    height: 100%;
    border-radius: inherit;
    background: #ffd600;
  }

  &__profile-cta {
    display: flex;
    align-items: center;
    gap: $space-2;
    margin-top: auto;
    margin-bottom: 0;
    padding: $space-2 $space-3;
    border-radius: $radius-md;
    background-color: #fff59d;
    color: $color-text-primary;
    @include no-select;
    font-size: 0.6875rem;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    text-decoration: none;
    transition: background-color $transition-fast;

    span {
      @include truncate;
    }

    &:hover {
      background-color: #fff176;
    }
  }

  &__profile-icon {
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    justify-content: center;
    margin-top: $space-3;
    padding-top: 0;
  }

  &__link {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-inverse;
    text-decoration: none;
    opacity: 0.95;
    @include no-select;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
