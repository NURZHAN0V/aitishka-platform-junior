<script setup>
import { computed } from 'vue'
import { BaseButton, BaseChip, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'
import { BRAND_ILLUSTRATIONS } from '@/core/constants/illustrations'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['download', 'upload', 'reupload'])

const illustration = computed(() => useSubjectIllustration(props.item.subject))

function onDownload() {
  emit('download', props.item)
}

function onUpload() {
  emit('upload', props.item.id)
}

function onReupload() {
  emit('reupload', props.item.id)
}
</script>

<template>
  <article
    class="homework-card"
    :class="[`homework-card--${item.status}`]"
    :style="{
      '--subject-color': illustration.color || '#8b5cf6',
      '--subject-bg': `${illustration.color || '#8b5cf6'}29`,
    }"
  >
    <div class="homework-card__summary">
      <span class="homework-card__cover" aria-hidden="true">
        <BaseIcon
          :name="illustration.name"
          type="avif"
          :size="56"
          class="homework-card__subject-icon"
          :label="item.subjectLabel"
        />
      </span>

      <span class="homework-card__main">
        <span class="homework-card__title-row">
          <span class="homework-card__title">{{ item.title }}</span>
          <BaseTooltip :text="item.statusMeta.tooltip" placement="top">
            <BaseChip :variant="item.statusMeta.chip" size="sm">
              {{ item.statusMeta.label }}
            </BaseChip>
          </BaseTooltip>
        </span>

        <dl class="homework-card__facts">
          <div class="homework-card__fact">
            <dt>Тема</dt>
            <dd>{{ item.topic }}</dd>
          </div>
          <div class="homework-card__fact">
            <dt>Предмет</dt>
            <dd>{{ item.subjectLabel }}</dd>
          </div>
          <div class="homework-card__fact">
            <dt>Преподаватель</dt>
            <dd>{{ item.teacher }}</dd>
          </div>
          <div class="homework-card__fact">
            <dt>Выдано</dt>
            <dd>{{ item.issuedLabel }}</dd>
          </div>
        </dl>
      </span>
    </div>

    <div class="homework-card__footer">
      <div class="homework-card__deadline" :class="`homework-card__deadline--${item.deadlineTone}`">
        <BaseIcon name="calendar-03" :size="18" />
        <BaseTooltip
          text="Зелёный — есть запас, жёлтый — 1–2 дня, красный — сегодня или просрочено"
          placement="top"
        >
          <p class="homework-card__deadline-hint">{{ item.deadlineHint }}</p>
        </BaseTooltip>
      </div>

      <p v-if="item.status === 'approved' && item.coinsTotal > 0" class="homework-card__reward">
        <BaseIcon :name="BRAND_ILLUSTRATIONS.coin" type="avif" :size="18" label="" />
        +{{ item.coinsTotal }}
        {{ item.bonusCoins > 0 ? 'бонусных монеток!' : 'монеток' }}
      </p>

      <div class="homework-card__actions">
        <BaseButton
          v-if="item.canDownload"
          variant="secondary"
          size="sm"
          icon="download-01"
          @click="onDownload"
        >
          Скачать
        </BaseButton>

        <template v-if="item.canUpload">
          <BaseButton variant="primary" size="sm" icon="upload-01" @click="onUpload">
            {{ item.status === 'rejected' ? 'Загрузить заново' : 'Загрузить' }}
          </BaseButton>
        </template>

        <div v-else-if="item.canReupload" class="homework-card__uploaded">
          <p class="homework-card__uploaded-label">
            <BaseIcon name="check-circle" :size="18" />
            Работа загружена
          </p>
          <BaseButton variant="link" size="sm" icon="delete-02" @click="onReupload">
            Удалить и загрузить заново
          </BaseButton>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.homework-card {
  @include card-surface;

  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  border: 1px solid $color-border-light;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition-base, border-color $transition-base;

  &:hover {
    border-color: $color-primary-muted;
  }

  &__summary {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    width: 100%;
    padding: $space-4;
  }

  &__cover {
    @include flex-center;
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: $radius-lg;
    background: var(--subject-bg);
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }

  &__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-2 $space-3;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-2 $space-4;
    margin: 0;
  }

  &__fact {
    display: grid;
    gap: 2px;
    min-width: 0;

    dt {
      margin: 0;
      font-size: $font-size-xs;
      color: $color-text-muted;
    }

    dd {
      @include truncate;
      margin: 0;
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-3;
    padding: 0 $space-4 $space-4;
  }

  &__deadline {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    min-width: 0;
    color: $color-text-secondary;

    &--success {
      color: $color-success;
    }

    &--warning {
      color: $color-warning;
    }

    &--danger {
      color: $color-error;
    }
  }

  &__deadline-hint {
    margin: 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: inherit;
  }

  &__reward {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-success;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: $space-2;
    margin-left: auto;
  }

  &__uploaded {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  &__uploaded-label {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-success;
  }
}

@media (max-width: 640px) {
  .homework-card {
    &__summary {
      gap: $space-3;
      padding: $space-3;
    }

    &__cover {
      width: 56px;
      height: 56px;
    }

    &__subject-icon {
      width: 40px !important;
      height: 40px !important;
    }

    &__facts {
      grid-template-columns: 1fr;
    }

    &__footer {
      padding: 0 $space-3 $space-3;
    }

    &__actions {
      width: 100%;
      margin-left: 0;

      :deep(.base-button) {
        flex: 1;
      }
    }

    &__uploaded {
      width: 100%;
      align-items: flex-start;
    }
  }
}
</style>
