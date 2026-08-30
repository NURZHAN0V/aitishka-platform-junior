<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { BaseIcon } from '@/core/components/ui'

const props = defineProps({
  item: { type: Object, required: true },
})

const isLink = computed(() => Boolean(props.item.href))
const icon = computed(() => props.item.typeMeta.icon)
</script>

<template>
  <component
    :is="isLink ? RouterLink : 'article'"
    class="coins-history-item"
    :class="[
      `coins-history-item--${item.direction}`,
      { 'coins-history-item--link': isLink },
    ]"
    :to="isLink ? item.href : undefined"
  >
    <span
      class="coins-history-item__icon"
      :class="`coins-history-item__icon--${item.direction}`"
    >
      <BaseIcon
        :name="icon.name"
        :type="icon.type"
        :size="icon.type === 'avif' ? 28 : 20"
        label=""
      />
    </span>

    <span class="coins-history-item__body">
      <span class="coins-history-item__title">{{ item.title }}</span>
      <span v-if="item.context" class="coins-history-item__context">{{ item.context }}</span>
    </span>

    <span class="coins-history-item__meta">
      <span
        class="coins-history-item__amount"
        :class="`coins-history-item__amount--${item.direction}`"
      >
        {{ item.amountMeta.label }}
      </span>
      <time class="coins-history-item__date" :datetime="item.at">{{ item.dateLabel }}</time>
    </span>
  </component>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.coins-history-item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-card;
  background-color: $color-bg-card;
  box-shadow: $shadow-sm;
  text-decoration: none;
  color: inherit;
  border: 1px solid transparent;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &--link {
    cursor: pointer;

    &:hover {
      border-color: $color-border;
      box-shadow: $shadow-md;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: $radius-lg;
    background-color: $color-coin-light;
    color: #d97706;

    &--spend {
      background-color: rgba(249, 115, 22, 0.12);
      color: #ea580c;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  &__context {
    font-size: $font-size-sm;
    color: $color-text-muted;
    @include truncate;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }

  &__amount {
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    white-space: nowrap;

    &--earn {
      color: $color-success;
    }

    &--spend {
      color: #ea580c;
    }
  }

  &__date {
    font-size: $font-size-xs;
    color: $color-text-muted;
    white-space: nowrap;
  }
}

@media (max-width: 560px) {
  .coins-history-item {
    grid-template-columns: 40px minmax(0, 1fr);
    grid-template-rows: auto auto;
    gap: $space-2 $space-3;

    &__meta {
      grid-column: 2;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
</style>
