<script setup>
import { BaseButton, BaseCard, BaseIcon } from '@/core/components/ui'

defineProps({
  providers: { type: Array, default: () => [] },
  linked: { type: Object, default: () => ({}) },
})

defineEmits(['toggle'])
</script>

<template>
  <BaseCard padding="md" class="settings-linked">
    <template #title>Связанные аккаунты</template>

    <p class="settings-linked__note">
      Привяжи Яндекс или ВКонтакте — так проще входить. Можно отвязать в любой момент
    </p>

    <ul class="settings-linked__list" role="list">
      <li
        v-for="provider in providers"
        :key="provider.id"
        class="settings-linked__row"
        :class="{ 'settings-linked__row--bound': linked[provider.id] }"
      >
        <span
          class="settings-linked__mark"
          :class="[
            `settings-linked__mark--${provider.id}`,
            { 'settings-linked__mark--bound': linked[provider.id] },
          ]"
          aria-hidden="true"
        >
          <BaseIcon
            :name="provider.illustration"
            :size="40"
          />
        </span>

        <div class="settings-linked__text">
          <span class="settings-linked__name">{{ provider.name }}</span>
          <span class="settings-linked__hint">
            {{ linked[provider.id] ? provider.boundHint : provider.unboundHint }}
          </span>
        </div>

        <BaseButton
          :variant="linked[provider.id] ? 'secondary' : 'primary'"
          size="sm"
          class="settings-linked__action"
          @click="$emit('toggle', provider.id)"
        >
          {{ linked[provider.id] ? provider.unbindLabel : provider.bindLabel }}
        </BaseButton>
      </li>
    </ul>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.settings-linked {
  &__note {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    border-radius: $radius-card;
    background-color: $color-bg-muted;
    border: 1px solid transparent;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease;

    &--bound {
      background-color: $color-success-light;
      border-color: rgba($color-success, 0.28);
    }
  }

  &__mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: $radius-card;
    background: transparent;
    box-shadow: none;
    opacity: 0.72;
    filter: grayscale(0.35);
    transition:
      opacity 0.15s ease,
      filter 0.15s ease,
      box-shadow 0.15s ease;

    &--bound {
      opacity: 1;
      filter: none;
    }

    &--yandex.settings-linked__mark--bound {
      box-shadow: 0 0 0 2px rgba(252, 63, 29, 0.28);
    }

    &--vkontakte.settings-linked__mark--bound {
      box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.28);
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    flex: 1;
    min-width: min(100%, 12rem);
  }

  &__name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__hint {
    font-size: $font-size-sm;
    color: $color-text-muted;
    line-height: $line-height-base;
  }

  &__action {
    flex-shrink: 0;
    margin-left: auto;
  }
}

@media (max-width: 520px) {
  .settings-linked {
    &__action {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
