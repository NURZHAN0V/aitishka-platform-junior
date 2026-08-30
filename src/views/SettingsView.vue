<script setup>
import { watch } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useToast } from '@/core/composables/useToast'
import { useSettings } from '@/modules/settings/composables/useSettings.js'
import SettingsHintCard from '@/modules/settings/components/SettingsHintCard.vue'
import SettingsLinkedAccountsCard from '@/modules/settings/components/SettingsLinkedAccountsCard.vue'
import ProfilePhotoCard from '@/modules/profile/components/ProfilePhotoCard.vue'
import ProfilePhotoUploadModal from '@/modules/profile/components/ProfilePhotoUploadModal.vue'
import ProfileAvatarGenerateModal from '@/modules/profile/components/ProfileAvatarGenerateModal.vue'

const toast = useToast()

const {
  profile,
  hint,
  photoMeta,
  avatarUrl,
  canUpload,
  showRejectReason,
  uploadOpen,
  generateOpen,
  uploading,
  generating,
  variant,
  lastBonusAwarded,
  bonusAmount,
  providers,
  linked,
  toggle,
  openUpload,
  closeUpload,
  openGenerate,
  closeGenerate,
  refreshVariant,
  submitPhoto,
  selectGeneratedAvatar,
} = useSettings()

watch(lastBonusAwarded, (awarded) => {
  if (awarded) {
    toast.success(`Фото одобрено! +${bonusAmount} монеток`)
    lastBonusAwarded.value = false
  }
})

function onLinkedToggle(providerId) {
  const provider = providers.find((item) => item.id === providerId)
  const bound = toggle(providerId)
  if (bound == null || !provider) return
  toast.success(bound ? `${provider.name} привязан` : `${provider.name} отвязан`)
}

async function onPhotoSubmit(file) {
  const ok = await submitPhoto(file)
  if (ok) toast.info('Фото отправлено на проверку')
}

async function onAvatarSelect(seed) {
  const ok = await selectGeneratedAvatar(seed)
  if (ok) toast.success('Аватарка сохранена')
}
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Настройки аккаунта' }]"
    active-route="settings"
  >
    <div class="settings-view">
      <div class="settings-view__grid">
        <div class="settings-view__main">
          <ProfilePhotoCard
            :full-name="profile.fullName"
            :group="profile.group"
            :avatar-url="avatarUrl"
            :photo-status="profile.photo.status"
            :photo-label="photoMeta.label"
            :photo-hint="photoMeta.hint"
            :photo-chip="photoMeta.chip"
            :reject-reason="showRejectReason ? profile.photo.rejectReason : ''"
            :can-upload="canUpload"
            :show-group="false"
            upload-disabled-reason="Фото на проверке — новое загрузить нельзя"
            @upload="openUpload"
            @generate="openGenerate"
          />

          <SettingsLinkedAccountsCard
            :providers="providers"
            :linked="linked"
            @toggle="onLinkedToggle"
          />
        </div>

        <SettingsHintCard
          :title="hint.title"
          :text="hint.text"
          :profile-cta="hint.profileCta"
        />
      </div>
    </div>

    <ProfilePhotoUploadModal
      :model-value="uploadOpen"
      :uploading="uploading"
      @update:model-value="(open) => (open ? openUpload() : closeUpload())"
      @submit="onPhotoSubmit"
    />

    <ProfileAvatarGenerateModal
      :model-value="generateOpen"
      :variant="variant"
      :generating="generating"
      :full-name="profile.fullName"
      @update:model-value="(open) => (open ? openGenerate() : closeGenerate())"
      @select="onAvatarSelect"
      @refresh="refreshVariant"
    />
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.settings-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

.settings-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.8fr);
  gap: $space-5;
  align-items: start;
}

.settings-view__main {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  min-width: 0;
}

@media (max-width: 900px) {
  .settings-view__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .settings-view {
    padding: $space-4;
    gap: $space-4;
  }

  .settings-view__main {
    gap: $space-4;
  }
}
</style>
