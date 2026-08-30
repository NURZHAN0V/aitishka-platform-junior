<script setup>
import { BaseCard } from '@/core/components/ui'
import { SCHOOL_CONTACTS } from '@/modules/help/constants/help.js'

const contacts = SCHOOL_CONTACTS
</script>

<template>
  <BaseCard padding="md" class="help-contacts">
    <template #title>Контакты школы</template>

    <p class="help-contacts__lead">
      Если что-то не получается в дневнике — напишите или позвоните. Мы рядом.
    </p>

    <dl class="help-contacts__list">
      <div class="help-contacts__row">
        <dt>Организация</dt>
        <dd>{{ contacts.org }}</dd>
      </div>
      <div class="help-contacts__row">
        <dt>Школа</dt>
        <dd>{{ contacts.brand }}</dd>
      </div>
      <div class="help-contacts__row">
        <dt>Программа</dt>
        <dd>«{{ contacts.program }}»</dd>
      </div>
      <div class="help-contacts__row">
        <dt>Город</dt>
        <dd>{{ contacts.city }}</dd>
      </div>
      <div class="help-contacts__row">
        <dt>Телефон</dt>
        <dd>
          <a class="help-contacts__link" :href="contacts.phone.href">
            {{ contacts.phone.label }}
          </a>
        </dd>
      </div>
      <div class="help-contacts__row">
        <dt>Почта</dt>
        <dd>
          <a class="help-contacts__link" :href="contacts.email.href">
            {{ contacts.email.label }}
          </a>
        </dd>
      </div>
      <div class="help-contacts__row">
        <dt>Сайт</dt>
        <dd>
          <a
            class="help-contacts__link"
            :href="contacts.website.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ contacts.website.label }}
          </a>
        </dd>
      </div>
    </dl>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.help-contacts {
  &__lead {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-muted;
    line-height: $line-height-base;
  }

  &__list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: $space-2 $space-4;
    padding: $space-3 $space-4;
    border-radius: $radius-card;
    background-color: $color-bg-muted;

    dt {
      flex: 0 0 7.5rem;
      margin: 0;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: $color-text-muted;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    dd {
      margin: 0;
      flex: 1;
      min-width: 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      word-break: break-word;
    }
  }

  &__link {
    color: $color-text-link;
    text-decoration: none;
    font-weight: $font-weight-semibold;

    &:hover {
      color: $color-text-link-hover;
      text-decoration: underline;
    }
  }
}
</style>
