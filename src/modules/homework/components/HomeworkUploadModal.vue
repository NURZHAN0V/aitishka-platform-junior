<script setup>
import { ref, watch } from 'vue'
import { BaseButton, BaseFileUpload, BaseModal } from '@/core/components/ui'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  assignment: { type: Object, default: null },
  uploading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const file = ref(null)
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      file.value = null
      error.value = ''
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function onError(message) {
  error.value = message || ''
}

function send() {
  if (!file.value) {
    error.value = 'Выберите файл'
    return
  }
  emit('submit', file.value)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="assignment ? `Загрузить задание · ${assignment.title}` : 'Загрузить задание'"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p v-if="assignment?.topic" class="homework-upload__topic">Тема: {{ assignment.topic }}</p>
    <BaseFileUpload
      v-model="file"
      :uploading="uploading"
      @error="onError"
    />
    <p v-if="error" class="homework-upload__error" role="alert">{{ error }}</p>

    <template #footer>
      <BaseButton variant="secondary" :disabled="uploading" @click="close">
        Отмена
      </BaseButton>
      <BaseButton variant="primary" :disabled="uploading || !file" @click="send">
        Отправить
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.homework-upload {
  &__topic {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__error {
    margin: $space-3 0 0;
    font-size: $font-size-sm;
    color: $color-error;
  }
}
</style>
