<script setup>
import { nextTick, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useRating } from '@/modules/rating/composables/useRating.js'
import RatingToolbar from '@/modules/rating/components/RatingToolbar.vue'
import RatingHero from '@/modules/rating/components/RatingHero.vue'
import RatingTable from '@/modules/rating/components/RatingTable.vue'
import RatingMotivation from '@/modules/rating/components/RatingMotivation.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const tableEl = ref(null)

const {
  period,
  periodLabel,
  periodHint,
  isCurrentPeriod,
  rankedStudents,
  leaders,
  currentStudent,
  total,
  dynamics,
  progressItems,
  formulaTooltip,
  fullListOpen,
  mobileDetailsOpen,
  setPeriod,
  toggleFullList,
  showFullList,
  toggleMobileDetails,
} = useRating()

async function onShowFullList() {
  showFullList()
  await nextTick()
  tableEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Рейтинг' }]"
    active-route="rating"
  >
    <div class="rating-view">
      <RatingToolbar
        :period="period"
        :period-label="periodLabel"
        :is-current-period="isCurrentPeriod"
        :formula-tooltip="formulaTooltip"
        @update:period="setPeriod"
      />

      <RatingHero
        :rank="currentStudent?.rank ?? 0"
        :total="total"
        :points="currentStudent?.points ?? 0"
        :period-hint="periodHint"
        :formula-tooltip="formulaTooltip"
        :dynamics="dynamics"
        :progress-items="progressItems"
        :leaders="leaders"
        :full-list-open="fullListOpen"
        :mobile-details-open="mobileDetailsOpen"
        @toggle-full-list="toggleFullList"
        @show-full-list="onShowFullList"
        @toggle-mobile-details="toggleMobileDetails"
      />

      <div v-if="fullListOpen" ref="tableEl">
        <RatingTable :rows="rankedStudents" :period-label="periodLabel" />
      </div>

      <RatingMotivation
        :rank="currentStudent?.rank ?? 0"
        :total="total"
        :grades-share="currentStudent?.gradesShare ?? 0"
        :homework-share="currentStudent?.homeworkShare ?? 0"
        :homework-percent="currentStudent?.homeworkPercent ?? 0"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.rating-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

@media (max-width: 720px) {
  .rating-view {
    padding: $space-4;
    gap: $space-4;
  }
}
</style>
