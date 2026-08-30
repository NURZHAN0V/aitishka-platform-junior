<script setup>
import { watch } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useToast } from '@/core/composables/useToast'
import { useProfile } from '@/modules/profile/composables/useProfile.js'
import ProfileFieldsCard from '@/modules/profile/components/ProfileFieldsCard.vue'
import ProfileCompletenessCard from '@/modules/profile/components/ProfileCompletenessCard.vue'

const toast = useToast()

const {
  profile,
  bonusAmount,
  avatarUrl,
  birthDateLabel,
  photoGiftPending,
  photoGiftEarned,
  lastBonusAwarded,
} = useProfile()

watch(lastBonusAwarded, (awarded) => {
  if (awarded) {
    toast.success(`Фото одобрено! +${bonusAmount} монеток`)
    lastBonusAwarded.value = false
  }
})
</script>

<template>
  <AppLayout
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Мой профиль' }]"
    active-route="profile"
  >
    <div class="profile-view">
      <div class="profile-view__grid">
        <div class="profile-view__main">
          <ProfileFieldsCard
            :full-name="profile.fullName"
            :group="profile.group"
            :avatar-url="avatarUrl"
            :school="profile.school"
            :phone="profile.phone"
            :email="profile.email"
            :birth-date-label="birthDateLabel"
          />
        </div>

        <aside class="profile-view__side">
          <ProfileCompletenessCard
            :gift-pending="photoGiftPending"
            :gift-earned="photoGiftEarned"
            :bonus-amount="bonusAmount"
          />
        </aside>
      </div>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.profile-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

.profile-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 370px);
  gap: $space-5;
  align-items: start;
}

.profile-view__main,
.profile-view__side {
  min-width: 0;
}

.profile-view__side {
  max-width: 370px;
  justify-self: stretch;
}

@media (max-width: 900px) {
  .profile-view__grid {
    grid-template-columns: 1fr;
  }

  .profile-view__side {
    max-width: none;
  }
}

@media (max-width: 720px) {
  .profile-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
