<script setup>
import { BaseButton, BaseModal } from '@/core/components/ui'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  modeLabel: {
    type: String,
    default: '',
  },
  stats: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'again', 'finish'])
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Результат партии"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p v-if="modeLabel" class="keyland-result__mode">{{ modeLabel }}</p>
    <p v-if="stats.abandoned" class="keyland-result__note">Партия завершена досрочно</p>

    <dl class="keyland-result__grid">
      <div>
        <dt>Время</dt>
        <dd>{{ stats.elapsedLabel || '00:00' }}</dd>
      </div>
      <div>
        <dt>Набрано</dt>
        <dd>{{ stats.correct ?? 0 }}</dd>
      </div>
      <div>
        <dt>Скорость</dt>
        <dd>{{ stats.speed ?? 0 }} зн/мин</dd>
      </div>
      <div>
        <dt>Точность</dt>
        <dd>{{ stats.accuracy ?? 100 }}%</dd>
      </div>
    </dl>

    <template #footer>
      <div class="keyland-result__actions">
        <BaseButton variant="secondary" @click="emit('finish')">Завершить</BaseButton>
        <BaseButton variant="primary" @click="emit('again')">Ещё раз</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.keyland-result__mode {
  margin: 0 0 $space-2;
  color: $color-text-secondary;
}

.keyland-result__note {
  margin: 0 0 $space-3;
  font-size: $font-size-sm;
  color: $color-warning;
}

.keyland-result__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
  margin: $space-4 0 0;

  dt {
    margin: 0 0 $space-1;
    font-size: $font-size-sm;
    color: $color-text-muted;
  }

  dd {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
}

.keyland-result__actions {
  display: flex;
  justify-content: flex-end;
  gap: $space-3;
  width: 100%;
  flex-wrap: nowrap;
}
</style>
