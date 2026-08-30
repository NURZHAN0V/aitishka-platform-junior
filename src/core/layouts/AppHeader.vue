<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import ProfileMenu from './ProfileMenu.vue'
import { BaseAvatar, BaseBadgeWrapper, BaseIcon } from '@/core/components/ui'

const props = defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  greeting: {
    type: Boolean,
    default: false,
  },
  coins: {
    type: Number,
    default: 0,
  },
  user: {
    type: Object,
    default: () => ({
      name: '',
      group: '',
      avatar: '',
    }),
  },
})

const firstName = computed(() => props.user.name.trim().split(/\s+/)[0] || 'студент')

const profileOpen = ref(false)
const profileRef = ref(null)

let closeTimer = null
let suppressHoverOpen = false

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function openProfile() {
  if (suppressHoverOpen) return
  clearCloseTimer()
  profileOpen.value = true
}

function scheduleCloseProfile() {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    profileOpen.value = false
  }, 180)
}

function toggleProfile() {
  clearCloseTimer()

  if (profileOpen.value) {
    profileOpen.value = false
    suppressHoverOpen = true
    setTimeout(() => {
      suppressHoverOpen = false
    }, 250)
    return
  }

  profileOpen.value = true
}

function closeProfile() {
  clearCloseTimer()
  profileOpen.value = false
}

function onClickOutside(event) {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    closeProfile()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  clearCloseTimer()
})
</script>

<template>
  <header class="app-header">
    <h1 v-if="greeting" class="app-header__greeting">
      Привет, {{ firstName }}! 👋
    </h1>
    <nav v-else-if="breadcrumbs.length" class="app-header__breadcrumbs" aria-label="Хлебные крошки">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <span v-if="index > 0" class="app-header__sep">→</span>
        <RouterLink
          v-if="crumb.href"
          :to="crumb.href"
          class="app-header__crumb app-header__crumb--link"
        >
          {{ crumb.label }}
        </RouterLink>
        <span v-else class="app-header__crumb">{{ crumb.label }}</span>
      </template>
    </nav>
    <div v-else class="app-header__spacer" />

    <div class="app-header__actions">
      <BaseBadgeWrapper
        :count="0"
        variant="coin"
        position="top-right"
        class="app-header__action-wrap"
      >
        <RouterLink to="/market" class="app-header__coins app-header__action-block">
          <BaseIcon name="coin-single" type="avif" :size="28" class="app-header__coins-icon" />
          <span class="app-header__coins-value">{{ coins }} монеток</span>
        </RouterLink>
      </BaseBadgeWrapper>

      <div
        ref="profileRef"
        class="app-header__profile"
        @mouseenter="openProfile"
        @mouseleave="scheduleCloseProfile"
      >
        <button
          type="button"
          class="app-header__profile-trigger app-header__action-block"
          :class="{ 'app-header__profile-trigger--open': profileOpen }"
          :aria-expanded="profileOpen"
          aria-haspopup="menu"
          @click.stop="toggleProfile"
        >
          <BaseAvatar :name="user.name" :src="user.avatar" size="sm" status="online" />
          <span class="app-header__profile-info">
            <span class="app-header__name">{{ user.name }}</span>
            <span class="app-header__group">{{ user.group }}</span>
          </span>
          <BaseIcon
            name="chevron-down"
            :size="18"
            class="app-header__chevron"
            :class="{ 'app-header__chevron--open': profileOpen }"
          />
        </button>
        <ProfileMenu
          v-if="profileOpen"
          class="app-header__menu"
          @close="closeProfile"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-4;
  min-height: $header-height;
  padding: $space-4 $space-6;
  flex-shrink: 0;

  &__greeting {
    margin: 0;
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    line-height: $line-height-tight;
    color: $color-text-primary;
    @include no-select;
  }

  &__breadcrumbs {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: $space-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    @include no-select;
  }

  &__sep {
    color: $color-text-muted;
  }

  &__crumb--link {
    color: $color-text-link;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__spacer {
    flex: 1;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-5;
  }

  &__action-wrap {
    display: flex;
  }

  &__action-block {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: $radius-md;
  }

  &__coins {
    gap: 2px;
    padding: $space-1 $space-2;
    border: 1px solid #fde68a;
    background-color: #fffbeb;
    color: $color-text-primary;
    text-decoration: none;
    transition: background-color $transition-base, border-color $transition-base;
    @include no-select;

    &:hover {
      background-color: $color-coin-light;
      border-color: #facc15;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__coins-icon {
    flex-shrink: 0;
  }

  &__coins-value {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &__profile {
    position: relative;
    display: flex;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      height: $space-2;
    }
  }

  &__profile-trigger {
    gap: $space-3;
    padding: $space-1 $space-2;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;

    &:hover,
    &--open {
      .app-header__name {
        color: $color-primary;
      }
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__profile-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  &__name {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    transition: color $transition-base;
  }

  &__group {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__chevron {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + #{$space-2});
    right: 0;
    z-index: 100;
  }
}
</style>
