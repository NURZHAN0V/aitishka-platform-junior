<script setup>
import { computed } from 'vue'
import { BaseButton, BaseChip, BaseIcon, BaseTooltip } from '@/core/components/ui'
import { useSubjectIllustration } from '@/core/composables/useSubjectIllustration'

const props = defineProps({
  item: { type: Object, required: true },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle', 'download', 'upload', 'view-work'])

const illustration = computed(() => useSubjectIllustration(props.item.subject))

function onToggle() {
  emit('toggle', props.item.id)
}

function onDownload() {
  emit('download', props.item)
}

function onUpload() {
  if (!props.item.canUpload) return
  emit('upload', props.item.id)
}

function onViewWork() {
  emit('view-work', props.item)
}
</script>

<template>
  <article
    class="exam-card"
    :class="{
      'exam-card--expanded': expanded,
      [`exam-card--${item.status}`]: true,
      'exam-card--critical': item.urgency?.id === 'critical',
      'exam-card--approaching': item.urgency?.id === 'approaching',
    }"
    :style="{
      '--subject-color': illustration.color || '#8b5cf6',
      '--subject-bg': `${illustration.color || '#8b5cf6'}29`,
    }"
  >
    <button
      type="button"
      class="exam-card__summary"
      :aria-expanded="expanded"
      @click="onToggle"
    >
      <span class="exam-card__cover" aria-hidden="true">
        <BaseIcon
          :name="illustration.name"
          type="avif"
          :size="56"
          class="exam-card__subject-icon"
          :label="item.subjectLabel"
        />
      </span>

      <span class="exam-card__main">
        <span class="exam-card__title-row">
          <span class="exam-card__title">{{ item.title }}</span>
          <span class="exam-card__chips">
            <BaseTooltip :text="item.statusMeta.tooltip" placement="top">
              <BaseChip :variant="item.statusMeta.chip" size="sm">
                {{ item.statusMeta.label }}
              </BaseChip>
            </BaseTooltip>
            <BaseTooltip v-if="item.urgency" :text="item.urgency.tooltip" placement="top">
              <BaseChip
                :variant="item.urgency.tone === 'danger' ? 'overdue' : 'pending'"
                size="sm"
              >
                {{ item.urgency.label }}
              </BaseChip>
            </BaseTooltip>
          </span>
        </span>

        <dl class="exam-card__facts">
          <div class="exam-card__fact">
            <dt>Предмет</dt>
            <dd>{{ item.subjectLabel }}</dd>
          </div>
          <div class="exam-card__fact">
            <dt>Преподаватель</dt>
            <dd>{{ item.teacher }}</dd>
          </div>
          <div class="exam-card__fact">
            <dt>Оценка</dt>
            <dd :class="`exam-card__grade exam-card__grade--${item.tone}`">
              {{ item.grade == null ? '—' : `${item.grade} · ${item.gradeTitle}` }}
            </dd>
          </div>
          <div class="exam-card__fact">
            <dt>Дата проверки</dt>
            <dd>{{ item.reviewedLabel || item.reviewLabel }}</dd>
          </div>
        </dl>
      </span>

      <span
        class="exam-card__score"
        :class="`exam-card__score--${item.tone}`"
        :title="item.gradeTitle"
      >
        {{ item.gradeLabel }}
      </span>

      <BaseIcon
        name="chevron-down"
        :size="18"
        class="exam-card__chevron"
        :class="{ 'exam-card__chevron--open': expanded }"
      />
    </button>

    <div class="exam-card__footer">
      <div class="exam-card__deadline" :class="`exam-card__deadline--${item.deadlineTone}`">
        <BaseIcon name="calendar-03" :size="18" />
        <div>
          <p class="exam-card__deadline-date">
            {{
              item.status === 'checked' || item.status === 'uploaded'
                ? `Конечная дата: ${item.deadlineLabel}`
                : `До ${item.deadlineLabel}`
            }}
          </p>
          <BaseTooltip
            text="Зелёный — есть запас, жёлтый — 1–2 дня, красный — сегодня или срок прошёл"
            placement="top"
          >
            <p class="exam-card__deadline-hint">{{ item.deadlineHint }}</p>
          </BaseTooltip>
        </div>
      </div>

      <div class="exam-card__actions" @click.stop>
        <BaseButton
          v-if="item.canDownload"
          variant="secondary"
          size="sm"
          icon="download-01"
          @click="onDownload"
        >
          Скачать
        </BaseButton>

        <BaseButton
          v-if="item.canViewWork"
          variant="secondary"
          size="sm"
          icon="eye"
          @click="onViewWork"
        >
          Открыть работу
        </BaseButton>

        <template v-if="item.canUpload">
          <BaseButton variant="primary" size="sm" icon="upload-01" @click="onUpload">
            Загрузить
          </BaseButton>
        </template>

        <BaseTooltip
          v-else-if="!item.canViewWork"
          :text="item.uploadDisabledReason || 'Загрузка недоступна'"
          placement="top"
        >
          <BaseButton variant="primary" size="sm" icon="upload-01" disabled>
            Загрузить
          </BaseButton>
        </BaseTooltip>

        <p v-if="item.status === 'uploaded'" class="exam-card__uploaded-label">
          <BaseIcon name="check-circle" :size="18" />
          Работа загружена
        </p>
      </div>
    </div>

    <div v-if="expanded" class="exam-card__details">
      <div v-if="item.program" class="exam-card__block">
        <p class="exam-card__details-label">Программа</p>
        <p class="exam-card__description">{{ item.program }}</p>
      </div>

      <div v-if="item.materials?.length" class="exam-card__materials">
        <p class="exam-card__details-label">Материалы</p>
        <ul>
          <li v-for="file in item.materials" :key="file.name">{{ file.name }}</li>
        </ul>
      </div>

      <div v-if="item.recommendations" class="exam-card__block">
        <p class="exam-card__details-label">Рекомендации</p>
        <p class="exam-card__description">{{ item.recommendations }}</p>
      </div>

      <div
        v-if="item.teacherComment"
        class="exam-card__comment"
      >
        <p class="exam-card__details-label">Комментарий преподавателя</p>
        <p>{{ item.teacherComment }}</p>
      </div>

      <p v-if="item.uploadedFileName" class="exam-card__file">
        Файл работы: {{ item.uploadedFileName }}
        <template v-if="item.submittedLabel"> · загружен {{ item.submittedLabel }}</template>
      </p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.exam-card {
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

  &--expanded {
    box-shadow: $shadow-card;
    border-color: $color-primary-muted;
  }

  &--critical {
    border-color: $color-error-light;
  }

  &--approaching {
    border-color: $color-warning-light;
  }

  &__summary {
    display: flex;
    align-items: flex-start;
    gap: $space-4;
    width: 100%;
    padding: $space-4;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    color: inherit;

    &:focus-visible {
      @include focus-ring;
    }
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

  &__chips {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-2;
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

  &__grade--excellent {
    color: $color-success;
  }

  &__grade--good {
    color: $color-primary;
  }

  &__grade--ok {
    color: $color-warning;
  }

  &__grade--bad {
    color: $color-error;
  }

  &__grade--muted {
    color: $color-text-muted;
  }

  &__score {
    flex-shrink: 0;
    min-width: 2.5rem;
    margin-top: $space-1;
    text-align: center;
    font-size: 1.75rem;
    font-weight: $font-weight-bold;
    line-height: 1;
    letter-spacing: -0.02em;

    &--excellent {
      color: $color-success;
    }

    &--good {
      color: $color-primary;
    }

    &--ok {
      color: $color-warning;
    }

    &--bad {
      color: $color-error;
    }

    &--muted {
      color: $color-text-muted;
      font-size: $font-size-base;
    }
  }

  &__chevron {
    flex-shrink: 0;
    margin-top: $space-1;
    color: $color-text-muted;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
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

  &__deadline-date {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__deadline-hint {
    margin: 0;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    color: inherit;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: $space-2;
    margin-left: auto;
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

  &__details {
    display: flex;
    flex-direction: column;
    gap: $space-3;
    padding: 0 $space-4 $space-4;
  }

  &__description {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__details-label {
    margin: 0 0 $space-1;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $color-text-muted;
  }

  &__materials ul {
    margin: 0;
    padding-left: $space-5;
    font-size: $font-size-sm;
    color: $color-text-primary;
  }

  &__comment {
    padding: $space-3;
    border-radius: $radius-md;
    background-color: $color-bg-muted;
    font-size: $font-size-sm;
    color: $color-text-secondary;

    p:last-child {
      margin: 0;
    }
  }

  &__file {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
}

@media (max-width: 640px) {
  .exam-card {
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

    &__score {
      min-width: 2rem;
      font-size: 1.5rem;
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
  }
}
</style>
