<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseAvatar, BaseCard, BaseIcon } from '@/core/components/ui'
import { SETTINGS_PAGE_LINK } from '@/modules/profile/constants/profile.js'

const props = defineProps({
  fullName: { type: String, required: true },
  school: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  birthDateLabel: { type: String, default: '' },
  /** Identity header (photo + fields) — merged on «Мой профиль» */
  group: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  showIdentity: { type: Boolean, default: true },
})

/** Label is «Группа», so strip a leading «Группа » from stored value (e.g. header string). */
const groupFieldValue = computed(() => {
  const raw = (props.group || '').trim()
  if (!raw) return '—'
  return raw.replace(/^Группа\s+/i, '') || '—'
})
</script>

<template>
  <BaseCard padding="md" class="profile-fields">
    <div
      class="profile-fields__layout"
      :class="{ 'profile-fields__layout--with-avatar': showIdentity }"
    >
      <RouterLink
        v-if="showIdentity"
        :to="SETTINGS_PAGE_LINK"
        class="profile-fields__avatar-link"
        aria-label="Изменить фото или аватарку в настройках аккаунта"
      >
        <BaseAvatar
          :src="avatarUrl"
          :name="fullName"
          size="2xl"
          class="profile-fields__avatar"
        />
        <span class="profile-fields__avatar-overlay" aria-hidden="true">
          <BaseIcon name="pencil-edit-02" :size="28" class="profile-fields__avatar-edit" />
        </span>
      </RouterLink>

      <div class="profile-fields__data">
        <dl class="profile-fields__list">
          <div class="profile-fields__row">
            <dt class="profile-fields__label">ФИО</dt>
            <dd class="profile-fields__value">{{ fullName }}</dd>
          </div>

          <div class="profile-fields__row">
            <dt class="profile-fields__label">Группа</dt>
            <dd class="profile-fields__value">{{ groupFieldValue }}</dd>
          </div>

          <div class="profile-fields__row">
            <dt class="profile-fields__label">Школа</dt>
            <dd class="profile-fields__value">{{ school || '—' }}</dd>
          </div>

          <div class="profile-fields__row">
            <dt class="profile-fields__label">Телефон</dt>
            <dd class="profile-fields__value">{{ phone || '—' }}</dd>
          </div>

          <div class="profile-fields__row">
            <dt class="profile-fields__label">Почта</dt>
            <dd class="profile-fields__value">{{ email || '—' }}</dd>
          </div>

          <div class="profile-fields__row">
            <dt class="profile-fields__label">Дата рождения</dt>
            <dd class="profile-fields__value">{{ birthDateLabel || '—' }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.profile-fields[class] {
  border: none;
  box-shadow: none;
}

.profile-fields {
  &__layout {
    display: flex;
    flex-direction: column;
    gap: $space-5;
    min-width: 0;

    &--with-avatar {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: stretch;
      gap: $space-6;
    }
  }

  &__avatar-link {
    position: relative;
    display: block;
    /* Height comes from the fields column; width follows via aspect-ratio.
       height:0 + min-height:100% keeps this cell from expanding the row. */
    align-self: stretch;
    height: 0;
    min-height: 100%;
    width: auto;
    aspect-ratio: 1;
    max-width: 100%;
    border-radius: $radius-lg;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    outline: none;
    transition: transform $transition-fast;

    &:hover {
      transform: translateY(-1px);

      .profile-fields__avatar-overlay {
        opacity: 1;
      }
    }

    &:focus-visible {
      @include focus-ring;
    }

    :deep(.base-avatar--2xl) {
      width: 100%;
      height: 100%;
      aspect-ratio: unset;
    }
  }

  &__avatar {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__avatar-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-lg;
    background: $color-bg-overlay;
    color: $color-text-inverse;
    opacity: 0;
    transition: opacity $transition-fast;
    pointer-events: none;
  }

  &__avatar-edit {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }

  &__data {
    flex: 1;
    min-width: 0;
  }

  &__list {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  &__row {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: $space-3;
    align-items: center;
    padding: $space-3 0;
    border-top: 1px solid $color-border-light;

    &:first-of-type {
      border-top: none;
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }

  &__label {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  &__value {
    margin: 0;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    min-width: 0;
    word-break: break-word;
  }
}

@media (max-width: 560px) {
  .profile-fields {
    &__layout--with-avatar {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: $space-4;
    }

    &__avatar-link {
      height: auto;
      min-height: 0;
      width: 144px;
      aspect-ratio: 1;
      align-self: flex-start;

      :deep(.base-avatar--2xl) {
        width: 100%;
        height: 100%;
      }
    }

    &__avatar {
      width: 100%;
      height: 100%;
    }

    &__row {
      grid-template-columns: 1fr;
      gap: $space-1;
    }
  }
}
</style>
