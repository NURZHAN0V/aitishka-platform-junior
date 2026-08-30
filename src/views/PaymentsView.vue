<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'
import { useToast } from '@/core/composables/useToast'
import { usePayments } from '@/modules/payments/composables/usePayments.js'
import PaymentsRequisites from '@/modules/payments/components/PaymentsRequisites.vue'
import PaymentsSchedule from '@/modules/payments/components/PaymentsSchedule.vue'
import PaymentsHistory from '@/modules/payments/components/PaymentsHistory.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const toast = useToast()

const {
  requisitesFields,
  scheduleRows,
  historyRows,
  hasDebt,
  debtLabel,
  debtAbsoluteLabel,
  isScheduleEmpty,
  isHistoryEmpty,
  copyField,
  copyAllRequisites,
} = usePayments()

async function onCopyField(field) {
  const ok = await copyField(field.value)
  if (ok) toast.success(`Скопировано: ${field.label}`)
  else toast.error('Не удалось скопировать')
}

async function onCopyAll() {
  const ok = await copyAllRequisites()
  if (ok) toast.success('Реквизиты скопированы')
  else toast.error('Не удалось скопировать')
}
</script>

<template>
  <AppLayout
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Платежи' }]"
    active-route="payments"
  >
    <div class="payments-view">
      <div class="payments-view__grid">
        <PaymentsSchedule
          :rows="scheduleRows"
          :is-empty="isScheduleEmpty"
          :has-debt="hasDebt"
          :debt-label="debtLabel"
          :debt-absolute-label="debtAbsoluteLabel"
        />

        <PaymentsHistory
          :rows="historyRows"
          :is-empty="isHistoryEmpty"
        />
      </div>

      <PaymentsRequisites
        :fields="requisitesFields"
        @copy-field="onCopyField"
        @copy-all="onCopyAll"
      />
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.payments-view {
  display: flex;
  flex-direction: column;
  gap: $space-5;
  padding: $space-4 $space-5 $space-8;
}

.payments-view__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-5;
  align-items: stretch;
}

@media (max-width: 720px) {
  .payments-view {
    padding: $space-4;
    gap: $space-4;
  }

  .payments-view__grid {
    grid-template-columns: 1fr;
    gap: $space-4;
  }
}
</style>
