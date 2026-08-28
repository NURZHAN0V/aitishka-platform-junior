<script setup>
import AppLayout from '@/core/layouts/AppLayout.vue'

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'Маркет' }]"
    active-route="market"
  />
</template>
