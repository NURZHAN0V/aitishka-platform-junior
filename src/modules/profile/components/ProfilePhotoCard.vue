<script setup>
import { BaseAvatar, BaseButton, BaseCard, BaseChip, BaseTooltip } from '@/core/components/ui'

defineProps({
  fullName: { type: String, required: true },
  group: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  photoStatus: { type: String, default: 'none' },
  photoLabel: { type: String, default: '' },
  photoHint: { type: String, default: '' },
  photoChip: { type: String, default: null },
  rejectReason: { type: String, default: '' },
  canUpload: { type: Boolean, default: true },
  uploadDisabledReason: { type: String, default: '' },
  showGroup: { type: Boolean, default: true },
  /** false — только просмотр (как в «Мой профиль»); действия — в настройках */
  editable: { type: Boolean, default: true },
})

defineEmits(['upload', 'generate'])
</script>

<template>
  <BaseCard padding="md" class="profile-photo">
    <template #title>Фото</template>

    <div class="profile-photo__body">
      <BaseAvatar
        :src="avatarUrl"
        :name="fullName"
        size="xl"
        class="profile-photo__avatar"
      />

      <div class="profile-photo__info">
        <div class="profile-photo__status-row">
          <BaseChip v-if="photoChip" :variant="photoChip" size="sm">
            {{ photoLabel }}
          </BaseChip>
          <span v-else class="profile-photo__empty-label">{{ photoLabel }}</span>
        </div>

        <p class="profile-photo__hint">{{ photoHint }}</p>

        <p v-if="rejectReason" class="profile-photo__reject" role="status">
          Причина: {{ rejectReason }}
        </p>

        <p v-if="showGroup && group" class="profile-photo__group">{{ group }}</p>

        <div v-if="editable" class="profile-photo__actions">
          <BaseTooltip
            v-if="!canUpload"
            :text="uploadDisabledReason || 'Фото на проверке'"
          >
            <BaseButton variant="secondary" size="sm" icon="upload-01" disabled>
              Загрузить фото
            </BaseButton>
          </BaseTooltip>
          <BaseButton
            v-else
            variant="secondary"
            size="sm"
            icon="upload-01"
            @click="$emit('upload')"
          >
            {{ photoStatus === 'none' ? 'Загрузить фото' : 'Заменить фото' }}
          </BaseButton>

          <BaseButton
            variant="secondary"
            size="sm"
            icon="user"
            @click="$emit('generate')"
          >
            Сгенерировать
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.profile-photo[class] {
  border: none;
  box-shadow: none;
}

.profile-photo {
  &__body {
    display: flex;
    align-items: flex-start;
    gap: $space-5;
    flex-wrap: wrap;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-2;
    min-width: 0;
    flex: 1;
  }

  &__status-row {
    display: flex;
    align-items: center;
    gap: $space-2;
  }

  &__empty-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
  }

  &__hint {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__reject {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-error;
    line-height: $line-height-base;
  }

  &__group {
    margin: 0 0 $space-1;
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
    margin-top: $space-1;
  }
}
</style>
