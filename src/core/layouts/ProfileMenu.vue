<script setup>
import { onMounted, onUnmounted } from 'vue'
import { NAV_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { BaseIcon } from '@/core/components/ui'

const emit = defineEmits(['close'])

const menuItems = [
  { id: 'profile', label: 'Мой профиль', illustration: NAV_ILLUSTRATIONS.profile, href: '#' },
  { id: 'settings', label: 'Настройки аккаунта', illustration: NAV_ILLUSTRATIONS.settings, href: '#' },
  { id: 'help', label: 'Помощь и поддержка', illustration: NAV_ILLUSTRATIONS.help, href: 'https://itcampsochi.ru/' },
]

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
      <a
        v-for="item in menuItems"
        :key="item.id"
        :href="item.href"
        class="profile-menu__link"
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
      </a>
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
