<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { NAV_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { REVIEWS_PAGE_LINK } from '@/modules/reviews/constants/reviews.js'
import { PROFILE_PAGE_LINK, SETTINGS_PAGE_LINK } from '@/modules/profile/constants/profile.js'
import { HELP_PAGE_LINK } from '@/modules/help/constants/help.js'
import { BaseIcon } from '@/core/components/ui'

const emit = defineEmits(['close'])
const route = useRoute()

const menuItems = [
  {
    id: 'profile',
    label: 'Мой профиль',
    illustration: NAV_ILLUSTRATIONS.profile,
    href: PROFILE_PAGE_LINK,
    routeName: 'profile',
  },
  {
    id: 'reviews',
    label: 'Мои отзывы',
    illustration: NAV_ILLUSTRATIONS.reviews,
    href: REVIEWS_PAGE_LINK,
    routeName: 'reviews',
  },
  {
    id: 'settings',
    label: 'Настройки аккаунта',
    illustration: NAV_ILLUSTRATIONS.settings,
    href: SETTINGS_PAGE_LINK,
    routeName: 'settings',
  },
  {
    id: 'help',
    label: 'Помощь и поддержка',
    illustration: NAV_ILLUSTRATIONS.help,
    href: HELP_PAGE_LINK,
    routeName: 'help',
  },
]

function isInternalHref(href) {
  return typeof href === 'string' && href.startsWith('/')
}

function isItemActive(item) {
  if (item.routeName) {
    return route.name === item.routeName
  }
  return isInternalHref(item.href) && route.path === item.href
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="profile-menu" @click.stop>
    <nav class="profile-menu__nav" aria-label="Меню профиля">
      <component
        :is="isInternalHref(item.href) ? RouterLink : 'a'"
        v-for="item in menuItems"
        :key="item.id"
        v-bind="isInternalHref(item.href) ? { to: item.href } : { href: item.href }"
        class="profile-menu__link"
        :class="{ 'profile-menu__link--active': isItemActive(item) }"
        @click="emit('close')"
      >
        <span class="profile-menu__icon-slot">
          <BaseIcon
            :name="item.illustration"
            type="avif"
            :size="36"
            class="profile-menu__icon"
            :label="item.label"
          />
        </span>
        {{ item.label }}
      </component>
    </nav>

    <footer class="profile-menu__footer">
      <button type="button" class="profile-menu__logout" @click="emit('close')">
        <span class="profile-menu__icon-slot">
          <BaseIcon
            :name="NAV_ILLUSTRATIONS.logout"
            type="avif"
            :size="36"
            class="profile-menu__icon"
            label="Выйти из аккаунта"
          />
        </span>
        Выйти из аккаунта
      </button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.profile-menu {
  width: 280px;
  padding: $space-2;
  border-radius: $radius-xl;
  background-color: $color-bg-card;
  box-shadow: $shadow-lg;
  border: 1px solid $color-border-light;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    padding: $space-1 0;
  }

  &__link,
  &__logout {
    display: flex;
    align-items: center;
    gap: $space-3;
    height: 48px;
    padding: 0 $space-4;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    transition: background-color $transition-fast;
  }

  &__link {
    color: $color-text-primary;
    text-decoration: none;

    &:hover {
      background-color: $color-bg-muted;
    }

    &--active {
      background-color: $color-primary-light;
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
  }

  &__icon-slot {
    @include flex-center;

    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__footer {
    padding-top: $space-2;
    border-top: 1px solid $color-border-light;
  }

  &__logout {
    width: 100%;
    border: none;
    background: transparent;
    color: $color-error;
    font-family: inherit;
    font-weight: $font-weight-medium;
    cursor: pointer;

    &:hover {
      background-color: $color-error-light;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
